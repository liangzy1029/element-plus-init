<template>
  <YContainer>
    <YTable
      ref="tableRef"
      :columns="columns"
      :operations="operations"
      :params="{ sortField: 'createtime' }"
      :request="pageUserVo"
    >
      <template #userAccount="{ value }"> {{ value }} </template>
    </YTable>



    <TestTableForm
      v-if="visible"
      :title="title"
      :data="formData"
      :on-close="handleDialogClose"
      :on-success="handleSubmitFormOk"
    />
  </YContainer>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { ColumnType } from '@/framework/types'
import { YContainer } from '@/framework/components'
import YTable from '@/framework/components/YTable.vue'
import { deleteUser, pageUserVo } from '@/api/userController.ts'
import { MAP_USER_ROLE } from '@/constants/Dict.ts'
import { fileBaseUrl } from '@/utils/serverUtil.ts'
import useConfirm from '@/framework/hooks/useConfirm.ts'
import { ElMessage } from 'element-plus'
import { useCompRef } from '@/framework/hooks/useRef.ts'
import TestTableForm from '@/views/TestTableForm.vue'
import { useInitDialog } from '@/framework/hooks/useInitDialog.ts'

const columns = computed<ColumnType<API.UserVO>[]>(() => {
  return [
    { key: 'id', label: '用户 ID' },
    { key: 'userAccount', label: '用户账号' },
    { key: 'userName', label: '用户昵称' },
    {
      key: 'userAvatar',
      label: '用户头像',
      type: 'image',
      fileBaseUrl: fileBaseUrl(),
      hideInSearch: true,
    },
    { key: 'userProfile', label: '用户简介' },
    { key: 'userRole', label: '用户角色', optionMap: MAP_USER_ROLE },
    { key: 'createTime', label: '创建时间', type: 'datetime' },
  ]
})

const operations = computed(() => {
  return [
    { label: '添加', type: 'primary', kind: 1, fn: openAddDialog },
    // { label: '批量删除', type: 'danger', kind: 1, batch: true, fn: print },
    { label: '编辑', type: 'primary', kind: 2, fn: openUpdateDialog },
    { label: '删除', type: 'danger', kind: 2, fn: doDeleteUser, icon: 'Download' },
  ]
})

const tableRef = useCompRef(YTable)
const { visible, title, formData, handleDialogClose } = useInitDialog()

const doDeleteUser = async (row: API.UserVO) => {
  const { isCancel } = await useConfirm()
  if (isCancel) return
  const res = await deleteUser({ id: row.id })
  const { code, message } = res.data
  if (code !== 0) {
    ElMessage.error(message ?? '删除失败')
    return
  }
  ElMessage.success('删除成功')
  await tableRef.value?.fetchData()
}

const openAddDialog = () => {
  visible.value = true
  title.value = '添加用户'
  formData.value = {}
}

const openUpdateDialog = (row: any) => {
  visible.value = true
  title.value = '更新用户'
  formData.value = { ...row }
}

const handleSubmitFormOk = async () => {
  await tableRef.value?.fetchData()
}
</script>

<style scoped></style>
