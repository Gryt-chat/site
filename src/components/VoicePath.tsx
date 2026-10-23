import styles from './VoicePath.module.css'

/** One side of a step. Null leaves a dashed gap: that side doesn't do this step at all. */
interface Step {
  text: string
  /** Measured time this step costs, in ms. Only measured values; leave it out when unknown. */
  ms?: number
  /** Marked as where the time goes. */
  slow?: boolean
}

interface Row {
  webrtc: Step | null
  ours: Step | null
}

interface Props {
  rows: Row[]
  /** Measured medians, mic to ear, in ms. They set how long each dot takes overall. */
  webrtcMs: number
  oursMs: number
  caption?: string
}

const W = 400
const COL = 190
const GAP = 20
const STEP = 44
const BOX = 32
const TOP = 30
// The slower trip at 40x real time, then a pause before both start again.
const SLOWMO = 40
const PAUSE_S = 1.5

/* Where the dot is at each row, as a share of its trip: a measured step takes its time,
   the rest of the lane's total is spread evenly over the other rows. */
function stops(steps: (Step | null)[], total: number): number[] {
  const known = steps.reduce((sum, s) => sum + (s?.ms ?? 0), 0)
  const unknown = steps.filter((s) => s && s.ms === undefined).length
  const each = unknown ? Math.max(0, total - known) / unknown : 0
  const cost = steps.map((s) => (s ? (s.ms ?? each) : 0))
  let at = 0
  return cost.map((c) => {
    const start = at
    at += c
    return start / total
  })
}

function keyframes(name: string, rows: number, starts: number[], total: number, cycle: number): string {
  const share = (total * SLOWMO) / 1000 / cycle
  const frames = starts.map((s, i) => `${(s * share * 100).toFixed(2)}%{transform:translateY(${i * STEP}px)}`)
  frames.push(`${(share * 100).toFixed(2)}%,100%{transform:translateY(${(rows - 1) * STEP}px)}`)
  return `@keyframes ${name}{${frames.join('')}}`
}

function Cell({ step, x, y, ours }: { step: Step | null; x: number; y: number; ours?: boolean }) {
  if (!step) {
    return (
      <g>
        <rect x={x} y={y} width={COL} height={BOX} rx={8} className={styles.gap} />
        <text x={x + COL / 2} y={y + BOX / 2} textAnchor="middle" dominantBaseline="middle" className={styles.gapText}>not needed</text>
      </g>
    )
  }
  const cls = step.slow ? styles.slow : ours ? styles.stepOurs : styles.step
  return (
    <g>
      <rect x={x} y={y} width={COL} height={BOX} rx={8} className={cls} />
      <text x={x + 26} y={y + BOX / 2} dominantBaseline="middle" className={styles.stepText}>{step.text}</text>
      {step.ms !== undefined ? (
        <text x={x + COL - 8} y={y + BOX / 2} textAnchor="end" dominantBaseline="middle" className={step.slow ? styles.msSlow : styles.ms}>
          {`${step.ms} ms`}
        </text>
      ) : null}
    </g>
  )
}

/** WebRTC's steps beside ours, gaps where a side skips a step, a dot running down each at measured pace. */
export function VoicePath({ rows, webrtcMs, oursMs, caption }: Props) {
  const height = TOP + rows.length * STEP + 30
  const cycle = (Math.max(webrtcMs, oursMs) * SLOWMO) / 1000 + PAUSE_S
  const css =
    keyframes('voice-path-webrtc', rows.length, stops(rows.map((r) => r.webrtc), webrtcMs), webrtcMs, cycle) +
    keyframes('voice-path-ours', rows.length, stops(rows.map((r) => r.ours), oursMs), oursMs, cycle)
  const lanes = [
    { title: 'Gryt (old): WebRTC', ms: webrtcMs, x: 0, anim: 'voice-path-webrtc', ours: false },
    { title: 'Gryt (new): our engine', ms: oursMs, x: COL + GAP, anim: 'voice-path-ours', ours: true },
  ]
  const label = rows
    .map((r) => `${r.webrtc?.text ?? 'nothing'} versus ${r.ours?.text ?? 'nothing'}`)
    .join('; ')
  return (
    <figure className={styles.figure}>
      <style>{css}</style>
      <svg viewBox={`0 0 ${W} ${height}`} className={styles.svg} role="img"
        aria-label={`WebRTC ${webrtcMs} ms, ours ${oursMs} ms. Step by step: ${label}`}>
        {lanes.map((l) => (
          <text key={l.title} x={l.x + COL / 2} y={16} textAnchor="middle" className={l.ours ? styles.headOurs : styles.head}>{l.title}</text>
        ))}
        {rows.map((r, i) => (
          <g key={i}>
            <Cell step={r.webrtc} x={0} y={TOP + i * STEP} />
            <Cell step={r.ours} x={COL + GAP} y={TOP + i * STEP} ours />
          </g>
        ))}
        {lanes.map((l) => (
          <g key={l.anim}>
            <line x1={l.x + 13} x2={l.x + 13} y1={TOP + BOX / 2} y2={TOP + BOX / 2 + (rows.length - 1) * STEP} className={styles.rail} />
            <circle cx={l.x + 13} cy={TOP + BOX / 2} r={6} className={l.ours ? styles.dotOurs : styles.dot}
              style={{ animation: `${l.anim} ${cycle}s linear infinite` }} />
            <text x={l.x + COL / 2} y={height - 8} textAnchor="middle" className={l.ours ? styles.totalOurs : styles.total}>{`${l.ms} ms`}</text>
          </g>
        ))}
      </svg>
      {caption ? <figcaption className={styles.caption}>{caption}</figcaption> : null}
    </figure>
  )
}
