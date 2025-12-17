<template>
  <el-config-provider :locale="zhCn">
    <RootLayout />
  </el-config-provider>
</template>

<script setup lang="ts">
import zhCn from 'element-plus/es/locale/lang/zh-cn'
import RootLayout from '@/framework/layouts/RootLayout.vue'
</script>

<style scoped></style>
