import { PageHeader } from "../components/PageHeader";
import styles from "../styles/document.module.css";

const LAST_UPDATED = "September 3, 2026";

export function PrivacyPolicy() {
  return (
    <main className={styles.page}>
      <PageHeader
        eyebrow="Legal"
        title="Privacy Policy"
        lede="How Gryt handles your data on the services we run, and what stays on a server we have nothing to do with."
        meta={`Last updated ${LAST_UPDATED}`}
      />

      <div className={styles.prose}>
        <p>
          This Privacy Policy describes how <strong>Gryt Chat</strong> ("we",
          "us", "our") handles data when you use the services we operate:
        </p>
        <ul>
          <li>
            <strong>app.gryt.chat</strong>, the Gryt web client
          </li>
          <li>
            <strong>auth.gryt.chat</strong>, our authentication service
          </li>
          <li>
            <strong>id.gryt.chat</strong>, our identity certificate service
          </li>
          <li>
            <strong>community.gryt.chat</strong>, the Gryt server we run
          </li>
        </ul>

        <p>
          <strong>Gryt servers:</strong> Gryt is designed for self-hosted and
          third-party servers. When you connect to one, that server is run by its
          own operator, who controls how your data is processed and stored.
          Contact that operator for their privacy practices. This policy does not
          cover them.
        </p>
        <p>
          <strong>community.gryt.chat</strong> is the exception: we run it, so
          this policy covers it. What that server stores is what any Gryt server
          stores — your membership and role, your nickname and avatar, the
          messages you send, and any files you upload. Messages and uploads are
          kept until you or a moderator delete them; we do not expire them on a
          schedule.
        </p>
        <p>
          <strong>What we can and cannot read there.</strong> Messages in
          channels are not encrypted, and we can read them. Direct messages sent
          by a client that supports encryption are end-to-end encrypted and we
          cannot read their contents — but we can still see who is talking to
          whom and when, that a file was sent, and how large it is. An older
          client that does not support encryption sends a direct message we can
          read. If that matters to you, check that your client is up to date.
        </p>
        <p>
          Server logs on community.gryt.chat do not record IP addresses. A log
          line that has to tell two callers apart — a rate-limit ban, a client
          connecting, a client dropping — carries a short label worked out from
          the address instead. The key that produces it is random, generated
          when the server starts and never written down. The same address gets
          the same label for as long as that process runs, and a different one
          after a restart. The address itself is never written, and none is
          stored in the database.
        </p>
        <p>
          Those logs have a ceiling. Each service on that machine keeps at most
          three log files of 20 MB, and the oldest is deleted when a new one
          starts. That is a limit on size, not on time, so we cannot promise a
          number of days: a quiet week stays on disk longer than a busy one.
          What we can say is that the logs roll over on their own, rather than
          building up for as long as the server has been running.
        </p>

        <h2>What we collect</h2>

        <h3>Account data</h3>
        <p>
          When you create an account or sign in through{" "}
          <strong>auth.gryt.chat</strong>, we process:
        </p>
        <ul>
          <li>Email address</li>
          <li>Password (hashed, never stored in plain text)</li>
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
          data is stored by this service. It processes your public key and
          identity claims only for the duration of the request.
        </p>

        <h3>Bug reports and feedback</h3>
        <p>
          When you send a bug report or feedback from inside a Gryt app, it goes
          to <strong>reports.gryt.chat</strong>, which we run. The report holds
          what you wrote and any contact details you chose to give. We also
          record your IP address, the app version and build, an install id, your
          platform, operating system version and device model, your user-agent,
          and which account sent it if you were signed in. The address and the
          install id stop one person flooding the inbox.
        </p>
        <p>
          Unlike the chat server's logs, this is the address itself rather than
          a label, and we keep it for as long as the report exists. Nothing
          expires reports on a schedule. If you would rather not send that,
          email{" "}
          <a href="mailto:sivert@gryt.chat">sivert@gryt.chat</a> instead of
          using the form.
        </p>

        <h3>Operational logs</h3>
        <p>
          Like most web services, our web servers may record minimal operational
          data for security and reliability, for example IP addresses,
          user-agent strings, and request timestamps. The chat server on
          community.gryt.chat is the exception described above, since it writes
          a label rather than an address. We do not use analytics or cross-site
          tracking.
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
          signed in and remember your preferences, for example authentication
          tokens, a cryptographic identity keypair used for server verification,
          identity certificates, and UI settings. Your private key never leaves
          your device. This data stays on your device and is not sent to us.
        </p>

        <h2>Data on servers you connect to</h2>
        <p>
          When you use a Gryt server, the server operator, not Gryt Chat,
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
            <strong>Operational logs</strong> are kept for security and
            reliability. On community.gryt.chat they are capped by size and roll
            over, as described above. On other servers, the operator decides.
          </li>
          <li>
            <strong>Bug reports</strong> are kept until we delete them. There is
            no schedule.
          </li>
          <li>
            <strong>Server data</strong> is retained according to the policies
            of each server operator.
          </li>
        </ul>

        <h2 id="deleting-your-account">Deleting your account</h2>
        <p>
          This applies to the Gryt account you sign in with, on the Gryt Chat
          apps for Android, iOS, desktop and the web.
        </p>
        <p>
          To delete it, email{" "}
          <a href="mailto:sivert@gryt.chat">sivert@gryt.chat</a> from the address
          the account uses, and ask for the account to be deleted. There is no
          self-service button for this yet. We will confirm by reply once it is
          done.
        </p>
        <p>
          <strong>What deleting the account removes.</strong> The account itself
          and everything held with it on{" "}
          <strong>auth.gryt.chat</strong> — your email address, your display
          name, and your sign-in credentials — along with any identity
          certificates issued to it by <strong>id.gryt.chat</strong>. These are
          removed within 30 days of the request.
        </p>
        <p>
          <strong>What it does not remove.</strong> Messages, files, and profile
          information you sent to a Gryt server are held by that server, and
          those servers are run by other people rather than by us. Deleting your
          Gryt account does not reach them. You can delete your own messages in
          the app, and for the rest you have to ask that server's operator.
          Operational logs, which hold request timestamps and the labels
          described above rather than anything you wrote, are kept until they
          roll over as described under Data retention. A bug report you sent is
          separate, and we will delete it on request.
        </p>
        <p>
          You do not need an account to use Gryt. If you never made one, there
          is nothing here to delete: the identity you join servers with is a key
          held on your own device, and uninstalling the app — or clearing its
          data from your system settings — removes it.
        </p>

        <h2>Your rights and choices</h2>
        <ul>
          <li>
            <strong>Local data:</strong> clear your browser storage, or the
            app's data from your device settings, at any time to remove tokens,
            keys and preferences.
          </li>
          <li>
            <strong>Server data:</strong> contact the server operator to request
            access to or deletion of data stored on their server.
          </li>
          <li>
            <strong>Account data:</strong> contact us to request information
            about your authentication account, or see{" "}
            <a href="#deleting-your-account">Deleting your account</a> above to
            have it removed.
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
