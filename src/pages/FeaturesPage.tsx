import { useState } from "react";
import { Link } from "react-router-dom";

import { app } from "../../content/changelog/releases";
import { PageHeader } from "../components/PageHeader";
import { Voice } from "../components/home/Voice";
import { getPost } from "../lib/blog";
import {
  FEATURE_AREAS,
  beforeOne,
  featureLines,
  upcoming,
  type FeatureArea,
} from "../data/features";
import styles from "./FeaturesPage.module.css";

type Filter = FeatureArea | "all";

/** The big areas, shown off before the full list. Highlights are titles from featureLines. */
const SHOWCASE: { area: FeatureArea; title: string; text: string; image: string; alt: string; picks: string[] }[] = [
  {
    area: "chat",
    title: "Everything you expect from a chat",
    text: "Threads, polls, search and your own emoji, in channels and in direct messages.",
    image: "/features/threads.webp",
    alt: "A thread open beside a channel in Gryt",
    picks: ["Threads that fill the chat", "Polls", "Message search", "Your own emoji"],
  },
  {
    area: "servers",
    title: "Run it the way you want",
    text: "Roles, moderation and bots, with permissions down to a single channel.",
    image: "/features/roles.webp",
    alt: "The roles screen in server settings",
    picks: ["Roles and permissions", "Bots", "Plugins", "Spam filter"],
  },
  {
    area: "privacy",
    title: "Private by default",
    text: "Direct messages are end-to-end encrypted, and an account is optional.",
    image: "/features/encrypted-dm.webp",
    alt: "An encrypted direct message in Gryt",
    picks: ["Direct messages on MLS", "An account is optional", "Link a new device", "Your 24 words"],
  },
  {
    area: "hosting",
    title: "Your server, your rules",
    text: "Run a server from inside the app or on your own machine, or soon on Gryt Cloud.",
    image: "/home/create-server.poster.webp",
    alt: "Creating a server in the Gryt app",
    picks: ["A server inside the app", "LAN party mode", "Bring your Discord history", "Diagnostics for owners"],
  },
];

const shipped = featureLines.flatMap((l) => l.features.map((f) => ({ ...f, version: l.version })));

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

/* Fixed English months rather than toLocaleDateString, so the prerender and the
   browser can't disagree. */
function parts(iso: string) {
  const [y, m, d] = iso.split("-").map(Number);
  return { y, m: MONTHS[m - 1], d };
}

/** The stable releases in a minor line, oldest first: the dates and the first version. */
function lineInfo(version: string) {
  const stable = app
    .filter((r) => r.channel !== "beta" && r.version.startsWith(`${version}.`))
    .sort((a, b) => a.date.localeCompare(b.date));
  if (stable.length === 0) return null;
  const a = parts(stable[0].date);
  const b = parts(stable[stable.length - 1].date);
  let dates: string;
  if (stable[0].date === stable[stable.length - 1].date) dates = `${a.d} ${a.m} ${a.y}`;
  else if (a.m === b.m && a.y === b.y) dates = `${a.d} – ${b.d} ${b.m} ${b.y}`;
  else dates = `${a.d} ${a.m} – ${b.d} ${b.m} ${b.y}`;
  return { dates, first: stable[0].version };
}

function PostLink({ slug }: { slug: string }) {
  const post = getPost(slug);
  if (!post) return null;
  return (
    <Link to={`/blog/${slug}`} className={styles.postLink}>
      {post.frontmatter.title} <span aria-hidden="true">&rarr;</span>
    </Link>
  );
}

export function FeaturesPage() {
  const [area, setArea] = useState<Filter>("all");
  const keep = (a: FeatureArea) => area === "all" || a === area;

  const next = upcoming.filter((f) => keep(f.area));
  const lines = featureLines
    .map((l) => ({ ...l, info: lineInfo(l.version), features: l.features.filter((f) => keep(f.area)) }))
    .filter((l) => l.features.length > 0);

  const chips: [Filter, string][] = [["all", "All"], ...(Object.entries(FEATURE_AREAS) as [FeatureArea, string][])];

  return (
    <main className={styles.page}>
      <PageHeader
        eyebrow="Features"
        title="Everything in Gryt, and when it arrived."
        lede={
          <>
            First what we&rsquo;re working on. Then every release, newest first, all the way
            back to before 1.0. The <Link to="/changelog">changelog</Link> has every small
            fix, and the <Link to="/blog">blog</Link> has the long stories.
          </>
        }
      />

      <div role="group" aria-label="Show features from" className={styles.chips}>
        {chips.map(([id, label]) => (
          <button
            key={id}
            type="button"
            aria-pressed={area === id}
            className={styles.chip}
            onClick={() => setArea(id)}
          >
            {label}
          </button>
        ))}
      </div>

      {area === "all" && (
        <div className={styles.showcase}>
          <Voice />
          {SHOWCASE.map((row, i) => (
            <section key={row.area} className={i % 2 ? `${styles.show} ${styles.flip}` : styles.show}>
              <div>
                <p className={styles.showEyebrow}>{FEATURE_AREAS[row.area]}</p>
                <h2 className={styles.showTitle}>{row.title}</h2>
                <p className={styles.cardText}>{row.text}</p>
                <ul className={styles.picks}>
                  {row.picks.map((title) => {
                    const f = shipped.find((x) => x.title === title);
                    return f ? (
                      <li key={title}>
                        {title}
                        <span>{f.version}</span>
                      </li>
                    ) : null;
                  })}
                </ul>
                <button type="button" className={styles.showAll} onClick={() => setArea(row.area)}>
                  All {shipped.filter((f) => f.area === row.area).length} {FEATURE_AREAS[row.area].toLowerCase()} features
                </button>
              </div>
              <img className={styles.showShot} src={row.image} alt={row.alt} loading="lazy" decoding="async" />
            </section>
          ))}
        </div>
      )}

      {next.length > 0 && (
        <section aria-labelledby="next-title" className={styles.next}>
          <div>
            <h2 id="next-title" className={styles.nextTitle}>What we&rsquo;re working on</h2>
            <p className={styles.nextSub}>In progress first, then what&rsquo;s planned. No dates promised.</p>
          </div>
          <div className={styles.nextGrid}>
            {next.map((f) => (
              <article key={f.title} className={styles.nextCard} data-status={f.status === "In progress" ? "progress" : "planned"}>
                <div className={styles.cardMeta}>
                  <span className={styles.status}>{f.status}</span>
                  <span className={styles.area}>{FEATURE_AREAS[f.area]}</span>
                </div>
                <h3 className={styles.cardTitle}>{f.title}</h3>
                <p className={styles.cardText}>{f.text}</p>
              </article>
            ))}
          </div>
        </section>
      )}

      {lines.map((line) => (
        <details
          key={`${area}-${line.version}`}
          open={area !== "all"}
          aria-labelledby={`line-${line.version}`}
          className={styles.line}
        >
          <summary className={styles.lineHead}>
            <h2 id={`line-${line.version}`} className={styles.lineTitle}>
              Added in {line.version} <span className={styles.count}>· {line.features.length} features</span>
            </h2>
            {line.info && (
              <span className={styles.lineMeta}>
                {line.info.dates} &middot;{" "}
                <Link to={`/changelog/${line.info.first}`}>see the changelog</Link>
              </span>
            )}
          </summary>
          <div className={styles.grid}>
            {line.features.map((f) => {
              const image = f.image ?? (f.post ? getPost(f.post)?.frontmatter.image : undefined);
              return (
                <article key={f.title} className={styles.card}>
                  {image && (
                    <img className={styles.shot} src={image} alt="" loading="lazy" decoding="async" />
                  )}
                  <div className={styles.cardBody}>
                    <div className={styles.cardMeta}>
                      <span className={styles.month}>{f.month}</span>
                      <span className={styles.area}>{FEATURE_AREAS[f.area]}</span>
                    </div>
                    <h3 className={styles.cardTitle}>{f.title}</h3>
                    <p className={styles.cardText}>{f.text}</p>
                    {f.post && <PostLink slug={f.post} />}
                  </div>
                </article>
              );
            })}
          </div>
        </details>
      ))}

      {area === "all" && (
        <section aria-labelledby="before-title" className={styles.line}>
          <div className={`${styles.lineHead} ${styles.lineHeadStacked}`}>
            <h2 id="before-title" className={styles.lineTitle}>Before 1.0</h2>
            <p className={styles.lineMeta}>
              It took almost four years to get to 1.0. There are no version numbers from back
              then, just dates.
            </p>
          </div>
          <ol className={styles.timeline}>
            {beforeOne.map((m) => (
              <li key={m.title} className={styles.milestone}>
                <span className={styles.when}>{m.date}</span>
                <div className={styles.what}>
                  <span className={styles.milestoneTitle}>{m.title}</span>
                  <span className={styles.cardText}>{m.text}</span>
                  {m.post && <PostLink slug={m.post} />}
                </div>
              </li>
            ))}
          </ol>
        </section>
      )}

      <section className={styles.missing}>
        <h2 className={styles.missingTitle}>Missing something?</h2>
        <p className={styles.cardText}>
          Ask for it in the app under Give feedback, or on the{" "}
          <a href="https://gryt.chat/community">community server</a>.
        </p>
      </section>
    </main>
  );
}
