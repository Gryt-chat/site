import { Hero } from '../components/Hero'
import { Philosophy } from '../components/Philosophy'
import { Features } from '../components/Features'
import { Architecture } from '../components/Architecture'
import { Download } from '../components/Download'

export function HomePage() {
  return (
    <>
      <Hero />
      <Philosophy />
      <Features />
      <Architecture />
      <Download />
    </>
  )
}
