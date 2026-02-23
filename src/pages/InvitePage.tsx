import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { GrytLogo } from "../components/GrytLogo";
import styles from "./InvitePage.module.css";

function buildAppUrl(host: string, code: string): string {
  return `https://app.gryt.chat/invite?host=${encodeURIComponent(host)}&code=${encodeURIComponent(code)}`;
}

export function InvitePage() {
  const [params] = useSearchParams();
  const host = params.get("host") || "";
  const code = params.get("code") || "";
  const valid = host.length > 0 && code.length > 0;

  const [showFallback, setShowFallback] = useState(false);

  useEffect(() => {
    if (!valid) return;

    const appUrl = buildAppUrl(host, code);
    window.location.href = appUrl;

    const timer = setTimeout(() => setShowFallback(true), 1500);
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

  const appUrl = buildAppUrl(host, code);

  return (
    <main className={styles.page}>
      <div className={styles.card}>
        <GrytLogo size={56} className={styles.logo} />
        <h1 className={styles.title}>Server Invite</h1>
        <p className={styles.host}>{host}</p>

        {showFallback ? (
          <>
            <p className={styles.desc}>
              You&rsquo;ve been invited to join a Gryt server. Click below to
              open the invite in the app.
            </p>
            <div className={styles.actions}>
              <a href={appUrl} className="btn btn-primary">
                Accept Invite
              </a>
              <a href="https://app.gryt.chat" className="btn btn-outline">
                Open Gryt
              </a>
            </div>
          </>
        ) : (
          <p className={styles.desc}>Redirecting to the Gryt app&hellip;</p>
        )}
      </div>
    </main>
  );
}
