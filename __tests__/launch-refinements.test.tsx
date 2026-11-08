import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
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
        shippingQuote: null,
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
      // Must include delivery fee marked as confirmed via WhatsApp before payment
      expect(decodedMsg).toContain('رسوم التوصيل: تُؤكد عبر واتساب قبل الدفع');
      // Must NOT include fake mock prices or mock refs
      expect(decodedMsg).not.toContain('MID-SIM');
      expect(decodedMsg).not.toContain('٢٫٥٠ د.أ');
      // Must NOT duplicate merchandise subtotal as total
      expect(decodedMsg).not.toContain('المجموع التقديري:');
      // Must include confirmation note before payment
      expect(decodedMsg).toContain('يؤكد فريق ميدان تكلفة التوصيل وتوفر المقاس قبل الدفع');
      // Must NOT include customs line for Jordan domestic
      expect(decodedMsg).not.toContain('الرسوم الجمركية');
    });

    it('generates decoded WhatsApp message for Dubai in USD with customs excluded and no mock fee', () => {
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
        shippingQuote: null,
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
      expect(decodedMsg).toContain('Delivery fee: Confirmed via WhatsApp before payment');
      // Destination customs excluded
      expect(decodedMsg).toContain('Customs & destination taxes: Excluded (payable upon arrival)');
      // Must NOT include fake mock price or mock ref
      expect(decodedMsg).not.toContain('16.92');
      expect(decodedMsg).not.toContain('MID-SIM');
      // Must NOT duplicate subtotal as total
      expect(decodedMsg).not.toContain('Estimated total:');
      // Confirmation note
      expect(decodedMsg).toContain('The Midaan team confirms delivery fees and size availability before payment');
    });

    it('renders cart drawer breakdown with explicit notice and no duplicate total line', () => {
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
      });

      render(<Modals />);

      // Shows subtotal label
      expect(screen.getByText('قيمة المنتجات — لا تشمل التوصيل')).toBeInTheDocument();
      // Shows delivery fee label
      expect(screen.getByText('رسوم التوصيل')).toBeInTheDocument();
      // Shows manual confirmation notice
      expect(screen.getByText('تُؤكد عبر واتساب قبل الدفع')).toBeInTheDocument();
      // Must not render duplicate total header
      expect(screen.queryByText('المجموع التقديري')).toBeNull();
      // The WhatsApp order action button is immediately available
      const actionButton = screen.getByRole('link', { name: /إرسال الطلب للتأكيد عبر واتساب/i });
      expect(actionButton).toBeInTheDocument();
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

  describe('5. Truthful Copy & Unverified Claims Removal', () => {
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
      // 260 GSM must NOT appear without project owner verification
      expect(content).not.toContain('260');
    });

    it('verifies product detail view removes unconfirmed 260 GSM specification', () => {
      const productDetailPath = path.join(process.cwd(), 'src/components/ProductDetailView.tsx');
      const content = fs.readFileSync(productDetailPath, 'utf8');
      expect(content).not.toContain('260');
    });

    it('verifies exchange rate calculation explanation is removed from public dictionary', () => {
      const dictPath = path.join(process.cwd(), 'src/locales/dictionary.ts');
      const content = fs.readFileSync(dictPath, 'utf8');
      expect(content).not.toContain('1 د.أ = 1.41 USD');
      expect(content).not.toContain('1 JOD = 1.41 USD');
    });

    it('verifies footer policies modal removes unapproved guarantees and 48-hour return window', () => {
      const policiesPath = path.join(process.cwd(), 'src/components/FooterPoliciesModal.tsx');
      const content = fs.readFileSync(policiesPath, 'utf8');
      expect(content).not.toContain('٤٨ ساعة');
      expect(content).not.toContain('48 hours');
      expect(content).not.toContain('نضمن استبدال');
    });

    it('verifies fabric descriptions remove unapproved cotton claims in favor of DTG printing', () => {
      const productDetailPath = path.join(process.cwd(), 'src/components/ProductDetailView.tsx');
      const detailContent = fs.readFileSync(productDetailPath, 'utf8');
      expect(detailContent).not.toContain('قطن');
      expect(detailContent.toLowerCase()).not.toContain('cotton');

      const collabPath = path.join(process.cwd(), 'src/app/collab/page.tsx');
      const collabContent = fs.readFileSync(collabPath, 'utf8');
      expect(collabContent).not.toContain('قطن');
      expect(collabContent.toLowerCase()).not.toContain('cotton');
    });
  });

  describe('6. Isolated Destination State (Local vs International)', () => {
    it('does not leak Dubai into Jordan local destination when switching back and forth', () => {
      useStore.setState({
        lang: 'ar',
        currency: 'JOD',
        isCartOpen: true,
        cart: [
          {
            id: 'drop-helmet-white-L',
            productId: 'drop-helmet-white',
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
      });

      const { unmount } = render(<Modals />);

      // Switch to International
      const intlTab = screen.getByRole('button', { name: /شحن دولي/i });
      fireEvent.click(intlTab);

      // Type Dubai as city in international
      const cityInput = screen.getByPlaceholderText(/المدينة \(مثال: دبي، الرياض، لندن\)/i);
      fireEvent.change(cityInput, { target: { value: 'Dubai' } });

      // Verify state now has Dubai
      expect(useStore.getState().shippingDestination.city).toBe('Dubai');

      // Switch back to Domestic
      const domesticTab = screen.getByRole('button', { name: /توصيل محلي \(الأردن\)/i });
      fireEvent.click(domesticTab);

      // Verify that active city is NOT Dubai!
      const activeState = useStore.getState().shippingDestination;
      expect(activeState.countryCode).toBe('JO');
      expect(activeState.city).not.toBe('Dubai');
      expect(activeState.city).toContain('عمّان');

      // Check WhatsApp link href does NOT contain Dubai
      const waLink = screen.getByRole('link', { name: /إرسال الطلب للتأكيد عبر واتساب/i });
      const href = waLink.getAttribute('href') || '';
      const urlObj = new URL(href);
      const decodedMsg = urlObj.searchParams.get('text') || '';

      expect(decodedMsg).not.toContain('Dubai');
      expect(decodedMsg).toContain('الأردن');
      expect(decodedMsg).toContain('عمّان');

      unmount();
    });

    it('requires custom area input when "منطقة أخرى" is selected and blocks checkout until filled', () => {
      useStore.setState({
        lang: 'ar',
        currency: 'JOD',
        isCartOpen: true,
        cart: [
          {
            id: 'drop-helmet-white-L',
            productId: 'drop-helmet-white',
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
        shippingDestination: {
          countryCode: 'JO',
          countryNameAr: 'الأردن',
          countryNameEn: 'Jordan',
          governorateId: 'amman',
          city: 'منطقة أخرى',
          customArea: '',
          postalCode: '11118',
        },
      });

      render(<Modals />);

      // Must display custom area input
      const customAreaInput = screen.getByPlaceholderText(/أدخل اسم منطقتك/i);
      expect(customAreaInput).toBeInTheDocument();

      // Action button must be disabled and validation message shown
      expect(screen.getAllByText(/يرجى إدخال اسم المنطقة للمتابعة/i).length).toBeGreaterThanOrEqual(1);
      const sendButton = screen.getByRole('button', { name: /إرسال الطلب للتأكيد عبر واتساب/i });
      expect(sendButton).toBeDisabled();

      // Fill custom area name
      fireEvent.change(customAreaInput, { target: { value: 'طبربور - حي الشهيد' } });

      // Action button should now be an enabled link
      const waLink = screen.getByRole('link', { name: /إرسال الطلب للتأكيد عبر واتساب/i });
      expect(waLink).toBeInTheDocument();

      const href = waLink.getAttribute('href') || '';
      const decodedMsg = decodeURIComponent(href);
      expect(decodedMsg).toContain('طبربور - حي الشهيد');
    });

    it('does not display CliQ or COD buttons for international shipping and notes confirmation via WhatsApp', () => {
      useStore.setState({
        lang: 'en',
        currency: 'USD',
        isCartOpen: true,
        cart: [
          {
            id: 'drop-helmet-white-L',
            productId: 'drop-helmet-white',
            productTitle: 'Keffiyeh Helmet Tee — White',
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
        shippingDestination: {
          countryCode: 'AE',
          countryNameAr: 'الإمارات العربية المتحدة',
          countryNameEn: 'United Arab Emirates',
          city: 'Abu Dhabi',
          postalCode: '',
        },
      });

      render(<Modals />);

      // CliQ and COD buttons must NOT be present
      expect(screen.queryByRole('button', { name: /CliQ Transfer/i })).toBeNull();
      expect(screen.queryByRole('button', { name: /Cash on Delivery/i })).toBeNull();

      // Must state WhatsApp confirmation for payment
      expect(screen.getByText('Available payment methods are confirmed via WhatsApp before completing the order.')).toBeInTheDocument();

      const waLink = screen.getByRole('link', { name: /Request confirmation via WhatsApp/i });
      const href = waLink.getAttribute('href') || '';
      const decodedMsg = decodeURIComponent(href);

      expect(decodedMsg).toContain('Payment: Available payment methods are confirmed via WhatsApp before completing the order');
      expect(decodedMsg).not.toContain('Preferred Payment: CliQ');
      expect(decodedMsg).not.toContain('Preferred Payment: Cash on Delivery');
    });
  });

  describe('7. Dynamic Cart Translation & Pricing Consistency', () => {
    it('dynamically translates product titles in cart and WhatsApp message upon language switch', () => {
      useStore.setState({
        lang: 'ar',
        currency: 'JOD',
        isCartOpen: true,
        cart: [
          {
            id: 'drop-helmet-white-L',
            productId: 'drop-helmet-white',
            productTitle: 'تيشيرت خوذة الكوفية — أبيض',
            productTitleAr: 'تيشيرت خوذة الكوفية — أبيض',
            productTitleEn: 'Keffiyeh Helmet Tee — White',
            size: 'L',
            garment: 'tshirt',
            price: 35,
            priceUSD: 50,
            quantity: 2,
            color: 'offwhite',
            placement: 'back',
            artMode: 'presets',
            isPrePrinted: true,
          },
        ],
      });

      const { rerender } = render(<Modals />);

      // In Arabic: Arabic title, Arabic labels
      expect(screen.getByText('تيشيرت خوذة الكوفية — أبيض')).toBeInTheDocument();
      expect(screen.getByText(/المقاس:/i)).toBeInTheDocument();

      // Check WhatsApp link in Arabic
      let waLink = screen.getByRole('link', { name: /إرسال الطلب للتأكيد عبر واتساب/i });
      let decoded = decodeURIComponent(waLink.getAttribute('href') || '');
      expect(decoded).toContain('1. تيشيرت خوذة الكوفية — أبيض - مقاس: L - كمية: 2 (٧٠ د.أ)');

      // Switch language to English
      act(() => {
        useStore.setState({ lang: 'en' });
      });
      rerender(<Modals />);

      // In English: English title, English labels
      expect(screen.getByText('Keffiyeh Helmet Tee — White')).toBeInTheDocument();
      expect(screen.getByText(/Size:/i)).toBeInTheDocument();

      // Check WhatsApp link in English
      waLink = screen.getByRole('link', { name: /Request confirmation via WhatsApp/i });
      decoded = decodeURIComponent(waLink.getAttribute('href') || '');
      expect(decoded).toContain('1. Keffiyeh Helmet Tee — White - Size: L - Qty: 2 (70 JOD)');
      expect(decoded).not.toContain('مقاس:');
      expect(decoded).not.toContain('كمية:');

      // Check quantity 2 produces 70 JOD / 100 USD
      act(() => {
        useStore.setState({ currency: 'USD' });
      });
      rerender(<Modals />);
      waLink = screen.getByRole('link', { name: /Request confirmation via WhatsApp/i });
      decoded = decodeURIComponent(waLink.getAttribute('href') || '');
      expect(decoded).toContain('1. Keffiyeh Helmet Tee — White - Size: L - Qty: 2 (100.00 USD)');
    });
  });
});
