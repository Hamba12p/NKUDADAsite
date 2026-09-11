"use client";

import { useState } from "react";
import StickyNoteCard from "@/components/StickyNoteCard";
import FeedbackForm from "@/components/FeedbackForm";

function Wall({ entries, empty }) {
  if (!entries.length) return <div className="feedback-empty">{empty}</div>;
  return <div className="feedback-wall">{entries.map((entry) => <StickyNoteCard key={entry.id} entry={entry} />)}</div>;
}

export default function FeedbackTabs({ photoEntries, submissions }) {
  const [tab, setTab] = useState("ground");
  return (
    <div className="feedback-tabs-wrap">
      <div className="feedback-tabs" role="tablist" aria-label="Feedback collections">
        <button type="button" role="tab" aria-selected={tab === "ground"} className={tab === "ground" ? "active" : ""} onClick={() => setTab("ground")}>Voices from the ground</button>
        <button type="button" role="tab" aria-selected={tab === "reflections"} className={tab === "reflections" ? "active" : ""} onClick={() => setTab("reflections")}>Volunteer &amp; partner reflections</button>
      </div>
      <div role="tabpanel">
        {tab === "ground" ? (
          <Wall entries={photoEntries} empty="Photos and handwritten notes from the field will be pinned here." />
        ) : (
          <>
            <Wall entries={submissions} empty="Approved community reflections will be pinned here." />
            <FeedbackForm />
          </>
        )}
      </div>
    </div>
  );
}
