import './assets/main.css'
import { createApp } from 'vue'
import App from './App.vue'
// Import the consolidated router (index.js) which composes user and admin routes
import router from './router/index.js'

const app = createApp(App)
app.use(router)
app.mount('#app')
