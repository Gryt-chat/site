import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Button } from "@gryt/ui";
import { GrytLogo } from "../components/GrytLogo";
import styles from "../styles/handoff.module.css";

function buildDeepLink(params: URLSearchParams): string {
  const qs = new URLSearchParams();
  for (const [key, value] of params) {
    qs.set(key, value);
  }
  return `gryt://auth/callback?${qs.toString()}`;
}

/**
 * The same screen as the invite page, doing the same job: fire a gryt:// link,
 * and if nothing has answered in 1.5 seconds, ask. Both now share
 * styles/handoff.module.css rather than keeping a copy each.
 *
 * Component-scope, so the work is the states rather than the shape:
 *   handing off  the deep link has been fired, nothing has answered
 *   fallback     it did not answer, so offer the button
 *   invalid      the callback arrived without a code or a state
 */
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
