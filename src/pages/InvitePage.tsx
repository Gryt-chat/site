import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { GrytLogo } from "../components/GrytLogo";
import styles from "./InvitePage.module.css";

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
      alt={`${name} icon`}
      onError={() => setFailed(true)}
    />
  );
}

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
        <div className={styles.card}>
          <GrytLogo size={56} className={styles.logo} />
          <h1 className={styles.title}>Invalid Invite</h1>
          <p className={styles.error}>
            This invite link is missing required parameters.
          </p>
          <div className={styles.actions}>
            <a href="https://app.gryt.chat" className="btn btn-primary">
              Open Gryt
            </a>
          </div>
        </div>
      </main>
    );
  }

  const deepLink = buildDeepLink(host, code);
  const webAppUrl = buildWebAppUrl(host, code);
  const displayName = preview?.name || host;

  return (
    <main className={styles.page}>
      <div className={styles.card}>
        <ServerIcon host={host} name={displayName} />
        <h1 className={styles.title}>{displayName}</h1>
        {preview?.description && (
          <p className={styles.description}>{preview.description}</p>
        )}
        <p className={styles.host}>{host}</p>
        {preview?.members && (
          <p className={styles.members}>{preview.members} members</p>
        )}

        {showChoices ? (
          <>
            <p className={styles.desc}>
              You&rsquo;ve been invited to join this server.
            </p>
            <div className={styles.actions}>
              <a href={deepLink} className="btn btn-primary">
                Open in Desktop App
              </a>
              <a href={webAppUrl} className="btn btn-outline">
                Open in Browser
              </a>
            </div>
          </>
        ) : (
          <p className={styles.desc}>Opening Gryt&hellip;</p>
        )}
      </div>
    </main>
  );
}
