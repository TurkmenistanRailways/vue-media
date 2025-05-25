<script setup lang="ts">
import { signIn } from '@/services/auth'
import { ref } from 'vue'
import { useRouter } from 'vue-router'
const login = ref('')
const password = ref('')
const showPassword = ref(false)
const router = useRouter()
const submitHandler = async (e: Event) => {
  e.preventDefault()
  try {
    const res = await signIn({ login: login.value, password: password.value })
    if (res.status === 200) {
      localStorage.setItem('token', res.data.token)
      router.push('/')
    }
  } catch {
    alert('Girizen maglumatlaryňyz Nädogry !!!')
  }
}
const onScanButton = (e: Event) => {
  e.preventDefault()
  router.push({ path: '/scanner' })
}
</script>
<template>
  <form @submit="submitHandler">
    <div class="form-group">
      <label for="login">{{ $t('booking_number') }}</label>
      <input v-model="login" type="text" id="booking" />
    </div>
    <div class="form-group">
      <label for="exampleInputPassword1">{{ $t('password') }}</label>
      <input
        v-model="password"
        :type="showPassword ? 'text' : 'password'"
        id="password"
      />
      <div
        @click="showPassword = !showPassword"
        class="show_password_container"
      >
        <div class="show_password">
          {{ showPassword ? $t('hide') : $t('show') }}
        </div>
      </div>
    </div>
    <div class="form-group">
      <button type="submit">Içeri giriň</button>
      <button @click="onScanButton" class="scanner-btn">Scan Qrcode</button>
    </div>
  </form>
</template>

<style scoped>
form {
  width: 100%;
  height: fit-content;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding-inline: 20px;
}
.form-group {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: start;
  justify-content: center;
  gap: 3px;
}
.form-group > input {
  width: 100%;
  padding: 10px;
  border: none;
  outline: none;
  border-radius: 4px;
  background-color: var(--slate-800);
  color: var(--slate-300);
}
.form-group > label {
  color: var(--slate-200);
}
.form-group > button {
  width: 100%;
  padding: 6px;
  margin-top: 1rem;
  background-color: var(--link-hover);
  border: none;
  font-size: 1rem;
  border-radius: 4px;
  text-transform: capitalize;
  font-weight: bold;
  color: var(--slate-950);
}

.show_password_container {
  position: absolute;
  cursor: pointer;
  color: var(--link-hover);
  right: 0;
  bottom: 2px;
  background-color: aquamarine;
  height: 50%;
  background-color: transparent;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 4;
}

.form-group > .scanner-btn {
  background-color: rgb(182, 185, 255);
}

.show_password_container > .show_password {
  padding-right: 3px;
}

input:-webkit-autofill {
  background-color: var(--slate-800) !important;
}

@media screen and (min-width: 900px) {
  form {
    width: 340px;
  }
}
</style>
