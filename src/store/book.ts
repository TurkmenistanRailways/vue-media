import { usePaginatedCollection } from '@/composables/usePaginatedCollection'
import { getBooks } from '@/services/book'
import type { TBook } from '@/types/book'
import { computed } from 'vue'
import { defineStore } from 'pinia'

export const useBookStore = defineStore('book', () => {
  const pagination = usePaginatedCollection<TBook>(async (page, count) => {
    const { data } = await getBooks(page, count)
    return {
      items: data.books,
      total: data.total,
    }
  })

  const books = computed(() => pagination.items.value)
  const total = computed(() => pagination.total.value)
  const isLoading = computed(() => pagination.loading.value)
  const hasMore = computed(() => pagination.hasMore.value)
  const isInitialLoading = computed(() => pagination.isInitialLoad.value)

  const loadInitial = () => pagination.refresh()
  const loadMore = () => pagination.loadNext()
  const reset = () => pagination.reset()

  return {
    books,
    total,
    isLoading,
    isInitialLoading,
    hasMore,
    loadInitial,
    loadMore,
    reset,
  }
})
