import { useState, useCallback, type ComponentPropsWithoutRef } from 'react'
import * as Dialog from '@radix-ui/react-dialog'
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
      <Dialog.Trigger asChild>
        <img
          src={src}
          alt={alt}
          role="button"
          tabIndex={0}
          onKeyDown={handleKeyDown}
          className={styles.thumbnail}
          {...rest}
        />
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay className={styles.overlay} />
        <Dialog.Content className={styles.content} aria-label={alt || 'Image'}>
          <img src={src} alt={alt} className={styles.fullImage} />
          {alt && <p className={styles.caption}>{alt}</p>}
          <Dialog.Close className={styles.close} aria-label="Close">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M18 6 6 18" />
              <path d="m6 6 12 12" />
            </svg>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
