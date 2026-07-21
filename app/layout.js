import "./globals.css";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import RevealObserver from "@/components/RevealObserver";
import { getSiteContent } from "@/lib/content";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";

export async function generateMetadata() {
  const { meta } = getSiteContent();
  return {
    metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://the-nkfoundation.org"),
    title: meta.title,
    description: meta.description,

    openGraph: {
      title: meta.siteName,
      description: meta.description,
      images: ["/Logo.jpeg"],
      type: "website"
    },
    icons: { icon: "/Logo.jpeg" }
  };
}

export default function RootLayout({ children }) {
  const site = getSiteContent();

  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,900;1,700&family=DM+Sans:wght@300;400;500;600&family=DM+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <Nav nav={site.nav} meta={site.meta} />
        {children}
        <Footer footer={site.footer} />
        <RevealObserver />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
