'use client'

import { useEffect } from 'react'

export function TwemojiInit() {
  useEffect(() => {
    // @ts-ignore
    import('@twemoji/api').then(({ default: twemoji }) => {
      twemoji.parse(document.body, {
        folder: 'svg',
        ext: '.svg',
        base: 'https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/',
        className: 'emoji',
      })

      // Re-parse em mutações do DOM (animações, tickers, etc.)
      const observer = new MutationObserver((mutations) => {
        mutations.forEach(m => {
          m.addedNodes.forEach(node => {
            if (node.nodeType === 1) {
              twemoji.parse(node as HTMLElement, {
                folder: 'svg',
                ext: '.svg',
                base: 'https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/',
                className: 'emoji',
              })
            }
          })
        })
      })

      observer.observe(document.body, { childList: true, subtree: true })
      return () => observer.disconnect()
    })
  }, [])

  return null
}
