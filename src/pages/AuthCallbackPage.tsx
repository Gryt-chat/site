import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { GrytLogo } from "../components/GrytLogo";
import styles from "./AuthCallbackPage.module.css";

function buildDeepLink(params: URLSearchParams): string {
  const qs = new URLSearchParams();
  for (const [key, value] of params) {
    qs.set(key, value);
  }
  return `gryt://auth/callback?${qs.toString()}`;
}

export function AuthCallbackPage() {
  const [params] = useSearchParams();
  const code = params.get("code") || "";
  const state = params.get("state") || "";
  const valid = code.length > 0 && state.length > 0;

  const [showFallback, setShowFallback] = useState(false);

  useEffect(() => {
    if (!valid) return;

    window.location.href = buildDeepLink(params);

    const timer = setTimeout(() => setShowFallback(true), 1500);
    return () => clearTimeout(timer);
  }, [valid, params]);

  if (!valid) {
    return (
      <main className={styles.page}>
        <div className={styles.card}>
          <GrytLogo size={56} className={styles.logo} />
          <h1 className={styles.title}>Authentication Failed</h1>
          <p className={styles.error}>
            This callback is missing required parameters. Please try signing in
            again from the app.
          </p>
        </div>
      </main>
    );
  }

  const deepLink = buildDeepLink(params);

  return (
    <main className={styles.page}>
      <div className={styles.card}>
        <GrytLogo size={56} className={styles.logo} />

        {showFallback ? (
          <>
            <h1 className={styles.title}>Continue in Gryt</h1>
            <p className={styles.desc}>
              Click the button below if the app didn&rsquo;t open automatically.
            </p>
            <div className={styles.actions}>
              <a href={deepLink} className="btn btn-primary">
                Open Gryt
              </a>
            </div>
            <p className={styles.hint}>You can close this tab afterwards.</p>
          </>
        ) : (
          <>
            <h1 className={styles.title}>Redirecting to Gryt&hellip;</h1>
            <p className={styles.desc}>
              You&rsquo;ll be taken back to the app in a moment.
            </p>
          </>
        )}
      </div>
    </main>
  );
}
