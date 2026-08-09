import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { GrytLogo } from "../components/GrytLogo";
import styles from "../styles/handoff.module.css";

type ServerPreview = {
  name: string;
  description?: string;
  members?: string;
};

function buildDeepLink(host: string, code: string): string {
  return `gryt://invite?host=${encodeURIComponent(host)}&code=${encodeURIComponent(code)}`;
}

function buildWebAppUrl(host: string, code: string): string {
  return `https://app.gryt.chat/invite?host=${encodeURIComponent(host)}&code=${encodeURIComponent(code)}`;
}

function ServerIcon({ host, name }: { host: string; name: string }) {
  const [failed, setFailed] = useState(false);
  const letter = (name[0] || "S").toUpperCase();

  if (failed) {
    return (
      <div className={styles.iconFallback} aria-hidden>
        {letter}
      </div>
    );
  }

  return (
    <img
      className={styles.icon}
      src={`https://${host}/icon`}
      alt=""
      onError={() => setFailed(true)}
    />
  );
}

/**
 * Not a macrostructure. This is an app screen, not a landing page: somebody
 * arrives holding a link and needs one decision made for them as fast as
 * possible. Hallmark's own component-scope rule says to say that out loud and
 * skip the page apparatus, so what gets the attention here is the state
 * machine instead.
 *
 * Four states, and each one is now visibly different:
 *   handing off  the gryt:// deep link has been fired, nothing has answered yet
 *   choosing     it did not answer within 1.5s, so ask
 *   invalid      the link is missing host or code
 *   (degraded)   /info did not answer, so the hostname stands in for the name
 */
export function InvitePage() {
  const [params] = useSearchParams();
  const host = params.get("host") || "";
  const code = params.get("code") || "";
  const valid = host.length > 0 && code.length > 0;

  const [showChoices, setShowChoices] = useState(false);
  const [preview, setPreview] = useState<ServerPreview | null>(null);

  useEffect(() => {
    if (!valid) return;
    const ac = new AbortController();
    fetch(`https://${host}/info`, { signal: ac.signal })
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((data: ServerPreview) => setPreview(data))
      .catch(() => {
        /* fallback to hostname only */
      });
    return () => ac.abort();
  }, [valid, host]);

  useEffect(() => {
    if (!valid) return;

    // Try opening the desktop app via the gryt:// protocol.
    window.location.href = buildDeepLink(host, code);

    // If nothing happened after a short delay, show manual choices.
    const timer = setTimeout(() => setShowChoices(true), 1500);
    return () => clearTimeout(timer);
  }, [valid, host, code]);

  if (!valid) {
    return (
      <main className={styles.page}>
        <div className={styles.panel}>
          <GrytLogo size={44} className={styles.logo} />
          <h1 className={styles.title}>This invite link is incomplete</h1>
          <p className={styles.body}>
            It is missing the server or the code it needs to send you anywhere.
            Ask whoever sent it for the full link.
          </p>
          <div className={styles.actions}>
            <a href="https://app.gryt.chat" className={styles.secondary}>
              Open Gryt
            </a>
          </div>
        </div>
      </main>
    );
  }

  const displayName = preview?.name || host;

  return (
    <main className={styles.page}>
      <div className={styles.panel}>
        <ServerIcon host={host} name={displayName} />

        <p className={styles.kicker}>You have been invited to</p>
        <h1 className={styles.title}>{displayName}</h1>

        {preview?.description && (
          <p className={styles.body}>{preview.description}</p>
        )}

        {/* In the degraded state the server name IS the hostname, and printing
            it again underneath just looks like a rendering fault. */}
        {(displayName !== host || preview?.members) && (
          <p className={styles.host}>
            {displayName !== host && (
              <span className={styles.hostName}>{host}</span>
            )}
            {displayName !== host && preview?.members && (
              <span aria-hidden="true"> · </span>
            )}
            {preview?.members && <>{preview.members} members</>}
          </p>
        )}

        {/* aria-live so the change from handing-off to choosing is announced;
            without it a screen reader sits on "Opening Gryt" indefinitely. */}
        <div className={styles.state} aria-live="polite">
          {showChoices ? (
            <div className={styles.actions}>
              <a
                href={buildDeepLink(host, code)}
                className={styles.primary}
              >
                Open in the desktop app
              </a>
              <a href={buildWebAppUrl(host, code)} className={styles.secondary}>
                Open in the browser
              </a>
            </div>
          ) : (
            <p className={styles.waiting}>
              <span className={styles.pulse} aria-hidden="true" />
              Opening Gryt
            </p>
          )}
        </div>
      </div>
    </main>
  );
}
