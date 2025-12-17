<template>
  <div ref="containerRef">
    <slot></slot>
    <Teleport to="body">
      <transition
        @beforeEnter="handleBeforeEnter"
        @enter="handleEnter"
        @afterEnter="handleAfterEnter"
      >
        <ul class="context-menu" v-resize="handleResize" v-if="showMenu" :style="{ ...position }">
          <li
            class="menu-item"
            v-for="item in menus"
            :key="item.label"
            @click="item?.callBack(item) ?? (() => {})"
          >
            <el-icon v-if="item?.icon" style="margin-right: 8px; padding-bottom: 2px">
              <component :is="item.icon" />
            </el-icon>
            <div style="vertical-align: center">{{ item.label }}</div>
          </li>
        </ul>
      </transition>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import useContextMenu from '@/framework/hooks/useContextMenu.ts'
import { computed, ref } from 'vue'
import type { ContextMenuOption, ElementSizes } from '@/framework/types'
import useViewport from '@/framework/hooks/useViewport.ts'

type Props = {
  menus: ContextMenuOption[]
}

defineProps<Props>()

const containerRef = ref(null)

const { x, y, showMenu } = useContextMenu(containerRef)
const { vw, vh } = useViewport()

const w = ref(0)
const h = ref(0)

/**
 * 获取当前组件大小回调
 *
 * @param sizes
 */
function handleResize(sizes: ElementSizes) {
  const { width, height } = sizes
  w.value = width
  h.value = height
}

const position = computed(() => {
  let posX = x.value
  let posY = y.value
  if (x.value > vw.value - w.value) {
    posX -= w.value
  }
  if (y.value > vh.value - h.value) {
    // 盒子在视口部分的长度
    const showPart = vh.value - x.value
    // 超出视口部分的长度
    const overPart = y.value - showPart
    posY = Math.max(0, y.value - overPart)
  }
  return { left: posX + 'px', top: posY + 'px' }
})

/**
 * 动画处理
 * @param el
 */
const handleBeforeEnter = (el: Element) => {
  ;(el as HTMLElement).style.height = '0'
}

/**
 * 动画处理
 * @param el
 */
const handleEnter = (el: Element) => {
  if (el instanceof HTMLElement) {
    el.style.height = 'auto'
    const h = el.clientHeight
    el.style.height = '0'
    requestAnimationFrame(() => {
      el.style.height = h + 'px'
      el.style.transition = '.5s'
    })
  }
}

/**
 * 动画处理
 * @param el
 */
const handleAfterEnter = (el: Element) => {
  ;(el as HTMLElement).style.transition = 'none'
}
</script>

<style scoped>
.context-menu {
  position: fixed;
  min-width: 120px;
  margin: 0;
  padding: 6px 0;
  border-radius: 8px;
  background: #fafbfc;
  color: #1d1d1f;
  font-size: 13px;
  font-weight: 400;
  white-space: nowrap;
  overflow: hidden;
  z-index: 1000;
  list-style-type: none;
  border: 1px solid #e4e7ed;
}

.menu-item {
  height: 32px;
  line-height: 32px;
  cursor: pointer;
  display: flex;
  align-items: center;
  color: #303133;
  margin: 0 8px 2px 4px;
  padding: 4px 12px;
  transition: 0.2s;
  border-radius: 6px;
  background: transparent;
}

.menu-item:hover {
  color: var(--el-color-primary);
  transform: translate(2px);
  background: #1d84ff1a;
}
</style>
