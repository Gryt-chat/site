import { Messages, Note, Notes, ProblemSection, Step, Steps, SupportProblem } from "../../components/SupportProblem";

const D = "https://docs.gryt.chat/docs";

export function RolesPage() {
  return (
    <SupportProblem
      title="Set up roles"
      lede="Decide who can talk, moderate and read on your server, and promote regulars automatically."
      askText="Tell us what you tried and what it said. A screenshot helps a lot. Blur any invite code first."
    >
      <ProblemSection id="start" title="What you start with">
        <Messages
          items={[
            { text: "Owner", fix: "Everything. It can't be edited or given out." },
            { text: "Admin", fix: "Everything except roles, server settings and identity replacement." },
            { text: "Moderator", fix: "Kick, mute, deafen and pull people out of voice." },
            { text: "Member", fix: "Talk, upload, join voice and change their own name." },
            { text: "Guest", fix: "Read, and nothing else." },
          ]}
        />
      </ProblemSection>
      <ProblemSection id="setup" title="A good setup for a public server">
        <Steps>
          <Step title="Choose who gets what on joining">Go to <strong>Server settings → Role editor → When somebody joins</strong>. Try <strong>Member</strong> for accounts and <strong>Guest</strong> for guests. This only affects people who join later.</Step>
          <Step title="Add a role for regulars">Make a new role, and have it give itself out after a number of days and messages. If you fill in both, people need both.</Step>
          <Step title="Pick your helpers">Make a role with the permissions helpers need, and give it out yourself.</Step>
        </Steps>
        <Notes>
          <Note title="Who can act on whom?">Nobody can kick, ban or mute someone of the same or higher rank. Only the owner can act on an admin.</Note>
          <Note title="Want every switch explained?"><a href={`${D}/use/roles`}>Read the full roles guide</a>.</Note>
        </Notes>
      </ProblemSection>
    </SupportProblem>
  );
}
