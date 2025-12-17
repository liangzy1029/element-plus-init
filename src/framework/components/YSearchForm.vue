<template>
  <div id="custom-search-form" v-if="columns.length > 0">
    <!--表单部分-->
    <el-form ref="formRef" :inline="true">
        <template v-for="item in dynamicColumns" :key="item.key">
            <!--表单item-->
            <el-form-item :label="item.label">
              <template v-if="item.optionMap">
                <el-select
                  v-model="formData[item.key as keyof typeof formData]"
                  :placeholder="`请选择${item.label}`"
                  clearable
                  style="width: 240px"
                >
                  <template v-for="option in Object.values(item.optionMap)" :key="option.value">
                    <el-option
                      :label="option.label"
                      :value="isNaN(Number(option.value)) ? option.value:Number(option.value)"
                    >
                    </el-option>
                  </template>
                </el-select>
              </template>
              <template v-else>
                <el-input
                  clearable
                  v-model="formData[item.key as keyof typeof formData]"
                  :placeholder="`请输入${item.label}`"
                  style="width: 240px"
                />
              </template>
            </el-form-item>
        </template>
      <!--按钮部分-->
      <el-form-item>
        <el-button plain icon="Search" type="primary" @click="doSearch">查询</el-button>
        <el-button plain icon="Refresh" @click="doReset">重置</el-button>
        <el-button v-show="isShowBtn" type="primary" link @click="changeIsFold">
          {{ isFold ? '展开' : '收起' }}
          <el-icon v-if="isFold">
            <ArrowDown />
          </el-icon>
          <el-icon v-else>
            <ArrowUp />
          </el-icon>
        </el-button>
      </el-form-item>

    </el-form>
  </div>
</template>

<script setup lang="ts">
import { ArrowDown, ArrowUp } from '@element-plus/icons-vue'
import { computed, onMounted, ref } from 'vue'
import type { CustomSearchFormProps } from '@/framework/types'

const props = withDefaults(defineProps<CustomSearchFormProps>(), {
  initSearchParams: () => ({}),
  defaultShowNum: 3,
  showAll: false
})

interface Emits {
  (e: 'search', data: any): void

  (e: 'reset'): void
}

const emit = defineEmits<Emits>()

/** form 实例 */
const formRef = ref()
/** 查询的数据 */
const formData = ref({})
/** 是否折叠 */
const isFold = ref(true)

/** 是否展示右侧按钮组 */
const isShowBtn = computed(() => {
  if (props.showAll) return false
  return props.columns.length > props.defaultShowNum
})

/** 折叠和展开之间的切换 */
const changeIsFold = () => {
  isFold.value = !isFold.value
}

/** 动态获取展示的字段数据 */
const dynamicColumns = computed(() => {
  if (props.showAll) return [...props.columns]
  return props.columns.slice(0, isFold.value ? props.defaultShowNum : props.columns.length)
})

/**
 * 进行搜索
 */
function doSearch() {
  emit('search', formData.value)
}

/**
 * 重置表单
 */
function doReset() {
  formData.value = { ...props.initSearchParams }
  emit('reset')
}

// 初始化
onMounted(() => {
  // 初始化查询条件的值
  formData.value = { ...props.initSearchParams }
})
</script>

<style scoped>
#custom-search-form {
}

:deep(.el-form-item__label) {
  color: #303133;
  font-size: 14px;
  font-weight: 500;
}

:deep(.el-form--inline .el-form-item){
  margin-right: 12px;
}
</style>
