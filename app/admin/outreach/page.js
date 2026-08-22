import AdminShell from "@/components/admin/AdminShell";
import OutreachAdminTabs from "@/components/admin/OutreachAdminTabs";
import { getOutreachContent, getSchoolSignupsContent } from "@/lib/content";

export const metadata = { title: "Outreach Administration" };

export default function AdminOutreachPage() {
  const outreach = getOutreachContent();
  const schoolSignups = getSchoolSignupsContent();
  return (
    <AdminShell>
      <OutreachAdminTabs outreach={outreach} schoolSignups={schoolSignups} />
    </AdminShell>
  );
}
