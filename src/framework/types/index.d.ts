import type { PermissionsEnum } from '@/permission/permissionsEnum.ts'
import type { LayoutEnum } from '@/framework/layouts/LayoutMap.ts'

/**
 * 自定义路由 meta 类型
 */
declare module 'vue-router' {
  interface RouteMeta {
    /** 菜单标题 */
    title?: string
    /** 菜单图标 */
    icon?: string
    /** 路由需要的权限 */
    permission?: PermissionsEnum
    /** 是否隐藏在菜单 */
    hideInMenu?: boolean
    /** 布局 */
    layout?: LayoutEnum
    /** 是否隐藏在 Tab（标签栏） */
    hideInTab?: boolean
    /** 是否固定在 Tab（标签栏） */
    affix?: boolean
    /** 是否缓存组件(待实现) */
    keepAlive?: boolean
  }
}

export type YTableProps = {
  /** 字段 */
  columns: ColumnType<any>[]
  /** 操作按钮配置 */
  operations?: OperationConfig[]
  /** 获取数据请求 */
  request?: any
  /** 请求参数 */
  params?: Record<string, any> & SearchParamType
  /** 是否隐藏'操作'列 */
  hideOperationColumn?: boolean
  /** 隐藏选择列 */
  hideSelectionColumn?: boolean
  /** 隐藏搜索表单 */
  hideSearchForm?: boolean
  /** 隐藏索引列 */
  showIndexColumn?: boolean
  /** 操作列宽度 */
  operationColumnWidth?: string | number
  /** 搜索配置 */
  searchConfig?: {
    /** 是否显示全部 */
    showAll?: boolean
    /** 默认显示的数量 */
    defaultShowNum?: number
  }
  /** 数据的主键名称 */
  primaryKey?: string
}

/** Table 字段类型 */
export type ColumnType<T extends Record<string, any>> = {
  /** 字段 */
  key: keyof T
  /** 标题 */
  label: string
  /** 数据类型 */
  type?: 'text' | 'image' | 'select' | 'datetime'
  /** 字典数据 */
  optionMap?: OptionMap
  /** 列宽 */
  width?: string | number
  /** 在搜索表单中隐藏 */
  hideInSearch?: boolean
  /** 文件 URL 前缀 */
  fileBaseUrl?: string
  /** 时间格式化 */
  datetimeFormat?: string
}

/**
 * 查询参数类型
 */
export type SearchParamType = {
  current?: number
  size?: number
  sortField?: string
  sortOrder?: string
}

/**
 * 字典数据类型
 */
export type OptionEnum = {
  label: string | number
  value: string | number | boolean
  type: '' | 'primary' | 'success' | 'info' | 'warning' | 'danger'
}

export type OptionMap = Record<string, OptionEnum>

/** 操作按钮配置 */
export type OperationConfig = {
  /** 唯一标识(内置 add update delete batchDelete) */
  key?: string
  /** 按钮名称 */
  label: string
  /** 按钮类 */
  type?: '' | 'primary' | 'success' | 'info' | 'warning' | 'danger'
  /** 按钮的功能 */
  fn?: (...data: any) => void
  /** 按钮展示的条件 */
  show?: boolean | ((...data: any) => boolean)
  /** 按钮位置类型 1-表格上方 2-表格 */
  kind?: 1 | 2
  /** 是否是批量操作 */
  batch?: boolean
  /** 按钮图标 (kind 为 1 生效) */
  icon?: string
}

/** 自定义搜索 Form Props */
export type CustomSearchFormProps = {
  /** 字段 */
  columns: ColumnType<any>[]
  /** 初始化查询参数 */
  initSearchParams?: Record<string, any>
  /** 默认显示数量 */
  defaultShowNum?: number
  /** 是否显示全部 */
  showAll?: boolean
}

/**
 * 标签页项类型
 */
export interface TabItem {
  /** 标签标题 */
  title: string
  /** 标签路由路径 */
  path: string
  /** 路由名称 */
  name: string | undefined | null
  /** 标签图标 */
  icon: string
  /** 是否固定标签（不可关闭） */
  affix: boolean
}

/**
 * 右键菜单选项类型
 */
export type ContextMenuOption =
  | {
      /** 菜单文本 */
      label: string
      /** 菜单图标 */
      icon?: string
      /** 菜单点击回调函数 */
      callBack?: (contextMenuOption: ContextMenuOption) => void | Promise<void>
    }
  | Record<string, any>

/** 自定义指令 resizes  */
export type ElementSizes = {
  width: number
  height: number
}
