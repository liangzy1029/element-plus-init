import type { DirectiveBinding } from 'vue'
import { useUserStore } from '@/stores'
import { PermissionsEnum } from '@/permission/permissionsEnum.ts'
import { checkPermission } from '@/permission'

type DirectiveValue = PermissionsEnum | undefined

/**
 * 权限控制指令
 */
export default {
  mounted(el: HTMLElement, binding: DirectiveBinding<DirectiveValue>) {
    validPermission(el, binding)
  },

  updated(el: HTMLElement, binding: DirectiveBinding<DirectiveValue>) {
    validPermission(el, binding)
  },
}

/**
 * 权限校验核心逻辑
 *
 * @param el 操作元素
 * @param binding 指令绑定信息
 */
function validPermission(el: HTMLElement, binding: DirectiveBinding<DirectiveValue>) {
  // 获取当前角色和所需权限
  const userStore = useUserStore()
  const currentRole = (userStore.loginUser.userRole as PermissionsEnum) || PermissionsEnum.NOT_LOGIN
  const requiredPermission = binding.value ?? PermissionsEnum.USER

  const hasPermission = checkPermission(currentRole, requiredPermission)

  el.style.display = hasPermission ? '' : 'none'
}
