import { getSiteContent } from "@/lib/content";
import { Icon } from "@/components/icons";

export const metadata = { title: "Our Story — NK Udada Foundation" };

export default function AboutPage() {
  const { about } = getSiteContent();

  return (
    <section id="about" className="section-first">
      <div className="about-bg"></div>
      <div className="about-grid">
        <div>
          <span className="section-tag">{about.tag}</span>
          <blockquote className="about-quote">
            "{about.quote}"
            <cite>— {about.quoteCite}</cite>
          </blockquote>
          <div className="about-body">
            {about.body.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
        </div>
        <div>
          <span className="section-tag" style={{ display: "block", marginBottom: "18px" }}>
            {about.pillarsTag}
          </span>
          <div className="about-pillars">
            {about.pillars.map((pillar) => (
              <div className="pillar" key={pillar.title}>
                <div className="pillar-icon">
                  <Icon name={pillar.icon} size={20} />
                </div>
                <div>
                  <div className="pillar-title">{pillar.title}</div>
                  <div className="pillar-desc">{pillar.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
