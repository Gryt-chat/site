import { Link } from "react-router-dom";

import { Body, Code, ProblemSection, SupportProblem } from "../../components/SupportProblem";

const DOCS = "https://docs.gryt.chat/docs";

export function InstallPage() {
  return (
    <SupportProblem
      title="The app won't install or open"
      lede="Pick your computer. Don't want to install anything? You can also open Gryt in your browser."
      choices={[
        { id: "windows", label: "Windows" },
        { id: "macos", label: "macOS" },
        { id: "linux", label: "Linux" },
      ]}
      askText="Tell us your system and version, where you downloaded Gryt, and what the message said."
    >
      <ProblemSection id="windows" title="Windows">
        <Body>
          If you see <strong>Windows protected your PC</strong>, click <strong>More info</strong>, then{" "}
          <strong>Run anyway</strong>. You get this warning because the app isn&rsquo;t signed with an EV certificate
          yet.
        </Body>
        <Body>
          No <strong>Run anyway</strong> button? Your organisation may be blocking unsigned apps. You can use{" "}
          <a href="https://app.gryt.chat">Gryt in your browser</a> instead, or{" "}
          <a href={`${DOCS}/about/build-the-client`}>build it from source</a>.
        </Body>
      </ProblemSection>

      <ProblemSection id="macos" title="macOS">
        <Body>
          Releases are signed and notarized, so macOS shouldn&rsquo;t complain. If it does and you got the app from{" "}
          <Link to="/download">our download page</Link>, don&rsquo;t click through it. Please tell us instead.
        </Body>
        <Body>
          If you built the app yourself, right-click it, choose <strong>Open</strong> and confirm. macOS remembers that
          for next time.
        </Body>
      </ProblemSection>

      <ProblemSection id="linux" title="Linux">
        <Body>An AppImage might not be allowed to run after you download it. Run this in the same folder:</Body>
        <Code>
          chmod +x Gryt-Chat-*.AppImage{"\n"}
          ./Gryt-Chat-*.AppImage
        </Code>
      </ProblemSection>
    </SupportProblem>
  );
}
