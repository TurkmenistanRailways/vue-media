import { computed, ref, unref, type MaybeRefOrGetter } from 'vue'

export interface PaginatedFetchResult<TItem> {
  items: TItem[]
  total: number
}

export type PaginatedFetchFn<TItem> = (
  page: number,
  pageSize: number,
) => Promise<PaginatedFetchResult<TItem>>

export interface UsePaginatedCollectionOptions {
  initialPage?: number
  pageSize?: number
  isEnabled?: MaybeRefOrGetter<boolean>
}

export const usePaginatedCollection = <TItem>(
  fetchFn: PaginatedFetchFn<TItem>,
  options: UsePaginatedCollectionOptions = {},
) => {
  const initialPage = options.initialPage ?? 1
  const pageSize = options.pageSize ?? 10

  const page = ref(initialPage)
  const items = ref<TItem[]>([])
  const total = ref(0)
  const loading = ref(false)
  const error = ref<unknown>(null)

  const hasMore = computed(() => items.value.length < total.value)
  const isInitialLoad = computed(
    () => loading.value && items.value.length === 0 && !error.value,
  )

  const resetState = () => {
    page.value = initialPage
    items.value = []
    total.value = 0
    error.value = null
  }

  const load = async ({ reset = false }: { reset?: boolean } = {}) => {
    if (loading.value) {
      return
    }

    if (options.isEnabled !== undefined && !unref(options.isEnabled)) {
      return
    }

    loading.value = true
    error.value = null

    if (reset) {
      resetState()
    }

    try {
      const { items: newItems, total: newTotal } = await fetchFn(
        page.value,
        pageSize,
      )

      total.value = newTotal

      if (reset) {
        items.value = [...newItems]
      } else {
        items.value = [...items.value, ...newItems]
      }

      if (items.value.length < total.value) {
        page.value += 1
      }
    } catch (err) {
      error.value = err
      throw err
    } finally {
      loading.value = false
    }
  }

  const refresh = async () => load({ reset: true })
  const loadNext = async () => load()

  return {
    items,
    total,
    page,
    pageSize,
    loading,
    error,
    hasMore,
    isInitialLoad,
    refresh,
    loadNext,
    reset: resetState,
  }
}
