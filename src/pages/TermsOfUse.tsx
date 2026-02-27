import styles from "./PrivacyPolicy.module.css";

const LAST_UPDATED = "February 27, 2026";

export function TermsOfUse() {
  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <h1 className={styles.title}>Terms of Use</h1>
        <p className={styles.subtitle}>Last updated: {LAST_UPDATED}</p>
      </header>

      <div className={styles.prose}>
        <p>
          These Terms of Use ("Terms") govern your use of the services operated
          by <strong>Gryt Chat</strong> ("we", "us", "our"):
        </p>
        <ul>
          <li>
            <strong>app.gryt.chat</strong> — the Gryt web client
          </li>
          <li>
            <strong>auth.gryt.chat</strong> — our authentication service
          </li>
        </ul>
        <p>
          Gryt Chat is a personal project operated by Sivert from Norway. By
          creating an account or using our services, you agree to these Terms,
          our <a href="/privacy">Privacy Policy</a>, and our{" "}
          <a href="/community-guidelines">Community Guidelines</a>.
        </p>

        <h2>Eligibility</h2>
        <p>
          You must be at least <strong>13 years old</strong> to create an account
          or use our services. If you are under 18, you confirm that a parent or
          guardian has reviewed and agrees to these Terms on your behalf.
        </p>

        <h2>What the service is</h2>
        <p>
          Gryt Chat provides authentication and a web client that lets you
          connect to <strong>self-hosted Gryt servers</strong> operated by third
          parties. We do not operate a Gryt server you can join. The content,
          moderation, and policies of each server are the responsibility of its
          operator.
        </p>

        <h2>Your account</h2>
        <p>
          You are responsible for keeping your account credentials secure. You
          are responsible for all activity that occurs under your account.
        </p>
        <p>
          We may suspend or terminate your account at any time if we reasonably
          believe you have violated these Terms or our Community Guidelines.
          Registration may be open or closed at our discretion.
        </p>

        <h2>User conduct</h2>
        <p>When using our services, you agree to:</p>
        <ul>
          <li>Comply with all applicable laws and regulations.</li>
          <li>
            Follow our{" "}
            <a href="/community-guidelines">Community Guidelines</a>.
          </li>
          <li>
            Respect the rules set by the operators of any server you connect to.
          </li>
          <li>
            Not attempt to disrupt, exploit, or gain unauthorized access to our
            services or infrastructure.
          </li>
        </ul>

        <h2>Third-party servers</h2>
        <p>
          Gryt servers are operated by independent third parties, not by Gryt
          Chat. When you connect to a server:
        </p>
        <ul>
          <li>
            The <strong>server operator</strong> controls what content is allowed,
            how your data is stored, and how moderation is handled.
          </li>
          <li>
            Gryt Chat has <strong>no responsibility</strong> for content, conduct,
            data handling, or any other aspect of third-party servers.
          </li>
          <li>
            Any disputes related to a server should be directed to the server
            operator.
          </li>
        </ul>

        <h2>Content and intellectual property</h2>
        <p>
          Gryt Chat is open-source software licensed under the{" "}
          <a
            href="https://www.gnu.org/licenses/agpl-3.0.html"
            target="_blank"
            rel="noreferrer"
          >
            AGPL-3.0 license
          </a>
          . You retain ownership of any content you create or upload through the
          service. By using the service, you do not grant us any rights to your
          content beyond what is necessary to operate the authentication service.
        </p>

        <h2>Disclaimer of warranties</h2>
        <p>
          Our services are provided <strong>"as is"</strong> and{" "}
          <strong>"as available"</strong>, without warranties of any kind, whether
          express or implied. We do not guarantee that the service will be
          uninterrupted, error-free, or available at any particular time.
        </p>

        <h2>Limitation of liability</h2>
        <p>
          To the maximum extent permitted by applicable law, Gryt Chat shall not
          be liable for any indirect, incidental, special, consequential, or
          punitive damages arising out of or related to your use of the service.
          This includes, but is not limited to:
        </p>
        <ul>
          <li>
            Content you encounter on third-party servers.
          </li>
          <li>
            Loss of data, whether caused by you, a server operator, or a
            technical failure.
          </li>
          <li>
            Actions taken by other users or server operators.
          </li>
          <li>
            Service interruptions or downtime.
          </li>
        </ul>
        <p>
          Nothing in these Terms limits liability for fraud, gross negligence, or
          intentional misconduct, or any other liability that cannot be excluded
          under Norwegian law.
        </p>

        <h2>Changes to these Terms</h2>
        <p>
          We may update these Terms from time to time. When we do, we will
          revise the "Last updated" date at the top of this page. Your continued
          use of the service after changes are posted constitutes acceptance of
          the updated Terms.
        </p>

        <h2>Governing law</h2>
        <p>
          These Terms are governed by the laws of Norway. Any disputes arising
          from these Terms or your use of the service shall be resolved in the
          courts of Norway.
        </p>

        <h2>Contact</h2>
        <p>
          If you have questions about these Terms, contact us at{" "}
          <a href="mailto:sivert@gryt.chat">sivert@gryt.chat</a>.
        </p>
      </div>
    </main>
  );
}
