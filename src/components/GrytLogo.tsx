interface GrytLogoProps {
  size?: number;
  className?: string;
}

/*
 * The mark, at every size the site draws it. /logo.svg is the round one; the square artboard
 * has one consumer left, the OG card's background glyph.
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
