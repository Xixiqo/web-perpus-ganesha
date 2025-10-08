import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import Navbar from './components/Navbar.vue'
import router from './router'

const app = createApp(App)

app.use(router)
app.component('Navbar', Navbar)

app.mount('#app')
