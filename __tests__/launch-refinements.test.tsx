import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { useStore } from '../src/store';
import { JORDAN_GOVERNORATE_AREAS } from '../src/constants/shipping';
import DropShowcase from '../src/components/DropShowcase';
import Modals from '../src/components/Modals';
import fs from 'fs';
import path from 'path';

describe('Launch Refinements & Truthful Experience Suite', () => {
  beforeAll(() => {
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: jest.fn().mockImplementation((query) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: jest.fn(),
        removeListener: jest.fn(),
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
      })),
    });
  });

  beforeEach(() => {
    useStore.setState({
      lang: 'ar',
      currency: 'JOD',
      cart: [],
      isCartOpen: false,
      shippingQuote: null,
      shippingDestination: {
        countryCode: 'JO',
        countryNameAr: 'الأردن',
        countryNameEn: 'Jordan',
        governorateId: 'amman',
        city: 'عمّان',
        postalCode: '11118',
        addressLine1: '',
        phone: '',
      },
    });
  });

  describe('1. Language Persistence & Direction', () => {
    it('persists lang in storage partialize', () => {
      const persistOptions = (useStore as any).persist?.getOptions?.();
      expect(persistOptions).toBeDefined();
      
      const sampleState = {
        cart: [],
        currency: 'USD' as const,
        theme: 'dark' as const,
        shippingDestination: { countryCode: 'AE' },
        lang: 'en' as const,
      };

      const partialized = persistOptions.partialize(sampleState);
      expect(partialized.lang).toBe('en');
      expect(partialized.currency).toBe('USD');
    });

    it('updates document.documentElement lang and dir on setLang', () => {
      useStore.getState().setLang('en');
      expect(document.documentElement.lang).toBe('en');
      expect(document.documentElement.dir).toBe('ltr');

      useStore.getState().setLang('ar');
      expect(document.documentElement.lang).toBe('ar');
      expect(document.documentElement.dir).toBe('rtl');
    });
  });

  describe('2. Intentional Size Selection in DropShowcase', () => {
    it('shows accessible inline warning when Add to Bag is clicked without choosing a size', () => {
      render(<DropShowcase lang="ar" />);

      // Find the first Add to Bag button
      const addButtons = screen.getAllByRole('button', { name: /أضف إلى الحقيبة/i });
      expect(addButtons.length).toBeGreaterThan(0);

      // Initially no error
      expect(screen.queryByText(/الرجاء اختيار المقاس أولاً لإضافته إلى الحقيبة/i)).toBeNull();

      // Click Add to Bag without selecting a size
      fireEvent.click(addButtons[0]);

      // Error banner must appear
      expect(screen.getByText(/الرجاء اختيار المقاس أولاً لإضافته إلى الحقيبة/i)).toBeInTheDocument();

      // Click size 'M'
      const sizeMButtons = screen.getAllByRole('button', { name: /Size M/i });
      fireEvent.click(sizeMButtons[0]);

      // Error banner should be cleared
      expect(screen.queryByText(/الرجاء اختيار المقاس أولاً لإضافته إلى الحقيبة/i)).toBeNull();
    });
  });

  describe('3. Truthful Manual-Confirmation Cart & WhatsApp Message', () => {
    it('generates decoded WhatsApp message for Amman in JOD matching truthful confirmation rules', () => {
      useStore.setState({
        lang: 'ar',
        currency: 'JOD',
        isCartOpen: true,
        cart: [
          {
            id: 'drop-helmet-white-L',
            productTitle: 'تيشيرت خوذة الكوفية — أبيض',
            size: 'L',
            garment: 'tshirt',
            price: 35,
            priceUSD: 50,
            quantity: 1,
            color: 'offwhite',
            placement: 'back',
            artMode: 'presets',
            isPrePrinted: true,
          },
        ],
        shippingQuote: {
          success: true,
          mode: 'mock',
          quoteReference: 'MID-SIM-TEST1',
          timestamp: new Date().toISOString(),
          options: [
            {
              serviceCode: 'OND',
              serviceNameAr: 'توصيل محلي (الأردن)',
              serviceNameEn: 'Domestic Delivery (Jordan)',
              productGroup: 'DOM',
              shippingFee: 2.5,
              currency: 'JOD',
              estimatedDays: '1 - 2 أيام عمل',
              chargeableWeightKg: 0.5,
              isConfirmed: false,
              customsIncluded: true,
              additionalCharges: 0,
            },
          ],
          selectedOption: {
            serviceCode: 'OND',
            serviceNameAr: 'توصيل محلي (الأردن)',
            serviceNameEn: 'Domestic Delivery (Jordan)',
            productGroup: 'DOM',
            shippingFee: 2.5,
            currency: 'JOD',
            estimatedDays: '1 - 2 أيام عمل',
            chargeableWeightKg: 0.5,
            isConfirmed: false,
            customsIncluded: true,
            additionalCharges: 0,
          },
        },
      });

      render(<Modals />);

      const waLink = screen.getByRole('link', { name: /إرسال الطلب للتأكيد عبر واتساب/i });
      expect(waLink).toBeInTheDocument();

      const href = waLink.getAttribute('href') || '';
      expect(href).toContain('https://wa.me/962770125316?text=');

      const urlObj = new URL(href);
      const decodedMsg = urlObj.searchParams.get('text') || '';

      // Must include merchandise subtotal labeled as not including delivery
      expect(decodedMsg).toContain('قيمة المنتجات (لا تشمل التوصيل)');
      // Must include estimated delivery fee
      expect(decodedMsg).toContain('تكلفة التوصيل (تقديرية)');
      // Must label total as estimated total
      expect(decodedMsg).toContain('المجموع التقديري');
      // Must include confirmation note before payment
      expect(decodedMsg).toContain('يؤكد فريق ميدان تكلفة التوصيل وتوفر المقاس قبل الدفع');
      // Must NOT include the confusing additional charges line
      expect(decodedMsg).not.toContain('الرسوم الإضافية المؤكدة: 0');
      // Must NOT include customs line for Jordan domestic
      expect(decodedMsg).not.toContain('الرسوم الجمركية');
    });

    it('generates decoded WhatsApp message for Dubai in USD with customs excluded', () => {
      useStore.setState({
        lang: 'en',
        currency: 'USD',
        isCartOpen: true,
        cart: [
          {
            id: 'drop-poster-white-XL',
            productTitle: 'Palestine Poster Tee — White',
            size: 'XL',
            garment: 'tshirt',
            price: 35,
            priceUSD: 50,
            quantity: 1,
            color: 'offwhite',
            placement: 'back',
            artMode: 'presets',
            isPrePrinted: true,
          },
        ],
        shippingDestination: {
          countryCode: 'AE',
          countryNameAr: 'الإمارات العربية المتحدة',
          countryNameEn: 'United Arab Emirates',
          city: 'Dubai',
          postalCode: '',
          addressLine1: 'Downtown Dubai',
          phone: '+971500000000',
        },
        shippingQuote: {
          success: true,
          mode: 'mock',
          quoteReference: 'MID-SIM-TEST2',
          timestamp: new Date().toISOString(),
          options: [
            {
              serviceCode: 'PPX',
              serviceNameAr: 'شحن دولي إكسبريس',
              serviceNameEn: 'Express International Shipping',
              productGroup: 'EXP',
              shippingFee: 16.92,
              currency: 'USD',
              estimatedDays: '2 - 4 business days',
              chargeableWeightKg: 0.5,
              isConfirmed: false,
              customsIncluded: false,
              additionalCharges: 0,
            },
          ],
          selectedOption: {
            serviceCode: 'PPX',
            serviceNameAr: 'شحن دولي إكسبريس',
            serviceNameEn: 'Express International Shipping',
            productGroup: 'EXP',
            shippingFee: 16.92,
            currency: 'USD',
            estimatedDays: '2 - 4 business days',
            chargeableWeightKg: 0.5,
            isConfirmed: false,
            customsIncluded: false,
            additionalCharges: 0,
          },
        },
      });

      render(<Modals />);

      const waLink = screen.getByRole('link', { name: /Request confirmation via WhatsApp/i });
      expect(waLink).toBeInTheDocument();

      const href = waLink.getAttribute('href') || '';
      const urlObj = new URL(href);
      const decodedMsg = urlObj.searchParams.get('text') || '';

      // Items subtotal
      expect(decodedMsg).toContain('Items subtotal (delivery not included): 50.00 USD');
      // Delivery fee
      expect(decodedMsg).toContain('Delivery fee (estimated): 16.92 USD');
      // Destination customs excluded
      expect(decodedMsg).toContain('Customs & destination taxes: Excluded (payable upon arrival)');
      // Estimated total
      expect(decodedMsg).toContain('Estimated total: 66.92 USD');
      // Confirmation note
      expect(decodedMsg).toContain('The Midaan team confirms delivery fees and size availability before payment');
      // Does not claim confirmed zero additional charges
      expect(decodedMsg).not.toContain('Confirmed Additional Charges: 0');
    });
  });

  describe('4. Jordan Governorate Areas', () => {
    it('includes "منطقة أخرى / Other area" in all 12 governorates', () => {
      expect(JORDAN_GOVERNORATE_AREAS.length).toBe(12);
      for (const gov of JORDAN_GOVERNORATE_AREAS) {
        const hasOther = gov.cities.some(
          (c) => c.nameAr === 'منطقة أخرى' && c.nameEn === 'Other area'
        );
        expect(hasOther).toBe(true);
      }
    });
  });

  describe('5. Truthful Copy & Typo Regression Check', () => {
    it('verifies about page contains "قطعاً" and eliminates typo "قطيعاً"', () => {
      const aboutFilePath = path.join(process.cwd(), 'src/app/about/page.tsx');
      const content = fs.readFileSync(aboutFilePath, 'utf8');

      // Regression: Must not have typo 'قطيعاً حرفية'
      expect(content).not.toContain('قطيعاً حرفية');
      expect(content).not.toContain('قطيعا');

      // Must have truthful phrasing
      expect(content).toContain('قطعاً حرفية محدودة');
      expect(content).toContain('عمّان');
      expect(content).toContain('إندونيسي');
      expect(content).toContain('260');
    });
  });
});
