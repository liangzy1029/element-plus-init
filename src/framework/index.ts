import '@/framework/styles/framework.scss'
import '@/framework/config/nprogressConfig'
import 'virtual:svg-icons-register'
import { createApp } from 'vue'
import App from '@/App.vue'
import pinia from '@/framework/stores'
import router from '@/framework/router'
import elIconsRegisterPlugin from '@/framework/plugins/el-icons-register-plugin'
import frameworkDirectiveRegisterPlugin from '@/framework/plugins/framework-directive-register-plugin'


export function createFrameworkApp() {
  const app = createApp(App)

  app.use(pinia)
  app.use(router)
  app.use(elIconsRegisterPlugin)
  app.use(frameworkDirectiveRegisterPlugin)

  return app
}
