"use client";

import { useState } from "react";
import { Save, CheckCircle2, AlertCircle, Trash2, Plus, ArrowUp, ArrowDown } from "lucide-react";
import { Field, FieldRow, Card, Checkbox } from "./FormPrimitives";
import ImagePreview from "./ImagePreview";
import { resolveStoreImageSource } from "@/lib/image-path";

const emptyItem = {
  id: "",
  name: "New product",
  category: "Accessories",
  price: null,
  currency: "UGX",
  sizes: [],
  description: "",
  image: "",
  shareImage: "",
  inStock: true
};

export default function StoreEditor({ initialData }) {
  const [data, setData] = useState(initialData);
  const [status, setStatus] = useState("idle");
  const [message, setMessage] = useState("");

  function updateMeta(key, value) {
    setData((prev) => ({ ...prev, meta: { ...prev.meta, [key]: value } }));
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
      items: [...prev.items, { ...emptyItem, id: `nk-item-${Date.now()}` }]
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
      const normalizedData = {
        ...data,
        meta: {
          ...data.meta,
          whatsappNumber: String(data.meta.whatsappNumber || "").replace(/\D/g, ""),
          heroImage: resolveStoreImageSource(data.meta.heroImage)
        },
        items: data.items.map((item) => ({
          ...item,
          price: item.price === "" || item.price == null ? null : Number(item.price),
          sizes: (item.sizes || []).map((size) => String(size).trim()).filter(Boolean),
          image: resolveStoreImageSource(item.image),
          shareImage: resolveStoreImageSource(item.shareImage)
        }))
      };
      const res = await fetch("/api/admin/store", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(normalizedData)
      });
      const result = await res.json();
      if (!res.ok) {
        setStatus("error");
        setMessage(result.error || "Save failed.");
        return;
      }
      setData(normalizedData);
      setStatus("success");
      setMessage("Saved. Your site will rebuild and update in about a minute.");
    } catch {
      setStatus("error");
      setMessage("Network error — try again.");
    }
  }

  return (
    <div>
      <h1 className="admin-page-title">Store</h1>
      <p className="admin-page-sub">
        Shape the collection, update ordering details and prepare product imagery for the next drop.
      </p>

      <Card title="Page settings">
        <FieldRow>
          <Field label="Section tag" value={data.meta.tag} onChange={(v) => updateMeta("tag", v)} />
          <Field label="Title" value={data.meta.title} onChange={(v) => updateMeta("title", v)} />
        </FieldRow>
        <Field label="Subtitle" value={data.meta.subtitle} onChange={(v) => updateMeta("subtitle", v)} />
        <FieldRow>
          <Field label="WhatsApp number (digits only)" value={data.meta.whatsappNumber} onChange={(v) => updateMeta("whatsappNumber", v)} />
          <Field label="Instagram handle" value={data.meta.instagramHandle} onChange={(v) => updateMeta("instagramHandle", v)} />
        </FieldRow>
        <Field label="Instagram URL" value={data.meta.instagramUrl} onChange={(v) => updateMeta("instagramUrl", v)} />
        <Field label="Hero image filename, path or URL" value={data.meta.heroImage} onChange={(v) => updateMeta("heroImage", v)} />
        <ImagePreview value={resolveStoreImageSource(data.meta.heroImage)} alt="Store hero preview" />
        <Field label="Store note" value={data.meta.note} textarea onChange={(v) => updateMeta("note", v)} />
      </Card>

      <Card title={`Items (${data.items.length})`}>
        {data.items.map((item, idx) => (
          <div className="admin-list-item" key={item.id || idx}>
            <div style={{ position: "absolute", top: "12px", right: "48px", display: "flex", gap: "4px" }}>
              <button type="button" className="admin-icon-btn" onClick={() => move(idx, -1)} aria-label={`Move ${item.name} up`}>
                <ArrowUp size={13} />
              </button>
              <button type="button" className="admin-icon-btn" onClick={() => move(idx, 1)} aria-label={`Move ${item.name} down`}>
                <ArrowDown size={13} />
              </button>
            </div>
            <button type="button" className="admin-list-remove" onClick={() => removeItem(idx)} aria-label={`Remove ${item.name}`}>
              <Trash2 size={15} />
            </button>

            <FieldRow>
              <Field label="Name" value={item.name} onChange={(v) => updateItem(idx, "name", v)} />
              <Field label="Category" value={item.category} onChange={(v) => updateItem(idx, "category", v)} />
            </FieldRow>
            <FieldRow>
              <Field label="Price (leave empty if not set)" type="number" value={item.price} onChange={(v) => updateItem(idx, "price", v)} />
              <Field label="Currency" value={item.currency} onChange={(v) => updateItem(idx, "currency", v)} />
            </FieldRow>
            <Field
              label="Sizes (comma separated; leave empty for one size)"
              value={(item.sizes || []).join(", ")}
              onChange={(v) => updateItem(idx, "sizes", v.split(",").map((size) => size.trim()).filter(Boolean))}
            />
            <Field label="Description" value={item.description} textarea onChange={(v) => updateItem(idx, "description", v)} />
            <Field label="Product image filename, path or URL" value={item.image} onChange={(v) => updateItem(idx, "image", v)} />
            <ImagePreview value={resolveStoreImageSource(item.image)} alt={`${item.name} product preview`} />
            <Field label="Share image filename, path or URL" value={item.shareImage} onChange={(v) => updateItem(idx, "shareImage", v)} />
            <ImagePreview value={resolveStoreImageSource(item.shareImage)} alt={`${item.name} share preview`} />
            <Checkbox label="In stock" checked={item.inStock} onChange={(v) => updateItem(idx, "inStock", v)} />
          </div>
        ))}
        <button type="button" className="admin-add-btn" onClick={addItem}>
          <Plus size={14} /> Add item
        </button>
        <p style={{ fontSize: "12px", color: "var(--muted)", marginTop: "12px", lineHeight: 1.6 }}>
          To add product or share images, upload them to <code>public/storefront</code> in the GitHub repo,
          then reference the filename here (e.g. <code>classic-tee.jpg</code>). Leave the field blank to show
          a placeholder until the photo is ready.
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
