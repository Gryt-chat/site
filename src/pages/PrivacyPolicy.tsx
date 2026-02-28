import styles from "./PrivacyPolicy.module.css";

const LAST_UPDATED = "February 28, 2026";

export function PrivacyPolicy() {
  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <h1 className={styles.title}>Privacy Policy</h1>
        <p className={styles.subtitle}>Last updated: {LAST_UPDATED}</p>
      </header>

      <div className={styles.prose}>
        <p>
          This Privacy Policy describes how <strong>Gryt Chat</strong> ("we",
          "us", "our") handles data when you use the services we operate:
        </p>
        <ul>
          <li>
            <strong>app.gryt.chat</strong> — the Gryt web client
          </li>
          <li>
            <strong>auth.gryt.chat</strong> — our authentication service
          </li>
          <li>
            <strong>id.gryt.chat</strong> — our identity certificate service
          </li>
        </ul>

        <p>
          <strong>Gryt servers:</strong> Gryt is designed for self-hosted and
          third-party servers. We do not operate a Gryt server you can join.
          When you connect to a server, that server is run by its own operator,
          who controls how your data is processed and stored. Contact the server
          operator for their privacy practices.
        </p>

        <h2>What we collect</h2>

        <h3>Account data</h3>
        <p>
          When you create an account or sign in through{" "}
          <strong>auth.gryt.chat</strong>, we process:
        </p>
        <ul>
          <li>Email address</li>
          <li>Password (hashed — never stored in plain text)</li>
          <li>
            Account metadata needed for authentication (internal identifiers,
            email verification status)
          </li>
        </ul>

        <h3>Identity certificates</h3>
        <p>
          When you sign in, the Gryt client generates a cryptographic keypair on
          your device and sends the <strong>public key</strong> to{" "}
          <strong>id.gryt.chat</strong> along with your authentication token.
          The identity service verifies your token, issues a short-lived
          certificate binding your identity to that key, and returns it. No user
          data is stored by this service — it processes your public key and
          identity claims only for the duration of the request.
        </p>

        <h3>Operational logs</h3>
        <p>
          Like most web services, our servers may record minimal operational
          data for security and reliability — for example, IP addresses,
          user-agent strings, and request timestamps. We do not use analytics or
          cross-site tracking.
        </p>

        <h2>What we do not collect</h2>
        <p>
          The web client at <strong>app.gryt.chat</strong> does not send your
          messages, files, voice data, or server profiles to us. All chat
          content flows directly between your device and the Gryt server you
          connect to.
        </p>

        <h2>Data on your device</h2>
        <p>
          The Gryt client stores data locally in your browser to keep you
          signed in and remember your preferences — for example, authentication
          tokens, a cryptographic identity keypair used for server verification,
          identity certificates, and UI settings. Your private key never leaves
          your device. This data stays on your device and is not sent to us.
        </p>

        <h2>Data on servers you connect to</h2>
        <p>
          When you use a Gryt server, the server operator — not Gryt Chat —
          stores and controls the data you send, which typically includes:
        </p>
        <ul>
          <li>Profile information (nickname, avatar)</li>
          <li>Messages, reactions, and file uploads</li>
          <li>Server membership and roles</li>
        </ul>
        <p>
          Voice and video streams may be routed through a media relay operated
          by the server operator. The server operator's own policies govern how
          this data is retained and used.
        </p>

        <h2>Data retention</h2>
        <ul>
          <li>
            <strong>Account data</strong> is retained for as long as your
            account exists.
          </li>
          <li>
            <strong>Operational logs</strong> are retained for a limited period
            for security purposes.
          </li>
          <li>
            <strong>Server data</strong> is retained according to the policies
            of each server operator.
          </li>
        </ul>

        <h2>Your rights and choices</h2>
        <ul>
          <li>
            <strong>Local data:</strong> clear your browser storage at any time
            to remove tokens and preferences.
          </li>
          <li>
            <strong>Server data:</strong> contact the server operator to request
            access to or deletion of data stored on their server.
          </li>
          <li>
            <strong>Account data:</strong> contact us to request information
            about or deletion of your authentication account.
          </li>
        </ul>

        <h2>Contact</h2>
        <p>
          If you have questions or requests, reach out at{" "}
          <a href="mailto:sivert@gryt.chat">sivert@gryt.chat</a>.
        </p>
      </div>
    </main>
  );
}
