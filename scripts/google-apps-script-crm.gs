/**
 * Google Apps Script — Midaan Store Orders CRM & Inventory Automation
 * File: Code.gs (Save inside Google Sheets > Extensions > Apps Script)
 *
 * Spreadsheet Structure Supported:
 * 1. 'Orders_CRM' (Orders Log)
 * 2. 'Inventory_Tracker' (Real-time stock decrement)
 * 3. 'Launch_SEO_Marketing'
 * 4. 'Size_Chart_Specs'
 */

// Exact Column Headers matching Orders_CRM
var ORDER_COLUMNS = [
  'Order_ID',
  'Timestamp',
  'Customer_Name',
  'Phone_WhatsApp',
  'Delivery_Scope',
  'Country_or_Governorate',
  'City_or_Area',
  'Detailed_Address',
  'Items_Summary',
  'Product_IDs',
  'Sizes',
  'Total_Qty',
  'Currency',
  'Items_Subtotal',
  'Delivery_Fee',
  'Grand_Total',
  'Payment_Preference',
  'Order_Status',
  'Ad_Audience_Segment',
  'Notes'
];

/**
 * Health Check & Deployment Test
 */
function doGet(e) {
  return ContentService.createTextOutput(JSON.stringify({
    status: 'online',
    service: 'Midaan Store Orders CRM Webhook',
    timestamp: new Date().toISOString()
  })).setMimeType(ContentService.MimeType.JSON);
}

/**
 * Handle Order Webhook POST
 */
function doPost(e) {
  var lock = LockService.getScriptLock();
  // Wait up to 10 seconds for concurrent order executions
  var lockAcquired = lock.tryLock(10000);

  try {
    if (!e || !e.postData || !e.postData.contents) {
      return responseJson({ success: false, error: 'Empty payload' }, 400);
    }

    var data;
    try {
      data = JSON.parse(e.postData.contents);
    } catch (parseErr) {
      return responseJson({ success: false, error: 'Invalid JSON', details: parseErr.toString() }, 400);
    }

    var ss = SpreadsheetApp.getActiveSpreadsheet();

    // 1. Log into Orders_CRM
    var ordersSheet = getOrCreateSheet(ss, 'Orders_CRM', ORDER_COLUMNS);
    var rowData = mapPayloadToRow(data);
    ordersSheet.appendRow(rowData);

    // Format new row styling
    var lastRow = ordersSheet.getLastRow();
    ordersSheet.getRange(lastRow, 1, 1, ORDER_COLUMNS.length)
      .setFontFamily('Arial')
      .setFontSize(10)
      .setVerticalAlignment('middle');

    // 2. Decrement Inventory in Inventory_Tracker (if sheet exists)
    try {
      updateInventory(ss, data);
    } catch (invErr) {
      Logger.log('Inventory update warning: ' + invErr.toString());
    }

    return responseJson({
      success: true,
      orderId: data.Order_ID || data.orderId || 'UNKNOWN',
      row: lastRow,
      timestamp: new Date().toISOString()
    }, 200);

  } catch (err) {
    Logger.log('doPost Error: ' + err.toString());
    return responseJson({ success: false, error: err.toString() }, 500);
  } finally {
    if (lockAcquired) {
      lock.releaseLock();
    }
  }
}

/**
 * Maps incoming JSON data to exact columns of Orders_CRM
 */
function mapPayloadToRow(data) {
  var now = new Date();
  var timestampStr = Utilities.formatDate(now, Session.getScriptTimeZone() || 'Asia/Amman', 'yyyy-MM-dd HH:mm:ss');

  var orderId = data.Order_ID || data.orderId || ('ORD-' + now.getTime());
  var customerName = data.Customer_Name || data.customerName || '';
  var phone = data.Phone_WhatsApp || data.phone || '';
  var deliveryScope = data.Delivery_Scope || data.deliveryScope || '';
  var countryOrGov = data.Country_or_Governorate || data.countryOrGov || '';
  var cityOrArea = data.City_or_Area || data.cityOrArea || '';
  var address = data.Detailed_Address || data.address || '';
  var itemsSummary = data.Items_Summary || data.itemsSummary || '';
  var productIds = data.Product_IDs || data.productIds || '';
  var sizes = data.Sizes || data.sizes || '';
  var totalQty = data.Total_Qty || data.totalQty || 1;
  var currency = data.Currency || data.currency || 'JOD';
  var subtotal = data.Items_Subtotal || data.subtotal || 0;
  var deliveryFee = data.Delivery_Fee || data.deliveryFee || 'Confirmed via WhatsApp';
  var grandTotal = data.Grand_Total || data.grandTotal || subtotal;
  var paymentPreference = data.Payment_Preference || data.paymentMethod || '';
  var orderStatus = data.Order_Status || 'Pending';
  var audienceSegment = data.Ad_Audience_Segment || data.audienceTag || 'Drop01_Lead';
  var notes = data.Notes || data.notes || '';

  return [
    orderId,
    timestampStr,
    customerName,
    "'" + phone, // Prefix with ' to preserve leading + or 0 in spreadsheet
    deliveryScope,
    countryOrGov,
    cityOrArea,
    address,
    itemsSummary,
    productIds,
    sizes,
    totalQty,
    currency,
    subtotal,
    deliveryFee,
    grandTotal,
    paymentPreference,
    orderStatus,
    audienceSegment,
    notes
  ];
}

/**
 * Decrements Remaining_Stock and increments Sold_Qty in Inventory_Tracker
 */
function updateInventory(ss, data) {
  var invSheet = ss.getSheetByName('Inventory_Tracker');
  if (!invSheet) return;

  var values = invSheet.getDataRange().getValues();
  if (values.length < 2) return;

  var headers = values[0].map(function(h) { return String(h).trim().toLowerCase(); });
  var prodIdCol = headers.indexOf('product_id') !== -1 ? headers.indexOf('product_id') : headers.indexOf('product id');
  var sizeCol = headers.indexOf('size') !== -1 ? headers.indexOf('size') : headers.indexOf('variant');
  var soldCol = headers.indexOf('sold_qty') !== -1 ? headers.indexOf('sold_qty') : headers.indexOf('sold');
  var remainingCol = headers.indexOf('remaining_stock') !== -1 ? headers.indexOf('remaining_stock') : headers.indexOf('stock');

  if (prodIdCol === -1 || sizeCol === -1) return;

  var prodIds = String(data.Product_IDs || data.productIds || '').split(',').map(function(s) { return s.trim(); });
  var sizes = String(data.Sizes || data.sizes || '').split(',').map(function(s) { return s.trim(); });

  for (var i = 0; i < prodIds.length; i++) {
    var targetPid = prodIds[i];
    var targetSize = sizes[i] || sizes[0] || '';

    for (var r = 1; r < values.length; r++) {
      var rowPid = String(values[r][prodIdCol]).trim();
      var rowSize = String(values[r][sizeCol]).trim();

      if (normalizeMatch(rowPid, targetPid) && normalizeSizeMatch(rowSize, targetSize)) {
        if (soldCol !== -1) {
          var currentSold = Number(values[r][soldCol]) || 0;
          invSheet.getRange(r + 1, soldCol + 1).setValue(currentSold + 1);
        }
        if (remainingCol !== -1) {
          var currentRemaining = Number(values[r][remainingCol]) || 0;
          var newRemaining = Math.max(0, currentRemaining - 1);
          invSheet.getRange(r + 1, remainingCol + 1).setValue(newRemaining);
        }
        break;
      }
    }
  }
}

function normalizeMatch(a, b) {
  return a.toLowerCase().replace(/[^a-z0-9]/g, '') === b.toLowerCase().replace(/[^a-z0-9]/g, '');
}

function normalizeSizeMatch(a, b) {
  var s1 = a.toUpperCase().replace('XXL', '2XL');
  var s2 = b.toUpperCase().replace('XXL', '2XL');
  return s1 === s2;
}

function getOrCreateSheet(ss, sheetName, headers) {
  var sheet = ss.getSheetByName(sheetName);
  if (!sheet) {
    sheet = ss.insertSheet(sheetName);
    sheet.appendRow(headers);
    sheet.getRange(1, 1, 1, headers.length)
      .setBackground('#1A1A1A')
      .setFontColor('#FFFFFF')
      .setFontWeight('bold')
      .setHorizontalAlignment('center');
    sheet.setFrozenRows(1);
  }
  return sheet;
}

function responseJson(obj, code) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
