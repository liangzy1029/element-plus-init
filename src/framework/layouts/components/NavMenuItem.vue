<template>
  <!--只有一级菜单-->
  <template v-if="!menu.children || menu.children.length === 0">
    <el-menu-item :index="menu.path" @click="handleClickMenu">
      <el-icon v-if="menu.meta?.icon" class="menu-title-icon">
        <component :is="menu.meta.icon" />
      </el-icon>
      <template #title>
        <span> {{ menu.meta?.title || menu?.name || menu.path }}</span>
      </template>
    </el-menu-item>
  </template>
  <!--只有一个子菜单-->
  <template v-else-if="menu.children && menu.children.length === 1">
    <el-menu-item :index="menu.children[0]?.path" @click="handleClickMenu">
      <el-icon v-if="menu.children[0]?.meta?.icon" class="menu-title-icon">
        <component :is="menu.children[0]?.meta.icon" />
      </el-icon>
      <template #title>
        <span>
          {{ menu.children[0]?.meta?.title || menu.children[0]?.name || menu.children[0]?.path }}
        </span>
      </template>
    </el-menu-item>
  </template>
  <!--存在多个子菜单-->
  <template v-else-if="menu.children.length > 1">
    <el-sub-menu popper-class="custom-menu-popup" :popper-offset="12" :index="menu.path">
      <template #title>
        <el-icon v-if="menu.meta?.icon" class="menu-title-icon">
          <component :is="menu.meta.icon" />
        </el-icon>
        <span>{{ menu.meta?.title || menu?.name || menu.path }}</span>
      </template>
      <NavMenuItem v-for="subMenu in menu.children" :key="subMenu.path" :menu="subMenu" />
    </el-sub-menu>
  </template>
</template>

<script setup lang="ts">
import type { MenuItemRegistered } from 'element-plus'
import { type RouteRecordRaw, useRouter } from 'vue-router'

defineProps<{
  menu: RouteRecordRaw
}>()

const router = useRouter()

/**
 * 点击菜单跳转
 */
const handleClickMenu = (item: MenuItemRegistered) => {
  router.push({ path: item.index })
}
</script>

<style scoped lang="scss">
// 引入公共样式
@use '@/framework/styles/mixins/menu' as menu;

// 穿透处理Element组件样式
:deep {
  // 子菜单标题和菜单项应用基础样式
  .el-sub-menu__title,
  .el-menu-item {
    @include menu.menu-base-styles;
  }

  // 菜单项激活态样式
  .el-menu-item.is-active {
    @include menu.menu-active-style;
  }
}
</style>
