<script setup lang="ts">
import AppLoading from '@/components/app/AppLoading.vue'
import MovieList from '@/components/movie/MovieList.vue'
import { useMovieStore } from '@/store/movie'
import { onMounted } from 'vue'

const movieStore = useMovieStore()

onMounted(() => {
  void movieStore.fetchHome()
})
</script>

<template>
  <AppLoading v-if="movieStore.isHomeLoading && !movieStore.homeSections.length" />
  <div v-else>
    <div class="movie-list-home" v-if="movieStore.homeSections.length">
      <MovieList
        v-for="section in movieStore.homeSections"
        :key="section.id"
        :movies="section"
        class="movie-list-home"
      />
    </div>
    <p v-else class="empty_state">{{ $t('empty_list') }}</p>
  </div>
</template>

<style scoped>
.movie-list-home:last-child {
  margin-bottom: 3.5rem;
  max-width: var(--max-width);
  margin-inline: auto;
  padding-left: 4px;
}

.empty_state {
  color: var(--slate-300);
  text-align: center;
  padding: 2rem 0;
}
</style>
