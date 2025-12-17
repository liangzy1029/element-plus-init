<template>
  <div class="y-file-uploader" :style="rootStyle">
    <!--文件上传器-->
    <el-upload
      class="y-upload"
      drag
      show-file-list
      :file-list="fileList"
      list-type="text"
      :multiple="multiple"
      :limit="limit"
      :on-remove="handleFileRemove"
      :before-upload="handleBeforeUpload"
      :http-request="handleUpload"
      :on-exceed="handleExceed"
    >
      <template #trigger>
        <div class="y-trigger-container" :class="uploadValidateClass">
          <template v-if="isUploading">
            <el-icon class="upload-icon is-loading">
              <Loading />
            </el-icon>
            <div class="upload-text">文件上传中...</div>
          </template>
          <template v-else>
            <el-icon class="upload-icon">
              <upload-filled />
            </el-icon>
            <div class="upload-text">将文件拖放到此处，或<span style="color: var(--el-color-primary)">单击上传</span></div>
          </template>
        </div>
      </template>
    </el-upload>
  </div>
</template>

<script lang="ts" setup>
import { computed, ref, watch } from 'vue'
import { Loading, UploadFilled } from '@element-plus/icons-vue'
import {
  ElMessage,
  type UploadFile,
  type UploadFiles,
  type UploadRawFile,
  type UploadRequestOptions,
  type UploadUserFile,
  useFormItem,
} from 'element-plus'
import { uploadFile } from '@/api/fileController.ts'

export type FileUploaderProps = {
  /** 上传业务标识 */
  uploadBusiness: string
  /** 文件URL (双向绑定) */
  modelValue?: string | string[]
  /** 自定义额外信息（上传成功回调第二个参数） */
  extra?: any
  /** 容器宽度（支持px/百分比） */
  width?: string | number
  /** 容器高度（支持px/百分比） */
  height?: string | number
  /** URL前缀（拼接图片地址） */
  baseUrl?: string
  /** 是否允许多文件上传 */
  multiple?: boolean
  /** 最大上传数量（0表示无限制） */
  limit?: number
  /** 文件大小限制 单位 M （0表示无限制）*/
  maxSizeM?: number
  /** 自定义上传方法（返回文件URL） */
  customRequest?: (file: UploadRawFile) => Promise<string>
  /** 上传前钩子（返回false阻止上传） */
  beforeUpload?: (file: File) => boolean | Promise<boolean>
  /** 文件数量超出限制回调 */
  onExceed?: () => void
}

export type FileUploaderEmits = {
  /** 双向绑定事件 */
  (e: 'update:modelValue', data: string[] | string): void
  /** 文件上传成功的回调 */
  (e: 'onSuccess', url: string[] | string, extra: any): void
  /** 文件移除成功回调 */
  (e: 'onRemoveSuccess', url: string[] | string, extra: any): void
}
const props = withDefaults(defineProps<FileUploaderProps>(), {
  width: '480px',
  height: 'auto',
  baseUrl: '',
  multiple: false,
  limit: 0,
  maxSizeM: 0,
})
const emits = defineEmits<FileUploaderEmits>()

const { formItem } = useFormItem()
const isUploading = ref(false)
// 表单校验错误样式类
const uploadValidateClass = ref<Record<string, boolean>>({})

// 响应式生成CSS变量样式
const rootStyle = computed(() => {
  const toValidStyle = (val: string | number) => (typeof val === 'number' ? `${val}px` : val)
  return {
    '--y-upload-width': toValidStyle(props.width),
    '--y-upload-height': toValidStyle(props.height),
  }
})

/** 获取完整文件地址 */
const fileList = computed<UploadUserFile[]>(() => {
  if (!props.modelValue) return []
  // 单文件上传
  if (!props.multiple && typeof props.modelValue === 'string') {
    return [createUploadUserFile(props.baseUrl, props.modelValue)]
  }
  // 多文件上传
  if (props.multiple && Array.isArray(props.modelValue)) {
    return props.modelValue.map((url) => createUploadUserFile(props.baseUrl, url))
  }

  return []
})

/**
 * 处理文件上传
 */
const handleUpload = async (option: UploadRequestOptions) => {
  const { file, onSuccess, onError } = option
  isUploading.value = true
  try {
    // 优先使用自定义上传方法
    const url = props.customRequest
      ? await props.customRequest(file as UploadRawFile)
      : await handleDefaultUpload(file as UploadRawFile)

    // 更新modelValue（区分单/多图）
    let newModelValue: string | string[] = url
    if (props.multiple) {
      const oldModelValue = Array.isArray(props.modelValue) ? props.modelValue : []
      newModelValue = [...oldModelValue, newModelValue]
    }

    emits('update:modelValue', newModelValue)
    emits('onSuccess', newModelValue, props.extra)
    onSuccess({ url }) // 通知Element上传成功
  } catch (error: any) {
    ElMessage.error(`上传失败：${error.message || '未知错误'}`)
    onError?.(error) // 通知Element上传失败
  } finally {
    isUploading.value = false
  }
}

/**
 * 默认上传逻辑（对接后端接口）
 */
const handleDefaultUpload = async (file: UploadRawFile): Promise<string> => {
  // @ts-ignore
  const res = await uploadFile({ biz: props.uploadBusiness }, file)
  if (!res || !res.data) throw new Error('接口响应异常')
  // @ts-ignore
  if (res.data.code !== 0) throw new Error(res.data.message || '接口返回错误')
  // @ts-ignore
  if (!res.data.data) throw new Error('未返回图片URL')
  // @ts-ignore
  return res.data.data
}

/**
 * 上传前校验
 */
const handleBeforeUpload = async (file: File) => {
  // 文件大小限制
  if (props.maxSizeM) {
    if (file.size > props.maxSizeM) {
      ElMessage.error(`文件大小不能超过 ${props.maxSizeM}MB`)
      return false
    }
  }
  // 优先执行用户自定义的前置钩子
  if (props.beforeUpload) {
    const result = await props.beforeUpload(file)
    if (result === false) return false
  }

  return true
}

/**
 * 处理文件数量超出限制
 */
const handleExceed = () => {
  if (props.onExceed) {
    props.onExceed()
    return
  }
  ElMessage.warning(`最多只能上传 ${props.limit} 个文件`)
}

/**
 * 移除文件
 */
const handleFileRemove = (uploadFile: UploadFile, uploadFiles: UploadFiles) => {
  let newModelValue: string | string[] = ''
  if (props.multiple) {
    newModelValue = uploadFiles.map((item) => item.url) as string[]
  }
  emits('update:modelValue', newModelValue)
  emits('onRemoveSuccess', newModelValue, props.extra)
}

// ========== 辅助函数 ==========
/**
 * 构建 UploadUserFile 对象
 */
function createUploadUserFile(baseUrl: string, url: string): UploadUserFile {
  // 处理首尾斜杠问题（避免拼接出//）
  const fullUrl = baseUrl ? `${baseUrl.replace(/\/$/, '')}/${url.replace(/^\//, '')}` : url
  const uid = Math.floor(Math.random() * 10000)
  return {
    uid,
    name: `image-${uid}`,
    url: fullUrl,
  }
}

/** 表单校验 改变边框颜色 */
watch(
  () => props.modelValue,
  async () => {
    if (!formItem) return
    const isValid = await formItem
      .validate('change')
      .then(() => true)
      .catch((error: any) => {
        console.error(error)
        return false
      })
    uploadValidateClass.value = isValid ? {} : { 'form-validate-error': true }
  },
)
</script>

<style scoped lang="scss">
.form-validate-error {
  border: 1px dashed #f56c6c !important;
}

.y-file-uploader {
  --y-upload-width: 150px;
  --y-upload-height: 'auto';
  --y-upload-boder: 2px;
  --y-upload-border-radius: 6px;
  --y-upload-border-color: var(--el-border-color);
  --y-upload-border-color-error: var(--el-color-danger);
  --y-upload-bg: #f0f0f0;

  .y-upload {
    width: var(--y-upload-width);
    height: var(--y-upload-height);
    box-sizing: border-box;
    border: var(--y-upload-boder) dashed var(--y-upload-border-color);
    border-radius: var(--y-upload-border-radius);
    background: var(--y-upload-bg);
    transition: height 0.2s;

    &:hover {
      border-color: var(--el-color-primary);
    }

    .y-trigger-container{
      width: calc(var(--y-upload-width) - var(--y-upload-boder) * 2);
      height: calc(var(--y-upload-height) - var(--y-upload-boder) * 2);
      background: var(--y-upload-bg);

      .upload-icon {
        color: #a8abb2;
        font-size: 67px;
        line-height: 50px;
        margin-bottom: 16px;
      }

      .upload-text {
        color: #606266;
        font-size: 14px;
        text-align: center;
      }

    }
  }

  // form 表单校验失败样式
  .form-validate-error {
    border: var(--y-upload-boder) dashed var(--y-upload-border-color-error);
  }
}

:deep(.el-upload-dragger) {
  background: #ffffff;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  text-align: center;
  padding: 0;
}
:deep(.el-upload-list){
  padding: 0 8px;
}

</style>
