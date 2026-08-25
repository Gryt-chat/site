interface GrytLogoProps {
  size?: number;
  className?: string;
}

/*
 * The mark, at every size the site draws it: 44px on the invite and hand-off
 * pages, 32 and 28 in the navbar, 30 in the footer.
 *
 * /logo.svg is the round one. The square artboard is /logo-square.svg and has
 * one consumer left here — the OG card's background glyph, which drops the
 * ground and crops the bird itself.
 */
export function GrytLogo({ size = 72, className }: GrytLogoProps) {
  return (
    <img
      src="/logo.svg"
      alt="Gryt logo"
      width={size}
      height={size}
      className={className}
    />
  );
}
