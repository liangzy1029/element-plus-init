import type { Directive, DirectiveBinding } from 'vue'
import type { ElementSizes } from '@/framework/types'

const map = new WeakMap()
const ob = new ResizeObserver((entries) => {
  for (const entry of entries) {
    const handler = map.get(entry.target)
    if (handler) {
      const box = entry.borderBoxSize[0]
      const sizes = { width: box?.inlineSize || 0, height: box?.blockSize || 0 }
      handler(sizes)
    }
  }
})

/**
 * 监听元素尺寸变化的指令
 */
export default {
  mounted(el: HTMLElement, binding: DirectiveBinding<(sizes: ElementSizes) => void>) {
    ob.observe(el)
    map.set(el, binding.value)
  },
  unmounted(el: HTMLElement) {
    map.delete(el)
    ob.unobserve(el)
  },
} as Directive
