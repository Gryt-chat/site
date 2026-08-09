import { Hero } from '../components/home/Hero'
import { Edge } from '../components/home/Edge'
import { Pillars } from '../components/home/Pillars'
import { FeatureGrid } from '../components/home/FeatureGrid'
import { Compare } from '../components/home/Compare'
import { Security } from '../components/home/Security'
import { Story } from '../components/home/Story'
import { SelfHost } from '../components/home/SelfHost'
import { Download } from '../components/Download'

export function HomePage() {
  return (
    <>
      <Hero />
      <Edge />
      <Pillars />
      <FeatureGrid />
      <Compare />
      <Security />
      <Story />
      <SelfHost />
      <Download />
    </>
  )
}
