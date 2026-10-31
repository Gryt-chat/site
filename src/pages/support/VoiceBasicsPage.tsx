import { Link } from "react-router-dom";

import { Body, Note, Notes, ProblemSection, SupportProblem } from "../../components/SupportProblem";

export function VoiceBasicsPage() {
  return (
    <SupportProblem
      title="Use voice and push-to-talk"
      lede="Join a voice channel, mute or deafen yourself, set up push-to-talk, and share your screen."
      askText="Tell us what you tried and what it said. A screenshot helps a lot. Blur any invite code first."
    >
      <ProblemSection id="basics" title="The basics">
        <Notes>
          <Note title="Join">Click a voice channel. Everyone in it can hear you, and the member list shows who&rsquo;s talking.</Note>
          <Note title="Mute">Stops your microphone. Other people see it on your name.</Note>
          <Note title="Deafen">Stops sound both ways, so it mutes you too.</Note>
        </Notes>
      </ProblemSection>
      <ProblemSection id="ptt" title="Push-to-talk">
        <Body>Choose it in <strong>Settings → Audio</strong>. You only send sound while you hold the key. In the desktop app it works while Gryt is in the background. In a browser, the Gryt window has to be in focus.</Body>
      </ProblemSection>
      <ProblemSection id="share" title="Sharing your screen">
        <Body>Leave the codec on Auto unless you have a reason not to. Auto uses H.264, which nearly every graphics card can handle. If people hear themselves, <Link to="/support/screen-share-echo">here&rsquo;s the fix</Link>.</Body>
      </ProblemSection>
      <ProblemSection id="esports" title="eSports mode">
        <Body>Find it in <strong>Settings → Voice</strong>. It cuts delay by turning off noise suppression and the noise gate, and it turns on push-to-talk.</Body>
      </ProblemSection>
    </SupportProblem>
  );
}
