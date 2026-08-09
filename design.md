# Design — gryt.chat

The front page was rebuilt first and everything else has to catch up to it. This
file is the system that rebuild established, written down so the content pages
can be brought in line without re-deciding it per page.

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
| `--text-dimmer` | `#555` | disabled, timestamps |
| `--accent` | `#968FF8` | eyebrows, rules, focus |
| `--accent-light` | `#b4afff` | links |
| `--border` | `#2b303d` | every hairline |
| `--green` `--red` `--yellow` | `#4ade80` `#f87171` `#fbbf24` | status only, never decoration |

`--max-w` is `1100px`. Radii are `8 / 12 / 16`, and nothing is a pill except the
navbar and the hero badge.

## Typography

One family, two cuts. Atkinson Hyperlegible Next as a variable font at
`200–900`, Atkinson Hyperlegible Mono for anything that is a value rather than a
sentence. There is no second display face and there should not be one.

- Section heading: `clamp(28px, 4vw, 42px)`, weight `800`, letter-spacing `-1px`
- Sub-heading inside a section: `clamp(22px, 2.4vw, 30px)`, weight `800`,
  letter-spacing `-0.024em`
- Card or item heading: `17.5px`, weight `800`, letter-spacing `-0.014em`
- Body: `16px`, line-height `1.6`
- Eyebrow: `12px`, weight `700`, uppercase, letter-spacing `1.5px`, accent

Display sizes all carry negative tracking and `text-wrap: balance`. Body copy
does not.

## The section rhythm

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
`64px 16px` under 768px.

## Motion

From `src/components/home/motion.ts`. Content pages import the same module
rather than defining their own.

- `rise(reduced)` — `opacity 0 → 1`, `y 24 → 0`, `600ms`, `cubic-bezier(0.16, 1, 0.3, 1)`
- `stagger(reduced, gap = 0.07)` — parent for children that arrive in sequence
- `inView` — `once: true`, `margin: -80px`

Only `transform` and `opacity` animate. `prefers-reduced-motion` collapses every
spatial move to a `150ms` fade, and `src/index.css` additionally kills the
ambient keyframe washes that the motion components cannot reach.

## What the content pages must share

- The token set, verbatim. No page-local colours.
- The one type family and the scale above.
- The eyebrow / heading / sub rhythm for anything that is a section.
- The motion module, including `once: true`.
- Hairline rules as the default separator.

## What they may differ on

- Whether a section is a grid, a list, or running prose. The front page already
  varies this deliberately: `Edge` is rules and type with no cards precisely
  because `Compare` and the feature cards below it carry the card weight.
- Column counts and spans.
- Whether a page animates at all. A privacy policy that fades in section by
  section is worse than one that is simply there.

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

## Per-page state, and what this redesign changes

| Page | Now | After |
|---|---|---|
| `/why-gryt` | prose, then the old `Philosophy` and `Architecture` card grids bolted on the end | one page in the front-page rhythm; the two old components stop being rendered here |
| `/blog` | card index, pre-rebuild | index in the system's rhythm |
| `/blog/:slug` | prose page, pre-rebuild | same, with the system's type scale |
| `/changelog` | list, pre-rebuild | list in the system's rhythm |
| `/changelog/:version` | entry page, pre-rebuild | same |
| `/privacy`, `/terms`, `/community-guidelines` | long documents, pre-rebuild | shared document treatment, typography only, no motion |
| `/invite` | pre-rebuild | brought in line |

`Philosophy.tsx` and `Architecture.tsx` are only rendered by `/why-gryt`. This
redesign stops rendering them there. **It does not delete them** — that is a
separate call, and a deletion needs to be asked for rather than assumed.
