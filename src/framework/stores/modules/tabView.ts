import { defineStore } from 'pinia'
import { ref } from 'vue'
import { type RouteRecordRaw, useRoute, useRouter } from 'vue-router'
import { useLayoutStore } from '@/framework/stores'
import type { ContextMenuOption, TabItem } from '@/framework/types'
import type { TabPaneName } from 'element-plus'

/** 默认激活的路径 */
const DEFAULT_ACTIVE_PATH = '/'

export const useTabViewStore = defineStore('tabView', () => {
  const router = useRouter()
  const route = useRoute()
  const layoutStore = useLayoutStore()

  /** 当前激活的标签页路径 */
  /** 当前激活的标签页路径 */
  const activePath = ref(DEFAULT_ACTIVE_PATH)
  /** 标签页列表 */
  const tabList = ref<TabItem[]>([])
  /** 缓存的组件名称列表（用于keep-alive） */
  const cachedComponentNames = ref<string[]>([])
  /** 右键菜单选项列表 */
  const contextMenuOptions = ref<ContextMenuOption[]>([])

  // region 辅助函数

  /**
   * 检查路由路径是否存在于标签列表中
   * @param  path - 路由路径
   * @returns 是否存在
   */
  const isPathInTabList = (path: string) => {
    return tabList.value.some((tab) => tab.path === path)
  }

  /**
   * 标签筛选后处理路由跳转（若当前路由被删除则跳转到指定路径）
   * @param fallbackPath - 回退路径
   */
  const handleRouteAfterTabFilter = (fallbackPath: string) => {
    const currentPath = router.currentRoute.value.path
    if (!isPathInTabList(currentPath)) {
      router.push(fallbackPath)
    }
  }

  /**
   * 添加一个标签到 tabList
   *
   * @param route 路由对象
   */
  function addTabToList(route: RouteRecordRaw) {
    // 过滤无效路由
    if (!route?.meta?.title || route?.meta?.hideInTab) return

    // 避免重复添加
    if (isPathInTabList(route.path)) return

    // 构建标签项
    const newTab = {
      title: route.meta.title,
      path: route.path,
      name: route.name?.toString(),
      icon: route.meta.icon || '',
      affix: route.meta.affix || false,
    }

    // 添加标签并处理缓存
    tabList.value.push(newTab)
    if (route.meta.keepAlive) {
      addCachedComponent(route.name?.toString())
    }
  }

  // endregion

  // region 缓存组件操作

  /**
   * 添加缓存组件名称（去重）
   *
   * @param componentName - 组件名称
   */
  const addCachedComponent = (componentName: string | undefined | null) => {
    if (!componentName) return
    if (!cachedComponentNames.value.includes(componentName)) {
      cachedComponentNames.value.push(componentName)
    }
  }

  /**
   * 移除指定名称的缓存组件
   * @param componentName - 组件名称
   */
  const removeCachedComponent = (componentName: string | undefined | null) => {
    if (!componentName) return
    const index = cachedComponentNames.value.findIndex((name) => name === componentName)
    if (index > -1) {
      cachedComponentNames.value.splice(index, 1)
    }
  }

  // endregion

  // region 标签操作

  /**
   * 添加标签
   *
   * @param route 路由对象
   */
  function addTab(route: RouteRecordRaw) {
    // 过滤无效路由
    if (!route?.meta?.title || route?.meta?.hideInTab) return
    addTabToList(route)
    activePath.value = route.path
  }

  /**
   * 移除指定标签页
   *
   * @param tabPath 要移除的标签路径
   */
  function removeTab(tabPath: TabPaneName) {
    // 查找目标标签索引
    const targetTabIndex = tabList.value.findIndex((tab) => tab.path === tabPath)
    if (targetTabIndex === -1) return

    // 禁止关闭固定标签
    const targetTab = tabList.value[targetTabIndex]
    if (!targetTab || targetTab.affix) return

    // 确定移除后要激活的标签
    const previousActivePath = activePath.value
    if (tabPath === previousActivePath) {
      const nextTab = tabList.value[targetTabIndex + 1] || tabList.value[targetTabIndex - 1]
      activePath.value = nextTab ? nextTab.path : DEFAULT_ACTIVE_PATH
    }

    // 移除标签和对应缓存
    tabList.value.splice(targetTabIndex, 1)
    removeCachedComponent(targetTab.name)

    // 跳转到新激活的标签
    router.push(activePath.value)
  }

  /**
   * 初始化标签列表（添加所有固定标签）
   */
  const initTabList = () => {
    // 筛选出所有固定标签并添加
    const affixRoutes = router
      .getRoutes()
      .filter((route) => !route.meta?.hideInTab && route.meta?.affix)
    affixRoutes.forEach((route) => addTabToList(route))
    addTab(route as any)
  }

  // endregion

  // region 右键菜单操作方法

  /**
   * 刷新当前/指定标签页
   * @param menuItem - 右键菜单项
   */
  async function refreshCurrentPage(menuItem: ContextMenuOption) {
    const { path } = menuItem as any
    // 若刷新的不是当前激活标签，先跳转过去
    if (path !== activePath.value) {
      await router.push(path)
    }
    // 调用布局Store的刷新方法
    await layoutStore.refreshPage()
  }

  /**
   * 关闭当前标签页
   *
   * @param menuItem - 右键菜单项
   */
  function closeCurrentTab(menuItem: ContextMenuOption) {
    const { path } = menuItem as any
    removeTab(path)
  }

  /**
   * 关闭其他标签页（保留当前+固定标签）
   *
   * @param menuItem - 右键菜单项
   */
  function closeOtherTab(menuItem: ContextMenuOption) {
    const { path } = menuItem as any
    tabList.value = tabList.value.filter((tab) => {
      const isKeep = tab.path === path || tab.affix
      // 移除非保留标签的缓存
      if (!isKeep) {
        removeCachedComponent(tab.name)
      }
      return isKeep
    })

    handleRouteAfterTabFilter(path)
  }

  /**
   * 关闭左侧标签页（保留当前+右侧+固定标签）
   *
   * @param menuItem - 右键菜单项
   */
  function closeLeftTab(menuItem: ContextMenuOption) {
    const { path } = menuItem as any
    const targetTabIndex = tabList.value.findIndex((tab) => tab.path === path)
    if (targetTabIndex === -1) return

    tabList.value = tabList.value.filter((tab, index) => {
      const isKeep = tab.affix || index >= targetTabIndex
      // 移除左侧非固定标签的缓存
      if (!isKeep) {
        removeCachedComponent(tab.name)
      }
      return isKeep
    })

    handleRouteAfterTabFilter(path)
  }

  /**
   * 关闭右侧标签页（保留当前+左侧+固定标签）
   *
   * @param menuItem - 右键菜单项
   */
  function closeRightTab(menuItem: ContextMenuOption) {
    const { path } = menuItem as any
    const targetTabIndex = tabList.value.findIndex((tab) => tab.path === path)
    if (targetTabIndex === -1) return

    tabList.value = tabList.value.filter((tab, index) => {
      const isKeep = tab.affix || index <= targetTabIndex
      // 移除右侧非固定标签的缓存
      if (!isKeep) {
        removeCachedComponent(tab.name)
      }
      return isKeep
    })

    handleRouteAfterTabFilter(path)
  }

  /**
   * 关闭所有标签页（仅保留固定标签）
   */
  const closeAllTab = () => {
    // 仅保留固定标签
    tabList.value = tabList.value.filter((tab) => tab.affix)

    // 清理非固定标签的缓存
    cachedComponentNames.value = cachedComponentNames.value.filter((name) => {
      return tabList.value.some((tab) => tab.name === name)
    })

    // 跳转到第一个固定标签（默认首页）
    const fallbackPath = tabList.value[0]?.path ?? '/'
    router.push(fallbackPath)
    activePath.value = fallbackPath
  }

  // endregion

  contextMenuOptions.value = [
    { label: '刷新页面', icon: 'Refresh', callBack: refreshCurrentPage },
    { label: '关闭当前', icon: 'Scissor', callBack: closeCurrentTab },
    { label: '关闭其他', icon: 'FolderDelete', callBack: closeOtherTab },
    { label: '关闭左侧', icon: 'ArrowLeft', callBack: closeLeftTab },
    { label: '关闭右侧', icon: 'ArrowRight', callBack: closeRightTab },
    { label: '关闭所有', icon: 'Close', callBack: closeAllTab },
  ]

  return {
    activePath,
    tabList,
    cachedComponentNames,
    contextMenuOptions,
    addTab,
    removeTab,
    initTabList,
  }
})
