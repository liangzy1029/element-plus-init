<template>
  <div v-if="!hide" class="y-pagination">
    <el-pagination
      :current-page="current"
      :page-size="size"
      :page-sizes="pageSizes"
      :background="background"
      :layout="layout.join(',')"
      :total="Number(props.total)"
      @current-change="handleCurrentChange"
      @size-change="handleSizeChange"
    />
  </div>
</template>

<script setup lang="ts">
type paginationLayout = 'total' | 'sizes' | 'prev' | 'pager' | 'next' | 'jumper'
type Props = {
  /** 当前页号 */
  current: number
  /** 每页大小 */
  size: number
  /** 总条数 */
  total: number | string
  /** 每页显示个数选择器 */
  pageSizes?: number[]
  /** 是否显示分页器背景颜色 */
  background?: boolean
  layout?: paginationLayout[]
  /** 是否隐藏分页器 */
  hide?: boolean
}
type Emits = {
  (e: 'pagination', current: number, size: number): void
}
const props = withDefaults(defineProps<Props>(), {
  pageSizes: () => [1, 2, 5, 10],
  hide: false,
  background: true,
  layout: () => ['total', 'sizes', 'prev', 'pager', 'next', 'jumper'],
})
const emits = defineEmits<Emits>()

const handleCurrentChange = (newCurrent: number) => {
  emits('pagination', newCurrent, props.size)
}

const handleSizeChange = (newSize: number) => {
  emits('pagination', props.current, newSize)
}
</script>

<style scoped lang="scss">
.y-pagination {
  display: flex;
  justify-content: flex-end;
  margin: 20px 8px 0 0;
}
</style>
