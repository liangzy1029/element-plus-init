import type { App, Component } from 'vue'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'

/**
 * Element Plus 图标全局注册插件
 */
export default {
  /**
   * 插件安装方法
   *
   * @param app Vue 应用实例（类型：App）
   */
  install(app: App): void {
    const iconComponents = Object.entries(ElementPlusIconsVue) as [string, Component][]
    for (const [key, component] of iconComponents) {
      app.component(key, component)
    }
  },
}
