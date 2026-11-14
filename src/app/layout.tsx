import type { Metadata, Viewport } from "next";
import "./globals.css";

export const viewport: Viewport = {
  themeColor: "#070707",
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL("https://midaan-store.midaanme.workers.dev"),
  title: "Midaan Collective | ميدان — مساحة للإبداع والتعبير والمناصرة",
  description: "An independent cultural and intellectual publication and streetwear initiative exploring identity, social transformations, and civic expression. إصدار فكري ثقافي ومبادرة أزياء مستقلة تبحث في قضايا الهوية والتعبير المدني والمناصرة.",
  manifest: "/manifest.json",
  icons: {
    icon: "/logo.png",
    apple: "/logo.png",
  },
  alternates: {
    canonical: "https://midaan-store.midaanme.workers.dev",
  },
  openGraph: {
    title: "Midaan Collective | ميدان — مساحة للإبداع والتعبير والمناصرة",
    description: "Wearable advocacy and independent publishing from Amman. مساحة للإبداع والتعبير والمناصرة • أزياء تعبيرية وإصدارات فكرية مستقلة.",
    url: "https://midaan-store.midaanme.workers.dev",
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
    title: "Midaan Collective | ميدان",
    description: "Wearable advocacy and independent publishing from Amman. مساحة للإبداع والتعبير والمناصرة.",
    images: ["/helmet-back-white.jpg"],
  },
};

const jsonLdData = [
  {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Midaan Collective",
    "alternateName": "ميدان",
    "url": "https://midaan-store.midaanme.workers.dev",
    "logo": "https://midaan-store.midaanme.workers.dev/logo.png",
    "description": "An independent cultural and intellectual publication and streetwear initiative exploring identity, social transformations, and civic expression.",
    "sameAs": [
      "https://wa.me/962770125316"
    ]
  },
  {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": "تيشيرت خوذة الكوفية — أبيض | Keffiyeh Helmet T-Shirt — White",
    "image": [
      "https://midaan-store.midaanme.workers.dev/helmet-back-white.jpg"
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
        "url": "https://midaan-store.midaanme.workers.dev/products/drop-helmet-white"
      },
      {
        "@type": "Offer",
        "priceCurrency": "USD",
        "price": "50",
        "availability": "https://schema.org/InStock",
        "url": "https://midaan-store.midaanme.workers.dev/products/drop-helmet-white"
      }
    ]
  },
  {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": "تيشيرت بوستر فلسطين — أبيض | Palestine Poster T-Shirt — White",
    "image": [
      "https://midaan-store.midaanme.workers.dev/palestine-back-white.jpg"
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
        "url": "https://midaan-store.midaanme.workers.dev/products/drop-poster-white"
      },
      {
        "@type": "Offer",
        "priceCurrency": "USD",
        "price": "50",
        "availability": "https://schema.org/InStock",
        "url": "https://midaan-store.midaanme.workers.dev/products/drop-poster-white"
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
      </head>
      <body className="bg-[#050505] text-[#F4F4F0] min-h-screen antialiased selection:bg-[#D80032] selection:text-white">
        {children}
      </body>
    </html>
  );
}
