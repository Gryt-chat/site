import { useEffect, useState } from "react";

import {
  categorizeAssets,
  fetchLatestRelease,
  OS_NAMES,
  primaryOption,
  type DownloadOption,
  type OS,
} from "./releases";
import { useDetectedArch } from "./useDetectedArch";
import { useDetectedOS } from "./useDetectedOS";

export interface LatestDownload {
  os: OS;
  osName: string;
  /** Null until the fetch lands, and null forever if it fails or the platform has no build. */
  option: DownloadOption | null;
  /** The tag, without the leading v. Null until it lands. */
  version: string | null;
}

/**
 * The current release for the platform you are on. Three callers need the same three facts,
 * and everything degrades to a plain link when GitHub's sixty an hour runs out.
 */
export function useLatestDownload(): LatestDownload {
  /* Windows until detection lands, so the prerendered button and the hydrated one say the
     same thing. A label rather than an action, so the one frame costs nothing. */
  const os = useDetectedOS() ?? "windows";
  const arch = useDetectedArch();
  const [option, setOption] = useState<DownloadOption | null>(null);
  const [version, setVersion] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    fetchLatestRelease(controller.signal)
      .then((release) => {
        setVersion(release.tag_name.replace(/^v/, ""));
        setOption(primaryOption(categorizeAssets(release.assets)[os], os, arch));
      })
      .catch(() => {
        // Aborted, offline, or rate-limited. The caller falls back to a link to
        // the releases page, which is where this was pointing before anyway.
      });

    return () => controller.abort();
  }, [os, arch]);

  return { os, osName: OS_NAMES[os], option, version };
}
