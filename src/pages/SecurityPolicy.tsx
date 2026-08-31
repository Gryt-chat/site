import { PageHeader } from "../components/PageHeader";
import styles from "../styles/document.module.css";

const LAST_UPDATED = "August 31, 2026";

export function SecurityPolicy() {
  return (
    <main className={styles.page}>
      <PageHeader
        eyebrow="Security"
        title="Reporting a security problem"
        lede="How to tell us about a vulnerability, what we will do about it, and what we can honestly promise."
        meta={`Last updated ${LAST_UPDATED}`}
      />

      <div className={styles.prose}>
        <p>
          If you have found a security problem in Gryt, email{" "}
          <a href="mailto:sivert@gryt.chat">sivert@gryt.chat</a>. That address is
          also in our{" "}
          <a href="/.well-known/security.txt">security.txt</a>.
        </p>

        <p>
          Please do not open a public issue for it. A public issue is a working
          exploit handed to everybody running a Gryt server, days or weeks before
          any of them can update.
        </p>

        <h2>What we would like in the report</h2>
        <p>
          Enough to reproduce it: what you did, what happened, what you expected,
          and which version or address you were on. A rough note we can follow is
          more use than a tidy one missing the step that matters.
        </p>
        <p>
          If you are not sure whether something counts, send it anyway. Deciding
          is our job, and a report that turns out to be nothing costs us a few
          minutes.
        </p>

        <h2>What is in scope</h2>
        <ul>
          <li>
            The Gryt clients &mdash; desktop, web and mobile &mdash; and the
            server, the SFU and the other services in{" "}
            <a href="https://github.com/Gryt-chat">our repositories</a>.
          </li>
          <li>
            The services we run: <strong>gryt.chat</strong>,{" "}
            <strong>app.gryt.chat</strong>, <strong>auth.gryt.chat</strong>,{" "}
            <strong>id.gryt.chat</strong> and{" "}
            <strong>community.gryt.chat</strong>.
          </li>
        </ul>

        <h2>What is not</h2>
        <ul>
          <li>
            <strong>Gryt servers other people run.</strong> Anyone can host one,
            and we have no access to it and no authority over it. Report it to
            whoever runs it.
          </li>
          <li>
            <strong>Anything needing physical access to somebody&rsquo;s
            unlocked machine.</strong> If an attacker is already there, they have
            already won.
          </li>
          <li>
            <strong>Reports from a scanner with nothing behind them.</strong> A
            list of missing headers with no described impact is not a finding.
            Tell us what somebody could do with it.
          </li>
          <li>
            <strong>Denial of service by volume.</strong> Any service can be
            knocked over with enough traffic. Please do not demonstrate it on
            ours.
          </li>
        </ul>

        <h2>What we can promise, and what we cannot</h2>
        <p>
          Gryt is maintained by one person. We will read your report and reply,
          but we are not going to name a number of hours and then miss it.
          Something being actively exploited, or exposing other people&rsquo;s
          messages, goes ahead of everything else we are doing.
        </p>
        <p>
          There is no bug bounty. We have no money for one, and saying otherwise
          would waste your time. What we can offer is credit in the release
          notes and in the commit, if you want it, and a straight answer about
          what we are doing and when.
        </p>

        <h2>While you are looking</h2>
        <p>
          Test against a server you run. Standing one up takes a few minutes and
          is documented at <a href="/self-hosting">self-hosting</a>, and it means
          you can be as rough as you like without touching anybody
          else&rsquo;s conversations.
        </p>
        <p>
          If you do find something on a service we run, stop at the point where
          you have proved it. Please do not read, change or keep other
          people&rsquo;s data, and do not degrade the service for the people
          using it. Report it and we will take it from there.
        </p>
        <p>
          If you stay inside that, we will not pursue you for it, and we will say
          so plainly if anybody asks.
        </p>

        <h2>What happens after</h2>
        <p>
          We fix it, release it, and say what it was. Gryt is open source, so the
          fix is public the moment it lands and the commit explains itself &mdash;
          which is also why we would rather tell people plainly than let them
          work it out from a diff.
        </p>
      </div>
    </main>
  );
}
