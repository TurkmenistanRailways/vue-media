<script setup lang="ts">
import AppLoading from '@/components/app/AppLoading.vue'
import Wrapper from '@/components/app/WrapperComponent.vue'
import MusicList from '@/components/music/MusicList.vue'
import { useInfiniteScroll } from '@/composables/useInfiniteScroll'
import { useMusicStore } from '@/store/music'
import { computed, onMounted } from 'vue'

const store = useMusicStore()

const isScrollEnabled = computed(() => store.hasMore && !store.isLoading)
const { target: loadMoreTrigger } = useInfiniteScroll(
  () => {
    if (!store.isLoading) {
      void store.loadMore()
    }
  },
  {
    threshold: 0.25,
    rootMargin: '16px',
    isEnabled: isScrollEnabled,
  },
)

onMounted(() => {
  store.reset()
  void store.loadInitial()
})
</script>

<template>
  <Wrapper>
    <AppLoading v-if="store.isInitialLoading" />
    <div class="music_container">
      <MusicList v-if="store.tracks.length" :music-all="store.tracks" />
      <p v-else-if="!store.isLoading" class="empty_state">{{ $t('empty_list') }}</p>
      <router-view />
      <div v-if="store.hasMore" ref="loadMoreTrigger" class="load-trigger">
        <img v-if="store.isLoading" src="/bars-scale-middle.svg" alt="Loading" />
      </div>
    </div>
  </Wrapper>
</template>

<style scoped>
.music_container {
  position: relative;
}

.load-trigger {
  color: white;
  font-size: 1.2rem;
  text-align: center;
  padding: 1rem 0;
}

.empty_state {
  color: var(--slate-300);
  text-align: center;
  padding: 2rem 0;
}
</style>
