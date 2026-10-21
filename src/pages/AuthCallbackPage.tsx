import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Button } from "@gryt/ui";
import { GrytLogo } from "../components/GrytLogo";
import { useHydrated } from "../lib/useHydrated";
import styles from "../styles/handoff.module.css";
import {
  CHECK_PREFIX,
  CODE_TTL_MS,
  finishCheck,
  GRYT_ISSUER,
  maskEmail,
  type SignedIn,
  signOutUrl,
  startCheck,
} from "../lib/whoIsSignedIn";

function buildDeepLink(params: URLSearchParams): string {
  const qs = new URLSearchParams();
  for (const [key, value] of params) {
    qs.set(key, value);
  }
  return `gryt://auth/callback?${qs.toString()}`;
}

/**
 * Says which account is signed in before handing the code to the app, so "Not you?" can
 * sign the browser out first. Falls back to handing off at once when that can't be read.
 */
export function AuthCallbackPage() {
  const [params] = useSearchParams();
  const code = params.get("code") || "";
  const state = params.get("state") || "";
  const checking = state.startsWith(CHECK_PREFIX);
  const signedOut = params.has("signed_out");
  const valid = checking || signedOut || (code.length > 0 && state.length > 0);
  /* The prerendered page has no query string, so it hydrates as a sign-in in progress, which
     is what a real callback is. Whether this one is complete is only known after that. */
  const hydrated = useHydrated();

  const [showFallback, setShowFallback] = useState(false);
  const [handOff, setHandOff] = useState<URLSearchParams | null>(null);
  const [signedIn, setSignedIn] = useState<SignedIn | null>(null);
  const [expired, setExpired] = useState(false);

  useEffect(() => {
    if (signedOut || !valid) return;
    if (checking) {
      void finishCheck(params).then((result) => {
        if (!result) return setExpired(true);
        if (result.signedIn && Date.now() - result.signedIn.at < CODE_TTL_MS) setSignedIn(result.signedIn);
        else setHandOff(result.appParams);
      });
      return;
    }
    // Only Gryt's own Keycloak: an iss from anywhere else would make this an open redirect.
    const iss = params.get("iss");
    if ((!iss || iss === GRYT_ISSUER) && window.crypto?.subtle) {
      void startCheck(params).catch(() => setHandOff(params));
      return;
    }
    window.location.href = buildDeepLink(params);
    const timer = setTimeout(() => setShowFallback(true), 1500);
    return () => clearTimeout(timer);
  }, [valid, checking, signedOut, params]);

  useEffect(() => {
    if (!handOff) return;
    window.location.href = buildDeepLink(handOff);
    const timer = setTimeout(() => setShowFallback(true), 1500);
    return () => clearTimeout(timer);
  }, [handOff]);

  const continueAs = (who: SignedIn) => {
    if (Date.now() - who.at >= CODE_TTL_MS) {
      setSignedIn(null);
      setExpired(true);
      return;
    }
    setSignedIn(null);
    setHandOff(who.appParams);
  };

  if (hydrated && signedOut) {
    return (
      <main className={styles.page}>
        <div className={styles.panel}>
          <GrytLogo size={44} className={styles.logo} />
          <h1 className={styles.title}>You&rsquo;re signed out</h1>
          <p className={styles.body}>
            Go back to Gryt and press Sign in again. This time you&rsquo;ll
            get to pick the account.
          </p>
        </div>
      </main>
    );
  }

  if (hydrated && expired) {
    return (
      <main className={styles.page}>
        <div className={styles.panel}>
          <GrytLogo size={44} className={styles.logo} />
          <h1 className={styles.title}>That sign-in timed out</h1>
          <p className={styles.body}>
            A sign-in only lasts about a minute. Start it again from the app.
          </p>
        </div>
      </main>
    );
  }

  if (hydrated && signedIn) {
    return (
      <main className={styles.page}>
        <div className={styles.panel}>
          <GrytLogo size={44} className={styles.logo} />
          <h1 className={styles.title}>Sign in to Gryt</h1>
          <p className={styles.host} title={signedIn.email}>
            {maskEmail(signedIn.email)}
          </p>
          <div className={styles.state}>
            <div className={styles.actions}>
              <Button size="large" onClick={() => continueAs(signedIn)}>
                Continue
              </Button>
              <Button
                render={<a href={signOutUrl(signedIn.idToken)} />}
                size="large"
                tone="neutral"
              >
                Not you? Use another account
              </Button>
            </div>
          </div>
        </div>
      </main>
    );
  }

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
          {showFallback ? (
            <>
              <h1 className={styles.title}>Continue in Gryt</h1>
              <p className={styles.body}>
                The app did not open on its own. This button will do it.
              </p>
              <div className={styles.actions}>
                <Button render={<a href={buildDeepLink(handOff ?? params)} />} size="large">
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
