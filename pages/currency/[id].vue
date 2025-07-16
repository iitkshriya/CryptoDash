<template>
  <div v-if="coins" class="container">
    <h2>{{ coins[0].name }} Details</h2>
    <DetailCard :currency="coins[0]"/>
    <CurrencyLiveChart :symbol="coins[0].symbol" />
  </div>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router'
import type { Currency } from '~/types'

// ✅ Get route params
const route = useRoute()
const id = route.params.id as string  // explicitly cast to string

// ✅ Fetch coin data with type
const { data: coins } = await useFetch<Currency[]>(`/api/ticker?id=${id}`)
</script>


<style scoped>
.container {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
  font-family: 'Open Sans', sans-serif;
  color: #333;
}

h2 {
  font-size: 1.75rem;
  font-weight: 600;
  text-align: center;
  margin-bottom: 2rem;
}

.details-table {
  width: 100%;
  border-collapse: collapse;
  background-color: #fff;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
}

.details-table thead {
  background-color: #f5f7fa;
  text-align: left;
  font-weight: 600;
}

.details-table th,
.details-table td {
  padding: 1rem;
  border-bottom: 1px solid #eaecef;
}

.details-table tbody tr:hover {
  background-color: #f0f4f8;
  transition: background-color 0.2s ease;
}
</style>
