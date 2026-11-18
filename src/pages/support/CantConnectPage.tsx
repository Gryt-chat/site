import { Link } from "react-router-dom";

import { Messages, Note, Notes, ProblemSection, Step, Steps, SupportProblem } from "../../components/SupportProblem";

const TROUBLESHOOTING = "https://docs.gryt.chat/docs/use/troubleshooting";

export function CantConnectPage() {
  return (
    <SupportProblem
      title="I can't connect to a server"
      lede="Check the address first. If there's an error message, it usually says what's wrong."
      choices={[
        { id: "steps", label: "It just won't connect" },
        { id: "messages", label: "I got an error message" },
      ]}
      askText="Tell us the server address and the exact message. A screenshot helps a lot. Blur any invite code first."
    >
      <ProblemSection id="steps" title="It just won't connect">
        <Steps>
          <Step title="Check the address">
            Click the <strong>+</strong> in the server rail, choose <strong>Join with an invite</strong> and type it again. It looks like <code>gryt.example.com</code> or{" "}
            <code>192.168.1.100:5000</code>. A <code>192.168.</code> address only works on the same network as the
            server.
          </Step>
          <Step title="See if the server is up">
            Ask whoever runs it. For servers Gryt hosts, check <a href="https://status.gryt.chat">the status page</a>.
          </Step>
          <Step title="Try another connection">
            Try mobile data with Wi-Fi off. If that works, your network is blocking it.
          </Step>
        </Steps>
        <Notes>
          <Note title="Running the server yourself?">
            <a href={`${TROUBLESHOOTING}#connection-issues`}>The technical guide</a> covers firewalls, CORS and the
            health checks.
          </Note>
        </Notes>
      </ProblemSection>

      <ProblemSection id="messages" title="I got an error message" intro="Find the message you see.">
        <Messages
          items={[
            {
              text: "Invite required to join this server",
              fix: (
                <>
                  Ask for an invite link. <Link to="/support/invite-a-friend">More about invites</Link>.
                </>
              ),
            },
            {
              text: "A message about the server's clock",
              fix: (
                <>
                  The server&rsquo;s clock is off by more than a minute, and whoever runs it has to fix it.{" "}
                  <a href={`${TROUBLESHOOTING}#server-clock-is-wrong`}>How to fix the clock</a>.
                </>
              ),
            },
            {
              text: "Server identity not recognised",
              fix: (
                <>
                  The server has a different key than when you first joined. It may have been reinstalled, but it
                  could be another server at that address. Ask whoever runs it before you unblock it.{" "}
                  <a href={`${TROUBLESHOOTING}#server-identity-not-recognised`}>How to check</a>.
                </>
              ),
            },
            {
              text: "This server requires a Gryt account",
              fix: "Sign in from the menu at the bottom left, then try again.",
            },
          ]}
        />
      </ProblemSection>
    </SupportProblem>
  );
}
