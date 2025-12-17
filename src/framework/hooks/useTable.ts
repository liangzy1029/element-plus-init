import { ref } from 'vue'
import type { ColumnType, OperationConfig, YTableProps } from '@/framework/types'
import { cloneDeep } from 'lodash-es'

export default function useTable() {
  /** 表格 loading */
  const tableLoading = ref(false)
  /** 表格数据 */
  const tableData = ref<any[]>([])
  /** 是否选择数据 */
  const hasSelected = ref(false)
  /** 选择的数据集合 */
  const selectedItems = ref<any[]>([])
  /** 选择数据的 Id 集合 */
  const selectedIds = ref<any[]>([])

  /** 表格外的操作按钮 */
  function getOuterOperations(props: YTableProps): OperationConfig[] {
    if (!props || !props.operations) return []
    let _operations = cloneDeep(props.operations)
    // 过滤表格里的操作按钮
    _operations = _operations
      .filter((item) => item.kind == 1 || !Object.prototype.hasOwnProperty.call(item, 'kind'))
      .map((item) => {
        item.batch = hasSelected.value ? false : item.batch
        item.kind = 1
        if (!Object.prototype.hasOwnProperty.call(item, 'show')) {
          item.show = true
        }
        return item
      })

    return _operations
  }

  /** 表格里的操作按钮 */
  function getInnerOperations(props: YTableProps): OperationConfig[] {
    if (!props || !props.operations) return []
    let _operations = cloneDeep(props.operations)
    // 过滤表格外的操作按钮
    _operations = _operations
      .filter((item) => item.kind == 2)
      .map((item) => {
        item.kind = 2
        if (!Object.prototype.hasOwnProperty.call(item, 'show')) {
          item.show = true
        }
        return item
      })
    return _operations
  }

  /** 获取列选项的类型 */
  const getColumnOptionType = (column: ColumnType<any>, row: Record<string, any>) => {
    const key = row[column.key.toString()]
    // 确保索引类型为字符串或数字，且类型在允许范围内
    if (typeof key !== 'string' && typeof key !== 'number') return undefined

    const option = column.optionMap?.[key.toString()]
    return ['', 'primary', 'success', 'info', 'warning', 'danger'].includes(option?.type ?? '')
      ? (option?.type ?? '')
      : undefined
  }

  /** 获取列选项的标签 */
  const getColumnOptionLabel = (column: ColumnType<any>, row: Record<string, any>) => {
    const key = row[column.key.toString()]
    if (typeof key !== 'string' && typeof key !== 'number') return ''

    return column.optionMap?.[key.toString()]?.label ?? ''
  }

  return {
    tableLoading,
    tableData,
    hasSelected,
    selectedItems,
    selectedIds,
    getOuterOperations,
    getInnerOperations,
    getColumnOptionLabel,
    getColumnOptionType,
  }
}
