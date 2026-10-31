import { Body, ProblemSection, Step, Steps, SupportProblem } from "../../components/SupportProblem";

export function ServerRestartPage() {
  return (
    <SupportProblem
      title="The server restarted and things look odd"
      lede="A short reconnect message and a blip in voice is normal. Here's what to expect when a server restarts."
      askText="Tell us what you tried and what it said. A screenshot helps a lot. Blur any invite code first."
    >
      <ProblemSection id="normal" title="What's normal">
        <Body>You&rsquo;ll see a short reconnecting message, voice drops and comes back with the connect sound, and the member list corrects itself. That takes a few seconds once the server is back.</Body>
        <Body>Until then, you might still hear people while the member list looks out of date. Voice and the member list are separate connections.</Body>
      </ProblemSection>
      <ProblemSection id="fix" title="If it doesn't sort itself out">
        <Steps>
          <Step title="Update">Older versions could show an Unknown user or the wrong status in voice. Update the app, and the server if it&rsquo;s yours.</Step>
          <Step title="Leave and rejoin voice">This rebuilds your connection to the voice server.</Step>
          <Step title="Check your own connection">If only you dropped, it isn&rsquo;t the server. Your connection also carries your audio, so voice goes with it.</Step>
        </Steps>
      </ProblemSection>
    </SupportProblem>
  );
}
