import { globalIgnores } from 'eslint/config'
import { defineConfigWithVueTs, vueTsConfigs } from '@vue/eslint-config-typescript'
import pluginVue from 'eslint-plugin-vue'
import skipFormatting from '@vue/eslint-config-prettier/skip-formatting'

export default defineConfigWithVueTs(
  {
    name: 'app/files-to-lint',
    files: ['**/*.{ts,mts,tsx,vue}']
  },

  globalIgnores(['**/dist/**', '**/dist-ssr/**', '**/coverage/**']),

  pluginVue.configs['flat/essential'],
  vueTsConfigs.recommended,
  skipFormatting,

  {
    rules: {
      // 关闭 Vue 单文件组件中 <script>/<style>/<template> 块的 lang 属性校验
      'vue/block-lang': 'off',
      // 关闭空对象类型检查规则
      '@typescript-eslint/no-empty-object-type': 'off',
      // 关闭 any 类型检测规则
      '@typescript-eslint/no-explicit-any': 'off',
      // 关闭 @ts-ignore 检查
      '@typescript-eslint/ban-ts-comment': 'off'
    }
  }
)
