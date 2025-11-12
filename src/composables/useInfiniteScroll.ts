import { onBeforeUnmount, ref, unref, watch, type MaybeRefOrGetter } from 'vue'

export interface UseInfiniteScrollOptions extends IntersectionObserverInit {
  isEnabled?: MaybeRefOrGetter<boolean>
}

export const useInfiniteScroll = (
  onIntersect: () => void,
  { isEnabled, ...observerOptions }: UseInfiniteScrollOptions = {},
) => {
  const target = ref<HTMLElement | null>(null)
  let observer: IntersectionObserver | null = null

  const cleanup = () => {
    if (observer) {
      if (target.value) {
        observer.unobserve(target.value)
      }
      observer.disconnect()
      observer = null
    }
  }

  const ensureObserver = () => {
    if (!observer) {
      observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            onIntersect()
          }
        })
      }, observerOptions)
    }
  }

  const tryObserve = () => {
    const enabled = isEnabled === undefined || unref(isEnabled)
    if (!enabled || !target.value) {
      return
    }

    ensureObserver()
    observer!.observe(target.value)
  }

  watch(
    () => target.value,
    (element, previousElement) => {
      if (observer && previousElement) {
        observer.unobserve(previousElement)
      }

      if (!element) {
        return
      }

      tryObserve()
    },
    { flush: 'post' },
  )

  if (isEnabled !== undefined) {
    watch(
      () => unref(isEnabled),
      enabled => {
        if (!enabled) {
          cleanup()
        } else {
          tryObserve()
        }
      },
    )
  }

  onBeforeUnmount(() => {
    cleanup()
  })

  return { target }
}
