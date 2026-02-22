import styles from "./Architecture.module.css";

const stack = [
  {
    label: "Client",
    title: "React + TypeScript",
    desc: "Electron desktop app & web client with Vite",
  },
  {
    label: "Server",
    title: "Bun + Socket.IO",
    desc: "Real-time signaling, messaging, and API",
  },
  {
    label: "SFU",
    title: "Go + Pion WebRTC",
    desc: "High-performance media routing for voice & video",
  },
  {
    label: "Auth",
    title: "Keycloak SSO",
    desc: "Centrally hosted, secure single sign-on",
  },
];

export function Architecture() {
  return (
    <section
      className={`section border-top ${styles.architecture}`}
      id="architecture"
    >
      <div className="section-label">Architecture</div>
      <h2 className="section-title">Built for performance &amp; scale.</h2>
      <p className={`section-desc ${styles.desc}`}>
        A modular architecture with specialized services, easy to deploy with
        Docker or Kubernetes.
      </p>

      <div className={styles.grid}>
        {stack.map((s) => (
          <div key={s.label} className={styles.card}>
            <div className={styles.label}>{s.label}</div>
            <h3>{s.title}</h3>
            <p>{s.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
