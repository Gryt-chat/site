import { Hero } from '../components/home/Hero'
import { Edge } from '../components/home/Edge'
import { Compare } from '../components/home/Compare'
import { Security } from '../components/home/Security'
import { Story } from '../components/home/Story'
import { SelfHost } from '../components/home/SelfHost'
import { Sponsors } from '../components/home/Sponsors'
import { Download } from '../components/Download'

export function HomePage() {
  return (
    <main>
      <Hero />
      <Edge />
      <Compare />
      <Story />
      <Security />
      <SelfHost />
      <Sponsors />
      <Download />
    </main>
  )
}
