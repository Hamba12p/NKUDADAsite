# Agent task: build the NK Udada Store (`/store`)

You're working in the existing NKUDADAsite Next.js 14 App Router repo. Read this whole spec before touching code. It follows the repo's existing patterns exactly (content-as-JSON, GitHub-backed admin saves, the admin editor primitives already in `components/admin/`), so nothing here should feel bolted on.

## 0. Repo housekeeping — do this first

The merch photos and lookbook reference image live in a folder called `storefront` at the **repo root**. Next.js can only serve static assets from `/public`, so before anything else:

```bash
git mv storefront public/storefront
```

Confirm the move didn't break anything referencing the old path (nothing should, since this is new). All storefront images going forward — product photos, share-card templates, whatever gets added later — live under `public/storefront/`.

---

## 1. Data model — `content/storefront.json`

New content file, same pattern as `content/gallery.json`. Structure:

```json
{
  "meta": {
    "tag": "NK Store",
    "title": "NK STORE",
    "subtitle": "Wear the mission.",
    "whatsappNumber": "256776866921",
    "instagramHandle": "thenkfoundation_",
    "instagramUrl": "https://instagram.com/thenkfoundation_",
    "heroImage": "",
    "note": "Every purchase supports NK Udada Foundation programs."
  },
  "items": [
    {
      "id": "nk-tee-001",
      "name": "Classic Logo Tee",
      "category": "Tees",
      "price": null,
      "currency": "UGX",
      "sizes": ["S", "M", "L", "XL"],
      "description": "",
      "image": "",
      "shareImage": "",
      "inStock": true
    }
  ]
}
```

Notes on the fields:

- `whatsappNumber` is stored digits-only, no `+`, no spaces (`256776866921`). Format it for display wherever needed; keep the stored value clean since it feeds directly into `wa.me` links.
- `price` starts `null` on every item. The admin will fill these in later. The public page must handle `null` gracefully (see §4).
- `image` and `shareImage` start as empty strings. Empty means "render a placeholder," not "broken image" — same convention `resolveImageSource` already uses elsewhere in the repo, so reuse it.
- `sizes`: empty array `[]` for items that don't need sizing (tote, water bottle, notebook, pin set). Non-empty array shows a size picker.

### The 11 items to seed

Realistic spread across apparel, accessories, and stationery — the kind of line an actual youth foundation would sell, not a random SKU list:

1. Classic Logo Tee — Tees — sizes S–XL
2. "Empower & Equip" Statement Tee — Tees — sizes S–XL
3. Ankara-Trim Tee — Tees — sizes S–XL
4. Foundation Crewneck Hoodie — Hoodies — sizes S–XL
5. Dad Cap (embroidered logo) — Caps — no sizes
6. Canvas Tote Bag — Totes — no sizes
7. Drawstring Bag — Totes — no sizes
8. Reusable Water Bottle — Accessories — no sizes
9. Enamel Pin Set — Accessories — no sizes
10. Support Wristband — Accessories — no sizes
11. Branded Notebook — Accessories — no sizes

Give each a one-line `description` in the same voice as the rest of the site's copy (warm, mission-forward, not salesy — look at `content/site.json`'s existing tone for reference). Leave `price` null and `image`/`shareImage` empty on all of them.

---

## 2. Admin: new "Store" tab

Mirror the Gallery admin flow exactly — it's the closest existing pattern (an array of items with an image field, edited via `ObjectListEditor`/custom rows, saved through a PUT route into GitHub).

**`app/api/admin/store/route.js`** — copy `app/api/admin/gallery/route.js` verbatim, swap the file path:

```js
import { NextResponse } from "next/server";
import { putFile } from "@/lib/github";

export async function PUT(request) {
  let content;
  try {
    content = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  try {
    await putFile("content/storefront.json", content, "Update store content via admin portal");
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
```

**`lib/content.js`** — add a getter next to `getGalleryContent`:

```js
export function getStorefrontContent() {
  const raw = fs.readFileSync(path.join(CONTENT_DIR, "storefront.json"), "utf-8");
  return JSON.parse(raw);
}
```

**`app/admin/store/page.js`**:

```js
import AdminShell from "@/components/admin/AdminShell";
import StoreEditor from "@/components/admin/StoreEditor";
import { getStorefrontContent } from "@/lib/content";

export const metadata = { title: "Edit Store" };

export default function AdminStorePage() {
  const store = getStorefrontContent();
  return (
    <AdminShell>
      <StoreEditor initialData={store} />
    </AdminShell>
  );
}
```

**`components/admin/AdminShell.js`** — add one line to the `NAV` array (import `ShoppingBag` from `lucide-react` alongside the other icons already imported there):

```js
{ href: "/admin/store", label: "Store", icon: ShoppingBag }
```

**`components/admin/StoreEditor.js`** — build this as `GalleryEditor.js`'s sibling, not a from-scratch component. Same `useState`/`handleSave`/status-message shape. Two sections:

- A **Page settings** card: `meta.tag`, `meta.title`, `meta.subtitle`, `meta.whatsappNumber`, `meta.instagramHandle`, `meta.instagramUrl`, `meta.heroImage`, `meta.note` — plain `Field` rows, same as the top of `GalleryEditor`.
- An **Items** card: one `admin-list-item` block per product, each with:
  - Name, Category (Field row)
  - Price (numeric input — allow empty to represent "not set yet"), Currency
  - Sizes — a comma-separated text field that splits/joins to an array on save (simplest option; don't over-build a tag-picker UI for this)
  - Description (textarea)
  - Image path field + `ImagePreview` (same component `GalleryEditor` already uses)
  - Share image path field + `ImagePreview`
  - In stock (the existing `Checkbox` primitive)
  - Move up/down and remove/add controls, copied straight from `GalleryEditor`'s pattern

Add a help note under the items list matching the gallery editor's tone:

> To add product or share images, upload them to `public/storefront` in the GitHub repo, then reference the filename here (e.g. `classic-tee.jpg`). Leave the field blank to show a placeholder until the photo is ready.

This means `resolveImageSource` needs to also resolve bare filenames against `/storefront/` when they're store images. Add a small variant rather than changing the shared helper (don't risk gallery/blog image resolution):

```js
// lib/image-path.js — add alongside resolveImageSource
export function resolveStoreImageSource(value) {
  const source = String(value || "").trim();
  if (!source) return "";
  if (/^(?:https?:)?\/\//i.test(source) || /^(?:data|blob):/i.test(source)) return source;
  if (source.startsWith("/")) return source;
  return `/storefront/${source}`;
}
```

Use this in `StoreEditor.js`'s `handleSave` normalization step, the same way `GalleryEditor` normalizes with `resolveImageSource`.

---

## 3. Nav entry

No new admin UI needed here — `content/site.json`'s `nav.links` array is already editable through the existing Site Content admin page (`SiteEditor.js`, backed by `ObjectListEditor`). Just add the entry to the JSON directly:

```json
{ "label": "Store", "href": "/store" }
```

Add it to `content/site.json`'s `nav.links` array, positioned wherever it reads naturally against the existing links (Home/About/Programs/etc — check the current order and slot Store in logically, probably right before Volunteer/Contact).

---

## 4. The public page — `/store`

### Route structure

- `app/store/page.js` — server component. Reads `getStorefrontContent()` and `getSiteContent()` (for `meta`/nav, matching how other pages pull site content), passes data down.
- `app/store/StoreClient.js` — `"use client"` component holding all interactivity: cart state, size selection, share modal.

### Logo swap

`components/Nav.js` already special-cases `/schools` to show `Logo2.png`. Extend the same line rather than adding new logic:

```js
const logoSrc = pathname === "/schools" || pathname === "/store" ? "/Logo2.png" : "/Logo.jpeg";
```

### Fonts and color — matching the mockup without introducing a new typeface

Per your instruction, no new font gets loaded. Use the existing three:

- `var(--font-playfair)` for the big display headline ("NK STORE") — it won't have the mockup's tight-tracked grotesk weight, but at very large sizes with `font-weight: 900` and slightly negative `letter-spacing` (e.g. `-0.02em`), Playfair at 900 reads bold and confident rather than delicate. This is the honest tradeoff of reusing the site's type system: it won't be pixel-identical to the mockup's font, but it stays visually part of the same site instead of feeling like a different brand parachuted in.
- `var(--font-dm-mono)` for every small-caps label — "TEES", "VIEW", "DROP"-style micro-labels, size chips, category eyebrows. This is already used sitewide for exactly this role (see `.blog-card-date`, `.school-hero-eyebrow` etc in `globals.css`), so it's a good fit, not a stretch.
- `var(--font-dm-sans)` for body copy, descriptions, buttons.

Color: swap the mockup's hot pink brushstroke for `var(--gold)` (`#EA519D`), which is already close to it. Keep black (`var(--ink)`) and white (`var(--cream)`) as the mockup has them. Use `var(--purple)` sparingly for a secondary accent (e.g. the "In Stock" tag or hover states), matching how it's used as a CTA color elsewhere on the site.

### Layout, section by section

**Hero** — full-bleed two-column: left side big "NK STORE" title in Playfair 900, subtitle, a small bracket-accented "[ NK ]" mark (a tiny decorative span, pure CSS, no new asset needed) borrowed from the mockup's motif, and a "Shop the Collection" anchor-link button down to the grid. Right side: the Model.jpeg photo, treated in grayscale via CSS (`filter: grayscale(1)`) to match the mockup's high-contrast look, with a soft `var(--gold)` accent shape behind it (a rotated rounded rectangle, not a brushstroke asset — CSS only, keeps this from needing new image assets).

**Category filter bar** — small pill/tab row above the grid: All / Tees / Hoodies / Caps / Totes / Accessories. Client-side filter over the 11 items, no routing needed.

**Product grid** — 3-column responsive grid (collapsing to 1 column on mobile), one card per item:

- Image area: if `item.image` is empty, render a fixed-aspect-ratio grey box (`background: #E9E4E7` or similar neutral tied to `--border`) with a centered placeholder icon (a simple lucide `ImageOff` icon is fine) instead of a broken `<img>`. Once `item.image` is set in admin, swap to the real photo automatically — same data-driven pattern the rest of the site already uses for gallery images.
- Category label (DM Mono, small, uppercase, `var(--gold)`)
- Item name (Playfair, bold)
- Price: if `item.price` is a number, format as `{price.toLocaleString()} {currency}`. If `null`, show "Price coming soon" in muted text instead of a blank or a zero — never show "UGX 0" or an empty gap where a price should be.
- Size selector: only rendered if `item.sizes.length > 0`. Small pill buttons per size, single-select, required before "Add to Cart" is enabled (disable the button and show a small "Select a size" hint if no size chosen yet on items that have sizes).
- Two actions per card: **Buy Now** (primary button, `var(--gold)` fill) and **Add to Cart** (secondary, outlined). A third, smaller icon-only **Share** button (a lucide `Share2` icon) sits in the corner of the card.

### Cart

Client-side only, React Context, persisted to `localStorage`.

```js
// app/store/CartContext.js
"use client";
import { createContext, useContext, useEffect, useState } from "react";

const CartContext = createContext(null);
const STORAGE_KEY = "nk-store-cart";

export function CartProvider({ children }) {
  const [items, setItems] = useState([]);
  const [hydrated, setHydrated] = useState(false);

  // Load from localStorage once, after mount (avoids SSR/client hydration mismatch)
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) setItems(JSON.parse(raw));
    } catch {}
    setHydrated(true);
  }, []);

  // Persist on every change, but not before the initial load completes
  useEffect(() => {
    if (!hydrated) return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items, hydrated]);

  function addItem({ id, name, price, currency, size, qty = 1 }) {
    setItems((prev) => {
      const key = `${id}::${size || "onesize"}`;
      const existing = prev.find((i) => i.key === key);
      if (existing) {
        return prev.map((i) => (i.key === key ? { ...i, qty: i.qty + qty } : i));
      }
      return [...prev, { key, id, name, price, currency, size, qty }];
    });
  }

  function removeItem(key) {
    setItems((prev) => prev.filter((i) => i.key !== key));
  }

  function updateQty(key, qty) {
    setItems((prev) => prev.map((i) => (i.key === key ? { ...i, qty: Math.max(1, qty) } : i)));
  }

  function clear() {
    setItems([]);
  }

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, updateQty, clear }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside CartProvider");
  return ctx;
}
```

Wrap `StoreClient.js`'s content in `<CartProvider>` at the top of that file (keep it scoped to the store page, don't wrap the whole app — nothing else needs cart state).

Cart UI: a small dropdown/panel triggered by a "Bag" indicator in the store page's own sub-header (not the main site nav — keep that untouched), showing item count. Panel lists each line (name, size, qty stepper, remove button, subtotal if prices are set), with a **Buy Now** button at the bottom that builds and opens the WhatsApp link for the whole cart.

### WhatsApp message generation

One helper, used by both the per-item Buy Now and the cart Buy Now:

```js
// app/store/whatsapp.js
const WHATSAPP_NUMBER = "256776866921"; // from content/storefront.json meta.whatsappNumber

export function buildWhatsAppUrl(lines) {
  // lines: array of { name, size, qty, price, currency }
  const header = "Hi! I'd like to order:";
  const body = lines
    .map((l) => {
      const sizeTag = l.size ? ` (${l.size})` : "";
      const priceTag = l.price != null ? ` — ${l.price.toLocaleString()} ${l.currency}` : "";
      return `• ${l.qty}x ${l.name}${sizeTag}${priceTag}`;
    })
    .join("\n");
  const hasPrices = lines.every((l) => l.price != null);
  const total = hasPrices
    ? `\n\nTotal: ${lines.reduce((sum, l) => sum + l.price * l.qty, 0).toLocaleString()} ${lines[0].currency}`
    : "";
  const message = `${header}\n\n${body}${total}`;
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}
```

Single-item Buy Now calls this with a one-line array built straight from that card's selected size/price. Cart Buy Now calls it with `cart.items` mapped into the same shape, then `clear()`s the cart once the WhatsApp tab actually opens (don't clear before confirming the link opened, in case the popup gets blocked).

Pull the actual number from `content/storefront.json`'s `meta.whatsappNumber` at render time rather than hardcoding it twice — pass it down as a prop from the server component into `StoreClient`, so the admin-editable number is the single source of truth, not a second hardcoded copy in `whatsapp.js`.

### Share flow

Triggered by the per-card Share icon. Opens a small modal:

- Shows the item's `shareImage` if set (fall back to `image`, fall back to a generic store share graphic if you want one — otherwise just proceed link-only if neither exists)
- A pre-filled, editable textarea: `"Check out the {item.name} from the NK Udada Store! {storeUrl}"` — user can rewrite this before sharing
- A **Share** button that:

```js
async function shareItem({ imageUrl, message }) {
  if (navigator.share) {
    try {
      let files;
      if (imageUrl && navigator.canShare) {
        const resp = await fetch(imageUrl);
        const blob = await resp.blob();
        const file = new File([blob], "share.jpg", { type: blob.type });
        if (navigator.canShare({ files: [file] })) files = [file];
      }
      await navigator.share({ text: message, files, url: files ? undefined : window.location.href });
      return;
    } catch {
      // user cancelled or share failed — fall through to clipboard fallback
    }
  }
  // Desktop / unsupported fallback: copy message + link to clipboard
  await navigator.clipboard.writeText(`${message}`);
  // show a small toast/inline confirmation: "Copied — paste it anywhere to share"
}
```

This covers the real split: most phones get a native share sheet (WhatsApp, Instagram, whatever's installed) with the actual image attached; anything that can't do that gets a one-click copy instead of a dead end. Don't build a custom in-house share-target picker — the platform-native one already does this better.

Secondary, quieter link elsewhere on the page (footer of the store section, not competing with the WhatsApp CTAs): "Follow the drop on Instagram" → `meta.instagramUrl`.

---

## 5. What NOT to build in this pass

- No payment integration, no real checkout, no order database — the WhatsApp handoff is the entire "checkout."
- No dynamic/generated share images — `shareImage` is a static path filled in by admin, not rendered on the fly.
- No stock-quantity tracking — `inStock` is a simple boolean toggle, not a counter.
- No user accounts/login for the storefront — the existing admin login is the only auth surface in play.

## 6. Build order (so this ships incrementally, not as one giant PR)

1. Move `storefront/` → `public/storefront/`, add `content/storefront.json` with the 11 seeded items.
2. Admin: content getter, API route, admin page, `StoreEditor.js`, nav entry, `resolveStoreImageSource`.
3. Public page skeleton at `/store`: hero, filter bar, grid, placeholders, price handling — no cart or share yet, just Buy Now per item wired to `wa.me` with a single-item message.
4. Cart: context, localStorage persistence, cart panel UI, cart-level Buy Now.
5. Share modal + Web Share API flow + clipboard fallback.
6. Add "Store" to `content/site.json` nav links, wire the `/store` logo swap in `Nav.js`.
7. Final pass: check `null` price rendering, empty-image placeholder rendering, and mobile layout at 375px width specifically, since that's where the hero's two-column layout and the cart panel are most likely to break first.
