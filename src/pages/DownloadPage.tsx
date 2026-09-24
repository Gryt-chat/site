import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Button } from "@gryt/ui";
import { GrytLogo } from "../components/GrytLogo";
import { StoreBadge } from "../components/StoreBadge";
import { pageTitle } from "../lib/title";
import {
  categorizeAssets,
  downloadTarget,
  fetchLatestRelease,
  FILE_ANCHOR,
  formatSize,
  isDesktop,
  OS_NAMES,
  primaryOption,
  STORES,
  type DownloadOption,
} from "../lib/releases";
import { useDetectedArch } from "../lib/useDetectedArch";
import { useDetectedOS } from "../lib/useDetectedOS";
import styles from "../styles/handoff.module.css";

/**
 * One URL that starts a download. `?os=` rather than `/download/windows`: the site has no
 * SPA fallback, so a path segment would need its own prerendered directory and share card.
 */

type State =
  | { kind: "resolving" }
  | { kind: "starting"; option: DownloadOption; version: string }
  | { kind: "empty" }
  | { kind: "failed" };

export function DownloadPage() {
  const [params] = useSearchParams();
  /* Null on the first render, on both sides of hydration. This page assigns window.location
     once it knows, so it cannot start on a guess and correct itself — that is two downloads. */
  const os = downloadTarget(useDetectedOS(), params.get("os"));
  const phone = os !== null && !isDesktop(os);
  const store = phone ? STORES.find((s) => s.os === os) : undefined;
  /* Null off a Mac and in Safari, which is fine: primaryOption falls back to
     Apple silicon, and the line below tells the person which one they got. */
  const arch = useDetectedArch();
  const [state, setState] = useState<State>({ kind: "resolving" });

  useEffect(() => {
    document.title = pageTitle("Download");
  }, []);

  useEffect(() => {
    if (!os || phone) return;

    const abort = new AbortController();

    fetchLatestRelease(abort.signal)
      .then((release) => {
        const option = primaryOption(categorizeAssets(release.assets)[os], os, arch);
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
         * Assigning to location rather than clicking a synthetic link: GitHub serves assets
         * as attachments. The link below exists because a browser can decline, silently.
         */
        window.location.href = option.url;
      })
      .catch((err: unknown) => {
        if (err instanceof DOMException && err.name === "AbortError") return;
        setState({ kind: "failed" });
      });

    return () => abort.abort();
  }, [os, phone, arch]);

  const name = os ? OS_NAMES[os] : null;

  return (
    <main className={styles.page}>
      <div className={styles.panel}>
        <GrytLogo size={44} className={styles.logo} />

        {/* aria-live so a screen reader hears the download arrive rather than
            sitting on "finding the latest build" indefinitely. */}
        <div className={styles.state} aria-live="polite">
          {phone && store?.url && (
            <>
              <h1 className={styles.title}>Get Gryt for {name}</h1>
              <div className={styles.actions}>
                <StoreBadge store={store} className={styles.storeBadge} />
              </div>
              <p className={styles.hint}>
                On a computer, this page starts the download.
              </p>
            </>
          )}

          {phone && !store?.url && (
            <>
              <h1 className={styles.title}>Gryt isn&rsquo;t on phones or tablets yet</h1>
              <p className={styles.body}>
                The phone app is in testing. Until it&rsquo;s out, Gryt works in your browser.
              </p>
              <div className={styles.actions}>
                <Button render={<a href="https://app.gryt.chat" />} size="large">
                  Open app.gryt.chat
                </Button>
              </div>
              <p className={styles.hint}>
                On a computer, this page starts the download.
              </p>
            </>
          )}

          {!phone && state.kind === "resolving" && (
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

          {!phone && state.kind === "starting" && (
            <>
              <h1 className={styles.title}>Your download has started</h1>
              <p className={styles.body}>
                Gryt {state.version} for {name}, {formatSize(state.option.size)}.
              </p>

              {/* Linux, because the format needs saying, and macOS, because
                  the chip does: an arm64 disk image will not open on an Intel
                  Mac, and Safari does not say which one it is. Windows hands
                  over an installer that needs no explanation. The download has
                  already started, so there is no earlier moment for either. */}
              {(os === "linux" || os === "macos") && (
                <p className={styles.note}>{state.option.description}</p>
              )}

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
                <Link to={`/#${FILE_ANCHOR}`}>download page</Link>.
              </p>
            </>
          )}

          {!phone && state.kind === "empty" && (
            <>
              <h1 className={styles.title}>No {name} build yet</h1>
              <p className={styles.body}>
                The latest release doesn't have a {name} build in it. The{" "}
                <Link to={`/#${FILE_ANCHOR}`}>download page</Link> has what there is.
              </p>
            </>
          )}

          {!phone && state.kind === "failed" && (
            <>
              <h1 className={styles.title}>The download list isn&rsquo;t available right now</h1>
              <p className={styles.body}>
                Nothing wrong with your connection. This page
                doesn&rsquo;t have the list yet.
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
