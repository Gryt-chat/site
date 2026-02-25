import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { GrytLogo } from "../components/GrytLogo";
import styles from "./InvitePage.module.css";

function buildDeepLink(host: string, code: string): string {
  return `gryt://invite?host=${encodeURIComponent(host)}&code=${encodeURIComponent(code)}`;
}

function buildWebAppUrl(host: string, code: string): string {
  return `https://app.gryt.chat/invite?host=${encodeURIComponent(host)}&code=${encodeURIComponent(code)}`;
}

export function InvitePage() {
  const [params] = useSearchParams();
  const host = params.get("host") || "";
  const code = params.get("code") || "";
  const valid = host.length > 0 && code.length > 0;

  const [showChoices, setShowChoices] = useState(false);

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

  return (
    <main className={styles.page}>
      <div className={styles.card}>
        <GrytLogo size={56} className={styles.logo} />
        <h1 className={styles.title}>Server Invite</h1>
        <p className={styles.host}>{host}</p>

        {showChoices ? (
          <>
            <p className={styles.desc}>
              You&rsquo;ve been invited to join a Gryt server.
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
