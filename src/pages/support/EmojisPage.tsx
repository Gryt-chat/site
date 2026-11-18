import { Body, ProblemSection, Step, Steps, SupportProblem } from "../../components/SupportProblem";

const D = "https://docs.gryt.chat/docs";

export function EmojisPage() {
  return (
    <SupportProblem
      title="Add custom emojis"
      lede="Upload your own images, name them, and use them in chat on your server."
      askText="Tell us what you tried and what it said. A screenshot helps a lot. Blur any invite code first."
    >
      <ProblemSection id="add" title="Add them">
        <Steps>
          <Step title="Open Emojis">Go to <strong>Server settings → Emojis</strong>. You need to be an admin or the owner.</Step>
          <Step title="Choose your images">Click <strong>Choose files</strong> and pick one or more. PNG, JPEG, WebP, GIF and AVIF all work. SVG doesn&rsquo;t.</Step>
          <Step title="Check the names and upload">Names need 2 to 32 letters, numbers or underscores, and each one has to be unique. Then click <strong>Upload all</strong>.</Step>
        </Steps>
      </ProblemSection>
      <ProblemSection id="use" title="Use them">
        <Body>Type the name between colons, like <code>:cat_jam:</code>. Images are resized to 128 pixels tall, and animated ones stay animated. <a href={`${D}/use/emojis`}>More detail</a>.</Body>
      </ProblemSection>
    </SupportProblem>
  );
}
