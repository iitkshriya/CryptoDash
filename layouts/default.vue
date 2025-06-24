<template>
  <div class="layout">
    <header class="navbar">
      <nav class="nav-container">
        <NuxtLink to="/" class="logo">💰 CoinDesk</NuxtLink>
      </nav>
    </header>

    <main class="main-content">
      <slot />
    </main>
  </div>
</template>

<style scoped>
.layout {
  font-family: 'Open Sans', sans-serif;
  color: #333;
  background-color: #f9fafb;
  min-height: 100vh;
}

.navbar {
  background-color: #ffffff;
  border-bottom: 1px solid #eaeaea;
  padding: 1rem 2rem;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.03);
  position: sticky;
  top: 0;
  z-index: 1000;
}

.nav-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 960px;
  margin: 0 auto;
}

.logo {
  font-size: 1.5rem;
  font-weight: bold;
  color: #0070f3;
  text-decoration: none;
}

.nav-links {
  list-style: none;
  display: flex;
  gap: 1.5rem;
  padding: 0;
  margin: 0;
}

.nav-links li {
  display: inline;
}

.nav-links a {
  text-decoration: none;
  color: #333;
  font-weight: 500;
  transition: color 0.2s ease;
}

.nav-links a:hover {
  color: #0070f3;
}

.main-content {
  padding: 2rem;
  max-width: 960px;
  margin: 0 auto;
}
</style>
