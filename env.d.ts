/// <reference types="vite/client" />

/** 解决 ts 不识别 .vue 文件 */
declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  // 泛型参数：Props类型、Emits类型、组件实例类型、渲染函数类型
  const component: DefineComponent<{}, {}, any>
  export default component
}

/** 自定义环境变量类型 */
interface ImportMetaEnv {
  /** API 请求路径 */
  readonly VITE_BASE_URL: string
  /** 服务器文件请求 URL */
  readonly VITE_FILE_BASE_URL: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
