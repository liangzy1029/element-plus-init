import router from '@/framework/router'
import NProgress from 'nprogress'
import { useUserStore } from '@/stores'
import settings from '@/config/settings.ts'
import { PermissionsEnum } from '@/permission/permissionsEnum.ts'

/**
 * 是否首次加载
 */
let firstLoading = true

/**
 * 路由白名单
 */
const WHITE_LIST = ['/login', 'register', '/404', '/401', '/500']

/**
 * 前置守卫
 */
router.beforeEach(async (to, from, next) => {
  NProgress.start()

  // 前往页面需要的权限 默认 admin
  const needPermission = to.meta?.permission ?? PermissionsEnum.ADMIN

  // 1.不需要登录的情况或者是路由白名单
  if (needPermission === PermissionsEnum.NOT_LOGIN || WHITE_LIST.includes(to.path)) {
    next()
    return
  }

  const userStore = useUserStore()
  // 首次/刷新后加载用户信息
  if (firstLoading) {
    await userStore.fetchLoginUser()
    firstLoading = false
  }

  const loginUser = userStore.loginUser
  // 2.需要登录，但是还没有登录
  if (!loginUser?.id || loginUser?.userRole === PermissionsEnum.NOT_LOGIN) {
    next(`/login?redirect=${to.fullPath}`)
    return
  }

  // 3.已经登录，则判断权限是否够，不足，跳转无权限页面
  if (!checkPermission(loginUser.userRole as PermissionsEnum, needPermission)) {
    next(`/login?redirect=${to.fullPath}`)
    return
  }

  next()
})

/**
 * 后置守卫
 */
router.afterEach((to) => {
  const systemName = settings.systemName || ''
  // 修改浏览器标签页 title
  document.title = systemName + (to.meta.title ? ' - ' + to.meta.title : '')
  NProgress.done()
})

/**
 * 检查当前登录用户是否具备指定权限
 *
 * @param currentPermission 拥有的权限
 * @param requiredPermission 目标权限
 * @returns boolean true=有权限，false=无权限
 */
export const checkPermission = (
  currentPermission: PermissionsEnum,
  requiredPermission: PermissionsEnum,
): boolean => {
  // 1. 获取当前用户的实际权限：未登录 → NOT_LOGIN，否则取用户角色
  currentPermission = currentPermission ?? PermissionsEnum.NOT_LOGIN

  // 2. 无需登录的场景：直接放行（所有用户都有权限）
  if (requiredPermission === PermissionsEnum.NOT_LOGIN) {
    return true
  }

  // 3. 需登录的场景：排除未登录用户（普通用户/管理员均满足）
  if (requiredPermission === PermissionsEnum.USER) {
    return currentPermission !== PermissionsEnum.NOT_LOGIN
  }

  // 4. 仅管理员权限
  if (requiredPermission === PermissionsEnum.ADMIN) {
    return currentPermission === PermissionsEnum.ADMIN
  }

  return false
}
