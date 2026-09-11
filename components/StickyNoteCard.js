import { Pin } from "lucide-react";

const ROTATIONS = [-2.2, 1.4, -0.8, 2.1, -1.5, 0.7];

function rotationFor(id = "") {
  const hash = String(id).split("").reduce((sum, char) => sum + char.charCodeAt(0), 0);
  return `${ROTATIONS[hash % ROTATIONS.length]}deg`;
}

function roleLabel(role) {
  return ({ student: "Student", volunteer: "Volunteer", partner: "Partner", other: "Community" })[role] || "Community";
}

export default function StickyNoteCard({ entry, compact = false, duplicate = false }) {
  const isPhoto = Boolean(entry.imageUrl);
  const displayName = entry.anonymous || !entry.name ? "Anonymous" : entry.name;

  return (
    <article
      className={`sticky-note sticky-note-${isPhoto ? "photo" : "text"}${compact ? " sticky-note-compact" : ""}`}
      style={{ "--note-rotation": rotationFor(entry.id) }}
      aria-hidden={duplicate ? "true" : undefined}
    >
      <span className="sticky-note-pin" aria-hidden="true"><Pin size={17} fill="currentColor" /></span>
      {isPhoto ? (
        <>
          {/* Arbitrary admin-entered URLs cannot be declared in Next image remotePatterns. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className="sticky-note-image" src={entry.imageUrl} alt={entry.caption || "Feedback shared with NK Udada"} loading="lazy" />
          {entry.caption && <p className="sticky-note-caption">{entry.caption}</p>}
        </>
      ) : (
        <blockquote>{entry.message}</blockquote>
      )}
      <footer className="sticky-note-meta">
        <span>{displayName}</span>
        <span>{roleLabel(entry.role)}{entry.eventTag ? ` · ${entry.eventTag}` : ""}</span>
      </footer>
    </article>
  );
}
