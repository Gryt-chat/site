import { useRef, useState, type ComponentPropsWithoutRef } from 'react'
import { Lightbox } from 'react-motion-lightbox'
import 'react-motion-lightbox/styles.css'
import styles from './Lightbox.module.css'

export function LightboxImage({
  src,
  alt,
  ...rest
}: ComponentPropsWithoutRef<'img'>) {
  const thumb = useRef<HTMLImageElement>(null)
  const [open, setOpen] = useState(false)

  return (
    <>
      <img
        {...rest}
        ref={thumb}
        src={src}
        alt={alt}
        className={styles.thumbnail}
        role="button"
        tabIndex={0}
        onClick={() => setOpen(true)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            setOpen(true)
          }
        }}
      />
      {src && (
        <Lightbox
          className={styles.lightbox}
          items={[{ kind: 'image', src, alt }]}
          index={0}
          open={open}
          onClose={() => setOpen(false)}
          origin={() => thumb.current}
          caption={(item) => item.alt}
        />
      )}
    </>
  )
}
