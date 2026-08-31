import { PageHeader } from "../components/PageHeader";
import styles from "../styles/document.module.css";

const LAST_UPDATED = "August 31, 2026";

export function TermsOfUse() {
  return (
    <main className={styles.page}>
      <PageHeader
        eyebrow="Legal"
        title="Terms of Use"
        lede="The terms covering the services we operate. Community servers set their own on top of these."
        meta={`Last updated ${LAST_UPDATED}`}
      />

      <div className={styles.prose}>
        <p>
          These Terms of Use ("Terms") govern your use of the services operated
          by <strong>Gryt Chat</strong> ("we", "us", "our"):
        </p>
        <ul>
          <li>
            <strong>app.gryt.chat</strong>, the Gryt web client
          </li>
          <li>
            <strong>auth.gryt.chat</strong>, our authentication service
          </li>
          <li>
            <strong>community.gryt.chat</strong>, the Gryt server we run
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
          connect to <strong>Gryt servers</strong>. Almost every server is
          self-hosted and run by somebody else; the content, moderation, and
          policies of those servers are the responsibility of their operators,
          not ours.
        </p>
        <p>
          We run one server ourselves, at{" "}
          <strong>community.gryt.chat</strong>. These Terms and our{" "}
          <a href="/community-guidelines">Community Guidelines</a> apply there,
          and the sections below on moderation and on your content apply to it
          specifically. Running one server does not make us responsible for any
          other.
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

        <h2>Moderation on community.gryt.chat</h2>
        <p>
          We do not monitor or pre-screen what people post. There is no review
          before a message appears, and nobody is reading the server looking for
          problems.
        </p>
        <p>
          We act on reports. If something breaks our{" "}
          <a href="/community-guidelines">Community Guidelines</a> or the law,
          report it in the app or email{" "}
          <a href="mailto:sivert@gryt.chat">sivert@gryt.chat</a> and we will look
          at it. We do not promise a response time. Reporting is how something
          gets seen, so if nobody reports it, it will most likely stay up.
        </p>
        <p>
          We may remove content, and suspend or ban accounts, at our discretion
          and without notice. Anything you post to a server is stored by that
          server and can be read by whoever runs it, including us on
          community.gryt.chat. Do not post anything there you would not want the
          operator to read.
        </p>

        <h2>Servers we do not run</h2>
        <p>
          Every Gryt server other than <strong>community.gryt.chat</strong> is
          operated by an independent third party. When you connect to one:
        </p>
        <ul>
          <li>
            The <strong>server operator</strong> controls what content is allowed,
            how your data is stored, and how moderation is handled.
          </li>
          <li>
            Gryt Chat has <strong>no responsibility</strong> for content, conduct,
            data handling, or any other aspect of that server.
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
