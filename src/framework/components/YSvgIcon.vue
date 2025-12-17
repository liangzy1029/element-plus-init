<!-- src/components/SvgIcon/index.vue -->
<template>
  <svg
    class="svg-icon"
    :width="size"
    :height="size"
    :fill="color"
    aria-hidden="true"
    @click="handleClick"
  >
    <use :xlink:href="props.prefix + props.name" />
  </svg>
</template>

<script setup lang="ts">
const props = defineProps({
  prefix: {
    type: String,
    default: '#icon-',
  },
  // 图标名（必填，对应 SVG 文件名，如 user.svg → name="user"）
  name: {
    type: String,
    required: true,
    validator: (val: string) => val.trim() !== '',
  },
  // 图标尺寸（支持数字/字符串，默认 20px）
  size: {
    type: [Number, String],
    default: 20,
  },
  // 图标颜色（默认继承父元素颜色）
  color: {
    type: String,
    default: 'inherit',
  },
  // 是否禁止点击
  disabled: {
    type: Boolean,
    default: false,
  },
})

// 定义点击事件（透传）
const emit = defineEmits(['click'])
const handleClick = () => {
  if (!props.disabled) emit('click')
}
</script>

<style scoped>
.svg-icon {
  display: inline-block;
  vertical-align: middle;
}

.svg-icon[disabled] {
  cursor: not-allowed;
  opacity: 0.6;
}
</style>
