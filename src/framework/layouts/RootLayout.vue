<template>
  <RouterView v-slot="{ Component }">
    <component :is="selectedLayout.component" :key="selectedLayout.key">
      <component :is="Component" />
    </component>
  </RouterView>
</template>

<script setup lang="ts">
import { computed, toRefs } from 'vue'
import { useRoute } from 'vue-router'
import { LayoutEnum } from '@/framework/constants/LayoutEnum'
import LayoutMap from '@/framework/layouts/LayoutMap.ts'

const route = useRoute()
const { meta, matched } = toRefs(route)

/** 获取路由对应的布局名称 */
function getLayoutName(
  routeMeta: typeof meta.value,
  routeMatched: typeof matched.value,
): keyof typeof LayoutEnum {
  const validLayoutKeys = new Set(Object.keys(LayoutEnum))
  // 优先取当前路由的 meta.layout
  if (routeMeta.layout && validLayoutKeys.has(routeMeta.layout)) {
    return routeMeta.layout as keyof typeof LayoutEnum
  }

  // 遍历 matched 数组，找第一个有有效 layout 的路由记录
  for (const item of routeMatched) {
    if (item.meta?.layout && validLayoutKeys.has(item.meta.layout)) {
      return item.meta.layout as keyof typeof LayoutEnum
    }
  }
  // 否则返回默认布局
  return LayoutEnum.MainLayout
}

const selectedLayout = computed(() => {
  const layoutName = getLayoutName(meta.value, matched.value)
  // 确保返回有效布局
  return {
    component: LayoutMap[layoutName] || LayoutMap[LayoutEnum.MainLayout],
    key: layoutName || LayoutEnum.MainLayout,
  }
})
</script>

<style scoped></style>
