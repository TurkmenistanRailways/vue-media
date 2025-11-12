<script setup lang="ts">
import MoviesBySubCatId from '@/components/movie/MovieFetcher.vue'
import { useMovieStore } from '@/store/movie'
import type { TMovieCategory } from '@/types/movie'
import { computed, watch } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const store = useMovieStore()

const selectedCategory = computed<TMovieCategory | undefined>(
  () => store.selectedCategory ?? undefined,
)

watch(
  () => route.params.id,
  id => {
    if (typeof id === 'string') {
      void store.selectCategory(id)
    }
  },
  { immediate: true },
)
</script>

<template>
  <MoviesBySubCatId
    v-if="$route.params.id"
    :id="$route.params.id as string"
    :data="selectedCategory"
  />
</template>
