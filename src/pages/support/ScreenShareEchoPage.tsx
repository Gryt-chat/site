import { Body, ProblemSection, Step, Steps, SupportProblem } from "../../components/SupportProblem";

export function ScreenShareEchoPage() {
  return (
    <SupportProblem
      title="People hear themselves when I share my screen"
      lede="Your screen share is picking up Gryt's own audio. Here's the fix for each computer."
      askText="Tell us what you tried and what it said. A screenshot helps a lot. Blur any invite code first."
    >
      <ProblemSection id="why" title="What's happening">
        <Body>Your screen share is capturing your computer&rsquo;s sound, and that includes the other people talking in Gryt. So they hear themselves come back.</Body>
      </ProblemSection>
      <ProblemSection id="linux" title="In a browser or on Linux">
        <Body>There&rsquo;s no way yet for Gryt to separate its own audio here. You have two options:</Body>
        <Steps>
          <Step title="Use headphones">So Gryt&rsquo;s sound doesn&rsquo;t reach the capture.</Step>
          <Step title="Send Gryt to another output">Set a separate output device for Gryt, like a virtual audio cable, and share only your main output.</Step>
        </Steps>
      </ProblemSection>
      <ProblemSection id="desktop" title="In the app on Windows or macOS">
        <Body>The app leaves its own sound out for you. If it isn&rsquo;t working, check that you&rsquo;re on Windows 10 build 20348 or later (run <code>winver</code>) or macOS 13 or later. If you are, reinstall the app.</Body>
      </ProblemSection>
    </SupportProblem>
  );
}
