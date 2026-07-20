"use client";

import { useState } from "react";
import { Save, CheckCircle2, AlertCircle, Trash2, Plus, ArrowUp, ArrowDown } from "lucide-react";
import { Field, FieldRow, Card } from "./FormPrimitives";

const emptyItem = { id: "", type: "image", src: "", caption: "", category: "" };

export default function GalleryEditor({ initialData }) {
  const [data, setData] = useState(initialData);
  const [status, setStatus] = useState("idle");
  const [message, setMessage] = useState("");

  function updateMeta(key, value) {
    setData((prev) => ({ ...prev, [key]: value }));
  }

  function updateItem(idx, key, value) {
    setData((prev) => {
      const items = prev.items.slice();
      items[idx] = { ...items[idx], [key]: value };
      return { ...prev, items };
    });
  }

  function removeItem(idx) {
    setData((prev) => ({ ...prev, items: prev.items.filter((_, i) => i !== idx) }));
  }

  function addItem() {
    setData((prev) => ({
      ...prev,
      items: [...prev.items, { ...emptyItem, id: `item-${Date.now()}` }]
    }));
  }

  function move(idx, dir) {
    setData((prev) => {
      const items = prev.items.slice();
      const target = idx + dir;
      if (target < 0 || target >= items.length) return prev;
      [items[idx], items[target]] = [items[target], items[idx]];
      return { ...prev, items };
    });
  }

  async function handleSave() {
    setStatus("saving");
    setMessage("");
    try {
      const res = await fetch("/api/admin/gallery", {
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
    } catch {
      setStatus("error");
      setMessage("Network error — try again.");
    }
  }

  return (
    <div>
      <h1 className="admin-page-title">Gallery</h1>
      <p className="admin-page-sub">
        Edit captions and categories for existing photos and clips, reorder them, or add new items by path/URL.
      </p>

      <Card title="Page text">
        <Field label="Section tag" value={data.tag} onChange={(v) => updateMeta("tag", v)} />
        <Field label="Title" value={data.title} onChange={(v) => updateMeta("title", v)} />
        <Field label="Subtitle" value={data.subtitle} textarea onChange={(v) => updateMeta("subtitle", v)} />
        <Field label="Note (shown below the gallery)" value={data.note} onChange={(v) => updateMeta("note", v)} />
      </Card>

      <Card title={`Items (${data.items.length})`}>
        {data.items.map((item, idx) => (
          <div className="admin-list-item" key={item.id || idx}>
            <div style={{ position: "absolute", top: "12px", right: "48px", display: "flex", gap: "4px" }}>
              <button type="button" className="admin-icon-btn" onClick={() => move(idx, -1)} aria-label="Move up">
                <ArrowUp size={13} />
              </button>
              <button type="button" className="admin-icon-btn" onClick={() => move(idx, 1)} aria-label="Move down">
                <ArrowDown size={13} />
              </button>
            </div>
            <button type="button" className="admin-list-remove" onClick={() => removeItem(idx)} aria-label="Remove item">
              <Trash2 size={15} />
            </button>
            <FieldRow>
              <Field label="Source path or URL" value={item.src} onChange={(v) => updateItem(idx, "src", v)} />
              <div className="admin-field">
                <label>Type</label>
                <select value={item.type} onChange={(e) => updateItem(idx, "type", e.target.value)}>
                  <option value="image">Image</option>
                  <option value="video">Video</option>
                </select>
              </div>
            </FieldRow>
            <FieldRow>
              <Field label="Category" value={item.category} onChange={(v) => updateItem(idx, "category", v)} />
              <Field label="Caption (optional)" value={item.caption} onChange={(v) => updateItem(idx, "caption", v)} />
            </FieldRow>
            {item.type === "image" && item.src && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={item.src} alt="" style={{ maxWidth: "160px", borderRadius: "8px", marginTop: "6px" }} />
            )}
          </div>
        ))}
        <button type="button" className="admin-add-btn" onClick={addItem}>
          <Plus size={14} /> Add item
        </button>
        <p style={{ fontSize: "12px", color: "var(--muted)", marginTop: "12px" }}>
          To add a brand-new photo or video file, upload it to <code>public/assets/images</code> or{" "}
          <code>public/assets/videos</code> in the GitHub repo, then reference its path here (e.g.{" "}
          <code>/assets/images/new-photo.jpg</code>).
        </p>
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
