<template>
  <main>
    <section>
      <div v-if="weatherStore.localCity" class="ip-card-wrapper">
        <Card :city="weatherStore.localCity" :can-remove="false" />
      </div>

      <Tabs :tabs="tabs" />
    </section>
  </main>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import Tabs from '../components/Tabs.vue'
import Card from '../components/Card.vue'
import { useWeatherStore } from '../stores/weather'
import { useI18n } from 'vue-i18n'

const weatherStore = useWeatherStore()
const { t } = useI18n()

const tabs = computed(() => [
  {
    label: t('main_tab'),
    component: () => import('../views/MainTab.vue'),
  },
  {
    label: t('saved_tab'),
    component: () => import('../views/SavedTab.vue'),
  },
])

onMounted(() => {
  if (!weatherStore.localCity) {
    weatherStore.fetchLocationByIp()
  }
})
</script>
<style scoped>
main {
  color: #ffffff;
  padding-top: 1rem;
  flex: 1;
  overflow-y: auto;

  background-image: url('https://i.pinimg.com/1200x/75/ae/5a/75ae5af3ecdd499c2c1178e8cb7efa45.jpg');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;

  background-attachment: fixed;

  min-height: 100vh;
}

section {
  max-width: 1200px;
  min-width: 360px;
  margin: 0 auto;
  border-top: none;
  border-radius: 1%;
}

.ip-card-wrapper {
  margin-bottom: 2rem;
}
</style>
