<template>
  <div class="login-page">
    <div class="login-container">
      <!-- Left Panel -->
      <div class="left-panel">
        <div class="logo-container">
          <img src="/logo.png" alt="Logo Perpustakaan Ganesha Stembayo" class="logo">
        </div>
        <h1 class="library-name">Ganesha Stembayo</h1>
        <div class="illustration">
          <div class="bookshelf">
            <div class="person person-1"></div>
            <div class="person person-2"></div>
            <div class="books"></div>
          </div>
        </div>
      </div>

      <!-- Right Panel -->
      <div class="right-panel">
        <div class="welcome-section">
          <h2 class="welcome-title">Selamat Datang Kembali</h2>
          <h3 class="welcome-subtitle">Silakan Masuk!</h3>
        </div>

        <form @submit.prevent="handleLogin" class="login-form">
          <div class="form-group">
            <label for="username">ID atau Nama</label>
            <div class="input-wrapper">
              <span class="input-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
              </span>
              <input 
                type="text" 
                id="username" 
                v-model="username" 
                placeholder="Masukkan ID atau Nama Anda"
                required
              >
            </div>
          </div>

          <div class="form-group">
            <label for="password">Kata Sandi</label>
            <div class="input-wrapper">
              <span class="input-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                </svg>
              </span>
              <input 
                :type="showPassword ? 'text' : 'password'" 
                id="password" 
                v-model="password" 
                placeholder="Masukkan Kata Sandi Anda"
                required
              >
              <button 
                type="button" 
                class="toggle-password"
                @click="showPassword = !showPassword"
              >
                <svg v-if="!showPassword" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                  <circle cx="12" cy="12" r="3"></circle>
                </svg>
                <svg v-else xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                  <line x1="1" y1="1" x2="23" y2="23"></line>
                </svg>
              </button>
            </div>
          </div>

          <div v-if="errorMessage" class="error-message">
            {{ errorMessage }}
          </div>

          <div class="forgot-password">
            <a href="#" @click.prevent="showModal = true">Lupa Kata Sandi?</a>
          </div>

          <button type="submit" class="btn-login" :disabled="loading">
            <span v-if="!loading">Masuk</span>
            <span v-else>Memproses...</span>
          </button>
        </form>

        <div class="back-home">
          <RouterLink to="/">Kembali ke Beranda</RouterLink>
        </div>
      </div>
    </div>

    <!-- Modal (tetap sama) -->
    <Transition name="modal-fade">
      <div v-if="showModal" class="modal-overlay" @click="closeModal">
        <div class="modal-container" @click.stop>
          <!-- ... isi modal sama seperti sebelumnya ... -->
        </div>
      </div>
    </Transition>
  </div>
</template>

<script>
export default {
  name: 'LoginPage',
  data() {
    return {
      username: '',
      password: '',
      showPassword: false,
      loading: false,
      errorMessage: '',
      showModal: false
    }
  },
  methods: {
    closeModal() {
      this.showModal = false;
    },
    async handleLogin() {
      this.loading = true;
      this.errorMessage = '';

      const API_BASE_URL = import.meta.env.VITE_API_BASE_URL; // pakai env

      try {
        const response = await fetch(`${API_BASE_URL}/auth/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username: this.username, password: this.password })
        });

        const data = await response.json();

        if (response.ok) {
          localStorage.setItem('token', data.token);
          localStorage.setItem('user', JSON.stringify({
            id: data.user.id,
            username: data.user.username,
            role: data.user.role
          }));

          const redirectTo = this.$route.query.redirect || '/';
          this.$router.push(redirectTo);
        } else {
          this.errorMessage = data.message || 'Login gagal. Periksa username dan password Anda.';
        }
      } catch (err) {
        console.error(err);
        this.errorMessage = 'Terjadi kesalahan koneksi. Silakan coba lagi.';
      } finally {
        this.loading = false;
      }
    },
  },
  mounted() {
    const token = localStorage.getItem('token');
    if (token) this.$router.push('/');
  }
}
</script>

<style scoped>
.login-page {
  background-image: url('/background.jpg');
  background-size: cover;           
  background-position: center;      
  background-repeat: no-repeat;    
  min-height: 100vh;               
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.login-container {
  background: white;
  border-radius: 24px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  display: flex;
  max-width: 1000px;
  width: 100%;
  overflow: hidden;
  min-height: 600px;
}

/* Left Panel */
.left-panel {
  padding: 60px 40px;
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
  background-image: url(/back-icon.png);
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}

.left-panel::before {
  content: '';
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%);
  animation: pulse 15s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.1); }
}

.logo-container {
  background: white;
  border-radius: 50%;
  width: 180px;
  height: 180px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  position: relative;
  z-index: 2;
  padding: 20px;
}

.logo {
  width: 100%;
  height: 100%;
  object-fit: contain;
  border-radius: 50%;
}

.library-name {
  color: white;
  font-size: 32px;
  font-weight: 700;
  margin-top: 30px;
  text-align: center;
  position: relative;
  z-index: 2;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
}

.illustration {
  margin-top: 40px;
  position: relative;
  z-index: 2;
}

/* Right Panel */
.right-panel {
  flex: 1;
  padding: 60px 50px;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.welcome-section {
  text-align: center;
  margin-bottom: 40px;
}

.welcome-title {
  color: #2563eb;
  font-size: 28px;
  font-weight: 600;
  margin-bottom: 8px;
}

.welcome-subtitle {
  color: #1f2937;
  font-size: 22px;
  font-weight: 700;
}

/* Form Styles */
.login-form {
  width: 100%;
}

.form-group {
  margin-bottom: 24px;
}

.form-group label {
  display: block;
  color: #374151;
  font-weight: 600;
  margin-bottom: 8px;
  font-size: 14px;
}

.input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.input-icon {
  position: absolute;
  left: 16px;
  color: #9ca3af;
  display: flex;
  align-items: center;
}

.input-wrapper input {
  width: 100%;
  padding: 14px 16px 14px 48px;
  border: 2px solid #e5e7eb;
  border-radius: 12px;
  font-size: 15px;
  transition: all 0.3s;
  outline: none;
}

.input-wrapper input:focus {
  border-color: #2563eb;
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
}

.toggle-password {
  position: absolute;
  right: 16px;
  background: none;
  border: none;
  color: #9ca3af;
  cursor: pointer;
  padding: 4px;
  display: flex;
  align-items: center;
  transition: color 0.3s;
}

.toggle-password:hover {
  color: #2563eb;
}

/* Error Message */
.error-message {
  background: #fee2e2;
  color: #dc2626;
  padding: 12px 16px;
  border-radius: 8px;
  font-size: 14px;
  margin-bottom: 16px;
  border-left: 4px solid #dc2626;
}

.forgot-password {
  text-align: right;
  margin-bottom: 24px;
}

.forgot-password a {
  color: #2563eb;
  text-decoration: none;
  font-size: 14px;
  font-weight: 500;
  transition: color 0.3s;
}

.forgot-password a:hover {
  color: #1e40af;
  text-decoration: underline;
}

/* Modal Transitions */
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.3s ease;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}

.modal-fade-enter-active .modal-container,
.modal-fade-leave-active .modal-container {
  transition: transform 0.3s ease, opacity 0.3s ease;
}

.modal-fade-enter-from .modal-container,
.modal-fade-leave-to .modal-container {
  transform: scale(0.9);
  opacity: 0;
}

/* Modal Overlay */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  padding: 1rem;
}

/* Modal Container */
.modal-container {
  background: white;
  border-radius: 24px;
  max-width: 560px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  padding: 2.5rem;
  position: relative;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
}

/* Modal Icon */
.modal-icon {
  width: 80px;
  height: 80px;
  margin: 0 auto 1.5rem;
  background: #2C64E3;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal-icon svg {
  color: white;
}

/* Modal Title */
.modal-title {
  font-size: 1.75rem;
  font-weight: 700;
  color: #1f2937;
  text-align: center;
  margin-bottom: 0.75rem;
}

/* Modal Description */
.modal-description {
  font-size: 1rem;
  color: #6b7280;
  text-align: center;
  line-height: 1.6;
  margin-bottom: 2rem;
}

/* Options */
.modal-options {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.option-card {
  display: flex;
  gap: 1rem;
  padding: 1.25rem;
  border: 2px solid #e5e7eb;
  border-radius: 16px;
  transition: all 0.3s ease;
}

.option-card:hover {
  border-color: var(--primary);
  background: #f9fafb;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.1);
}

.option-icon {
  flex-shrink: 0;
  width: 48px;
  height: 48px;
  background: #2C64E3;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.option-icon svg {
  color: white;
}

.option-content {
  flex: 1;
}

.option-content h3 {
  font-size: 1.125rem;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 0.5rem;
}

.option-content p {
  font-size: 0.9rem;
  color: #6b7280;
  line-height: 1.5;
  margin-bottom: 0.5rem;
}

.email-link {
  display: inline-block;
  color: var(--primary);
  font-weight: 600;
  text-decoration: none;
  transition: color 0.3s ease;
}

.email-link:hover {
  color: #4F84F9;
  text-decoration: underline;
}

/* Note */
.modal-note {
  display: flex;
  gap: 0.75rem;
  padding: 1rem;
  background: #fef3c7;
  border-left: 4px solid #f59e0b;
  border-radius: 8px;
  margin-bottom: 1.5rem;
}

.modal-note svg {
  flex-shrink: 0;
  color: #f59e0b;
  margin-top: 2px;
}

.modal-note span {
  font-size: 0.875rem;
  color: #92400e;
  line-height: 1.5;
}

/* Close Button */
.modal-close-btn {
  width: 100%;
  padding: 0.875rem;
  background: #2C64E3;
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.modal-close-btn:hover {
  background: #1e40af;
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(37, 99, 235, 0.4);
}

.modal-close-btn:active {
  transform: translateY(0);
}

/* X Button */
.modal-x-btn {
  position: absolute;
  top: 1.5rem;
  right: 1.5rem;
  width: 36px;
  height: 36px;
  background: #f3f4f6;
  border: none;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.modal-x-btn:hover {
  background: #e5e7eb;
  transform: rotate(90deg);
}

.modal-x-btn svg {
  color: #6b7280;
}

.btn-login {
  width: 100%;
  padding: 16px;
  background: #2563eb;
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  box-shadow: 0 4px 12px rgba(37, 99, 235, 0.3);
}

.btn-login:hover:not(:disabled) {
  background: #1e40af;
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(37, 99, 235, 0.4);
}

.btn-login:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* Back to Home */
.back-home {
  text-align: center;
  margin-top: 24px;
}

.back-home a {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: #6b7280;
  text-decoration: none;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.3s;
}

.back-home a:hover {
  color: #2563eb;
  gap: 12px;
}

/* Responsive Design */
@media (max-width: 968px) {
  .login-container {
    flex-direction: column;
    max-width: 500px;
  }

  .left-panel {
    padding: 40px 30px;
    min-height: 300px;
  }

  .logo-container {
    width: 140px;
    height: 140px;
  }

  .library-name {
    font-size: 26px;
    margin-top: 20px;
  }

  .illustration {
    display: none;
  }

  .right-panel {
    padding: 40px 30px;
  }

  .welcome-title {
    font-size: 24px;
  }

  .welcome-subtitle {
    font-size: 20px;
  }
}

@media (max-width: 480px) {
  .login-page {
    padding: 10px;
  }

  .login-container {
    border-radius: 16px;
    min-height: auto;
  }

  .left-panel {
    padding: 30px 20px;
    min-height: 250px;
  }

  .logo-container {
    width: 120px;
    height: 120px;
  }

  .library-name {
    font-size: 22px;
  }

  .right-panel {
    padding: 30px 20px;
  }

  .welcome-title {
    font-size: 20px;
  }

  .welcome-subtitle {
    font-size: 18px;
  }

  .form-group {
    margin-bottom: 20px;
  }

  .input-wrapper input {
    padding: 12px 16px 12px 44px;
    font-size: 14px;
  }

  .btn-login {
    padding: 14px;
    font-size: 15px;
  }

  .modal-container {
    padding: 2rem 1.5rem;
  }

  .modal-title {
    font-size: 1.5rem;
  }

  .modal-description {
    font-size: 0.9rem;
  }

  .option-card {
    flex-direction: column;
    text-align: center;
  }

  .option-icon {
    margin: 0 auto;
  }
}
</style>