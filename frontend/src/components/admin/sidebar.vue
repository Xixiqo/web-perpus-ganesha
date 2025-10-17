<template>
	<div class="sidebar" :class="{ 'collapsed': isCollapsed }">
		<!-- Header dengan Icon Shield -->
		<div class="sidebar-header">
			<router-link to="/admin" class="header-icon">
				<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
					<path fill="currentColor" d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12c5.16-1.26 9-6.45 9-12V5zm0 10.99h7c-.53 4.12-3.28 7.79-7 8.94V12H5V6.3l7-3.11z"/>
				</svg>
				<div v-if="!isCollapsed" class="header-text">Admin Panel</div>
			</router-link>
		</div>

		<!-- Tombol toggle untuk collapse/expand -->
		<button class="toggle-btn" @click="toggleSidebar">
			<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 12 24" class="toggle-icon" :class="{ 'rotated': isCollapsed }">
				<path fill="currentColor" fill-rule="evenodd" d="m3.343 12l7.071 7.071L9 20.485l-7.778-7.778a1 1 0 0 1 0-1.414L9 3.515l1.414 1.414z"/>
			</svg>
		</button>

		<nav class="sidebar-nav">
			<ul>
				<li>
					<router-link to="/admin/books">
						<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24">
							<path fill="currentColor" d="M6 22q-.825 0-1.412-.587T4 20V4q0-.825.588-1.412T6 2h8l6 6v12q0 .825-.587 1.413T18 22zm7-13V4H6v16h12V9zM6 4v5zm0 16V4z"/>
						</svg>
						<span v-if="!isCollapsed">Manage Books</span>
					</router-link>
				</li>
				<li>
					<router-link to="/admin/members">
						<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24">
							<path fill="currentColor" d="M12 12q-1.65 0-2.825-1.175T8 8t1.175-2.825T12 4t2.825 1.175T16 8t-1.175 2.825T12 12m-8 6v-.8q0-.85.438-1.562T5.6 14.55q1.55-.775 3.15-1.162T12 13t3.25.388t3.15 1.162q.725.375 1.163 1.088T20 17.2v.8q0 .825-.587 1.413T18 20H6q-.825 0-1.412-.587T4 18m2 0h12v-.8q0-.275-.137-.5t-.363-.35q-1.35-.675-2.725-1.012T12 15t-2.775.338T6.5 16.35q-.225.125-.363.35T6 17.2zm6-8q.825 0 1.413-.587T14 8t-.587-1.412T12 6t-1.412.588T10 8t.588 1.413T12 10m0 8"/>
						</svg>
						<span v-if="!isCollapsed">Manage Members</span>
					</router-link>
				</li>
				<li>
					<router-link to="/admin/borrowings">
						<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24">
							<path fill="currentColor" d="M12 21q-3.15 0-5.575-1.912T3.275 14.2q-.1-.375.15-.687t.675-.363q.4-.05.725.15t.45.6q.6 2.25 2.475 3.675T12 19q2.925 0 4.963-2.037T19 12t-2.037-4.962T12 5q-1.725 0-3.225.8T6.25 8H8q.425 0 .713.288T9 9t-.288.713T8 10H4q-.425 0-.712-.288T3 9V5q0-.425.288-.712T4 4t.713.288T5 5v1.35q1.275-1.6 3.113-2.475T12 3q1.875 0 3.513.713t2.85 1.924t1.925 2.85T21 12t-.712 3.513t-1.925 2.85t-2.85 1.925T12 21m1-9.4l2.5 2.5q.275.275.275.7t-.275.7t-.7.275t-.7-.275l-2.8-2.8q-.15-.15-.225-.337T11 11.975V8q0-.425.288-.712T12 7t.713.288T13 8z"/>
						</svg>
						<span v-if="!isCollapsed">Borrowing Records</span>
					</router-link>
				</li>
			</ul>
		</nav>

		<div class="sidebar-footer">
			<router-link to="/">
				<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24">
					<path fill="currentColor" d="m4 10l-.707.707L2.586 10l.707-.707zm17 8a1 1 0 1 1-2 0zM8.293 15.707l-5-5l1.414-1.414l5 5zm-5-6.414l5-5l1.414 1.414l-5 5zM4 9h10v2H4zm17 7v2h-2v-2zm-7-7a7 7 0 0 1 7 7h-2a5 5 0 0 0-5-5z"/>
				</svg>
				<span v-if="!isCollapsed">Kembali</span>
			</router-link>
		</div>
	</div>
</template>

<script>
export default {
	name: 'AdminSidebar',
	data() {
		return {
			isCollapsed: false
		}
	},
	methods: {
		toggleSidebar() {
			this.isCollapsed = !this.isCollapsed;
			this.$emit('toggle-collapse', this.isCollapsed);
		}
	}
}
</script>

<style scoped>
.sidebar {
	width: 270px;
	height: 100vh;
	background-color: var(--primary);
	color: white;
	padding: 1rem;
	position: fixed;
	left: 0;
	top: 0;
	transition: width 0.3s ease;
	overflow-x: hidden;
	overflow-y: auto;
	z-index: 1000;
}

.sidebar.collapsed {
	width: 80px;
}

/* === Header dengan Icon Shield === */
.sidebar-header {
	display: flex;
	background-color: var(--secondary);
	align-items: center;
	justify-content: center;
	margin-bottom: 1.5rem;
	padding: 0.75rem;
	border-bottom: 2px solid rgba(255, 255, 255, 0.3);
	transition: all 0.3s ease;
	min-height: 50px;
	border-radius: 30px;
}

.header-icon {
	display: flex;
	align-items: center;
	justify-content: center;
	gap: 0.75rem;
	transition: all 0.3s ease;
	text-decoration: none;
}

.header-icon svg {
	width: 24px;
	height: 24px;
	color: white;
	flex-shrink: 0;
}

.header-text {
	font-size: 1.2rem;
	font-weight: 550;
	white-space: nowrap;
	opacity: 1;
	transition: opacity 0.3s ease;
	color: white;
}

.sidebar.collapsed .header-text {
	opacity: 0;
	width: 0;
	overflow: hidden;
}

/* === Toggle Button === */
.toggle-btn {
	position: absolute;
	top: 350px;
	right: 0;
	background: aliceblue;
	color: var(--primary);
	border: none;
	border-radius: 50px 0px 0px 50px;
	padding: 0.5rem;
	cursor: pointer;
	z-index: 1100;
	display: flex;
	align-items: center;
	justify-content: center;
	transition: background 0.3s ease;
	width: 40px;
	height: 40px;
}

.toggle-btn:hover {
	transform: scale(1.2);
	transition: 0.3s ease;
}

.toggle-icon {
	transition: transform 0.3s ease;
	display: block;
}

.toggle-icon.rotated {
	transform: rotate(180deg);
}

/* === Navigation === */
.sidebar-nav ul {
	list-style: none;
	padding: 0;
	margin: 1rem 0;
}

.sidebar-nav li {
	margin: 0.5rem 0;
}

.sidebar-nav a {
	display: flex;
	align-items: center;
	gap: 0.75rem;
	padding: 0.75rem 1rem;
	color: white;
	text-decoration: none;
	border-radius: 8px;
	transition: background-color 0.3s;
	white-space: nowrap;
}

.sidebar-nav a:hover {
	background-color: var(--secondary);
}

/* === Semua icon di kiri === */
.sidebar-nav svg {
	width: 18px;
	height: 18px;
	flex-shrink: 0;
	fill: white;
}

/* === Teks dalam nav === */
.sidebar-nav span {
	font-size: 1rem;
	font-weight: 500;
	opacity: 1;
	transition: opacity 0.3s ease;
}

.sidebar.collapsed .sidebar-nav span {
	opacity: 0;
	width: 0;
	overflow: hidden;
}

.sidebar.collapsed .sidebar-nav a {
	justify-content: center;
	padding: 0.75rem;
}

/* === Active link === */
.router-link-active {
	background-color: var(--secondary);
}

/* === Footer === */
.sidebar-footer {
	position: absolute;
	bottom: 1rem;
	left: 0;
	width: 100%;
	padding: 0 1rem;
}

.sidebar-footer a {
	display: flex;
	align-items: center;
	justify-content: center;
	gap: 0.5rem;
	padding: 0.75rem 1rem;
	color: white;
	text-decoration: none;
	border-radius: 8px;
	transition: background-color 0.3s;
	white-space: nowrap;
}

.sidebar-footer a:hover {
	background-color: var(--secondary);
}

.sidebar-footer svg {
	width: 18px;
	height: 18px;
	flex-shrink: 0;
}

.sidebar-footer span {
	opacity: 1;
	transition: opacity 0.3s ease;
}

.sidebar.collapsed .sidebar-footer span {
	opacity: 0;
	width: 0;
	overflow: hidden;
}

/* === Responsive Breakpoints === */
@media (max-width: 768px) {
	.sidebar {
		width: 270px;
		transform: translateX(-100%);
	}

	.sidebar.collapsed {
		width: 270px;
		transform: translateX(0);
	}

	.toggle-btn {
		right: -2.5rem;
	}
}
</style>