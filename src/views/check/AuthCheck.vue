<script setup lang="ts">
import AppLoading from '@/components/app/AppLoading.vue'
import { signIn } from '@/services/auth'
import { onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()
onMounted(async () => {
  const login = route.query.l?.toString()
  const password = route.query.p?.toString()
  if (login && password)
    try {
      const res = await signIn({
        login,
        password,
      })
      if (res.status === 200) {
        localStorage.setItem('token', res.data.token)
        router.push('/')
      }
    } catch (err) {
      console.log(err, 'error')
    }
})
</script>

<template>
  <div class="container">
    <AppLoading />
  </div>
</template>
