import { useEffect } from "react";
import { Link } from "react-router-dom";
import { PageHeader } from "../components/PageHeader";
import { formatSince, sponsors, type Sponsor } from "../data/sponsors";
import { pageTitle } from "../lib/title";
import styles from "./SponsorsPage.module.css";

/** Everyone who has sponsored Gryt. How to join them is on /sponsor. */
export function SponsorsPage() {
  useEffect(() => {
    document.title = pageTitle("Sponsors");
  }, []);

  const recurring = sponsors
    .filter((s) => s.kind === "recurring")
    .sort((a, b) => a.since.localeCompare(b.since));
  const once = sponsors
    .filter((s) => s.kind === "once")
    .sort((a, b) => b.since.localeCompare(a.since));

  const card = (s: Sponsor, date: string) => (
    <li key={`${s.name}-${s.since}`} className={styles.card}>
      {s.logo ? (
        <img className={styles.logo} src={s.logo} alt="" aria-hidden="true" />
      ) : (
        <span className={styles.mark} aria-hidden="true">{s.name.charAt(0)}</span>
      )}
      <span className={styles.text}>
        <span className={styles.name}>
          {s.href ? <a href={s.href} target="_blank" rel="noreferrer">{s.name}</a> : s.name}
        </span>
        <span className={styles.date}>{date}</span>
      </span>
    </li>
  );

  return (
    <main className={styles.page}>
      <PageHeader
        eyebrow="Sponsors"
        title="People who have chipped in"
        lede={<>Everyone who's helped pay Gryt's bills. Nothing goes up here without asking first.</>}
      />

      {sponsors.length === 0 && (
        <p className={styles.empty}>Nobody yet. This is where the names go.</p>
      )}

      {recurring.length > 0 && (
        <section className={styles.block}>
          <h2 className={styles.blockHeading}>Sponsoring now</h2>
          <ul className={styles.cards}>
            {recurring.map((s) => card(s, `since ${formatSince(s.since)}`))}
          </ul>
        </section>
      )}

      {once.length > 0 && (
        <section className={styles.block}>
          <h2 className={styles.blockHeading}>Sponsored once</h2>
          <p className={styles.blockNote}>
            A one-off payment instead of a subscription.
          </p>
          <ul className={styles.cards}>
            {once.map((s) => card(s, formatSince(s.since)))}
          </ul>
        </section>
      )}

      <section className={styles.join}>
        <span className={styles.joinText}>
          <span className={styles.joinHeading}>Want your name here?</span>
          <span className={styles.joinNote}>Monthly or once, through GitHub Sponsors.</span>
        </span>
        <Link className={styles.button} to="/sponsor">Sponsor Gryt</Link>
      </section>
    </main>
  );
}
