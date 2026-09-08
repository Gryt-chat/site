import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Button } from "@gryt/ui";
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

/**
 * Whether this is a phone, which changes what the page may do. iOS blocks a scheme
 * navigation no tap started, so on a phone the link is behind a button rather than fired.
 */
function isPhone(): boolean {
  if (typeof navigator === "undefined") return false;
  return /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
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
 * An app screen, not a landing page: somebody arrives holding a link and needs one decision
 * made fast. Four states — handing off, choosing, invalid, and degraded when /info is silent.
 */
export function InvitePage() {
  const [params] = useSearchParams();
  const host = params.get("host") || "";
  const code = params.get("code") || "";
  const valid = host.length > 0 && code.length > 0;

  // Read once. It cannot change while the page is open, and re-reading it in
  // render would make the first paint differ from the second.
  const [phone] = useState(isPhone);
  // A phone starts in the choosing state rather than being put into it by an effect: there
  // is no hand-off to wait for, and it keeps the first paint the same as the second.
  const [showChoices, setShowChoices] = useState(phone);
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

    // Nothing is fired on load on a phone — see `isPhone` for why. The page is
    // already showing the choices.
    if (phone) return;

    // Try opening the desktop app via the gryt:// protocol.
    window.location.href = buildDeepLink(host, code);

    // If nothing happened after a short delay, show manual choices.
    const timer = setTimeout(() => setShowChoices(true), 1500);
    return () => clearTimeout(timer);
  }, [valid, host, code, phone]);

  if (!valid) {
    return (
      <main className={styles.page}>
        <div className={styles.panel}>
          <GrytLogo size={44} className={styles.logo} />
          <h1 className={styles.title}>This invite link is incomplete</h1>
          <p className={styles.body}>
            It is missing the server or the code, so there is nowhere to send
            you. Ask whoever sent it for the whole link.
          </p>
          <div className={styles.actions}>
            <Button
              render={<a href="https://app.gryt.chat" />}
              size="large"
              tone="neutral"
            >
              Open Gryt
            </Button>
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
              <Button
                render={<a href={buildDeepLink(host, code)} />}
                size="large"
              >
                {phone ? "Join in the Gryt app" : "Open in the desktop app"}
              </Button>
              <Button
                render={<a href={buildWebAppUrl(host, code)} />}
                size="large"
                tone="neutral"
              >
                Open in the browser
              </Button>
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
