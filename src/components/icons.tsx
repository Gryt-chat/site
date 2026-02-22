interface IconProps {
  size?: number;
  className?: string;
}

export function DownloadIcon({ size = 16 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="currentColor">
      <path d="M8 12l-4-4h2.5V2h3v6H12L8 12zm-6 2h12v1.5H2V14z" />
    </svg>
  );
}

export function MicIcon({ size = 18 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="var(--accent)">
      <path d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8h-2a5 5 0 01-10 0H3a7.001 7.001 0 006 6.93V17H6v2h8v-2h-3v-2.07z" />
    </svg>
  );
}

export function ChatIcon({ size = 18 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="var(--accent)">
      <path d="M2 5a2 2 0 012-2h7a2 2 0 012 2v4a2 2 0 01-2 2H9l-3 3v-3H4a2 2 0 01-2-2V5zm12 1h2a2 2 0 012 2v4a2 2 0 01-2 2h-2v3l-3-3h-1a1.98 1.98 0 01-1.414-.586l3-3A2 2 0 0013 9V6z" />
    </svg>
  );
}

export function VideoIcon({ size = 18 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="var(--accent)">
      <path d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" />
    </svg>
  );
}

export function MultiServerIcon({ size = 18 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="var(--accent)">
      <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zm0 6a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zm10 0a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
    </svg>
  );
}

export function GearIcon({ size = 18 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="var(--accent)">
      <path d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.062 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" />
    </svg>
  );
}

export function PluginIcon({ size = 18 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="var(--accent)">
      <path d="M9.504 1.132a1 1 0 01.992 0l1.75 1a1 1 0 11-.992 1.736L10 3.152l-1.254.716a1 1 0 11-.992-1.736l1.75-1zM5.618 4.504a1 1 0 01-.372 1.364L5.016 6l.23.132a1 1 0 11-.992 1.736L4 7.723V8a1 1 0 01-2 0V6a1 1 0 01.496-.868l1.75-1a1 1 0 011.372.372zm8.764 0a1 1 0 011.372-.372l1.75 1A1 1 0 0118 6v2a1 1 0 11-2 0v-.277l-.254.145a1 1 0 11-.992-1.736l.23-.132-.23-.132a1 1 0 01-.372-1.364zm-7.194 4.37a2 2 0 011.624 0l2 .9A2 2 0 0112 11.601V13a2 2 0 01-1.188 1.827l-2 .9a2 2 0 01-1.624 0l-2-.9A2 2 0 014 13v-1.399a2 2 0 011.188-1.827l2-.9z" />
    </svg>
  );
}

export function LockIcon({ size = 20 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="var(--accent)">
      <path d="M10 1a5 5 0 00-5 5v2H4a2 2 0 00-2 2v6a2 2 0 002 2h12a2 2 0 002-2v-6a2 2 0 00-2-2h-1V6a5 5 0 00-5-5zm-3 5a3 3 0 116 0v2H7V6zm3 7a1.5 1.5 0 110 3 1.5 1.5 0 010-3z" />
    </svg>
  );
}

export function OpenSourceIcon({ size = 20 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="var(--accent)">
      <path d="M10 2a1 1 0 011 1v1.323l3.954 1.582a1 1 0 01.589.755l.457 2.735 2.32 1.391a1 1 0 01.37 1.328l-1.2 2.1a1 1 0 01-1.1.5l-2.65-.663-2.37 1.42a1 1 0 01-1.04 0l-2.37-1.42-2.65.663a1 1 0 01-1.1-.5l-1.2-2.1a1 1 0 01.37-1.328l2.32-1.391.457-2.735a1 1 0 01.589-.755L9 4.323V3a1 1 0 011-1z" />
    </svg>
  );
}

export function ServerIcon({ size = 20 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="var(--accent)">
      <path d="M2 5a2 2 0 012-2h12a2 2 0 012 2v3a2 2 0 01-2 2H4a2 2 0 01-2-2V5zm14 1a1 1 0 11-2 0 1 1 0 012 0zM2 13a2 2 0 012-2h12a2 2 0 012 2v2a2 2 0 01-2 2H4a2 2 0 01-2-2v-2zm14 1a1 1 0 11-2 0 1 1 0 012 0z" />
    </svg>
  );
}

export function ServerRackIcon({ size = 16 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="currentColor">
      <path d="M2 5a2 2 0 012-2h12a2 2 0 012 2v3a2 2 0 01-2 2H4a2 2 0 01-2-2V5zm14 1a1 1 0 11-2 0 1 1 0 012 0zM2 13a2 2 0 012-2h12a2 2 0 012 2v2a2 2 0 01-2 2H4a2 2 0 01-2-2v-2zm14 1a1 1 0 11-2 0 1 1 0 012 0z" />
    </svg>
  );
}
