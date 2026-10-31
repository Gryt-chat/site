import { Body, Code, Note, Notes, ProblemSection, Step, Steps, SupportProblem } from "../../components/SupportProblem";

const D = "https://docs.gryt.chat/docs";

export function ServerIdentityPage() {
  return (
    <SupportProblem
      title="It says Server identity not recognised"
      lede="The server has a different key than when you first joined. Check before you trust it."
      askText="Tell us what you tried and what it said. A screenshot helps a lot. Blur any invite code first."
    >
      <ProblemSection id="what" title="What's happening">
        <Body>Gryt remembers each server&rsquo;s key from the first time you join. This server showed a different one, so Gryt stopped before sending anything. Usually the server was rebuilt and lost its data, but it could be a different server at that address.</Body>
      </ProblemSection>
      <ProblemSection id="fix" title="What to do">
        <Steps>
          <Step title="Ask whoever runs the server">Ask whether they rebuilt or moved it. Don&rsquo;t unblock it until you know.</Step>
          <Step title="Compare the keys">They can find the key in the server&rsquo;s startup log, using the command below. You can see yours in <strong>Settings → Server identities</strong>.</Step>
          <Step title="Unblock it if they match">Unblock the server on that screen and reconnect. If they don&rsquo;t match, something else is answering at that address, so leave it blocked.</Step>
        </Steps>
        <Code>{'docker compose logs server | grep "identity key"'}</Code>
        <Notes><Note title="Moving a server?">Keep <code>server-identity-key.json</code> and people won&rsquo;t see this message. <a href={`${D}/use/troubleshooting#server-identity-not-recognised`}>More detail</a>.</Note></Notes>
      </ProblemSection>
    </SupportProblem>
  );
}
