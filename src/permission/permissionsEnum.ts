/**
 * 系统所有权限类型
 * - NOT_LOGIN: 无需登录即可访问（游客权限）
 * - USER: 需登录（普通用户/管理员均可）
 * - ADMIN: 仅管理员可访问
 */
export enum PermissionsEnum {
  NOT_LOGIN = 'notLogin',
  USER = 'user',
  ADMIN = 'admin',
}
