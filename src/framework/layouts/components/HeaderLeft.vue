<template>
  <div class="header-left">
    <div class="icon-box" @click="layoutStore.sideBarCollapse()">
      <el-icon v-if="layoutStore.isCollapsed" size="20">
        <DArrowRight />
      </el-icon>
      <el-icon v-else size="20">
        <DArrowLeft />
      </el-icon>
    </div>
    <div class="icon-box" @click="layoutStore.refreshPage()">
      <el-icon size="20" class="refresh-icon">
        <Refresh />
      </el-icon>
    </div>
    <el-breadcrumb separator="/" style="margin-left: 8px">
      <el-breadcrumb-item to="/">
        <span class="breadcrumb-text">首页</span>
      </el-breadcrumb-item>
      <template v-if="route.fullPath !== '/'">
        <el-breadcrumb-item v-for="item in route.matched" :key="item.path">
          {{ item?.meta?.title || item.name || item.path }}
        </el-breadcrumb-item>
      </template>
    </el-breadcrumb>
  </div>
</template>

<script setup lang="ts">
import { DArrowLeft, DArrowRight, Refresh } from '@element-plus/icons-vue'
import { useLayoutStore } from '@/framework/stores'
import { useRoute } from 'vue-router'

const route = useRoute()
const layoutStore = useLayoutStore()
</script>

<style scoped>
.header-left {
  display: flex;
  align-items: center;
  height: var(--layout-header-height);
}

.icon-box {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 36px;
  height: 36px;
  border-radius: 8px;
  cursor: pointer;
}

.icon-box:hover {
  background-color: #e9ecef;
}

/* 定义基础旋转动画 */
@keyframes rotateSingle {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(180deg);
  }
}

.refresh-icon:hover {
  animation: rotateSingle 0.5s ease-in-out;
}

.breadcrumb-text {
  color: #303133;
  font-size: 15px;
  font-weight: 500;
  user-select: none;
  cursor: pointer;
  pointer-events: auto;
}

.breadcrumb-text:hover {
  color: var(--el-color-primary);
}
</style>
