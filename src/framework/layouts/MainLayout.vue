<template>
  <div class="main-layout">
    <el-container>
      <el-aside class="side-container">
        <LogoSection />
        <NavMenu mode="vertical" />
      </el-aside>
      <el-container>
        <el-header class="header-container">
          <HeaderLeft style="flex: 1" />
          <HeaderRight />
        </el-header>
        <div class="tags-view-container">
          <TabView />
        </div>
        <el-main class="content-container">
          <div v-if="!layoutStore.isNeedRefresh">
            <slot>
              <router-view />
            </slot>
          </div>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script setup lang="ts">
import LogoSection from '@/framework/layouts/components/LogoSection.vue'
import NavMenu from '@/framework/layouts/components/NavMenu.vue'
import HeaderLeft from '@/framework/layouts/components/HeaderLeft.vue'
import HeaderRight from '@/framework/layouts/components/HeaderRight.vue'
import TabView from '@/framework/layouts/components/TabView.vue'
import { useLayoutStore } from '@/framework/stores'

const layoutStore = useLayoutStore()
</script>

<style scoped>
.side-container {
  width: var(--layout-side-width);
  height: var(--layout-side-height);
  background-color: #ffffff;
  box-shadow: none;
  box-sizing: border-box;
  border-right: var(--layout-border) solid #dbdfe9;
  transition: all 0.3s ease-in-out;
  overflow-x: hidden;
}

.header-container {
  display: flex;
  align-items: center;
  height: var(--layout-header-height);
  padding: 0 calc(var(--y-base-padding) * 2) 0 var(--y-base-padding);
  background-color: #fafbfc;
  /*
  border-bottom: 1px solid #e5e7eb;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
  */
}

.tags-view-container {
  height: var(--layout-tags-height);
  background-color: #fafbfc;
  padding: 0 var(--y-base-padding);
}

.content-container {
  height: var(--layout-content-height);
  padding: var(--y-base-padding);
  /*
  background: linear-gradient(135deg,
  color-mix(in srgb, #e8f2ff 100%, #fafbfc),
  color-mix(in srgb, #d1e6ff 80%, #fafbfc));
  */
  background-color: #fafbfc;
}
</style>
