import { useEffect, useState } from "react";

import {
  categorizeAssets,
  fetchLatestRelease,
  OS_NAMES,
  primaryOption,
  type DownloadOption,
  type OS,
} from "./releases";
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
 * The current release for the platform you are on.
 *
 * The navbar, `/download` and the download section all need the same three
 * facts — which platform, which file, which version — so the answer lives here
 * rather than being derived three times. Two callers disagreeing about which
 * file is the Windows installer does not fail, it hands somebody the wrong
 * binary.
 *
 * Everything degrades to a plain link, because a shared office or a CGNAT
 * range will hit GitHub's sixty calls an hour and the button has to keep
 * working when it does.
 */
export function useLatestDownload(): LatestDownload {
  /* Windows until detection lands, so the prerendered button and the hydrated
     one say the same thing. It is a label here rather than an action, so the
     one frame before the real answer costs nothing. */
  const os = useDetectedOS() ?? "windows";
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
