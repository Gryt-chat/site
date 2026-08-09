import { motion, useReducedMotion } from "motion/react";
import { inView, rise, stagger } from "./motion";
import styles from "./Security.module.css";

/**
 * Source: docs/guide/security.mdx and docs/guide/why-gryt.mdx § Skeptic FAQ.
 *
 * The IP answer is not from the docs. It is read off the code: the client builds
 * exactly one RTCPeerConnection and it terminates at the SFU
 * (webRTC/src/hooks/sfuConnectFlow.ts), and there is no peer-to-peer path in the
 * SFU at all. A mesh would need a connection per participant, and the client
 * keeps a single ref. The competitor sentence is checked too — Jitsi Meet ships
 * `p2p.enabled: true` and uses it for two-participant calls, and Matrix's legacy
 * one-to-one calls are direct WebRTC. Recheck both before repeating the claim;
 * this is the kind of line that quietly goes stale.
 */
const claims = [
  {
    q: "Can a malicious server steal my login?",
    a: "No. Your token never reaches a community server. You sign a one-time challenge with a private key that stays on your device, and the signed proof is bound to that one server and expires in 60 seconds.",
  },
  {
    q: "Can the SFU listen to my voice?",
    a: "No. It forwards encrypted RTP without decrypting it. Routing audio and hearing audio are different jobs, and it only does the first.",
  },
  {
    q: "Can the people I talk to see my IP address?",
    a: "No. Your client connects to the server and to nothing else, so the only address anyone in the call learns is the server's. Worth saying because it is not universal: Jitsi Meet connects two people directly when a call has only two people in it, and Matrix's one-to-one calls do the same. Discord routes through its own servers as well, so this is table stakes rather than something we do and they do not. The server operator does see your address, and if you did not set that server up, that is someone you are trusting.",
  },
  {
    q: "What if a server changes its identity key?",
    a: "Your client pinned it the first time you connected. A change is shown to you rather than accepted silently, and a host who rotates deliberately can have clients follow without it looking like an attack.",
  },
  {
    q: "Can a server admin read my messages?",
    a: "If the server stores them, yes, and that is true of every self-hosted chat system. The difference is you can be the operator, or pick one you trust.",
  },
  {
    q: "Do I have to use Gryt's auth service?",
    a: "No. Keycloak and the identity certificate authority are both in the repo and both self-hostable, so you can run identity yourself and depend on nothing of ours. The catch is real and worth stating: your users can then only join servers that use your auth service, because a server verifies identities against the authority it trusts. Run your own and you have your own island.",
  },
];

export function Security() {
  const reduced = useReducedMotion() ?? false;

  return (
    <section className={styles.section} id="security">
      <motion.div className={styles.inner} variants={stagger(reduced)} {...inView}>
        <div className={styles.head}>
          <motion.p className={styles.eyebrow} variants={rise(reduced)}>
            Security
          </motion.p>
          <motion.h2 className={styles.heading} variants={rise(reduced)}>
            The awkward questions, answered on the front page.
          </motion.h2>
          <motion.p className={styles.sub} variants={rise(reduced)}>
            A security page that only lists the good parts is marketing. These
            are the things people actually ask, including the ones where the
            answer is not flattering.
          </motion.p>
        </div>

        <div className={styles.list}>
          {claims.map((c) => (
            <motion.div key={c.q} className={styles.item} variants={rise(reduced)}>
              <h3>{c.q}</h3>
              <p>{c.a}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
