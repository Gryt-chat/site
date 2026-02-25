import styles from "./AppMockup.module.css";

export function AppMockup() {
  return (
    <div className={styles.visual}>
      <picture>
        <source
          type="image/webp"
          srcSet="/preview-sm.webp 1000w, /preview.webp 2000w"
          sizes="(max-width: 768px) 100vw, 900px"
        />
        <img
          src="/preview.png"
          alt="Gryt client preview"
          width={2000}
          height={1125}
          fetchPriority="high"
          className={styles.screenshot}
          draggable={false}
        />
      </picture>
    </div>
  );
}
