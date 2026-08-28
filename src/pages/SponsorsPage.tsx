import { useEffect } from "react";
import { Button } from "@gryt/ui";
import { PageHeader } from "../components/PageHeader";
import { formatSince, sponsors } from "../data/sponsors";
import { pageTitle } from "../lib/title";
import styles from "./SponsorsPage.module.css";

const SPONSOR_URL = "https://github.com/sponsors/Gryt-chat";

const TIERS = [
  { amount: "$5 a month", gets: "A sponsor badge on your GitHub profile." },
  { amount: "$25 a month", gets: "Your name or handle in Gryt's README." },
  { amount: "$50 once", gets: "Your name in the notes for the next release." },
  { amount: "$100 a month", gets: "Your logo on this site, linked wherever you want." },
  {
    amount: "$500 a month",
    gets: "Logo at the top of the list, and your team's bug reports looked at first.",
  },
];

/**
 * Everyone who has sponsored Gryt, and what sponsoring pays for.
 *
 * The front page carries the current logos and names, because that is what the
 * $100 tier promises and the front page is where it was promised. The history
 * lives here: a one-off from a year ago is not current, and putting it on the
 * front page either implies it is or needs a caveat next to it.
 *
 * The list does not animate. It is a list, and a list that arrives row by row
 * is one you cannot scan.
 */
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

  const name = (s: (typeof sponsors)[number]) =>
    s.href ? (
      <a href={s.href} target="_blank" rel="noreferrer">
        {s.name}
      </a>
    ) : (
      s.name
    );

  return (
    <main className={styles.page}>
      <PageHeader
        eyebrow="Sponsors"
        title="People who have sponsored Gryt"
        lede={
          <>
            Sponsoring pays for a domain, the box the auth stack runs on, and
            the Apple and Windows signing certificates that stop the installer
            warning people off their own download. That's the whole list.
            There's nothing to buy inside Gryt, and nothing held back for
            people who pay.
          </>
        }
      />

      {sponsors.length === 0 ? (
        <p className={styles.empty}>
          Nobody yet. This is where names go.
        </p>
      ) : (
        <>
          {recurring.length > 0 && (
            <section className={styles.block}>
              <h2 className={styles.blockHeading}>Sponsoring now</h2>
              <ul className={styles.list}>
                {recurring.map((s) => (
                  <li key={s.name}>
                    {s.logo && (
                      <img className={styles.logo} src={s.logo} alt="" aria-hidden="true" />
                    )}
                    <span className={styles.name}>{name(s)}</span>
                    <span className={styles.date}>since {formatSince(s.since)}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {once.length > 0 && (
            <section className={styles.block}>
              <h2 className={styles.blockHeading}>Sponsored once</h2>
              <p className={styles.blockNote}>
                A one-off payment rather than a subscription. Nobody here has
                stopped sponsoring, because there was never anything to stop.
              </p>
              <ul className={styles.list}>
                {once.map((s) => (
                  <li key={`${s.name}-${s.since}`}>
                    {s.logo && (
                      <img className={styles.logo} src={s.logo} alt="" aria-hidden="true" />
                    )}
                    <span className={styles.name}>{name(s)}</span>
                    <span className={styles.date}>{formatSince(s.since)}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </>
      )}

      <section className={styles.block}>
        <h2 className={styles.blockHeading}>What the tiers give you</h2>
        <ul className={styles.tiers}>
          {TIERS.map((t) => (
            <li key={t.amount}>
              <span className={styles.amount}>{t.amount}</span>
              <span className={styles.gets}>{t.gets}</span>
            </li>
          ))}
        </ul>
        <p className={styles.footnote}>
          Money has also come in through Ko-fi and directly, which the tiers
          don't cover. Anyone who has sent something is listed here the same
          way, and nothing goes up without asking first.
        </p>
        <Button
          className={styles.button}
          render={<a href={SPONSOR_URL} target="_blank" rel="noreferrer" />}
          tone="ghost"
        >
          Sponsor Gryt
        </Button>
      </section>
    </main>
  );
}
