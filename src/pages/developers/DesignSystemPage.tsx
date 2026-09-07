import { Avatar, Button, Chip } from "@gryt/ui";

import { DevSubPage } from "../../components/DevSubPage";
import { LinkRows, type RowItem } from "../../components/LinkRows";
import { OwlPlayground } from "../../components/OwlPlayground";
import { Snippet } from "../../components/Snippet";
import styles from "../../styles/audience.module.css";

/**
 * The design system (GRYT-956).
 *
 * The owl playground lives here now. It was the first thing on the old
 * `/developers` and it is a demo of one MIT package rather than the answer to
 * what a developer arrived wanting — but it is the best thing on the page once
 * somebody is here for the design system, so it leads.
 */
const DOCS = "https://docs.gryt.chat/docs";

/** The three components rendered above it, as they are written there. */
const UI_EXAMPLE = `import { Avatar, Button, Chip } from "@gryt/ui";

<Avatar seed="nora" alt="" size="small" />
<Chip label="42 ms" tone="success" />
<Button size="small">Send</Button>`;

const ROWS: RowItem[] = [
  {
    name: "The component library",
    detail: "The two packages Gryt's interface is built from, and the tokens they share.",
    href: `${DOCS}/ui`,
  },
  {
    name: "React Native",
    detail: "@gryt/ui-native, and where a phone forces a different answer than the web got.",
    href: `${DOCS}/ui/react-native`,
  },
  {
    name: "The theme generator",
    detail: "Build a palette, press Copy link, paste it into Appearance. A theme is a link.",
    href: "https://ui.gryt.chat/theme/generator",
  },
];

export function DesignSystemPage() {
  return (
    <DevSubPage
      eyebrow="Take a piece"
      title="The design system"
      lede="One set of tokens, two renderers, and a generator that turns a palette into a link. Four of these packages are MIT, so they drop into something that has nothing to do with Gryt."
    >
      <p className={styles.blockNote}>
        Every avatar in Gryt is drawn from a nickname. The package that does it
        has no dependencies and never touches the network, so this page just
        runs it instead of showing you a picture. Type a name and both halves
        change.
      </p>

      <OwlPlayground />

      <p className={styles.blockNote}>
        These three come straight out of the published package and are drawn
        here, picking up this page&rsquo;s colours as they go.
      </p>

      <div className={styles.sampleStage}>
        <Avatar seed="nora" alt="" size="small" />
        <Chip label="42 ms" tone="success" />
        <Button size="small">Send</Button>
      </div>

      <Snippet label="app.tsx" code={UI_EXAMPLE} />

      <LinkRows items={ROWS} />
    </DevSubPage>
  );
}
