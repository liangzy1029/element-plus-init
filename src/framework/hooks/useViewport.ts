import { ref } from 'vue'

const vw = ref(document.documentElement.clientWidth)
const vh = ref(document.documentElement.clientHeight)

window.addEventListener('resize', () => {
  vw.value = window.innerWidth
  vh.value = window.innerHeight
})

/**
 * 获取取视口大小
 */
export default function () {
  return {
    vw,
    vh,
  }
}
