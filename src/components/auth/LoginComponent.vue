<script setup lang="ts">
import { signIn } from '@/services/auth'
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const router = useRouter()

const login = ref('')
const password = ref('')
const showPassword = ref(false)
const isLoading = ref(false)
const errorMessage = ref('')

const appVersion = import.meta.env.VITE_APP_VERSION

const submitHandler = async (e: Event) => {
  e.preventDefault()
  errorMessage.value = ''
  isLoading.value = true

  try {
    const res = await signIn({ login: login.value, password: password.value })
    if (res.status === 200) {
      localStorage.setItem('token', res.data.token)
      router.push('/')
    }
  } catch {
    errorMessage.value = t('login_error')
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <div class="login-page">
    <!-- Left: Hero Panel (desktop only) -->
    <div class="hero-panel">
      <div class="hero-bg"></div>
      <div class="hero-overlay"></div>
      <div class="hero-content">
        <div class="hero-logo">
          <img src="/loader.svg" alt="Mediaportal" />
        </div>
        <h1 class="hero-title">Mediaportal</h1>
        <p class="hero-tagline">{{ t('login_subtitle') }}</p>
      </div>
    </div>

    <!-- Right: Form Panel -->
    <div class="form-panel">
      <div class="form-bg"></div>
      <div class="form-bg-overlay"></div>

      <div class="form-container">
        <!-- Mobile-only branding -->
        <div class="mobile-branding">
          <div class="mobile-logo">
            <img src="/loader.svg" alt="Mediaportal" />
          </div>
          <h1 class="mobile-title">Mediaportal</h1>
          <p class="mobile-subtitle">{{ t('login_subtitle') }}</p>
        </div>

        <!-- Login Form Card -->
        <form @submit="submitHandler" class="login-form" novalidate>
          <!-- Error Message -->
          <Transition name="shake">
            <div v-if="errorMessage" class="error-banner" role="alert">
              <svg class="error-icon" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
              </svg>
              <span>{{ errorMessage }}</span>
            </div>
          </Transition>

          <!-- Booking Number -->
          <div class="field">
            <label for="login-input">{{ t('booking_number') }}</label>
            <div class="input-wrapper">
              <svg class="field-icon" viewBox="0 0 20 20" fill="currentColor">
                <path d="M2 6a2 2 0 012-2h12a2 2 0 012 2v2a2 2 0 100 4v2a2 2 0 01-2 2H4a2 2 0 01-2-2v-2a2 2 0 100-4V6z" />
              </svg>
              <input
                id="login-input"
                v-model="login"
                type="text"
                :placeholder="t('booking_placeholder')"
                required
                autocomplete="username"
                :disabled="isLoading"
              />
            </div>
          </div>

          <!-- Password -->
          <div class="field">
            <label for="password-input">{{ t('password') }}</label>
            <div class="input-wrapper">
              <svg class="field-icon" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clip-rule="evenodd" />
              </svg>
              <input
                id="password-input"
                v-model="password"
                :type="showPassword ? 'text' : 'password'"
                placeholder="&#x2022;&#x2022;&#x2022;&#x2022;&#x2022;&#x2022;&#x2022;&#x2022;"
                required
                autocomplete="current-password"
                :disabled="isLoading"
              />
              <button
                type="button"
                class="toggle-password"
                :aria-label="showPassword ? t('hide') : t('show')"
                @click="showPassword = !showPassword"
              >
                <!-- Eye open -->
                <svg v-if="!showPassword" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                  <path fill-rule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clip-rule="evenodd" />
                </svg>
                <!-- Eye closed -->
                <svg v-else viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z" clip-rule="evenodd" />
                  <path d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.065 7 9.542 7 .847 0 1.669-.105 2.454-.303z" />
                </svg>
              </button>
            </div>
          </div>

          <!-- Submit Button -->
          <button type="submit" class="submit-btn" :disabled="isLoading">
            <svg
              v-if="isLoading"
              class="spinner"
              viewBox="0 0 24 24"
              fill="none"
            >
              <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="3" opacity="0.25" />
              <path d="M12 2a10 10 0 019.95 9" stroke="currentColor" stroke-width="3" stroke-linecap="round" />
            </svg>
            <span v-else>{{ t('login') }}</span>
          </button>
        </form>

        <!-- Version -->
        <div class="version">
          <span>v{{ appVersion }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* ── Layout ────────────────────────────────────── */
.login-page {
  display: flex;
  min-height: 100vh;
  min-height: 100dvh;
  background: var(--slate-950);
}

/* ── Hero Panel (left side, desktop) ───────────── */
.hero-panel {
  display: none;
  position: relative;
  flex: 1.1;
  overflow: hidden;
}

.hero-bg {
  position: absolute;
  inset: 0;
  background: url('/login_bg.png') center / cover no-repeat;
}

.hero-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    135deg,
    rgba(2, 6, 23, 0.75) 0%,
    rgba(2, 6, 23, 0.45) 50%,
    rgba(2, 6, 23, 0.7) 100%
  );
}

.hero-content {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  padding: 3rem;
  text-align: center;
  color: #fff;
}

.hero-logo {
  width: 80px;
  height: 80px;
  margin-bottom: 1.5rem;
  filter: drop-shadow(0 0 20px rgba(54, 192, 242, 0.35));
  animation: float 4s ease-in-out infinite;
}

.hero-logo img {
  width: 100%;
  height: 100%;
}

.hero-title {
  font-size: 2.75rem;
  font-weight: 700;
  letter-spacing: -1px;
  margin-bottom: 1rem;
  background: linear-gradient(135deg, #ffffff 0%, var(--link-hover) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.hero-tagline {
  font-size: 1.05rem;
  color: var(--slate-400);
  max-width: 380px;
  line-height: 1.7;
}

/* ── Form Panel (right side) ───────────────────── */
.form-panel {
  position: relative;
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.form-bg {
  position: absolute;
  inset: 0;
  background: url('/login_bg.png') center / cover no-repeat;
}

.form-bg-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    180deg,
    rgba(2, 6, 23, 0.5) 0%,
    rgba(2, 6, 23, 0.8) 60%,
    rgba(2, 6, 23, 0.95) 100%
  );
}

.form-container {
  position: relative;
  z-index: 1;
  width: 100%;
  max-width: 400px;
  padding: 2rem 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

/* ── Mobile Branding ───────────────────────────── */
.mobile-branding {
  text-align: center;
  animation: fadeUp 0.6s ease-out;
}

.mobile-logo {
  width: 56px;
  height: 56px;
  margin: 0 auto 1rem;
  filter: drop-shadow(0 0 16px rgba(54, 192, 242, 0.3));
}

.mobile-logo img {
  width: 100%;
  height: 100%;
}

.mobile-title {
  font-size: 2rem;
  font-weight: 700;
  color: #fff;
  margin-bottom: 0.5rem;
  letter-spacing: -0.5px;
}

.mobile-subtitle {
  font-size: 0.9rem;
  color: var(--slate-400);
  line-height: 1.6;
  max-width: 320px;
  margin: 0 auto;
}

/* ── Login Form ────────────────────────────────── */
.login-form {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  animation: fadeUp 0.6s ease-out 0.1s both;
}

/* ── Error Banner ──────────────────────────────── */
.error-banner {
  display: flex;
  align-items: center;
  gap: 0.625rem;
  padding: 0.75rem 1rem;
  background: rgba(239, 68, 68, 0.12);
  border: 1px solid rgba(239, 68, 68, 0.3);
  border-radius: 10px;
  color: #fca5a5;
  font-size: 0.875rem;
  font-weight: 500;
}

.error-icon {
  width: 18px;
  height: 18px;
  flex-shrink: 0;
  color: #f87171;
}

.shake-enter-active {
  animation: shakeIn 0.4s ease-out;
}

.shake-leave-active {
  transition: opacity 0.2s ease;
}

.shake-leave-to {
  opacity: 0;
}

/* ── Form Fields ───────────────────────────────── */
.field {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.field label {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--slate-300);
}

.input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.field-icon {
  position: absolute;
  left: 0.875rem;
  width: 18px;
  height: 18px;
  color: var(--slate-500);
  pointer-events: none;
  transition: color 0.2s;
}

.input-wrapper:focus-within .field-icon {
  color: var(--link-hover);
}

.field input {
  width: 100%;
  padding: 0.8rem 1rem 0.8rem 2.75rem;
  background: rgba(15, 23, 42, 0.6);
  border: 1.5px solid rgba(100, 116, 139, 0.3);
  border-radius: 10px;
  color: var(--slate-100);
  font-size: 0.95rem;
  font-family: inherit;
  transition: border-color 0.2s, box-shadow 0.2s, background 0.2s;
}

.field input:focus {
  outline: none;
  border-color: var(--link-hover);
  background: rgba(15, 23, 42, 0.8);
  box-shadow: 0 0 0 3px rgba(54, 192, 242, 0.15);
}

.field input::placeholder {
  color: var(--slate-600);
}

.field input:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* ── Password Toggle ───────────────────────────── */
.toggle-password {
  position: absolute;
  right: 0.75rem;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  background: none;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  color: var(--slate-500);
  transition: color 0.2s, background 0.2s;
}

.toggle-password svg {
  width: 18px;
  height: 18px;
}

.toggle-password:hover {
  color: var(--slate-300);
  background: rgba(100, 116, 139, 0.15);
}

.password-field input {
  padding-right: 3rem;
}

/* ── Submit Button ─────────────────────────────── */
.submit-btn {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 48px;
  margin-top: 0.25rem;
  background: linear-gradient(135deg, var(--link-hover) 0%, #2a8fd4 100%);
  border: none;
  border-radius: 10px;
  color: #fff;
  font-size: 1rem;
  font-weight: 700;
  font-family: inherit;
  cursor: pointer;
  transition: transform 0.15s, box-shadow 0.2s, opacity 0.2s;
}

.submit-btn:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 8px 24px rgba(54, 192, 242, 0.3);
}

.submit-btn:active:not(:disabled) {
  transform: translateY(0);
}

.submit-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

/* ── Spinner ───────────────────────────────────── */
.spinner {
  width: 22px;
  height: 22px;
  animation: spin 0.75s linear infinite;
}

/* ── Version ───────────────────────────────────── */
.version {
  text-align: center;
  animation: fadeUp 0.6s ease-out 0.2s both;
}

.version span {
  font-size: 0.75rem;
  color: var(--slate-600);
  user-select: none;
}

/* ── Autofill Fix ──────────────────────────────── */
input:-webkit-autofill,
input:-webkit-autofill:hover,
input:-webkit-autofill:focus {
  -webkit-box-shadow: 0 0 0 1000px rgba(15, 23, 42, 0.8) inset !important;
  -webkit-text-fill-color: var(--slate-100) !important;
  border-color: rgba(100, 116, 139, 0.3) !important;
  caret-color: var(--slate-100);
}

/* ── Animations ────────────────────────────────── */
@keyframes fadeUp {
  from {
    opacity: 0;
    transform: translateY(16px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-8px); }
}

@keyframes shakeIn {
  0% { transform: translateX(-8px); opacity: 0; }
  25% { transform: translateX(6px); }
  50% { transform: translateX(-4px); }
  75% { transform: translateX(2px); }
  100% { transform: translateX(0); opacity: 1; }
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* ── Responsive: Mobile (default) ──────────────── */
/* Form panel takes full width, hero panel hidden */
.form-panel {
  align-items: flex-end;
  padding-bottom: env(safe-area-inset-bottom, 0);
}

.form-container {
  padding-bottom: 2.5rem;
}

/* ── Responsive: Tablet (768px+) ───────────────── */
@media (min-width: 768px) {
  .form-panel {
    align-items: center;
  }

  .form-bg-overlay {
    background: radial-gradient(
      ellipse at center,
      rgba(2, 6, 23, 0.7) 0%,
      rgba(2, 6, 23, 0.92) 70%
    );
  }

  .form-container {
    padding: 2.5rem 2rem;
    background: rgba(2, 6, 23, 0.55);
    border: 1px solid rgba(100, 116, 139, 0.15);
    border-radius: 20px;
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
  }

  .mobile-title {
    font-size: 2.25rem;
  }

  .mobile-subtitle {
    font-size: 0.95rem;
  }
}

/* ── Responsive: Desktop (1024px+) ─────────────── */
@media (min-width: 1024px) {
  .hero-panel {
    display: flex;
  }

  .mobile-branding {
    display: none;
  }

  .form-bg,
  .form-bg-overlay {
    display: none;
  }

  .form-panel {
    flex: none;
    width: 480px;
    background: var(--slate-900);
    border-left: 1px solid rgba(100, 116, 139, 0.1);
  }

  .form-container {
    background: none;
    border: none;
    backdrop-filter: none;
    -webkit-backdrop-filter: none;
    padding: 3rem 2.5rem;
    max-width: 100%;
  }

  .login-form {
    gap: 1.5rem;
  }
}

/* ── Responsive: Large Desktop (1280px+) ───────── */
@media (min-width: 1280px) {
  .form-panel {
    width: 520px;
  }

  .hero-title {
    font-size: 3.25rem;
  }
}
</style>
