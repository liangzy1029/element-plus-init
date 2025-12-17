<template>
  <YContainer>
    <YTable ref="tableRef" :columns="columns" :operations="operations" :request="pageUserVo" />

    <UserForm
      v-if="visible"
      :title="title"
      :data="formData"
      :on-close="handleDialogClose"
      :on-success="formSubmitSuccess"
    />
    <!-- <YExcelImportDialog -->
    <!--   v-if="excelDialog.visible" -->
    <!--   :title="excelDialog.title" -->
    <!--   excel="/public/excel/用户导入模板.xlsx" -->
    <!--   :on-close="excelDialog.handleDialogClose" -->
    <!--   :on-success="doImportUser" -->
    <!-- /> -->
  </YContainer>
</template>

<script setup lang="ts">
import YTable from '@/framework/components/YTable.vue'
import { computed, reactive, ref } from 'vue'
import type { ColumnType, OperationConfig } from '@/framework/types'
import { fileBaseUrl } from '@/utils/serverUtil.ts'
import { MAP_USER_ROLE } from '@/constants/Dict.ts'
import { YContainer } from '@/framework/components'
import { deleteUser, exportUser, pageUserVo } from '@/api/userController.ts'
import { useCompRef } from '@/framework/hooks/useRef.ts'
import useConfirm from '@/framework/hooks/useConfirm.ts'
import { ElMessage, type UploadRawFile } from 'element-plus'
import UserForm from '@/views/user/UserForm.vue'
import { useInitDialog } from '@/framework/hooks/useInitDialog.ts'
import { saveAs } from 'file-saver'
import YExcelImportDialog from '@/framework/components/YExcelImportDialog.vue'

const columns = computed(() => {
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
  ] as ColumnType<API.UserVO>[]
})

const operations = computed(() => {
  return [
    { label: '添加', type: 'primary', kind: 1, icon: 'Plus', fn: openAddDialog },
    // { label: '导入', type: 'info', kind: 1, icon: 'Upload', fn: openImportDialog },
    { label: '导出', type: 'warning', kind: 1, icon: 'Download', fn: doExportUser },
    { label: '编辑', type: 'primary', kind: 2, fn: openUpdateDialog },
    { label: '删除', type: 'danger', kind: 2, fn: doDeleteUser },
  ] as OperationConfig[]
})

const tableRef = useCompRef(YTable)
const { title, visible, handleDialogClose } = useInitDialog()
const excelDialog = reactive(useInitDialog())
const formData = ref<API.UserVO>({})

const openAddDialog = () => {
  visible.value = true
  title.value = '用户添加'
  formData.value = {}
}

const openUpdateDialog = (row: API.UserVO) => {
  visible.value = true
  title.value = '用户编辑'
  formData.value = row
}

const formSubmitSuccess = async () => {
  // 刷新表格
  await tableRef.value?.fetchData()
}

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
const openImportDialog = () => {
  excelDialog.visible = true
  excelDialog.title = '用户导入'
}
const doImportUser = async (file: UploadRawFile) => {
  console.log(file)
  return  Promise.resolve()
}
const doExportUser = async () => {
  const res = await exportUser({ ...tableRef.value?.searchParams }, { responseType: 'blob' })
  saveAs(res.data, '用户导出数据.xlsx')
}
</script>

<style scoped></style>
