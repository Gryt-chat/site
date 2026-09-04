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
     `renderToString` cannot resolve one — it renders the Suspense fallback and
     returns. `renderToPipeableStream` can, but a boundary that suspended stays
     deferred whatever `onAllReady` says, and hydration then discards the
     parked content and leaves the page emptier than the shell this replaces.

     So: stream once and throw it away, which resolves every lazy. Then
     `renderToString`, which now suspends on nothing and emits ordinary HTML. */
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
