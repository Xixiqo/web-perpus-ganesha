<template>
  <div>
    <!-- Backdrop Overlay - only on mobile when expanded -->
    <transition name="fade-backdrop">
      <div 
        v-if="!isCollapsed && isMobile"
        @click="toggleSidebar"
        class="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
      ></div>
    </transition>

    <!-- Sidebar -->
    <aside 
      :class="[
        'bg-white border-r border-gray-200 flex flex-col transition-all duration-300 ease-in-out',
        // Mobile: fixed position with overlay behavior
        'md:relative fixed top-0 left-0 h-screen z-50',
        // Width
        isCollapsed ? 'w-20' : 'w-64',
        // Mobile slide animation
        !isCollapsed && isMobile ? 'translate-x-0' : '',
        isCollapsed && isMobile ? '-translate-x-full md:translate-x-0' : ''
      ]"
    >
<!-- Toggle Button -->
<button 
  @click="toggleSidebar"
  :class="[
    'absolute top-24 z-10 w-6 h-6 bg-white border border-gray-300 rounded-full shadow-md hover:shadow-lg flex items-center justify-center transition-all duration-200 hover:scale-110',
    // Position berbeda untuk mobile vs desktop
    isCollapsed ? 'md:-right-3 -right-6' : 'md:-right-3 right-4'
  ]"
  :title="isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'"
>
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          width="14" 
          height="14" 
          viewBox="0 0 12 24" 
          class="transition-transform duration-300"
          :class="{ 'rotate-180': isCollapsed }"
        >
          <path fill="currentColor" fill-rule="evenodd" d="m3.343 12l7.071 7.071L9 20.485l-7.778-7.778a1 1 0 0 1 0-1.414L9 3.515l1.414 1.414z"/>
        </svg>
      </button>

      <!-- Profile Section -->
      <div class="p-6 border-b border-gray-200">
        <!-- Back Button - hide when collapsed -->
        <button 
          v-if="!isCollapsed"
          @click="$emit('back')" 
          class="flex items-center text-gray-600 hover:text-gray-900 mb-6 transition-colors"
        >
          <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
          </svg>
          Settings
        </button>
        
        <!-- Back Icon Only - show when collapsed -->
        <button 
          v-else
          @click="$emit('back')" 
          class="flex items-center justify-center w-full text-gray-600 hover:text-gray-900 mb-6 transition-colors"
          title="Back"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
          </svg>
        </button>
        
        <!-- Profile Info -->
        <div :class="['flex flex-col items-center', isCollapsed ? 'space-y-2' : '']">
          <div class="relative">
            <div 
              :class="['rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-bold transition-all duration-300',
                       isCollapsed ? 'w-12 h-12 text-lg' : 'w-20 h-20 text-2xl']"
            >
              {{ initials }}
            </div>
            <div 
              :class="['absolute bottom-0 right-0 bg-green-500 rounded-full border-2 border-white transition-all duration-300',
                       isCollapsed ? 'w-3 h-3' : 'w-5 h-5']"
            ></div>
          </div>
          
          <!-- User Info - only show when expanded -->
          <transition name="fade">
            <div v-if="!isCollapsed" class="text-center">
              <h2 class="text-base font-semibold text-gray-900 mt-3">{{ userName }}</h2>
              <p class="text-sm text-gray-500">{{ userYear }}</p>
            </div>
          </transition>
        </div>
      </div>

      <!-- Navigation -->
      <nav class="flex-1 p-4 overflow-y-auto">
        <ul class="space-y-1">
          <!-- Informasi Personal -->
          <li>
            <button 
              @click="handleNavClick('personal')" 
              :class="['w-full text-left rounded-lg flex items-center transition-all duration-200', 
                       activeSection === 'personal' ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-50',
                       isCollapsed ? 'px-2 py-3 justify-center' : 'px-4 py-2.5']"
              :title="isCollapsed ? 'Informasi Personal' : ''"
            >
              <svg 
                :class="['flex-shrink-0 transition-all duration-200', 
                         isCollapsed ? 'w-6 h-6' : 'w-5 h-5 mr-3']" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
              </svg>
              <span v-if="!isCollapsed" class="text-sm font-medium">Informasi Personal</span>
            </button>
          </li>

          <!-- Notifikasi -->
          <li>
            <button 
              @click="handleNavClick('notifications')" 
              :class="['w-full text-left rounded-lg flex items-center transition-all duration-200', 
                       activeSection === 'notifications' ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-50',
                       isCollapsed ? 'px-2 py-3 justify-center' : 'px-4 py-2.5']"
              :title="isCollapsed ? 'Notifikasi' : ''"
            >
              <svg 
                :class="['flex-shrink-0 transition-all duration-200', 
                         isCollapsed ? 'w-6 h-6' : 'w-5 h-5 mr-3']" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path>
              </svg>
              <span v-if="!isCollapsed" class="text-sm font-medium">Notifikasi</span>
            </button>
          </li>

          <!-- Privasi dan Keamanan -->
          <li>
            <button 
              @click="handleNavClick('security')" 
              :class="['w-full text-left rounded-lg flex items-center transition-all duration-200', 
                       activeSection === 'security' ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-50',
                       isCollapsed ? 'px-2 py-3 justify-center' : 'px-4 py-2.5']"
              :title="isCollapsed ? 'Privasi dan Keamanan' : ''"
            >
              <svg 
                :class="['flex-shrink-0 transition-all duration-200', 
                         isCollapsed ? 'w-6 h-6' : 'w-5 h-5 mr-3']" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
              </svg>
              <span v-if="!isCollapsed" class="text-sm font-medium">Privasi dan Keamanan</span>
            </button>
          </li>

          <!-- Integrasi -->
          <li>
            <button 
              @click="handleNavClick('integrations')" 
              :class="['w-full text-left rounded-lg flex items-center transition-all duration-200', 
                      activeSection === 'integrations' ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-50',
                      isCollapsed ? 'px-2 py-3 justify-center' : 'px-4 py-2.5']"
              :title="isCollapsed ? 'Integrasi' : ''"
            >
              <svg 
                :class="['flex-shrink-0 transition-all duration-200', 
                         isCollapsed ? 'w-6 h-6' : 'w-5 h-5 mr-3']" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
              </svg>
              <span v-if="!isCollapsed" class="text-sm font-medium">Integrasi</span>
            </button>
          </li>
        </ul>
      </nav>
    </aside>
  </div>
</template>

<script>
export default {
  name: 'SettingsSidebar',
  data() {
    return {
      isCollapsed: false,
      isMobile: false
    }
  },
  props: {
    userName: {
      type: String,
      default: 'Nama Pengguna'
    },
    userYear: {
      type: String,
      default: '-'
    },
    activeSection: {
      type: String,
      default: 'personal'
    }
  },
  computed: {
    initials() {
      if (!this.userName || this.userName === 'Nama Pengguna') return '?';
      
      const parts = this.userName.trim().split(' ');
      if (parts.length >= 2) {
        return (parts[0][0] + parts[1][0]).toUpperCase();
      }
      return this.userName.substring(0, 2).toUpperCase();
    }
  },
  methods: {
    toggleSidebar() {
      this.isCollapsed = !this.isCollapsed;
      this.$emit('toggle-collapse', this.isCollapsed);
    },
    handleNavClick(section) {
      this.$emit('select-section', section);
      // Auto-close sidebar on mobile after selecting
      if (this.isMobile) {
        this.isCollapsed = true;
      }
    },
    checkMobile() {
      this.isMobile = window.innerWidth < 768; // md breakpoint
      // Auto collapse on mobile
      if (this.isMobile) {
        this.isCollapsed = true;
      }
    }
  },
  mounted() {
    this.checkMobile();
    window.addEventListener('resize', this.checkMobile);
  },
  beforeUnmount() {
    window.removeEventListener('resize', this.checkMobile);
  },
  emits: ['back', 'select-section', 'toggle-collapse']
};
</script>

<style scoped>
/* Fade transition untuk text */
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}

/* Backdrop fade animation */
.fade-backdrop-enter-active, .fade-backdrop-leave-active {
  transition: opacity 0.3s ease;
}
.fade-backdrop-enter-from, .fade-backdrop-leave-to {
  opacity: 0;
}
</style>