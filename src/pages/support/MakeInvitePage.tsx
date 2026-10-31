import { Link } from "react-router-dom";

import { Note, Notes, ProblemSection, Step, Steps, SupportProblem } from "../../components/SupportProblem";

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
          <Step title="Choose the limits">Set how many times it can be used and when it expires, then press <strong>Create invite</strong>.</Step>
          <Step title="Copy it and send it">Your invite appears in the list. Revoke it there if you change your mind.</Step>
        </Steps>
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
