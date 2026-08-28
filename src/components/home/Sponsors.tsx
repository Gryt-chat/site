import { Link } from "react-router-dom";
import { motion, useReducedMotion } from "motion/react";
import { Button } from "@gryt/ui";
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
 *
 * The empty slots are the point of the row.
 *
 * The $100 tier promises a logo on this page and the section said so only in
 * the small print underneath, which meant somebody reading it saw a paragraph
 * asking for money rather than the space their logo would occupy. Two outlined
 * slots show the placement, sized exactly as a real logo is sized, so the offer
 * is visible rather than described. They disappear once three logos are up —
 * at that point the row is making the argument by itself and empty boxes beside
 * it would read as sponsors who left.
 */
const OPEN_SLOTS = 2;
const SLOTS_UNTIL = 3;

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
          Gryt is free, and it isn't asking you for money.
        </motion.h2>
        <motion.p className={styles.sub} variants={rise(reduced)}>
          There's nothing to buy inside it and nothing behind a subscription.
          If you want to chip in you can, and it goes on a domain, the box the
          auth stack runs on, and the Apple and Windows signing certificates.
          Nothing here depends on it.
        </motion.p>

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

          {logos.length < SLOTS_UNTIL &&
            Array.from({ length: OPEN_SLOTS }, (_, i) => (
              <li key={`slot-${i}`} className={styles.slot}>
                <a href={SPONSOR_URL} target="_blank" rel="noreferrer">
                  <span className={styles.slotLine}>Your logo</span>
                  <span className={styles.slotSub}>$100 a month</span>
                </a>
              </li>
            ))}
        </motion.ul>

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
          <Button
            className={styles.button}
            render={<a href={SPONSOR_URL} target="_blank" rel="noreferrer" />}
            tone="ghost"
          >
            Sponsor Gryt
          </Button>
          <span className={styles.note}>
            Names go up from $25 a month and logos from $100, and one-off
            payments are just as welcome. The tiers are written out on the{" "}
            <Link to="/sponsors">sponsors page</Link>, along with everybody who
            has.
          </span>
        </motion.p>
      </motion.div>
    </section>
  );
}
