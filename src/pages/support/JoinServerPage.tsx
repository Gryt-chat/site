import { Link } from "react-router-dom";

import { Body, Note, Notes, ProblemSection, Step, Steps, SupportProblem } from "../../components/SupportProblem";

export function JoinServerPage() {
  return (
    <SupportProblem
      title="Join a server"
      lede="Open an invite link or add a server by its address. You don't need an account for many servers."
      askText="Tell us what you tried and what it said. A screenshot helps a lot. Blur any invite code first."
    >
      <ProblemSection id="invite" title="If someone sent you an invite">
        <Body>Open the link and follow what it says. That&rsquo;s all you need.</Body>
      </ProblemSection>
      <ProblemSection id="address" title="If you have an address">
        <Steps>
          <Step title="Click the + in the server rail">Then choose <strong>Join with an invite</strong>.</Step>
          <Step title="Type the address">Put it in <strong>Invite or server address</strong>. It looks like <code>gryt.example.com</code> or <code>192.168.1.100:5000</code>. Gryt tells you whether you need an account before you try.</Step>
          <Step title="Add an invite code if it asks">Most servers are invite-only. Ask whoever runs it for a link.</Step>
        </Steps>
        <Notes>
          <Note title="On the same network?">Servers on your network can show up by themselves in the desktop app.</Note>
          <Note title="Doesn't want to install anything?">Use <a href="https://app.gryt.chat">Gryt in your browser</a>.</Note>
          <Note title="It won't connect?"><Link to="/support/cant-connect">Try these fixes</Link>.</Note>
        </Notes>
      </ProblemSection>
    </SupportProblem>
  );
}
