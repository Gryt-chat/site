import { Messages, Note, Notes, ProblemSection, SupportProblem } from "../../components/SupportProblem";

const D = "https://docs.gryt.chat/docs";

export function SoundProblemsPage() {
  return (
    <SupportProblem
      title="Voice sounds bad"
      lede="Echo, words cut off, volume going up and down, or audio dropping out. Here's what each one usually means."
      askText="Tell us what you tried and what it said. A screenshot helps a lot. Blur any invite code first."
    >
      <ProblemSection id="sounds" title="Find what you're hearing" intro="You'll find these settings in Settings → Audio.">
        <Messages
          items={[
            { text: "People hear an echo of themselves", fix: "Whoever's speakers are on is usually the cause. Have them use headphones." },
            { text: "Your voice cuts off at the start of words", fix: "The noise gate is set too high. Watch the meter next to the slider and set it below your quiet speech." },
            { text: "Your volume pumps up and down", fix: "Automatic gain and a strong compressor are fighting. Turn the compressor amount down first." },
            { text: "Background noise comes through", fix: "Check that noise suppression (RNNoise) is on. Then try raising the noise gate a little." },
            { text: "Audio keeps cutting out", fix: "That's usually the connection. Try a wired connection or another network, and check whether other people have it too." },
          ]}
        />
        <Notes>
          <Note title="Using eSports mode?">It turns off noise suppression and the noise gate to save time, so turn it off if background noise bothers people.</Note>
          <Note title="Running the server?">If everyone's audio drops, read the <a href={`${D}/host/voice-debugging`}>voice debugging guide</a>.</Note>
        </Notes>
      </ProblemSection>
    </SupportProblem>
  );
}
