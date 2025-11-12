import { usePaginatedCollection } from '@/composables/usePaginatedCollection'
import { getMusicAll } from '@/services/music'
import type { TMusic } from '@/types/music'
import { computed } from 'vue'
import { defineStore } from 'pinia'

export const useMusicStore = defineStore('music', () => {
  const pagination = usePaginatedCollection<TMusic>(async (page, count) => {
    const { data } = await getMusicAll(page, count)
    return {
      items: data.musics,
      total: data.total,
    }
  })

  const tracks = computed(() => pagination.items.value)
  const total = computed(() => pagination.total.value)
  const isLoading = computed(() => pagination.loading.value)
  const hasMore = computed(() => pagination.hasMore.value)
  const isInitialLoading = computed(() => pagination.isInitialLoad.value)

  const loadInitial = () => pagination.refresh()
  const loadMore = () => pagination.loadNext()
  const reset = () => pagination.reset()

  return {
    tracks,
    total,
    isLoading,
    isInitialLoading,
    hasMore,
    loadInitial,
    loadMore,
    reset,
  }
})
