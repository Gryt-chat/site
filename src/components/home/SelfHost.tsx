import { useCallback, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { inView, rise, stagger } from "./motion";
import styles from "./SelfHost.module.css";

/**
 * The commands are the ones from docs/guide/quick-start.mdx, unchanged. There
 * is deliberately no `curl | sh` one-liner: `.env` needs a real JWT_SECRET and
 * the SFU's public host before the stack will work, so a command that ran
 * everything unattended would hand people a broken server.
 */
const INSTALL = `mkdir gryt && cd gryt

# the compose file and a starter .env
curl -Lo docker-compose.yml https://raw.githubusercontent.com/Gryt-chat/gryt/main/ops/deploy/compose/prod.yml
curl -Lo .env https://raw.githubusercontent.com/Gryt-chat/gryt/main/ops/deploy/compose/.env.example

# change these two, leave the third alone
echo 'SERVER_NAME=My Gryt Server'            >> .env
echo 'SFU_PUBLIC_HOST=wss://sfu.example.com' >> .env
echo "JWT_SECRET=$(openssl rand -base64 48)" >> .env

docker compose up -d`;

const paths = [
  {
    name: "Windows",
    detail: "A zip, one config file and a batch script. Node.js is the only thing you install yourself.",
    href: "https://docs.gryt.chat/docs/deployment/windows",
    linkLabel: "Windows guide",
  },
  {
    name: "Cloudflare Tunnel",
    detail: "TLS with no open HTTP ports. Only the SFU's UDP range needs to be reachable.",
    href: "https://docs.gryt.chat/docs/deployment/cloudflare-tunnel",
    linkLabel: "Tunnel guide",
  },
  {
    name: "From the desktop app",
    detail: "Host a server straight out of the client, image processing included. No terminal at all.",
    href: "https://docs.gryt.chat/docs/deployment/embedded",
    linkLabel: "Embedded guide",
  },
];

export function SelfHost() {
  const reduced = useReducedMotion() ?? false;
  const [copied, setCopied] = useState(false);

  const copy = useCallback(() => {
    navigator.clipboard.writeText(INSTALL).then(
      () => {
        setCopied(true);
        window.setTimeout(() => setCopied(false), 2000);
      },
      () => setCopied(false),
    );
  }, []);

  return (
    <section className={styles.section} id="self-host">
      <motion.div className={styles.inner} variants={stagger(reduced)} {...inView}>
        <motion.p className={styles.eyebrow} variants={rise(reduced)}>
          Run it yourself
        </motion.p>
        <motion.h2 className={styles.heading} variants={rise(reduced)}>
          No database container. No sysadmin degree.
        </motion.h2>
        <motion.p className={styles.sub} variants={rise(reduced)}>
          The database is SQLite, so it is one file on your disk. Copy it and
          you have a backup, move it and you have migrated. Four commands and a
          server is up.
        </motion.p>

        <motion.figure className={styles.terminal} variants={rise(reduced)}>
          <figcaption>
            <span>Docker Compose, any Linux box</span>
            <button type="button" onClick={copy} className={styles.copy}>
              {copied ? "Copied" : "Copy"}
            </button>
          </figcaption>
          <pre>
            <code>{INSTALL}</code>
          </pre>
        </motion.figure>

        <motion.p className={styles.docs} variants={rise(reduced)}>
          The two <code>echo</code> lines append over the defaults already in{" "}
          <code>.env</code>, so the last value wins and you never open an
          editor. <code>SFU_PUBLIC_HOST</code> is the address browsers reach
          your media server on.{" "}
          <a
            href="https://docs.gryt.chat/docs/guide/quick-start"
            target="_blank"
            rel="noreferrer"
          >
            Full quick-start guide
          </a>{" "}
          ·{" "}
          <a
            href="https://docs.gryt.chat/docs/deployment/docker-compose"
            target="_blank"
            rel="noreferrer"
          >
            Deployment docs
          </a>
        </motion.p>

        <div className={styles.grid}>
          {paths.map((p) => (
            <motion.article key={p.name} className={styles.card} variants={rise(reduced)}>
              <h3>{p.name}</h3>
              <p>{p.detail}</p>
              <a href={p.href} target="_blank" rel="noreferrer">
                {p.linkLabel} <span aria-hidden="true">→</span>
              </a>
            </motion.article>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
