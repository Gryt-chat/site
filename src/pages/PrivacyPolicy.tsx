import styles from "./PrivacyPolicy.module.css";

const LAST_UPDATED = "February 23, 2026";

export function PrivacyPolicy() {
  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <h1 className={styles.title}>Privacy Policy</h1>
        <p className={styles.subtitle}>Last updated: {LAST_UPDATED}</p>
      </header>

      <div className={styles.prose}>
        <p>
          This Privacy Policy explains how <strong>Gryt Chat</strong> (“we”,
          “us”, “our”) processes information when you use the Gryt Chat client
          application (the “App”) and related services we operate (together, the
          “Services”), such as <code>app.gryt.chat</code> and our official
          authentication service.
        </p>

        <p>
          <strong>Important:</strong> Gryt is designed to work with both our
          hosted services and <em>self-hosted or third-party Gryt servers</em>.
          If you connect to a server that we do not operate, that server’s
          operator controls how your data is processed on that server. You
          should review their privacy policy and terms.
        </p>

        <h2>Information we process</h2>
        <h3>Information you provide</h3>
        <ul>
          <li>
            <strong>Profile information</strong>: nickname, avatar, and other
            profile fields you choose to set.
          </li>
          <li>
            <strong>Content you send</strong>: chat messages, reactions, and
            files you upload through the Services.
          </li>
          <li>
            <strong>Voice/video/screen-share data</strong>: audio/video streams
            and screen sharing that you choose to transmit in voice channels.
          </li>
        </ul>

        <h3>Information processed automatically</h3>
        <ul>
          <li>
            <strong>Connection and device information</strong>: IP address,
            basic device/app information, and timestamps needed to establish and
            secure connections.
          </li>
          <li>
            <strong>Operational and performance data</strong>: limited technical
            data needed to run real-time voice (for example, latency/jitter and
            bitrate information shared within a voice channel for UX and
            diagnostics).
          </li>
          <li>
            <strong>Local app storage</strong>: the App stores certain data on
            your device to keep you signed in and preserve settings (for
            example, access/refresh tokens and preferences in local or session
            storage).
          </li>
        </ul>

        <h3>Information from identity providers</h3>
        <p>
          If you sign in using an identity provider (for example, OpenID Connect
          / Keycloak), we process identifiers and claims needed to authenticate
          you (such as a stable user identifier, and in some configurations an
          email address or username).
        </p>

        <h2>How we use information</h2>
        <ul>
          <li>
            <strong>Provide the Services</strong>: connect you to servers,
            deliver voice and chat features, and show your profile to other
            participants.
          </li>
          <li>
            <strong>Security and abuse prevention</strong>: authenticate users,
            prevent fraud, investigate reports, and protect the Services.
          </li>
          <li>
            <strong>Improve reliability</strong>: troubleshoot issues and
            understand performance (for example, connection quality).
          </li>
          <li>
            <strong>Legal compliance</strong>: comply with applicable laws and
            enforce our terms where necessary.
          </li>
        </ul>

        <h2>How voice and chat work</h2>
        <p>
          Gryt is a real-time communication product. When you join a voice
          channel, your device transmits media streams to other participants.
          Depending on the server configuration, media may be routed through a
          Gryt SFU (Selective Forwarding Unit) to deliver audio/video to other
          members. Chat messages and file uploads are sent to the server you are
          connected to.
        </p>

        <h2>Sharing</h2>
        <ul>
          <li>
            <strong>With other users</strong>: your nickname, avatar, and the
            content you choose to send (messages, voice/video, files) are shared
            with other participants in the relevant server/channel.
          </li>
          <li>
            <strong>With server operators</strong>: the server you connect to
            processes your data. If it is a self-hosted or third-party server,
            its operator may access and retain data according to their own
            policies.
          </li>
          <li>
            <strong>With service providers</strong>: if we operate the server
            you use, we may rely on infrastructure providers (for example,
            hosting and networking providers) that process data on our behalf to
            run the Services.
          </li>
          <li>
            <strong>No cross-app tracking</strong>: we do not use information
            from the App to track you across other companies’ apps or websites,
            and we do not serve targeted advertising.
          </li>
          <li>
            <strong>App store platforms</strong>: if you download the App via
            Apple or Microsoft, those platforms may process information
            independently (for example, for billing, downloads, and fraud
            prevention) under their own policies.
          </li>
          <li>
            <strong>No sale of personal data</strong>: we do not sell your
            personal data.
          </li>
        </ul>

        <h2>Data retention</h2>
        <p>
          Retention depends on which server you use and how it is configured.
          For servers we operate, we generally retain information only as long
          as needed to provide the Services, comply with legal obligations, and
          maintain security. For self-hosted or third-party servers, retention
          is determined by that server’s operator.
        </p>

        <h2>Your choices and rights</h2>
        <ul>
          <li>
            <strong>Permissions</strong>: you can control OS/app permissions for
            microphone, camera, screen sharing, and notifications.
          </li>
          <li>
            <strong>Local data</strong>: you can sign out, disconnect servers,
            and clear locally stored tokens/settings from within the App (or by
            clearing app storage).
          </li>
          <li>
            <strong>Access / deletion</strong>: if you use a server we operate,
            you may request access to or deletion of your data. If you use a
            third-party server, contact that operator.
          </li>
        </ul>

        <h2>Security</h2>
        <p>
          We use reasonable technical measures to protect information. Media
          transport uses standard WebRTC security mechanisms (including
          encryption in transit). No method of transmission or storage is
          100% secure, and we cannot guarantee absolute security.
        </p>

        <h2>Children</h2>
        <p>
          The Services are not directed to children under 13 (or the minimum
          age required in your jurisdiction). If you believe a child has
          provided personal data, contact us.
        </p>

        <h2>International transfers</h2>
        <p>
          If you use servers we operate, your information may be processed in
          countries other than your own depending on where infrastructure and
          servers are located. If you use a self-hosted or third-party server,
          that operator determines where processing occurs.
        </p>

        <h2>Changes to this policy</h2>
        <p>
          We may update this policy from time to time. We will revise the “Last
          updated” date above when changes are made.
        </p>

        <h2>Contact</h2>
        <p>
          If you have questions or requests, contact us at{" "}
          <a href="mailto:sivert@gryt.chat">sivert@gryt.chat</a>.
        </p>
      </div>
    </main>
  );
}

