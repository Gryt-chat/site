import { Link } from "react-router-dom";

import { Body, ProblemSection, Step, Steps, SupportProblem } from "../../components/SupportProblem";

export function AppUpdatesPage() {
  return (
    <SupportProblem
      title="The app won't update or forgets my profile"
      lede="Old Windows versions can't update themselves, and an old install can reset your profile. Both take one fresh install."
      askText="Tell us what you tried and what it said. A screenshot helps a lot. Blur any invite code first."
    >
      <ProblemSection id="stuck" title="It keeps downloading but never updates">
        <Body>Windows versions 1.6.6 to 1.6.24 can&rsquo;t install updates. Check yours in <strong>Settings → Updates &amp; about</strong>. Your settings, servers and identity stay as they are.</Body>
        <Steps>
          <Step title="Close Gryt completely">Use <strong>Quit</strong> in the tray icon&rsquo;s menu. Closing the window leaves it running.</Step>
          <Step title="Install it again">Get the installer from <Link to="/download">our download page</Link> and run it. Updates work by themselves after that.</Step>
        </Steps>
      </ProblemSection>
      <ProblemSection id="profile" title="It asks me to set up my profile every time">
        <Body>This usually comes from an install older than version 1.0.122 that&rsquo;s still on your Windows computer.</Body>
        <Steps>
          <Step title="Uninstall Gryt">Go to <strong>Settings → Apps → Gryt Chat → Uninstall</strong> in Windows.</Step>
          <Step title="Delete the old folder">Delete <code>C:\\Users\\&lt;user&gt;\\AppData\\Local\\Programs\\client</code> if it&rsquo;s still there.</Step>
          <Step title="Install the latest version">Get it from <Link to="/download">our download page</Link>.</Step>
        </Steps>
      </ProblemSection>
      <ProblemSection id="how" title="How updates normally work">
        <Body>Gryt checks when it starts and once an hour after that. It downloads in the background and installs when you quit, or when you press <strong>restart and update now</strong>. That restart drops you out of a call, so you can wait. You can turn this off in <strong>Settings → Updates &amp; about → Automatic updates</strong>.</Body>
      </ProblemSection>
    </SupportProblem>
  );
}
