<!-- eslint-disable @typescript-eslint/no-explicit-any -->
<!-- eslint-disable @typescript-eslint/no-explicit-any -->
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
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import axios from 'axios'

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale
)

const props = defineProps<{
  symbol: string // e.g., "btcusdt"
}>()

const prices = ref<number[]>([])
const labels = ref<string[]>([])
const maxPoints = 200 // for chart display

let socket: WebSocket | null = null

function formatTimeLabel(timestamp: number): string {
  return new Date(timestamp).toLocaleString('en-US', {
    hour12: false,
    hour: '2-digit',
    minute: '2-digit',
    day: '2-digit',
    month: 'short',
  })
}

async function loadHistoricalData(symbol: string) {
  const res = await axios.get(
  'https://fapi.binance.com/fapi/v1/klines',
  {
    params: {
      symbol: `${symbol.toUpperCase()}USDT`,  // e.g. BTCUSDT
      interval: '1h',                // valid interval (1m, 5m, 15m, 1h, 4h, 1d)
      limit: 168,                    // number of data points (1 week of 1h candles)
    },
  }
)


  const data = res.data as any[]
  prices.value = data.map((candle) => parseFloat(candle[4])) // close price
  labels.value = data.map((candle) => formatTimeLabel(candle[0]))
}

function connectWebSocket(symbol: string) {
  const stream = `${symbol.toUpperCase()}USDT@kline_1m`
  const url = `wss://fstream.binance.com/ws/${stream}`

  socket = new WebSocket(url)

  socket.onmessage = (event) => {
    const message = JSON.parse(event.data)
    const kline = message.k
    const close = parseFloat(kline.c)
    const time = kline.T

    prices.value.push(close)
    labels.value.push(formatTimeLabel(time))

    if (prices.value.length > maxPoints) {
      prices.value.shift()
      labels.value.shift()
    }
  }

  socket.onerror = (err) => {
    console.error('WebSocket error:', err)
  }

  socket.onclose = () => {
    console.warn('WebSocket closed. Reconnecting in 3s...')
    setTimeout(() => connectWebSocket(symbol), 3000)
  }
}

onMounted(async () => {
  await loadHistoricalData(props.symbol)
  connectWebSocket(props.symbol)
})

onUnmounted(() => {
  socket?.close()
})

watch(() => props.symbol, async (newSymbol) => {
  socket?.close()
  prices.value = []
  labels.value = []
  await loadHistoricalData(newSymbol)
  connectWebSocket(newSymbol)
})

const chartData = computed(() => ({
  labels: labels.value,
  datasets: [
    {
      label: `${props.symbol.toUpperCase()} Price (USD)`,
      data: prices.value,
      borderColor: '#1a73e8',
      backgroundColor: 'rgba(26, 115, 232, 0.1)',
      fill: true,
      tension: 0.3,
      pointRadius: 0,
    },
  ],
}))

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: true },
  },
  scales: {
    y: { beginAtZero: false },
  },
}
</script>

<style scoped>
.chart-container {
  height: 400px;
  margin-top: 2rem;
}
</style>
