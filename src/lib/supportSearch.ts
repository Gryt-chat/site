/** One hit from the docs search endpoint. */
export interface DocsHit {
  type: "page" | "heading" | "text";
  content: string;
  url: string;
}

export interface SupportResult {
  name: string;
  /** The docs page the section is on. */
  page: string;
  /** Empty when the match was the heading itself. */
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
  // The endpoint wraps matched words in <mark>.
  return content.replace(/<\/?mark>/g, "").replace(/[`*_]/g, "").replace(/\s+/g, " ").trim();
}

/** Help for people using or hosting Gryt first. The API reference answers a different question. */
export function toSupportResults(hits: DocsHit[]): SupportResult[] {
  const seen = new Set<string>();
  const sections = new Set(hits.filter((hit) => hit.url.includes("#")).map((hit) => hit.url.split("#")[0]));
  const unique = hits.filter((hit) => {
    if (seen.has(hit.url) || hit.url.startsWith("/docs/build") || sections.has(hit.url)) return false;
    seen.add(hit.url);
    return true;
  });

  const rank = (hit: DocsHit) => (hit.url.startsWith("/docs/use") ? 0 : 1);
  return unique
    .map((hit, index) => ({ hit, index }))
    .sort((a, b) => rank(a.hit) - rank(b.hit) || a.index - b.index)
    .slice(0, MAX_RESULTS)
    .map(({ hit }) => {
      const text = plainText(hit.content);
      return {
        name: hit.type === "text" ? sectionName(hit.url) : text,
        page: sectionName(hit.url.split("#")[0]),
        detail: hit.type === "text" ? text : "",
        href: `${DOCS_ORIGIN}${hit.url}`,
      };
    });
}
