import { createApp } from 'vue'
import App from './App.vue'

import { createWebHistory } from 'vue-router'
import createRouter from './router/index.js'

import Oruga from '@oruga-ui/oruga-next'
import { bulmaConfig } from '@oruga-ui/theme-bulma'

import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

import { createI18n } from 'vue-i18n'
import messages from './locales/messages/index.js'

// import '@oruga-ui/theme-bulma/dist/bulma.css'
import './assets/sass/main.scss'
import './style.css'

const router = createRouter(createWebHistory())

const store = createPinia()
store.use(piniaPluginPersistedstate)

const i18n = createI18n({
  locale: 'en',
  messages: messages,
  allowComposition: true,
  warnHtmlInMessage: "off",
  // silentTranslationWarn: true,
  // missingWarn: false, 
  // fallbackWarn: false,
})

createApp(App)
  .use(store)
  .use(Oruga, bulmaConfig)
  .use(router)
  .use(i18n)
  .mount('#app')
