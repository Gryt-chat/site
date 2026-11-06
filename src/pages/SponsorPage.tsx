import { useEffect } from "react";
import { Link } from "react-router-dom";
import { PageHeader } from "../components/PageHeader";
import { pageTitle } from "../lib/title";
import styles from "./SponsorPage.module.css";
import { COVERED_BY_SPONSORS_USD, RUNNING_COSTS } from "../data/runningCosts";
import { ONCE_TIER, SPONSOR_TIERS, SPONSOR_URL, sponsorUrl, type SponsorTier } from "../data/sponsorTiers";

/** How to sponsor Gryt. The people who have are on /sponsors. */
export function SponsorPage() {
  useEffect(() => {
    document.title = pageTitle("Sponsor Gryt");
  }, []);

  const total = Math.round(RUNNING_COSTS.reduce((sum, c) => sum + c.usd, 0) / 100) * 100;

  return (
    <main className={styles.page}>
      <PageHeader
        eyebrow="Sponsor"
        title="Help pay for Gryt"
        lede={
          <>
            Gryt runs on an enterprise-grade AMD EPYC server, with a handful of
            paid services around it. Code-signing certificates keep Windows and
            macOS from warning people off the installer. There's nothing to buy
            inside Gryt, and nothing held back for the people who pay.
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

      <section className={styles.costs}>
        <h2 className={styles.blockHeading}>What it costs to run</h2>
        <p className={styles.costHead}>
          <span>Rough numbers, in US dollars</span>
          <span>Yearly</span>
        </p>
        <dl className={styles.costList}>
          {RUNNING_COSTS.map((c) => (
            <div key={c.what} className={styles.costRow}>
              <dt>{c.what}</dt>
              <dd>{usd(c.usd)}</dd>
            </div>
          ))}
          <div className={styles.costTotal}>
            <dt>About</dt>
            <dd>{usd(total)}</dd>
          </div>
        </dl>
        <div className={styles.covered}>
          <span>Covered by monthly sponsors</span>
          <span className={styles.coveredAmount}>
            {usd(COVERED_BY_SPONSORS_USD)} of {usd(total)}
          </span>
        </div>
        <div
          className={styles.bar}
          role="progressbar"
          aria-label="Share of yearly costs covered by monthly sponsors"
          aria-valuemin={0}
          aria-valuemax={total}
          aria-valuenow={COVERED_BY_SPONSORS_USD}
        >
          <div style={{ width: `${Math.min(100, (COVERED_BY_SPONSORS_USD / total) * 100)}%` }} />
        </div>
        <p className={styles.costNote}>
          The server and the test devices get used for other things too, so
          these numbers lean high.
        </p>
      </section>

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

function usd(n: number) {
  return "$" + String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
