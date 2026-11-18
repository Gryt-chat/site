#!/usr/bin/env python3
"""Writes the blog cover SVGs; the palette is measured off the older art-*.webp.
Export with sharp: .webp({ quality: 90, alphaQuality: 100, effort: 6 }), into public/blog/."""
import os, random

OUT = os.path.dirname(os.path.abspath(__file__))
os.makedirs(OUT, exist_ok=True)

STYLE = """<style>
  .tile{fill:#232834;stroke:#333949;stroke-width:6;vector-effect:non-scaling-stroke}
  .tile-accent{fill:#232834;stroke:#978FF8;stroke-width:6;vector-effect:non-scaling-stroke}
  .deep{fill:#15161C}
  .bar{fill:#333949}
  .muted{fill:#565A6B}
  .accent{fill:#978FF8}
  .accent-deep{fill:#6157D8}
  .line{fill:none;stroke:#333949;stroke-width:6;stroke-linecap:round;vector-effect:non-scaling-stroke}
  .line-muted{fill:none;stroke:#565A6B;stroke-width:6;stroke-linecap:round;stroke-linejoin:round;vector-effect:non-scaling-stroke}
  .line-accent{fill:none;stroke:#978FF8;stroke-width:8;stroke-linecap:round;stroke-linejoin:round}
  .dash{stroke-dasharray:2 18}
</style>"""


def svg(name, body, cx=800, cy=448, scale=1.0):
    # Scale the drawing to fill the canvas like the older covers; 6px outlines stay 6px.
    body = body.replace('stroke-width="6"', 'stroke-width="6" vector-effect="non-scaling-stroke"')
    body = (f'<g transform="translate(800 448) scale({scale}) translate({-cx} {-cy})">\n'
            f'{body}\n</g>')
    doc = (f'<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="896" '
           f'viewBox="0 0 1600 896">\n{STYLE}\n{body}\n</svg>\n')
    with open(os.path.join(OUT, name + ".svg"), "w") as f:
        f.write(doc)


def phone(x, y, w=200, h=380, screen=""):
    return (f'<rect class="tile" x="{x}" y="{y}" width="{w}" height="{h}" rx="36"/>'
            f'<rect class="bar" x="{x + w/2 - 30}" y="{y + h - 30}" width="60" height="8" rx="4"/>'
            + screen)


def envelope(cx, cy, w=128, h=88):
    x, y = cx - w / 2, cy - h / 2
    return (f'<rect class="tile" x="{x}" y="{y}" width="{w}" height="{h}" rx="14"/>'
            f'<path class="line-muted" d="M{x + 14} {y + 14} L{cx} {cy + 8} L{x + w - 14} {y + 14}"/>'
            f'<circle class="accent" cx="{cx}" cy="{cy + 8}" r="15"/>')


# Direct messages over MLS: two devices, sealed messages crossing a server that
# only relays them, and a row of keys where the old ones have been retired.
def mls():
    b = []
    b.append('<path class="line dash" d="M420 400 H1180"/>')
    # server
    b.append('<rect class="tile" x="690" y="250" width="220" height="300" rx="24"/>')
    for i, yy in enumerate((282, 368, 454)):
        b.append(f'<rect class="bar" x="716" y="{yy}" width="168" height="64" rx="12"/>')
        b.append(f'<circle class="muted" cx="744" cy="{yy + 32}" r="8"/>')
        b.append(f'<rect class="muted" x="766" y="{yy + 27}" width="{72 - i * 14}" height="10" rx="5"/>')
    # devices
    left = phone(220, 210, screen=(
        '<rect class="bar" x="248" y="258" width="120" height="30" rx="15"/>'
        '<rect class="bar" x="248" y="306" width="90" height="30" rx="15"/>'
        '<rect class="accent" x="302" y="370" width="94" height="30" rx="15"/>'))
    right = phone(1180, 210, screen=(
        '<rect class="bar" x="1208" y="258" width="104" height="30" rx="15"/>'
        '<rect class="bar" x="1208" y="370" width="120" height="30" rx="15"/>'
        '<rect class="accent" x="1262" y="306" width="94" height="30" rx="15"/>'))
    b += [left, right]
    b.append(envelope(555, 400))
    b.append(envelope(1045, 400))
    # keys: retired ones are outlines, the current one is filled
    kx = 560
    for i in range(6):
        cls = "accent" if i == 5 else None
        x = kx + i * 84
        if cls:
            b.append(f'<rect class="accent" x="{x}" y="660" width="60" height="24" rx="12"/>')
        else:
            b.append(f'<rect x="{x + 3}" y="663" width="54" height="18" rx="9" '
                     f'fill="none" stroke="#333949" stroke-width="6"/>')
    return "\n".join(b)


# Dropped calls and a 3 fps webcam: a camera tile, a strip of frames where most
# never arrived, and a signal that stalls flat before it comes back.
def calls():
    b = ['<g transform="translate(0 45)">']
    b.append('<rect class="tile" x="200" y="200" width="560" height="316" rx="28"/>')
    # camera glyph
    b.append('<rect class="muted" x="400" y="316" width="120" height="84" rx="16"/>')
    b.append('<path class="muted" d="M532 342 L572 318 V398 L532 374 Z" stroke="#565A6B" '
             'stroke-width="6" stroke-linejoin="round"/>')
    # frame strip: 12 slots, 3 delivered
    for i in range(12):
        x = 200 + i * 47
        if i in (0, 5, 10):
            b.append(f'<rect class="accent" x="{x}" y="560" width="34" height="46" rx="8"/>')
        else:
            b.append(f'<rect x="{x + 3}" y="563" width="28" height="40" rx="6" '
                     f'fill="none" stroke="#333949" stroke-width="6"/>')
    # signal: a wave, a flat stall, then the wave again
    import math
    def wave(x0, x1, amp, y0=358, period=100):
        pts = []
        for i in range(0, int(x1 - x0) + 1, 4):
            pts.append(f"{x0 + i:.0f} {y0 - amp * math.sin(2 * math.pi * i / period):.1f}")
        return "M" + " L".join(pts)
    b.append(f'<path class="line-accent" d="{wave(830, 1030, 60)}"/>')
    b.append('<path class="line-muted dash" d="M1062 358 H1210"/>')
    b.append(f'<path class="line-muted" d="{wave(1240, 1400, 60)}"/>')
    b.append('</g>')
    return "\n".join(b)


SHIELD = ("M800 236 L960 292 V446 C960 566 890 634 800 670 "
          "C710 634 640 566 640 446 V292 Z")


# Server 1.10.15: a message went to every open connection. A shield between a
# message and four connections, with only the two that joined receiving it.
def sec15():
    b = []
    b.append('<rect class="tile" x="230" y="378" width="200" height="120" rx="24"/>')
    b.append('<rect class="bar" x="262" y="414" width="136" height="16" rx="8"/>')
    b.append('<rect class="bar" x="262" y="446" width="92" height="16" rx="8"/>')
    b.append('<path class="line" d="M436 438 H630"/>')
    b.append(f'<path class="tile" d="{SHIELD}"/>')
    b.append('<path d="M736 456 L786 506 L870 410" fill="none" stroke="#978FF8" '
             'stroke-width="20" stroke-linecap="round" stroke-linejoin="round"/>')
    ys = (254, 382, 510, 638)
    for i, y in enumerate(ys):
        joined = i in (1, 2)
        if joined:
            b.append(f'<path class="line-accent" d="M970 438 C1060 438 1080 {y} 1176 {y}"/>')
            b.append(f'<circle cx="1224" cy="{y}" r="44" fill="#232834" stroke="#978FF8" stroke-width="8"/>')
        else:
            b.append(f'<circle class="tile" cx="1224" cy="{y}" r="44"/>')
    return "\n".join(b)


# Server 1.10.19: permissions per channel and per folder. A channel list, with a
# padlock on the one row somebody was kept out of.
def sec19():
    b = ['<g transform="translate(-36 0)">']
    b.append('<rect class="tile" x="420" y="200" width="600" height="496" rx="28"/>')
    rows = [(252, "folder"), (340, "ch"), (424, "ch"), (508, "locked"), (592, "ch")]
    for y, kind in rows:
        if kind == "folder":
            b.append(f'<path class="muted" d="M460 {y - 16} h34 l10 10 h26 v38 h-70 Z"/>')
            b.append(f'<rect class="muted" x="552" y="{y - 8}" width="200" height="18" rx="9"/>')
        else:
            x0 = 500
            glyph = "accent" if kind == "locked" else "bar"
            b.append(f'<rect class="{glyph}" x="{x0}" y="{y - 14}" width="30" height="30" rx="8"/>')
            w = {"ch": 240, "locked": 300}[kind]
            if y == 424:
                w = 190
            b.append(f'<rect class="bar" x="{x0 + 52}" y="{y - 8}" width="{w}" height="18" rx="9"/>')
    # highlight the locked row
    b.append('<rect x="476" y="472" width="520" height="72" rx="16" fill="none" '
             'stroke="#978FF8" stroke-width="6"/>')
    # padlock off the right edge of the panel, level with the row
    b.append('<path d="M1106 470 V420 A58 58 0 0 1 1222 420 V470" fill="none" '
             'stroke="#978FF8" stroke-width="18" stroke-linecap="round"/>')
    b.append('<rect class="tile" x="1072" y="462" width="184" height="150" rx="26"/>')
    b.append('<circle class="accent" cx="1164" cy="524" r="18"/>')
    b.append('<rect class="accent" x="1156" y="530" width="16" height="44" rx="8"/>')
    b.append('</g>')
    return "\n".join(b)


# Link a device: a QR code between a phone and a laptop, and the same four
# symbols on both screens.
def symbols(cx, cy, s=1.0):
    # Four shapes standing in for the four emoji both screens show.
    g, r = 46 * s, 14 * s
    xs = [cx - 1.5 * g, cx - 0.5 * g, cx + 0.5 * g, cx + 1.5 * g]
    return "".join([
        f'<circle class="accent" cx="{xs[0]}" cy="{cy}" r="{r}"/>',
        f'<path class="accent" d="M{xs[1]} {cy - r * 1.1} L{xs[1] + r * 1.15} {cy + r * 0.95} '
        f'L{xs[1] - r * 1.15} {cy + r * 0.95} Z"/>',
        f'<rect class="accent" x="{xs[2] - r}" y="{cy - r}" width="{2 * r}" height="{2 * r}" rx="{5 * s}"/>',
        f'<path class="accent" d="M{xs[3]} {cy - r * 1.25} L{xs[3] + r * 1.25} {cy} '
        f'L{xs[3]} {cy + r * 1.25} L{xs[3] - r * 1.25} {cy} Z"/>',
    ])


def link():
    b = []
    b.append('<path class="line dash" d="M436 448 H660"/>')
    b.append('<path class="line dash" d="M940 448 H1014"/>')
    b.append(phone(236, 258, screen=symbols(336, 448, 0.9)))
    # laptop
    b.append('<rect class="tile" x="1020" y="290" width="360" height="236" rx="22"/>')
    b.append('<rect class="bar" x="984" y="534" width="432" height="22" rx="11"/>')
    b.append(symbols(1200, 408, 1.0))
    # QR
    b.append('<rect class="tile" x="660" y="308" width="280" height="280" rx="26"/>')
    n, cell, x0, y0 = 21, 10, 695, 343
    random.seed(1596)
    finders = [(0, 0), (0, 14), (14, 0)]

    def in_finder(i, j):
        return any(fi - 1 <= i <= fi + 7 and fj - 1 <= j <= fj + 7 for fi, fj in finders)

    for i in range(n):
        for j in range(n):
            if in_finder(i, j):
                continue
            if random.random() < 0.46:
                b.append(f'<rect class="muted" x="{x0 + j * cell}" y="{y0 + i * cell}" '
                         f'width="{cell}" height="{cell}"/>')
    for fi, fj in finders:
        fx, fy = x0 + fj * cell, y0 + fi * cell
        b.append(f'<rect x="{fx + 5}" y="{fy + 5}" width="60" height="60" rx="10" fill="none" '
                 f'stroke="#565A6B" stroke-width="10"/>')
        b.append(f'<rect class="muted" x="{fx + 20}" y="{fy + 20}" width="30" height="30" rx="5"/>')
    return "\n".join(b)


svg("art-mls-dms", mls(), 800, 447, 1.15)
svg("art-dropped-calls", calls(), 800, 448, 1.11)
svg("art-security-1-10-15", sec15(), 749, 446, 1.27)
svg("art-security-1-10-19", sec19(), 802, 448, 1.27)
svg("art-link-a-device", link(), 826, 448, 1.13)
print("wrote", sorted(f for f in os.listdir(OUT) if f.endswith(".svg")))
