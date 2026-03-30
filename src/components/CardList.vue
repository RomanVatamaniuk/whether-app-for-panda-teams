<template>
  <div class="card-list">
    <div v-if="!savedCities.length" class="empty-state">
      <h3>{{ $t('no_cities') }}</h3>
    </div>

    <TransitionGroup name="fade-list" tag="div" class="cards-grid">
      <Card v-for="city in savedCities" :key="city.id" :city="city" @remove="handleRemove" />
    </TransitionGroup>
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useWeatherStore } from '../stores/weather'
import Card from './Card.vue'

const { savedCities } = storeToRefs(useWeatherStore())
const { removeCityCard } = useWeatherStore()

const handleRemove = (id: string) => removeCityCard(id)
</script>

<style scoped>
.cards-grid {
  display: flex;
  flex-direction: column;
  gap: 20px;
}
.fade-list-enter-active,
.fade-list-leave-active {
  transition: all 0.4s ease;
}
.fade-list-enter-from,
.fade-list-leave-to {
  opacity: 0;
  transform: translateY(20px);
}
.empty-state {
  text-align: center;
  color: #fff;
  opacity: 0.7;
  margin-top: 50px;
}
</style>
