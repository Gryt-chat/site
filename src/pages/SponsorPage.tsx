import { useEffect } from "react";
import { Link } from "react-router-dom";
import { PageHeader } from "../components/PageHeader";
import { pageTitle } from "../lib/title";
import styles from "./SponsorPage.module.css";
import { SPONSOR_TIERS, SPONSOR_URL, sponsorUrl } from "../data/sponsorTiers";

/** How to sponsor Gryt. The people who have are on /sponsors. */
export function SponsorPage() {
  useEffect(() => {
    document.title = pageTitle("Sponsor Gryt");
  }, []);

  return (
    <main className={styles.page}>
      <PageHeader
        eyebrow="Sponsor"
        title="Help pay for Gryt"
        lede={
          <>
            It pays for a domain, the box the auth stack runs on, and the
            Apple and Windows signing certificates that stop the installer
            warning people off their own download. That's the whole list.
            There's nothing to buy inside Gryt, and nothing held back for the
            people who pay.
          </>
        }
      />

      <a className={styles.cta} href={SPONSOR_URL} target="_blank" rel="noreferrer">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4"
          strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M19.5 12.6 12 20l-7.5-7.4A4.8 4.8 0 0 1 12 6.3a4.8 4.8 0 0 1 7.5 6.3z" />
        </svg>
        Sponsor Gryt
      </a>
      <p className={styles.ctaNote}>On GitHub Sponsors. Monthly, or once.</p>

      <section className={styles.block}>
        <h2 className={styles.blockHeading}>What you get</h2>
        <ul className={styles.tiers}>
          {/* Only tiers whose id we know link to checkout; a link that lands somewhere else is worse than none. */}
          {SPONSOR_TIERS.map((t) => (
            <li key={t.amount}>
              {t.tierId ? (
                <a className={styles.amount} href={sponsorUrl(t.tierId)} target="_blank" rel="noreferrer">
                  {t.amount}
                </a>
              ) : (
                <span className={styles.amount}>{t.amount}</span>
              )}
              <span className={styles.gets}>{t.gets}</span>
            </li>
          ))}
        </ul>
        <p className={styles.footnote}>
          Money has also come in through Ko-fi and straight to me, which the
          tiers don't cover. Anyone who sent something is listed on
          the <Link to="/sponsors">sponsors page</Link> the same way, and
          nothing goes up without asking first.
        </p>
        <p className={styles.more}>
          <Link to="/sponsors">See who's sponsored so far</Link>
        </p>
      </section>
    </main>
  );
}
