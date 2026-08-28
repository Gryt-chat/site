# Design — gryt.chat

The front page was rebuilt first and this file records the parts of it that
everything else shares.

It is deliberately narrower than a full design system. The content pages do
**not** copy the front page's section rhythm — each one is built on its own
Hallmark macrostructure, chosen for what that page actually is. What they share
is the material: tokens, the one type family, the motion module. A page is free
to look different; it is not free to introduce a second accent or a second
font.

It is **descriptive, not aspirational**. Every value here is read out of
`src/styles/tokens.css`, `src/index.css` and `src/components/home/*`. If a page
disagrees with this file, the page is wrong. If the front page disagrees with
this file, this file is wrong and should be corrected.

## Genre

Atmospheric-leaning technical. Dark paper, one cool accent, no decoration that
does not carry information.

## Theme

Locked. From `src/styles/tokens.css`.

| Token | Value | Job |
|---|---|---|
| `--bg` | `#111318` | page |
| `--bg-raised` | `#1a1d24` | a surface lifted off the page |
| `--bg-card` | `#1e2028` | the only card fill |
| `--text` | `#e0e0e6` | body |
| `--text-dim` | `#888` | secondary, captions, meta |
| `--text-dimmer` | `#858790` | tertiary text and timestamps; passes AA on page and card surfaces |
| `--accent` | `#968FF8` | eyebrows, rules, focus |
| `--accent-ink` | `#14161d` | text on accent-filled controls |
| `--accent-light` | `#b4afff` | links |
| `--border` | `#2b303d` | every hairline |
| `--green` `--red` `--yellow` | `#4ade80` `#f87171` `#fbbf24` | status only, never decoration |

`--max-w` is `1100px`. Radii are `8 / 12 / 16`, and nothing is a pill except the
navbar and the hero badge.

## Typography

One family, two cuts. Atkinson Hyperlegible Next as a variable font at
`200–900`, Atkinson Hyperlegible Mono for anything that is a value rather than a
sentence. There is no second display face and there should not be one.

- Section heading: `clamp(28px, 3.6vw, 44px)`, weight `800`, letter-spacing `-0.028em`
- Sub-heading inside a section: `clamp(22px, 2.4vw, 30px)`, weight `800`,
  letter-spacing `-0.024em`
- Card or item heading: `17.5px`, weight `800`, letter-spacing `-0.014em`
- Body: `16px`, line-height `1.6`
- Eyebrow: `12px`, weight `700`, uppercase, letter-spacing `1.5px`, accent

Display sizes all carry negative tracking and `text-wrap: balance`. Body copy
does not.

## The section rhythm (front page only)

This is how the front page builds a section. Content pages are **not** required
to follow it, and mostly do not. It is recorded because when a content page
does want a section head, this is the one to copy rather than inventing a
second.

Every front-page section is the same three parts, stacked in one column:

```
eyebrow      12px uppercase accent
heading      clamp, weight 800, balanced
sub          one or two sentences, --text-dim
```

The eyebrow sits **above** the heading in the same column. The tag-left /
heading-right split is not used anywhere on the front page and should not appear
on a content page.

Sections are separated by `border-top: 1px solid var(--border)`, sometimes with a
5 % accent wash fading out by 70 %. Padding is `100px 24px`, dropping to
`68px 16px` under 820px.

The padding goes on the **section**, and the `--max-w` cap on the inner div.
Doing it the other way round works and puts that section's text 24px inboard of
every other section's, which is visible as soon as two of them are on screen
together.

**A front-page section shows its claim wherever it can.** The demonstration is a
live component, a capture of the app, or a diagram that carries the information
— not a paragraph arguing the point. The rhythm this produces is a narrow text
column over a full-width demonstration, and the alternation is the page's
structure.

Not every section can, and forcing one is worse than the prose. `Motivation` is
somebody's account of why they built this, and it is text because that is what
it is. The rule is that a section is not *padded* with argument, not that every
section must carry a picture.

**The front page is short, and stays short.** Anything that wants three
paragraphs to make its case belongs on a page that has room for three
paragraphs. The security argument used to be on here and is not any more:
`/why-gryt` and the docs already answer those questions properly, and a threat
model is not what somebody deciding whether to try this needs.

## Sponsors

Two surfaces reading one file, `src/data/sponsors.ts`.

`src/components/home/Sponsors.tsx` on the front page shows who is sponsoring
**now**, because that is what the $100 tier promises and the front page is where
it was promised. It has no card fill: `SelfHost` immediately above it ends on a
three-card grid, and the standing rule below says two adjacent card sections
means one of them is wrong. Logos sit on the page ground with a rule under them.

`/sponsors` carries the history, including one-off payments and the month each
arrived. A payment from a year ago is not current, and putting it on the front
page either implies it is or needs a caveat beside it. The page does not animate;
a list that arrives row by row is one you cannot scan.

## Stylesheet order

`src/index.css` imports `@gryt/ui/styles.css` **before** `@import "tailwindcss"`.

That is not cosmetic. The library ships its own precompiled Tailwind utilities,
so importing it second put its unprefixed classes after this site's responsive
variants — same layer, same specificity, so `.flex-col` from the library beat
`.md\:flex-row` from here and a three-column component stacked at every width
with nothing in the console. Library first means the site's utilities come last,
which is also the right direction: a page should be able to override a library
with a utility class. See GRYT-643.

## Motion

From `src/components/home/motion.ts`. Content pages import the same module
rather than defining their own.

- `rise(reduced)` — `opacity 0 → 1`, `y 24 → 0`, `600ms`, `cubic-bezier(0.16, 1, 0.3, 1)`
- `stagger(reduced, gap = 0.07)` — parent for children that arrive in sequence
- `inView` — `once: true`, `margin: -80px`

Only `transform` and `opacity` animate. `prefers-reduced-motion` collapses every
spatial move to a `150ms` fade, and `src/index.css` additionally kills the
ambient keyframe washes that the motion components cannot reach.

## Per-page macrostructures

Each content page is built on the Hallmark shape that fits its content, not on
the front page's rhythm. Recorded here so the next run does not re-pick blind:

| Page | Macrostructure | Why |
|---|---|---|
| `/blog` | Index-First | the page is a list of links |
| `/blog/:slug` | Long Document | continuous prose, inline section heads |
| `/changelog` | Narrative Workflow | releases are a real sequence |
| `/changelog/:version` | Workbench | the notes are mostly app captures |
| `/why-gryt` | Conversational FAQ | it is questions and trust boundaries |
| `/compare` | Index-First | it is two tables and a set of cards |
| `/developers`, `/self-hosting` | Index-First | both are grouped rows that mostly leave for the docs |
| `/sponsors` | Index-First | the page is a list of people |
| `/privacy`, `/terms`, `/community-guidelines` | Long Document | they are documents |
| `/invite` | none, component-scope | an app screen with states, not a page |

`/changelog` was picked when `content/changelog` held one release and a timeline
with one dot is thin. It was kept deliberately because it comes good as releases
land, and there are three now.

## What the content pages must share

- The token set, verbatim. No page-local colours, no second accent.
- The one type family. Mono is for values, never for running text.
- Negative tracking in **em**, never px: px tracking on a `clamp()` size
  loosens as the viewport grows, which is a bug several of these pages had.
- A reading measure on running prose. 68ch is what the long pages use.
- The motion module if the page animates at all. No page defines its own.

## What they may differ on

- The whole page shape. See the table above.
- Whether a page animates at all. A privacy policy that fades in section by
  section is worse than one that is simply there, and a list that animates in
  is a list you cannot scan.

## Standing rules taken from the front-page rebuild

These were decided during that rebuild and are worth not re-litigating:

- **Cards are a budget, not a default.** If two adjacent sections are both card
  grids, one of them is wrong. Rules and type first.
- **No card inside a card.**
- **No decorative gradient blobs, glow divs, or fake window chrome.** The hero
  uses a real screenshot.
- **The accent is for eyebrows, rules, links and focus.** It is not a fill for
  large areas outside the share cards.
- **Status colour means status.** Green is not "good vibes".

## Live components and captures

Added in the 2026-08-27 front-page rebuild.

**The owl designer on `/#bird` is the client's, not a version of it.** Four files
under `src/components/owl/`, copied from the client because `packages/client` is
not published to npm. GRYT-641 moves it into `@gryt/ui` and deletes the copy; do
not fix a bug in one without the other until it does.

**The page may render the real product.** `@gryt/ui` and `@gryt/owl` are
published to npm, so the site imports the components the client is built from
and draws owls with the same generator, live. That is not the banned re-drawn
chrome: the rule against a hand-built fake browser bar or a fake terminal frame
is about inventing a UI that already exists. These *are* the shipped components.

Two conditions on it. A live panel that stands in for something the visitor
cannot see — a call with people in it — has to say so in the copy beside it,
because a marketing page implying a live room is the kind of claim the rest of
the page exists to avoid. And it stops when it is off screen or when
`prefers-reduced-motion` is set; a ring pulsing forever below the fold is work
nobody sees.

**Clips are real captures of the app**, never re-enactments, and they go through
`src/components/Clip.tsx`:

- an AV1 copy first and an H.264 copy second, both silent
- `autoPlay muted loop playsInline`, no controls — closer to an animated image
  than to video, and without `muted` and `playsInline` autoplay is not something
  a browser allows at all
- a `poster`, which is also what `prefers-reduced-motion` gets **instead of** the
  video. A clip that loops is motion however it is eased in, and the blanket fade
  in `index.css` cannot reach it.

`scripts/encode-clips.mjs` writes all three from one source. Sources are not
committed; only the outputs are, and the script is run by hand rather than in
`yarn build`, since on CI there would be nothing to encode.

Two clips are on the page, both from Sivert's own captures at 3840x2160 / 60fps:

| Clip | Where | Encode |
|---|---|---|
| `client-live` | the hero, 12s of the 20s take | `--width 2200 --fps 60 --av1-crf 30 --h264-crf 21 --duration 12` |
| `screen-share` | `Voice`, 10s | `--width 2200 --fps 60 --av1-crf 30 --h264-crf 21` |
| `emoji-import` | `Emoji`, all 15s, **1:1** | `--width 1080 --fps 60 --av1-crf 30 --h264-crf 21` |

**2200 wide** because the widest slot either sits in is 1180 CSS px, and a 2x
display asking for that wants roughly this many real pixels. **60fps is kept**:
the source is 60, and screen sharing is the one claim on this page where frame
rate *is* the claim. **CRF 30 / 21** rather than the script's 34 / 20 defaults,
which are tuned for flat UI at 30fps — a game inside a screen share is real
motion, and a 60fps frame gets half the time on screen to hide its own
artefacts.

The hero take is cut to 12 seconds. It loops silently, nobody watches a hero for
twenty, and the trim takes it from 3.5 MB to 1.6 MB of AV1 before anything else
on the page has loaded.

`screen-share` is 60fps and the heading above it says sharing goes to 120. The
clip is not the proof of that and its constant is named for what it is rather
than for the claim it sits under, so that nobody later reads the filename as
evidence. A 120fps take replaces it when one exists.

The still the hero used to carry — `client.webp` at 3456 wide and the two widths
`optimize-images.mjs` derived from it — is gone. `Clip` renders its own poster
under `prefers-reduced-motion`, and that poster is the first frame of the take
rather than a different session's screenshot.

`emoji-import` is square, **which is why its showcase is `regular` and not
`large`.** `large` gives the media the wider column, which is right for a 16:9
clip and wrong for a 1:1 one — a 616px square beside two paragraphs is a column
of picture next to a column of mostly nothing. An even split puts both at 522,
which is the closest the two get to the same height. A square is also the better
shape for a zoomed screen recording: the interesting part is a panel, not a
window, and 16:9 spends the width on desktop either side of it.

It is 1080 rather than the 2200 the full-width clips use — still better than 2x
at 522 CSS px — and it is not trimmed, being a sequence rather than an ambient
loop. `EmojiSketch` was deleted with it: the drawing existed to stand in for
this clip and had no second consumer.

`Lan` still holds `null` and shows a drawing instead. That is the
resolution of the older rule about video-shaped holes: the hole is the problem,
not the absence of footage, so each of those sections has something finished in
it that a clip will later replace.

The hero's decorative blob field is gone. The standing rule above had made it the
one exception left in the file, and the hero earns its way without it.

## Showcase

`src/components/Showcase.tsx`. One feature, its words on one side and something
to look at on the other.

```
<Showcase side="left|right" size="regular|large|full" eyebrow title media below>
```

- `regular` splits the row evenly, `large` gives the media the wider column
  (0.82fr / 1.18fr), `full` puts the media under the text at the section width.
- One column under 900px, media after the words.
- `side` is a prop, not `:nth-child`. Alternation by child index flips every
  block below any section somebody inserts in the middle, and the diff is one
  line.
- **The sequence lives in `HomePage.tsx`, and it has to.** A prop nothing
  enforces is a prop that drifts: the first version set `Identity`, `Emoji` and
  `Themes` to `right` in isolation and the page ran right, right, right, left.
  Full-width sections do not take a turn and do not reset it.
- The visual swap is a grid placement, not `row-reverse`, so the copy stays
  first in the DOM and reading order matches the order the words are written in.
- `media` may be omitted, and a section without it renders as a plain column
  rather than as an empty half. Four sections are in that state now, waiting on
  captures — the call `Hero.tsx` made until its own clip arrived.
- `below` is full width under both columns. The voice fact strip is why.

`src/styles/audience.module.css` and `src/components/LinkRows.tsx` are the
matching pair for /developers and /self-hosting: a heading, a note, and rows of
name + one line + arrow. Rows rather than cards, by the standing rule below.

## The audience split

The front page kept accumulating technical material because there was nowhere
else for it, and every round after was spent cutting it out again. So there are
three pages now, and each one has a reader:

| Page | Reader |
|---|---|
| `/` | somebody deciding whether to try it |
| `/developers` | somebody building on it or taking a package away |
| `/self-hosting` | somebody putting a server on a machine |

Both new pages are mostly a front door onto `docs.gryt.chat`. The docs are
already grouped by audience and they are kept correct; a second copy of them
here would be a second copy to keep correct, and this one would be the one that
went stale.

`/why-gryt` keeps the *why* and `/self-hosting` takes the *how*. Question 4
there used to cover embedded, Compose, Helm, LAN discovery and tunnels, which is
a deployment guide inside a trust page. It is a paragraph and a link now.

The navbar carries **Why Gryt? · Developers · Self-hosting · Docs** plus the two
buttons, and that is its limit. `Compared` moved to the sheet and the footer to
make room: it is a page you read once while weighing Gryt against something
else, and the two audience pages are where a whole kind of visitor should land.

## Drawings where a capture will go

`src/components/home/sketches.tsx`, and the `Frame` in it is the rounded box
they sit in.

They are **diagrams, not screenshots.** The standing rule below bans hand-built
fake window chrome and it still means it: an SVG pretending to be the emoji
importer would be a picture of a UI that already exists, drawn by somebody who
was not looking at it, and it would go stale the first time the real one moved.
Each of these carries the *shape* of what happens instead — a link goes in, a
list comes back, you tick some of it — which is the "diagram that carries the
information" the section rhythm already allows for.

They are also not placeholders in the "coming soon" sense. Each says something
true and stays useful beside a clip rather than being deleted when one arrives.

The vocabulary is in `sketches.module.css` and is deliberately small: two fills,
two strokes, an accent for the one thing a person sets, and no colour written
into the SVG. A themed site gets themed diagrams.

## The front page, as it stands

Twelve sections: `Hero`, `Identity`, `Bird`, `Emoji`, `Voice`, `Themes`, `Lan`,
`Addons`, `Motivation`, `SelfHost`, `Download`, `Sponsors`.

A place of your own; what it costs you to walk in, and what an account would
buy; the owl and any picture you would rather use; the four features,
alternating; who made it and why; how to put it somewhere that stays on; the
download; and then sponsoring, which is the one thing on the page that asks
rather than offers and is last for that reason.

Nine features were picked and four of them are facts about voice quality, so
`Voice` carries them as a fact strip rather than as four blocks down the page.
Grouping rather than cutting: everything picked is on the page and the page is
still readable in one sitting.

`Avatars` was its own section and is gone. Uploading a picture is the same
question `Bird` already asks — what your face is — and asking it twice made the
second one read as filler. `Bird` carries both halves now: the designer, then
"Or use a picture you already have" over a row of real owls and one dashed slot.

**`Bird`'s name field is the control the section is about**, so it is centred,
22px, and given its own room with a hint under it. It used to be a small
uppercase label and a box wedged between the heading and the designer's border,
where it read as a caption on the designer rather than as something to type in.

**The designer follows the name.** `OwlDesigner` grew a `followSeed` prop for
this page. Without it the designer opened on a saved look or on the default gold
bird and drew the same owl whatever anybody typed, which is the opposite of what
the heading claims. It follows the name until somebody picks a hat, at which
point the bird is theirs. The client leaves the prop off: there you open the
designer to design, and your last look is the right place to start.

**`Themes` shows one panel that restyles, not eighteen swatches.** A theme
changes the corner radius as well as the palette and a row of colour chips
cannot show that. `createGrytTheme(grytThemeToOptions(preset.theme, "dark"))`
gives the 233 custom properties the design system runs on, and the panel inside
is `Avatar`, `Chip` and `Button` out of `@gryt/ui` — the components the client
renders. It auto-advances, stops off screen, stops under reduced motion, and
stops for good once somebody uses an arrow. The name and the count under it are
read from the array, which is why they cannot drift: two comments elsewhere in
the repository still claim eleven and twelve presets.

**The navbar is edge-to-edge and always visible.** Wordmark on the
left, the four links and the two actions on the right, and the whole middle
empty.

68px tall, 60 under 900px, on a blurred `--bg` at 82% with a hairline under it,
**from the first pixel**. There is no scroll state and no scroll listener.

**The surface runs the viewport; the contents sit on `--max-w` and a 24px
gutter** — the same column every section uses, so the wordmark lands on the same
vertical as each section's eyebrow, and the download button on the same vertical
as the right edge of the content. Equal to the pixel at 375, 768, 1024, 1440,
1920, 2560 and 3840.

The contents were unbounded for an afternoon and then capped at 1800, on the
argument that a bar which ignores the column reads as chrome rather than as the
page's first section. The argument holds and it lost anyway: unbounded put the
wordmark and the CTA a desk apart on a 4K, and 1800 left the bar visibly out of
line with everything under it on every wide display.

Two shapes came before all of that: the most-copied nav on the web, and then a
floating pill that fixed the sameness and was transparent until 24px of scroll —
nearly invisible at the top of the page, which is the only place a first-time
visitor sees it. Nav archetype N9, picked from five candidates on 2026-08-28.

**One underline for the row, not one per link.** It parks under the page you
are on, travels to whatever you hover or tab to, and returns when you leave —
or away entirely on `/`, which is not in the bar, so there is nothing to return
to. `useTravellingUnderline` measures in the list's own coordinates; the list is
the positioned ancestor.

It is `Tabs.Indicator` from `@gryt/ui` doing the same job in a different row,
so it borrows that component's timing exactly: `--gryt-dur-spring` (500ms) and
`--ease-spring`, both already on `:root` from the library's stylesheet. The bar
and the app's tab strips move at one speed on one curve. `translate` and
`width`, which is what the library animates and neither of which is layout.

Appearing from nothing does not animate — with no previous position it would
slide in from the left edge of the list and read as a stray element. Whether it
may animate is tracked as state rather than armed a frame later with
`requestAnimationFrame`: rAF is throttled to nothing in a background tab, and
opening the page in a tab you are not looking at should not permanently disable
the motion.

A filled pill behind each link was the easier version and would have put six
filled shapes in a bar trying to be quiet. The accent is for rules and links.

**The download button grows into its label.** It renders "Download" until the
GitHub release call comes back, then "Download for macOS" — about seventy pixels
wider, in a row that is right-aligned, so everything to its left jumped with it.
The width is measured on commit and transitioned over 420ms.

`interpolate-size: allow-keywords` is the CSS answer to this and would delete
the measurement entirely. It is Chromium 129+ only — Firefox and Safari have not
shipped it (70% global, checked 2026-08-28) — and a button whose label reads
"Download for macOS" has a Safari share well above average, so the one-line
version would leave the jump exactly where it is most visible. Worth revisiting
when Safari ships it.

Nothing in the nav drives an animated value through JavaScript. Both the
underline and this width are written by React on commit and animated by CSS:
`requestAnimationFrame` and `ResizeObserver` are both delivered as part of the
rendering steps, so in a tab that is not being painted neither of them runs.
That was a real bug in the underline before it was a rule.

**The fold is mostly air.** `Hero` opens on 152px of padding — 84px of clear
space under the bar — and puts 108px between the buttons and the clip, because
the clip is the second thing on the page and should arrive as its own beat
rather than as the bottom of the first one.

**`Identity` is a `Showcase` now**, with a drawing of a password manager entry
beside it. "No account" sounds like "nothing to lose it with" until you learn
the identity is 24 BIP-39 words and the field you paste them into is a real
password field — at which point it is the same thing you already do with every
other login. That is worth a picture rather than a clause. The value in the
drawing is dots and not words: a page showing something that looks like a real
recovery phrase is a page teaching people to read one off a screen.

**`Sponsors` shows the empty slots.** The $100 tier promises a logo on this page
and the section said so only in the small print underneath, which meant somebody
reading it saw a paragraph asking for money rather than the space their logo
would occupy. Two dashed slots at exactly the height a real logo is given, and
they disappear once three logos are up.

## Deleted in the 2026-08-27 rebuild

`Edge.tsx`, `Security.tsx` and `Story.tsx`. Their facts were re-sourced from the
repository rather than carried forward: the voice material is in `Voice`, and the
maintainer's account is `Motivation`.

`Compare.tsx` moved to `src/pages/ComparePage.tsx` and became `/compare`. Two
comparison tables and six competitor cards should not be the longest thing on a
front page, and the content is good enough to deserve a page of its own.

`Proof.tsx` and `HandshakeDiagram.tsx` were built in this same pass and then
deleted in it. The handshake was four paragraphs, then a diagram, then gone —
`/why-gryt` and the docs cover it, and the front page does not need to.

`Cost.tsx` likewise. A band of figures about what a competitor charges did not
belong on a page about what Gryt is; `/compare` carries it.

## Deleted in the pass before that

`Philosophy.tsx`, `Architecture.tsx` and their CSS modules. Only `/why-gryt`
rendered them, bolted onto the end of its prose, and it no longer does.

`PrivacyPolicy.module.css` and `CommunityGuidelines.module.css` were
byte-identical, with `TermsOfUse` already importing the first. Both are gone;
the three pages share `src/styles/document.module.css`.
