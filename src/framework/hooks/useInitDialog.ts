import { ref } from 'vue'

export function useInitDialog(dialogTitle?: string) {

  const title = ref(dialogTitle || '')
  const visible = ref(false)
  const formData = ref({})

  const handleDialogClose = () => {
    visible.value = false
  }

  return {
    title,
    visible,
    formData,
    handleDialogClose,
  }
}
