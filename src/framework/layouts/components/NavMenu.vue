<template>
  <div>
    <el-menu
      mode="vertical"
      :collapse="layoutStore.isCollapsed"
      :default-active="activeIndex"
      popper-class="custom-menu-popup"
      style="border-right: none"
    >
      <template v-for="(menu, index) in visibleRoutes" :key="`${menu.path}-${index}`">
        <!--只有一级菜单-->
        <template v-if="!menu.children || menu.children.length === 0">
          <el-menu-item :index="menu.path" :key="menu.path" @click="handleClickMenu">
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
          <el-menu-item :index="menu.children[0]?.path" :key="menu.path" @click="handleClickMenu">
            <el-icon v-if="menu.children[0]?.meta?.icon" class="menu-title-icon">
              <component :is="menu.children[0]?.meta.icon" />
            </el-icon>
            <template #title>
              <span>
                {{
                  menu.children[0]?.meta?.title || menu.children[0]?.name || menu.children[0]?.path
                }}
              </span>
            </template>
          </el-menu-item>
        </template>
        <!--存在多个子菜单-->
        <template v-else-if="menu.children.length > 1">
          <el-sub-menu popper-class="custom-menu-popup" :index="menu.path" :key="menu.path">
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
    </el-menu>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { routes } from '@/config/routes.ts'
import NavMenuItem from '@/framework/layouts/components/NavMenuItem.vue'
import { useUserStore } from '@/stores'
import { useLayoutStore } from '@/framework/stores'
import { checkPermission } from '@/permission'
import type { MenuItemRegistered } from 'element-plus'
import { PermissionsEnum } from '@/permission/permissionsEnum.ts'
import { type RouteRecordRaw, useRoute, useRouter } from 'vue-router'

/**
 * 激活的菜单索引
 */
const activeIndex = ref('/')

const router = useRouter()
const route = useRoute()
const layoutStore = useLayoutStore()
const userStore = useUserStore()

/**
 * 可见菜单
 */
const visibleRoutes = computed(() => {
  return filterRoutes(JSON.parse(JSON.stringify(routes)))
})

/**
 * 点击菜单跳转
 */
const handleClickMenu = (item: MenuItemRegistered) => {
  router.push({ path: item.index })
}

/**
 * 路由跳转后更新激活的菜单
 */
router.afterEach((to) => {
  activeIndex.value = to.path
})

onMounted(() => {
  activeIndex.value = route.path
})

/**
 * 过滤无权限或者不可见菜单
 *
 * @param routes
 */
function filterRoutes(routes: RouteRecordRaw[]) {
  return routes.filter((item) => {
    const routePermission = item.meta?.permission ?? PermissionsEnum.ADMIN
    if (
      item.meta?.hideInMenu ||
      !checkPermission(userStore.loginUser.userRole as PermissionsEnum, routePermission)
    ) {
      return false
    }
    if (item.children && item.children.length > 0) {
      item.children = filterRoutes(item.children)
    }
    return true
  })
}
</script>

<style scoped lang="scss">
// 引入公共样式
@use '@/framework/styles/mixins/menu' as menu;

// 折叠态菜单宽度
:deep(.el-menu--collapse) {
  width: var(--layout-side-collapse-width);
}

// 子菜单标题和菜单项基础样式
:deep(.el-sub-menu__title),
:deep(.el-menu-item) {
  @include menu.menu-base-styles;
}

// 菜单项激活态样式
:deep(.el-menu-item.is-active) {
  @include menu.menu-active-style;
}

// 折叠菜单弹出层
.custom-menu-popup {
  .el-sub-menu__title,
  .el-menu-item {
    @include menu.menu-base-styles;
  }
  // 弹窗内菜单激活态
  .el-menu-item.is-active {
    @include menu.menu-active-style;
  }
}
</style>
