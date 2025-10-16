<template>
	<div class="app">
		<!-- Sidebar -->
		<Sidebar />
		<!-- Content Wrapper -->
		<div class="content-wrapper">
			<router-view />
		</div>
	</div>
</template>

<script setup>
import Sidebar from '@/components/admin/sidebar.vue'
</script>

<style lang="scss">
.app {
  --primary: #4ade80;
  --primary-alt: #22c55e;
  --grey: #64748b;
  --dark: #1e293b;
  --dark-alt: #334155;
  --light: #f1f5f9;
  --sidebar-width: 250px;
  
  display: flex;
  min-height: 100vh;
  
  .content-wrapper {
    flex: 1;
    margin-left: var(--sidebar-width);
    padding: 2rem;
    width: 100%;
    
    @media (max-width: 1024px) {
      margin-left: 0;
      padding-left: 6rem;
    }
  }
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: 'Fira sans', sans-serif;
}

body {
  background: var(--light);
}

button {
  cursor: pointer;
  appearance: none;
  border: none;
  outline: none;
  background: none;
}
</style>