import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Button } from "@gryt/ui";
import { GrytLogo } from "../components/GrytLogo";
import { pageTitle } from "../lib/title";
import {
  categorizeAssets,
  fetchLatestRelease,
  formatSize,
  OS_NAMES,
  parseOS,
  primaryOption,
  type DownloadOption,
} from "../lib/releases";
import { useDetectedOS } from "../lib/useDetectedOS";
import styles from "../styles/handoff.module.css";

/**
 * One URL that starts a download.
 *
 * It exists for the message a stuck Windows client gets posted into its
 * channel. That used to link to GitHub Releases, which is a wall of release
 * notes above a collapsed Assets list of a dozen files across three platforms
 * — asking somebody whose app cannot update itself to go and identify the .exe.
 *
 * `?os=` rather than `/download/windows` because the site has no SPA fallback:
 * nginx serves prerendered directories and answers 404 for anything else, so a
 * path segment would need its own prerendered directory and its own share card
 * per platform. A query string resolves to this one directory and survives.
 *
 * Without `?os=` it reads the user agent, which is what a person arriving from
 * a link somewhere else wants.
 */

type State =
  | { kind: "resolving" }
  | { kind: "starting"; option: DownloadOption; version: string }
  | { kind: "empty" }
  | { kind: "failed" };

export function DownloadPage() {
  const [params] = useSearchParams();
  /* Null on the first render, on both sides of hydration. This page assigns
     window.location once it knows, so it cannot start on a guess and correct
     itself — that is two downloads. ?os= is no earlier than detection is: the
     prerender has no query string either. */
  const os = useDetectedOS(parseOS(params.get("os")));
  const [state, setState] = useState<State>({ kind: "resolving" });

  useEffect(() => {
    document.title = pageTitle("Download");
  }, []);

  useEffect(() => {
    if (!os) return;

    const abort = new AbortController();

    fetchLatestRelease(abort.signal)
      .then((release) => {
        const option = primaryOption(categorizeAssets(release.assets)[os], os);
        if (!option) {
          setState({ kind: "empty" });
          return;
        }

        setState({
          kind: "starting",
          option,
          version: release.tag_name.replace(/^v/, ""),
        });

        /*
         * Assigning to location rather than clicking a synthetic link: GitHub
         * serves release assets as attachments, so the browser downloads and
         * the page stays where it is. The link below is not a fallback for
         * this failing quietly — it is there because a browser can decline the
         * navigation, and there is no event to tell us it did.
         */
        window.location.href = option.url;
      })
      .catch((err: unknown) => {
        if (err instanceof DOMException && err.name === "AbortError") return;
        setState({ kind: "failed" });
      });

    return () => abort.abort();
  }, [os]);

  const name = os ? OS_NAMES[os] : null;

  return (
    <main className={styles.page}>
      <div className={styles.panel}>
        <GrytLogo size={44} className={styles.logo} />

        {/* aria-live so a screen reader hears the download arrive rather than
            sitting on "finding the latest build" indefinitely. */}
        <div className={styles.state} aria-live="polite">
          {state.kind === "resolving" && (
            <>
              <h1 className={styles.title}>
                {name ? `Getting Gryt for ${name}` : "Getting Gryt"}
              </h1>
              <p className={styles.waiting}>
                <span className={styles.pulse} aria-hidden="true" />
                Finding the latest build
              </p>
            </>
          )}

          {state.kind === "starting" && (
            <>
              <h1 className={styles.title}>Your download has started</h1>
              <p className={styles.body}>
                Gryt {state.version} for {name}, {formatSize(state.option.size)}.
              </p>
              <div className={styles.actions}>
                <Button
                  render={<a href={state.option.url} />}
                  size="large"
                  tone="neutral"
                >
                  Download again
                </Button>
              </div>
              <p className={styles.hint}>
                If nothing happened, use the button. Other builds and other
                platforms are on the{" "}
                <Link to="/#download">download page</Link>.
              </p>
            </>
          )}

          {state.kind === "empty" && (
            <>
              <h1 className={styles.title}>No {name} build yet</h1>
              <p className={styles.body}>
                The latest release doesn't have a {name} build in it. The{" "}
                <Link to="/#download">download page</Link> has what there is.
              </p>
            </>
          )}

          {state.kind === "failed" && (
            <>
              <h1 className={styles.title}>Couldn't reach GitHub</h1>
              <p className={styles.body}>
                Gryt asks GitHub which build is the latest one, and that
                didn't come back. It usually sorts itself out.
              </p>
              <div className={styles.actions}>
                <Button render={<Link to="/#download" />} size="large">
                  Go to the download page
                </Button>
              </div>
              <p className={styles.hint}>
                Or grab the file straight from{" "}
                <a
                  href="https://github.com/Gryt-chat/gryt/releases/latest"
                  target="_blank"
                  rel="noreferrer"
                >
                  the latest release
                </a>
                .
              </p>
            </>
          )}
        </div>
      </div>
    </main>
  );
}
