import { createPinia } from 'pinia'
import persist from 'pinia-plugin-persistedstate'

export * from '@/framework/stores/modules/layout'
export * from '@/framework/stores/modules/tabView'

const pinia = createPinia()

pinia.use(persist)

export default pinia
