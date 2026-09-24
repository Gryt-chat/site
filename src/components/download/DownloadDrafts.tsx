import { createGrytTheme, grytPresetsById, grytThemeToOptions } from "@gryt/theme";
import { lazy, Suspense, useMemo } from "react";
import { useSearchParams } from "react-router-dom";

import { usePageTheme } from "../home/usePageTheme";

/* Dev only: ?variant=a|b|c swaps in a draft, ?theme=light paints Gryt's light theme. */

const DRAFTS = {
  a: lazy(() => import("./DownloadA").then((m) => ({ default: m.DownloadA }))),
  b: lazy(() => import("./DownloadB").then((m) => ({ default: m.DownloadB }))),
  c: lazy(() => import("./DownloadC").then((m) => ({ default: m.DownloadC }))),
};

export function DownloadDrafts({ fallback }: { fallback: React.ReactNode }) {
  const [params] = useSearchParams();
  const variant = params.get("variant") as keyof typeof DRAFTS | null;
  const light = params.get("theme") === "light";

  const vars = useMemo(
    () => (light ? createGrytTheme(grytThemeToOptions(grytPresetsById.get("gryt")!.theme, "light")) : null),
    [light],
  );
  usePageTheme(vars);

  const Draft = variant ? DRAFTS[variant] : undefined;
  if (!Draft) return <>{fallback}</>;
  return (
    <Suspense fallback={fallback}>
      <Draft />
    </Suspense>
  );
}
