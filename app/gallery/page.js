import { getGalleryContent } from "@/lib/content";
import GalleryClient from "@/components/GalleryClient";

export const metadata = { title: "Gallery — NK Udada Foundation" };

export default function GalleryPage() {
  const gallery = getGalleryContent();

  return (
    <section id="gallery-page" className="section-first">
      <span className="section-tag reveal">{gallery.tag}</span>
      <h2 className="section-title reveal">{gallery.title}</h2>
      <p className="section-sub reveal">{gallery.subtitle}</p>

      <GalleryClient items={gallery.items} />

      <div className="gallery-label reveal" style={{ marginTop: "24px" }}>
        {gallery.note}
      </div>
    </section>
  );
}
