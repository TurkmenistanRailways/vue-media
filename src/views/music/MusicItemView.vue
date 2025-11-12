<script setup lang="ts">
import { useIsMobile } from '@/composables/useIsMobile'
import { useMusicStore } from '@/store/music'
import formatDuration from '@/utils/formatDuration'
import { onMounted, ref, watch, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
const store = useMusicStore()
const audio_ref = ref<HTMLAudioElement | null>(null)
const timeline = ref<HTMLDivElement>()
const URL = ref('')
const isPaused = ref(true)
const isScrubbing = ref(false)
const route = useRoute()
const router = useRouter()
const currentTimeOfAudio = ref('0:00')
const totalAudioDuration = ref('')
const { isMobile } = useIsMobile()

const onTogglePlayPause = () => {
  if (audio_ref.value?.paused) {
    audio_ref.value?.play()
    isPaused.value = false
  } else {
    audio_ref.value?.pause()
    isPaused.value = true
  }
}

const handlePause = () => {
  isPaused.value = true
}

const timeUpdateHandler = () => {
  currentTimeOfAudio.value = formatDuration(
    parseInt(audio_ref.value?.currentTime.toFixed(2) as string, 10),
  )
  if (audio_ref.value) {
    const percent = audio_ref.value?.currentTime / audio_ref.value?.duration
    timeline.value?.style.setProperty('--progress-position', percent + '')
  }
}

// Timeline

const mouseDownHandler = (e: MouseEvent | TouchEvent) => {
  isScrubbing.value = true
  toggleScrubbing(e)
}

const toggleScrubbing = (e: MouseEvent | TouchEvent) => {
  const rect = timeline.value?.getBoundingClientRect()
  if (!rect) return

  const clientX = e instanceof MouseEvent ? e.clientX : e.touches?.[0]?.clientX
  if (clientX === undefined) return

  const percent =
    Math.min(Math.max(0, clientX - rect.x), rect.width) / rect.width

  timeline.value?.style.setProperty('--progress-position', percent + '')
  if (audio_ref.value) {
    // audio_ref.value.currentTime = percent * audio_ref.value?.duration

    requestAnimationFrame(() => {
      if (audio_ref.value) {
        audio_ref.value.currentTime = percent * audio_ref.value.duration
      }
    })
  }
}

const documentMouseupHandler = () => {
  if (isScrubbing.value) {
    isScrubbing.value = false
  }
}

const documentMouseMoveHandler = (e: MouseEvent) => {
  if (isScrubbing.value) {
    toggleScrubbing(e)
  }
}

const prevHandler = () => {
  const tracks = store.tracks
  if (!tracks.length) {
    return
  }

  const currentIndex =
    tracks.findIndex(item => item.id.toString() === route.params.id) || 0
  const prevIndex = currentIndex === 0 ? tracks.length - 1 : currentIndex - 1
  const prevTrack = tracks[prevIndex]

  if (prevTrack?.path) {
    router.push({ name: 'music-id', params: { id: prevTrack.id } })
  }
}
const nextHandler = () => {
  const tracks = store.tracks
  if (!tracks.length) {
    return
  }

  const currentIndex =
    tracks.findIndex(item => item.id.toString() === route.params.id) || 0
  const nextIndex = currentIndex === tracks.length - 1 ? 0 : currentIndex + 1
  const nextTrack = tracks[nextIndex]

  if (nextTrack?.path) {
    router.push({ name: 'music-id', params: { id: nextTrack.id } })
  }
}

watch(
  () => route.params.id,
  newId => {
    if (newId) {
      URL.value = `${import.meta.env.VITE_API_URL}/uploads/musics/${route.params.id}.mp3`
    }
  },
  { immediate: true },
)

onMounted(() => {
  if (!store.tracks.length) {
    void store.loadInitial()
  }

  if (audio_ref.value) {
    audio_ref.value.addEventListener('loadedmetadata', () => {
      totalAudioDuration.value = formatDuration(audio_ref.value?.duration)
    })
  }
  document.addEventListener('mouseup', documentMouseupHandler)
  document.addEventListener('mousemove', documentMouseMoveHandler)
})

onUnmounted(() => {
  document.removeEventListener('mouseup', documentMouseupHandler)
  document.removeEventListener('mousemove', documentMouseMoveHandler)
})
</script>

<template>
  <div
    class="audio_container"
    :class="{
      paused: isPaused,
      fix_bottom: !isMobile,
    }"
  >
    <audio
      @playing="isPaused = false"
      @timeupdate="timeUpdateHandler"
      @pause="handlePause"
      preload="auto"
      ref="audio_ref"
      autoplay
      :src="URL"
    ></audio>
    <div class="duration-container">
      <div class="current-time">{{ currentTimeOfAudio }}</div>
      <div class="total-time">{{ totalAudioDuration }}</div>
    </div>
    <div>
      <div
        @touchmove="toggleScrubbing"
        @mousedown="mouseDownHandler"
        ref="timeline"
        class="timeline"
      ></div>
    </div>
    <div class="controls">
      <button class="action_btn prev" @click="prevHandler">
        <svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M15.5 15.5L4.875 8L15.5 0.5V15.5ZM3 0.5V15.5H0.5V0.5H3Z"
            fill="white"
          />
        </svg>
      </button>
      <div class="pause_play_icons">
        <button @click="onTogglePlayPause">
          <svg class="pause-icon" viewBox="0 0 24 24">
            <path fill="#000" d="M14,19H18V5H14M6,19H10V5H6V19Z" />
          </svg>

          <svg class="play-icon" viewBox="0 0 24 24">
            <path fill="#000" d="M8,5.14V19.14L19,12.14L8,5.14Z" />
          </svg>
        </button>
      </div>
      <button class="action_btn next" @click="nextHandler">
        <svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M0.5 15.5L11.125 8L0.5 0.5V15.5ZM13 0.5V15.5H15.5V0.5H13Z"
            fill="white"
          />
        </svg>
      </button>
    </div>
  </div>
</template>
<style scoped>
.audio_container {
  position: fixed;
  left: 0;
  bottom: 50px;
  width: 100%;
  height: 60px;
  color: white;
  background-color: var(--slate-800);
}
.fix_bottom {
  bottom: 0;
}
.duration-container {
  position: absolute;
  top: 2%;
  left: 0px;
  display: flex;
  justify-content: space-between;
  width: 100%;
  padding-inline: 2px;
  margin-top: 2px;
}
.timeline {
  position: relative;
  width: 100%;
  height: 5px;
  background-color: rgba(100, 100, 100, 0.932);
}

.timeline::after {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  right: calc(100% - var(--progress-position) * 100%);
  background-color: var(--link-hover);
}

.controls {
  display: flex;
  justify-content: center;
  height: 100%;
  align-items: center;
  width: 100%;
  gap: 1rem;
  padding-bottom: 5px;
}
.controls > .action_btn {
  border: none;
  color: inherit;
  padding: 0;
  bottom: 2px;
  width: 50px;
  height: 50px;
  background-color: transparent;
  cursor: pointer;
}

/* .controls > .prev {
  left: 40%;
}

.controls > .next {
  right: 40%;
} */

.pause_play_icons {
  width: 40px;
  height: 40px;
  left: 50%;
  bottom: 2px;
  display: flex;
  align-items: center;
  border-radius: 50%;
  justify-content: center;
  border-radius: 50%;
  background: var(--slate-200);
}

.pause_play_icons > button {
  border: none;
  color: inherit;
  border-radius: 50%;
  background: var(--slate-200);
  padding: 0;
  width: 50%;
  height: 50%;
  font-size: 1.1rem;
  cursor: pointer;
  opacity: 0.85;
  transition: opacity 150ms ease-in-out;
}

.audio_container.paused .pause-icon {
  display: none;
}

.audio_container:not(.paused) .play-icon {
  display: none;
}

@media screen and (min-width: 900px) {
  .pause_play_icons {
    width: 50px;
    height: 50px;
  }
  .pause_play_icons > button {
    width: 70%;
    height: 70%;
  }
}
</style>
