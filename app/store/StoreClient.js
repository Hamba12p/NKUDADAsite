"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import {
  Check,
  ChevronDown,
  ImageOff,
  Instagram,
  Minus,
  Plus,
  Share2,
  ShoppingBag,
  Sparkles,
  Trash2,
  X
} from "lucide-react";
import { resolveStoreImageSource } from "@/lib/image-path";
import { CartProvider, useCart } from "./CartContext";
import { buildWhatsAppUrl } from "./whatsapp";
import styles from "./store.module.css";

const CATEGORIES = ["All", "Tees", "Hoodies", "Caps", "Totes", "Accessories"];
const imageLoader = ({ src }) => src;

function formatPrice(price, currency) {
  if (price == null) return "Price coming soon";
  return `${Number(price).toLocaleString()} ${currency}`;
}

function formatPhone(number) {
  const digits = String(number || "").replace(/\D/g, "");
  if (digits.length === 12 && digits.startsWith("256")) {
    return `+256 ${digits.slice(3, 6)} ${digits.slice(6, 9)} ${digits.slice(9)}`;
  }
  return digits ? `+${digits}` : "";
}

function ProductImage({ src, alt, priority = false, className = "" }) {
  const resolved = resolveStoreImageSource(src);
  if (!resolved) {
    return (
      <div className={`${styles.imagePlaceholder} ${className}`}>
        <span><ImageOff size={30} strokeWidth={1.5} /></span>
        <small>Product portrait coming soon</small>
      </div>
    );
  }

  return (
    <div className={`${styles.imageFrame} ${className}`}>
      <Image
        loader={imageLoader}
        unoptimized
        src={resolved}
        alt={alt}
        fill
        priority={priority}
        sizes="(max-width: 760px) 100vw, (max-width: 1100px) 50vw, 33vw"
      />
    </div>
  );
}

function StoreClient({ store, siteName }) {
  return (
    <CartProvider>
      <StoreExperience store={store} siteName={siteName} />
    </CartProvider>
  );
}

function StoreExperience({ store, siteName }) {
  const { items: cartItems, addItem, removeItem, updateQty, clear } = useCart();
  const [category, setCategory] = useState("All");
  const [selectedSizes, setSelectedSizes] = useState({});
  const [cartOpen, setCartOpen] = useState(false);
  const [shareItem, setShareItem] = useState(null);
  const [shareMessage, setShareMessage] = useState("");
  const [notice, setNotice] = useState("");

  const visibleItems = useMemo(
    () => category === "All" ? store.items : store.items.filter((item) => item.category === category),
    [category, store.items]
  );
  const itemCount = cartItems.reduce((sum, item) => sum + item.qty, 0);
  const allCartPricesSet = cartItems.length > 0 && cartItems.every((item) => item.price != null);
  const cartTotal = allCartPricesSet
    ? cartItems.reduce((sum, item) => sum + Number(item.price) * item.qty, 0)
    : null;

  useEffect(() => {
    if (!shareItem) return undefined;
    const onKeyDown = (event) => {
      if (event.key === "Escape") setShareItem(null);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [shareItem]);

  function sizeFor(item) {
    return selectedSizes[item.id] || "";
  }

  function canOrder(item) {
    return item.inStock && (item.sizes.length === 0 || !!sizeFor(item));
  }

  function orderLine(item, qty = 1) {
    return {
      id: item.id,
      name: item.name,
      price: item.price,
      currency: item.currency,
      size: sizeFor(item),
      qty
    };
  }

  function openWhatsApp(lines, shouldClear = false) {
    const target = window.open(buildWhatsAppUrl(store.meta.whatsappNumber, lines), "_blank");
    if (target) {
      target.opener = null;
      if (shouldClear) clear();
      setNotice("Your order is ready in WhatsApp.");
    } else {
      setNotice("Your browser blocked the WhatsApp window. Please allow pop-ups and try again.");
    }
  }

  function addToBag(item) {
    if (!canOrder(item)) return;
    addItem(orderLine(item));
    setNotice(`${item.name} added to your bag.`);
  }

  function openShare(item) {
    const storeUrl = `${window.location.origin}/store#${item.id}`;
    setShareMessage(`Check out the ${item.name} from the NK Udada Store! ${storeUrl}`);
    setShareItem(item);
  }

  async function copyText(text) {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      const textarea = document.createElement("textarea");
      textarea.value = text;
      textarea.style.position = "fixed";
      textarea.style.opacity = "0";
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      textarea.remove();
    }
  }

  async function shareSelectedItem() {
    const imageUrl = resolveStoreImageSource(shareItem.shareImage || shareItem.image);
    if (navigator.share) {
      try {
        let files;
        if (imageUrl && navigator.canShare) {
          const response = await fetch(imageUrl);
          if (response.ok) {
            const blob = await response.blob();
            const extension = blob.type.split("/")[1] || "jpg";
            const file = new File([blob], `nk-store-${shareItem.id}.${extension}`, { type: blob.type });
            if (navigator.canShare({ files: [file] })) files = [file];
          }
        }
        await navigator.share({
          text: shareMessage,
          files,
          url: files ? undefined : `${window.location.origin}/store#${shareItem.id}`
        });
        setShareItem(null);
        setNotice("Shared with purpose.");
        return;
      } catch {
        // Cancellation or an unsupported attachment falls back to a useful copy action.
      }
    }
    await copyText(shareMessage);
    setShareItem(null);
    setNotice("Copied — paste it anywhere to share.");
  }

  const heroImage = store.meta.heroImage || "Model.png";

  return (
    <main className={styles.storePage}>
      <section className={styles.hero}>
        <div className={styles.heroCopy}>
          <div className={styles.eyebrow}><span>[ NK ]</span> {store.meta.tag}</div>
          <h1>{store.meta.title}</h1>
          <p>{store.meta.subtitle}</p>
          <a href="#collection" className={styles.heroCta}>
            Shop the collection <ChevronDown size={16} />
          </a>
          <div className={styles.heroDrop}><span>DROP 01</span><i /></div>
        </div>
        <div className={styles.heroVisual}>
          <div className={styles.heroAccent} aria-hidden="true" />
          <ProductImage src={heroImage} alt={`${siteName} store model`} priority className={styles.heroImage} />
          <span className={styles.heroStamp}>PURPOSE<br />IN EVERY<br />PIECE</span>
        </div>
      </section>

      <section className={styles.collection} id="collection">
        <div className={styles.storeBar}>
          <div>
            <span className={styles.microLabel}>THE COLLECTION</span>
            <strong>Wear what you stand for.</strong>
          </div>
          <div className={styles.bagWrap}>
            <button
              type="button"
              className={styles.bagButton}
              onClick={() => setCartOpen((open) => !open)}
              aria-expanded={cartOpen}
              aria-controls="store-bag-panel"
            >
              <ShoppingBag size={18} /> Bag <span>{itemCount}</span>
            </button>
            {cartOpen && (
              <div className={styles.cartPanel} id="store-bag-panel">
                <div className={styles.cartHeading}>
                  <div><span>YOUR BAG</span><strong>{itemCount} {itemCount === 1 ? "piece" : "pieces"}</strong></div>
                  <button type="button" onClick={() => setCartOpen(false)} aria-label="Close bag"><X size={18} /></button>
                </div>
                {cartItems.length === 0 ? (
                  <div className={styles.emptyBag}>
                    <ShoppingBag size={26} strokeWidth={1.5} />
                    <p>Your bag is ready for something meaningful.</p>
                  </div>
                ) : (
                  <>
                    <div className={styles.cartLines}>
                      {cartItems.map((item) => (
                        <div className={styles.cartLine} key={item.key}>
                          <div className={styles.cartLineCopy}>
                            <strong>{item.name}</strong>
                            <span>{item.size ? `Size ${item.size} · ` : ""}{formatPrice(item.price, item.currency)}</span>
                          </div>
                          <div className={styles.qtyControl}>
                            <button type="button" onClick={() => updateQty(item.key, item.qty - 1)} aria-label={`Reduce ${item.name} quantity`}><Minus size={12} /></button>
                            <span>{item.qty}</span>
                            <button type="button" onClick={() => updateQty(item.key, item.qty + 1)} aria-label={`Increase ${item.name} quantity`}><Plus size={12} /></button>
                          </div>
                          <button type="button" className={styles.removeLine} onClick={() => removeItem(item.key)} aria-label={`Remove ${item.name}`}><Trash2 size={15} /></button>
                        </div>
                      ))}
                    </div>
                    <div className={styles.cartFooter}>
                      <div className={styles.cartTotal}>
                        <span>{cartTotal == null ? "Final price confirmed on WhatsApp" : "Total"}</span>
                        {cartTotal != null && <strong>{formatPrice(cartTotal, cartItems[0].currency)}</strong>}
                      </div>
                      <button type="button" className={styles.cartBuy} onClick={() => openWhatsApp(cartItems, true)}>
                        Buy now on WhatsApp
                      </button>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        </div>

        <div className={styles.filters} aria-label="Filter products by category">
          {CATEGORIES.map((name) => (
            <button
              type="button"
              key={name}
              className={category === name ? styles.activeFilter : ""}
              onClick={() => setCategory(name)}
              aria-pressed={category === name}
            >
              {name}
            </button>
          ))}
        </div>

        <div className={styles.productGrid}>
          {visibleItems.map((item, index) => (
            <article className={styles.productCard} id={item.id} key={item.id}>
              <div className={styles.productVisual}>
                <ProductImage src={item.image} alt={item.name} />
                <span className={styles.cardNumber}>{String(index + 1).padStart(2, "0")}</span>
                <button type="button" className={styles.shareButton} onClick={() => openShare(item)} aria-label={`Share ${item.name}`}>
                  <Share2 size={17} />
                </button>
                {!item.inStock && <span className={styles.soldOut}>Currently unavailable</span>}
              </div>
              <div className={styles.productCopy}>
                <span className={styles.category}>{item.category}</span>
                <h2>{item.name}</h2>
                <p>{item.description}</p>
                <div className={`${styles.price}${item.price == null ? ` ${styles.pricePending}` : ""}`}>
                  {formatPrice(item.price, item.currency)}
                </div>
                {item.sizes.length > 0 && (
                  <div className={styles.sizeBlock}>
                    <span>SELECT SIZE</span>
                    <div className={styles.sizes}>
                      {item.sizes.map((size) => (
                        <button
                          type="button"
                          key={size}
                          className={sizeFor(item) === size ? styles.activeSize : ""}
                          onClick={() => setSelectedSizes((current) => ({ ...current, [item.id]: size }))}
                          aria-pressed={sizeFor(item) === size}
                        >
                          {sizeFor(item) === size && <Check size={11} />} {size}
                        </button>
                      ))}
                    </div>
                    {!sizeFor(item) && <small>Select a size to order</small>}
                  </div>
                )}
                <div className={styles.cardActions}>
                  <button type="button" className={styles.buyButton} disabled={!canOrder(item)} onClick={() => openWhatsApp([orderLine(item)])}>
                    Buy now
                  </button>
                  <button type="button" className={styles.addButton} disabled={!canOrder(item)} onClick={() => addToBag(item)}>
                    <Plus size={15} /> Add to bag
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>

        <div className={styles.storeFooter}>
          <div>
            <Sparkles size={18} />
            <p>{store.meta.note}</p>
          </div>
          <a href={store.meta.instagramUrl} target="_blank" rel="noreferrer">
            <Instagram size={17} /> Follow the drop @{store.meta.instagramHandle}
          </a>
          <small>Order support: {formatPhone(store.meta.whatsappNumber)}</small>
        </div>
      </section>

      {notice && (
        <button type="button" className={styles.toast} onClick={() => setNotice("")} aria-live="polite">
          <Check size={15} /> {notice}<X size={13} />
        </button>
      )}

      {shareItem && (
        <div className={styles.modalBackdrop} onMouseDown={(event) => event.target === event.currentTarget && setShareItem(null)}>
          <div className={styles.shareModal} role="dialog" aria-modal="true" aria-labelledby="share-title">
            <button type="button" className={styles.modalClose} onClick={() => setShareItem(null)} aria-label="Close share dialog"><X size={19} /></button>
            <span className={styles.microLabel}>PASS THE PURPOSE ON</span>
            <h2 id="share-title">Share {shareItem.name}</h2>
            {(shareItem.shareImage || shareItem.image) && (
              <ProductImage src={shareItem.shareImage || shareItem.image} alt={`${shareItem.name} share preview`} className={styles.sharePreview} />
            )}
            <label htmlFor="share-message">Your message</label>
            <textarea id="share-message" value={shareMessage} onChange={(event) => setShareMessage(event.target.value)} />
            <button type="button" className={styles.modalShareButton} onClick={shareSelectedItem}>
              <Share2 size={16} /> Share this piece
            </button>
            <p>Your phone will offer the apps you already use. On desktop, we’ll copy this message for you.</p>
          </div>
        </div>
      )}
    </main>
  );
}

export default StoreClient;
