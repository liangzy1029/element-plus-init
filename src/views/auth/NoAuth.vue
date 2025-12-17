<template>
  <div style="width: 100vw; height: 100vh; display: flex; justify-content: center; margin: 0">
    <el-result icon="error" title="403 - 无权限">
      <template #extra>
        <el-button @click="$router.push('/')">前往首页</el-button>
        <el-button v-if="canGoBack()" @click="goBack">返回上一页</el-button>
      </template>
    </el-result>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

const goBack = () => {
  router.go(-1)
}
const canGoBack = () => {
  return window.history.length > 1
}
</script>

<style scoped></style>
