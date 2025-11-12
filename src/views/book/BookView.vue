<script setup lang="ts">
import AppLoading from '@/components/app/AppLoading.vue'
import Wrapper from '@/components/app/WrapperComponent.vue'
import BookList from '@/components/book/BookList.vue'
import { useInfiniteScroll } from '@/composables/useInfiniteScroll'
import { useBookStore } from '@/store/book'
import { computed, onMounted } from 'vue'

const store = useBookStore()

const isScrollEnabled = computed(() => store.hasMore && !store.isLoading)
const { target: loadMoreTrigger } = useInfiniteScroll(
  () => {
    if (!store.isLoading) {
      void store.loadMore()
    }
  },
  {
    threshold: 0.25,
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
    <div class="book_container">
      <BookList v-if="store.books.length" :books="store.books" />
      <p v-else-if="!store.isLoading" class="empty_state">{{ $t('empty_list') }}</p>
      <div
        v-if="store.hasMore"
        ref="loadMoreTrigger"
        class="load-trigger"
      >
        <img v-if="store.isLoading" src="/bars-scale-middle.svg" alt="Loading" />
      </div>
    </div>
  </Wrapper>
</template>

<style scoped>
.book_container {
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
