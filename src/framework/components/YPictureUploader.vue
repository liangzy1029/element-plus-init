<template>
  <div class="y-picture-uploader" :style="rootStyle">
    <!--多图片上传展示部分-->
    <template v-if="multiple && fileList">
      <div
        v-for="(file, index) in fileList"
        :key="file.uid"
        class="picture-container picture-container-multiple"
      >
        <!--图片-->
        <el-image class="picture" fit="contain" :src="file.url" />

        <!--图片遮罩-->
        <div v-if="!hideMask" class="picture-mask">
          <!--移除按钮-->
          <el-button
            class="mask-btn close-btn"
            link
            @click="(e: MouseEvent) => handleRemove(index, e)"
          >
            <el-icon size="20">
              <Close />
            </el-icon>
          </el-button>
          <!--预览按钮-->
          <el-button
            class="mask-btn view-btn"
            link
            @click="(e: MouseEvent) => handlePreview(index, e)"
          >
            <el-icon size="20">
              <View />
            </el-icon>
            &nbsp;预览
          </el-button>
        </div>
      </div>
    </template>

    <!--图片上传器-->
    <el-upload
      class="y-upload"
      :class="uploadValidateClass"
      :file-list="fileList"
      :show-file-list="false"
      :multiple="multiple"
      :limit="limit"
      :drag="drag"
      :before-upload="handleBeforeUpload"
      :http-request="handleUpload"
      :on-exceed="handleExceed"
    >
      <!--单图片上传展示部分-->
      <template v-if="!multiple && fileList[0]?.url">
        <div class="picture-container">
          <!--图片-->
          <el-image class="picture" fit="contain" :src="fileList[0].url" />

          <!--图片遮罩-->
          <div v-if="!hideMask" class="picture-mask">
            <!--移除按钮-->
            <el-button class="close-btn" link @click="(e: MouseEvent) => handleRemove(0, e)">
              <el-icon size="20">
                <Close />
              </el-icon>
            </el-button>
            <!--预览按钮-->
            <el-button class="view-btn" link @click="(e: MouseEvent) => handlePreview(0, e)">
              <el-icon size="20">
                <View />
              </el-icon>
              &nbsp;预览
            </el-button>
          </div>
        </div>
      </template>

      <!--图片上传中-->
      <el-icon v-else-if="isUploading" class="upload-icon is-loading">
        <Loading />
      </el-icon>

      <!--未有图片上传-->
      <el-icon v-else class="upload-icon">
        <Plus />
      </el-icon>
    </el-upload>

    <!-- 图片预览器 -->
    <el-image-viewer
      ref="imageViewRef"
      v-if="isOpenImagePreview"
      show-progress
      :url-list="previewUrlList as string[]"
      @close="isOpenImagePreview = false"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, nextTick, ref, watch } from 'vue'
import { Close, Loading, Plus, View } from '@element-plus/icons-vue'
import {
  ElMessage,
  type ImageViewerInstance,
  type UploadRawFile,
  type UploadRequestOptions,
  type UploadUserFile,
  useFormItem,
} from 'element-plus'
import { uploadFile } from '@/api/fileController.ts'

type PictureUploaderProps = {
  /** 上传业务标识 */
  uploadBusiness: string
  /** 文件URL (双向绑定) - 单图传string，多图传string[] */
  modelValue?: string | string[]
  /** 自定义额外信息（上传成功回调第二个参数） */
  extra?: any
  /** 容器宽度（支持px/百分比） */
  width?: string | number
  /** 容器高度（支持px/百分比） */
  height?: string | number
  /** URL前缀（拼接图片地址） */
  baseUrl?: string
  /** 是否隐藏操作遮罩层 */
  hideMask?: boolean
  /** 是否允许多文件上传 */
  multiple?: boolean
  /** 最大上传数量（0表示无限制） */
  limit?: number
  /** 是否开启拖拽上传 */
  drag?: boolean
  /** 文件大小限制 单位 M （0表示无限制）*/
  maxSizeM?: number
  /** 自定义上传方法（返回图片URL） */
  customRequest?: (file: UploadRawFile) => Promise<string>
  /** 上传前钩子（返回false阻止上传） */
  beforeUpload?: (file: File) => boolean | Promise<boolean>
  /** 文件数量超出限制回调 */
  onExceed?: () => void
}

type PictureUploaderEmits = {
  /** 双向绑定事件 */
  (e: 'update:modelValue', data: string[] | string): void
  /** 文件上传成功的回调 */
  (e: 'onSuccess', url: string[] | string, extra: any): void
  /** 文件移除成功回调 */
  (e: 'onRemoveSuccess', url: string[] | string, extra: any): void
}

const props = withDefaults(defineProps<PictureUploaderProps>(), {
  width: '150px',
  height: '150px',
  baseUrl: '',
  hideMask: false,
  multiple: false,
  limit: 0,
  drag: true,
  maxSizeM: 0,
})
const emits = defineEmits<PictureUploaderEmits>()

const { formItem } = useFormItem()
const imageViewRef = ref<ImageViewerInstance>()
const isUploading = ref(false)
const isOpenImagePreview = ref(false)
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

/** 格式化后的上传文件列表（适配Element Upload组件） */
const fileList = computed<UploadUserFile[]>(() => {
  if (!props.modelValue) return []
  // 单图处理
  if (!props.multiple && typeof props.modelValue === 'string') {
    return [createUploadUserFile(props.baseUrl, props.modelValue)]
  }
  // 多图处理
  if (props.multiple && Array.isArray(props.modelValue)) {
    return props.modelValue.map((url) => createUploadUserFile(props.baseUrl, url))
  }

  return []
})

/** 预览图URL列表（适配预览组件） */
const previewUrlList = computed(() => fileList.value.map((file) => file.url))

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

    if (!url) throw new Error('上传失败：未获取到图片URL')

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

  // 严谨的响应数据校验
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
      ElMessage.error(`图片大小不能超过 ${props.maxSizeM}MB`)
      return false
    }
  }
  // 优先执行用户自定义的前置钩子
  if (props.beforeUpload) {
    const result = await props.beforeUpload(file)
    if (result === false) return false
  }
  // 默认格式校验
  const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml']
  if (!validTypes.includes(file.type)) {
    ElMessage.error('请上传有效图片文件（支持JPG/PNG/GIF/WebP/SVG）')
    return false
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
  ElMessage.warning(`最多只能上传 ${props.limit} 张图片`)
}

/**
 * 移除图片
 */
const handleRemove = (index: number, e: MouseEvent) => {
  e.preventDefault()
  e.stopPropagation()
  let newModelValue: string | string[] = ''
  if (props.multiple) {
    newModelValue = Array.isArray(props.modelValue)
      ? props.modelValue.filter((_, idx) => idx !== index)
      : []
  }

  emits('update:modelValue', newModelValue)
  emits('onRemoveSuccess', newModelValue, props.extra)
}

/**
 * 预览图片
 */
const handlePreview = (index: number, e: MouseEvent) => {
  e.preventDefault()
  e.stopPropagation()
  isOpenImagePreview.value = true
  nextTick(() => {
    imageViewRef.value?.setActiveItem?.(index)
  })
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
.y-picture-uploader {
  --y-upload-width: 150px;
  --y-upload-height: 150px;
  --y-upload-boder: 2px;
  --y-upload-border-radius: 6px;
  --y-upload-border-color: var(--el-border-color);
  --y-upload-border-color-error: var(--el-color-danger);
  --y-upload-bg: #f0f0f0;
  --y-upload-mask-bg: rgba(0, 0, 0, 0.5);
  --y-upload-gap: 8px;

  display: flex;
  flex-wrap: wrap;
  row-gap: var(--y-upload-gap);
  column-gap: var(--y-upload-gap);
  align-items: flex-start;

  // 上传组件
  .y-upload {
    width: var(--y-upload-width);
    height: var(--y-upload-height);
    box-sizing: border-box;
    border: var(--y-upload-boder) dashed var(--y-upload-border-color);
    border-radius: var(--y-upload-border-radius);
    background: var(--y-upload-bg);
    transition: all 0.2s;
    position: relative;

    &:hover {
      border-color: var(--el-color-primary);
    }

    // 未有图片时的 icon
    .upload-icon {
      width: calc(var(--y-upload-width) - var(--y-upload-boder) * 2);
      height: calc(var(--y-upload-height) - var(--y-upload-boder) * 2);
      font-size: 30px;
      color: #909399;
      text-align: center;
      overflow: hidden;
    }
  }

  // form 表单校验失败样式
  .form-validate-error {
    border: var(--y-upload-boder) dashed var(--y-upload-border-color-error);
  }

  // 多图上传时特殊属性
  .picture-container-multiple {
    border: var(--y-upload-boder) dashed var(--el-border-color);
    width: var(--y-upload-width) !important;
    height: var(--y-upload-height) !important;
  }

  // 图片展示容器
  .picture-container {
    position: relative;
    width: calc(var(--y-upload-width) - var(--y-upload-boder) * 2);
    height: calc(var(--y-upload-height) - var(--y-upload-boder) * 2);
    background-color: var(--y-upload-bg);
    border-radius: var(--y-upload-border-radius);

    &:hover {
      border-color: var(--el-color-primary);
    }

    // 图片
    .picture {
      width: calc(var(--y-upload-width) - var(--y-upload-boder) * 2);
      height: calc(var(--y-upload-height) - var(--y-upload-boder) * 2);
      display: block;
      border-radius: var(--y-upload-border-radius);
    }

    // 图片上的遮罩
    .picture-mask {
      position: absolute;
      inset: 0;
      z-index: 100;
      width: calc(var(--y-upload-width) - var(--y-upload-boder) * 2);
      height: calc(var(--y-upload-height) - var(--y-upload-boder) * 2);
      background: var(--y-upload-mask-bg);
      border-radius: var(--y-upload-border-radius);
      opacity: 0;
      transition: all 0.2s ease-in-out;

      &:hover {
        opacity: 1;
      }

      // 关闭按钮
      .close-btn {
        position: absolute;
        top: 2px;
        right: 2px;
        color: #fff;
        &:hover {
          color: var(--el-color-primary);
        }
      }

      // 预览图片按钮
      .view-btn {
        margin: 0 auto;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        color: #fff;
        &:hover {
          color: var(--el-color-primary);
        }
      }
    }
  }
}

:deep(.el-upload) {
  border: none;
  width: calc(var(--y-upload-width) - var(--y-upload-boder) * 2);
  height: calc(var(--y-upload-height) - var(--y-upload-boder) * 2);
  border-radius: var(--y-upload-border-radius) !important;
}

:deep(.el-upload-dragger) {
  width: calc(var(--y-upload-width) - var(--y-upload-boder) * 2);
  height: calc(var(--y-upload-height) - var(--y-upload-boder) * 2);
  padding: 0;
  margin: 0;
  border: none;
  background-color: transparent;
}

:deep(.el-image__error) {
  font-size: 16px;
}
</style>
