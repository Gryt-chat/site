import { Clip, type ClipSet } from "../Clip";
import { Showcase } from "../Showcase";

/**
 * The emoji importer, from `emoteImportSources.ts` and `useEmoteImport.ts`. Square, so this
 * showcase is `regular`: `large` gives the media the wider column, which suits 16:9.
 */
const IMPORT: ClipSet = {
  src: "/home/emoji-import.mp4",
  av1: "/home/emoji-import.av1.mp4",
  poster: "/home/emoji-import.poster.webp",
};

const SHOWS =
  "Importing an emoji.gg pack into Gryt: the link goes into server settings, " +
  "the whole pack comes back as a list with a name against each one, and the " +
  "emoji then appear in the picker and in a message";

const DOCS = "https://docs.gryt.chat/docs/use/emojis";

export function Emoji() {
  return (
    <Showcase
      id="emoji"
      side="left"
      size="regular"
      eyebrow="Emoji"
      title="Bring the emoji you already have."
      media={<Clip {...IMPORT} alt={SHOWS} width={1080} height={1080} />}
      mediaCaption="A whole pack from emoji.gg, from one link. You get to see the list first, and then they're in the picker."
    >
      <p>
        Paste a link into server settings and Gryt grabs what's behind it. One
        emoji, a whole pack, or somebody&rsquo;s entire profile from emoji.gg or
        BetterTTV. You don&rsquo;t have to tell it which one it is.
      </p>
      <p>
        You see the whole list before anything happens. Rename what you want,
        untick what you don&rsquo;t, and only the rest come in. They all end up
        128 pixels tall, and the animated ones are stored as WebP.{" "}
        <a href={DOCS} target="_blank" rel="noreferrer">
          Emoji in the docs
        </a>
        .
      </p>
    </Showcase>
  );
}
