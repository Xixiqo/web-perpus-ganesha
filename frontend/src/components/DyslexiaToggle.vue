<template>
  <button class="toggle-btn" @click="toggleDyslexiaMode">
    {{ isDyslexiaMode ? "Matikan" : "Mode Disleksia" }}
  </button>
</template>

<script setup>
import { ref, onMounted, watch } from "vue";

const isDyslexiaMode = ref(false);

// 🔹 Muat status awal dari localStorage
onMounted(() => {
  const saved = localStorage.getItem("dyslexiaMode");
  if (saved === "true") {
    isDyslexiaMode.value = true;
    document.body.classList.add("dyslexiaMode");
  }
});

// 🔹 Toggle mode
function toggleDyslexiaMode() {
  isDyslexiaMode.value = !isDyslexiaMode.value;
  document.body.classList.toggle("dyslexiaMode", isDyslexiaMode.value);
}

// 🔹 Simpan status
watch(isDyslexiaMode, (val) => {
  localStorage.setItem("dyslexiaMode", val);
});
</script>

<style scoped>
.toggle-btn {
  background-color: #007bff;
  color: white;
  border: none;
  padding: 10px 18px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
  transition: 0.3s;
}

.toggle-btn:hover {
  background-color: #0056b3;
}
</style>
