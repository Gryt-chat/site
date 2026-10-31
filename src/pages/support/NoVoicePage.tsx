import { Link } from "react-router-dom";

import { Body, Note, Notes, ProblemSection, Step, Steps, SupportProblem } from "../../components/SupportProblem";

const DOCS = "https://docs.gryt.chat/docs";

export function NoVoicePage() {
  return (
    <SupportProblem
      title="Nobody can hear anyone"
      lede="If chat works but voice doesn't, the voice port is usually closed. Whoever runs the server can fix it."
      askText="Tell us how the server is hosted and whether it happens to everyone or only people outside your network."
    >
      <ProblemSection id="why" title="Why chat works and voice doesn't">
        <Body>
          Chat and voice don&rsquo;t travel the same way. Voice connects straight to the server&rsquo;s voice port, and
          nothing in the app says when that port is shut. People can join and send messages, and it just looks like
          broken audio.
        </Body>
      </ProblemSection>

      <ProblemSection id="fix" title="If you hosted the server in the Gryt app">
        <Steps>
          <Step title="Open the voice port">
            Go to <strong>Settings → My servers → Open these ports</strong>. The voice port is UDP, and it&rsquo;s
            usually 3478. Forward it on your router to this computer. It has to be UDP. TCP won&rsquo;t do.
          </Step>
          <Step title="Check your public address">
            Under <strong>Public IPs or hostnames</strong> on the same screen, make sure your real public IP is there.
            Stop your server to change it.
          </Step>
          <Step title="Test from outside">
            Your own computer doesn&rsquo;t prove much. Try your phone on mobile data with Wi-Fi off, or ask a friend on
            another connection.
          </Step>
        </Steps>

        <Notes>
          <Note title="Running your own server somewhere else?">
            Check <code>ICE_ADVERTISE_IP</code> and the UDP port. The{" "}
            <a href={`${DOCS}/host/voice-debugging`}>voice debugging guide</a> goes through it.
          </Note>
          <Note title="Not your server?">
            Send this page to whoever runs it. There&rsquo;s nothing you can change from your side.
          </Note>
          <Note title="Is it only you nobody can hear?">
            Other people can hear each other, so it&rsquo;s probably your mic.{" "}
            <Link to="/support/microphone">Check your mic</Link>.
          </Note>
        </Notes>
      </ProblemSection>
    </SupportProblem>
  );
}
