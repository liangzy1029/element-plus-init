<template>
  <slot v-if="showSlot" :usePermission="userStore.loginUser.userRole"></slot>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useUserStore } from '@/stores'
import { PermissionsEnum } from '@/permission/permissionsEnum.ts'
import { checkPermission } from '@/permission'
type Props = {
  permission?: PermissionsEnum
}
const props = defineProps<Props>()

const userStore = useUserStore()

const showSlot = computed(() => {
  const currentRole = (userStore.loginUser.userRole as PermissionsEnum) || PermissionsEnum.NOT_LOGIN
  const requiredPermission = props.permission ?? PermissionsEnum.USER
  return checkPermission(currentRole, requiredPermission)
})
</script>

<style scoped></style>
