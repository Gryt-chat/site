import styles from "./CommunityGuidelines.module.css";

const LAST_UPDATED = "February 23, 2026";

export function CommunityGuidelines() {
  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <h1 className={styles.title}>Community Guidelines</h1>
        <p className={styles.subtitle}>Last updated: {LAST_UPDATED}</p>
      </header>

      <div className={styles.prose}>
        <p>
          Gryt Chat is built for friendly, real-time conversation. These
          Community Guidelines apply when you use Gryt Chat services we operate
          (for example, our official hosted servers and related infrastructure).
        </p>

        <p>
          <strong>Self-hosted / third-party servers:</strong> Gryt can connect
          to servers run by other people. Those server operators may set their
          own rules and enforcement. If you’re using a server we don’t operate,
          you should review the server’s rules and privacy policy.
        </p>

        <h2>Follow the law</h2>
        <p>
          You are responsible for complying with applicable laws and
          regulations. Do not use Gryt to engage in illegal activity.
        </p>

        <h2>What’s not allowed</h2>
        <p>
          The following content and behavior are not permitted on services we
          operate:
        </p>
        <ul>
          <li>
            <strong>Child sexual exploitation material (CSEM)</strong> or any
            sexual content involving minors.
          </li>
          <li>
            <strong>Non-consensual sexual content</strong>, including revenge
            porn or sexual extortion.
          </li>
          <li>
            <strong>Nudity or sexual content</strong> intended for sexual
            gratification, including pornographic content.
          </li>
          <li>
            <strong>Graphic violence</strong> or gore, including real-world
            depictions intended to shock or glorify harm.
          </li>
          <li>
            <strong>Harassment or hate</strong>: threats, targeted harassment,
            or content that promotes hatred or violence against protected
            groups.
          </li>
          <li>
            <strong>Self-harm encouragement</strong> or instructions that
            promote self-harm.
          </li>
          <li>
            <strong>Spam or scams</strong>: phishing, fraudulent schemes, or
            coordinated spam.
          </li>
          <li>
            <strong>Unauthorized sharing of personal data</strong>: doxxing or
            sharing someone’s private information without permission.
          </li>
        </ul>

        <h2>User-generated content</h2>
        <p>
          Gryt supports user-generated content (text chat, voice/video, and file
          uploads). We do not pre-review all content. Users and server
          moderators help keep communities healthy.
        </p>

        <h2>Reporting and moderation</h2>
        <ul>
          <li>
            <strong>Report</strong>: you can report messages/content in-app.
          </li>
          <li>
            <strong>Moderation</strong>: server admins/moderators can remove
            content and take action against accounts (for example, deleting
            messages or banning users) depending on server configuration and
            permissions.
          </li>
        </ul>

        <h2>Enforcement</h2>
        <p>
          If you violate these guidelines on services we operate, we may take
          action including warnings, removal of content, temporary restrictions,
          or account/server bans. For self-hosted or third-party servers, the
          server operator determines enforcement.
        </p>

        <h2>Contact</h2>
        <p>
          If you have questions or want to report a policy issue, contact{" "}
          <a href="mailto:contact@gryt.chat">contact@gryt.chat</a>.
        </p>
      </div>
    </main>
  );
}

