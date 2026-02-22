interface GrytLogoProps {
  size?: number;
  className?: string;
}

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
