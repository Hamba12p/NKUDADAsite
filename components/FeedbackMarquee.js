import Link from "next/link";
import { ArrowRight } from "lucide-react";
import StickyNoteCard from "@/components/StickyNoteCard";

export default function FeedbackMarquee({ entries }) {
  return (
    <section className="feedback-marquee-section" aria-labelledby="pin-it-heading">
      <div className="feedback-marquee-heading">
        <div>
          <span className="section-tag">Pin it</span>
          <h2 id="pin-it-heading" className="section-title">Notes from our <em>community</em></h2>
        </div>
        <Link href="/feedback">See all feedback <ArrowRight size={15} /></Link>
      </div>
      {entries.length ? (
        <div className="feedback-marquee-viewport">
          <div className="feedback-marquee-track">
            {[false, true].map((duplicate) => (
              <div className="feedback-marquee-set" key={String(duplicate)}>
                {entries.map((entry) => <StickyNoteCard key={`${duplicate}-${entry.id}`} entry={entry} compact duplicate={duplicate} />)}
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="feedback-marquee-empty">The first community notes are being gathered. <Link href="/feedback">Add yours.</Link></div>
      )}
    </section>
  );
}
