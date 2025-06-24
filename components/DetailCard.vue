<template>
  <div class="currency-card">
    <header class="currency-header">
      <h2 class="name">{{ currency.name }} ({{ currency.symbol }})</h2>
      <p class="price">$ {{ formatNumber(currency.price_usd) }}</p>
    </header>

    <div class="details-grid">
      <div class="detail-item">
        <span class="label">Market Cap</span>
        <span class="value">$ {{ formatNumber(currency.market_cap_usd) }}</span>
      </div>
      <div class="detail-item">
        <span class="label">Price in BTC</span>
        <span class="value">{{ currency.price_btc }}</span>
      </div>
      <div class="detail-item">
        <span class="label">24h Volume</span>
        <span class="value">$ {{ formatNumber(currency.volume24) }}</span>
      </div>
      <div class="detail-item">
        <span class="label">Circulating Supply</span>
        <span class="value">{{ formatNumber(currency.csupply) }}</span>
      </div>
      <div class="detail-item change" :class="getChangeClass(currency.percent_change_1h)">
        <span class="label">Change (1h)</span>
        <span class="value">{{ currency.percent_change_1h }}%</span>
      </div>
      <div class="detail-item change" :class="getChangeClass(currency.percent_change_24h)">
        <span class="label">Change (24h)</span>
        <span class="value">{{ currency.percent_change_24h }}%</span>
      </div>
      <div class="detail-item change" :class="getChangeClass(currency.percent_change_7d)">
        <span class="label">Change (7d)</span>
        <span class="value">{{ currency.percent_change_7d }}%</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Currency } from '~/types';

defineProps<{
  currency: Currency
}>()

const formatNumber = (value: string | number): string => {
  return Number(value).toLocaleString('en-US', {
    maximumFractionDigits: 2
  })
}

const getChangeClass = (percent: string) => {
  const num = parseFloat(percent)
  if (isNaN(num)) return ''
  return num >= 0 ? 'positive' : 'negative'
}
</script>

<style scoped>
.currency-card {
  max-width: 600px;
  margin: 2rem auto;
  padding: 1.5rem;
  border-radius: 12px;
  background: #ffffff;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
  font-family: 'Open Sans', sans-serif;
}

.currency-header {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  margin-bottom: 1rem;
}

.name {
  font-size: 1.5rem;
  font-weight: 600;
}

.price {
  font-size: 1.5rem;
  font-weight: 700;
  color: #1a73e8;
}

.details-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 1rem;
}

.detail-item {
  display: flex;
  flex-direction: column;
}

.label {
  font-size: 0.85rem;
  color: #888;
}

.value {
  font-size: 1.1rem;
  font-weight: 500;
}

.change.positive .value {
  color: #2ecc71;
}

.change.negative .value {
  color: #e74c3c;
}
</style>
