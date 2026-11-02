import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Button } from "@gryt/ui";
import { GrytLogo } from "../components/GrytLogo";
import { useHydrated } from "../lib/useHydrated";
import styles from "../styles/handoff.module.css";

const OUR_ISSUER = "https://auth.gryt.chat/realms/gryt";

/* Only our own Keycloak: `iss` comes from the URL, so a crafted link mustn't pick who gets asked. */
async function fetchAccount(issuer: string | null): Promise<string | null> {
  if (issuer !== OUR_ISSUER) return null;
  try {
    const res = await fetch(`${OUR_ISSUER}/gryt-pairing/whoami`, {
      credentials: "include",
      signal: AbortSignal.timeout(2500),
    });
    if (!res.ok) return null;
    const body = (await res.json()) as { account?: unknown };
    return typeof body.account === "string" && body.account ? body.account : null;
  } catch {
    return null;
  }
}

function buildDeepLink(params: URLSearchParams): string {
  const qs = new URLSearchParams();
  for (const [key, value] of params) {
    qs.set(key, value);
  }
  return `gryt://auth/callback?${qs.toString()}`;
}

/**
 * Asks "sign in as X?" before handing over, because a browser already signed in to Keycloak
 * skips the login page. If the account can't be read: fire the gryt:// link as before.
 */
export function AuthCallbackPage() {
  const [params] = useSearchParams();
  const code = params.get("code") || "";
  const state = params.get("state") || "";
  const valid = code.length > 0 && state.length > 0;
  /* The prerendered page has no query string, so it hydrates as a sign-in in progress, which
     is what a real callback is. Whether this one is complete is only known after that. */
  const hydrated = useHydrated();

  const [showFallback, setShowFallback] = useState(false);
  const [account, setAccount] = useState<string | null>(null);
  const [handingOver, setHandingOver] = useState(false);
  const issuer = params.get("iss");

  useEffect(() => {
    if (!valid) return;
    let gone = false;
    void fetchAccount(issuer).then((found) => {
      if (gone) return;
      if (found) setAccount(found);
      else setHandingOver(true);
    });
    return () => {
      gone = true;
    };
  }, [valid, issuer]);

  useEffect(() => {
    if (!valid || !handingOver) return;

    window.location.href = buildDeepLink(params);

    const timer = setTimeout(() => setShowFallback(true), 1500);
    return () => clearTimeout(timer);
  }, [valid, handingOver, params]);

  if (hydrated && !valid) {
    return (
      <main className={styles.page}>
        <div className={styles.panel}>
          <GrytLogo size={44} className={styles.logo} />
          <h1 className={styles.title}>That sign-in did not complete</h1>
          <p className={styles.body}>
            The callback came back without the code it needs. Nothing is wrong
            with your account. Start the sign-in again from the app and it
            should go through.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className={styles.page}>
      <div className={styles.panel}>
        <GrytLogo size={44} className={styles.logo} />

        {/* aria-live so a screen reader hears the button arrive rather than
            sitting on the redirecting line indefinitely. */}
        <div className={styles.state} aria-live="polite">
          {account && !handingOver ? (
            <>
              <h1 className={styles.title}>Sign in as {account}?</h1>
              <p className={styles.body}>
                You&rsquo;re already signed in to Gryt in this browser.
              </p>
              <div className={styles.actions}>
                <Button size="large" onClick={() => setHandingOver(true)}>
                  Continue
                </Button>
              </div>
              <p className={styles.hint}>
                Not you?{" "}
                <a href={`${OUR_ISSUER}/protocol/openid-connect/logout?client_id=gryt-web`}>
                  Sign out
                </a>
                , then sign in again from the app.
              </p>
            </>
          ) : showFallback ? (
            <>
              <h1 className={styles.title}>Continue in Gryt</h1>
              <p className={styles.body}>
                The app did not open on its own. This button will do it.
              </p>
              <div className={styles.actions}>
                <Button render={<a href={buildDeepLink(params)} />} size="large">
                  Open Gryt
                </Button>
              </div>
              <p className={styles.hint}>You can close this tab afterwards.</p>
            </>
          ) : (
            <>
              <h1 className={styles.title}>Signing you in</h1>
              <p className={styles.waiting}>
                <span className={styles.pulse} aria-hidden="true" />
                Handing you back to the app
              </p>
            </>
          )}
        </div>
      </div>
    </main>
  );
}
