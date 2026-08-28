import { useEffect, useState } from "react";

import {
  categorizeAssets,
  detectOS,
  fetchLatestRelease,
  OS_NAMES,
  primaryOption,
  type DownloadOption,
  type OS,
} from "./releases";

export interface LatestDownload {
  os: OS;
  osName: string;
  /** Null until the fetch lands, and null forever if it fails or the platform has no build. */
  option: DownloadOption | null;
  /** The tag, without the leading v. Null until it lands. */
  version: string | null;
}

/**
 * The current release for the platform you are on.
 *
 * The navbar needs the same three facts `/download` and the download section
 * already work out — which platform, which file, which version — so the answer
 * lives here rather than being derived a third time. Two callers disagreeing
 * about which file is the Windows installer is the kind of drift that does not
 * fail, it just hands somebody the wrong binary.
 *
 * Everything degrades to a plain link. GitHub rate-limits unauthenticated calls
 * to sixty an hour per address, so a shared office or a CGNAT range will hit it,
 * and the button has to keep working when it does.
 */
export function useLatestDownload(): LatestDownload {
  const [os] = useState<OS>(() => detectOS());
  const [option, setOption] = useState<DownloadOption | null>(null);
  const [version, setVersion] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    fetchLatestRelease(controller.signal)
      .then((release) => {
        setVersion(release.tag_name.replace(/^v/, ""));
        setOption(primaryOption(categorizeAssets(release.assets)[os], os));
      })
      .catch(() => {
        // Aborted, offline, or rate-limited. The caller falls back to a link to
        // the releases page, which is where this was pointing before anyway.
      });

    return () => controller.abort();
  }, [os]);

  return { os, osName: OS_NAMES[os], option, version };
}
