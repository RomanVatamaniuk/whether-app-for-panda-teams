<template>
  <div class="weather-display">
    <div class="weather-main">
      <div class="weather-icon">
        <img
          v-if="weatherData.weather?.icon"
          :src="`https://openweathermap.org/img/wn/${weatherData.weather.icon}@2x.png`"
          :alt="weatherData.weather.description"
        />
      </div>
      <div class="temperature">{{ weatherData.avgTemp }}°C</div>
      <div class="description">{{ weatherData.weather.description }}</div>
    </div>

    <div class="weather-details">
      <div class="detail-item">
        <span class="label">{{ $t('humidity') }}</span>
        <span class="value"> {{ weatherData.humidity }}%</span>
      </div>
      <div class="detail-item">
        <span class="label">{{ $t('pressure') }}</span>
        <span class="value">{{ weatherData.pressure }} {{ $t('hPa') }}</span>
      </div>
      <div class="detail-item">
        <span class="label">{{ $t('wind_speed') }}</span>
        <span class="value"
          >{{ weatherData.windSpeed.toFixed(1) }} {{ $t('wind_speed_unit') }}</span
        >
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { WeatherView } from '@/types/WeatherView.type'

defineProps<{
  weatherData: WeatherView
}>()
</script>

<style scoped>
.weather-main {
  text-align: center;
  margin-bottom: 20px;
}

.weather-icon {
  display: flex;
  justify-content: center;
  align-items: center;
}

.weather-icon img {
  width: 60px;
  height: 60px;
}

.temperature {
  font-size: 2.5rem;
  font-weight: 300;
}

.description {
  font-size: 1rem;
  text-transform: capitalize;
  opacity: 0.9;
}

.weather-details {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
  text-align: center;
}

.detail-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.label {
  font-size: 0.8rem;
  opacity: 0.8;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.value {
  font-size: 0.95rem;
  font-weight: 500;
}

@media (max-width: 768px) {
  .weather-details {
    grid-template-columns: 1fr;
  }
  .temperature {
    font-size: 2rem;
  }
}
</style>
