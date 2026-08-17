import { motion, useReducedMotion } from "motion/react";
import { inView, rise, stagger } from "./motion";
import { sponsors } from "../../data/sponsors";
import styles from "./Sponsors.module.css";

const SPONSOR_URL = "https://github.com/sponsors/Gryt-chat";

/**
 * The placement the $100 tier promises, and where the $25 names go (GRYT-271).
 *
 * Written to read the same with nobody in it, because for now that is the case
 * and a section that only makes sense once it is full would have to be added
 * later — which is exactly how the placement came to be promised and not built.
 * Empty, it is a paragraph about what Gryt costs to run and a link.
 *
 * Logos sort in front of names, and a featured sponsor in front of both.
 */
export function Sponsors() {
  const reduced = useReducedMotion() ?? false;

  const ordered = [...sponsors].sort((a, b) => {
    if (!!a.featured !== !!b.featured) return a.featured ? -1 : 1;
    if (!!a.logo !== !!b.logo) return a.logo ? -1 : 1;
    return 0;
  });

  const logos = ordered.filter((s) => s.logo);
  const names = ordered.filter((s) => !s.logo);

  return (
    <section className={styles.section} id="sponsors">
      <motion.div className={styles.inner} variants={stagger(reduced)} {...inView}>
        <motion.p className={styles.eyebrow} variants={rise(reduced)}>
          Sponsors
        </motion.p>
        <motion.h2 className={styles.heading} variants={rise(reduced)}>
          One person, and some bills that are not optional.
        </motion.h2>
        <motion.p className={styles.sub} variants={rise(reduced)}>
          A domain, a box to run the auth stack on, and the Apple and Windows
          signing certificates that stop the installer warning people off their
          own download. Sponsoring covers those, and it is the only money Gryt
          takes — there is nothing to buy in the app and nothing to unlock.
        </motion.p>

        {logos.length > 0 && (
          <motion.ul className={styles.logos} variants={rise(reduced)}>
            {logos.map((s) => (
              <li key={s.name} className={s.featured ? styles.featured : undefined}>
                {s.href ? (
                  <a href={s.href} target="_blank" rel="noreferrer">
                    <img src={s.logo} alt={s.name} />
                  </a>
                ) : (
                  <img src={s.logo} alt={s.name} />
                )}
              </li>
            ))}
          </motion.ul>
        )}

        {names.length > 0 && (
          <motion.ul className={styles.names} variants={rise(reduced)}>
            {names.map((s) => (
              <li key={s.name}>
                {s.href ? (
                  <a href={s.href} target="_blank" rel="noreferrer">
                    {s.name}
                  </a>
                ) : (
                  s.name
                )}
              </li>
            ))}
          </motion.ul>
        )}

        <motion.p className={styles.cta} variants={rise(reduced)}>
          <a className={styles.button} href={SPONSOR_URL} target="_blank" rel="noreferrer">
            Sponsor Gryt
          </a>
          <span className={styles.note}>
            Names are listed from $25 a month, logos from $100. Nothing is
            published without asking you first.
          </span>
        </motion.p>
      </motion.div>
    </section>
  );
}
