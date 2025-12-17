<template>
  <el-dialog
    :model-value="true"
    :title="title"
    width="550px"
    draggable
    overflow
    :close-on-click-modal="false"
    :before-close="onClose"
  >
    <YFileUploader style="margin-left: 20px" upload-business="" :limit="1" :custom-request="customFileRequest" />
    <div style="margin: 10px 20px">仅允许导入xls、xlsx格式文件。<el-link download type="primary" underline="never" href="/public/excel/用户导入模板.xlsx">下载模板</el-link></div>
    <!-- Dialog 底部 -->
    <template #footer>
      <div>
        <el-button @click="onClose">取消</el-button>
        <el-button type="primary" :loading="isLoading" @click="submitForm"> 确定 </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { type UploadRawFile } from 'element-plus'
import YFileUploader from '@/framework/components/YFileUploader.vue'

type Props = {
  title: string
  excel:string
  onClose: () => void
  onSuccess: (file: UploadRawFile | undefined) => Promise<any>
}

const props = withDefaults(defineProps<Props>(), {
  title: '数据导入',
})

const isLoading = ref(false)
const file = ref<UploadRawFile>()

const customFileRequest = async (selectedFile: UploadRawFile) => {
  file.value = selectedFile
  return Promise.resolve('no url')
}

const submitForm = async () => {
  try {
    isLoading.value = true
    await props.onSuccess(file.value)
    props.onClose()
  } finally {
    isLoading.value = false
  }
}
</script>
