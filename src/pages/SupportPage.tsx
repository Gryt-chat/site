import { useEffect, useState } from "react";

import { Block, LinkRows, type RowItem } from "../components/LinkRows";
import { PageHeader } from "../components/PageHeader";
import { DOCS_SEARCH_URL, toSupportResults, type DocsHit } from "../lib/supportSearch";
import { pageTitle } from "../lib/title";
import styles from "../styles/audience.module.css";
import own from "./SupportPage.module.css";

const TROUBLESHOOTING = "https://docs.gryt.chat/docs/use/troubleshooting";
const MIN_QUERY_LENGTH = 2;
const SEARCH_DELAY_MS = 200;

const COMMON: RowItem[] = [
  {
    name: "I can't invite a friend",
    detail: "Links that only work on your network, refused codes and missing permissions.",
    href: `${TROUBLESHOOTING}#invite-issues`,
  },
  {
    name: "Nobody can hear anyone",
    detail: "Chat works, but voice doesn't. Usually a closed UDP port or a wrong address.",
    href: `${TROUBLESHOOTING}#people-connect-and-chat-but-nobody-can-hear-anyone`,
  },
  {
    name: "My microphone doesn't work",
    detail: "Permissions, and picking the right input device.",
    href: `${TROUBLESHOOTING}#microphone-not-working`,
  },
  {
    name: "I can't connect to a server",
    detail: "Connection errors, wrong clocks and unrecognised servers.",
    href: `${TROUBLESHOOTING}#connection-issues`,
  },
  {
    name: "The app won't install or open",
    detail: "Windows SmartScreen, macOS warnings and Linux AppImages.",
    href: `${TROUBLESHOOTING}#installation-warnings`,
  },
  {
    name: "Is Gryt down?",
    detail: "Check sign-in, the hosted servers and the web client.",
    href: "https://status.gryt.chat",
  },
];

const PEOPLE: RowItem[] = [
  {
    name: "Our Gryt server",
    detail: "Ask in the community server. Screenshots and error messages help a lot.",
    href: "https://gryt.chat/community",
  },
  {
    name: "Feedback",
    detail: "Report a bug or ask for something new.",
    href: "https://feedback.gryt.chat",
  },
];

type SearchState =
  | { kind: "idle" }
  | { kind: "loading" }
  | { kind: "done"; results: RowItem[] }
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

export function SupportPage() {
  const [query, setQuery] = useState("");
  const search = useDocsSearch(query.trim());

  useEffect(() => {
    document.title = pageTitle("Support");
  }, []);

  return (
    <main className={styles.page}>
      <PageHeader
        eyebrow="Support"
        title="What's going wrong?"
        lede="Search the docs, or start with the problems people run into most."
      />

      <section className={own.search}>
        <label className={own.label} htmlFor="support-search">
          Search the docs
        </label>
        <div className={own.field}>
          <input
            id="support-search"
            className={own.input}
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="invite link doesn't work"
            autoComplete="off"
          />
        </div>

        <p className={own.status} role="status">
          {search.kind === "loading" && "Searching…"}
          {search.kind === "done" && search.results.length === 0 && (
            <>No results. Try fewer words, or ask us below.</>
          )}
          {search.kind === "failed" && (
            <>
              Search isn&rsquo;t working right now. You can still read{" "}
              <a href={TROUBLESHOOTING}>Troubleshooting</a>
              .
            </>
          )}
        </p>
        {search.kind === "done" && search.results.length > 0 && <LinkRows items={search.results} />}
      </section>

      <Block heading="Common problems" items={COMMON} />
      <Block heading="Ask a person" items={PEOPLE} />
    </main>
  );
}
