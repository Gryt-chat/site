/** The page background shader, adapted from the sign-in page in Gryt-chat/auth.
 *  Colours come in as uniforms read from the theme's CSS variables. */

export const VERTEX_SHADER = /* glsl */ `
attribute vec2 position;
void main() {
  gl_Position = vec4(position, 0.0, 1.0);
}
`;

export const FRAGMENT_SHADER = /* glsl */ `
precision highp float;

uniform vec2 resolution;
uniform float time;
uniform vec3 paper;
uniform vec3 accent;
uniform vec3 accent2;
uniform float strength;

float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  f = f * f * (3.0 - 2.0 * f);
  return mix(
    mix(hash(i), hash(i + vec2(1.0, 0.0)), f.x),
    mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), f.x),
    f.y
  );
}

float fbm(vec2 p) {
  float value = 0.0;
  float amplitude = 0.5;
  for (int i = 0; i < 5; i++) {
    value += amplitude * noise(p);
    p *= 2.03;
    amplitude *= 0.5;
  }
  return value;
}

void main() {
  vec2 uv = (gl_FragCoord.xy - 0.5 * resolution) / resolution.y;

  // Domain warp, so the flow curls instead of sliding like a scrolling texture.
  float f = fbm(uv * 1.7 + vec2(time * 0.035, time * 0.022));
  f = fbm(uv * 1.9 + vec2(f * 1.1, -time * 0.028));

  vec3 colour = paper;
  colour = mix(colour, accent, smoothstep(0.35, 0.95, f) * 0.42 * strength);
  colour = mix(colour, accent2, smoothstep(0.55, 1.05, f) * 0.14 * strength);

  // Darker towards the bottom, so the text lower down sits on a calmer ground.
  colour = mix(colour, paper, smoothstep(0.1, -0.9, uv.y) * 0.5);

  // Dither against eight-bit banding on a dark gradient.
  colour += (hash(gl_FragCoord.xy) - 0.5) * 0.012;

  gl_FragColor = vec4(colour, 1.0);
}
`;

/** Seconds into the animation to freeze at when motion is not wanted. */
export const REDUCED_MOTION_TIME = 8.0;
