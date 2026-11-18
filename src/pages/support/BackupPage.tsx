import { Body, ProblemSection, SupportProblem } from "../../components/SupportProblem";

const D = "https://docs.gryt.chat/docs";

export function BackupPage() {
  return (
    <SupportProblem
      title="Back up your server"
      lede="Everything lives in one folder. Here's the one trap that makes a copy worthless."
      askText="Tell us what you tried and what it said. A screenshot helps a lot. Blur any invite code first."
    >
      <ProblemSection id="what" title="What to back up">
        <Body>A Gryt server keeps everything in one folder, <code>DATA_DIR</code>. Copy that folder and you have the whole server, including its uploads and its identity key.</Body>
      </ProblemSection>
      <ProblemSection id="trap" title="The trap">
        <Body>Don&rsquo;t copy <code>gryt.db</code> on its own while the server is running. Recent writes sit in another file, so you can end up with an empty database, and nothing tells you until you restore it.</Body>
        <Body>The <a href={`${D}/host/backups`}>backup guide</a> has the safe commands. Try restoring a backup once, so you know it works.</Body>
      </ProblemSection>
    </SupportProblem>
  );
}
