<template>
  <div class="chart-container">
    <Line :data="chartData" :options="chartOptions" />
  </div>
</template>

<script setup lang="ts">
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
} from 'chart.js'
import { Line } from 'vue-chartjs'
import { ref, onMounted, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale
)

interface CoinResponse {
  id: string
  name: string
  symbol: string
  price_usd: string
}

const route = useRoute()
const coinId = route.params.id as string

const prices = ref<number[]>([])
const labels = ref<string[]>([])
const pollingInterval = 5000 // 5 seconds
let intervalId: NodeJS.Timeout

// format HH:mm:ss
const getTimeLabel = () =>
  new Date().toLocaleTimeString('en-US', { hour12: false })

const fetchLivePrice = async () => {
  const { data } = await useFetch<CoinResponse[]>(
    `/api/history/?id=${coinId}`
  )
  const coin = data.value?.[0]
  if (coin) {
    prices.value.push(parseFloat(coin.price_usd))
    labels.value.push(getTimeLabel())

    // Keep only last 20 data points
    if (prices.value.length > 20) {
      prices.value.shift()
      labels.value.shift()
    }
  }
}

// Initial fetch + polling setup
onMounted(async () => {
  await fetchLivePrice()
  intervalId = setInterval(fetchLivePrice, pollingInterval)
})

onUnmounted(() => {
  clearInterval(intervalId)
})

const chartData = computed(() => ({
  labels: labels.value,
  datasets: [
    {
      label: 'Live Price (USD)',
      data: prices.value,
      borderColor: '#1a73e8',
      backgroundColor: 'rgba(26, 115, 232, 0.2)',
      fill: true,
      tension: 0.3,
    },
  ],
}))

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: true,
    },
  },
  scales: {
    y: {
      beginAtZero: false,
    },
  },
}
</script>

<style scoped>
.chart-container {
  height: 300px;
  margin-top: 2rem;
}
</style>
