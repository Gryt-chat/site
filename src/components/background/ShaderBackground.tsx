import { useEffect, useRef } from "react";
import { FRAGMENT_SHADER, REDUCED_MOTION_TIME, VERTEX_SHADER } from "./shader";

// The sky blue from the sign-in page; the site has no token for it.
const SKY: [number, number, number] = [0.49, 0.827, 0.988];

// How much of the sign-in page's colour shows, from 0 to 1. Set in the shader, not with
// CSS opacity, so the gradient stays smooth.
const STRENGTH = 0.1;

function readColor(name: string, fallback: [number, number, number]): [number, number, number] {
  const hex = getComputedStyle(document.documentElement).getPropertyValue(name).trim().replace("#", "");
  if (!/^[0-9a-f]{6}$/i.test(hex)) return fallback;
  const n = parseInt(hex, 16);
  return [((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255];
}

/** The animated page background: raw WebGL, one triangle, started once the page is idle.
 *  No WebGL removes the canvas, reduced motion draws one still frame, a hidden tab stops it. */
export function ShaderBackground() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    let cleanup: (() => void) | undefined;

    const init = () => {
      const gl = canvas.getContext("webgl", {
        alpha: false,
        antialias: false,
        preserveDrawingBuffer: false,
        powerPreference: "low-power",
      });
      if (!gl) {
        canvas.remove();
        return;
      }

      const compile = (type: number, source: string) => {
        const shader = gl.createShader(type);
        if (!shader) return null;
        gl.shaderSource(shader, source);
        gl.compileShader(shader);
        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
          console.warn("Background shader failed to compile", gl.getShaderInfoLog(shader));
          gl.deleteShader(shader);
          return null;
        }
        return shader;
      };

      const vertex = compile(gl.VERTEX_SHADER, VERTEX_SHADER);
      const fragment = compile(gl.FRAGMENT_SHADER, FRAGMENT_SHADER);
      const program = gl.createProgram();
      if (!vertex || !fragment || !program) {
        canvas.remove();
        return;
      }
      gl.attachShader(program, vertex);
      gl.attachShader(program, fragment);
      gl.linkProgram(program);
      if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        console.warn("Background shader failed to link", gl.getProgramInfoLog(program));
        canvas.remove();
        return;
      }
      gl.useProgram(program);

      const buffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
      const position = gl.getAttribLocation(program, "position");
      gl.enableVertexAttribArray(position);
      gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);

      const uResolution = gl.getUniformLocation(program, "resolution");
      const uTime = gl.getUniformLocation(program, "time");
      gl.uniform3fv(gl.getUniformLocation(program, "paper"), readColor("--gryt-bg", [0.067, 0.075, 0.094]));
      gl.uniform3fv(gl.getUniformLocation(program, "accent"), readColor("--gryt-accent-9", [0.588, 0.561, 0.973]));
      gl.uniform3fv(gl.getUniformLocation(program, "accent2"), SKY);
      gl.uniform1f(gl.getUniformLocation(program, "strength"), STRENGTH);

      const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

      const resize = () => {
        // One buffer pixel per CSS pixel: sharp enough for a soft gradient, and cheaper than 2x.
        const scale = 1;
        const width = Math.max(1, Math.round(canvas.clientWidth * scale));
        const height = Math.max(1, Math.round(canvas.clientHeight * scale));
        if (canvas.width !== width || canvas.height !== height) {
          canvas.width = width;
          canvas.height = height;
        }
      };

      let frame = 0;
      let start = 0;
      let lastTime = REDUCED_MOTION_TIME;
      const draw = (seconds: number) => {
        lastTime = seconds;
        resize();
        gl.viewport(0, 0, canvas.width, canvas.height);
        gl.uniform2f(uResolution, canvas.width, canvas.height);
        gl.uniform1f(uTime, seconds);
        gl.drawArrays(gl.TRIANGLES, 0, 3);
      };
      const loop = (timestamp: number) => {
        frame = requestAnimationFrame(loop);
        if (start === 0) start = timestamp - lastTime * 1000;
        draw((timestamp - start) / 1000);
      };
      const stop = () => {
        if (frame) cancelAnimationFrame(frame);
        frame = 0;
      };
      const run = () => {
        stop();
        if (reducedMotion.matches) {
          draw(REDUCED_MOTION_TIME);
          return;
        }
        start = 0;
        frame = requestAnimationFrame(loop);
      };
      const onVisibility = () => (document.hidden ? stop() : run());

      const sizeObserver = new ResizeObserver(() => {
        if (!frame) draw(lastTime);
      });
      sizeObserver.observe(canvas);

      run();
      canvas.style.opacity = "1";
      reducedMotion.addEventListener("change", run);
      document.addEventListener("visibilitychange", onVisibility);

      cleanup = () => {
        stop();
        sizeObserver.disconnect();
        reducedMotion.removeEventListener("change", run);
        document.removeEventListener("visibilitychange", onVisibility);
        gl.deleteProgram(program);
        gl.deleteShader(vertex);
        gl.deleteShader(fragment);
        gl.deleteBuffer(buffer);
        gl.getExtension("WEBGL_lose_context")?.loseContext();
      };
    };

    // The timeout matters: the homepage animates constantly, so it may never be idle.
    const handle = window.requestIdleCallback
      ? window.requestIdleCallback(init, { timeout: 1500 })
      : window.setTimeout(init, 200);
    const cancelIdle = window.cancelIdleCallback ?? window.clearTimeout;
    return () => {
      cancelIdle(handle);
      cleanup?.();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{
        position: "fixed",
        inset: 0,
        width: "100%",
        height: "100%",
        zIndex: -1,
        pointerEvents: "none",
        opacity: 0,
        transition: "opacity 1.2s ease",
      }}
    />
  );
}
