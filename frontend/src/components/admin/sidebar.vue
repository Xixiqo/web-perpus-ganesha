<template>
	<div class="sidebar">
		<div class="sidebar-header">
			<router-link to="/admin">
				<h2>Admin Panel</h2>
			</router-link>
		</div>
		<nav class="sidebar-nav">
			<ul>
				<li>
					<router-link to="/admin/books">
						<i class="fas fa-book"></i>
						Manage Books
					</router-link>
				</li>
				<li>
					<router-link to="/admin/members">
						<i class="fas fa-users"></i>
						Manage Members
					</router-link>
				</li>
				<li>
					<router-link to="/admin/borrowings">
						<i class="fas fa-exchange-alt"></i>
						Borrowing Records
					</router-link>
				</li>
			</ul>
		</nav>
		<div class="sidebar-footer">
			<router-link to="/">
				<svg xmlns="http://www.w3.org/2000/svg" width="6" height="12" viewBox="0 0 12 24">
					<path fill="currentColor" fill-rule="evenodd" d="m3.343 12l7.071 7.071L9 20.485l-7.778-7.778a1 1 0 0 1 0-1.414L9 3.515l1.414 1.414z"/>
				</svg>
				kembali
			</router-link>
		</div>
	</div>
</template>

<script>
export default {
	name: 'AdminSidebar'
}
</script>

<style scoped>
.sidebar {
	width: 250px;
	height: 100vh;
	background-color: #2c3e50;
	color: white;
	padding: 1rem;
	position: fixed;
	left: 0;
	top: 0;
}

.sidebar-header {
	text-align: center;
	background-color: #34495e;
	border-radius: 10px;
	border-bottom: 1px solid #34495e;
}

.sidebar-header:hover {
	transform: scale(1.05);
	transition: transform 0.3s;
}

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
	padding: 0.75rem 1rem;
	color: white;
	text-decoration: none;
	border-radius: 4px;
	transition: background-color 0.3s;
}

.sidebar-nav a:hover {
	background-color: #34495e;
	border-radius: 10px;
}

.sidebar-nav i {
	margin-right: 0.75rem;
}

.router-link-active {
	background-color: #34495e;
}

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
	border-radius: 4px;
	transition: background-color 0.3s;
}

.sidebar-footer a:hover {
	background-color: #34495e;
	border-radius: 10px;
}

.sidebar-footer svg {
	width: 12px;
	height: 12px;
}
</style>