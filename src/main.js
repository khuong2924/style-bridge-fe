import { createApp } from "vue"
import { createPinia } from "pinia"
import App from "./App.vue"
import router from "./router"

// Styles
import "../variables.css"
import "./assets/main.css"

// Tạo app
const app = createApp(App)

// Thiết lập Pinia (store)
const pinia = createPinia()
app.use(pinia)

// Thiết lập Router
app.use(router)

// Khởi tạo auth store
import { useAuthStore } from "./stores/auth"
const authStore = useAuthStore()
authStore.init()

// Mount app
app.mount("#app")
