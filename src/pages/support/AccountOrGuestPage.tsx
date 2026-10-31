import { Body, Note, Notes, ProblemSection, SupportProblem } from "../../components/SupportProblem";

const D = "https://docs.gryt.chat/docs";

export function AccountOrGuestPage() {
  return (
    <SupportProblem
      title="Do I need an account?"
      lede="No, not to try Gryt. Here's what a guest can do, what an account adds, and how to choose."
      askText="Tell us what you tried and what it said. A screenshot helps a lot. Blur any invite code first."
    >
      <ProblemSection id="short" title="The short answer">
        <Body>No. You can open Gryt, host a server and talk to people without signing up. Some servers do ask for an account, and Gryt tells you before you try to join.</Body>
      </ProblemSection>
      <ProblemSection id="choose" title="Which one do you want?">
        <Notes>
          <Note title="Pick guest for">A LAN party, a game night, or anything you&rsquo;d rather not put your name on. There&rsquo;s no email, and each server sees a different you. But if your computer dies, that identity is gone with it.</Note>
          <Note title="Pick an account for">Servers you plan to stay on, or more than one device. You&rsquo;re the same person on every server, and you can sign in again on a new computer.</Note>
          <Note title="Change your mind later">Making an account later keeps the memberships, roles and history you already have.</Note>
          <Note title="Run a server?">A guest can make a new identity in seconds, so bans on guests don&rsquo;t hold for long. Use invites or approval to control who gets in. <a href={`${D}/use/accounts#for-server-admins`}>More detail</a>.</Note>
        </Notes>
      </ProblemSection>
    </SupportProblem>
  );
}
