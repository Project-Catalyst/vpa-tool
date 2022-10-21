import { createApp } from 'vue'
import App from './App.vue'

import { createWebHistory } from 'vue-router'
import createRouter from './router/index.js'

import Oruga from '@oruga-ui/oruga-next'
import { bulmaConfig } from '@oruga-ui/theme-bulma'

import { createPinia } from 'pinia'

// import '@oruga-ui/theme-bulma/dist/bulma.css'
import './assets/sass/main.scss'
import './style.css'

const store = createPinia()
const router = createRouter(createWebHistory())

createApp(App)
  .use(store)
  .use(Oruga, bulmaConfig)
  .use(router)
  .mount('#app')
