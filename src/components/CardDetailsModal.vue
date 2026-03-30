<template>
  <teleport to="body">
    <transition name="fade">
      <div v-if="visible" class="modal-overlay" @click.self="$emit('update:visible', false)">
        <div class="modal-content">
          <button class="close-btn" @click="$emit('update:visible', false)">×</button>

          <div class="modal-header">
            <h2>{{ cityName }}, {{ country }}</h2>
            <p class="modal-date">{{ date }}</p>
          </div>

          <div class="modal-body">
            <div class="modal-controls">
              <ModeSwitcher
                :model-value="periodMode"
                :options="periodOptions"
                @update:model-value="$emit('update:periodMode', $event)"
              />
              <ModeSwitcher
                :model-value="timeMode"
                :options="timeOptions"
                @update:model-value="$emit('update:timeMode', $event)"
              />
            </div>

            <WeatherStats :weather-data="weatherData" />

            <Chart
              v-if="periodMode === 'oneDay' && hourlyForecast.length"
              :hourly-data="hourlyForecast"
            />
          </div>
        </div>
      </div>
    </transition>
  </teleport>
</template>

<script setup lang="ts">
import { computed, watch, onUnmounted } from 'vue'
import ModeSwitcher from './ModeSwitcher.vue'
import WeatherStats from './WeatherStats.vue'
import Chart from './Chart.vue'
import type { Option } from '@/interfaces/Option.interface'
import type { WeatherView } from '@/types/WeatherView.type'
import type { ForecastItem } from '@/types/ForecastItem.type'

type ModeValue = 'oneDay' | 'fiveDays' | 'dayTime' | 'nightTime'

const props = defineProps<{
  visible: boolean
  cityName: string
  country: string
  date: string
  weatherData: WeatherView
  periodMode: ModeValue
  timeMode: ModeValue
  periodOptions: readonly Option<ModeValue>[]
  timeOptions: readonly Option<ModeValue>[]
  fullWeatherList: ForecastItem[]
}>()

const emit = defineEmits<{
  (e: 'update:visible', value: boolean): void
  (e: 'update:periodMode', value: ModeValue): void
  (e: 'update:timeMode', value: ModeValue): void
}>()

const hourlyForecast = computed(() => {
  const list = props.fullWeatherList || []

  const now = Math.floor(Date.now() / 1000)
  const twentyFourHoursFromNow = now + 24 * 60 * 60

  return list
    .filter((item) => item.dt >= now && item.dt <= twentyFourHoursFromNow)
    .sort((a, b) => a.dt - b.dt)
    .map((item) => ({
      dt: item.dt,
      temp: Math.round(item.main.temp),
    }))
})

watch(
  () => props.visible,
  (isVisible) => {
    if (isVisible) {
      document.body.classList.add('modal-open')
      document.body.style.overflow = 'hidden'
    } else {
      document.body.classList.remove('modal-open')
      document.body.style.overflow = ''
    }
  },
  { immediate: true },
)

onUnmounted(() => {
  document.body.style.overflow = ''
})
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(255, 255, 255, 0);
  backdrop-filter: blur(8px);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 2000;
}

.modal-content {
  background: rgba(255, 255, 255, 0);
  backdrop-filter: blur(16px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 24px;
  padding: 40px;
  width: 95%;
  max-width: 550px;
  position: relative;
  color: #fff;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
}

.modal-header {
  text-align: center;
  margin-bottom: 24px;
}

.modal-header h2 {
  font-size: 1.8rem;
  margin: 0 0 4px;
}

.modal-date {
  opacity: 0.7;
  font-size: 0.9rem;
}

.modal-controls {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 32px;
}

.close-btn {
  position: absolute;
  top: 16px;
  right: 16px;
  background: rgba(255, 255, 255, 0.1);
  border: none;
  color: white;
  font-size: 24px;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.2s;
  z-index: 10;
}

.close-btn:hover {
  background: rgba(255, 255, 255, 0.2);
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
