import { StrictMode } from "react";
import { Writable } from "node:stream";
import { renderToPipeableStream, renderToString } from "react-dom/server";
import { StaticRouter } from "react-router-dom";
import { GrytProvider } from "@gryt/ui";
import "./index.css";
import App from "./App";

/**
 * One page, as HTML, at build time.
 *
 * `renderToPipeableStream` rather than `renderToString`, and that is the whole
 * reason this file can exist at all. Every route in `App` is a `lazy()`, and so
 * is every MDX post and note underneath it — `renderToString` cannot resolve a
 * lazy component, it renders the Suspense fallback and stops. The streaming
 * renderer waits: `onAllReady` fires once every boundary has settled, which is
 * the point where the prose is actually in the tree.
 *
 * Collected into a string rather than piped anywhere, because nothing is
 * serving this. The output goes into a file next to the client bundle and nginx
 * hands it out.
 */
/** The same three wrappers `main.tsx` uses, in the same order. A difference
    here is a hydration mismatch there. */
function tree(url: string) {
  return (
    <StrictMode>
      <GrytProvider>
        <StaticRouter location={url}>
          <App />
        </StaticRouter>
      </GrytProvider>
    </StrictMode>
  );
}

export async function render(url: string, timeoutMs = 30_000): Promise<string> {
  /* Two passes, and only the second one is kept.

     Every route in `App` is a `lazy()`, and so is every post and note under it.
     `renderToString` cannot resolve one: it renders the Suspense fallback and
     returns, so a single pass with it gives "Loading post…" in a file.

     `renderToPipeableStream` can, but it does not give plain markup. A boundary
     that suspended gets deferred whatever `onAllReady` says: the output carries
     `<!--$?-->` where the content belongs, the content itself in a `<div
     hidden>` at the end, and two inline scripts to move one into the other.
     That renders, and then hydration discards it and leaves the page emptier
     than the shell this exists to replace. Measured, not assumed — that is what
     the first build of this did.

     So: stream once and throw it away, which resolves every lazy and leaves the
     resolved value on it. Then `renderToString`, which now suspends on nothing
     and emits ordinary HTML — no parking div, no scripts, the prose where a
     reader and a crawler will find it. */
  await once(url, timeoutMs);
  return renderToString(tree(url));
}


function once(url: string, timeoutMs: number): Promise<string> {
  return new Promise((resolve, reject) => {
    let html = "";
    let settled = false;
    const sink = new Writable({
      write(chunk, _encoding, done) {
        html += chunk.toString("utf8");
        done();
      },
      final(done) {
        done();
        settled = true;
        resolve(html);
      },
    });

    const { pipe, abort } = renderToPipeableStream(
      <StrictMode>
        {/* The same three wrappers `main.tsx` uses, in the same order. A
            difference here is a hydration mismatch there. */}
        <GrytProvider>
          <StaticRouter location={url}>
            <App />
          </StaticRouter>
        </GrytProvider>
      </StrictMode>,
      {
        onAllReady() {
          pipe(sink);
        },
        /* Loud on purpose. This runs in a build, so a page that throws should
           fail the build rather than ship as an empty shell that looks fine
           until somebody reads the HTML. */
        onError(error) {
          if (settled) return;
          settled = true;
          reject(error instanceof Error ? error : new Error(String(error)));
        },
      },
    );

    const timer = setTimeout(() => {
      if (settled) return;
      settled = true;
      abort();
      reject(new Error(`rendering ${url} took longer than ${timeoutMs}ms`));
    }, timeoutMs);
    timer.unref?.();
  });
}
