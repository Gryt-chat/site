import { Link } from "react-router-dom";

import { Code, Note, Notes, ProblemSection, SupportProblem } from "../../components/SupportProblem";

const D = "https://docs.gryt.chat/docs";

export function ServerWontStartPage() {
  return (
    <SupportProblem
      title="My own server won't start or nobody can reach it"
      lede="Commands to check a Gryt server running in Docker or Kubernetes, and what each failure usually means."
      askText="Tell us what you tried and what it said. A screenshot helps a lot. Blur any invite code first."
    >
      <ProblemSection id="docker" title="Docker" intro="Start with the logs. Then look for another program using the same port.">
        <Code>{"docker compose logs\ndocker stats\nnetstat -tulpn | grep :5000"}</Code>
      </ProblemSection>
      <ProblemSection id="kubernetes" title="Kubernetes" intro="See which pods are stuck and why.">
        <Code>{"kubectl get pods -l app.kubernetes.io/name=gryt\nkubectl describe pod <pod-name>\nkubectl logs <pod-name>\nkubectl get services -l app.kubernetes.io/name=gryt\nkubectl get ingress"}</Code>
      </ProblemSection>
      <ProblemSection id="connection" title="It runs, but nobody can connect" intro="Check that both parts answer.">
        <Code>{"curl http://localhost:5000/health\ncurl http://localhost:5005/health"}</Code>
        <Notes>
          <Note title="Ports">5000 and 5005 are TCP and neither carries voice. If chat works but audio doesn&rsquo;t, it&rsquo;s the UDP port. <Link to="/support/nobody-can-hear-anyone">Fix voice</Link>.</Note>
          <Note title="CORS"><code>CORS_ORIGIN</code> has to include <code>http://127.0.0.1:15738</code> for the app, <code>https://app.gryt.chat</code> for the web client, and any of your own.</Note>
          <Note title="Voice server says starting">A 503 from <code>:5005/health</code> with <code>starting</code> means its UDP check hasn&rsquo;t passed yet. If it exits, look for <code>failed to create ICE UDP mux on port</code>, which means something else has that port.</Note>
          <Note title="Using Cloudflare?">A tunnel can&rsquo;t carry voice. Set <code>ICE_ADVERTISE_IP</code> to your real public IP and open the UDP port there. <a href={`${D}/host/cloudflare-tunnel`}>Tunnel guide</a>.</Note>
        </Notes>
      </ProblemSection>
    </SupportProblem>
  );
}
