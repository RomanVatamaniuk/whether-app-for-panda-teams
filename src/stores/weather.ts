import { ref, watch } from 'vue'
import { defineStore } from 'pinia'
import type { CitySuggestion } from '@/interfaces/CitySuggestion.interface'
import type { City } from '@/interfaces/City.interface'
import type { WeatherData } from '@/interfaces/WeatherData.interface'
import { useI18n } from 'vue-i18n'
import type { WeatherForecastData } from '@/interfaces/WeatherForecast.interface'

export const useWeatherStore = defineStore('weather', () => {
  const citySuggestions = ref<CitySuggestion[]>([])
  const savedCities = ref<City[]>([])
  const localCity = ref<City | null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)
  const weatherCache = new Map<string, WeatherData>()
  const { locale } = useI18n()

  const API_KEY = 'd0c40c2057ae0edf8181fb6daff8fe6c'

  const getApiLang = () => (locale.value === 'uk' ? 'ua' : 'en')

  const addCityCard = async (city: CitySuggestion) => {
    const isDuplicate = savedCities.value.some((c) => c.lat === city.lat && c.lon === city.lon)
    if (isDuplicate) return

    isLoading.value = true
    try {
      const weather = await fetchWeather(city)

      savedCities.value.push({
        ...city,
        weather,
        id: `${city.lat}-${city.lon}-${Date.now()}`,
      })
    } catch (err) {
      error.value = 'Failed to add city'
      console.error(err)
    } finally {
      isLoading.value = false
    }
  }

  const updateCityData = async (city: City) => {
    const lang = getApiLang()

    const geoRes = await fetch(
      `https://api.openweathermap.org/geo/1.0/reverse?lat=${city.lat}&lon=${city.lon}&limit=1&appid=${API_KEY}`,
    )
    const geoData = await geoRes.json()
    if (geoData.length > 0) {
      city.name = geoData[0].local_names?.[lang] || geoData[0].name
    }

    const weatherRes = await fetch(
      `https://api.openweathermap.org/data/2.5/forecast?lat=${city.lat}&lon=${city.lon}&appid=${API_KEY}&units=metric&lang=${lang}`,
    )
    const weatherData = await weatherRes.json()
    city.weather = weatherData

    weatherCache.set(`${city.lat}-${city.lon}-${lang}`, weatherData)
  }

  const fetchLocationByIp = async () => {
    try {
      const ipRes = await fetch('https://ipapi.co/json/')
      const location = await ipRes.json()

      const cityData: City = {
        name: location.city,
        country: location.country_code,
        lat: location.latitude,
        lon: location.longitude,
        id: `local-${location.latitude}-${location.longitude}`,
        weather: {} as WeatherForecastData,
      }

      await updateCityData(cityData)
      localCity.value = cityData
    } catch (err) {
      console.warn('Location detection failed.', err)
    }
  }

  const refreshAllWeather = async () => {
    const promises = []

    if (localCity.value) {
      promises.push(updateCityData(localCity.value))
    }

    savedCities.value.forEach((city) => {
      promises.push(updateCityData(city))
    })

    await Promise.all(promises)
  }

  const searchCities = async (query: string) => {
    const trimmed = query.trim()
    if (trimmed.length < 2) return (citySuggestions.value = [])
    const lang = getApiLang()
    try {
      const response = await fetch(
        `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(trimmed)}&limit=5&appid=${API_KEY}&lang=${lang}`,
      )
      const data = await response.json()
      citySuggestions.value = data.map((city: CitySuggestion) => ({
        name: city.local_names?.[lang] || city.name,
        country: city.country,
        lat: city.lat,
        lon: city.lon,
      }))
    } catch {
      citySuggestions.value = []
    }
  }

  const fetchWeather = async (city: Partial<City>) => {
    const lang = getApiLang()
    const key = `${city.lat}-${city.lon}-${lang}`
    if (weatherCache.has(key)) return weatherCache.get(key)!

    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/forecast?lat=${city.lat}&lon=${city.lon}&appid=${API_KEY}&units=metric&lang=${lang}`,
    )
    const data = await response.json()
    weatherCache.set(key, data)
    return data
  }

  const removeCityCard = (id: string) => {
    savedCities.value = savedCities.value.filter((city) => city.id !== id)
  }

  watch(locale, () => {
    refreshAllWeather()
  })

  return {
    localCity,
    savedCities,
    citySuggestions,
    isLoading,
    fetchLocationByIp,
    addCityCard,
    fetchWeather,
    searchCities,
    removeCityCard,
    refreshAllWeather,
    clearSuggestions: () => (citySuggestions.value = []),
  }
})
