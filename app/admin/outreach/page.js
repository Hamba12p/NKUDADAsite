import AdminShell from "@/components/admin/AdminShell";
import OutreachEditor from "@/components/admin/OutreachEditor";
import { getOutreachContent } from "@/lib/content";

export const metadata = { title: "Outreach Roll Call" };

export default function AdminOutreachPage() {
  const outreach = getOutreachContent();
  return (
    <AdminShell>
      <OutreachEditor initialData={outreach} />
    </AdminShell>
  );
}
