import { getSiteContent, getStorefrontContent } from "@/lib/content";
import StoreClient from "./StoreClient";

export const metadata = {
  title: "NK Store — NK Udada Foundation",
  description: "Wear the mission and support NK Udada Foundation programs with every purchase."
};

export default function StorePage() {
  const store = getStorefrontContent();
  const site = getSiteContent();

  return <StoreClient store={store} siteName={site.meta.siteName} />;
}
