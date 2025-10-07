import { createApp } from 'vue'
import App from './App.vue'
import { createVuetify } from 'vuetify'
import router from './router'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import 'vuetify/styles'
import '@mdi/font/css/materialdesignicons.css'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import { createPinia } from 'pinia' 


const vuetify = createVuetify({components, directives})

const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)

createApp(App)
  .use(pinia)
  .use(router)
  .use(vuetify)
  .mount('#app')
