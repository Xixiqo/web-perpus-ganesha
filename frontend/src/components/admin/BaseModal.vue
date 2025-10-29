<template>
  <div 
    v-if="modelValue" 
    class="fixed inset-0 bg-black/60 flex justify-center items-center z-50 backdrop-blur-sm"
    @click="$emit('update:modelValue', false)"
  >
    <div 
      class="bg-white rounded-2xl w-[90%] max-w-[800px] max-h-[90vh] overflow-y-auto shadow-2xl animate-scaleIn"
      @click.stop
    >
      <!-- Header -->
      <div class="flex justify-between items-center p-6 border-b-2 border-gray-200 bg-gradient-to-r from-gray-50 to-gray-100 rounded-t-2xl">
        <h2 class="text-xl text-gray-800 font-semibold">
          <slot name="header">{{ title }}</slot>
        </h2>
        <button 
          @click="$emit('update:modelValue', false)"
          class="bg-transparent border-0 text-2xl cursor-pointer text-gray-500 w-9 h-9 flex items-center justify-center rounded-full hover:bg-red-50 hover:text-red-500 transition-colors"
        >
          ×
        </button>
      </div>

      <!-- Body -->
      <div class="p-6">
        <slot></slot>
      </div>

      <!-- Footer -->
      <div class="flex justify-end gap-3 p-5 border-t-2 border-gray-200 bg-gray-50 rounded-b-2xl">
        <slot name="footer">
          <button 
            @click="$emit('update:modelValue', false)"
            class="px-6 py-3 bg-gray-200 text-gray-600 rounded-lg text-sm font-medium hover:bg-gray-300 transition-colors"
          >
            {{ cancelText }}
          </button>
          <button 
            @click="$emit('confirm')"
            class="px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg text-sm font-medium shadow-green-200 shadow-md hover:-translate-y-0.5 hover:shadow-lg transition-all duration-300"
          >
            {{ confirmText }}
          </button>
        </slot>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'BaseModal',
  props: {
    modelValue: {
      type: Boolean,
      required: true
    },
    title: {
      type: String,
      default: ''
    },
    confirmText: {
      type: String,
      default: 'Konfirmasi'
    },
    cancelText: {
      type: String,
      default: 'Batal'
    }
  },
  emits: ['update:modelValue', 'confirm']
}
</script>

<style>
.animate-scaleIn {
  animation: scaleIn 0.2s ease-out;
}

@keyframes scaleIn {
  from {
    transform: scale(0.95);
    opacity: 0;
  }
  to {
    transform: scale(1);
    opacity: 1;
  }
}
</style>]]>