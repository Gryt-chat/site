import { useReducedMotion } from "motion/react";
import type { ComponentPropsWithoutRef } from "react";

import styles from "./Clip.module.css";

/**
 * The three files `scripts/encode-clips.mjs` writes, as one value.
 *
 * Sections that are waiting on a capture hold one of these as `null` and render
 * their still — or nothing — until it exists. Spelling the shape out once means
 * the day a clip lands, the change is the constant and nothing else.
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
 * A silent looping capture of the product.
 *
 * These play themselves, forever, with no controls — closer to an animated
 * image than to video, which is why `muted` and `playsInline` are here: without
 * both of them, autoplay is not something a browser will allow at all.
 *
 * `prefers-reduced-motion` gets the poster as a plain image rather than a
 * shorter animation. A clip that loops is motion no matter how it is eased in,
 * and the fade that `index.css` applies to everything else cannot reach it.
 */
export function Clip({ src, av1, poster, alt, className, ...props }: ClipProps) {
  const reduced = useReducedMotion() ?? false;

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
      className={[styles.clip, className].filter(Boolean).join(" ")}
      poster={poster}
      aria-label={alt}
      autoPlay
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
