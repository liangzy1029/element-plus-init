<template>
  <div class="tab-view">
    <el-tabs
      v-model="tabViewStore.activePath"
      type="card"
      @tab-change="changeTab"
      @tab-remove="tabViewStore.removeTab"
    >
      <el-tab-pane
        v-for="item in tabViewStore.tabList"
        :key="item.path"
        :label="item.title"
        :name="item.path"
        :closable="!item.affix"
      >
        <template #label>
          <YContextMenu
            :menus="tabViewStore.contextMenuOptions.map((menu) => ({ ...menu, path: item.path }))"
          >
            <el-icon v-if="item?.icon" style="margin-right: 4px">
              <component :is="item.icon" />
            </el-icon>
            <span>{{ item.title }}</span>
          </YContextMenu>
        </template>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script setup lang="ts">
import { onMounted, watch } from 'vue'
import { YContextMenu } from '@/framework/components'
import { useTabViewStore } from '@/framework/stores'
import { useRoute, useRouter } from 'vue-router'
import type { TabPaneName } from 'element-plus'

const router = useRouter()
const route = useRoute()

const tabViewStore = useTabViewStore()

const changeTab = (newPath: TabPaneName) => {
  router.push(newPath as string)
}

onMounted(() => {
  tabViewStore.initTabList()
})

// 监听路由变化，更新标签页
watch(
  () => route,
  (newRoute) => tabViewStore.addTab(newRoute as any),
  { deep: true },
)
</script>

<style scoped>
.tab-view {
  height: var(--layout-tags-height);
  box-sizing: border-box;
}

:deep(.el-tabs__header) {
  height: var(--layout-tags-height) !important;
  margin-bottom: 0;
  border: none;
}

:deep(.el-tabs__nav) {
  height: var(--layout-tags-height) !important;
  border: none !important;
}

:deep(.el-tabs__nav-prev),
:deep(.el-tabs__nav-next) {
  top: 1px;
  height: calc(var(--layout-tags-height) - 1px);
  line-height: calc(var(--layout-tags-height) - 1px);
  color: #303133;
  font-size: 18px;
  font-weight: 500;
}

:deep(.is-disabled) {
  cursor: not-allowed;
}

:deep(.el-tabs__item) {
  top: 1px;
  height: calc(var(--layout-tags-height) - 1px);
  line-height: calc(var(--layout-tags-height) - 1px);
  border: 1px solid #dcdfe6 !important;
  background-color: #ffffff;
  margin: 0 4px !important;
  padding: 0 8px !important;
  color: #303133;
  font-size: 12px;
  font-weight: 400;
  border-radius: 4px;
}

:deep(.el-tabs__item:hover:not(.is-active)) {
  background-color: rgb(232.8, 233.4, 234.6);
  transform: translateY(-1px);
}

:deep(.el-tabs__item.is-active) {
  background: #1d84ff1a;
  color: var(--el-color-primary) !important;
}

:deep(.el-tabs__item.is-closable),
:deep(.el-tabs__item.is-closable:hover) {
  padding: 0 8px !important;
}

:deep(.is-icon-close) {
  width: 14px !important;
}
</style>
