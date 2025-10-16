<template>
	<aside :class="`${is_expanded ? 'is-expanded' : ''}`">
    <div class="logo">
      <router-link to="/admin">
        <img :src="logoURL" alt="Vue" /> 
      </router-link>
    </div>


		<div class="menu-toggle-wrap">
			<button class="menu-toggle" @click="ToggleMenu">
				<span class="material-icons">keyboard_double_arrow_right</span>
			</button>
		</div>

		<h3>Menu</h3>
		<div class="menu">
			<!-- Dropdown Menu Item -->
			<div class="dropdown-item">
				<div class="button" @click="toggleDropdown('home')">
					<span class="material-icons">home</span>
					<span class="text">Home</span>
					<span class="material-icons arrow" :class="{ rotated: openDropdowns.home }">arrow_drop_down</span>
				</div>
				<div v-show="is_expanded && openDropdowns.home" class="dropdown-menu">
					<router-link to="/home/user" class="button sub-item">
						<span class="text">Home User</span>
					</router-link>
					<router-link to="/home/admin" class="button sub-item">
						<span class="text">Home Admin</span>
					</router-link>
				</div>
			</div>

			<router-link to="/admin/books" class="button">
				<span class="material-icons">description</span>
				<span class="text">About</span>
			</router-link>
			<router-link to="/team" class="button">
				<span class="material-icons">group</span>
				<span class="text">Team</span>
			</router-link>
			<router-link to="/contact" class="button">
				<span class="material-icons">email</span>
				<span class="text">Contact</span>
			</router-link>
		</div>

		<div class="flex"></div>
		
		<div class="menu">
			<router-link to="/settings" class="button">
				<span class="material-icons">settings</span>
				<span class="text">Settings</span>
			</router-link>
		</div>
	</aside>
</template>

<script setup>
import { ref } from 'vue'
import logoURL from '@/assets/logo.svg'

const is_expanded = ref(localStorage.getItem("is_expanded") === "true")

// Track open dropdowns by key
const openDropdowns = ref({
	home: false,
	// Add more as needed: e.g., 'reports': false
})

const ToggleMenu = () => {
	is_expanded.value = !is_expanded.value
	localStorage.setItem("is_expanded", is_expanded.value)
}

const toggleDropdown = (key) => {
	if (!is_expanded.value) return // Only allow dropdown if sidebar is expanded
	openDropdowns.value[key] = !openDropdowns.value[key]
}
</script>

<style lang="scss" scoped>
aside {
	display: flex;
	flex-direction: column;

	background-color: var(--dark);
	color: var(--light);

	width: calc(2rem + 32px);
	overflow: hidden;
	min-height: 100vh;
	padding: 1rem;

	transition: 0.2s ease-in-out;

	.flex {
		flex: 1 1 0%;
	}

	.logo {
		margin-bottom: 0.5rem;

		img {
			width: 2rem;
      height: auto;
		}
	}

	.menu-toggle-wrap {
		display: flex;
		justify-content: flex-end;
		margin-bottom: 0.5rem;

		position: relative;
		top: 0;
		transition: 0.2s ease-in-out;

		.menu-toggle {
			transition: 0.2s ease-in-out;
			.material-icons {
				font-size: 2rem;
				color: var(--light);
				transition: 0.2s ease-out;
			}
			
			&:hover {
				.material-icons {
					color: var(--primary);
					transform: translateX(0.5rem);
				}
			}
		}
	}

	h3, .button .text {
		opacity: 0;
		transition: opacity 0.3s ease-in-out;
	}

	h3 {
		color: var(--grey);
		font-size: 0.875rem;
		margin-bottom: 0.25rem;
		text-transform: uppercase;
	}

	.menu {
		margin: 0 -1rem;

		.button {
			display: flex;
			align-items: center;
			text-decoration: none;

			transition: 0.2s ease-in-out;
			padding: 0.5rem 1rem;

			.material-icons {
				font-size: 2rem;
				color: var(--light);
				transition: 0.2s ease-in-out;
			}
			.text {
				color: var(--light);
				transition: 0.2s ease-in-out;
			}

			&:hover {
				background-color: var(--dark-alt);

				.material-icons, .text {
					color: var(--primary);
				}
			}

			&.router-link-exact-active {
				background-color: var(--dark-alt);
				border-right: 5px solid var(--primary);

				.material-icons, .text {
					color: var(--primary);
				}
			}
		}
	}

	.footer {
		opacity: 0;
		transition: opacity 0.3s ease-in-out;

		p {
			font-size: 0.875rem;
			color: var(--grey);
		}
	}

	&.is-expanded {
		width: var(--sidebar-width);

		.menu-toggle-wrap {
			top: -3rem;
			
			.menu-toggle {
				transform: rotate(-180deg);
			}
		}

		h3, .button .text {
			opacity: 1;
		}

		.button {
			.material-icons {
				margin-right: 1rem;
			}
		}

		.footer {
			opacity: 0;
		}
	}

	@media (max-width: 1024px) {
		position: absolute;
		z-index: 99;
	}
}

.dropdown-item {
	.button {
		cursor: pointer;
		position: relative;

		.arrow {
			margin-left: auto;
			font-size: 1.5rem;
			transition: transform 0.2s ease;
			color: var(--grey);
		}

		&.rotated {
			transform: rotate(180deg);
		}
	}
}

.dropdown-menu {
	.sub-item {
		padding-left: 3rem; // Indent sub-items
    margin-left: 1.25rem;
		.material-icons {
			display: none; // Hide icons for sub-items (optional)
		}
	}
}
</style>