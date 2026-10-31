import { Body, Code, Note, Notes, ProblemSection, Step, Steps, SupportProblem } from "../../components/SupportProblem";

export function VoiceWontStartPage() {
  return (
    <SupportProblem
      title="Joining voice hangs, then blames my network"
      lede="You click a voice channel, nothing happens for 15 seconds, then a network message. It's usually DNS filtering."
      askText="Tell us what you tried and what it said. A screenshot helps a lot. Blur any invite code first."
    >
      <ProblemSection id="why" title="What's happening">
        <Body>
          Gryt has no relay, so a call has to find a direct path. To do that, Gryt asks a STUN server what your address
          looks like from outside. Ad blockers on your network sometimes block those servers, and then Gryt spends about
          15 seconds trying before it gives up.
        </Body>
      </ProblemSection>
      <ProblemSection id="fix" title="How to fix it">
        <Steps>
          <Step title="Try joining again">It usually works the second time.</Step>
          <Step title="Check for an ad blocker on your network">
            AdGuard Home, Pi-hole and NextDNS sometimes block <code>stun.l.google.com</code> because it&rsquo;s a Google
            address. If you don&rsquo;t run one of these, the person who runs your network might.
          </Step>
          <Step title="Allow the address">In AdGuard Home, go to <strong>Filters → Custom filtering rules</strong> and add the rule below. Give it a minute before you try again.</Step>
        </Steps>
        <Code>{"@@||stun.l.google.com^"}</Code>
        <Notes>
          <Note title="Want to check first?">
            On the same network, run <code>dig +short stun.l.google.com</code>. If you get <code>0.0.0.0</code> or nothing, something is blocking it.
          </Note>
          <Note title="Running the server?">
            You choose the STUN servers with <code>STUN_SERVERS</code>. Keep at least two providers, so one blocked provider doesn&rsquo;t stop calls.
          </Note>
        </Notes>
      </ProblemSection>
    </SupportProblem>
  );
}
