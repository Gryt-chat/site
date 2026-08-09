import { Hero } from '../components/home/Hero'
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
