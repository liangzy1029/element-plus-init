import HomeView from '@/views/HomeView.vue'
import LoginView from '@/views/auth/LoginView.vue'
import RegisterView from '@/views/auth/RegisterView.vue'
import UserView from '@/views/user/UserView.vue'
import FileView from '@/views/file/FileView.vue'
import type { RouteRecordRaw } from 'vue-router'
import { PermissionsEnum } from '@/permission/permissionsEnum.ts'
import NotFound from '@/views/auth/NotFound.vue'
import NoAuth from '@/views/auth/NoAuth.vue'
import TableTest from '@/views/TableTest.vue'
import { LayoutEnum } from '@/framework/constants/LayoutEnum.ts'

// Meta 类型
// {
//   /** 菜单标题 */
//   title?: string
//   /** 菜单图标 */
//   icon?: string
//   /** 路由需要的权限 */
//   permission?: PermissionsEnum;
//   /** 是否隐藏在菜单 */
//   hideInMenu?: boolean
//   /** 布局 */
//   layout?: LayoutEnum;
//   /** 是否隐藏在 Tab（标签栏） */
//   hideInTab?: boolean
//   /** 是否固定在 Tab（标签栏） */
//   affix?: boolean
//   /** 是否缓存组件(待实现) */
//   keepAlive?: boolean
// }

export const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: HomeView,
    meta: {
      title: '首页',
      icon: 'House',
      permission: PermissionsEnum.USER,
      affix: true,
    },
  },
  {
    path: '/user',
    component: UserView,
    meta: {
      title: '用户管理',
      icon: 'User',
      permission: PermissionsEnum.ADMIN,
    },
  },
  {
    path: '/file',
    component: FileView,
    meta: {
      title: '文件管理',
      icon: 'FolderOpened',
      permission: PermissionsEnum.USER,
    },
  },
  {
    path: '/table',
    component: TableTest,
    meta: {
      title: '表格测试',
      icon: 'Notebook',
      permission: PermissionsEnum.USER,
      affix: true,
    },
  },
  {
    path: '/login',
    component: LoginView,
    meta: {
      title: '登录',
      permission: PermissionsEnum.NOT_LOGIN,
      layout: LayoutEnum.EmptyLayout,
      hideInMenu: true,
    },
  },
  {
    path: '/register',
    component: RegisterView,
    meta: {
      title: '注册',
      permission: PermissionsEnum.NOT_LOGIN,
      layout: LayoutEnum.EmptyLayout,
      hideInMenu: true,
    },
  },
  // 403 路由
  {
    path: '/403',
    name: 'NoAuth',
    component: NoAuth,
    meta: {
      title: '404',
      permission: PermissionsEnum.NOT_LOGIN,
      layout: LayoutEnum.EmptyLayout,
      hideInMenu: true,
      hideInTab: true,
    },
  },
  // 404 路由
  {
    path: '/404',
    name: 'NotFound',
    component: NotFound,
    meta: {
      title: '404',
      permission: PermissionsEnum.NOT_LOGIN,
      layout: LayoutEnum.EmptyLayout,
      hideInMenu: true,
      hideInTab: true,
    },
  },
  // 匹配所有未定义的路径，必须放在最后！
  {
    path: '/:pathMatch(.*)*',
    redirect: '/404',
    meta: {
      title: '任意错误路由',
      permission: PermissionsEnum.NOT_LOGIN,
      hideInMenu: true,
      hideInTab: true,
    },
  },
]
