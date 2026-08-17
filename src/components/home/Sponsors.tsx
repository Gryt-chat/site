import { Link } from "react-router-dom";
import { motion, useReducedMotion } from "motion/react";
import { inView, rise, stagger } from "./motion";
import { sponsors } from "../../data/sponsors";
import styles from "./Sponsors.module.css";

const SPONSOR_URL = "https://github.com/sponsors/Gryt-chat";

/**
 * Where a sponsor's name and logo go (GRYT-271).
 *
 * Written to read the same with nobody in it, because for now that is the
 * case. A section that only made sense once it had somebody in it would have
 * to be built later, which is how the placement came to be promised and never
 * built the first time.
 *
 * Current sponsors only. The full history, including one-off payments and when
 * each arrived, is at /sponsors: a payment from a year ago is not current, and
 * showing it here would either imply it is or need a caveat beside it.
 */
export function Sponsors() {
  const reduced = useReducedMotion() ?? false;

  const recurring = sponsors
    .filter((s) => s.kind === "recurring")
    .sort((a, b) => {
      if (!!a.featured !== !!b.featured) return a.featured ? -1 : 1;
      return !!b.logo === !!a.logo ? 0 : a.logo ? -1 : 1;
    });

  const logos = recurring.filter((s) => s.logo);
  const names = recurring.filter((s) => !s.logo);
  return (
    <section className={styles.section} id="sponsors">
      <motion.div className={styles.inner} variants={stagger(reduced)} {...inView}>
        <motion.p className={styles.eyebrow} variants={rise(reduced)}>
          Sponsors
        </motion.p>
        <motion.h2 className={styles.heading} variants={rise(reduced)}>
          What sponsoring actually pays for
        </motion.h2>
        <motion.p className={styles.sub} variants={rise(reduced)}>
          A domain, the box the auth stack runs on, and the Apple and Windows
          signing certificates that stop the installer warning people off their
          own download. That is the whole list. There is nothing to buy inside
          Gryt.
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
            Names are listed from $25 a month, logos from $100.{" "}
            <Link to="/sponsors">Everyone who has sponsored</Link>, including
            one-off payments, is on its own page.
          </span>
        </motion.p>
      </motion.div>
    </section>
  );
}
