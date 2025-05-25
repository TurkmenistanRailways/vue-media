<script setup lang="ts">
import { useMusicStore } from '@/store/music'
import MusicList from '@/components/music/MusicList.vue'
import { onMounted, onUnmounted, ref, watch } from 'vue'
import AppLoading from '@/components/app/AppLoading.vue'
import Wrapper from '@/components/app/WrapperComponent.vue'
const store = useMusicStore()
const loadTrigger = ref(null)
let observer: IntersectionObserver | null = null
const createObserver = () => {
  const options = {
    root: null,
    rootMargin: '10px',
    threshold: 1.0, // Trigger when 100% of element is in view
  }

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting && store.hasMore && !store.loading) {
        store.getMusic()
      }
    })
  }, options)

  if (loadTrigger.value) {
    observer.observe(loadTrigger.value)
  }
}

// Watch for the element reference and start observing once it’s available
watch(loadTrigger, newVal => {
  if (newVal) createObserver()
})

onMounted(() => {
  createObserver()
  store.page = 1
  store.getMusic()
})

onUnmounted(() => {
  if (observer) {
    observer.disconnect()
    observer = null
  }
})
</script>
<template>
  <Wrapper>
    <AppLoading v-if="store.loading" />
    <div class="music_container">
      <MusicList
        v-if="store.music?.musics.length"
        :music-all="store.music?.musics"
      />
      <router-view />
      <div
        ref="loadTrigger"
        class="load-trigger"
        v-if="!store.loading && store.hasMore"
      >
        <img src="/bars-scale-middle.svg" alt="" />
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
</style>
