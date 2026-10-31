import { Link } from "react-router-dom";

import { Screenshot, Note, Notes, ProblemSection, Step, Steps, SupportProblem } from "../../components/SupportProblem";

export function MakeInvitePage() {
  return (
    <SupportProblem
      title="Make an invite"
      lede="Create an invite link, choose how many people can use it, and let people on your network in without one."
      askText="Tell us what you tried and what it said. A screenshot helps a lot. Blur any invite code first."
    >
      <ProblemSection id="make" title="Make the link">
        <Steps>
          <Step title="Open Invites">Go to <strong>Server settings → Invites</strong>.</Step>
          <Step title="Choose the limits">Fill in <strong>Max uses</strong> and <strong>Expires (hours)</strong> if you want limits, then press <strong>Create invite</strong>. <strong>Max uses</strong> starts at 1, so raise it or turn on <strong>Infinite uses</strong> for more than one person.</Step>
          <Step title="Copy it and send it">Your invite appears in the list. Revoke it there if you change your mind.</Step>
        </Steps>
        <Screenshot
          src="/support/make-an-invite/invites.webp"
          alt="The Invites tab in Server settings, with fields for max uses, expiry, a custom code and a note, and a Create invite button"
        />
      </ProblemSection>
      <ProblemSection id="options" title="Other ways in">
        <Notes>
          <Note title="Everyone in the same room?">Turn on <strong>Allow anyone on LAN to join</strong> in <strong>Server settings → Overview</strong>, and nobody on your network needs a code.</Note>
          <Note title="Give people a role">An invite can give people a role when they join. The role needs <strong>Can be given out by an invite</strong> turned on first.</Note>
          <Note title="It isn't working?"><Link to="/support/invite-a-friend">Fix invite problems</Link>.</Note>
        </Notes>
      </ProblemSection>
    </SupportProblem>
  );
}
