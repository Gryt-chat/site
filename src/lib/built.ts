/**
 * Everything listed on /built, by pull request rather than a form, so "who vetted this" has
 * an answer. Merging a row is not a security review, and the page says so.
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
