import { Clip, type ClipSet } from "../Clip";
import { Showcase } from "../Showcase";

/**
 * The emoji importer.
 *
 * Facts read out of `packages/client/src/packages/socket/src/utils/
 * emoteImportSources.ts` and `hooks/useEmoteImport.ts`. The emoji docs never
 * mention emoji.gg at all.
 *
 * Encoded from Sivert's 2160x2160 60fps capture, all 15 seconds of it:
 *
 *   yarn encode:clips <source> emoji-import \
 *     --width 1080 --fps 60 --av1-crf 30 --h264-crf 21
 *
 * **Square, so this showcase is `regular`.** `large` gives the media the wider
 * column, which is right for 16:9 and wrong for 1:1. An even split puts the
 * square at 522 and the text at 522, the closest the two get to one height.
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

const DOCS = "https://docs.gryt.chat/docs/guide/emojis";

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
