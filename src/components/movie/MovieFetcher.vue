<script setup lang="ts">
import MovieItem from '@/components/movie/MovieItem.vue'
import { useInfiniteScroll } from '@/composables/useInfiniteScroll'
import { useMovieStore } from '@/store/movie'
import type { TLang } from '@/types/common'
import type { TMovieCategory } from '@/types/movie'
import { computed, watch } from 'vue'
import { useI18n } from 'vue-i18n'

const props = defineProps<{
  id: string
  data?: TMovieCategory
}>()

const store = useMovieStore()
const { locale } = useI18n()

const isScrollEnabled = computed(
  () => store.categoryHasMore && !store.isCategoryLoading,
)

const { target: loadTrigger } = useInfiniteScroll(
  () => {
    if (!store.isCategoryLoading) {
      void store.loadMoreCategoryMovies()
    }
  },
  {
    threshold: 0.25,
    isEnabled: isScrollEnabled,
  },
)

const heading = computed<TLang | undefined>(() => {
  if (props.data) {
    return props.data.title
  }
  return store.selectedCategory?.title
})

const resolvedHeading = computed(() => {
  if (!heading.value) {
    return ''
  }

  return heading.value[locale.value as keyof TLang]
})

watch(
  () => props.id,
  id => {
    if (id) {
      void store.selectCategory(id)
    }
  },
  { immediate: true },
)
</script>

<template>
  <div class="container" v-if="resolvedHeading || store.categoryMovies.length">
    <h1 v-if="resolvedHeading">{{ resolvedHeading }}</h1>
    <div v-if="store.categoryMovies.length" class="movie_list">
      <MovieItem
        v-for="movie in store.categoryMovies"
        :key="movie.id"
        :movie="movie"
        class="movie-item"
      />
    </div>
    <div v-else class="placeholder">
      <img
        v-if="store.isCategoryLoading || store.isCategoryInitialLoading"
        src="/bars-scale-middle.svg"
        alt="Loading"
      />
      <p v-else>{{ $t('empty_list') }}</p>
    </div>
    <div v-if="store.categoryHasMore" ref="loadTrigger" class="load-trigger">
      <img
        v-if="store.isCategoryLoading"
        src="/bars-scale-middle.svg"
        alt="Loading"
      />
    </div>
  </div>
</template>

<style scoped>
.container {
  width: 95%;
  max-width: var(--max-width);
  margin-inline: auto;
  padding-bottom: 1rem;
}
.movie_list {
  display: flex;
  flex-wrap: wrap;
  flex-grow: 1;
}

.movie_list::-webkit-scrollbar {
  display: none;
}

.movie_list:last-child {
  margin-bottom: 3.3rem;
}

h1 {
  color: var(--slate-300);
  padding-block: 1rem;
  font-size: 1.2rem;
}

.load-trigger {
  color: white;
  text-align: center;
}

.placeholder {
  display: grid;
  place-items: center;
  padding: 2rem 0;
  color: var(--slate-300);
}

@media screen and (min-width: 1120px) and (max-width: 1553px) {
  h1 {
    font-size: 1.5rem;
  }
}
@media screen and (min-width: 2000px) {
  .container {
    width: 100%;
  }
}
</style>
