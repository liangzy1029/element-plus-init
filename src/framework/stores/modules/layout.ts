import { nextTick, ref } from 'vue'
import { defineStore } from 'pinia'
import NProgress from 'nprogress'
import screenFull from 'screenfull'
import { ElMessage } from 'element-plus'

// 布局相关常量
const LAYOUT_CONST = {
  SIDE_BAR: {
    COLLAPSED_WIDTH: '65px', // 侧边栏折叠宽度
    EXPANDED_WIDTH: '220px', // 侧边栏展开宽度
  },
  SELECTOR: {
    MAIN_LAYOUT: '.main-layout', // 主布局选择器
  },
} as const

/**
 * 布局状态管理 Store
 * 负责：侧边栏折叠/展开、页面刷新、全屏切换等布局相关操作
 */
export const useLayoutStore = defineStore('layout', () => {
  /** 侧边栏是否折叠 */
  const isCollapsed = ref(false)
  /** 页面是否需要刷新 */
  const isNeedRefresh = ref(false)
  /** 是否全屏 */
  const isFullScreen = ref(false)

  const sideBarCollapse = () => {
    isCollapsed.value = !isCollapsed.value
    // 获取主布局元素
    const mainLayoutEl = document.querySelector<HTMLElement>(LAYOUT_CONST.SELECTOR.MAIN_LAYOUT)
    if (!mainLayoutEl) {
      console.warn('主布局元素不存在，无法修改侧边栏宽度', LAYOUT_CONST.SELECTOR.MAIN_LAYOUT)
      return
    }
    // 根据折叠状态设置侧边栏宽度 CSS 变量
    const targetWidth = isCollapsed.value
      ? LAYOUT_CONST.SIDE_BAR.COLLAPSED_WIDTH
      : LAYOUT_CONST.SIDE_BAR.EXPANDED_WIDTH
    mainLayoutEl.style.setProperty('--layout-side-width', targetWidth)
  }

  /**
   * 触发页面刷新
   */
  async function refreshPage() {
    try {
      NProgress.start()
      isNeedRefresh.value = true
      // 等待 DOM 更新周期完成后重置状态
      await nextTick()
      isNeedRefresh.value = false
    } catch (error) {
      console.error('页面刷新操作失败：', {
        error,
        time: new Date().toISOString(),
      })
      ElMessage.error('页面刷新失败，请稍后重试')
    } finally {
      NProgress.done()
    }
  }

  /**
   * 切换全屏/退出全屏状态
   */
  async function fullScreen() {
    if (!screenFull.isEnabled) {
      ElMessage.error('当前浏览器不支持全屏功能')
      return
    }
    try {
      // 切换全屏状态
      await screenFull.toggle()
      isFullScreen.value = screenFull.isFullscreen
    } catch (error) {
      console.error('全屏切换操作失败：', {
        error,
        time: new Date().toISOString(),
        browser: navigator.userAgent,
      })
      ElMessage.error('全屏操作失败，请检查浏览器权限或页面设置')
    }
  }

  return {
    isCollapsed,
    isNeedRefresh,
    isFullScreen,
    sideBarCollapse,
    refreshPage,
    fullScreen,
  }
})
