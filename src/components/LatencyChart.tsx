import styles from './LatencyChart.module.css'

export interface LatencyRow {
  label: string
  /** Median in ms. */
  median: number
  /** 95th percentile in ms, drawn as a whisker when given. */
  p95?: number
  /** Every measured click in ms, for the spread chart. */
  samples?: number[]
  /** Gryt's own rows, drawn in the accent colour. */
  ours?: boolean
}

interface ChartProps {
  title: string
  caption?: string
  rows: LatencyRow[]
  /** Dummy data until GRYT-1857's measurements land: stamped on the chart so it can't pass for real. */
  placeholder?: boolean
  /** Keep the rows in the order given, for a before and after; otherwise fastest first. */
  ordered?: boolean
}

const WIDTH = 640
const LABEL = 170
const RIGHT = 70
const ROW = 34

// A round step that gives four or five ticks, so the axis reads 0, 50, 100 rather than 56.25.
function scaleMax(rows: LatencyRow[]): number {
  const top = Math.max(...rows.flatMap((r) => [r.p95 ?? r.median, ...(r.samples ?? [])]))
  const step = [1, 2, 5, 10, 20, 25, 50, 100, 200].find((s) => top / s <= 5) ?? 500
  return Math.ceil(top / step) * step
}

function Stamp({ height }: { height: number }) {
  return (
    <text x={WIDTH / 2} y={height / 2} className={styles.stamp} textAnchor="middle" dominantBaseline="middle">
      DUMMY NUMBERS · NOT MEASURED YET
    </text>
  )
}

function Frame({ title, caption, placeholder, height, label, children }: ChartProps & { height: number; label: string; children: React.ReactNode }) {
  return (
    <figure className={styles.figure}>
      <figcaption className={styles.title}>{title}</figcaption>
      <svg viewBox={`0 0 ${WIDTH} ${height}`} className={styles.svg} role="img" aria-label={label}>
        {children}
        {placeholder ? <Stamp height={height} /> : null}
      </svg>
      {caption ? <p className={styles.caption}>{caption}</p> : null}
    </figure>
  )
}

function Axis({ max, height }: { max: number; height: number }) {
  const x = (v: number) => LABEL + (v / max) * (WIDTH - LABEL - RIGHT)
  const step = [1, 2, 5, 10, 20, 25, 50, 100, 200].find((s) => max / s <= 5) ?? 500
  const ticks = Array.from({ length: max / step + 1 }, (_, i) => i * step)
  return (
    <g>
      {ticks.map((t) => (
        <g key={t}>
          <line x1={x(t)} x2={x(t)} y1={0} y2={height - 22} className={styles.grid} />
          <text x={x(t)} y={height - 6} textAnchor="middle" className={styles.tick}>{`${t} ms`}</text>
        </g>
      ))}
    </g>
  )
}

/** Fastest first: a median bar per row, a p95 whisker, and the median written at the end. */
export function LatencyBars(props: ChartProps) {
  const rows = props.ordered ? props.rows : [...props.rows].sort((a, b) => a.median - b.median)
  const max = scaleMax(rows)
  const height = rows.length * ROW + 30
  const x = (v: number) => LABEL + (v / max) * (WIDTH - LABEL - RIGHT)
  const label = rows.map((r) => `${r.label} ${r.median} ms${r.p95 ? `, p95 ${r.p95} ms` : ''}`).join('; ')
  return (
    <Frame {...props} height={height} label={`${props.title}: ${label}`}>
      <Axis max={max} height={height} />
      {rows.map((r, i) => {
        const y = i * ROW + 6
        return (
          <g key={r.label}>
            <text x={LABEL - 10} y={y + 13} textAnchor="end" dominantBaseline="middle" className={r.ours ? styles.labelOurs : styles.label}>
              {r.label}
            </text>
            <rect x={LABEL} y={y} width={x(r.median) - LABEL} height={26} rx={6} className={r.ours ? styles.barOurs : styles.bar} />
            {r.p95 ? (
              <g className={styles.whisker}>
                <line x1={x(r.median)} x2={x(r.p95)} y1={y + 13} y2={y + 13} />
                <line x1={x(r.p95)} x2={x(r.p95)} y1={y + 6} y2={y + 20} />
              </g>
            ) : null}
            <text x={x(r.p95 ?? r.median) + 8} y={y + 13} dominantBaseline="middle" className={styles.value}>
              {`${r.median} ms`}
            </text>
          </g>
        )
      })}
    </Frame>
  )
}

// Deterministic, so a placeholder chart looks the same on every render and in the prerender.
function dummySamples(r: LatencyRow, seed: number): number[] {
  let s = seed * 9301 + 49297
  const rand = () => ((s = (s * 9301 + 49297) % 233280) / 233280)
  const spread = (r.p95 ?? r.median * 1.2) - r.median
  return Array.from({ length: 100 }, () => {
    const u = rand()
    return Math.round((r.median + (u < 0.9 ? (rand() - 0.5) * spread : spread * (0.8 + rand()))) * 10) / 10
  })
}

/** Every click as a dot, so the spread and the outliers show, with the median as a tick. */
export function LatencySpread(props: ChartProps) {
  const rows = [...props.rows].sort((a, b) => a.median - b.median)
  const data = rows.map((r, i) => ({ ...r, samples: r.samples ?? (props.placeholder ? dummySamples(r, i + 1) : []) }))
  const max = scaleMax(data)
  const height = rows.length * ROW + 30
  const x = (v: number) => LABEL + (v / max) * (WIDTH - LABEL - RIGHT)
  return (
    <Frame {...props} height={height} label={`${props.title}: ${rows.map((r) => `${r.label} median ${r.median} ms`).join('; ')}`}>
      <Axis max={max} height={height} />
      {data.map((r, i) => {
        const y = i * ROW + 6
        return (
          <g key={r.label}>
            <text x={LABEL - 10} y={y + 13} textAnchor="end" dominantBaseline="middle" className={r.ours ? styles.labelOurs : styles.label}>
              {r.label}
            </text>
            {r.samples.map((v, j) => (
              <circle key={j} cx={x(v)} cy={y + 5 + ((j * 7) % 17)} r={2.2} className={r.ours ? styles.dotOurs : styles.dot} />
            ))}
            <line x1={x(r.median)} x2={x(r.median)} y1={y} y2={y + 26} className={styles.median} />
          </g>
        )
      })}
    </Frame>
  )
}

interface Pair {
  label: string
  old: number
  new: number
}

/** Gryt (old) and Gryt (new) side by side for each setup, with the setup written above its pair. */
export function LatencyPairs({ title, caption, rows }: { title: string; caption?: string; rows: Pair[] }) {
  const max = scaleMax(rows.map((r) => ({ label: r.label, median: Math.max(r.old, r.new) })))
  const GROUP = 78
  const height = rows.length * GROUP + 30
  const left = 20
  const x = (v: number) => left + (v / max) * (WIDTH - left - RIGHT)
  const label = rows.map((r) => `${r.label}: old ${r.old} ms, new ${r.new} ms`).join('; ')
  return (
    <Frame title={title} caption={caption} rows={[]} height={height} label={`${title}: ${label}`}>
      <PairAxis max={max} height={height} left={left} />
      {rows.map((r, i) => {
        const y = i * GROUP + 4
        return (
          <g key={r.label}>
            <text x={left} y={y + 10} className={styles.label}>{r.label}</text>
            {[
              { v: r.old, cls: styles.bar, name: 'Gryt (old)', dy: 18 },
              { v: r.new, cls: styles.barOurs, name: 'Gryt (new)', dy: 44 },
            ].map((b) => (
              <g key={b.name}>
                <rect x={left} y={y + b.dy} width={x(b.v) - left} height={22} rx={5} className={b.cls} />
                <text x={x(b.v) + 8} y={y + b.dy + 11} dominantBaseline="middle" className={styles.value}>{`${b.name}  ${b.v} ms`}</text>
              </g>
            ))}
          </g>
        )
      })}
    </Frame>
  )
}

function PairAxis({ max, height, left }: { max: number; height: number; left: number }) {
  const x = (v: number) => left + (v / max) * (WIDTH - left - RIGHT)
  const step = [1, 2, 5, 10, 20, 25, 50, 100, 200].find((s) => max / s <= 5) ?? 500
  const ticks = Array.from({ length: max / step + 1 }, (_, i) => i * step)
  return (
    <g>
      {ticks.map((t) => (
        <g key={t}>
          <line x1={x(t)} x2={x(t)} y1={16} y2={height - 22} className={styles.grid} />
          <text x={x(t)} y={height - 6} textAnchor="middle" className={styles.tick}>{`${t} ms`}</text>
        </g>
      ))}
    </g>
  )
}
