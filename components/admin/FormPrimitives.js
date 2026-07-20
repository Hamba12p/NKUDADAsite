"use client";

import { Plus, Trash2 } from "lucide-react";

export function Field({ label, value, onChange, textarea, type = "text" }) {
  return (
    <div className="admin-field">
      <label>{label}</label>
      {textarea ? (
        <textarea value={value ?? ""} onChange={(e) => onChange(e.target.value)} />
      ) : (
        <input type={type} value={value ?? ""} onChange={(e) => onChange(e.target.value)} />
      )}
    </div>
  );
}

export function FieldRow({ children }) {
  return <div className="admin-field-row">{children}</div>;
}

export function Checkbox({ label, checked, onChange }) {
  return (
    <label className="admin-checkbox-row">
      <input type="checkbox" checked={!!checked} onChange={(e) => onChange(e.target.checked)} />
      {label}
    </label>
  );
}

export function Card({ title, children }) {
  return (
    <div className="admin-card">
      <div className="admin-card-title">{title}</div>
      {children}
    </div>
  );
}

// Editor for an array of objects, e.g. team members, stats, contact items.
export function ObjectListEditor({ items, onChange, fields, addTemplate, itemLabel }) {
  const list = items || [];

  function updateItem(idx, key, value) {
    const next = list.slice();
    next[idx] = { ...next[idx], [key]: value };
    onChange(next);
  }
  function removeItem(idx) {
    onChange(list.filter((_, i) => i !== idx));
  }
  function addItem() {
    onChange([...list, { ...addTemplate }]);
  }

  return (
    <div>
      {list.map((item, idx) => (
        <div className="admin-list-item" key={idx}>
          <button
            type="button"
            className="admin-list-remove"
            onClick={() => removeItem(idx)}
            aria-label={`Remove ${itemLabel || "item"} ${idx + 1}`}
          >
            <Trash2 size={15} />
          </button>
          {fields.map((f) => (
            <Field
              key={f.key}
              label={f.label}
              value={item[f.key]}
              textarea={f.textarea}
              onChange={(v) => updateItem(idx, f.key, v)}
            />
          ))}
        </div>
      ))}
      <button type="button" className="admin-add-btn" onClick={addItem}>
        <Plus size={14} /> Add {itemLabel || "item"}
      </button>
    </div>
  );
}

// Editor for an array of plain strings, e.g. body paragraphs, tags, partners.
export function StringListEditor({ label, items, onChange, textarea, itemLabel }) {
  const list = items || [];

  function update(idx, value) {
    const next = list.slice();
    next[idx] = value;
    onChange(next);
  }
  function remove(idx) {
    onChange(list.filter((_, i) => i !== idx));
  }
  function add() {
    onChange([...list, ""]);
  }

  return (
    <div className="admin-field">
      {label && <label>{label}</label>}
      {list.map((v, idx) => (
        <div key={idx} style={{ display: "flex", gap: "8px", marginBottom: "8px", alignItems: "flex-start" }}>
          {textarea ? (
            <textarea value={v} onChange={(e) => update(idx, e.target.value)} style={{ flex: 1 }} />
          ) : (
            <input value={v} onChange={(e) => update(idx, e.target.value)} style={{ flex: 1 }} />
          )}
          <button
            type="button"
            className="admin-icon-btn danger"
            onClick={() => remove(idx)}
            aria-label={`Remove ${itemLabel || "item"} ${idx + 1}`}
          >
            <Trash2 size={14} />
          </button>
        </div>
      ))}
      <button type="button" className="admin-add-btn" onClick={add}>
        <Plus size={14} /> Add {itemLabel || "item"}
      </button>
    </div>
  );
}

export function setPath(obj, path, value) {
  const [head, ...rest] = path;
  if (rest.length === 0) return { ...obj, [head]: value };
  return { ...obj, [head]: setPath(obj[head] || {}, rest, value) };
}
