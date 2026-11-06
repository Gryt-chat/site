import { useEffect } from "react";
import { Link } from "react-router-dom";
import { PageHeader } from "../components/PageHeader";
import { pageTitle } from "../lib/title";
import styles from "./SponsorPage.module.css";
import { ONCE_TIER, SPONSOR_TIERS, SPONSOR_URL, sponsorUrl, type SponsorTier } from "../data/sponsorTiers";

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
        <p className={styles.blockNote}>
          Every monthly pack includes the ones before it. Everyone who pays is
          listed on the <Link to="/sponsors">sponsors page</Link>.
        </p>
        <ul className={styles.packs}>
          {SPONSOR_TIERS.map((t) => (
            <li key={t.amount} className={t.tierId ? styles.packPicked : styles.pack}>
              <span className={styles.amount}>{t.amount}</span>
              <h3 className={styles.packTitle}>{t.title}</h3>
              {t.example && <Example tier={t} />}
              <p className={styles.gets}>{t.gets}</p>
              <a
                className={t.tierId ? styles.pick : styles.ghost}
                href={sponsorUrl(t.tierId)}
                target="_blank"
                rel="noreferrer"
              >
                Sponsor {t.amount}
              </a>
            </li>
          ))}
        </ul>
        <div className={styles.once}>
          <div className={styles.onceText}>
            <span className={styles.amount}>{ONCE_TIER.amount}</span>
            <p className={styles.gets}>{ONCE_TIER.gets}</p>
            <Example tier={ONCE_TIER} />
          </div>
          <a className={styles.ghost} href={SPONSOR_URL} target="_blank" rel="noreferrer">
            Sponsor once
          </a>
        </div>
        <p className={styles.more}>
          <Link to="/sponsors">See who's sponsored so far</Link>
        </p>
      </section>
    </main>
  );
}

function Example({ tier }: { tier: SponsorTier }) {
  const e = tier.example;
  if (!e) return null;
  const badge = e.src.endsWith(".svg");
  return (
    <img
      className={badge ? undefined : styles.shot}
      src={e.src}
      alt={e.alt}
      width={e.width}
      height={e.height}
      loading="lazy"
    />
  );
}
