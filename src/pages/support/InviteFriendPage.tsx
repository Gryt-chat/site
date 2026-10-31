import {
  Code,
  CodeMark,
  Body,
  Messages,
  Note,
  Notes,
  ProblemSection,
  Step,
  Steps,
  SupportProblem,
} from "../../components/SupportProblem";

const DOCS = "https://docs.gryt.chat/docs";

export function InviteFriendPage() {
  return (
    <SupportProblem
      title="I can't invite a friend"
      lede="Most of the time, the invite link only works on your own network. It's a quick fix. Pick what you're seeing."
      choices={[
        { id: "cant-connect", label: "My friend can't connect" },
        { id: "refused", label: "The invite gets refused" },
        { id: "no-invites", label: "I can't find Invites" },
      ]}
      askText="Tell us where you got stuck and what the message said. A screenshot helps a lot. Blur the invite code first."
    >
      <ProblemSection
        id="cant-connect"
        title="My friend can't connect"
        intro="Start by looking at the address in your link. Is it one of these?"
      >
        <Code>
          host=<CodeMark>192.168.</CodeMark>1.20:5000{"\n"}
          host=<CodeMark>10.</CodeMark>0.0.5:5000{"\n"}
          host=<CodeMark>172.16.</CodeMark>0.5:5000
        </Code>
        <Body>
          Those are local addresses. They only work for people on your network, so a friend somewhere else can&rsquo;t
          reach them. If you hosted the server in the Gryt app, follow these steps.
        </Body>

        <Steps>
          <Step title="Add your public address">
            Stop your server first. Then go to <strong>Settings → My servers</strong>, type your public IP under{" "}
            <strong>Public IPs or hostnames</strong> and press <strong>Save</strong>.
          </Step>
          <Step title="Open the ports on your router">
            Gryt has no relay, so your friend connects straight to you. <strong>Open these ports</strong> on the same
            screen lists the ones your server uses. Forward them to this computer.{" "}
            <a href={`${DOCS}/host/from-the-app#ports-to-open`}>How ports work</a>.
          </Step>
          <Step title="Send a new link">
            Start the server and copy the invite again from <strong>Server settings → Invites</strong>. The old link
            still has the local address.
          </Step>
        </Steps>

        <Notes>
          <Note title="Testing it yourself?">
            Your own computer doesn&rsquo;t prove much. Try your phone on mobile data with Wi-Fi off, or ask your
            friend.
          </Note>
          <Note title="Is your friend on the same network?">
            The local link is fine. Check that your computer&rsquo;s firewall allows the server&rsquo;s ports.
          </Note>
          <Note title="Can't open ports?">
            You can connect some other way, like <a href={`${DOCS}/host/tailscale`}>Tailscale</a>.
          </Note>
        </Notes>
      </ProblemSection>

      <ProblemSection id="refused" title="The invite gets refused" intro="Find the message your friend sees.">
        <Messages
          items={[
            { text: "Invalid invite code", fix: "Check the whole code was copied, or make a new one." },
            { text: "That invite code has expired, or has been revoked", fix: "Make a new one." },
            { text: "No uses remaining", fix: "Make a new one with more uses." },
            { text: "Invite required to join this server", fix: "The link has no code in it. Send one that does." },
            {
              text: "Too many incorrect invite attempts",
              fix: "Wait a minute, then try a new code. The wait gets longer if it keeps happening, up to an hour.",
            },
            {
              text: "This invite has been used too many times recently",
              fix: "Wait a while, or use another invite.",
            },
            {
              text: "This server requires a Gryt account",
              fix: "Your friend signs in from the menu at the bottom left, then tries again.",
            },
          ]}
        />
      </ProblemSection>

      <ProblemSection
        id="no-invites"
        title="I can't find Invites"
        intro={
          <>
            It&rsquo;s under <strong>Server settings → Invites</strong>. If it isn&rsquo;t there, your role isn&rsquo;t
            allowed to make invites. Ask the server owner to send one, or to give you the{" "}
            <strong>Create invites</strong> permission.
          </>
        }
      />
    </SupportProblem>
  );
}
