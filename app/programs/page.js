import { getSiteContent } from "@/lib/content";
import { Icon } from "@/components/icons";

export const metadata = { title: "Programs — NK Udada Foundation" };

export default function ProgramsPage() {
  const { programs } = getSiteContent();
  const { featured } = programs;

  return (
    <section id="programs" className="section-first">
      <span className="section-tag reveal">{programs.tag}</span>
      <h2 className="section-title reveal">
        {programs.titleLine1}
        <br />
        <em>{programs.titleEm}</em>
      </h2>
      <p className="section-sub reveal">{programs.subtitle}</p>

      <div className="programs-grid">
        <div className="program-card featured reveal">
          <div>
            <div className="prog-icon">
              <Icon name={featured.icon} size={36} />
            </div>
            <span
              className="prog-sdg"
              style={{ color: "var(--gold-lt)", background: "rgba(200,146,42,.15)", borderColor: "rgba(200,146,42,.3)" }}
            >
              {featured.sdg}
            </span>
            <div className="prog-title" style={{ color: "#fff" }}>{featured.title}</div>
            <div className="prog-desc" style={{ color: "rgba(255,255,255,.8)" }}>{featured.desc}</div>
            <div className="prog-tags"></div>
          </div>
          <div>
            <div className="session-topics-box">
              <div className="session-topics-title">{featured.sessionTopicsTitle}</div>
              <div>
                {featured.sessionTopics.map((topic) => (
                  <div className="session-topic-row" key={topic.text}>
                    <Icon name={topic.icon} size={18} /> {topic.text}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {programs.cards.map((card, i) => (
          <div className={`program-card reveal reveal-delay-${i + 1}`} key={card.title}>
            <span className="prog-sdg">{card.sdg}</span>
            <div className="prog-icon">
              <Icon name={card.icon} size={36} />
            </div>
            <div className="prog-title">{card.title}</div>
            <div className="prog-desc">{card.desc}</div>
            <div className="prog-tags">
              {card.tags.map((tag) => (
                <span className="prog-tag" key={tag}>{tag}</span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
