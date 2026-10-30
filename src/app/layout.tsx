import type { Metadata, Viewport } from "next";
import "./globals.css";

export const viewport: Viewport = {
  themeColor: "#070707",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  title: "Midaan | ميدان — Middle East Official Merchandise",
  description: "أزياء وثقافة الشارع الأردنية والطباعة الحية DTF — عمّان.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Midaan",
  },
  icons: {
    icon: "/logo.png",
    apple: "/logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="auto">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="Midaan" />
        <link rel="apple-touch-icon" href="/logo.png" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link href="https://fonts.googleapis.com/css2?family=Alexandria:wght@300;400;600;700;900&family=El+Messiri:wght@600;700&display=swap" rel="stylesheet" />
        <style dangerouslySetInnerHTML={{ __html: `
          :root {
            --font-heading: 'El Messiri', sans-serif;
            --font-sans: 'Alexandria', sans-serif;
          }
          body { font-family: 'Alexandria', sans-serif; }
          .font-midaan { font-family: 'El Messiri', sans-serif; }
        `}} />
      </head>
      <body className="bg-[#080808] text-[#F4F4F0] antialiased selection:bg-[#D80032] selection:text-white">
        {children}
      </body>
    </html>
  );
}
