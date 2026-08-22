import { Check, Download, GraduationCap, HeartHandshake, Target, WalletCards } from "lucide-react";
import Image from "next/image";
import SchoolSignupForm from "@/components/SchoolSignupForm";

export const metadata = {
  title: "School Partnerships — NK Udada Foundation",
  description: "Request an NK Udada Foundation School Outreach Programme visit for your secondary school."
};

const SESSION_PILLARS = [
  {
    title: "SRH Dialogue",
    description: "Puberty, menstrual health, consent, healthy relationships, STI/HIV awareness, digital safety",
    icon: HeartHandshake
  },
  {
    title: "Financial Literacy",
    description: "Saving, budgeting, needs vs. wants, entrepreneurship basics",
    icon: WalletCards
  },
  {
    title: "Goal Setting",
    description: "Personal vision, strengths discovery, concrete next steps",
    icon: Target
  },
  {
    title: "Staying in School",
    description: "Resilience, peer support, why education matters",
    icon: GraduationCap
  }
];

const SCHOOL_REQUIREMENTS = [
  "A room or hall that can hold your students comfortably",
  "A 3–4 hour window (our longest session so far ran 4.5 hours for 142 students)",
  "Rough student numbers ahead of time, so we can plan facilitators and materials",
  "A staff contact reachable the week of the visit"
];

export default function SchoolsPage() {
  return (
    <main id="schools-page">
      <section className="schools-hero section-first">
        <div className="schools-hero-glow" aria-hidden="true" />
        <div className="schools-hero-copy">
          <span className="section-tag">SCHOOL PARTNERSHIPS · NK UDADA FOUNDATION</span>
          <h1>Bring the School Outreach Programme to Your Students</h1>
          <p>
            NK Udada Foundation partners with secondary schools across Uganda to give students a single,
            structured session covering the things young people are rarely taught in class: their health,
            their money, their goals, and their right to stay in school. So far, 440+ learners across 3
            schools have shown us, through their questions and their attention, exactly how much this
            conversation was missing.
          </p>
        </div>
        <div className="schools-hero-mark" aria-hidden="true">
          <div className="schools-hero-orbit orbit-one" />
          <div className="schools-hero-orbit orbit-two" />
          <Image src="/Logo2.png" alt="" width={500} height={500} priority />
          <span>School Outreach</span>
        </div>
      </section>

      <section className="schools-section schools-covers">
        <h2 className="section-title">What a Session Covers</h2>
        <div className="school-pillars-grid">
          {SESSION_PILLARS.map(({ title, description, icon: PillarIcon }, index) => (
            <article className={`school-pillar-card school-pillar-${index + 1}`} key={title}>
              <div className="school-pillar-icon"><PillarIcon size={24} /></div>
              <h3>{title}</h3>
              <p>{description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="schools-section schools-ask">
        <div>
          <h2 className="section-title">What We Ask of Your School</h2>
        </div>
        <ul className="school-requirements">
          {SCHOOL_REQUIREMENTS.map((requirement) => (
            <li key={requirement}>
              <span><Check size={16} strokeWidth={3} /></span>
              {requirement}
            </li>
          ))}
        </ul>
      </section>

      <section className="schools-section schools-signup-section">
        <div className="schools-form-heading">
          <h2 className="section-title">Tell us about your school and we'll get back to you within a few days to confirm dates.</h2>
        </div>
        <SchoolSignupForm />
        <div className="schools-closing-note">
          <p>
            Once you submit this form, our team reviews it and reaches out directly, usually within a few
            working days, to confirm dates, numbers, and any topics your school wants adjusted. There's no
            cost to your school. If you'd like something to share with your own leadership first, download
            our one-page overview below.
          </p>
          <a
            className="school-download-btn"
            href="/downloads/nk-udada-school-outreach-overview.pdf"
            download
          >
            <Download size={17} /> Download Programme Overview (PDF)
          </a>
        </div>
      </section>
    </main>
  );
}
