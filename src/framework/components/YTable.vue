<template>
  <div class="y-table">
    <!--搜索部分-->
    <div
      v-if="!props.hideSearchForm && searchColumns.length > 0"
      style="margin-bottom: 8px; padding: 0 2px"
    >
      <YSearchForm
        :columns="searchColumns"
        :init-search-params="initSearchFormParams"
        :default-show-num="searchConfig?.defaultShowNum"
        :show-all="searchConfig?.showAll"
        @reset="doReset"
        @search="doSearch"
      />
    </div>
    <!-- 按钮部分 -->
    <div v-if="showOuterOperation" style="margin-bottom: 8px; padding: 0 2px">
      <el-space wrap size="default">
        <template v-for="item in outerOperations" :key="item.label">
          <el-button
            v-if="
              typeof item.show === 'function'
                ? item.show([...selectedIds], [...selectedItems])
                : item.show
            "
            plain
            :icon="item.icon ?? ''"
            :disabled="item.batch && !hasSelected"
            :type="item.type ?? ''"
            @click="item.fn ? item.fn([...selectedIds], [...selectedItems]) : () => {}"
          >
            {{ item.label }}
          </el-button>
        </template>
      </el-space>
    </div>

    <!--表格部分-->
    <el-table
      id="table"
      ref="tableRef"
      border
      stripe
      v-loading="tableLoading"
      :data="tableData"
      header-row-class-name="custom-table-header"
      header-cell-class-name="custom-table-header"
      @selection-change="handleSelectionChange"
    >
      <!--选择列-->
      <el-table-column v-if="!hideSelectionColumn" type="selection" width="50" />

      <!--索引列-->
      <el-table-column v-if="showIndexColumn" type="index" align="center" />

      <!--字段部分-->
      <template v-for="column in columns" :key="column.key">
        <el-table-column
          :prop="column.key.toString()"
          :label="column.label"
          :width="column.width"
          align="center"
        >
          <template #default="{ row }">
            <!--自定义显示-->
            <slot :name="column.key" :row="row" :value="row[column.key]">
              <!-- 文本 -->
              <template v-if="column.type === 'text'">
                {{ row[column.key] ?? '' }}
              </template>
              <!--  tag 标签 -->
              <template v-else-if="column.optionMap && row[column.key] !== undefined">
                <el-tag :type="getColumnOptionType(column, row) || undefined">
                  {{ getColumnOptionLabel(column, row) || '' }}
                </el-tag>
              </template>
              <!-- 图片 -->
              <template v-else-if="column.type === 'image'">
                <el-image
                  preview-teleported
                  :src="accessibleFileUrl(row[column.key], column.fileBaseUrl)"
                  :preview-src-list="[accessibleFileUrl(row[column.key], column.fileBaseUrl) ?? '']"
                  fit="contain"
                  show-progress
                  style="width: 48px; height: 48px"
                />
              </template>
              <!-- 时间 -->
              <template
                v-else-if="
                  column.type === 'datetime' &&
                  row[column.key] !== undefined &&
                  typeof row[column.key] === 'string'
                "
              >
                {{
                  dayjs(row[column.key]).format(
                    column.datetimeFormat ? column.datetimeFormat : 'YYYY-MM-DD HH:mm:ss',
                  )
                }}
              </template>

              <template v-else>
                {{ row[column.key] ?? '' }}
              </template>
            </slot>
          </template>
        </el-table-column>
      </template>

      <!--操作部分-->
      <el-table-column
        v-if="showInnerOperation && !hideOperationColumn"
        label="操作"
        align="center"
        :width="operationColumnWidth"
      >
        <template #default="{ row }">
          <template v-for="item in innerOperations" :key="item.label">
            <el-button
              v-if="typeof item.show === 'function' ? item.show({ ...row }) : item.show"
              link
              :type="item.type ?? ''"
              @click="item.fn ? item.fn({ ...row }) : () => {}"
            >
              {{ item.label }}
            </el-button>
          </template>
        </template>
      </el-table-column>

      <!-- dataSource 表格数据为空时 -->
      <template #empty>
        <el-empty description="暂无数据" />
      </template>
    </el-table>
    <!-- 表格部分结束 -->

    <!--分页器部分-->
    <YPagination
      :current="searchParams.current"
      :size="searchParams.size"
      :total="total"
      :hide="total <= 0"
      @pagination="handlePagination"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, defineProps, onMounted, ref, useTemplateRef } from 'vue'
import { ElMessage, type TableInstance } from 'element-plus'
import type { SearchParamType, YTableProps } from '@/framework/types'
import YPagination from '@/framework/components/YPagination.vue'
import useTable from '@/framework/hooks/useTable.ts'
import { accessibleFileUrl } from '@/utils/serverUtil.ts'
import dayjs from 'dayjs'
import YSearchForm from '@/framework/components/YSearchForm.vue'

const props = withDefaults(defineProps<YTableProps>(), {
  operations: () => [],
  data: () => [],
  params: () => {
    return {}
  },
  primaryKey: 'id',
})
/** 默认请求参数 */
const DEFAULT_SEARCH_PARAMS: SearchParamType = { current: 1, size: 5 } as const

const tableRef = useTemplateRef<TableInstance>('tableRef')
const searchParams = ref<SearchParamType | Record<string, any>>({ ...DEFAULT_SEARCH_PARAMS })
const total = ref(0)

const {
  tableLoading,
  tableData,
  hasSelected,
  selectedItems,
  selectedIds,
  getOuterOperations,
  getInnerOperations,
  getColumnOptionLabel,
  getColumnOptionType,
} = useTable()

onMounted(async () => {
  // 初始化搜索参数
  searchParams.value = { ...DEFAULT_SEARCH_PARAMS, ...props.params }
  await fetchData()
})

/**
 * 保留需要搜索字段集合
 */
const searchColumns = computed(() => {
  return props.columns.filter((item) => !item.hideInSearch) || []
})

const initSearchFormParams = computed(() => {
  return { ...DEFAULT_SEARCH_PARAMS, ...props.params }
})

/**
 * 发起搜索操作
 */
async function doSearch(_params: any) {
  searchParams.value = { ..._params }
  await fetchData()
}

/**
 * 重置搜索表单
 */
async function doReset() {
  searchParams.value = { ...DEFAULT_SEARCH_PARAMS, ...props.params }
  await fetchData()
}

/** 加载表格数据 */
async function fetchData() {
  try {
    tableLoading.value = true
    if (!(typeof props.request === 'function')) return
    const res = await props.request({ ...searchParams.value })
    if (res.data.code !== 0) {
      ElMessage.error(res.data.message)
      return
    }
    tableData.value = res.data.data?.records || []
    total.value = Number(res.data.data.total) || 0
  } catch (error: any) {
    console.error(error)
  } finally {
    tableLoading.value = false
  }
}

/** 处理选择表格数据 */
function handleSelectionChange(newSelections: any[]) {
  hasSelected.value = newSelections.length > 0
  selectedItems.value = [...newSelections]
  selectedIds.value = newSelections
    .filter((item) => item.hasOwnProperty(props.primaryKey))
    .map((item) => item[props.primaryKey])
}

/** 分页器改变时 */
async function handlePagination(current: number, size: number) {
  searchParams.value.current = searchParams.value.size !== size ? 1 : current
  searchParams.value.size = size
  await fetchData()
}

/** 表格外的操作按钮 */
const outerOperations = computed(() => {
  return getOuterOperations(props)
})

/** 表格里的操作按钮 */
const innerOperations = computed(() => {
  return getInnerOperations(props)
})

/** 表格外的操作按钮展示条件 */
const showOuterOperation = computed(() => {
  return outerOperations.value.length > 0
})

/** 表格里的操作按钮展示条件 */
const showInnerOperation = computed(() => {
  return innerOperations.value.length > 0
})

/**
 * 给外部暴露的属性和方法
 */
defineExpose({ fetchData, searchParams })
</script>

<style scoped lang="scss">
.y-table {
}
</style>
<style>
.custom-table-header {
  height: 50px;
  color: #303133;
  background-color: #fafafa !important;
  font-size: 14px;
  font-weight: 500;
  transition: background 0.2s ease;
}
</style>
