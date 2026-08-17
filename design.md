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
`68px 16px` under 820px. Story breaks at 800px and Edge sets its own padding;
both predate this file and neither is worth chasing.

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
| `/sponsors` | Index-First | the page is a list of people |
| `/privacy`, `/terms`, `/community-guidelines` | Long Document | they are documents |
| `/invite` | none, component-scope | an app screen with states, not a page |

`/changelog` is worth a note: Narrative Workflow needs a real sequence, and
there is currently one release in `content/changelog`. A timeline with one dot
is thin. It was kept deliberately, because it comes good as releases land.

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

## Deleted in this pass

`Philosophy.tsx`, `Architecture.tsx` and their CSS modules. Only `/why-gryt`
rendered them, bolted onto the end of its prose, and it no longer does.

`PrivacyPolicy.module.css` and `CommunityGuidelines.module.css` were
byte-identical, with `TermsOfUse` already importing the first. Both are gone;
the three pages share `src/styles/document.module.css`.
