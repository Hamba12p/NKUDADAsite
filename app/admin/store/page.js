import AdminShell from "@/components/admin/AdminShell";
import StoreEditor from "@/components/admin/StoreEditor";
import { getStorefrontContent } from "@/lib/content";

export const metadata = { title: "Edit Store" };

export default function AdminStorePage() {
  const store = getStorefrontContent();
  return (
    <AdminShell>
      <StoreEditor initialData={store} />
    </AdminShell>
  );
}
