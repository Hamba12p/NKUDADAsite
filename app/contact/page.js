import { getSiteContent } from "@/lib/content";
import { Icon } from "@/components/icons";

export const metadata = { title: "Contact — NK Udada Foundation" };

export default function ContactPage() {
  const { contact } = getSiteContent();

  return (
    <section id="contact" className="section-first">
      <div className="contact-grid">
        <div>
          <h2 className="contact-title">{contact.title}</h2>
          <p className="contact-sub">{contact.subtitle}</p>
          <div className="contact-items">
            {contact.items.map((item) => (
              <div className="contact-item" key={item.label}>
                <div className="contact-item-icon">
                  <Icon name={item.icon} size={18} />
                </div>
                <div>
                  <div className="contact-item-label">{item.label}</div>
                  {item.href ? (
                    <a href={item.href} className="contact-item-val" target={item.href.startsWith("http") ? "_blank" : undefined} rel="noreferrer">
                      {item.value}
                    </a>
                  ) : (
                    <span className="contact-item-val">{item.value}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
          <div className="social-links">
            {contact.socials.map((social) => (
              <a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noreferrer"
                className="social-link"
                aria-label={social.label}
              >
                <Icon name={social.icon} size={18} />
              </a>
            ))}
          </div>
        </div>

        <div className="contact-sdgs">
          <div className="sdg-title">{contact.sdgTitle}</div>
          <div className="sdg-badges">
            {contact.sdgs.map((sdg) => (
              <div className={`sdg-badge ${sdg.cls}`} key={sdg.num}>
                <div className="sdg-badge-num">{sdg.num}</div>
                <div className="sdg-badge-text">{sdg.text}</div>
              </div>
            ))}
          </div>

          <div style={{ marginTop: "40px" }}>
            <div className="sdg-title">{contact.donateTitle}</div>
            <a href={contact.donateHref} target="_blank" rel="noreferrer" className="donate-btn">
              <Icon name="heart" size={18} /> &nbsp;{contact.donateCta} →
            </a>
            <p className="donate-note">{contact.donateNote}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
