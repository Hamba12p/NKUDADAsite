"use client";
import React, { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { Icon } from "@/components/icons";
import { ArrowRight } from "lucide-react";

export default function LatestOrb({ latest }) {
  const orbRef = useRef(null);

  const handlePointerMove = (e) => {
    if (!orbRef.current) return;
    const rect = orbRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    orbRef.current.style.setProperty("--rx", `${y * 6}deg`);
    orbRef.current.style.setProperty("--ry", `${-x * 6}deg`);
  };

  const handlePointerLeave = () => {
    if (!orbRef.current) return;
    orbRef.current.style.setProperty("--rx", `0deg`);
    orbRef.current.style.setProperty("--ry", `0deg`);
  };

  return (
    <Link
      href={`/blog/${latest.slug}`}
      className="latest-orb"
      aria-label={`Latest post: ${latest.title}`}
      ref={orbRef}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
    >
      <span className="orb-circle" aria-hidden>
        {latest.coverImage ? (
          <Image src={latest.coverImage} alt="" fill sizes="82px" />
        ) : (
          <Icon name="book-marked" size={26} />
        )}
        <span className="orb-ring" />
      </span>

      <span className="orb-card">
        <span className="orb-label">
          <span className="orb-dot" /> Latest story
        </span>
        <span className="orb-title">{latest.title}</span>
        <span className="orb-link">Read the journal <ArrowRight size={13} /></span>
      </span>
    </Link>
  );
}
