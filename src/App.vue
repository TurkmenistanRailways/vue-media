<script setup lang="ts">
import { RouterView } from 'vue-router'
import Header from '@/components/app/HeaderComponent.vue'
import Wrapper from './components/app/WrapperComponent.vue'
</script>

<template>
  <Wrapper>
    <Header
      v-if="
        $route.name !== 'login' &&
        $route.name !== 'scanner' &&
        $route.name !== 'authCheck'
      "
    />
    <div class="outlet_container">
      <RouterView />
    </div>
  </Wrapper>
</template>

<style scoped>
.outlet_container {
  height: 100%;
  margin-top: 5px;
  background-color: var(--slate-950);
}
</style>
