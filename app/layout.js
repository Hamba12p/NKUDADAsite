import "./globals.css";
import { DM_Mono, DM_Sans, Playfair_Display } from "next/font/google";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import RevealObserver from "@/components/RevealObserver";
import { getSiteContent } from "@/lib/content";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  weight: ["700", "900"],
  style: ["normal", "italic"]
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  weight: ["300", "400", "500", "600", "700"]
});

const dmMono = DM_Mono({
  subsets: ["latin"],
  variable: "--font-dm-mono",
  weight: ["400", "500"]
});

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
    <html
      lang="en"
      className={`${playfair.variable} ${dmSans.variable} ${dmMono.variable}`}
    >
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
