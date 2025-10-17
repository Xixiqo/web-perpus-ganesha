<template>
	<div class="app" :class="{ 'sidebar-collapsed': isSidebarCollapsed }">
		<!-- Sidebar -->
		<Sidebar @toggle-collapse="handleSidebarToggle" />
		<!-- Content Wrapper -->
		<div class="content-wrapper">
			<router-view />
		</div>
	</div>
</template>

<script setup>
import { ref } from 'vue'
import Sidebar from '@/components/admin/sidebar.vue'

const isSidebarCollapsed = ref(false)

const handleSidebarToggle = (collapsed) => {
	isSidebarCollapsed.value = collapsed
}
</script>

<style lang="scss">
.app {
	--primary: #667eea;
	--primary-alt: #22c55e;
	--grey: #64748b;
	--dark: #1e293b;
	--dark-alt: #334155;
	--light: #f1f5f9;
	--sidebar-width: 250px;
	--sidebar-collapsed-width: 80px;

	display: flex;
	min-height: 100vh;

	.content-wrapper {
		flex: 1;
		margin-left: var(--sidebar-width);
		padding: 2rem;
		width: 100%;
		transition: margin-left 0.3s ease;
		background-color: var(--light);
		overflow-y: auto;

		@media (max-width: 1024px) {
			margin-left: var(--sidebar-collapsed-width);
			padding: 1.5rem;
		}

		@media (max-width: 640px) {
			margin-left: 0;
			padding: 1rem;
		}
	}

	&.sidebar-collapsed {
		.content-wrapper {
			margin-left: var(--sidebar-collapsed-width);

			@media (max-width: 1024px) {
				margin-left: var(--sidebar-collapsed-width);
			}
		}
	}
}

* {
	margin: 0;
	padding: 0;
	box-sizing: border-box;
	font-family: 'Fira Sans', sans-serif;
}

html {
	scroll-behavior: smooth;
}

body {
	background: var(--light);
	color: #333;
}

button {
	cursor: pointer;
	appearance: none;
	border: none;
	outline: none;
	background: none;

	&:focus-visible {
		outline: 2px solid var(--primary);
		outline-offset: 2px;
	}
}

a {
	&:focus-visible {
		outline: 2px solid var(--primary);
		outline-offset: 2px;
	}
}
</style>