<template>
  <transition name="slide-down">
    <div 
      v-if="modelValue" 
      :class="[
        'fixed top-5 right-5 z-50 min-w-[320px] max-w-[500px] p-4 px-5 rounded-xl shadow-lg flex items-center justify-between',
        'animate-slideIn',
        type === 'success' ? 'bg-gradient-to-r from-green-500 to-green-600 text-white' :
        type === 'error' ? 'bg-gradient-to-r from-red-500 to-red-600 text-white' :
        type === 'warning' ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-white' :
        'bg-gradient-to-r from-blue-500 to-blue-600 text-white'
      ]"
    >
      <div class="flex items-center gap-3">
        <div class="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-lg font-bold">
          {{ getIcon }}
        </div>
        <div class="text-white">{{ message }}</div>
      </div>
      <button 
        @click="$emit('update:modelValue', false)"
        class="bg-transparent border-0 text-white text-2xl cursor-pointer opacity-80 hover:opacity-100 transition-opacity w-6 h-6 flex items-center justify-center"
      >
        ×
      </button>
    </div>
  </transition>
</template>

<script>
export default {
  name: 'BaseAlert',
  props: {
    modelValue: {
      type: Boolean,
      required: true
    },
    type: {
      type: String,
      default: 'info',
      validator: (value) => ['success', 'error', 'warning', 'info'].includes(value)
    },
    message: {
      type: String,
      required: true
    }
  },
  computed: {
    getIcon() {
      switch(this.type) {
        case 'success': return '✓';
        case 'error': return '✕';
        case 'warning': return '⚠';
        default: return 'ℹ';
      }
    }
  },
  emits: ['update:modelValue']
}
</script>

<style>
.slide-down-enter-active,
.slide-down-leave-active {
  transition: all 0.3s ease-out;
}

.slide-down-enter-from {
  opacity: 0;
  transform: translateY(-30px);
}

.slide-down-leave-to {
  opacity: 0;
  transform: translateY(-30px);
}

.animate-slideIn {
  animation: slideIn 0.3s ease-out;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(-30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>]]>