import { Body, ProblemSection, SupportProblem } from "../../components/SupportProblem";

export function ThreadsPage() {
  return (
    <SupportProblem
      title="Use threads"
      lede="Keep a long conversation out of the main channel, see what's new, and mark a question as solved."
      askText="Tell us what you tried and what it said. A screenshot helps a lot. Blur any invite code first."
    >
      <ProblemSection id="start" title="Start a thread">
        <Body>Hover a message in a channel and click the reply-in-thread icon. The thread opens in a panel, with that message at the top. You can&rsquo;t start one from a direct message.</Body>
      </ProblemSection>
      <ProblemSection id="follow" title="Keep up with one">
        <Body>A message with a thread shows its number of replies, and you can click that to open it. A separate badge shows how many you haven&rsquo;t read and how many mention you. Mentions also show up on the channel.</Body>
      </ProblemSection>
      <ProblemSection id="solved" title="Mark it solved">
        <Body>Whoever started the thread and any moderator can press <strong>Mark solved</strong> in the panel&rsquo;s header. People can still read and reply. If someone closes a thread, nobody can reply until it&rsquo;s reopened with the same button.</Body>
      </ProblemSection>
    </SupportProblem>
  );
}
