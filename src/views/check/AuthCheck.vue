<script setup lang="ts">
import AppLoading from '@/components/app/AppLoading.vue'
import { auth } from '@/services/auth'
import { onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()
onMounted(async () => {
  const token = route.query.q?.toString()
  if (token) {
    try {
      const res = await auth(token)
      if (res.status === 200) {
        localStorage.setItem('token', res.data.token)
        router.push('/')
      }
    } catch (err) {
      console.log(err, 'error')
    }
  }
})
</script>

<template>
  <div class="container">
    <AppLoading />
  </div>
</template>
