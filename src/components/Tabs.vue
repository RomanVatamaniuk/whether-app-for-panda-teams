<template>
  <div class="tabs-container">
    <div class="tabs-header">
      <button
        v-for="(tab, index) in processedTabs"
        :key="index"
        :class="['tab-button', { active: activeTab === index }]"
        @click="activeTab = index"
      >
        <span>{{ tab.label }}</span>
      </button>
    </div>
    <div class="tabs-content">
      <component v-if="processedTabs[activeTab]" :is="processedTabs[activeTab]?.component" />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { TabItem } from '@/interfaces/TabItem.interface'
import { ref, defineAsyncComponent, computed } from 'vue'

const props = defineProps<{
  tabs: TabItem[]
}>()

const activeTab = ref(0)

const processedTabs = computed(() =>
  props.tabs.map((tab) => ({
    ...tab,
    component: defineAsyncComponent(tab.component),
  })),
)
</script>

<style scoped>
.tabs-container {
  width: 100%;
}

.tabs-header {
  display: flex;
}

.tab-button {
  width: 20%;
  height: 10%;
  padding: 12px 20px;
  background: none;
  border: 2px solid transparent;
  border-bottom: none;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.3s ease;
  color: #ffffff;
  font-weight: 500;
  box-sizing: border-box;
  border-radius: 12px 12px 0 0;
}

.tab-button.active {
  border-left: #fff 2px solid;
  border-right: #fff 2px solid;
  border-top: #fff 2px solid;
  font-weight: 600;
}

.tabs-content {
  padding: 20px;
  border: #fff 2px solid;
}
</style>
