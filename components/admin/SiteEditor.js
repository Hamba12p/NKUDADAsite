"use client";

import { useState } from "react";
import { Save, CheckCircle2, AlertCircle } from "lucide-react";
import { Field, FieldRow, Checkbox, Card, ObjectListEditor, StringListEditor, setPath } from "./FormPrimitives";

export default function SiteEditor({ initialData }) {
  const [data, setData] = useState(initialData);
  const [status, setStatus] = useState("idle"); // idle | saving | success | error
  const [message, setMessage] = useState("");

  function update(path) {
    return (value) => setData((prev) => setPath(prev, path, value));
  }

  async function handleSave() {
    setStatus("saving");
    setMessage("");
    try {
      const res = await fetch("/api/admin/site", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      });
      const result = await res.json();
      if (!res.ok) {
        setStatus("error");
        setMessage(result.error || "Save failed.");
        return;
      }
      setStatus("success");
      setMessage("Saved. Your site will rebuild and update in about a minute.");
    } catch (err) {
      setStatus("error");
      setMessage("Network error — try again.");
    }
  }

  return (
    <div>
      <h1 className="admin-page-title">Site Content</h1>
      <p className="admin-page-sub">Edit the text used across every page. Save once you're done with a section, or keep editing and save at the end.</p>

      <Card title="Meta">
        <Field label="Site name" value={data.meta.siteName} onChange={update(["meta", "siteName"])} />
        <Field label="Tagline" value={data.meta.tagline} onChange={update(["meta", "tagline"])} />
        <Field label="Browser tab title" value={data.meta.title} onChange={update(["meta", "title"])} />
        <Field label="Meta description" value={data.meta.description} textarea onChange={update(["meta", "description"])} />
      </Card>

      <Card title="Hero (home page)">
        <Field label="Eyebrow badge" value={data.hero.eyebrow} onChange={update(["hero", "eyebrow"])} />
        <FieldRow>
          <Field label="Title — line 1 (italic)" value={data.hero.titleLine1} onChange={update(["hero", "titleLine1"])} />
          <Field label="Title — line 2" value={data.hero.titleLine2} onChange={update(["hero", "titleLine2"])} />
        </FieldRow>
        <Field label="Title — line 3 (underlined)" value={data.hero.titleLine3} onChange={update(["hero", "titleLine3"])} />
        <Field label="Subtitle" value={data.hero.subtitle} textarea onChange={update(["hero", "subtitle"])} />
        <FieldRow>
          <Field label="Primary button label" value={data.hero.primaryCta.label} onChange={update(["hero", "primaryCta", "label"])} />
          <Field label="Primary button link" value={data.hero.primaryCta.href} onChange={update(["hero", "primaryCta", "href"])} />
        </FieldRow>
        <FieldRow>
          <Field label="Secondary button label" value={data.hero.secondaryCta.label} onChange={update(["hero", "secondaryCta", "label"])} />
          <Field label="Secondary button link" value={data.hero.secondaryCta.href} onChange={update(["hero", "secondaryCta", "href"])} />
        </FieldRow>

        <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "var(--muted)", textTransform: "uppercase", letterSpacing: ".06em", margin: "20px 0 8px" }}>
          Stats
        </label>
        <ObjectListEditor
          itemLabel="stat"
          items={data.hero.stats}
          onChange={update(["hero", "stats"])}
          addTemplate={{ value: "0", suffix: "", label: "New stat" }}
          fields={[
            { key: "value", label: "Value" },
            { key: "suffix", label: "Suffix (e.g. +)" },
            { key: "label", label: "Label" }
          ]}
        />

        <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "var(--muted)", textTransform: "uppercase", letterSpacing: ".06em", margin: "20px 0 8px" }}>
          Highlight card
        </label>
        <Field label="Tag" value={data.hero.highlightCard.tag} onChange={update(["hero", "highlightCard", "tag"])} />
        <Field label="Title" value={data.hero.highlightCard.title} onChange={update(["hero", "highlightCard", "title"])} />
        <Field label="Body" value={data.hero.highlightCard.body} textarea onChange={update(["hero", "highlightCard", "body"])} />
        <ObjectListEditor
          itemLabel="highlight item"
          items={data.hero.highlightCard.items}
          onChange={update(["hero", "highlightCard", "items"])}
          addTemplate={{ color: "purple", text: "New item" }}
          fields={[
            { key: "text", label: "Text" },
            { key: "color", label: "Dot color (purple/green/gold/rust)" }
          ]}
        />

        <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "var(--muted)", textTransform: "uppercase", letterSpacing: ".06em", margin: "20px 0 8px" }}>
          Floating badges
        </label>
        <ObjectListEditor
          itemLabel="badge"
          items={data.hero.floatBadges}
          onChange={update(["hero", "floatBadges"])}
          addTemplate={{ icon: "sparkle", label: "Label", value: "Value" }}
          fields={[
            { key: "label", label: "Label" },
            { key: "value", label: "Value" },
            { key: "icon", label: "Icon name" }
          ]}
        />
      </Card>

      <Card title="About / Our Story">
        <Field label="Section tag" value={data.about.tag} onChange={update(["about", "tag"])} />
        <Field label="Quote" value={data.about.quote} textarea onChange={update(["about", "quote"])} />
        <Field label="Quote attribution" value={data.about.quoteCite} onChange={update(["about", "quoteCite"])} />
        <StringListEditor
          label="Body paragraphs"
          items={data.about.body}
          onChange={update(["about", "body"])}
          textarea
          itemLabel="paragraph"
        />
        <Field label="Pillars tag" value={data.about.pillarsTag} onChange={update(["about", "pillarsTag"])} />
        <ObjectListEditor
          itemLabel="pillar"
          items={data.about.pillars}
          onChange={update(["about", "pillars"])}
          addTemplate={{ icon: "sparkle", title: "New pillar", desc: "" }}
          fields={[
            { key: "title", label: "Title" },
            { key: "desc", label: "Description", textarea: true },
            { key: "icon", label: "Icon name" }
          ]}
        />
      </Card>

      <Card title="Impact">
        <Field label="Section tag" value={data.impact.tag} onChange={update(["impact", "tag"])} />
        <FieldRow>
          <Field label="Title line" value={data.impact.titleLine1} onChange={update(["impact", "titleLine1"])} />
          <Field label="Title emphasis" value={data.impact.titleEm} onChange={update(["impact", "titleEm"])} />
        </FieldRow>
        <Field label="Subtitle" value={data.impact.subtitle} textarea onChange={update(["impact", "subtitle"])} />
        <ObjectListEditor
          itemLabel="impact card"
          items={data.impact.cards}
          onChange={update(["impact", "cards"])}
          addTemplate={{ num: "0", suffix: "+", label: "New stat", desc: "" }}
          fields={[
            { key: "num", label: "Number" },
            { key: "suffix", label: "Suffix" },
            { key: "label", label: "Label" },
            { key: "desc", label: "Description", textarea: true }
          ]}
        />

        <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "var(--muted)", textTransform: "uppercase", letterSpacing: ".06em", margin: "20px 0 8px" }}>
          Featured event
        </label>
        <FieldRow>
          <Field label="Number" value={data.impact.event.num} onChange={update(["impact", "event", "num"])} />
          <Field label="Date" value={data.impact.event.date} onChange={update(["impact", "event", "date"])} />
        </FieldRow>
        <Field label="Label" value={data.impact.event.label} onChange={update(["impact", "event", "label"])} />
        <Field label="Description" value={data.impact.event.desc} textarea onChange={update(["impact", "event", "desc"])} />
        <Field label="Place" value={data.impact.event.place} onChange={update(["impact", "event", "place"])} />
        <StringListEditor
          label="Partner organisations"
          items={data.impact.event.partners}
          onChange={update(["impact", "event", "partners"])}
          itemLabel="partner"
        />
      </Card>

      <Card title="Programs">
        <Field label="Section tag" value={data.programs.tag} onChange={update(["programs", "tag"])} />
        <FieldRow>
          <Field label="Title line" value={data.programs.titleLine1} onChange={update(["programs", "titleLine1"])} />
          <Field label="Title emphasis" value={data.programs.titleEm} onChange={update(["programs", "titleEm"])} />
        </FieldRow>
        <Field label="Subtitle" value={data.programs.subtitle} textarea onChange={update(["programs", "subtitle"])} />

        <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "var(--muted)", textTransform: "uppercase", letterSpacing: ".06em", margin: "20px 0 8px" }}>
          Featured programme
        </label>
        <FieldRow>
          <Field label="SDG tag" value={data.programs.featured.sdg} onChange={update(["programs", "featured", "sdg"])} />
          <Field label="Icon name" value={data.programs.featured.icon} onChange={update(["programs", "featured", "icon"])} />
        </FieldRow>
        <Field label="Title" value={data.programs.featured.title} onChange={update(["programs", "featured", "title"])} />
        <Field label="Description" value={data.programs.featured.desc} textarea onChange={update(["programs", "featured", "desc"])} />
        <Field label="Session topics title" value={data.programs.featured.sessionTopicsTitle} onChange={update(["programs", "featured", "sessionTopicsTitle"])} />
        <ObjectListEditor
          itemLabel="session topic"
          items={data.programs.featured.sessionTopics}
          onChange={update(["programs", "featured", "sessionTopics"])}
          addTemplate={{ icon: "sparkle", text: "New topic" }}
          fields={[
            { key: "text", label: "Text" },
            { key: "icon", label: "Icon name" }
          ]}
        />

        <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "var(--muted)", textTransform: "uppercase", letterSpacing: ".06em", margin: "20px 0 8px" }}>
          Other programme cards
        </label>
        {data.programs.cards.map((card, idx) => (
          <div className="admin-list-item" key={idx}>
            <FieldRow>
              <Field label="Title" value={card.title} onChange={(v) => {
                const next = data.programs.cards.slice();
                next[idx] = { ...next[idx], title: v };
                update(["programs", "cards"])(next);
              }} />
              <Field label="SDG tag" value={card.sdg} onChange={(v) => {
                const next = data.programs.cards.slice();
                next[idx] = { ...next[idx], sdg: v };
                update(["programs", "cards"])(next);
              }} />
            </FieldRow>
            <Field label="Icon name" value={card.icon} onChange={(v) => {
              const next = data.programs.cards.slice();
              next[idx] = { ...next[idx], icon: v };
              update(["programs", "cards"])(next);
            }} />
            <Field label="Description" value={card.desc} textarea onChange={(v) => {
              const next = data.programs.cards.slice();
              next[idx] = { ...next[idx], desc: v };
              update(["programs", "cards"])(next);
            }} />
            <StringListEditor
              label="Tags"
              items={card.tags}
              itemLabel="tag"
              onChange={(v) => {
                const next = data.programs.cards.slice();
                next[idx] = { ...next[idx], tags: v };
                update(["programs", "cards"])(next);
              }}
            />
          </div>
        ))}
      </Card>

      <Card title="Team">
        <Field label="Section tag" value={data.team.tag} onChange={update(["team", "tag"])} />
        <FieldRow>
          <Field label="Title line" value={data.team.titleLine1} onChange={update(["team", "titleLine1"])} />
          <Field label="Title emphasis" value={data.team.titleEm} onChange={update(["team", "titleEm"])} />
        </FieldRow>
        <Field label="Subtitle" value={data.team.subtitle} textarea onChange={update(["team", "subtitle"])} />
        <ObjectListEditor
          itemLabel="team member"
          items={data.team.members}
          onChange={update(["team", "members"])}
          addTemplate={{ initials: "XX", name: "New member", role: "Role", color: "purple", founder: false }}
          fields={[
            { key: "name", label: "Name" },
            { key: "role", label: "Role" },
            { key: "initials", label: "Initials" },
            { key: "color", label: "Avatar color (purple/green/rust/gold/purple-lt)" }
          ]}
        />
        <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "var(--muted)", textTransform: "uppercase", letterSpacing: ".06em", margin: "20px 0 8px" }}>
          "Join the team" card
        </label>
        <Field label="Title" value={data.team.joinCard.title} onChange={update(["team", "joinCard", "title"])} />
        <Field label="Description" value={data.team.joinCard.desc} textarea onChange={update(["team", "joinCard", "desc"])} />
        <Field label="Button label" value={data.team.joinCard.cta} onChange={update(["team", "joinCard", "cta"])} />
      </Card>

      <Card title="Volunteer">
        <Field label="Section tag" value={data.volunteer.tag} onChange={update(["volunteer", "tag"])} />
        <FieldRow>
          <Field label="Title line" value={data.volunteer.titleLine1} onChange={update(["volunteer", "titleLine1"])} />
          <Field label="Title emphasis" value={data.volunteer.titleEm} onChange={update(["volunteer", "titleEm"])} />
        </FieldRow>
        <Field label="Subtitle" value={data.volunteer.subtitle} textarea onChange={update(["volunteer", "subtitle"])} />
        <ObjectListEditor
          itemLabel="perk"
          items={data.volunteer.perks}
          onChange={update(["volunteer", "perks"])}
          addTemplate={{ icon: "sparkle", text: "New perk" }}
          fields={[
            { key: "text", label: "Text" },
            { key: "icon", label: "Icon name" }
          ]}
        />
        <FieldRow>
          <Field label="CTA button label" value={data.volunteer.cta.label} onChange={update(["volunteer", "cta", "label"])} />
          <Field label="CTA email" value={data.volunteer.cta.email} onChange={update(["volunteer", "cta", "email"])} />
        </FieldRow>
        <Field label="CTA email subject" value={data.volunteer.cta.subject} onChange={update(["volunteer", "cta", "subject"])} />
        <Field label="Form title" value={data.volunteer.formTitle} onChange={update(["volunteer", "formTitle"])} />
        <StringListEditor
          label="Areas of interest (dropdown options)"
          items={data.volunteer.areasOfInterest}
          onChange={update(["volunteer", "areasOfInterest"])}
          itemLabel="area"
        />
        <Field label="Formspree endpoint" value={data.volunteer.formEndpoint} onChange={update(["volunteer", "formEndpoint"])} />
        <Field label="Form note" value={data.volunteer.formNote} textarea onChange={update(["volunteer", "formNote"])} />
        <FieldRow>
          <Field label="Success title" value={data.volunteer.successTitle} onChange={update(["volunteer", "successTitle"])} />
        </FieldRow>
        <Field label="Success message" value={data.volunteer.successBody} textarea onChange={update(["volunteer", "successBody"])} />
      </Card>

      <Card title="Contact">
        <Field label="Title" value={data.contact.title} onChange={update(["contact", "title"])} />
        <Field label="Subtitle" value={data.contact.subtitle} textarea onChange={update(["contact", "subtitle"])} />
        <ObjectListEditor
          itemLabel="contact item"
          items={data.contact.items}
          onChange={update(["contact", "items"])}
          addTemplate={{ icon: "mail", label: "New item", value: "", href: "" }}
          fields={[
            { key: "label", label: "Label" },
            { key: "value", label: "Displayed value" },
            { key: "href", label: "Link (leave blank if none)" },
            { key: "icon", label: "Icon name" }
          ]}
        />
        <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "var(--muted)", textTransform: "uppercase", letterSpacing: ".06em", margin: "20px 0 8px" }}>
          Social links
        </label>
        <ObjectListEditor
          itemLabel="social link"
          items={data.contact.socials}
          onChange={update(["contact", "socials"])}
          addTemplate={{ icon: "sparkle", label: "New link", href: "" }}
          fields={[
            { key: "label", label: "Label" },
            { key: "href", label: "URL" },
            { key: "icon", label: "Icon name" }
          ]}
        />
        <Field label="SDG title" value={data.contact.sdgTitle} onChange={update(["contact", "sdgTitle"])} />
        <Field label="Donate section title" value={data.contact.donateTitle} onChange={update(["contact", "donateTitle"])} />
        <FieldRow>
          <Field label="Donate button label" value={data.contact.donateCta} onChange={update(["contact", "donateCta"])} />
          <Field label="Donate link" value={data.contact.donateHref} onChange={update(["contact", "donateHref"])} />
        </FieldRow>
        <Field label="Donate note" value={data.contact.donateNote} textarea onChange={update(["contact", "donateNote"])} />
      </Card>

      <Card title="Footer & Navigation">
        <Field label="Copyright line" value={data.footer.copy} onChange={update(["footer", "copy"])} />
        <ObjectListEditor
          itemLabel="footer link"
          items={data.footer.links}
          onChange={update(["footer", "links"])}
          addTemplate={{ label: "New link", href: "/" }}
          fields={[
            { key: "label", label: "Label" },
            { key: "href", label: "Link" }
          ]}
        />
        <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "var(--muted)", textTransform: "uppercase", letterSpacing: ".06em", margin: "20px 0 8px" }}>
          Nav links
        </label>
        <ObjectListEditor
          itemLabel="nav link"
          items={data.nav.links}
          onChange={update(["nav", "links"])}
          addTemplate={{ label: "New link", href: "/" }}
          fields={[
            { key: "label", label: "Label" },
            { key: "href", label: "Link" }
          ]}
        />
        <FieldRow>
          <Field label="Nav CTA label" value={data.nav.cta.label} onChange={update(["nav", "cta", "label"])} />
          <Field label="Nav CTA link" value={data.nav.cta.href} onChange={update(["nav", "cta", "href"])} />
        </FieldRow>
      </Card>

      <div className="admin-save-bar">
        <button className="admin-save-btn" onClick={handleSave} disabled={status === "saving"}>
          <Save size={15} /> {status === "saving" ? "Saving…" : "Save changes"}
        </button>
        {status === "success" && (
          <span className="admin-save-status success"><CheckCircle2 size={14} style={{ verticalAlign: "-2px", marginRight: "4px" }} />{message}</span>
        )}
        {status === "error" && (
          <span className="admin-save-status error"><AlertCircle size={14} style={{ verticalAlign: "-2px", marginRight: "4px" }} />{message}</span>
        )}
      </div>
    </div>
  );
}
