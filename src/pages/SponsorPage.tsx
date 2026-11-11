import { useEffect } from "react";
import { Link } from "react-router-dom";
import { PageHeader } from "../components/PageHeader";
import { pageTitle } from "../lib/title";
import styles from "./SponsorPage.module.css";
import { COVERED_BY_SPONSORS_EUR, EUR_PER_USD, RUNNING_COSTS, RUNNING_TOTAL_EUR, SERVER_HARDWARE_EUR_PER_YEAR, eur } from "../data/runningCosts";
import { ONCE_TIER, SPONSOR_TIERS, SPONSOR_URL, sponsorUrl, type SponsorTier } from "../data/sponsorTiers";

/** How to sponsor Gryt. The people who have are on /sponsors. */
export function SponsorPage() {
  useEffect(() => {
    document.title = pageTitle("Sponsor Gryt");
  }, []);

  const total = RUNNING_TOTAL_EUR;

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
          <span>In euros</span>
          <span>Yearly</span>
        </p>
        <dl className={styles.costList}>
          {RUNNING_COSTS.map((c) => (
            <div key={c.what} className={styles.costRow}>
              <dt>{c.what}</dt>
              <dd>{eur(c.eur)}</dd>
            </div>
          ))}
          <div className={styles.costTotal}>
            <dt>About</dt>
            <dd>{eur(total)}</dd>
          </div>
        </dl>
        <p className={styles.ctaNote}>
          Not in the total: the server itself. We bought it once, and over five years it works out to about{" "}
          {eur(SERVER_HARDWARE_EUR_PER_YEAR)} a year.
        </p>
        {COVERED_BY_SPONSORS_EUR > 0 ? (
          <>
            <div className={styles.covered}>
              <span>Covered by monthly sponsors</span>
              <span className={styles.coveredAmount}>
                {eur(COVERED_BY_SPONSORS_EUR)} of {eur(total)}
              </span>
            </div>
            <div
              className={styles.bar}
              role="progressbar"
              aria-label="Share of yearly costs covered by monthly sponsors"
              aria-valuemin={0}
              aria-valuemax={total}
              aria-valuenow={COVERED_BY_SPONSORS_EUR}
            >
              <div style={{ width: `${Math.min(100, (COVERED_BY_SPONSORS_EUR / total) * 100)}%` }} />
            </div>
          </>
        ) : (
          <p className={styles.ctaNote}>Nobody sponsors Gryt monthly yet, so you&rsquo;d be the first.</p>
        )}
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
              <span className={styles.amount}>{t.amount}<span className={styles.approx}>{aboutEur(t.amount)}</span></span>
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
            <span className={styles.amount}>{ONCE_TIER.amount}<span className={styles.approx}>{aboutEur(ONCE_TIER.amount)}</span></span>
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

/** "$5 a month" stays what GitHub charges; the euro figure beside it is a guide. */
function aboutEur(amount: string) {
  const usd = Number(/\$(\d+)/.exec(amount)?.[1]);
  return usd ? ` · about ${eur(usd * EUR_PER_USD)}` : "";
}
