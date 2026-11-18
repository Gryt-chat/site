import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";

import { Download } from "../components/Download";
import { parseOS } from "../lib/releases";
import { pageTitle } from "../lib/title";

/** Every build in one picker. Nothing starts until you press one; `?os=` only picks the tab. */
export function DownloadPage() {
  const [params] = useSearchParams();
  useEffect(() => {
    document.title = pageTitle("Download");
  }, []);

  return (
    <main style={{ paddingTop: 68 }}>
      <Download initial={parseOS(params.get("os"))} />
    </main>
  );
}
