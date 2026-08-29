# Shot list

What the front page shows as a recording, what each take has to contain, and the
one that has not been recorded yet.

This was an untracked file in somebody's scratchpad until 2026-08-29, and it is
gone — the handoff notes still referred to "§1" and "§4" of a document nobody
could open. So it lives here now, next to [`design.md`](design.md), which
carries the reasoning about layout and holds the rules these captures follow.

## How a capture becomes three files

`scripts/encode-clips.mjs` turns one recording into the AV1 copy, the H.264
copy and the poster:

```bash
node scripts/encode-clips.mjs <source> <name> \
  [--width 1440] [--fps 30] [--av1-crf 34] [--h264-crf 20] \
  [--start 0] [--duration <seconds>] [--poster-at <seconds>]
```

It writes `public/home/<name>.av1.mp4`, `<name>.mp4` and `<name>.poster.webp`,
which is exactly the `ClipSet` in `src/components/Clip.tsx`. Wiring a new clip
in is filling that constant; nothing else in the section changes.

Things the script's defaults assume, and when to override them:

- **Frame rate is a claim or it is not.** The hero and the screen share are
  60fps at `--av1-crf 30 --h264-crf 21`, because smoothness is the thing they
  are arguing. `create-server` and `avatar-editor` are 30fps at the default
  CRFs: a dialog, a field and a cursor at walking pace.
- **The poster is what reduced motion gets instead of the video**, so it has to
  stand on its own. `--poster-at` exists because the first frame of a recording
  is usually an empty state. `create-server` takes 2.9s, `avatar-editor` 2.4s.
- **Trim only when the clip is ambient.** The hero loops, so it is twelve
  seconds of a twenty-second take. `emoji-import` is a sequence, and cutting it
  anywhere drops a step the copy beside it names.
- **Width follows the column, not the source.** 2200 for the two full-width
  clips, 1080 for the square one at 522 CSS px, 960 for the LAN pane.
- **Sources are not committed.** They are hundreds of megabytes and nothing
  rebuilds from them. Keep the original somewhere you will find it again; the
  repo gets the three outputs.

Two rules from `design.md` that apply to what is in frame:

- **No fake chrome, and no staged UI.** These are recordings of the app doing
  the thing. If a drawing would be clearer, it goes in `sketches.tsx` instead.
- **`alt` is a sentence about what happens**, not a label. It is read aloud and
  it is what reduced motion is handed alongside the still.

## Recorded

| Clip | Where | Shape | Encoded |
|---|---|---|---|
| `client-live` | `Hero` | 2200×1238, 60fps | trimmed to 12s of a 20s take |
| `screen-share` | `Voice` | 2200×1238, 60fps | `--av1-crf 30 --h264-crf 21` |
| `create-server` | `SelfHost` | 2200×1212, 30fps | whole take, `--poster-at 2.9` |
| `avatar-editor` | `Bird` | 2200×1212, 30fps | `--poster-at 2.4` |
| `emoji-import` | `Emoji` | 1080×1080, 60fps | whole take, untrimmed |

`create-server` is the one to watch before recording anything else. Sixteen
seconds, one take, no cuts: an empty client, Add a server, a name, the port it
picked, create, a look through the settings it made, something said in
`#General`, a reaction to it, and then Servers on your network with the new
server already listed. No terminal appears because no terminal is involved,
which is the claim the section makes.

## Outstanding: LAN discovery on a second machine

`Lan` holds `const LAN: ClipSet | null = null` and renders `Pane` instead — the
discovery list built from the same `@gryt/ui` parts the client builds it from,
with four made-up servers and a caption saying so. That is a finished thing
rather than a placeholder, so this shot is an improvement and not a blocker.

**What it has to show, and why the existing footage cannot:** a server started
on one machine appearing by itself in the list on a *second* machine. The end of
`create-server` already shows the discovery pane, but on the same machine that
made the server, so it proves the pane exists and not that mDNS carried
anything. Two machines is the entire point.

Recipe:

- Two machines on one network, the desktop app on both. macOS uses a Bonjour
  browser and everything else a raw dgram socket
  (`packages/client/electron/lanDiscovery.ts`), so a mixed pair is the more
  honest recording if there is one to hand.
- Record the second machine. The first one is off camera doing the thing the
  first clip already showed.
- Open Servers on your network on the second machine with the list empty, then
  create the server on the first. The list is the shot: an empty pane, a server
  appearing in it on its own, no typing.
- Nothing that identifies the network, and nothing in frame that names a real
  person. `Pane`'s four servers are invented for this reason.
- Eight to twelve seconds, and the appearance should land around three seconds
  in so `--poster-at` has a frame with something in the list.
- 960×720 to match the pane's slot, 30fps, default CRFs.

Wiring it in:

```ts
const LAN: ClipSet = {
  src: "/home/lan-discovery.mp4",
  av1: "/home/lan-discovery.av1.mp4",
  poster: "/home/lan-discovery.poster.webp",
};
```

`Lan` already branches on it: the `Clip`, its `alt`, and the caption "A server
started on one machine, appearing on another" are written and waiting. Reduced
motion gets the poster, the way it does for every other clip on the page. Leave
`Pane` in the file rather than deleting it — it is what the section falls back
to if the clip is ever pulled, and it costs nothing to keep.

## Deliberately not captures

- **`Themes`** runs the real palettes and repaints the page from them.
- **`Addons`** is `AddonSketch`, because the section's claim is that the surface
  is small and a recording of a small API is a recording of nothing happening.
- **`Identity`** is `VaultSketch`, a password manager entry rather than a
  recording of one, and **`Lan`**'s pane is built from the shipped components.

A section with a video-shaped hole in it is worse than a section with a
paragraph in it. Everything here has something finished in it that a capture
would replace, rather than a gap waiting for one.
