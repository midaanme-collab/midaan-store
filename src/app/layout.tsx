import type { Metadata, Viewport } from "next";
import MetaPixelNavigation from "@/components/MetaPixelNavigation";
import "./globals.css";

export const viewport: Viewport = {
  themeColor: "#070707",
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL("https://midaan.net"),
  title: "متجر ميدان | Midaan Store — Palestinian Streetwear & Magazine",
  description: "متجر ميدان في عمّان: تيشيرت خوذة الكوفية، تيشيرت بوستر فلسطين، ومجلة ميدان العدد صفر. أزياء فلسطينية تعبيرية عالية الجودة بطباعة DTG وشحن دولي.",
  manifest: "/manifest.json",
  icons: {
    icon: "/logo.png",
    apple: "/logo.png",
  },
  alternates: {
    canonical: "https://midaan.net",
  },
  openGraph: {
    title: "متجر ميدان | Midaan Store — Palestinian Streetwear & Magazine",
    description: "متجر ميدان في عمّان: تيشيرت خوذة الكوفية، تيشيرت بوستر فلسطين، ومجلة ميدان العدد صفر. أزياء فلسطينية تعبيرية عالية الجودة وشحن دولي.",
    url: "https://midaan.net",
    siteName: "Midaan Collective | ميدان",
    locale: "ar",
    type: "website",
    images: [
      {
        url: "/helmet-back-white.jpg",
        width: 1200,
        height: 1200,
        alt: "Midaan Collective — Keffiyeh Helmet T-Shirt",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "متجر ميدان | Midaan Store",
    description: "أزياء فلسطينية تعبيرية ومجلة فكرية مستقلة من عمّان: تيشيرت خوذة الكوفية وبوستر فلسطين.",
    images: ["/helmet-back-white.jpg"],
  },
};

const jsonLdData = [
  {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Midaan Collective | ميدان",
    "alternateName": "ميدان",
    "url": "https://midaan.net",
    "logo": "https://midaan.net/logo.png",
    "description": "An independent cultural and intellectual publication and streetwear initiative exploring identity, social transformations, and civic expression.",
    "sameAs": [
      "https://www.instagram.com/midaanme/",
      "https://www.facebook.com/midaanme/"
    ],
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+962770125316",
      "contactType": "customer service",
      "availableLanguage": ["Arabic", "English"]
    }
  },
  {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": "Keffiyeh Helmet Tee — White",
    "alternateName": "تيشيرت خوذة الكوفية — أبيض",
    "image": [
      "https://midaan.net/helmet-back-white.jpg"
    ],
    "description": "صنع في إندونيسيا • طباعة مباشرة على النسيج بتقنية DTG • قصة صندوقية واسعة Relaxed Boxy Fit. Preshrunk 100% Cotton.",
    "sku": "drop-helmet-white",
    "brand": {
      "@type": "Brand",
      "name": "Midaan Collective"
    },
    "offers": [
      {
        "@type": "Offer",
        "priceCurrency": "JOD",
        "price": "35",
        "availability": "https://schema.org/InStock",
        "url": "https://midaan.net/#drops"
      },
      {
        "@type": "Offer",
        "priceCurrency": "USD",
        "price": "50",
        "availability": "https://schema.org/InStock",
        "url": "https://midaan.net/#drops"
      }
    ]
  },
  {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": "Palestine Poster Tee — White",
    "alternateName": "تيشيرت بوستر فلسطين — أبيض",
    "image": [
      "https://midaan.net/palestine-back-white.jpg"
    ],
    "description": "صنع في إندونيسيا • طباعة مباشرة على النسيج بتقنية DTG • قصة صندوقية واسعة Relaxed Boxy Fit. Preshrunk 100% Cotton.",
    "sku": "drop-poster-white",
    "brand": {
      "@type": "Brand",
      "name": "Midaan Collective"
    },
    "offers": [
      {
        "@type": "Offer",
        "priceCurrency": "JOD",
        "price": "35",
        "availability": "https://schema.org/InStock",
        "url": "https://midaan.net/#drops"
      },
      {
        "@type": "Offer",
        "priceCurrency": "USD",
        "price": "50",
        "availability": "https://schema.org/InStock",
        "url": "https://midaan.net/#drops"
      }
    ]
  }
];

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="auto" className="dark" style={{ colorScheme: 'dark', backgroundColor: '#050505' }}>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                var storage = localStorage.getItem('midaan-storage');
                if (storage) {
                  var parsed = JSON.parse(storage);
                  if (parsed && parsed.state) {
                    if (parsed.state.theme !== 'dark') {
                      parsed.state.theme = 'dark';
                      localStorage.setItem('midaan-storage', JSON.stringify(parsed));
                    }
                    if (parsed.state.lang) {
                      document.documentElement.lang = parsed.state.lang;
                      document.documentElement.dir = parsed.state.lang === 'ar' ? 'rtl' : 'ltr';
                    }
                  }
                }
              } catch (e) {}
              document.documentElement.classList.add('dark');
              document.documentElement.style.colorScheme = 'dark';
            `
          }}
        />
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" href="/logo.png" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(jsonLdData)
          }}
        />
        {/* Meta Pixel Base Code (ID: 476490290557651) */}
        <script
          id="meta-pixel-base"
          dangerouslySetInnerHTML={{
            __html: `
              !function(f,b,e,v,n,t,s)
              {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
              n.callMethod.apply(n,arguments):n.queue.push(arguments)};
              if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
              n.queue=[];t=b.createElement(e);t.async=!0;
              t.src=v;s=b.getElementsByTagName(e)[0];
              s.parentNode.insertBefore(t,s)}(window, document,'script',
              'https://connect.facebook.net/en_US/fbevents.js');
              fbq('init', '476490290557651');
              fbq('track', 'PageView');
            `
          }}
        />
        <noscript>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            height="1"
            width="1"
            style={{ display: 'none' }}
            src="https://www.facebook.com/tr?id=476490290557651&ev=PageView&noscript=1"
            alt=""
          />
        </noscript>
      </head>
      <body className="bg-[#050505] text-[#F4F4F0] min-h-screen antialiased selection:bg-[#D80032] selection:text-white">
        <MetaPixelNavigation />
        {children}
      </body>
    </html>
  );
}
