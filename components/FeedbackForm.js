"use client";

import { useRef, useState } from "react";
import { CheckCircle2, Send } from "lucide-react";

export default function FeedbackForm() {
  const startedAt = useRef(Date.now());
  const [anonymous, setAnonymous] = useState(false);
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();
    setStatus("sending");
    setError("");
    const form = new FormData(event.currentTarget);

    try {
      const response = await fetch("/api/feedback/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: form.get("message"),
          name: form.get("name"),
          anonymous,
          role: form.get("role"),
          website: form.get("website"),
          startedAt: startedAt.current
        })
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Unable to send your feedback.");
      setStatus("success");
    } catch (submitError) {
      setStatus("error");
      setError(submitError.message);
    }
  }

  if (status === "success") {
    return (
      <div className="feedback-form-success" role="status">
        <CheckCircle2 size={34} />
        <h3>Thank you for sharing</h3>
        <p>Your reflection has been received. It will appear here once the NK Udada team has reviewed it.</p>
      </div>
    );
  }

  return (
    <form className="feedback-form" onSubmit={handleSubmit}>
      <div className="feedback-form-heading">
        <span>ADD YOUR VOICE</span>
        <h3>Leave a note for the wall</h3>
        <p>Share what your experience with NK Udada meant to you. Every public note is reviewed first.</p>
      </div>
      <div className="feedback-form-field">
        <label htmlFor="feedback-message">Your message</label>
        <textarea id="feedback-message" name="message" maxLength={800} required placeholder="Write your reflection here…" />
        <small>Up to 800 characters</small>
      </div>
      <div className="feedback-form-row">
        <div className="feedback-form-field">
          <label htmlFor="feedback-name">Name (optional)</label>
          <input id="feedback-name" name="name" maxLength={120} disabled={anonymous} />
        </div>
        <div className="feedback-form-field">
          <label htmlFor="feedback-role">I am a…</label>
          <select id="feedback-role" name="role" defaultValue="volunteer">
            <option value="volunteer">Volunteer</option>
            <option value="partner">Partner</option>
            <option value="other">Other stakeholder</option>
          </select>
        </div>
      </div>
      <label className="feedback-anonymous">
        <input type="checkbox" checked={anonymous} onChange={(event) => setAnonymous(event.target.checked)} />
        Share this anonymously
      </label>
      <div className="feedback-honeypot" aria-hidden="true">
        <label htmlFor="feedback-website">Website</label>
        <input id="feedback-website" name="website" tabIndex={-1} autoComplete="off" />
      </div>
      <button className="feedback-submit" type="submit" disabled={status === "sending"}>
        {status === "sending" ? "Pinning your note…" : <>Submit for review <Send size={15} /></>}
      </button>
      {status === "error" && <p className="feedback-form-error" role="alert">{error}</p>}
    </form>
  );
}
