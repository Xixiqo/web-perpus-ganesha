<template>
  <div class="bg-white rounded-lg shadow p-4 flex items-center gap-4 hover:shadow-lg transition">
    <div class="text-4xl">{{ icon }}</div>
    <div>
      <p class="text-sm text-gray-500">{{ title }}</p>
      <p class="text-xl font-bold">{{ value }}</p>
    </div>
  </div>
</template>

<script setup>
defineProps({
  title: String,
  value: String,
  icon: String
})
</script>