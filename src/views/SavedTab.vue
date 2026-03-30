<template>
  <div class="saved-tab">
    <div v-if="savedStore.savedList.length === 0" class="empty-msg">
      <p>{{ t('no_saved_cities') }}</p>
    </div>

    <div class="cards-grid" v-else>
      <Card
        v-for="city in savedStore.savedList"
        :key="city.id"
        :city="city"
        @remove="savedStore.removeSavedCityById(city.id)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useSavedStore } from '@/stores/saved'
import Card from '@/components/Card.vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const savedStore = useSavedStore()
</script>

<style scoped>
.saved-tab {
  padding: 20px 0;
}
.cards-grid {
  display: flex;
  flex-direction: column;
  gap: 20px;
}
.empty-msg {
  text-align: center;
  opacity: 0.6;
  margin-top: 40px;
}
</style>
