import { ref } from 'vue'

/**
 * 获取组件实例
 * @param _comp 组件
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function useCompRef<T extends abstract new (...args: any) => any>(_comp: T) {
  return ref<InstanceType<T>>()
}
