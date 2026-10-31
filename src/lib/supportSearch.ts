/** One hit from the docs search endpoint. */
export interface DocsHit {
  type: "page" | "heading" | "text";
  content: string;
  url: string;
}

export interface SupportResult {
  name: string;
  detail: string;
  href: string;
}

const DOCS_ORIGIN = "https://docs.gryt.chat";
const MAX_RESULTS = 8;

export const DOCS_SEARCH_URL = `${DOCS_ORIGIN}/api/search`;

function sectionName(url: string): string {
  const [path, hash] = url.split("#");
  const slug = hash || path.split("/").pop() || "Docs";
  const words = slug.replace(/-/g, " ");
  return words.charAt(0).toUpperCase() + words.slice(1);
}

function plainText(content: string): string {
  return content.replace(/[`*_]/g, "").replace(/\s+/g, " ").trim();
}

/** Help for people using or hosting Gryt first. The API reference answers a different question. */
export function toSupportResults(hits: DocsHit[]): SupportResult[] {
  const seen = new Set<string>();
  const unique = hits.filter((hit) => {
    if (seen.has(hit.url) || hit.url.startsWith("/docs/build")) return false;
    seen.add(hit.url);
    return true;
  });

  const rank = (hit: DocsHit) => (hit.url.startsWith("/docs/use") ? 0 : 1);
  return unique
    .map((hit, index) => ({ hit, index }))
    .sort((a, b) => rank(a.hit) - rank(b.hit) || a.index - b.index)
    .slice(0, MAX_RESULTS)
    .map(({ hit }) => {
      const name = sectionName(hit.url);
      const text = plainText(hit.content);
      return {
        name,
        // A heading hit's text is the section name again, so say which page it's on.
        detail: text === name ? sectionName(hit.url.split("#")[0]) : text,
        href: `${DOCS_ORIGIN}${hit.url}`,
      };
    });
}
