<template>
  <div>
    <div class="container">
      <p>{{ $t('scan_desc') }}</p>
      <div ref="qrCodeRegion" id="qr-reader"></div>
      <button @click="stopScanner" class="stop-scanner-btn">
        Stop Scanner
      </button>
    </div>
    <p v-if="qrCodeResult">Scanned QR Code: {{ qrCodeResult }}</p>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onBeforeUnmount, ref } from 'vue'
import { Html5Qrcode } from 'html5-qrcode'
import { useRouter } from 'vue-router'
import { auth } from '@/services/auth'

const qrCodeRegion = ref<HTMLDivElement | null>(null)
const qrCodeResult = ref<string | null>(null)
let html5QrCode: Html5Qrcode | null = null
const router = useRouter()
const qrCodeSuccessCallback = async (decodedText: string) => {
  const value: string = JSON.parse(decodedText)
  const token = value.split('=')[1]
  if (token) {
    try {
      const res = await auth(token)
      if (res.status === 200) {
        localStorage.setItem('token', res.data.token)
        stopScanner()
        router.push('/')
      }
    } catch {
      stopScanner()
      router.push({ path: '/login' })
    }
  }
}

const config = {
  fps: 20,
  qrbox: 250,
}

const startScanner = async () => {
  if (!qrCodeRegion.value) return

  html5QrCode = new Html5Qrcode(qrCodeRegion.value.id)
  try {
    const devices = await Html5Qrcode.getCameras()
    if (devices && devices.length) {
      await html5QrCode.start(
        { facingMode: 'environment' },
        config,
        qrCodeSuccessCallback,
        error => {
          console.log(error, 'error in scanning')
        },
      )
    } else {
      console.error('No camera devices found')
    }
  } catch (err) {
    console.error('QR Code Scanner Error', err)
  }
}

const stopScanner = async () => {
  if (html5QrCode?.isScanning) {
    await html5QrCode.stop()
    await html5QrCode.clear()
    html5QrCode = null
  }
  router.push({ path: '/login' })
}

onMounted(() => {
  startScanner()
})

onBeforeUnmount(() => {
  stopScanner()
})
</script>

<style scoped>
.container {
  height: 100vh;
  width: 300px;
  margin: auto;
  display: flex;
  flex-direction: column;
  gap: 5px;
  justify-content: center;
  align-items: center;
}

.container > p {
  color: white;
}
#qr-reader {
  border: 1px solid #ccc;
  border-radius: 8px;
  overflow: hidden;
  width: 100%;
  height: auto;
}

.stop-scanner-btn {
  width: 100%;
  outline: none;
  padding: 10px;
  border-radius: 5px;
  background-color: aliceblue;
}
</style>
