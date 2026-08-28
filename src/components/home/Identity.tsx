import { Link } from "react-router-dom";

import { Showcase } from "../Showcase";
import { Frame, VaultSketch } from "../sketches";

/**
 * The account question, answered here rather than in a section of its own.
 *
 * The tempting version of that paragraph is "you can sign up for an even more
 * secure experience", and it is backwards. A guest identity involves nothing of
 * ours — the certificate is signed by the key it describes and no server
 * contacts us to check it. Signing in means trusting `auth.gryt.chat` and
 * `id.gryt.chat`, which is less self-contained, not more private.
 *
 * What an account is genuinely for is on the other side of that trade, and it
 * is worth saying plainly: one name everywhere, a way back after a lost device,
 * and a ban that means something, which is what a server admin needs. Both
 * details in the last sentence exist because they remove the fear of choosing
 * wrong — `guide/accounts.mdx` on keeping your membership, and the chip in the
 * client's Add Server dialog, which says whether a server takes guests before
 * you try to join.
 *
 * The vault beside it is the answer to the obvious follow-up. "No account"
 * sounds like "nothing to lose it with" until you learn the identity is 24
 * BIP-39 words and the field you paste them into is a real password field — at
 * which point it is the same thing you already do with every other login, and
 * the fear goes away. That is worth a picture rather than a clause.
 *
 * Built on `Showcase` rather than on a section of its own, which is what took
 * its own CSS module out of the repository.
 */
const ACCOUNTS_DOCS = "https://docs.gryt.chat/docs/guide/accounts";

export function Identity() {
  return (
    <Showcase
      id="identity"
      side="right"
      size="regular"
      eyebrow="No sign-up"
      title="No email, no phone number, and no photo of your face."
      media={
        <Frame label="It's a real password field, so your manager offers to fill it like it fills any other.">
          <VaultSketch />
        </Frame>
      }
    >
      <p>
        Signing up for a chat app usually means giving a company enough to
        identify you, then hoping they look after it. Gryt doesn't ask. Your
        device makes an identity for you, and your device keeps it.
      </p>

      <p>
        You can put it in a password manager, the same as any password. It's
        twenty-four words. On a second machine you paste them back in.{" "}
        <a href={ACCOUNTS_DOCS} target="_blank" rel="noreferrer">
          How that works
        </a>
        . None of it reaches us either way, and there is no advertising and
        nothing that tracks you. <Link to="/privacy">What we hold</Link>.
      </p>

      <p>
        You can make an account, and it is not the more private option &mdash; a
        guest identity involves nothing of ours, and signing in means trusting
        our login service instead. What it buys you is one name across every
        server, a way back in if you lose the device, and a ban that sticks. You
        can do it later without losing the servers you have already joined, and
        a server says whether it takes guests before you try one.
      </p>
    </Showcase>
  );
}
