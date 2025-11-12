<script setup lang="ts">
import AppLoading from '@/components/app/AppLoading.vue'
import MovieItem from '@/components/movie/MovieItem.vue'
import { useMovieStore } from '@/store/movie'
import type { TLang } from '@/types/common'
import { computed, watch } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const store = useMovieStore()

const heading = {
  id: 1,
  title: {
    tk: 'Gözleg sözüňiz',
    ru: 'Результаты поиска',
  } as TLang,
}

const headingTitle = computed(
  () => heading.title[$i18n.locale as keyof TLang],
)

const activeQuery = computed(() =>
  typeof route.params.search === 'string' ? route.params.search.trim() : '',
)

watch(
  activeQuery,
  query => {
    if (query) {
      void store.searchMovies(query)
    } else {
      store.clearSearch()
    }
  },
  { immediate: true },
)
</script>

<template>
  <AppLoading v-if="store.isSearching" />
  <div v-else class="container">
    <h1 v-if="store.searchHasResults && activeQuery">
      {{ headingTitle }} "{{ activeQuery }}"
    </h1>
    <div
      v-if="store.searchHasResults && activeQuery"
      class="movies_by_search"
    >
      <MovieItem
        v-for="movie in store.searchResults"
        :key="movie.id"
        :movie="movie"
        class="movie-item"
      />
    </div>
    <div v-else-if="activeQuery" class="empty_state">
      <p>{{ $t('movie_not_found') }}</p>
    </div>
    <div v-else class="empty_state">
      <p>{{ $t('search') }}</p>
    </div>
  </div>
</template>

<style scoped>
.container {
  width: 90%;
  margin-inline: auto;
  overflow-x: scroll;
}
.movies_by_search {
  display: flex;
  flex-wrap: wrap;
  flex-grow: 1;
}

h1 {
  color: var(--slate-300);
  padding-block: 1rem;
  font-size: 1.2rem;
}
.empty_state {
  display: grid;
  place-items: center;
  padding: 2rem 0;
  color: var(--slate-300);
}

@media screen and (min-width: 1120px) and (max-width: 1680px) {
  h1 {
    font-size: 2rem;
  }
}

@media screen and (min-width: 1681px) {
  h1 {
    font-size: 2rem;
  }
}
</style>
