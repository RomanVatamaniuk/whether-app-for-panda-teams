<template>
  <div class="weather-card">
    <div class="card-header">
      <div class="city-info">
        <span v-if="!canRemove" class="location-badge">{{ $t('current_location') }}</span>
        <h3>{{ city.name }}, {{ city.country }}</h3>
        <p class="date">{{ currentDate }}</p>
      </div>

      <div class="header-actions">
        <template v-if="canRemove">
          <button v-if="!isAlreadySaved" class="save-btn" @click="savedStore.saveCity(city)">
            {{ $t('add_to_saves') }}
          </button>
          <button
            v-else
            class="remove-save-btn"
            @click="savedStore.removeSavedCityByCoords(city.lat, city.lon)"
          >
            {{ $t('remove_from_saves') }}
          </button>
        </template>

        <button class="details-btn" @click="showDetails = true">{{ $t('view_details') }}</button>
        <button v-if="canRemove" class="remove-btn" @click="showConfirm = true">×</button>
      </div>
    </div>

    <ModeSwitcher v-model="periodMode" :options="periodOptions" />
    <ModeSwitcher v-model="timeMode" :options="timeOptions" />

    <WeatherStats v-if="weatherView" :weather-data="weatherView" />

    <CardDetailsModal
      v-if="weatherView"
      v-model:visible="showDetails"
      v-model:periodMode="periodMode"
      v-model:timeMode="timeMode"
      :city-name="city.name"
      :country="city.country"
      :date="currentDate"
      :weather-data="weatherView"
      :period-options="periodOptions"
      :time-options="timeOptions"
      :full-weather-list="city.weather.list"
    />

    <teleport to="body">
      <WarningModal
        :visible="savedStore.showLimitModal"
        :title="$t('limit_reached')"
        :message="$t('limit_message')"
        @update:visible="savedStore.showLimitModal = $event"
      />

      <ConfirmModal
        v-model:visible="showConfirm"
        :title="$t('remove_city')"
        :message="$t('are_you_sure')"
        @confirm="onConfirm"
      />
    </teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import ModeSwitcher from './ModeSwitcher.vue'
import WeatherStats from './WeatherStats.vue'
import ConfirmModal from '../ui/ConfirmModal.vue'
import CardDetailsModal from './CardDetailsModal.vue'
import { useSavedStore } from '@/stores/saved'
import type { City } from '@/interfaces/City.interface'
import type { WeatherView } from '@/types/WeatherView.type'
import type { WeatherData } from '@/interfaces/WeatherData.interface'
import WarningModal from '@/ui/WarningModal.vue'

const props = withDefaults(
  defineProps<{
    city: City
    canRemove?: boolean
  }>(),
  {
    canRemove: true,
  },
)

const { t, locale } = useI18n()
const savedStore = useSavedStore()
const emit = defineEmits<{
  (e: 'remove', id: string): void
}>()

const periodMode = ref<'oneDay' | 'fiveDays'>('oneDay')
const timeMode = ref<'dayTime' | 'nightTime'>('dayTime')
const showConfirm = ref(false)
const showDetails = ref(false)

const periodOptions = computed(
  () =>
    [
      { label: `📅 ${t('day')}`, value: 'oneDay' },
      { label: `🗓 ${t('five_days')}`, value: 'fiveDays' },
    ] as const,
)

const timeOptions = computed(
  () =>
    [
      { label: `☀️ ${t('day')}`, value: 'dayTime' },
      { label: `🌙 ${t('night')}`, value: 'nightTime' },
    ] as const,
)

const currentDate = computed(() => {
  return new Intl.DateTimeFormat(locale.value, {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  }).format(new Date())
})

const isAlreadySaved = computed((): boolean => {
  return savedStore.savedList.some((c) => c.lat === props.city.lat && c.lon === props.city.lon)
})

const weatherView = computed((): WeatherView | null => {
  const list = props.city.weather.list
  if (!Array.isArray(list) || list.length === 0) return null

  const isDayTime = (dt: number): boolean => {
    const h = new Date(dt * 1000).getHours()
    return h >= 6 && h < 18
  }

  const pool = periodMode.value === 'oneDay' ? list.slice(0, 8) : list

  const filtered = pool.filter((i) =>
    timeMode.value === 'dayTime' ? isDayTime(i.dt) : !isDayTime(i.dt),
  )

  const sourceItems: WeatherData[] =
    filtered.length > 0 ? (filtered as WeatherData[]) : [list[0] as WeatherData]

  const representative = sourceItems[0]!

  const sum = sourceItems.reduce(
    (acc, curr) => {
      acc.t += curr.main.temp
      acc.h += curr.main.humidity
      acc.p += curr.main.pressure
      acc.w += curr.wind.speed
      return acc
    },
    { t: 0, h: 0, p: 0, w: 0 },
  )

  const count = sourceItems.length

  return {
    avgTemp: Math.round(sum.t / count),
    humidity: Math.round(sum.h / count),
    pressure: Math.round(sum.p / count),
    windSpeed: sum.w / count,
    weather: {
      description: representative.weather[0]?.description ?? t('no_description'),
      icon: representative.weather[0]?.icon ?? '',
    },
  }
})

const onConfirm = (ok: boolean): void => {
  if (ok && props.city.id) {
    emit('remove', props.city.id)
  }
  showConfirm.value = false
}
</script>

<style scoped>
.header-actions {
  display: flex;
  align-items: center;
  gap: 12px;
}

.details-btn,
.save-btn,
.remove-save-btn {
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: white;
  padding: 6px 12px;
  border-radius: 8px;
  font-size: 0.8rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.details-btn {
  background: rgba(255, 255, 255, 0.15);
}
.save-btn {
  background: rgba(76, 175, 80, 0.2);
  border-color: rgba(76, 175, 80, 0.4);
}
.remove-save-btn {
  background: rgba(255, 152, 0, 0.2);
  border-color: rgba(255, 152, 0, 0.4);
}

.details-btn:hover {
  background: rgba(255, 255, 255, 0.25);
  transform: translateY(-1px);
}
.save-btn:hover {
  background: rgba(76, 175, 80, 0.4);
}
.remove-save-btn:hover {
  background: rgba(255, 152, 0, 0.4);
}

.weather-card {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 16px;
  padding: 20px;
  color: #fff;
}
.card-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 1rem;
}
.date {
  font-size: 0.8rem;
  opacity: 0.7;
}
.remove-btn {
  background: rgba(255, 255, 255, 0.2);
  border: none;
  color: #fff;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  cursor: pointer;
}
.remove-btn:hover {
  background: #ff3b30;
}
.location-badge {
  font-size: 0.7rem;
  background: rgba(255, 255, 255, 0.2);
  padding: 2px 6px;
  border-radius: 4px;
  text-transform: uppercase;
  margin-bottom: 4px;
  display: inline-block;
}
</style>
