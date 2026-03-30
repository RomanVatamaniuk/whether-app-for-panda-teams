<template>
  <div class="mode-switcher">
    <button
      v-for="option in options"
      :key="option.value"
      :class="{ active: modelValue === option.value }"
      @click="$emit('update:modelValue', option.value)"
    >
      {{ option.label }}
    </button>
  </div>
</template>

<script setup lang="ts">
import type { Option } from '@/interfaces/Option.interface'

type ModeValue = 'oneDay' | 'fiveDays' | 'dayTime' | 'nightTime'

const props = defineProps<{
  modelValue: ModeValue
  options: readonly Option<ModeValue>[]
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: ModeValue): void
}>()
</script>

<style scoped>
.mode-switcher {
  display: flex;
  gap: 8px;
  margin-bottom: 16px;
}

.mode-switcher button {
  flex: 1;
  padding: 8px;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  background: rgba(255, 255, 255, 0.1);
  color: white;
  transition: all 0.2s ease;
}

.mode-switcher button.active {
  background: rgba(255, 255, 255, 0.3);
}
</style>
