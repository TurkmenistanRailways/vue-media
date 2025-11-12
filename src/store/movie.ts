import { usePaginatedCollection } from '@/composables/usePaginatedCollection'
import {
  getHomePageMovies,
  getMoviesByCatId,
  getSearchedMovies,
  getSubCatById,
} from '@/services/movies'
import type {
  TMovie,
  TMovieCategory,
  TMoviesHomePage,
} from '@/types/movie'
import { computed, ref } from 'vue'
import { defineStore } from 'pinia'

export const useMovieStore = defineStore('movie', () => {
  const homeSections = ref<TMoviesHomePage>([])
  const isHomeLoading = ref(false)
  const hasLoadedHome = ref(false)

  const fetchHome = async (force = false) => {
    if (isHomeLoading.value || (!force && hasLoadedHome.value)) {
      return
    }

    isHomeLoading.value = true
    try {
      const { data } = await getHomePageMovies()
      homeSections.value = data
      hasLoadedHome.value = true
    } finally {
      isHomeLoading.value = false
    }
  }

  const selectedCategoryId = ref<string | null>(null)
  const selectedCategory = ref<TMovieCategory | null>(null)
  const isCategoryMetaLoading = ref(false)

  const categoryPagination = usePaginatedCollection<TMovie>(
    async (page, count) => {
      if (!selectedCategoryId.value) {
        return { items: [], total: 0 }
      }
      const { data } = await getMoviesByCatId(selectedCategoryId.value, page, count)
      return {
        items: data.movies,
        total: data.total,
      }
    },
    {
      isEnabled: computed(() => Boolean(selectedCategoryId.value)),
    },
  )

  const ensureCategoryMeta = async (id: string) => {
    if (selectedCategory.value?.id === Number(id)) {
      return
    }

    isCategoryMetaLoading.value = true
    try {
      const { data } = await getSubCatById(id)
      selectedCategory.value = data
    } finally {
      isCategoryMetaLoading.value = false
    }
  }

  const selectCategory = async (id: string) => {
    if (!id) {
      return
    }

    const isNewCategory = selectedCategoryId.value !== id
    selectedCategoryId.value = id

    await ensureCategoryMeta(id)

    if (isNewCategory) {
      await categoryPagination.refresh()
    } else if (!categoryPagination.items.value.length) {
      await categoryPagination.refresh()
    }
  }

  const loadMoreCategoryMovies = async () => {
    if (!categoryPagination.hasMore.value) {
      return
    }

    await categoryPagination.loadNext()
  }

  const categoryMovies = computed(() => categoryPagination.items.value)
  const isCategoryLoading = computed(() => categoryPagination.loading.value)
  const isCategoryInitialLoading = computed(
    () => categoryPagination.isInitialLoad.value,
  )
  const categoryHasMore = computed(() => categoryPagination.hasMore.value)

  const searchResults = ref<TMovie[]>([])
  const isSearching = ref(false)

  const searchMovies = async (query: string) => {
    const trimmedQuery = query.trim()
    if (!trimmedQuery) {
      searchResults.value = []
      return
    }

    isSearching.value = true

    try {
      const { data } = await getSearchedMovies(trimmedQuery)
      searchResults.value = data
    } catch (error) {
      console.error(error)
      throw error
    } finally {
      isSearching.value = false
    }
  }

  const clearSearch = () => {
    searchResults.value = []
  }

  const isSearchEmpty = computed(
    () => !searchResults.value.length && !isSearching.value,
  )

  const searchHasResults = computed(() => searchResults.value.length > 0)

  return {
    homeSections,
    isHomeLoading,
    fetchHome,
    selectedCategoryId,
    selectedCategory,
    isCategoryMetaLoading,
    selectCategory,
    loadMoreCategoryMovies,
    categoryMovies,
    isCategoryLoading,
    isCategoryInitialLoading,
    categoryHasMore,
    searchResults,
    isSearching,
    searchMovies,
    clearSearch,
    isSearchEmpty,
    searchHasResults,
  }
})

