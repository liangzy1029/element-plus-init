<template>
  <h1>文件管理</h1>
  <el-link download type="primary" underline="never" href="/public/excel/用户导入模板.xlsx">下载模板</el-link>
  <el-link download type="primary" underline="never" href="/public/a.xlsx">下载模板</el-link>
  <YFileUploader
    :upload-business="FileUploadBizEnum.USER_AVATAR"
    :custom-request="customFileRequest"
  />
  <el-divider />
  <YPictureUploader
    v-model="imageUrl"
    :width="width"
    :height="height"
    :multiple="true"
    :limit="0"
    drag
    :uploadBusiness="FileUploadBizEnum.USER_AVATAR"
    :baseUrl="fileBaseUrl()"
  />

  <el-divider />
  <el-button type="primary" @click="printUrl">打印URL</el-button>
  <el-button type="primary" @click="update">修改</el-button>
  <el-divider />
  <el-form ref="formRef" :model="formData" :rules="rules">
    <el-form-item label="头像" prop="url">
      <YPictureUploader
        v-model="formData.url"
        :width="width"
        :height="height"
        drag
        :limit="5"
        :uploadBusiness="FileUploadBizEnum.USER_AVATAR"
        :baseUrl="fileBaseUrl()"
      />
    </el-form-item>
  </el-form>
</template>

<script setup lang="ts">
import { FileUploadBizEnum } from '@/constants/fileEnum.ts'
import { fileBaseUrl } from '@/utils/serverUtil.ts'
import { ref } from 'vue'
import type { FormRules, UploadRawFile } from 'element-plus'
import { YPictureUploader } from '@/framework/components'
import YFileUploader from '@/framework/components/YFileUploader.vue'

const imageUrl = ref([
  '/user_avatar/1991776812430888961/2cba7ca8b72b4ebbbf01e829bdc06428.jpg',
  '',
  '/user_avatar/1991776812430888961/2cba7ca8b72b4ebbbf01e829bdc06428.jpg',
])

const customFileRequest = async (selectedFile: UploadRawFile) => {
  console.log(selectedFile)
  return Promise.resolve('no url')
}

const width = ref(150)
const height = ref(150)
function update() {
  width.value = 250
  height.value = 250
}
type FormData = {
  url: string
}
const formData = ref({
  url: '',
})
const rules: FormRules<FormData> = {
  url: [{ required: true, message: '图片不能为空', trigger: 'change' }],
}

function printUrl() {
  console.log('imageUrl', imageUrl.value)
}
</script>

<style scoped></style>
