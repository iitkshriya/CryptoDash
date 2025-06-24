<template>
  <main class="container">
    <h1>Market Overview</h1>

    <table v-if="currencies.length" class="styled-table" >
      <thead>
        <tr>
          <th>Name</th>
          <th>Symbol</th>
          <th>Price (USD)</th>
          <th>Details</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="currency in currencies" :key="currency.id">
          <td>{{ currency.name }}</td>
          <td>{{ currency.symbol }}</td>
          <td>${{ Number(currency.price_usd).toFixed(2) }}</td>
          <td>
            <NuxtLink :to="'/currency/' + currency.id">View</NuxtLink>
          </td>
        </tr>
      </tbody>
    </table>

    <p v-if="loading" class="loading">Loading more...</p>

    <button
      v-show="showBackToTop"
      class="back-to-top"
      @click="scrollToTop"
      aria-label="Back to top"
    >
      ↑
    </button>
  </main>
</template>

<script setup lang="ts">
import { useInfiniteScroll } from '~/composables/useInfiniteScroll'

// ✅ Define the shape of your data
interface Currency {
  id: string
  name: string
  symbol: string
  price_usd: string
  // Add more fields as needed (e.g. market_cap_usd, rank, etc.)
}

const limit = 20

// ✅ Type-safe fetch function
const fetchCurrencies = async (page: number): Promise<Currency[]> => {
  const { data } = await useFetch<{ data: Currency[] }>(
    `/api/tickers?limit=${limit}&page=${page}`
  )
  return data.value?.data || []
}

// ✅ Initial SSR-safe fetch
const { data: initialData } = await useFetch<{ data: Currency[] }>(
  `/api/tickers?limit=${limit}&page=1`
)

// ✅ Use composable with generic type
const {
  items: currencies,
  loading,
  showBackToTop,
  scrollToTop
} = useInfiniteScroll<Currency>(fetchCurrencies, {
  initialData: initialData.value?.data || [],
  initialPage: 2
})
</script>


<style scoped>
.container {
  max-width: 960px;
  margin: 0 auto;
  padding: 2rem;
  font-family: 'Open Sans', sans-serif;
  color: #333;
  position: relative;
}

h1 {
  font-size: 2rem;
  font-weight: 600;
  margin-bottom: 1.5rem;
  text-align: center;
}

.styled-table {
  width: 100%;
  border-collapse: collapse;
  background-color: #fff;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
}

.styled-table thead {
  background-color: #f5f7fa;
  text-align: left;
  font-weight: 600;
}

.styled-table th,
.styled-table td {
  padding: 1rem;
  border-bottom: 1px solid #eaecef;
}

.styled-table tbody tr:hover {
  background-color: #f0f4f8;
  transition: background-color 0.2s ease;
}

.styled-table td a {
  color: #0070f3;
  text-decoration: none;
  font-weight: 500;
}

.styled-table td a:hover {
  text-decoration: underline;
}

.loading {
  text-align: center;
  margin: 2rem 0;
  font-weight: 500;
  color: #777;
}

.back-to-top {
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  background: #0070f3;
  color: white;
  border: none;
  border-radius: 50%;
  width: 48px;
  height: 48px;
  font-size: 1.5rem;
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  transition: opacity 0.3s ease;
  z-index: 1000;
}
</style>
