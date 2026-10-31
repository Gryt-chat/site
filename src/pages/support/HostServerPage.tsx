import { Link } from "react-router-dom";

import { Body, Note, Notes, ProblemSection, Step, Steps, SupportProblem } from "../../components/SupportProblem";

export function HostServerPage() {
  return (
    <SupportProblem
      title="Host a server from the app"
      lede="The app you downloaded is also a server. Make one in under a minute, then let friends in."
      askText="Tell us what you tried and what it said. A screenshot helps a lot. Blur any invite code first."
    >
      <ProblemSection id="create" title="Make your server">
        <Steps>
          <Step title="Click the + in the server rail">Then choose <strong>Create my own</strong>.</Step>
          <Step title="Give it a name">The icon is made from the name as you type.</Step>
          <Step title="Check the port and press Create">Take the port it offers, unless your router already forwards another one. Then your server starts and you&rsquo;re in it.</Step>
        </Steps>
        <Body>You&rsquo;re the owner, because you&rsquo;re the first person to join.</Body>
      </ProblemSection>
      <ProblemSection id="friends" title="Let people in">
        <Notes>
          <Note title="On the same network?">Leave <strong>Discoverable on LAN</strong> on, and people running Gryt on your network will see it appear. You may need to allow the ports through your firewall.</Note>
          <Note title="Somewhere else?">Forward the ports listed in <strong>Settings → My servers → Open these ports</strong>, then <Link to="/support/make-an-invite">send an invite</Link>. Gryt has no relay, so people connect straight to you.</Note>
          <Note title="Want it always on?">The server only runs while the app does. Hosting on an always-on machine is covered in <Link to="/self-hosting">self-hosting</Link>.</Note>
        </Notes>
      </ProblemSection>
    </SupportProblem>
  );
}
