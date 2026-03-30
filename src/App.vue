<template>
  <Header />
  <router-view />
</template>
<script setup lang="ts">
import Header from './ui/Header.vue'
</script>
<style>
html,
body {
  margin: 0;
  padding: 0;
  width: 100%;
  scroll-behavior: smooth;
}

#app {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  width: 100%;
  margin: 0;
  padding: 0;
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
</style>
