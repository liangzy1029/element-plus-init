import type { App } from 'vue'
import resize from '@/framework/directives/resize'
import permission from '@/framework/directives/permission'

const frameworkDirectives = { resize, permission }

/**
 * 自定义指令注册
 */
export default {
  /**
   * 插件安装方法
   *
   * @param app Vue 应用实例（类型：App）
   */
  install(app: App): void {
    // 遍历指令映射表，批量注册指令（更简洁的 entries 遍历）
    Object.entries(frameworkDirectives).forEach(([directiveName, directive]) => {
      // 防御性检查：避免注册无效指令
      if (!directiveName || !directive) {
        console.warn(`[Directive Plugin] 跳过无效指令注册：${directiveName}`)
        return
      }
      // 注册指令
      app.directive(directiveName, directive)
    })
  },
}
