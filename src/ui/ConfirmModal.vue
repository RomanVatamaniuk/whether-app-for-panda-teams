<template>
  <div v-if="visible" class="modal-overlay">
    <div class="modal">
      <h3>{{ title }}</h3>
      <p>{{ message }}</p>
      <div class="buttons">
        <button @click="confirm(true)">{{ t('yes') }}</button>
        <button @click="confirm(false)">{{ t('no') }}</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { watch, onUnmounted } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const props = defineProps<{
  title: string
  message: string
  visible: boolean
}>()

const emit = defineEmits<{
  (e: 'update:visible', value: boolean): void
  (e: 'confirm', confirmed: boolean): void
}>()

const confirm = (confirmed: boolean) => {
  emit('update:visible', false)
  if (confirmed) emit('confirm', true)
}

const toggleBodyScroll = (disable: boolean) => {
  document.body.style.overflow = disable ? 'hidden' : ''
}

watch(
  () => props.visible,
  (newVal) => toggleBodyScroll(newVal),
)

onUnmounted(() => toggleBodyScroll(false))
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
  pointer-events: all;
}
.modal {
  background: #fff;
  color: #000;
  padding: 24px;
  border-radius: 12px;
  max-width: 400px;
  width: 90%;
  text-align: center;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.25);
}

.buttons {
  display: flex;
  justify-content: center;
  gap: 12px;
  margin-top: 1rem;
}

.modal button {
  background-color: #fff;
  color: #171717;
  padding: 8px 16px;
  border-radius: 8px;
  border: 2px solid #2b2a2a;
  cursor: pointer;
  font-weight: 600;
}

.modal button:active {
  background-color: #171717;
  color: #fff;
}
</style>
