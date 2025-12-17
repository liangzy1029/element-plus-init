<template>
  <div id="logo-section">
    <img :src="settings.logo" alt="" @click="toHomePage" />
    <div v-if="!layoutStore.isCollapsed" class="title" @click="toHomePage">
      {{ settings.systemName }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { useLayoutStore } from '@/framework/stores'
import { useRouter } from 'vue-router'
import settings from '@/config/settings.ts'

const router = useRouter()
const layoutStore = useLayoutStore()

function toHomePage() {
  router.push('/')
}
</script>

<style scoped>
#logo-section {
  display: flex;
  align-items: center;
  flex-shrink: 0;
  width: var(--logo-section-width);
  height: var(--layout-header-height);
  padding-left: 16px;
  box-sizing: border-box;
}

#logo-section img {
  width: 32px;
  cursor: pointer;
}

#logo-section .title {
  height: var(--layout-header-height);
  box-sizing: border-box;
  margin-left: 8px;
  color: #333333;
  font-size: 18px;
  line-height: var(--layout-header-height);
  cursor: pointer;
  transition: all 0.3s ease-in-out;
  overflow: hidden;
}
</style>
