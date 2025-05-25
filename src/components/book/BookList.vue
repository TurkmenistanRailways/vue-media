<script setup lang="ts">
import BookItem from '@/components/book/BookItem.vue'
import type { TBook } from '@/types/book'
const props = defineProps<{
  books: TBook[]
}>()

const musicClickHandler = (path: string) => {
  if (path) {
    window.open(`${import.meta.env.VITE_API_URL}${path}`, '_blank')
  }
}
</script>
<template>
  <div class="book_list">
    <BookItem
      @book-click="musicClickHandler"
      v-for="book in props.books"
      :key="book.id"
      :book="book"
    />
  </div>
</template>

<style scoped>
.book_list {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
</style>
