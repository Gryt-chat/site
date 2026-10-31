import { Link } from "react-router-dom";

import { Note, Notes, ProblemSection, Step, Steps, SupportProblem } from "../../components/SupportProblem";

export function MicrophonePage() {
  return (
    <SupportProblem
      title="My mic doesn't work"
      lede="Work down this list. Most of the time it's one of the first two."
      askText="Tell us which device you're on, and whether you're using the app or a browser."
    >
      <ProblemSection id="fix" title="Try these in order">
        <Steps>
          <Step title="Check you aren't muted">
            Look at the mute button in Gryt, then any mute switch on your headset.
          </Step>
          <Step title="Pick the right microphone">
            Open the audio settings in Gryt and check the right device is selected. If you have more than one, try
            another.
          </Step>
          <Step title="Allow the microphone">
            In a browser, check that the site is allowed to use your mic. Voice also needs a page on HTTPS.
          </Step>
          <Step title="Check the noise gate">
            If you&rsquo;re connected but quiet parts cut out, lower the noise gate in the audio settings.
          </Step>
        </Steps>

        <Notes>
          <Note title="Still nothing?">Try a different browser or another audio device.</Note>
          <Note title="People hear an echo?">Use headphones, so your mic doesn&rsquo;t pick up your speakers.</Note>
          <Note title="Nobody can hear anyone?">
            Then it&rsquo;s probably the server. <Link to="/support/nobody-can-hear-anyone">Try this instead</Link>.
          </Note>
        </Notes>
      </ProblemSection>
    </SupportProblem>
  );
}
