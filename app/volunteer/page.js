import { getSiteContent } from "@/lib/content";
import { Icon } from "@/components/icons";
import VolunteerForm from "@/components/VolunteerForm";

export const metadata = { title: "Volunteer — NK Udada Foundation" };

export default function VolunteerPage() {
  const { volunteer } = getSiteContent();

  return (
    <section id="volunteer" className="section-first">
      <div className="volunteer-bg"></div>
      <div className="volunteer-inner">
        <div>
          <span className="section-tag" style={{ color: "var(--gold-lt)" }}>{volunteer.tag}</span>
          <h2 className="volunteer-title">
            {volunteer.titleLine1}
            <br />
            <em>{volunteer.titleEm}</em>
          </h2>
          <p className="volunteer-sub">{volunteer.subtitle}</p>
          <div className="vol-perks">
            {volunteer.perks.map((perk) => (
              <div className="vol-perk" key={perk.text}>
                <div className="vol-perk-icon">
                  <Icon name={perk.icon} size={18} />
                </div>
                {perk.text}
              </div>
            ))}
          </div>
          <a
            href={`mailto:${volunteer.cta.email}?subject=${encodeURIComponent(volunteer.cta.subject)}`}
            className="btn-gold"
          >
            {volunteer.cta.label} →
          </a>
          <p style={{ marginTop: "16px", fontSize: "13px", color: "rgba(255,255,255,.4)" }}>Or fill in the form →</p>
        </div>

        <div>
          <div className="vol-form-card">
            <div className="vol-form-title">{volunteer.formTitle}</div>
            <VolunteerForm volunteer={volunteer} />
          </div>
        </div>
      </div>
    </section>
  );
}
