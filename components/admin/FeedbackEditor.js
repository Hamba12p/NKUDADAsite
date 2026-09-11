"use client";

import { useMemo, useState } from "react";
import { Check, Trash2 } from "lucide-react";
import { Checkbox } from "./FormPrimitives";

function formatDate(value) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return new Intl.DateTimeFormat("en-UG", { day: "numeric", month: "short", year: "numeric" }).format(date);
}

export default function FeedbackEditor({ initialData }) {
  const [data, setData] = useState(initialData);
  const [status, setStatus] = useState("idle");
  const [message, setMessage] = useState("");

  const submissions = useMemo(
    () => [...data.submissions].sort((a, b) => Number(a.approved) - Number(b.approved) || new Date(b.submittedAt) - new Date(a.submittedAt)),
    [data.submissions]
  );
  const pendingCount = data.submissions.filter((entry) => !entry.approved).length;

  async function persist(nextData, successMessage) {
    setStatus("saving");
    setMessage("");
    try {
      const response = await fetch("/api/admin/feedback", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(nextData)
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Save failed.");
      setData(result.content);
      setStatus("success");
      setMessage(successMessage);
    } catch (saveError) {
      setStatus("error");
      setMessage(saveError.message || "Network error — try again.");
    }
  }

  function updateSubmission(id, changes, successMessage) {
    const next = {
      ...data,
      submissions: data.submissions.map((entry) => entry.id === id ? { ...entry, ...changes } : entry)
    };
    setData(next);
    void persist(next, successMessage);
  }

  function removeSubmission(id) {
    if (!window.confirm("Delete this submission permanently?")) return;
    const next = { ...data, submissions: data.submissions.filter((entry) => entry.id !== id) };
    setData(next);
    void persist(next, "Submission deleted.");
  }

  return (
    <div>
      <h1 className="admin-page-title">Feedback</h1>
      <p className="admin-page-sub">Review text reflections submitted by the community, then approve them for the public wall or feature them on the homepage.</p>
      <section>
        <div className="admin-card">
          <div className="admin-card-title">Text submissions ({pendingCount} awaiting review)</div>
          {submissions.length === 0 ? <div className="school-signups-empty">No feedback submissions yet.</div> : submissions.map((entry) => (
            <article className={`feedback-admin-submission${entry.approved ? " approved" : ""}`} key={entry.id}>
              <div className="feedback-admin-submission-head">
                <div><strong>{entry.anonymous || !entry.name ? "Anonymous" : entry.name}</strong><span>{entry.role} · {formatDate(entry.submittedAt)}</span></div>
                <span className={`admin-badge ${entry.approved ? "published" : "draft"}`}>{entry.approved ? "Approved" : "Pending"}</span>
              </div>
              <p>{entry.message}</p>
              <div className="feedback-admin-actions">
                {!entry.approved && <button type="button" className="admin-save-btn" onClick={() => updateSubmission(entry.id, { approved: true, approvedAt: new Date().toISOString() }, "Submission approved.")} disabled={status === "saving"}><Check size={14} /> Approve</button>}
                <Checkbox label="Feature on homepage" checked={entry.featuredOnHomepage} disabled={!entry.approved || status === "saving"} onChange={(value) => updateSubmission(entry.id, { featuredOnHomepage: value }, "Homepage feature setting saved.")} />
                <button type="button" className="admin-icon-btn danger" onClick={() => removeSubmission(entry.id)} disabled={status === "saving"}><Trash2 size={14} /> Reject / delete</button>
              </div>
            </article>
          ))}
        </div>
        {message && <p className={`admin-save-status ${status === "error" ? "error" : "success"}`}>{message}</p>}
      </section>
    </div>
  );
}
