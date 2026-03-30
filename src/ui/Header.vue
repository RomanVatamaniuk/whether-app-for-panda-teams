<template>
  <header>
    <div class="header-content">
      <div class="logo">
        <h1>{{ $t('title') }}</h1>
      </div>
      <LanguageSelector />
    </div>
  </header>
</template>

<script setup>
import LanguageSelector from '@/components/LanguageSelector.vue'
</script>

<style scoped>
header {
  padding: 1rem 2rem;
  background-image: url('https://images.pexels.com/photos/16600787/pexels-photo-16600787.jpeg');
  background-size: cover;
  background-position: center;
  border-bottom: #fff 2px solid;
}
.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1200px;
  margin: 0 auto;
}
h1 {
  color: #fff;
  font-family: 'Arial', sans-serif;
  margin: 0;
}
</style>
