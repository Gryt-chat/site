import { useState, useCallback, type ComponentPropsWithoutRef } from 'react'
import { Dialog } from '@gryt/ui'
import { MdClose } from 'react-icons/md'
import styles from './Lightbox.module.css'

export function LightboxImage({
  src,
  alt,
  ...rest
}: ComponentPropsWithoutRef<'img'>) {
  const [open, setOpen] = useState(false)

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault()
        setOpen(true)
      }
    },
    [],
  )

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger
        className={styles.thumbnail}
        onKeyDown={handleKeyDown}
        render={<img alt={alt} src={src} {...rest} />}
      />

      <Dialog.Portal>
        <Dialog.Backdrop className={styles.overlay} />
        <Dialog.Popup className={styles.content} aria-label={alt || 'Image'}>
          <img src={src} alt={alt} className={styles.fullImage} />
          {alt && <p className={styles.caption}>{alt}</p>}
          <Dialog.Close
            aria-label="Close"
            className={styles.close}
            render={<button type="button" />}
          >
            <MdClose size={24} />
          </Dialog.Close>
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
