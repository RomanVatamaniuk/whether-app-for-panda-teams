<template>
  <div class="search-container">
    <div class="search-bar">
      <input
        v-model="searchQuery"
        type="text"
        :placeholder="$t('search_placeholder')"
        @focus="showSuggestions = true"
        @blur="handleBlur"
        @keydown.down.prevent="moveSelection(1)"
        @keydown.up.prevent="moveSelection(-1)"
        @keydown.enter.prevent="handleEnter"
        @keydown.esc="showSuggestions = false"
      />
      <button v-if="searchQuery" class="clear-btn" @click="clearSearch">×</button>
      <button class="add-btn" @click="handleEnter" :title="$t('add_to_saves')">+</button>
    </div>

    <div v-if="showSuggestions && citySuggestions.length" class="suggestions">
      <div
        v-for="(city, index) in citySuggestions"
        :key="`${city.lat}-${city.lon}`"
        class="suggestion-item"
        @mousedown="handleSelectCity(city)"
        @mouseenter="activeIndex = index"
      >
        <span>{{ city.name }}</span>
        <span class="info"> {{ city.state ? `${city.state}, ` : '' }}{{ city.country }} </span>
      </div>
    </div>

    <WarningModal
      v-model:visible="showMaxModal"
      :title="$t('limit_reached')"
      :message="$t('limit_message')"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onUnmounted } from 'vue'
import { useWeatherStore } from '../stores/weather'
import { storeToRefs } from 'pinia'
import WarningModal from '../ui/WarningModal.vue'
import type { CitySuggestion } from '@/interfaces/CitySuggestion.interface'

const store = useWeatherStore()
const { citySuggestions, savedCities } = storeToRefs(store)

const searchQuery = ref('')
const showSuggestions = ref(false)
const showMaxModal = ref(false)
const activeIndex = ref(-1)

let debounceTimer: ReturnType<typeof setTimeout> | null = null

watch(citySuggestions, () => {
  activeIndex.value = -1
})

watch(searchQuery, (newQuery: string) => {
  if (debounceTimer) clearTimeout(debounceTimer)

  const trimmed = newQuery.trim()
  if (trimmed.length < 2) {
    store.clearSuggestions()
    return
  }

  debounceTimer = setTimeout(() => {
    store.searchCities(trimmed)
    showSuggestions.value = true
  }, 400)
})

const moveSelection = (direction: number) => {
  if (!citySuggestions.value.length) return
  showSuggestions.value = true

  activeIndex.value =
    (activeIndex.value + direction + citySuggestions.value.length) % citySuggestions.value.length
}

const handleEnter = () => {
  const selectedCity =
    activeIndex.value >= 0 ? citySuggestions.value[activeIndex.value] : citySuggestions.value[0]

  if (selectedCity) {
    handleSelectCity(selectedCity)
  }
}

const handleSelectCity = async (city: CitySuggestion): Promise<void> => {
  if (savedCities.value.length >= 5) {
    showMaxModal.value = true
    return
  }

  await store.addCityCard(city)
  clearSearch()
}

const clearSearch = (): void => {
  searchQuery.value = ''
  showSuggestions.value = false
  activeIndex.value = -1
  store.clearSuggestions()
}

const handleBlur = (): void => {
  setTimeout(() => {
    showSuggestions.value = false
  }, 200)
}

onUnmounted(() => {
  if (debounceTimer) clearTimeout(debounceTimer)
})
</script>

<style scoped>
.search-container {
  position: relative;
  width: 100%;
  max-width: 500px;
  margin-bottom: 2rem;
}

.search-bar {
  display: flex;
  gap: 10px;
  position: relative;
}

input {
  flex: 1;
  padding: 12px 40px 12px 16px;
  border-radius: 8px;
  border: 2px solid #fff;
  background: rgba(255, 255, 255, 0.1);
  color: #fff;
  outline: none;
  font-family: inherit;
}

input::placeholder {
  color: rgba(255, 255, 255, 0.7);
}

.add-btn {
  padding: 0 20px;
  border-radius: 8px;
  border: 2px solid #fff;
  background: transparent;
  color: #fff;
  font-size: 24px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.add-btn:hover {
  background: #fff;
  color: #333;
}

.clear-btn {
  position: absolute;
  right: 85px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: #fff;
  cursor: pointer;
  font-size: 20px;
  opacity: 0.7;
}

.clear-btn:hover {
  opacity: 1;
}

.suggestions {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: #fff;
  border-radius: 8px;
  margin-top: 5px;
  z-index: 100;
  overflow: hidden;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
}

.suggestion-item {
  padding: 12px;
  color: #333;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  border-bottom: 1px solid #eee;
  transition: background 0.2s;
}

.suggestion-item:last-child {
  border-bottom: none;
}

.suggestion-item:hover {
  background: #f0f7ff;
}

.info {
  font-size: 0.8rem;
  color: #777;
}

.error-message {
  color: #ff4d4d;
  font-size: 0.85rem;
  margin-top: 8px;
  padding-left: 5px;
}
</style>
