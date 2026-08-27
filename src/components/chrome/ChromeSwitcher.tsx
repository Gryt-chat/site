import { Chip } from '@gryt/ui'
import { NAVS, FOOTERS, type NavKey, type FooterKey } from './useChromePreview'

interface SwitcherProps {
  nav: NavKey
  footer: FooterKey
  pickNav: (k: NavKey) => void
  pickFooter: (k: FooterKey) => void
  off: () => void
}

export function ChromeSwitcher({ nav, footer, pickNav, pickFooter, off }: SwitcherProps) {
  return (
    <div
      style={{
        position: 'fixed',
        bottom: 16,
        left: '50%',
        translate: '-50% 0',
        zIndex: 300,
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        gap: 6,
        padding: '8px 12px',
        maxWidth: 'calc(100vw - 24px)',
        background: 'var(--bg-card)',
        border: '1px solid var(--border)',
        borderRadius: 16,
      }}
    >
      <span style={{ fontSize: 11, color: 'var(--text-dimmer)', marginRight: 2 }}>NAV</span>
      {(Object.keys(NAVS) as NavKey[]).map((k) => (
        <button key={k} type="button" onClick={() => pickNav(k)} style={bare}>
          <Chip tone={k === nav ? 'primary' : 'neutral'}>{NAVS[k].label}</Chip>
        </button>
      ))}

      <span style={{ fontSize: 11, color: 'var(--text-dimmer)', margin: '0 2px 0 8px' }}>FOOT</span>
      {(Object.keys(FOOTERS) as FooterKey[]).map((k) => (
        <button key={k} type="button" onClick={() => pickFooter(k)} style={bare}>
          <Chip tone={k === footer ? 'primary' : 'neutral'}>{FOOTERS[k].label}</Chip>
        </button>
      ))}

      <button key="off" type="button" onClick={off} style={bare}>
        <Chip tone="danger">Off</Chip>
      </button>
    </div>
  )
}

const bare = { background: 'none', border: 0, padding: 0, cursor: 'pointer' } as const
