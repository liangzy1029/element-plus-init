import MainLayout from '@/framework/layouts/MainLayout.vue'
import EmptyLayout from '@/framework/layouts/EmptyLayout.vue'
import type { Component } from 'vue'
import type { LayoutEnum } from '@/framework/constants/LayoutEnum.ts'

/**
 * 布局组件映射
 */
export default {
  MainLayout: MainLayout,
  EmptyLayout: EmptyLayout,
} as Record<LayoutEnum, Component>
