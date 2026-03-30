<template>
  <div class="main-tab">
    <div class="search-section">
      <SearchInput />
    </div>
    <CardList />
  </div>
</template>

<script setup lang="ts">
import SearchInput from '../components/SearchInput.vue'
import CardList from '../components/CardList.vue'
</script>

<style scoped>
.main-tab {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.search-section {
  text-align: center;
  margin-bottom: 40px;
}

.search-section h1 {
  color: #ffffff;
  margin-bottom: 20px;
  font-size: 2.5rem;
}

@media (max-width: 768px) {
  .main-tab {
    padding: 16px;
  }

  .search-section h1 {
    font-size: 2rem;
  }
}
</style>
