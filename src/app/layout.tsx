import type { Metadata, Viewport } from "next";
import "./globals.css";

export const viewport: Viewport = {
  themeColor: "#070707",
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL("https://midaan-store.midaanme.workers.dev"),
  title: "Midaan Collective | ميدان",
  description: "An independent cultural and intellectual publication and streetwear initiative exploring identity, social transformations, and civic expression. إصدار فكري ثقافي ومبادرة أزياء مستقلة تبحث في قضايا الهوية والتعبير المدني.",
  manifest: "/manifest.json",
  icons: {
    icon: "/logo.png",
    apple: "/logo.png",
  },
  alternates: {
    canonical: "https://midaan-store.midaanme.workers.dev"
  },
  openGraph: {
    title: "Midaan Collective | ميدان",
    description: "Wearable advocacy and independent publishing from Amman.",
    url: "https://midaan-store.midaanme.workers.dev",
    siteName: "Midaan",
    type: "website"
  }
};

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
                  if (parsed && parsed.state && parsed.state.theme !== 'dark') {
                    parsed.state.theme = 'dark';
                    localStorage.setItem('midaan-storage', JSON.stringify(parsed));
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
      </head>
      <body className="bg-[#050505] text-[#F4F4F0] min-h-screen antialiased selection:bg-[#D80032] selection:text-white">
        {children}
      </body>
    </html>
  );
}
