import AdminShell from "@/components/admin/AdminShell";
import GalleryEditor from "@/components/admin/GalleryEditor";
import { getGalleryContent } from "@/lib/content";

export const metadata = { title: "Edit Gallery" };

export default function AdminGalleryPage() {
  const gallery = getGalleryContent();
  return (
    <AdminShell>
      <GalleryEditor initialData={gallery} />
    </AdminShell>
  );
}
