import Link from "next/link";
import { getSiteContent } from "@/lib/content";
import { Icon } from "@/components/icons";
import { ArrowRight } from "lucide-react";

const DOT_COLOR = {
  purple: "var(--purple)",
  green: "var(--green)",
  gold: "var(--gold)",
  rust: "var(--rust)"
};

export default function HomePage() {
  const { hero, impact } = getSiteContent();

  return (
    <>
      <section id="hero">
        <div className="hero-bg"></div>
        <div className="hero-bg-pattern"></div>

        <div className="hero-content">
          <div className="hero-eyebrow">{hero.eyebrow}</div>
          <h1 className="hero-title">
            <em>{hero.titleLine1}</em>
            <br />
            {hero.titleLine2}
            <br />
            <span className="underline-gold">{hero.titleLine3}</span>
          </h1>
          <p className="hero-sub">{hero.subtitle}</p>
          <div className="hero-actions">
            <Link href={hero.primaryCta.href} className="btn-primary">
              {hero.primaryCta.label} <ArrowRight size={16} />
            </Link>
            <Link href={hero.secondaryCta.href} className="btn-secondary">
              {hero.secondaryCta.label}
            </Link>
          </div>
          <div className="hero-stats">
            {hero.stats.map((stat) => (
              <div className="stat" key={stat.label}>
                <div className="stat-num">
                  {stat.value}
                  {stat.suffix && <span>{stat.suffix}</span>}
                </div>
                <div className="stat-label">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="hero-visual">
          <div className="hero-card-stack">
            <div className="hero-card">
              <div className="hero-card-tag">✦ {hero.highlightCard.tag}</div>
              <h3>{hero.highlightCard.title}</h3>
              <p>{hero.highlightCard.body}</p>
              <div className="hero-card-items">
                {hero.highlightCard.items.map((item) => (
                  <div className="hero-card-item" key={item.text}>
                    <span
                      className="dot"
                      style={{ background: DOT_COLOR[item.color] || item.color }}
                    ></span>
                    {item.text}
                  </div>
                ))}
              </div>
            </div>
            {hero.floatBadges.map((badge, i) => (
              <div className={`hero-card-float f${i + 1}`} key={badge.label}>
                <span className="fi">
                  <Icon name={badge.icon} size={20} />
                </span>
                <div>
                  <div style={{ fontSize: "11px", color: "var(--muted)", marginBottom: "2px" }}>
                    {badge.label}
                  </div>
                  <div>{badge.value}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="impact">
        <span className="section-tag reveal">{impact.tag}</span>
        <h2 className="section-title reveal">
          {impact.titleLine1}
          <br />
          <em>{impact.titleEm}</em>
        </h2>
        <p className="section-sub reveal">{impact.subtitle}</p>

        <div className="impact-grid">
          {impact.cards.map((card, i) => (
            <div className={`impact-card c${i + 1} reveal reveal-delay-${i + 1}`} key={card.label}>
              <div className="impact-num">
                {card.num}
                <sup style={{ fontSize: ".45em" }}>{card.suffix}</sup>
              </div>
              <div className="impact-label">{card.label}</div>
              <div className="impact-desc">{card.desc}</div>
            </div>
          ))}
          <div className="impact-card impact-event reveal">
            <div>
              <div className="impact-num">{impact.event.num}</div>
              <div className="impact-label">{impact.event.label}</div>
              <div className="impact-desc">{impact.event.desc}</div>
              <div className="impact-event-partners" style={{ marginTop: "16px" }}>
                {impact.event.partners.map((p) => (
                  <span key={p}>{p}</span>
                ))}
              </div>
            </div>
            <div className="impact-event-meta">
              <div className="meta-date">{impact.event.date}</div>
              <div className="meta-place">{impact.event.place}</div>
            </div>
          </div>
        </div>
      </section>

      <section id="explore">
        <span className="section-tag reveal">Explore</span>
        <h2 className="section-title reveal">
          More of our <em>story</em>
        </h2>
        <p className="section-sub reveal">Everything above is just the headline. Here's where to go next.</p>
        <div className="explore-grid">
          <Link href="/programs" className="explore-card reveal reveal-delay-1">
            <Icon name="school" size={26} />
            <div className="explore-card-title">Programs</div>
            <div className="explore-card-desc">What we run, and who it's built for.</div>
          </Link>
          <Link href="/gallery" className="explore-card reveal reveal-delay-2">
            <Icon name="image" size={26} />
            <div className="explore-card-title">Gallery</div>
            <div className="explore-card-desc">Photos and clips from the field.</div>
          </Link>
          <Link href="/blog" className="explore-card reveal reveal-delay-3">
            <Icon name="book-marked" size={26} />
            <div className="explore-card-title">Blog</div>
            <div className="explore-card-desc">Weekly updates and program recaps.</div>
          </Link>
          <Link href="/team" className="explore-card reveal reveal-delay-4">
            <Icon name="users" size={26} />
            <div className="explore-card-title">Team</div>
            <div className="explore-card-desc">The people doing the work.</div>
          </Link>
        </div>
      </section>
    </>
  );
}
