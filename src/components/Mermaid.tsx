import { useEffect, useRef, useState } from 'react'
import mermaid from 'mermaid'

/** Shared by the theme and by the font preload, so they cannot disagree. */
const FONT_SIZE = '14px'

mermaid.initialize({
  startOnLoad: false,
  theme: 'dark',
  themeVariables: {
    darkMode: true,
    background: '#111318',
    primaryColor: '#968ff8',
    primaryTextColor: '#e0e0e6',
    primaryBorderColor: '#968ff8',
    lineColor: '#2b303d',
    secondaryColor: '#1e2028',
    tertiaryColor: '#1a1d24',
    fontFamily:
      'Atkinson Hyperlegible Next, ui-sans-serif, system-ui, sans-serif',
    fontSize: FONT_SIZE,
    nodeBorder: '#968ff8',
    nodeTextColor: '#e0e0e6',
    mainBkg: '#1e2028',
    clusterBkg: '#111318',
    clusterBorder: '#2b303d',
    edgeLabelBackground: '#111318',
    signalColor: '#e0e0e6',
    actorBorder: '#968ff8',
    actorBkg: '#1e2028',
    actorTextColor: '#e0e0e6',
  },
})

let idCounter = 0

export function Mermaid({ chart }: { chart: string }) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [svg, setSvg] = useState('')

  useEffect(() => {
    let cancelled = false
    const id = `mermaid-${++idCounter}`

    mermaid
      .render(id, chart.trim())
      .then(({ svg }) => {
        if (!cancelled) setSvg(svg)
      })
      .catch(() => {
        // A diagram that will not parse should leave a gap, not take the page
        // down with it.
      })

    return () => {
      cancelled = true
    }
  }, [chart])

  return (
    <div
      ref={containerRef}
      className="mermaidDiagram"
      dangerouslySetInnerHTML={{ __html: svg }}
      style={{
        margin: '24px 0',
        padding: '24px',
        borderRadius: 'var(--radius-sm)',
        background: 'var(--bg-card)',
        border: '1px solid var(--border)',
        overflow: 'auto',
        textAlign: 'center',
      }}
    />
  )
}
