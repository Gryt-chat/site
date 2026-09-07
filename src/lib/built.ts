/**
 * Everything listed on /built, and the only place it is listed.
 *
 * This is a file in a repository rather than a submission form, which is the
 * whole point: an entry gets here by a pull request somebody read. "Who vetted
 * this" has an answer, and it is a name in the git log.
 *
 * What that does not mean is that the code was audited. A plugin runs on
 * somebody's machine and a server plugin runs inside somebody's server, and
 * merging a row on a website is not a security review of either. The page says
 * so where people will read it, and it has to keep saying so.
 *
 * ## Adding one
 *
 * Open a pull request adding an entry below. What it needs:
 *
 * - a `href` to source somebody can read, not to a download
 * - a `by` that is a person or a project, not a slogan
 * - a `detail` that says what the thing does, in one line, with no adjectives
 *   about how good it is
 *
 * `firstParty` is for the examples Gryt maintains. It exists so the page can
 * keep the two apart: a showcase where the only entries are the author's own,
 * presented as though other people made them, is a lie told by omission.
 */

import type { RowItem } from "../components/LinkRows";

export type BuiltKind = "bot" | "addon" | "plugin";

export interface BuiltEntry extends RowItem {
  kind: BuiltKind;
  /** Maintained by Gryt. Community entries leave this off. */
  firstParty?: boolean;
}

const GH = "https://github.com/Gryt-chat";

export const BUILT: BuiltEntry[] = [
  {
    kind: "bot",
    name: "ping",
    by: "Gryt",
    detail: "One file. A bot that joins, waits to be approved, and answers one command.",
    href: `${GH}/bot/blob/main/examples/ping.ts`,
    firstParty: true,
  },
  {
    kind: "bot",
    name: "Support bot",
    by: "Gryt",
    detail:
      "Answers questions out of a JSON file and waves at people when they arrive. Ships with a Dockerfile and a compose file.",
    href: `${GH}/bot/tree/main/examples/support-bot`,
    firstParty: true,
  },
  {
    kind: "addon",
    name: "Paper",
    by: "Gryt",
    detail: "A warmer light theme, and forty lines of CSS showing which variables a theme should touch.",
    href: `${GH}/client/tree/main/examples/paper-theme`,
    firstParty: true,
  },
  {
    kind: "addon",
    name: "Presence",
    by: "Gryt",
    detail:
      "Puts what you are playing under your name, and tells servers running the other half. The client side of a pair.",
    href: `${GH}/client/tree/main/examples/presence`,
    firstParty: true,
  },
  {
    kind: "plugin",
    name: "Presence",
    by: "Gryt",
    detail: "The server side of the same pair: keeps the roster and sends it to everybody who has the client half.",
    href: `${GH}/server/tree/main/examples/presence`,
    firstParty: true,
  },
  {
    kind: "plugin",
    name: "Crosspost guard",
    by: "Gryt",
    detail:
      "Deletes the same message when it lands in three channels inside a minute, and bans whoever does it twice.",
    href: `${GH}/server/tree/main/examples/crosspost-guard`,
    firstParty: true,
  },
];

export function builtOfKind(kind: BuiltKind): BuiltEntry[] {
  return BUILT.filter((entry) => entry.kind === kind);
}

/** Whether anybody outside Gryt is listed under this heading yet. */
export function hasCommunity(kind: BuiltKind): boolean {
  return builtOfKind(kind).some((entry) => !entry.firstParty);
}
