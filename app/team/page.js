import Link from "next/link";
import { getSiteContent } from "@/lib/content";
import { Sparkles } from "lucide-react";

export const metadata = { title: "Team — NK Udada Foundation" };

const COLOR_VARS = {
  purple: "var(--purple)",
  green: "var(--green)",
  rust: "var(--rust)",
  gold: "var(--gold)",
  "purple-lt": "var(--purple-lt)"
};

export default function TeamPage() {
  const { team } = getSiteContent();

  return (
    <section id="team" className="section-first">
      <span className="section-tag reveal">{team.tag}</span>
      <h2 className="section-title reveal">
        {team.titleLine1}
        <br />
        <em>{team.titleEm}</em>
      </h2>
      <p className="section-sub reveal">{team.subtitle}</p>

      <div className="team-grid">
        {team.members.map((member, i) => (
          <div className={`team-card reveal reveal-delay-${(i % 3) + 1}`} key={member.name}>
            <div className="team-avatar" style={{ background: COLOR_VARS[member.color] || member.color }}>
              {member.initials}
            </div>
            <div className="team-name">{member.name}</div>
            <div className="team-role">{member.role}</div>
            {member.founder && <div className="team-founder-badge">✦ Founder</div>}
          </div>
        ))}
        <div className="team-card team-join-card reveal reveal-delay-3">
          <Sparkles size={32} />
          <div className="tj-title">{team.joinCard.title}</div>
          <div className="tj-desc">{team.joinCard.desc}</div>
          <Link href="/volunteer" className="tj-cta">{team.joinCard.cta}</Link>
        </div>
      </div>
    </section>
  );
}
