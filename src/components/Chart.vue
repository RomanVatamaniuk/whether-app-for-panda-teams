<template>
  <div class="chart-wrapper">
    <canvas ref="chartCanvas"></canvas>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, onUnmounted, shallowRef } from 'vue'
import Chart from 'chart.js/auto'

const props = defineProps<{
  hourlyData: { dt: number; temp: number }[]
}>()

const chartCanvas = ref<HTMLCanvasElement | null>(null)
const chartInstance = shallowRef<Chart | null>(null)

const renderChart = () => {
  if (!chartCanvas.value) return

  if (chartInstance.value) {
    chartInstance.value.destroy()
  }

  const ctx = chartCanvas.value.getContext('2d')
  if (!ctx) return

  const gradient = ctx.createLinearGradient(0, 0, 0, 180)
  gradient.addColorStop(0, 'rgba(255, 255, 255, 0.3)')
  gradient.addColorStop(1, 'rgba(255, 255, 255, 0)')

  const labels = props.hourlyData.map((item) => {
    const date = new Date(item.dt * 1000)
    return `${date.getHours()}:00`
  })

  requestAnimationFrame(() => {
    chartInstance.value = new Chart(ctx, {
      type: 'line',
      data: {
        labels,
        datasets: [
          {
            data: props.hourlyData.map((i) => i.temp),
            borderColor: '#ffffff',
            borderWidth: 2,
            pointBackgroundColor: '#ffffff',
            pointHoverRadius: 5,
            fill: true,
            backgroundColor: gradient,
            tension: 0.4,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        animation: { duration: 400 },
        plugins: {
          legend: { display: false },
          tooltip: {
            mode: 'index',
            intersect: false,
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            titleColor: '#333',
            bodyColor: '#333',
          },
        },
        scales: {
          x: {
            ticks: { color: '#ffffff', maxRotation: 0, font: { size: 10 } },
            grid: { display: false },
          },
          y: {
            display: true,
            position: 'right',
            grid: {
              color: 'rgba(255, 255, 255, 0.1)',
              drawTicks: false,
            },
            ticks: {
              color: '#ffffff',
              font: { size: 10 },
              callback: (value) => `${value}°`,
            },
            grace: '10%',
          },
        },
      },
    })
  })
}

onMounted(renderChart)
watch(() => props.hourlyData, renderChart, { deep: false })
onUnmounted(() => chartInstance.value?.destroy())
</script>

<style scoped>
.chart-wrapper {
  height: 180px;
  width: 100%;
  margin-top: 20px;
  background: rgba(255, 255, 255, 0);
  padding: 12px;
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0);
}
</style>
