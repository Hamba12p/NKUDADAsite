import AdminShell from "@/components/admin/AdminShell";
import FeedbackEditor from "@/components/admin/FeedbackEditor";
import { getFeedbackContent } from "@/lib/content";

export const metadata = { title: "Feedback Administration" };

export default function AdminFeedbackPage() {
  return (
    <AdminShell>
      <FeedbackEditor initialData={getFeedbackContent()} />
    </AdminShell>
  );
}
