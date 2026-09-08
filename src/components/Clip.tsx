import { useReducedMotion } from "motion/react";
import { type ComponentPropsWithoutRef, useEffect, useRef } from "react";

import styles from "./Clip.module.css";

/**
 * The three files `scripts/encode-clips.mjs` writes, as one value. A section waiting on a
 * capture holds one as `null`, so the day a clip lands the change is the constant.
 */
export interface ClipSet {
  src: string;
  av1: string;
  poster: string;
}

interface ClipProps extends Omit<ComponentPropsWithoutRef<"video">, "children" | "poster"> {
  /** H.264, the copy every browser can decode. */
  src: string;
  /** AV1 copy of the same clip, tried first. */
  av1?: string;
  /** First frame. Doubles as the reduced-motion still. */
  poster: string;
  /** What the clip shows, for the reduced-motion still and for screen readers. */
  alt: string;
}

/**
 * A silent looping capture of the product: `muted` and `playsInline` are what make autoplay
 * allowed at all. `prefers-reduced-motion` gets the poster as a plain image instead.
 */
export function Clip({ src, av1, poster, alt, className, ...props }: ClipProps) {
  const reduced = useReducedMotion() ?? false;
  const ref = useRef<HTMLVideoElement>(null);

  // Played on arrival rather than on load. Autoplaying meant every clip on the
  // page was already part way through by the time anybody scrolled to it.
  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const io = new IntersectionObserver(
      ([entry]) => {
        // play() rejects if the browser refuses; muted and playsInline should
        // stop that, and a refusal leaves the poster, which is not worth a throw.
        if (entry.isIntersecting) void el.play().catch(() => {});
        else el.pause();
      },
      { rootMargin: "80px" },
    );

    io.observe(el);
    return () => io.disconnect();
  }, [reduced]);

  if (reduced) {
    return (
      <img
        className={[styles.clip, className].filter(Boolean).join(" ")}
        src={poster}
        alt={alt}
        width={props.width}
        height={props.height}
      />
    );
  }

  return (
    <video
      {...props}
      ref={ref}
      className={[styles.clip, className].filter(Boolean).join(" ")}
      poster={poster}
      aria-label={alt}
      muted
      loop
      playsInline
      controls={false}
      preload="metadata"
    >
      {/* AV1 first: it holds far more detail per byte, which matters for a
          screen recording where the interesting part is a thin ring or a single
          redrawn icon. Browsers that cannot decode it — Safari without hardware
          AV1, mostly — fall through to the H.264 copy, which is encoded well
          past the point of visible loss rather than merely small. */}
      {av1 && <source src={av1} type="video/mp4; codecs=av01.0.05M.08" />}
      <source src={src} type="video/mp4" />
    </video>
  );
}
