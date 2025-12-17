import { onMounted, onUnmounted, ref, type Ref } from 'vue'

/**
 * 右键菜单 Hook
 *
 * @param containerRef 组件实例
 */
export default function (containerRef: Ref<HTMLElement | null>) {
  /** 是否显示菜单 */
  const showMenu = ref(false)
  /** 鼠标右键 x 轴位置 */
  const x = ref(0)
  /** 鼠标右键 y 轴位置 */
  const y = ref(0)

  const handleContextMenu = (e: MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    showMenu.value = true
    x.value = e.clientX
    y.value = e.clientY
  }

  const closeMenu = () => {
    showMenu.value = false
  }

  onMounted(() => {
    const div = containerRef.value
    if (div) {
      div.addEventListener('contextmenu', handleContextMenu)
    }
    window.addEventListener('click', closeMenu, true)
    window.addEventListener('contextmenu', closeMenu, true)
  })

  onUnmounted(() => {
    const div = containerRef.value
    if (div) {
      div.removeEventListener('contextmenu', handleContextMenu)
    }
    window.removeEventListener('click', closeMenu, true)
    window.removeEventListener('contextmenu', closeMenu, true)
  })

  return {
    showMenu,
    x,
    y,
  }
}
