<template>
  <div class="header-right">
    <el-space size="small" style="margin-right: 16px">
      <el-tooltip
        v-if="!layoutStore.isFullScreen"
        :hide-after="50"
        effect="dark"
        content="全屏"
        placement="bottom"
      >
        <div class="icon-box" @click="layoutStore.fullScreen()">
          <el-icon size="20">
            <FullScreen />
          </el-icon>
        </div>
      </el-tooltip>
      <el-tooltip v-else :hide-after="50" effect="dark" content="退出全屏" placement="bottom">
        <div class="icon-box" @click="layoutStore.fullScreen()">
          <YSvgIcon size="20" name="fullscreen-exit" />
        </div>
      </el-tooltip>
    </el-space>
    <!-- 下拉菜单 -->
    <el-dropdown class="dropdown-bar">
      <el-space style="outline: none">
        <el-avatar
          v-if="userStore.loginUser.userAvatar"
          :size="32"
          :src="accessibleFileUrl(userStore.loginUser.userAvatar)"
          style="user-select: none; pointer-events: auto"
        />
        <el-avatar
          v-else
          :size="32"
          :icon="UserFilled"
          style="user-select: none; pointer-events: auto"
        />
        <el-text
          truncated
          size="large"
          class="username-text"
          style="user-select: none; pointer-events: auto"
        >
          {{ userStore.loginUser.userName ?? '' }}
        </el-text>
      </el-space>
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item>
            <el-icon>
              <User />
            </el-icon>
            个人中心
          </el-dropdown-item>
          <el-dropdown-item divided @click="doUserLogout">
            <span style="color: red">
              <el-icon>
                <SwitchButton />
              </el-icon>
              退出登录
            </span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
  </div>
</template>

<script setup lang="ts">
import { FullScreen, SwitchButton, User, UserFilled } from '@element-plus/icons-vue'
import { onMounted } from 'vue'
import { useUserStore } from '@/stores'
import { useLayoutStore } from '@/framework/stores'
import useConfirm from '@/framework/hooks/useConfirm.ts'
import { useRouter } from 'vue-router'
import { YSvgIcon } from '@/framework/components'
import { accessibleFileUrl } from '@/utils/serverUtil.ts'

const router = useRouter()

const userStore = useUserStore()
const layoutStore = useLayoutStore()

const doUserLogout = async () => {
  const { isCancel } = await useConfirm('确定要退出登录吗？')
  if (isCancel) return
  userStore.doUserLogout()
  await router.push('/login')
}

onMounted(() => {})
</script>

<style scoped>
.header-right {
  display: flex;
  align-items: center;
  height: var(--layout-header-height);
}

.icon-box {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 36px;
  height: 36px;
  border-radius: 8px;
  cursor: pointer;
}

.icon-box:hover {
  background-color: #e9ecef;
}

.dropdown-bar {
  cursor: pointer;
}

.username-text {
  max-width: 120px;
  color: #374151;
  font-weight: 500;
}
</style>
