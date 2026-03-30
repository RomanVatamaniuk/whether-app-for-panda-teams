import { ref, watch } from 'vue'
import { defineStore } from 'pinia'
import type { City } from '@/interfaces/City.interface'

export const useSavedStore = defineStore('savedCities', () => {
  const STORAGE_KEY = 'weather_saved_cities'

  const savedList = ref<City[]>(JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]'))

  const showLimitModal = ref(false)

  watch(
    savedList,
    (newList) => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newList))
    },
    { deep: true },
  )

  const saveCity = (city: Omit<City, 'id'>) => {
    const exists = savedList.value.some((c) => c.lat === city.lat && c.lon === city.lon)
    if (exists) return

    if (savedList.value.length >= 5) {
      showLimitModal.value = true
      return
    }

    savedList.value.push({
      ...city,
      id: `saved-${city.lat}-${city.lon}`,
    })
  }

  const removeSavedCityByCoords = (lat: number, lon: number) => {
    savedList.value = savedList.value.filter((c) => !(c.lat === lat && c.lon === lon))
  }

  const removeSavedCityById = (id: string) => {
    savedList.value = savedList.value.filter((c) => c.id !== id)
  }

  return {
    savedList,
    showLimitModal,
    saveCity,
    removeSavedCityByCoords,
    removeSavedCityById,
  }
})
