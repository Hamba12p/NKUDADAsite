import AdminShell from "@/components/admin/AdminShell";
import SiteEditor from "@/components/admin/SiteEditor";
import { getSiteContent } from "@/lib/content";

export const metadata = { title: "Edit Site Content" };

export default function AdminSitePage() {
  const site = getSiteContent();
  return (
    <AdminShell>
      <SiteEditor initialData={site} />
    </AdminShell>
  );
}
