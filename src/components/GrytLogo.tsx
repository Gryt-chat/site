interface GrytLogoProps {
  size?: number;
  className?: string;
}

/*
 * The round mark, at every size the site draws it: 44px on the invite and
 * hand-off pages, 32 and 28 in the navbar, 30 in the footer.
 *
 * /logo.svg is the square artboard, and it is the right one for the app icon
 * and for a README — a launcher applies its own mask and a README wants the
 * full frame. On a page it is a small dark square sitting beside a wordmark,
 * which reads as a broken image rather than as a logo. The OG cards still take
 * the square one; they crop it themselves.
 */
export function GrytLogo({ size = 72, className }: GrytLogoProps) {
  return (
    <img
      src="/logo-round.svg"
      alt="Gryt logo"
      width={size}
      height={size}
      className={className}
    />
  );
}
