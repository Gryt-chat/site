import { LockIcon, OpenSourceIcon, ServerIcon } from "./icons";
import styles from "./Philosophy.module.css";

const cards = [
  {
    icon: <LockIcon size={22} />,
    title: "Private by Default",
    desc: "Your conversations stay on your server. No data mining, no ads, no third-party access. You decide who sees what.",
  },
  {
    icon: <OpenSourceIcon size={22} />,
    title: "Fully Open Source",
    desc: "Every line of code is open. Audit it, fork it, contribute to it. Build custom clients or server plugins to make Gryt truly yours.",
  },
  {
    icon: <ServerIcon size={22} />,
    title: "Self-Hosted",
    desc: "Run Gryt on your own hardware with Docker, Kubernetes, or a simple executable. No cloud dependency. Full control, always.",
  },
];

export function Philosophy() {
  return (
    <section className={`section border-top ${styles.philosophy}`} id="philosophy">
      <div className="section-label">Philosophy</div>
      <h2 className="section-title">Own your data. Own your platform.</h2>
      <p className={`section-desc ${styles.desc}`}>
        Gryt exists because your conversations should belong to you, not a
        corporation. We're building a safe, transparent, "own your data"
        communication platform for everyone.
      </p>

      <div className={styles.grid}>
        {cards.map((card) => (
          <div key={card.title} className={styles.card}>
            <div className={styles.icon}>{card.icon}</div>
            <h3>{card.title}</h3>
            <p>{card.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
