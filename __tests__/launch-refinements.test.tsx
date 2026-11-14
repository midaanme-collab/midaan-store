import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { useStore } from '../src/store';
import { JORDAN_GOVERNORATE_AREAS } from '../src/constants/shipping';
import DropShowcase from '../src/components/DropShowcase';
import Modals from '../src/components/Modals';
import FooterPoliciesModal from '../src/components/FooterPoliciesModal';
import PageLayout from '../src/components/PageLayout';
import Hero from '../src/components/Hero';
import CampaignVideoSection from '../src/components/CampaignVideoSection';
import SizeChartModal, { SIZE_MEASUREMENTS } from '../src/components/SizeChartModal';
import ProductDetailView from '../src/components/ProductDetailView';
import { SHARED_PRODUCTS } from '../src/constants/products';
import { buildWhatsAppOrderMessage } from '../src/utils/whatsapp';
import { sendOrderToCrm, CRM_WEBHOOK_URL } from '../src/utils/crm';
import fs from 'fs';
import path from 'path';

describe('Launch Refinements & Truthful Experience Suite', () => {
  beforeAll(() => {
    window.HTMLMediaElement.prototype.play = () => Promise.resolve();
    window.HTMLMediaElement.prototype.pause = () => {};
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

  describe('8. Approved Returns & Exchanges Policy', () => {
    it('renders the approved policy in Arabic and English in FooterPoliciesModal', () => {
      const { rerender } = render(
        <FooterPoliciesModal
          isOpen={true}
          onClose={jest.fn()}
          activeTab="returns"
          onTabChange={jest.fn()}
          lang="ar"
        />
      );

      // Arabic Policy assertions
      expect(screen.getAllByText('سياسة الاستبدال والاسترجاع').length).toBeGreaterThanOrEqual(1);
      expect(screen.getByText(/لا نقبل التبديل أو الإرجاع بسبب تغيير الرأي أو اختيار مقاس غير مناسب/i)).toBeInTheDocument();
      expect(screen.getByText(/إذا وصلتكم قطعة معيبة أو منتج أو مقاس مختلف عن الطلب المؤكد/i)).toBeInTheDocument();
      expect(screen.getByText(/يتحمل ميدان رسوم التوصيل المرتبطة بهذا الاستبدال/i)).toBeInTheDocument();
      expect(screen.getByText(/لا تحد هذه السياسة من حقوق المستهلك المقررة بموجب القوانين المعمول بها/i)).toBeInTheDocument();

      // Ensure no invented 48h deadline or unconditional guarantees
      expect(screen.queryByText(/48 ساعة/i)).toBeNull();
      expect(screen.queryByText(/نضمن استبدال/i)).toBeNull();

      // English Policy assertions
      rerender(
        <FooterPoliciesModal
          isOpen={true}
          onClose={jest.fn()}
          activeTab="returns"
          onTabChange={jest.fn()}
          lang="en"
        />
      );

      expect(screen.getAllByText('Returns & Exchanges').length).toBeGreaterThanOrEqual(1);
      expect(screen.getByText(/We do not accept exchanges or returns for a change of mind/i)).toBeInTheDocument();
      expect(screen.getByText(/If you receive a defective item, or a product or size different/i)).toBeInTheDocument();
      expect(screen.getByText(/Midaan covers the delivery costs associated with this replacement/i)).toBeInTheDocument();
      expect(screen.getByText(/This policy does not limit your statutory consumer rights under applicable law/i)).toBeInTheDocument();
    });

    it('opens returns policy modal when clicked from DropShowcase', () => {
      render(<DropShowcase lang="ar" />);

      const policyButtons = screen.getAllByRole('button', { name: /سياسة الاستبدال/i });
      expect(policyButtons.length).toBeGreaterThan(0);

      fireEvent.click(policyButtons[0]);

      expect(useStore.getState().isPolicyModalOpen).toBe(true);
      expect(useStore.getState().activePolicyTab).toBe('returns');
    });
  });

  describe('9. Nav, Footer, and Header Logo Verification', () => {
    it('verifies logo is clickable and links to home page in header and footer', () => {
      render(
        <PageLayout>
          <div>Content</div>
        </PageLayout>
      );

      const homeLinks = screen.getAllByRole('link', { name: /Midaan/i });
      expect(homeLinks.length).toBeGreaterThanOrEqual(2);
      expect(homeLinks[0]).toHaveAttribute('href', '/');
      expect(homeLinks[1]).toHaveAttribute('href', '/');
    });

    it('verifies nav links order: Store, Magazine, About (no collab link)', () => {
      render(
        <PageLayout>
          <div>Content</div>
        </PageLayout>
      );

      // In Arabic (default)
      expect(screen.getAllByText('المتجر').length).toBeGreaterThanOrEqual(1);
      expect(screen.getAllByText('المجلة').length).toBeGreaterThanOrEqual(1);
      expect(screen.getAllByText('عن ميدان').length).toBeGreaterThanOrEqual(1);
      expect(screen.queryByText('التعاون')).toBeNull();
    });

    it('verifies footer links: Store, Magazine, About, Policies, Contact Us (no whatsapp or order notice)', () => {
      render(
        <PageLayout>
          <div>Content</div>
        </PageLayout>
      );

      expect(screen.getByText('السياسات')).toBeInTheDocument();
      expect(screen.getByText('تواصل معنا')).toBeInTheDocument();

      // No standalone whatsapp link in footer
      expect(screen.queryByText('962770125316')).toBeNull();
      // No order confirmation notice paragraph in footer
      expect(screen.queryByText(/تأكيد الطلبات وتكلفة التوصيل يتم يدوياً عبر واتساب/i)).toBeNull();
    });
  });

  describe('10. Homepage Structure & Clean Copy', () => {
    it('verifies Hero has title and buttons without the deleted collab description', () => {
      render(<Hero />);

      expect(screen.getByText('ميدان: مساحة للإبداع والتعبير والمناصرة')).toBeInTheDocument();
      expect(screen.queryByText(/اكتشف تعاون ميدان × صوت وصورة/i)).toBeNull();
      expect(screen.getByText('تسوّق المجموعة')).toBeInTheDocument();
      expect(screen.getByText('اقرأ المجلة')).toBeInTheDocument();
    });

    it('verifies CampaignVideoSection keeps title "ميدان × صوت وصورة" and removes red badge, archive, and desc', async () => {
      await act(async () => {
        render(<CampaignVideoSection />);
      });

      // Title is present
      expect(screen.getByRole('heading', { level: 2, name: 'ميدان × صوت وصورة' })).toBeInTheDocument();
      // Removed elements
      expect(screen.queryByText(/أرشيف/i)).toBeNull();
      expect(screen.queryByText(/حكاية من الشارع/i)).toBeNull();
      expect(screen.queryByText(/تعاون يجمع ميدان وصوت وصورة في إصدارين/i)).toBeNull();
    });

    it('verifies DropShowcase section has "المتجر" heading with "مجموعة ميدان × صوت وصورة" under it', () => {
      render(<DropShowcase lang="ar" />);

      expect(screen.getByRole('heading', { level: 2, name: 'المتجر' })).toBeInTheDocument();
      expect(screen.getByText('مجموعة ميدان × صوت وصورة')).toBeInTheDocument();
    });
  });

  describe('11. Customer Contact Details & Bilingual WhatsApp Message', () => {
    it('renders customerName and phone inputs in Cart drawer', () => {
      useStore.setState({
        isCartOpen: true,
        cart: [
          {
            id: 'drop-helmet-white-L',
            productId: 'drop-helmet-white',
            garment: 'tshirt',
            color: 'offwhite',
            size: 'L',
            placement: 'back',
            artMode: 'presets',
            price: 35.0,
            priceUSD: 50.0,
            isPrePrinted: true,
            quantity: 1,
          },
        ],
      });

      render(<Modals />);

      expect(screen.getByText('الاسم الكامل')).toBeInTheDocument();
      expect(screen.getByText('رقم الهاتف (واتساب)')).toBeInTheDocument();

      const nameInput = screen.getByPlaceholderText('الاسم الكامل');
      const phoneInput = screen.getByPlaceholderText('07XXXXXXXX');

      fireEvent.change(nameInput, { target: { value: 'طارق النابلسي' } });
      fireEvent.change(phoneInput, { target: { value: '0791234567' } });

      expect(useStore.getState().shippingDestination.customerName).toBe('طارق النابلسي');
      expect(useStore.getState().shippingDestination.phone).toBe('0791234567');
    });

    it('includes customerName and phone verbatim in Arabic and English WhatsApp messages', () => {
      const arabicMsg = buildWhatsAppOrderMessage({
        cart: [
          {
            id: 'drop-helmet-white-L',
            productId: 'drop-helmet-white',
            garment: 'tshirt',
            color: 'offwhite',
            size: 'L',
            placement: 'back',
            artMode: 'presets',
            price: 35.0,
            priceUSD: 50.0,
            isPrePrinted: true,
            quantity: 1,
          },
        ],
        currency: 'JOD',
        lang: 'ar',
        isDomestic: true,
        destinationSummary: 'الأردن - عمّان - وسط البلد',
        paymentMethod: 'cliq',
        cartSubtotal: 35,
        customerName: 'فادي الأحمد',
        phone: '0780001122',
      });

      expect(arabicMsg).toContain('الاسم الكامل: فادي الأحمد');
      expect(arabicMsg).toContain('رقم الهاتف (واتساب): 0780001122');

      const englishMsg = buildWhatsAppOrderMessage({
        cart: [
          {
            id: 'drop-poster-white-XL',
            productId: 'drop-poster-white',
            garment: 'tshirt',
            color: 'offwhite',
            size: 'XL',
            placement: 'back',
            artMode: 'presets',
            price: 35.0,
            priceUSD: 50.0,
            isPrePrinted: true,
            quantity: 2,
          },
        ],
        currency: 'USD',
        lang: 'en',
        isDomestic: false,
        destinationSummary: 'UAE - Dubai - Downtown',
        cartSubtotal: 100,
        customerName: 'Sarah Connor',
        phone: '+971501234567',
      });

      expect(englishMsg).toContain('Full Name: Sarah Connor');
      expect(englishMsg).toContain('Phone Number (WhatsApp): +971501234567');
    });
  });

  describe('12. Direct Google Sheets CRM Webhook Integration', () => {
    it('dispatches non-blocking fetch to Google Apps Script URL with complete payload', () => {
      const mockFetch = jest.fn().mockImplementation(() => Promise.resolve({ ok: true }));
      (global as any).fetch = mockFetch;

      const payload = {
        orderId: 'ORD-12345-TEST',
        customerName: 'علي كمال',
        phone: '0771122334',
        deliveryScope: 'Domestic (الأردن)',
        countryOrGov: 'عمّان',
        cityOrArea: 'اللويبده',
        address: 'شارع كلية الشريعة',
        itemsSummary: 'تيشيرت خوذة الكوفية — أبيض (L) x1',
        productIds: 'drop-helmet-white',
        sizes: 'L',
        totalQty: 1,
        currency: 'JOD' as const,
        subtotal: 35,
        deliveryFee: 'Confirmed via WhatsApp',
        grandTotal: 35,
        paymentMethod: 'CliQ',
        audienceTag: 'Drop01_Lead',
        notes: '',
      };

      sendOrderToCrm(payload);

      expect(mockFetch).toHaveBeenCalledTimes(1);
      expect(mockFetch).toHaveBeenCalledWith(CRM_WEBHOOK_URL, {
        method: 'POST',
        mode: 'no-cors',
        keepalive: true,
        headers: {
          'Content-Type': 'text/plain;charset=utf-8',
        },
        body: JSON.stringify(payload),
      });
    });
  });

  describe('13. Interactive Size & Fit Guide Modal (Relaxed Boxy Fit)', () => {
    it('contains verified measurements and height/weight recommendations for all 5 sizes', () => {
      expect(SIZE_MEASUREMENTS).toHaveLength(5);

      // S: Chest 52, Length 70, Shoulder 48, Height 160-170, Weight 55-68
      const s = SIZE_MEASUREMENTS.find((m) => m.size === 'S');
      expect(s?.chestCm).toBe(52);
      expect(s?.lengthCm).toBe(70);
      expect(s?.shoulderCm).toBe(48);
      expect(s?.heightRange).toBe('160–170 cm');
      expect(s?.weightRange).toBe('55–68 kg');

      // M: Chest 55, Length 72, Shoulder 50, Height 168-176, Weight 65-78
      const m = SIZE_MEASUREMENTS.find((x) => x.size === 'M');
      expect(m?.chestCm).toBe(55);
      expect(m?.lengthCm).toBe(72);
      expect(m?.shoulderCm).toBe(50);
      expect(m?.heightRange).toBe('168–176 cm');
      expect(m?.weightRange).toBe('65–78 kg');

      // L: Chest 58, Length 75, Shoulder 53, Height 174-182, Weight 75-88
      const l = SIZE_MEASUREMENTS.find((x) => x.size === 'L');
      expect(l?.chestCm).toBe(58);
      expect(l?.lengthCm).toBe(75);
      expect(l?.shoulderCm).toBe(53);
      expect(l?.heightRange).toBe('174–182 cm');
      expect(l?.weightRange).toBe('75–88 kg');

      // XL: Chest 61, Length 77, Shoulder 56, Height 180-188, Weight 85-100
      const xl = SIZE_MEASUREMENTS.find((x) => x.size === 'XL');
      expect(xl?.chestCm).toBe(61);
      expect(xl?.lengthCm).toBe(77);
      expect(xl?.shoulderCm).toBe(56);
      expect(xl?.heightRange).toBe('180–188 cm');
      expect(xl?.weightRange).toBe('85–100 kg');

      // XXL: Chest 64, Length 79, Shoulder 58, Height 185+, Weight 98-115
      const xxl = SIZE_MEASUREMENTS.find((x) => x.size === 'XXL');
      expect(xxl?.chestCm).toBe(64);
      expect(xxl?.lengthCm).toBe(79);
      expect(xxl?.shoulderCm).toBe(58);
      expect(xxl?.heightRange).toBe('185+ cm');
      expect(xxl?.weightRange).toBe('98–115 kg');
    });

    it('renders SizeChartModal with quality badges and interactive size selection', () => {
      render(
        <SizeChartModal
          isOpen={true}
          onClose={jest.fn()}
          lang="ar"
          defaultSize="L"
        />
      );

      expect(screen.getByText('دليل المقاسات والقصة الصندوقية')).toBeInTheDocument();
      expect(screen.getByText('تفاوت القياس: ± 1.5 سم')).toBeInTheDocument();
      expect(screen.getByText('معالج مسبقاً ضد الانكماش (Preshrunk)')).toBeInTheDocument();
      expect(screen.getByText('صناعة يدوية في إندونيسيا')).toBeInTheDocument();

      // Test size switching inside modal
      const sizeMBtn = screen.getByRole('button', { name: 'Size M' });
      fireEvent.click(sizeMBtn);

      expect(screen.getAllByText('55 cm').length).toBeGreaterThanOrEqual(1);
      expect(screen.getAllByText('168–176 cm').length).toBeGreaterThanOrEqual(1);
    });

    it('opens SizeChartModal from DropShowcase and ProductDetailView', () => {
      act(() => {
        useStore.setState({ isSizeChartOpen: false });
      });

      const { unmount } = render(<DropShowcase lang="ar" />);
      const sizeGuideBtns = screen.getAllByRole('button', { name: /جدول المقاسات/i });
      expect(sizeGuideBtns.length).toBeGreaterThan(0);

      fireEvent.click(sizeGuideBtns[0]);
      expect(useStore.getState().isSizeChartOpen).toBe(true);

      unmount();

      act(() => {
        useStore.setState({ isSizeChartOpen: false });
      });

      render(<ProductDetailView product={SHARED_PRODUCTS[0]} />);
      const detailGuideBtn = screen.getByRole('button', { name: /دليل المقاسات والقصة/i });
      fireEvent.click(detailGuideBtn);
      expect(useStore.getState().isSizeChartOpen).toBe(true);
    });
  });

  describe('14. SEO, OpenGraph, Structured Data & Robots/Sitemap', () => {
    it('verifies robots.txt exists and points to sitemap.xml', () => {
      const robotsPath = path.join(process.cwd(), 'public', 'robots.txt');
      expect(fs.existsSync(robotsPath)).toBe(true);
      const content = fs.readFileSync(robotsPath, 'utf8');
      expect(content).toContain('User-agent: *');
      expect(content).toContain('Sitemap: https://midaan-store.midaanme.workers.dev/sitemap.xml');
    });

    it('verifies sitemap.xml contains product paths and core pages', () => {
      const sitemapPath = path.join(process.cwd(), 'public', 'sitemap.xml');
      expect(fs.existsSync(sitemapPath)).toBe(true);
      const content = fs.readFileSync(sitemapPath, 'utf8');
      expect(content).toContain('/products/drop-helmet-white');
      expect(content).toContain('/products/drop-poster-white');
      expect(content).toContain('/about');
      expect(content).toContain('/magazine');
    });

    it('verifies root layout file defines bilingual metadata, og:image, and JSON-LD structured data', () => {
      const layoutPath = path.join(process.cwd(), 'src', 'app', 'layout.tsx');
      const content = fs.readFileSync(layoutPath, 'utf8');
      expect(content).toContain('summary_large_image');
      expect(content).toContain('/helmet-back-white.jpg');
      expect(content).toContain('application/ld+json');
      expect(content).toContain('"@type": "Organization"');
      expect(content).toContain('"@type": "Product"');
      expect(content).toContain('35');
      expect(content).toContain('50');
    });
  });
});
