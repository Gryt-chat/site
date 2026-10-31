import { Body, Code, Note, Notes, ProblemSection, Step, Steps, SupportProblem } from "../../components/SupportProblem";

export function ServerClockPage() {
  return (
    <SupportProblem
      title="It says the server's clock is wrong"
      lede="The server's clock is off by more than a minute. Whoever runs the server can fix it in a couple of commands."
      askText="Tell us what you tried and what it said. A screenshot helps a lot. Blur any invite code first."
    >
      <ProblemSection id="what" title="What's happening">
        <Body>A server proves who it is with a short signed note that&rsquo;s good for 60 seconds. If its clock is off, that note looks too old and Gryt refuses it. Nothing has been hacked. The clock is just wrong.</Body>
        <Body>The message says which way and by how much. If the server is four minutes behind you, the server is the one to fix.</Body>
      </ProblemSection>
      <ProblemSection id="fix" title="If you run the server" intro="Not your server? Send this page to whoever runs it.">
        <Steps>
          <Step title="Check the clock">Run this on the server. You want to see <code>System clock synchronized: yes</code>.</Step>
          <Step title="Turn on time sync">If it says no, install chrony with the second command. Fresh VPS images often don&rsquo;t have time sync.</Step>
          <Step title="Join again">It should work straight away. You don&rsquo;t need to restart Gryt.</Step>
        </Steps>
        <Code>{"timedatectl\napt update && apt install -y chrony"}</Code>
        <Notes><Note title="In a container?">Containers use the clock of the machine underneath, so fix it there.</Note></Notes>
      </ProblemSection>
    </SupportProblem>
  );
}
