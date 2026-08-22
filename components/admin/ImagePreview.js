"use client";

import { useEffect, useState } from "react";
import { Image as ImageIcon } from "lucide-react";
import { resolveImageSource } from "@/lib/image-path";

export default function ImagePreview({ value, alt = "Selected image preview" }) {
  const source = resolveImageSource(value);
  const [failed, setFailed] = useState(false);

  useEffect(() => setFailed(false), [source]);

  if (!source) return null;

  return (
    <div className={`admin-image-preview${failed ? " is-error" : ""}`} aria-live="polite">
      <div className="admin-image-preview-frame">
        {failed ? (
          <ImageIcon size={22} aria-hidden="true" />
        ) : (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={source} alt={alt} onError={() => setFailed(true)} />
        )}
      </div>
      <div className="admin-image-preview-copy">
        <span>{failed ? "Image could not be loaded" : "Image preview"}</span>
        <code>{source}</code>
      </div>
    </div>
  );
}
