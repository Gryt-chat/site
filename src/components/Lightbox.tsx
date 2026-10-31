import { useRef, useState, type ComponentPropsWithoutRef } from 'react'
import { Lightbox, type LightboxItem } from 'react-motion-lightbox'
import 'react-motion-lightbox/styles.css'
import styles from './Lightbox.module.css'

/** Every picture on the page in reading order, so the arrows step through the whole post. */
function picturesAround(img: HTMLImageElement): HTMLImageElement[] {
  return Array.from((img.closest('main') ?? document).querySelectorAll<HTMLImageElement>('img[data-lightbox]'))
}

export function LightboxImage({
  src,
  alt,
  className,
  ...rest
}: ComponentPropsWithoutRef<'img'>) {
  const thumb = useRef<HTMLImageElement>(null)
  const [pictures, setPictures] = useState<HTMLImageElement[]>([])
  const [index, setIndex] = useState(0)
  const [open, setOpen] = useState(false)

  const show = () => {
    const img = thumb.current
    if (!img) return
    const all = picturesAround(img)
    setPictures(all)
    setIndex(Math.max(0, all.indexOf(img)))
    setOpen(true)
  }

  const items: LightboxItem[] = pictures.map((p) => ({ kind: 'image', src: p.currentSrc || p.src, alt: p.alt }))

  return (
    <>
      {/* Spans, because markdown puts an image inside a paragraph, and a figure can't go there. */}
      <span className={className ? undefined : styles.figure}>
      <img
        {...rest}
        ref={thumb}
        src={src}
        alt={alt}
        data-lightbox=""
        className={className ?? styles.thumbnail}
        role="button"
        tabIndex={0}
        onClick={show}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            show()
          }
        }}
      />
      {alt && !className && <span className={styles.caption}>{alt}</span>}
      </span>
      {items.length > 0 && (
        <Lightbox
          className={styles.lightbox}
          items={items}
          index={index}
          open={open}
          onClose={() => setOpen(false)}
          onIndexChange={setIndex}
          origin={(i) => pictures[i]}
          caption={(item) => item.alt}
        />
      )}
    </>
  )
}
