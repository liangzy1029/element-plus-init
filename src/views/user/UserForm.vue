<template>
  <el-dialog
    :model-value="true"
    :title="title"
    width="45%"
    draggable
    overflow
    :close-on-click-modal="false"
    :before-close="onClose"
  >
    <!-- 表单开始 -->
    <el-form ref="formRef" :model="formData" :rules="rules" label-width="100px">
      <el-row>
        <el-col :span="24">
          <el-form-item label="用户账号" prop="userAccount">
            <el-input
              :disabled="!isAdd"
              v-model="formData.userAccount"
              placeholder="请输入用户账号"
              clearable
            />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="用户角色" prop="userRole">
            <el-select v-model="formData.userRole" placeholder="请选择用户角色">
              <el-option
                v-for="item in Object.values(MAP_USER_ROLE)"
                :key="item.value.toString()"
                :value="item.value"
                :label="item.label"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="24" v-if="isAdd">
          <el-form-item label="用户密码" prop="userPassword">
            <el-input
              v-model="formData.userPassword"
              placeholder="请输入用户密码"
              clearable
              show-password
              type="password"
            />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="用户昵称" prop="userName">
            <el-input v-model="formData.userName" placeholder="请输入用户昵称" clearable />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="用户头像" prop="userAvatar">
            <YPictureUploader
              v-model="formData.userAvatar"
              multiple
              :uploadBusiness="FileUploadBizEnum.USER_AVATAR"
              :base-url="fileBaseUrl()"
            />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="用户简介" property="userProfile">
            <el-input
              v-model="formData.userProfile"
              placeholder="请输入用户简介"
              clearable
              type="textarea"
            />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <!-- 表单结束 -->

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
import { onMounted, ref, useTemplateRef } from 'vue'
import { MAP_USER_ROLE } from '@/constants/Dict.ts'
import { ElMessage, type FormInstance, type FormRules } from 'element-plus'
import { FileUploadBizEnum } from '@/constants/fileEnum.ts'
import { fileBaseUrl } from '@/utils/serverUtil.ts'
import { YPictureUploader } from '@/framework/components'
import { addUser, updateUser } from '@/api/userController.ts'

type Props = {
  title: string
  data: Record<string, any>
  onClose: () => void
  onSuccess?: () => void
}

const rules: FormRules<API.UserUpdateRequest & API.UserAddRequest> = {
  userAccount: [{ required: true, message: '用户账号不能为空', trigger: 'blur' }],
  userRole: [{ required: true, message: '用户角色不能为空', trigger: 'change' }]
}

const props = withDefaults(defineProps<Props>(), {
  title: '操作',
  data: () => ({}),
  onSuccess: () => {},
})

const formRef = useTemplateRef<FormInstance>('formRef')
const isLoading = ref(false)
const isAdd = ref(false)
const formData = ref<API.UserUpdateRequest & API.UserAddRequest>({})

const submitForm = async () => {
  try {
    isLoading.value = true
    await formRef.value?.validate()
    const res = isAdd.value ? await addUser(formData.value) : await updateUser(formData.value)
    if (res.data.code !== 0) {
      ElMessage.error('操作失败，' + res.data.message)
      return
    }
    ElMessage.success('操作成功')
    props.onClose()
    props.onSuccess?.()
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  isAdd.value = !props?.data?.id
  if (isAdd.value) {
    formData.value = { userPassword: '12345678', userRole: 'user' }
  } else {
    formData.value = { ...props.data, userPassword: '' }
  }
})
</script>

<style scoped></style>
