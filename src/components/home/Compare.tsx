import { motion, useReducedMotion } from "motion/react";
import { inView, rise, stagger } from "./motion";
import styles from "./Compare.module.css";

/**
 * The arguments are the ones the FAQ already makes, kept honest: Mumble and
 * TeamSpeak are named as good software, because they are, and the column that
 * matters is what you can do with the code.
 * Source: docs/guide/faq.mdx § Why Gryt?
 */
const rows = [
  { label: "Self-hostable", gryt: true, discord: false, teamspeak: true, mumble: true },
  { label: "Source you can read", gryt: true, discord: false, teamspeak: false, mumble: true },
  { label: "Fork and redistribute", gryt: true, discord: false, teamspeak: false, mumble: true },
  { label: "Runs in a browser", gryt: true, discord: true, teamspeak: false, mumble: false },
  { label: "Built-in text chat and uploads", gryt: true, discord: true, teamspeak: "partial", mumble: false },
  { label: "Every feature without paying", gryt: true, discord: false, teamspeak: "partial", mumble: true },
  { label: "Server cannot impersonate you", gryt: true, discord: "n/a", teamspeak: false, mumble: false },
];

const cols = [
  { key: "gryt", name: "Gryt" },
  { key: "discord", name: "Discord" },
  { key: "teamspeak", name: "TeamSpeak" },
  { key: "mumble", name: "Mumble" },
] as const;

function Cell({ value }: { value: boolean | string }) {
  if (value === true) return <span className={styles.yes} aria-label="Yes">●</span>;
  if (value === false) return <span className={styles.no} aria-label="No">–</span>;
  if (value === "partial")
    return <span className={styles.partial} aria-label="Partly">◐</span>;
  return <span className={styles.na} aria-label="Not applicable">n/a</span>;
}

export function Compare() {
  const reduced = useReducedMotion() ?? false;

  return (
    <section className={styles.section} id="compare">
      <motion.div className={styles.inner} variants={stagger(reduced)} {...inView}>
        <motion.p className={styles.eyebrow} variants={rise(reduced)}>
          Against the alternatives
        </motion.p>
        <motion.h2 className={styles.heading} variants={rise(reduced)}>
          Mumble and TeamSpeak are good. This is where Gryt differs.
        </motion.h2>

        <motion.div className={styles.wrap} variants={rise(reduced)}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th scope="col" className={styles.rowHead}>
                  <span className="sr-only">Capability</span>
                </th>
                {cols.map((c) => (
                  <th
                    key={c.key}
                    scope="col"
                    className={c.key === "gryt" ? styles.own : undefined}
                  >
                    {c.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.label}>
                  <th scope="row" className={styles.rowHead}>{r.label}</th>
                  {cols.map((c) => (
                    <td key={c.key} className={c.key === "gryt" ? styles.own : undefined}>
                      <Cell value={r[c.key]} />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </motion.div>

        <motion.p className={styles.note} variants={rise(reduced)}>
          Discord's identity row is marked not applicable because there is only
          one server and it belongs to Discord. On Gryt you join servers other
          people run, so the question has an answer worth giving.
        </motion.p>
      </motion.div>
    </section>
  );
}
