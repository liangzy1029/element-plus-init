<template>
  <div id="register-view">
    <div class="register-container">
      <div class="title">用户管理系统 - 注册</div>
      <el-form
        ref="formRef"
        :model="formData"
        :rules="rules"
        size="large"
        status-icon
        scroll-to-error
      >
        <el-form-item prop="userAccount">
          <el-input v-model="formData.userAccount" :prefix-icon="User" placeholder="请输入账号" />
        </el-form-item>
        <el-form-item prop="userPassword">
          <el-input
            v-model="formData.userPassword"
            :prefix-icon="Lock"
            placeholder="请输入密码"
            type="password"
            show-password
          />
        </el-form-item>
        <el-form-item prop="checkPassword">
          <el-input
            v-model="formData.checkPassword"
            :prefix-icon="Lock"
            placeholder="请输入确认密码"
            type="password"
            show-password
          />
        </el-form-item>
        <div style="margin-bottom: 10px; text-align: right">
          <el-button type="primary" link @click="toLoginPage">老用户登录</el-button>
        </div>
        <el-form-item>
          <div style="width: 100%">
            <el-button type="primary" @click="doRegister" style="width: 100%">注册</el-button>
          </div>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, useTemplateRef } from 'vue'
import { Lock, User } from '@element-plus/icons-vue'
import { userRegister } from '@/api/userController.ts'
import { ElMessage, type FormInstance } from 'element-plus'
import { useRouter } from 'vue-router'

const rules = {
  userAccount: [
    { required: true, message: '账号不能为空', trigger: 'blur' },
    { min: 4, message: '账号不能少于 4 位', trigger: 'blur' },
  ],
  userPassword: [
    { required: true, message: '密码不能为空', trigger: 'blur' },
    { min: 8, message: '密码不能少于 8 位', trigger: 'blur' },
  ],
  checkPassword: [
    { required: true, message: '确认密码不能为空', trigger: 'blur' },
    { min: 8, message: '确认密码不能少于 8 位', trigger: 'blur' },
  ],
}

const router = useRouter()

const formRef = useTemplateRef<FormInstance>('formRef')
const formData = ref({
  userAccount: '',
  userPassword: '',
  checkPassword: '',
})

const doRegister = async () => {
  await formRef.value?.validate()
  if (formData.value.userPassword !== formData.value.checkPassword) {
    ElMessage.error('两次输入的密码不一致')
    return
  }
  const res = await userRegister(formData.value)
  if (res.data.code !== 0) {
    ElMessage.error('注册失败,' + res.data.message)
    return
  }
  ElMessage.success('注册成功，即将跳转到登录页')
  setTimeout(() => {
    toLoginPage()
  }, 1000)
}

const toLoginPage = () => {
  router.push('/login')
}
</script>

<style scoped>
#register-view {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100vw;
  height: 100vh;
  min-height: 400px;
  background-image: url('/auth_background.png');
}

.register-container {
  width: 400px;
  border: 1px solid #dbdfe9;
  background-color: #fff;
  padding: 25px 25px 10px;
  border-radius: 6px;
}

.title {
  text-align: center;
  margin-bottom: 20px;
  color: #303133;
  font-size: 20px;
  font-weight: 500;
}
</style>
