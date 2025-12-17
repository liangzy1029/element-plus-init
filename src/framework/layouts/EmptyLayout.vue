<template>
  <div id="empty-layout">
    <slot>
      <RouterView />
    </slot>
  </div>
</template>

<script setup lang="ts"></script>

<style scoped>
#empty-layout {
  width: 100%;
  height: 100%;
}
</style>
