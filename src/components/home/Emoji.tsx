import { Clip, type ClipSet } from "../Clip";
import { Showcase } from "../Showcase";

/**
 * The importer, which is the feature Sivert is proudest of.
 *
 * Facts read out of `packages/client/src/packages/socket/src/utils/
 * emoteImportSources.ts` and `hooks/useEmoteImport.ts`, not out of the docs —
 * the emoji docs never mention emoji.gg at all and are a separate task.
 *
 * Sivert's capture, 2160x2160 at 60fps, all 15 seconds:
 *
 *   yarn encode:clips <source> emoji-import \
 *     --width 1080 --fps 60 --av1-crf 30 --h264-crf 21
 *
 * **Square, and that is why this showcase is `regular`.** `large` gives the
 * media the wider column, which is right for a 16:9 clip and wrong for a 1:1
 * one — a 616px square beside two paragraphs is a column of picture next to a
 * column of mostly nothing. An even split puts the square at 522 and the text
 * at 522, which is the closest the two get to the same height.
 *
 * 1080 rather than the 2200 the hero and the share clip use: at 522 CSS px this
 * is still better than 2x on a Retina display, and the two full-width clips are
 * the ones that need the pixels.
 *
 * Not trimmed. It is a sequence rather than an ambient loop — open a pack,
 * paste, fetch, rename, import, then pick them out of the emoji picker and send
 * them — and cutting it anywhere drops a step the copy beside it names.
 *
 * It replaces `EmojiSketch`, which was deleted with it: that drawing existed to
 * stand in for this and there is no second place it was used.
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
      mediaCaption="A whole pack from emoji.gg, in one link: the list comes back before anything lands, and the emoji end up in the picker."
    >
      <p>
        Server settings takes a link and imports what is behind it. Paste one
        from emoji.gg or BetterTTV &mdash; a single emoji, a pack, or somebody&rsquo;s
        whole profile &mdash; and the box works out which of those it is on its
        own.
      </p>
      <p>
        You get the list before anything lands. Rename what you want to rename,
        untick what you don&rsquo;t want, and only the ones you kept are
        imported. Everything comes out 128 pixels tall, and anything animated
        is stored as WebP.{" "}
        <a href={DOCS} target="_blank" rel="noreferrer">
          Emoji in the docs
        </a>
        .
      </p>
    </Showcase>
  );
}
