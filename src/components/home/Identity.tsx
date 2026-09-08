import { Link } from "react-router-dom";

import { Showcase } from "../Showcase";
import { Frame, VaultSketch } from "../sketches";

/**
 * The account question. Do not write "sign up for a more secure experience": a guest identity
 * involves nothing of ours, and signing in means trusting auth.gryt.chat.
 */
const ACCOUNTS_DOCS = "https://docs.gryt.chat/docs/use/accounts";

export function Identity() {
  return (
    <Showcase
      id="identity"
      side="right"
      size="regular"
      eyebrow="No sign-up"
      title="No email, no phone number, and no photo of your face."
      media={
        <Frame label="It's a real password field, so your password manager offers to fill it like any other.">
          <VaultSketch />
        </Frame>
      }
    >
      <p>
        Most chat apps want enough about you to know who you are, and then you
        just have to hope they look after it. Gryt doesn't ask. Your device
        makes an identity and your device keeps it.
      </p>

      <p>
        It's twenty-four words. Put them in your password manager like any
        other password, and paste them back in on your next machine.{" "}
        <a href={ACCOUNTS_DOCS} target="_blank" rel="noreferrer">
          How that works
        </a>
        . None of it comes to us. No ads, nothing tracking you.{" "}
        <Link to="/privacy">What we hold</Link>.
      </p>

      <p>
        You can make an account too. But it's not the more private choice
        &mdash; a guest identity never touches anything of ours, and signing in
        means trusting our login service. What you get for it is one name on
        every server, a way back in if you lose your device, and a ban that
        sticks. You can do it later without losing the servers you've joined,
        and a server tells you whether it takes guests before you try.
      </p>
    </Showcase>
  );
}
