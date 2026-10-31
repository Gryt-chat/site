import { type ReactNode, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  PiDownloadSimple,
  PiLinkBreak,
  PiMagnifyingGlass,
  PiMicrophone,
  PiSpeakerSlash,
} from "react-icons/pi";

import { DOCS_SEARCH_URL, toSupportResults, type DocsHit, type SupportResult } from "../lib/supportSearch";
import { pageTitle } from "../lib/title";
import styles from "./SupportPage.module.css";

const TROUBLESHOOTING = "https://docs.gryt.chat/docs/use/troubleshooting";
const MIN_QUERY_LENGTH = 2;
const SEARCH_DELAY_MS = 200;
const SUGGESTIONS = ["invite link", "microphone", "open ports"];

type SearchState =
  | { kind: "idle" }
  | { kind: "loading" }
  | { kind: "done"; results: SupportResult[] }
  | { kind: "failed" };

function useDocsSearch(query: string): SearchState {
  const [answer, setAnswer] = useState<{ query: string; state: SearchState } | null>(null);
  const searchable = query.length >= MIN_QUERY_LENGTH;

  useEffect(() => {
    if (!searchable) return;

    const controller = new AbortController();
    const timer = setTimeout(async () => {
      try {
        const url = `${DOCS_SEARCH_URL}?query=${encodeURIComponent(query)}`;
        const response = await fetch(url, { signal: controller.signal });
        if (!response.ok) throw new Error(`search answered ${response.status}`);
        const hits = (await response.json()) as DocsHit[];
        setAnswer({ query, state: { kind: "done", results: toSupportResults(hits) } });
      } catch {
        if (!controller.signal.aborted) setAnswer({ query, state: { kind: "failed" } });
      }
    }, SEARCH_DELAY_MS);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [query, searchable]);

  if (!searchable) return { kind: "idle" };
  return answer?.query === query ? answer.state : { kind: "loading" };
}

function ProblemCard({
  to,
  title,
  text,
  icon,
  className,
  children,
}: {
  to: string;
  title: string;
  text: string;
  icon?: ReactNode;
  className?: string;
  children?: ReactNode;
}) {
  const classes = `${styles.card} ${className ?? ""}`;
  const body = (
    <>
      {icon && <span className={styles.cardIcon} aria-hidden="true">{icon}</span>}
      {children}
      <div>
        <h3 className={styles.cardTitle}>{title}</h3>
        <p className={styles.cardText}>{text}</p>
      </div>
    </>
  );

  return to.startsWith("/") ? (
    <Link className={classes} to={to}>{body}</Link>
  ) : (
    <a className={classes} href={to} target="_blank" rel="noreferrer">{body}</a>
  );
}

export function SupportPage() {
  const [query, setQuery] = useState("");
  const search = useDocsSearch(query.trim());

  useEffect(() => {
    document.title = pageTitle("Support");
  }, []);

  return (
    <main className={styles.page}>
      <section className={styles.hero}>
        <img className={styles.owl} src="/logo.svg" alt="The Gryt owl" width={96} height={96} />
        <h1 className={styles.title}>Stuck? Let&rsquo;s get you talking again.</h1>
        <p className={styles.lede}>
          Tell us what&rsquo;s going wrong, or pick the closest match below. If that doesn&rsquo;t fix it, ask us.
        </p>

        <div className={styles.search}>
          <label className={styles.label} htmlFor="support-search">
            Search the help pages
          </label>
          <div className={styles.field}>
            <PiMagnifyingGlass className={styles.fieldIcon} size={22} aria-hidden="true" />
            <input
              id="support-search"
              className={styles.input}
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="My friend can't join my server"
              autoComplete="off"
            />
          </div>

          {search.kind === "idle" && (
            <div className={styles.tries}>
              <span>Try</span>
              {SUGGESTIONS.map((suggestion) => (
                <button key={suggestion} type="button" className={styles.try} onClick={() => setQuery(suggestion)}>
                  {suggestion}
                </button>
              ))}
            </div>
          )}

          <div role="status">
            {search.kind === "loading" && <p className={styles.status}>Searching…</p>}
            {search.kind === "done" && search.results.length === 0 && (
              <p className={styles.status}>No results. Try fewer words, or ask us below.</p>
            )}
            {search.kind === "failed" && (
              <p className={styles.status}>
                Search isn&rsquo;t working right now. You can still read{" "}
                <a href={TROUBLESHOOTING}>Troubleshooting</a>.
              </p>
            )}
          </div>

          {search.kind === "done" && search.results.length > 0 && (
            <ul className={styles.results}>
              {search.results.map((result) => (
                <li key={result.href}>
                  <a className={styles.result} href={result.href} target="_blank" rel="noreferrer">
                    <span className={styles.resultName}>{result.name}</span>
                    <span className={styles.resultPage}>{result.page}</span>
                    {result.detail && <span className={styles.resultDetail}>{result.detail}</span>}
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>

      <section aria-labelledby="support-common">
        <h2 id="support-common" className={styles.heading}>
          What people ask about most
        </h2>
        <div className={styles.cards}>
          <ProblemCard
            className={styles.cardFeature}
            to="/support/invite-a-friend"
            title="I can't invite a friend"
            text="Does your link look like this? That address only works on your own network. Here's the fix, and what to do if a code gets refused."
          >
            <div className={styles.example}>
              gryt.chat/invite?host=<span className={styles.exampleHost}>192.168.1.20</span>:5000
            </div>
          </ProblemCard>
          <ProblemCard
            className={styles.cardWide}
            to="/support/nobody-can-hear-anyone"
            icon={<PiSpeakerSlash size={30} />}
            title="Nobody can hear anyone"
            text="Chat works but voice doesn't. It's usually a closed port."
          />
          <ProblemCard
            to="/support/microphone"
            icon={<PiMicrophone size={30} />}
            title="My mic doesn't work"
            text="Permissions and picking the right device."
          />
          <ProblemCard
            to="/support/cant-connect"
            icon={<PiLinkBreak size={30} />}
            title="I can't connect"
            text="Connection errors, wrong clocks and servers it doesn't recognise."
          />
          <ProblemCard
            to="/support/install"
            icon={<PiDownloadSimple size={30} />}
            title="The app won't install"
            text="Warnings on Windows and macOS, and Linux AppImages."
          />
        </div>
        <p className={styles.statusLine}>
          Everything down at once? <a href="https://status.gryt.chat">Check the status page</a>.
        </p>
      </section>

      <section className={styles.ask} aria-labelledby="support-ask">
        <div className={styles.askBody}>
          <h2 id="support-ask" className={styles.askTitle}>
            Still stuck? Ask us.
          </h2>
          <p className={styles.askText}>
            A person reads every question. Gryt&rsquo;s a small project, so a reply can take a little while. Tell us
            what you tried and what it said. A screenshot helps a lot.
          </p>
        </div>
        <div className={styles.askLinks}>
          <a className={styles.primary} href="https://gryt.chat/community">
            Ask in our Gryt server
          </a>
          <a className={styles.secondary} href="https://feedback.gryt.chat">
            Report a bug
          </a>
        </div>
      </section>
    </main>
  );
}
