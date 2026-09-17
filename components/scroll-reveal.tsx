"use client"

import { useEffect } from "react"

/**
 * Progressive-enhancement scroll reveal.
 *
 * Elements opt in with `className="reveal"`. Nothing is hidden until this
 * component mounts and adds `js-reveal` to <html>, so if JS never runs (or
 * the user prefers reduced motion) the page renders fully visible.
 */
export function ScrollReveal() {
  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    if (reduced) return

    const root = document.documentElement
    root.classList.add("js-reveal")

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-revealed")
            observer.unobserve(entry.target)
          }
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.05 },
    )

    const observe = () => {
      for (const el of document.querySelectorAll(".reveal:not(.is-revealed)")) {
        observer.observe(el)
      }
    }
    observe()

    // Catch nodes added later (filtered grids, async data).
    const mutations = new MutationObserver(observe)
    mutations.observe(document.body, { childList: true, subtree: true })

    return () => {
      observer.disconnect()
      mutations.disconnect()
      root.classList.remove("js-reveal")
    }
  }, [])

  return null
}
