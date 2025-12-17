<template>
  <div class="y-container">
    <slot></slot>
  </div>
</template>

<script setup lang="ts"></script>

<style scoped>
.y-container {
  width: 100%;
  height: 100%;
  padding: 20px 16px;
  background-color: #ffffff;
  border: 1px solid #dbdfe9;
  border-radius: 8px;
}
</style>
