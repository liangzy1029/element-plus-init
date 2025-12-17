import { ElMessageBox, type ElMessageBoxOptions } from 'element-plus'

type ConfirmResult = {
  isConfirm: boolean
  isCancel: boolean
}

/**
 * 通用确认弹窗
 *
 * @param content 提示文案（默认：确定要删除吗？）
 * @param title 弹窗标题（默认：系统提示）
 * @param options 弹窗配置（透传 Element Plus 配置）
 * @returns 确认/取消状态
 */
export default async function (
  content = '确定要删除吗？',
  title = '系统提示',
  options: Partial<ElMessageBoxOptions> = {},
): Promise<ConfirmResult> {
  // 合并默认配置和自定义配置
  const defaultOptions: ElMessageBoxOptions = {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
    draggable: true,
    overflow: true,
    ...options,
  }
  return await ElMessageBox.confirm(content, title, defaultOptions)
    .then(() => ({ isConfirm: true, isCancel: false }))
    .catch(() => ({ isConfirm: false, isCancel: true }))
}
