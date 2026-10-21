import type { Metadata } from "next";
import { El_Messiri, Alexandria } from "next/font/google";
import "./globals.css";

const elMessiri = El_Messiri({
  subsets: ["arabic", "latin"],
  weight: ["600", "700"],
  variable: "--font-heading",
  display: "swap",
});

const alexandria = Alexandria({
  subsets: ["arabic", "latin"],
  weight: ["300", "400", "600", "700", "900"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "MIDAAN | ميدان — Middle East Official Merchandise",
  description: "أزياء وثقافة الشارع الأردنية والطباعة الحية DTF — عمّان.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl" className={`${elMessiri.variable} ${alexandria.variable}`}>
      <head>
        <script src="https://cdn.tailwindcss.com" async></script>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link href="https://fonts.googleapis.com/css2?family=Alexandria:wght@300;400;600;700;900&family=El+Messiri:wght@600;700&display=swap" rel="stylesheet" />
        <style dangerouslySetInnerHTML={{ __html: `
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
