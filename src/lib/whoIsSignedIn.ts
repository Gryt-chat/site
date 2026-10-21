// Asks Keycloak which account this browser is signed in to, so the desktop callback can
// say "Continue as" before handing the app its code. A silent PKCE round trip as gryt-web.

export const GRYT_ISSUER = "https://auth.gryt.chat/realms/gryt";
const CLIENT_ID = "gryt-web";
const PENDING = "gryt.authCallback";
export const CHECK_PREFIX = "who-";
// Keycloak's codes last 60 s by default, and the app still has to exchange its own.
export const CODE_TTL_MS = 50_000;

interface Pending {
  query: string;
  at: number;
  verifier: string;
  state: string;
}

export interface SignedIn {
  email: string;
  idToken: string;
  appParams: URLSearchParams;
  at: number;
}

function base64url(bytes: Uint8Array): string {
  return btoa(String.fromCharCode(...bytes)).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function callbackUrl(): string {
  return `${window.location.origin}/auth/callback`;
}

/** Holds the app's callback in sessionStorage and leaves for Keycloak with prompt=none. */
export async function startCheck(appParams: URLSearchParams): Promise<void> {
  const verifier = base64url(crypto.getRandomValues(new Uint8Array(32)));
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(verifier));
  const state = CHECK_PREFIX + base64url(crypto.getRandomValues(new Uint8Array(16)));
  const pending: Pending = { query: appParams.toString(), at: Date.now(), verifier, state };
  sessionStorage.setItem(PENDING, JSON.stringify(pending));

  const url = new URL(`${GRYT_ISSUER}/protocol/openid-connect/auth`);
  url.search = new URLSearchParams({
    client_id: CLIENT_ID,
    response_type: "code",
    scope: "openid email",
    redirect_uri: callbackUrl(),
    prompt: "none",
    state,
    code_challenge: base64url(new Uint8Array(digest)),
    code_challenge_method: "S256",
  }).toString();
  window.location.replace(url.href);
}

/**
 * Back from Keycloak. Returns the app's held callback either way, and who is signed in
 * when that could be read. Null when there is nothing held, e.g. a reload.
 */
export function finishCheck(params: URLSearchParams): Promise<CheckResult | null> {
  // Once per state: StrictMode runs effects twice, and the first run empties sessionStorage.
  const key = params.get("state") ?? "";
  let result = finishing.get(key);
  if (!result) {
    result = readCheck(params);
    finishing.set(key, result);
  }
  return result;
}

type CheckResult = { appParams: URLSearchParams; signedIn?: SignedIn };
const finishing = new Map<string, Promise<CheckResult | null>>();

async function readCheck(params: URLSearchParams): Promise<CheckResult | null> {
  const raw = sessionStorage.getItem(PENDING);
  sessionStorage.removeItem(PENDING);
  if (!raw) return null;
  const pending = JSON.parse(raw) as Pending;
  const appParams = new URLSearchParams(pending.query);

  const code = params.get("code");
  if (params.get("state") !== pending.state || !code) return { appParams };

  try {
    const res = await fetch(`${GRYT_ISSUER}/protocol/openid-connect/token`, {
      method: "POST",
      body: new URLSearchParams({
        grant_type: "authorization_code",
        client_id: CLIENT_ID,
        code,
        redirect_uri: callbackUrl(),
        code_verifier: pending.verifier,
      }),
    });
    if (!res.ok) return { appParams };
    const { id_token: idToken } = (await res.json()) as { id_token?: string };
    const payload = idToken?.split(".")[1];
    if (!idToken || !payload) return { appParams };
    const claims = JSON.parse(atob(payload.replace(/-/g, "+").replace(/_/g, "/"))) as { email?: unknown };
    if (typeof claims.email !== "string") return { appParams };
    return { appParams, signedIn: { email: claims.email, idToken, appParams, at: pending.at } };
  } catch {
    return { appParams };
  }
}

/** Ends the browser's Keycloak session and comes back to say so. */
export function signOutUrl(idToken: string): string {
  const url = new URL(`${GRYT_ISSUER}/protocol/openid-connect/logout`);
  url.search = new URLSearchParams({
    client_id: CLIENT_ID,
    id_token_hint: idToken,
    post_logout_redirect_uri: `${callbackUrl()}?signed_out=1`,
  }).toString();
  return url.href;
}

/** First and last letter of the name, and the whole domain. */
export function maskEmail(email: string): string {
  const at = email.lastIndexOf("@");
  if (at < 1) return email;
  const name = email.slice(0, at);
  const shown = name.length <= 2 ? name[0] : `${name[0]}•••${name[name.length - 1]}`;
  return `${shown}${email.slice(at)}`;
}
