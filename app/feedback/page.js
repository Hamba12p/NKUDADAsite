import FeedbackTabs from "@/components/FeedbackTabs";
import { getFeedbackContent } from "@/lib/content";

export const metadata = {
  title: "Feedback — NK Udada Foundation",
  description: "Reflections from students, volunteers, partners, and communities reached by NK Udada Foundation."
};

export default function FeedbackPage() {
  const feedback = getFeedbackContent();
  const photos = [...feedback.photoEntries].sort((a, b) => new Date(b.addedAt) - new Date(a.addedAt));
  const approved = feedback.submissions
    .filter((entry) => entry.approved)
    .sort((a, b) => new Date(b.approvedAt || b.submittedAt) - new Date(a.approvedAt || a.submittedAt));

  return (
    <main className="feedback-page section-first">
      <header className="feedback-page-header">
        <span className="section-tag">In their own words</span>
        <h1>Every note holds a <em>story</em></h1>
        <p>Reflections from the students, volunteers, partners, and communities who shape NK Udada’s work.</p>
      </header>
      <FeedbackTabs photoEntries={photos} submissions={approved} />
    </main>
  );
}
