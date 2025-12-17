<template>
  <div id="login-view">
    <div class="login-container">
      <div class="title">用户管理系统 - 登录</div>
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
        <div style="margin-bottom: 10px; text-align: right">
          <el-button type="primary" link @click="toRegisterPage">新用户注册</el-button>
        </div>
        <el-form-item>
          <div style="width: 100%">
            <el-button type="primary" @click="doLogin" style="width: 100%">登录</el-button>
          </div>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script setup>
import { ref, useTemplateRef } from 'vue'
import { Lock, User } from '@element-plus/icons-vue'
import { userLogin } from '@/api/userController.ts'
import { ElMessage } from 'element-plus'
import { useUserStore } from '@/stores/index.ts'
import { useRouter } from 'vue-router'

const router = useRouter()

const userStore = useUserStore()

const rules = ref({
  userAccount: [
    { required: true, message: '账号不能为空', trigger: 'blur' },
    { min: 4, message: '账号不能少于 4 位', trigger: 'blur' },
  ],
  userPassword: [
    { required: true, message: '密码不能为空', trigger: 'blur' },
    { min: 8, message: '密码不能少于 8 位', trigger: 'blur' },
  ],
})

const formRef = useTemplateRef('formRef')
const formData = ref({
  userAccount: '',
  userPassword: '',
})

const doLogin = async () => {
  await formRef.value?.validate()
  const res = await userLogin(formData.value)
  if (res.data.code !== 0) {
    ElMessage.error('登录失败,' + res.data.message)
    return
  }
  userStore.loginUser = { ...res.data.data }
  ElMessage.success('登录成功')
  await router.push({
    path: '/',
    replace: true,
  })
}

const toRegisterPage = () => {
  router.push('/register')
}
</script>

<style scoped>
#login-view {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100vw;
  height: 100vh;
  min-height: 400px;
  background-image: url('/auth_background.png');
}

.login-container {
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
