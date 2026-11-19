import { useEffect, type ReactNode } from "react";
import { Button } from "@gryt/ui";
import { PageHeader } from "../components/PageHeader";
import { pageTitle } from "../lib/title";
import styles from "./PressPage.module.css";

const REPO = "https://github.com/Gryt-chat/gryt-assets";
const ZIP = `${REPO}/archive/refs/heads/main.zip`;
const F = "/press";

type Ground = "night" | "indigo" | "paper" | "accent";

interface Logo {
  name: string;
  file: string;
  ground: Ground;
  alt: string;
  note?: string;
  hex?: string;
  wide?: boolean;
  round?: boolean;
}

const NAMES: Logo[] = [
  { name: "Gryt, for dark backgrounds", file: "Logo/Name/gryt-on-dark", ground: "night", alt: "Gryt in light grey", wide: true },
  { name: "Gryt, violet", file: "Logo/Name/gryt-violet", ground: "indigo", alt: "Gryt in violet", wide: true },
  { name: "Gryt, for light backgrounds", file: "Logo/Name/gryt-on-light", ground: "paper", alt: "Gryt in dark ink", wide: true },
  { name: "Owl and name, dark", file: "Logo/Lockup/horizontal-on-dark", ground: "night", alt: "The owl beside the name Gryt", wide: true },
  { name: "Owl and name, light", file: "Logo/Lockup/horizontal-on-light", ground: "paper", alt: "The owl beside the name Gryt, on light", wide: true },
  { name: "Owl over name", file: "Logo/Lockup/stacked-on-dark", ground: "indigo", alt: "The owl above the name Gryt" },
];

const OWLS: Logo[] = [
  { name: "Square", note: "Full bleed. App stores, Android, Windows.", file: "Logo/Owl/square", ground: "night", alt: "The owl on an indigo square" },
  { name: "Circle", note: "Avatars on GitHub, Discord and the like.", file: "Logo/Owl/circle", ground: "night", alt: "The owl in an indigo circle", round: true },
  { name: "No tile", note: "For a background colour of your own.", file: "Logo/Owl/transparent", ground: "paper", alt: "The owl with no background" },
  { name: "Apple", note: "macOS shape and shadow. iOS takes the square.", file: "Logo/Apple/macos", ground: "night", alt: "The macOS app icon" },
];

const MARKS: Logo[] = [
  { name: "Violet", hex: "#A495E3", file: "Logo/Mark/violet", ground: "night", alt: "The owl in violet" },
  { name: "White", hex: "#FFFFFF", file: "Logo/Mark/white", ground: "indigo", alt: "The owl in white" },
  { name: "Indigo", hex: "#2E2D5F", file: "Logo/Mark/ink", ground: "paper", alt: "The owl in indigo" },
  { name: "Night", hex: "#111318", file: "Logo/Mark/night", ground: "accent", alt: "The owl in near black" },
];

const BANNERS = [
  { name: "GitHub README", size: "2560×640", file: "Banners/github-readme.png", preview: "github-readme", alt: "README banner with the owl and the name" },
  { name: "GitHub social preview", size: "1280×640", file: "Banners/github-social.png", preview: "github-social", alt: "Voice, text and video chat you host yourself, beside the owl" },
  { name: "Profile header", size: "1500×500", file: "Banners/profile-header.png", preview: "profile-header", alt: "Violet header with the name Gryt" },
  { name: "Share image", size: "1200×630", file: "OG/default.png", preview: "og-default", alt: "Violet share image with the headline" },
];

const WALLS = [
  { name: "Night", size: "5120×2880", file: "Wallpapers/Desktop/night.png", preview: "night", alt: "Dark wallpaper with a faint owl" },
  { name: "Owlery", size: "5120×2880", file: "Wallpapers/Desktop/owlery.png", preview: "owlery", alt: "Wallpaper full of owl avatars" },
  { name: "Indigo", size: "5120×2880", file: "Wallpapers/Desktop/indigo.png", preview: "indigo", alt: "Indigo wallpaper with the owl" },
  { name: "Night, phone", size: "1290×2796", file: "Wallpapers/Phone/night.png", preview: "night-phone", alt: "Dark phone wallpaper", phone: true },
  { name: "Owlery, phone", size: "1290×2796", file: "Wallpapers/Phone/owlery.png", preview: "owlery-phone", alt: "Phone wallpaper full of owls", phone: true },
];

const COLOURS = [
  { name: "Indigo", hex: "#2E2D5F" },
  { name: "Feathers", hex: "#A495E3" },
  { name: "Face", hex: "#B5A8E6" },
  { name: "Wings", hex: "#7C6EC3" },
  { name: "Night", hex: "#111318" },
  { name: "Accent", hex: "#968FF8" },
];

function Downloads({ file }: { file: string }) {
  return (
    <span className={styles.downloads}>
      <a href={`${F}/${file}.svg`} download>SVG</a>
      <a href={`${F}/${file}.png`} download>PNG</a>
    </span>
  );
}

function LogoTile({ logo, frame }: { logo: Logo; frame: string }) {
  return (
    <figure className={styles.item}>
      <div className={`${styles.well} ${frame}`} data-ground={logo.ground}>
        <img
          className={logo.wide ? styles.wideArt : logo.round ? styles.roundArt : styles.art}
          src={`${F}/${logo.file}.svg`}
          alt={logo.alt}
          loading="lazy"
        />
      </div>
      <figcaption className={styles.caption}>
        <span className={styles.row}>
          <span className={styles.name}>
            {logo.name}
            {logo.hex && <span className={styles.meta}> {logo.hex}</span>}
          </span>
          <Downloads file={logo.file} />
        </span>
        {logo.note && <span className={styles.note}>{logo.note}</span>}
      </figcaption>
    </figure>
  );
}

function Section({ title, lede, children }: { title: string; lede?: string; children: ReactNode }) {
  return (
    <section className={styles.section}>
      <div className={styles.head}>
        <h2 className={styles.heading}>{title}</h2>
        {lede && <p className={styles.lede}>{lede}</p>}
      </div>
      {children}
    </section>
  );
}

/** The press kit: every file in gryt-assets, shown and downloadable. */
export function PressPage() {
  useEffect(() => {
    document.title = pageTitle("Press");
  }, []);

  return (
    <main className={styles.page}>
      <PageHeader
        eyebrow="Press"
        title="Gryt's name, owl and pictures"
        lede={
          <>
            Logos, banners and wallpapers for anyone writing about Gryt or putting it on a page. Use them however
            you like, as long as you say where they came from. They&rsquo;re under{" "}
            <a href="https://creativecommons.org/licenses/by/4.0/" target="_blank" rel="noreferrer">CC BY 4.0</a>.
          </>
        }
      />
      <div className={styles.actions}>
        <Button render={<a href={ZIP} />} size="large">Download everything (.zip)</Button>
        <Button render={<a href={REPO} target="_blank" rel="noreferrer" />} size="large" tone="neutral">Files on GitHub</Button>
      </div>

      <Section title="The name" lede="It's just Gryt. One word, capital G, and no .chat after it.">
        <div className={styles.gridWide}>
          {NAMES.map((l) => <LogoTile key={l.file} logo={l} frame={styles.landscape} />)}
        </div>
      </Section>

      <Section
        title="The owl"
        lede="The square is for places that cut their own shape, like app stores and Android. The circle is for avatars. On a photo or a colour of your own, use the owl without a tile."
      >
        <div className={styles.grid}>
          {OWLS.map((l) => <LogoTile key={l.file} logo={l} frame={styles.square} />)}
        </div>
      </Section>

      <Section title="In one colour" lede="For favicons, small sizes, and anywhere the full-colour owl turns to mush.">
        <div className={styles.grid}>
          {MARKS.map((l) => <LogoTile key={l.file} logo={l} frame={styles.landscape} />)}
        </div>
      </Section>

      <Section title="Banners and share images" lede="Sized for where they go, so nothing gets cropped.">
        <div className={styles.gridBanners}>
          {BANNERS.map((b) => (
            <figure className={styles.item} key={b.file}>
              <img className={styles.picture} src={`${F}/previews/${b.preview}.webp`} alt={b.alt} loading="lazy" />
              <figcaption className={styles.row}>
                <span className={styles.name}>{b.name} <span className={styles.meta}>{b.size}</span></span>
                <span className={styles.downloads}><a href={`${F}/${b.file}`} download>PNG</a></span>
              </figcaption>
            </figure>
          ))}
        </div>
      </Section>

      <Section
        title="Wallpapers"
        lede="5K for desktops, and a tall size for phones. The Owlery ones are real avatars, drawn the same way Gryt draws yours."
      >
        <div className={styles.walls}>
          {WALLS.map((w) => (
            <figure className={`${styles.item} ${w.phone ? styles.phone : styles.desktop}`} key={w.file}>
              <img className={styles.picture} src={`${F}/previews/${w.preview}.webp`} alt={w.alt} loading="lazy" />
              <figcaption className={styles.row}>
                <span className={styles.name}>{w.name}</span>
                <span className={styles.downloads}><a href={`${F}/${w.file}`} download>{w.size}</a></span>
              </figcaption>
            </figure>
          ))}
        </div>
      </Section>

      <section className={`${styles.section} ${styles.split}`}>
        <div className={styles.head}>
          <h2 className={styles.heading}>Colours</h2>
          <dl className={styles.colours}>
            {COLOURS.map((c) => (
              <div className={styles.colour} key={c.name}>
                <span className={styles.swatch} style={{ background: c.hex }} aria-hidden="true" />
                <dt>{c.name}</dt>
                <dd className={styles.meta}>{c.hex}</dd>
              </div>
            ))}
          </dl>
        </div>
        <div className={styles.head}>
          <h2 className={styles.heading}>Type</h2>
          <p className={styles.typeSample}>Atkinson Hyperlegible Next</p>
          <p className={styles.monoSample}>Atkinson Hyperlegible Mono</p>
          <p className={styles.lede}>
            Gryt uses one family. The mono cut is for values, like addresses and version numbers. Both are free
            from the{" "}
            <a href="https://www.brailleinstitute.org/freefont/" target="_blank" rel="noreferrer">Braille Institute</a>.
          </p>
        </div>
      </section>

      <Section title="Please don't">
        <ul className={styles.donts}>
          <li>Redraw the owl or change its colours.</li>
          <li>Stretch it, squash it or tilt it.</li>
          <li>Put the bare owl on a busy photo. Use the square or the circle there.</li>
          <li>Write it as GRYT or Gryt.chat. It&rsquo;s Gryt.</li>
        </ul>
        <p className={styles.lede}>
          Writing about Gryt, or need something that isn&rsquo;t here? Email{" "}
          <a href="mailto:press@gryt.chat">press@gryt.chat</a>.
        </p>
      </Section>
    </main>
  );
}
