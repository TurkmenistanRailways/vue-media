<template>
  <div class="header">
    <div class="header_container">
      <img
        src="@/assets/img/logo.svg"
        alt="logo"
        @click="() => $router.push('/')"
      />

      <CategoryMenu
        v-if="$route.name?.toString().includes('movie') && isMobile"
        :categories="categories"
      />
      <div class="links">
        <ul>
          <li v-for="link in links" :key="link.name">
            <RouterLink
              :class="
                $route.path?.toString().includes(link.name)
                  ? 'router-link-active'
                  : ''
              "
              :to="link.path"
              >{{ $t(link.name) }}</RouterLink
            >
            <CategoryLinks :categories="categories" :link="link" />
          </li>
        </ul>
      </div>
      <div class="header_logo_search">
        <Search v-if="!isMobile" />
        <Locales />
      </div>
    </div>
  </div>
  <BottomMenu v-if="isMobile" />
</template>

<style scoped>
.header {
  position: relative;
  height: 90px;
}
.header_container {
  position: fixed;
  max-width: var(--max-width);
  margin-inline: auto;
  padding: 0.6rem 0.5rem;
  background: linear-gradient(to bottom, rgba(0, 0, 0, 2), rgba(0, 0, 0, 0.9));
  display: flex;
  justify-content: space-between;
  align-items: center;
  top: 0;
  left: 0;
  right: 0;
  z-index: 105;
}

.header_logo_search {
  display: flex;
  align-items: center;
  gap: 2rem;
}

.links {
  margin-inline: 2rem;
  position: relative;
}

.links > ul {
  display: flex;
  gap: 2rem;
}

.links > ul > li {
  position: relative;
}

img {
  width: 10rem;
  cursor: pointer;
}

ul {
  padding: 0px;
  list-style: none;
}

a {
  text-transform: uppercase;
  text-decoration: none;
  font-size: 1.4rem;
  color: rgb(148 163 184);
}

a:hover {
  color: var(--link-hover);
}

@media screen and (max-width: 768px) {
  .header_logo_search > img {
    width: 7rem;
  }
  .header {
    height: 60px;
  }
  .header_container {
    padding: 0.3rem;
  }
  .menu {
    display: block;
  }
  a {
    font-size: 1rem;
  }
  img {
    width: 8rem;
  }
  .links {
    display: none;
  }
}
</style>

<script setup lang="ts">
import { getMovieCategories } from '@/services/movies'
import Locales from '@/components/app/LocalesComponent.vue'
import CategoryMenu from '@/components/app/CategoryMenu.vue'
import type { TMovieCategory } from '@/types/movie'
import { onMounted, onUnmounted, ref } from 'vue'
import { RouterLink } from 'vue-router'
import Search from './SearchComponent.vue'
import BottomMenu from '@/components/app/BottomMenu.vue'
import { links } from '@/utils/links'
import { useIsMobile } from '@/composables/useIsMobile'
import CategoryLinks from '@/components/app/CategoryLinks.vue'
const { isMobile } = useIsMobile()
const categories = ref<TMovieCategory[]>([])
const menuIsOpened = ref(false)
const menu = ref<HTMLDivElement>()
const handleClickOutside = (event: MouseEvent) => {
  if (
    menuIsOpened.value &&
    menu.value &&
    !menu.value.contains(event.target as Node)
  ) {
    menuIsOpened.value = false
  }
}

onMounted(async () => {
  document.addEventListener('click', handleClickOutside)

  try {
    if (localStorage.getItem('token')) {
      const res = await getMovieCategories()
      categories.value = res.data
    }
  } catch (err) {
    console.log(err)
  }
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>
