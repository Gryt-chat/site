import styles from "./AppMockup.module.css";

export function AppMockup() {
  return (
    <div className={styles.visual}>
      <img
        src="/preview.png"
        alt="Gryt client preview"
        className={styles.screenshot}
        draggable={false}
      />
    </div>
  );
}
