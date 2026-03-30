<template>
  <div class="lang-selector">
    <select v-model="$i18n.locale" @change="updateLanguage">
      <option value="en">EN</option>
      <option value="uk">UA</option>
    </select>
  </div>
</template>

<script setup>
import { useI18n } from 'vue-i18n'

const { locale } = useI18n()

const updateLanguage = () => {
  localStorage.setItem('user-lang', locale.value)
}
</script>

<style scoped>
select {
  background: rgba(255, 255, 255, 0.2);
  color: white;
  border: 1px solid white;
  padding: 4px 8px;
  border-radius: 4px;
  cursor: pointer;
  outline: none;
}
select option {
  color: black;
}
</style>
