import { useEffect, useMemo, useState } from "react";

import {
  categorizeAssets,
  fetchLatestRelease,
  filesFor,
  isDesktop,
  PACKAGE_MANAGERS,
  primaryOption,
  STORES,
  type DesktopOS,
  type DownloadOption,
  type OS,
  type Release,
  type Store,
} from "../../lib/releases";
import { useDetectedArch } from "../../lib/useDetectedArch";
import { useDetectedOS } from "../../lib/useDetectedOS";

/* Shared by the three draft layouts on ?variant=a|b|c. Only one of them survives. */

export const LATEST_URL = "https://github.com/Gryt-chat/gryt/releases/latest";
export const WEB_APP_URL = "https://app.gryt.chat";

/** One format, both builds. Either can be missing from a release. */
export interface Format {
  label: string;
  description: string;
  slim?: DownloadOption;
  full?: DownloadOption;
}

export function formatsFor(options: DownloadOption[], os: DesktopOS): Format[] {
  return filesFor(options, os, false).map((pick) => {
    const pair = options.filter((o) => o.label === pick.label);
    return {
      label: pick.label,
      description: pick.description,
      slim: pair.find((o) => !o.withServer),
      full: pair.find((o) => o.withServer),
    };
  });
}

/** Portable and the Flatpak bundle are the two that don't; their descriptions say so. */
export const updatesItself = (f: Format) => !/(does not|doesn.t) update itself/i.test(f.description);

/** "Get it on Flathub" is the badge's alt text; the store's name is the end of it. */
export function storeName(store: Store): string {
  return store.badge.alt.replace(/^(Download on the|Download from the|Get it from the|Get it on)\s+/, "");
}

export const openStores = (os: OS) => STORES.filter((s) => s.os === os && s.url);
export const openCommands = (os: OS) => PACKAGE_MANAGERS.filter((p) => p.os === os && p.command);

/** Everything not out yet, by name, for the one line that mentions it. */
export function notYet(): string[] {
  const stores = STORES.filter((s) => !s.url).map(storeName);
  const managers = PACKAGE_MANAGERS.filter((p) => !p.command).map((p) => p.label.split(" · ")[0]);
  return [...new Set([...stores, ...managers])];
}

export function listJoin(items: string[]): string {
  if (items.length < 2) return items.join("");
  return `${items.slice(0, -1).join(", ")} and ${items[items.length - 1]}`;
}

export function useDownloadData() {
  const [release, setRelease] = useState<Release | null>(null);
  const [error, setError] = useState(false);
  const detected = useDetectedOS();
  const arch = useDetectedArch();

  useEffect(() => {
    fetchLatestRelease()
      .then(setRelease)
      .catch(() => setError(true));
  }, []);

  const grouped = useMemo(() => (release ? categorizeAssets(release.assets) : null), [release]);
  const version = release?.tag_name.replace(/^v/, "");
  const phone = detected !== null && !isDesktop(detected);

  /** The format this visitor should get, with its server twin. */
  const primaryFor = (os: DesktopOS): Format | null => {
    if (!grouped) return null;
    const pick = primaryOption(grouped[os], os, os === "macos" ? arch : null);
    if (!pick) return null;
    return formatsFor(grouped[os], os).find((f) => f.label === pick.label) ?? null;
  };

  return { release, error, grouped, version, detected, arch, phone, primaryFor };
}
