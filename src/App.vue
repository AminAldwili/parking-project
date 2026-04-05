<template>
  <div id="app-shell">
    <div class="app-background"></div>
    <header class="topbar">
      <div class="brand-block">
        <span class="brand-kicker">Parking Guide</span>
        <h1>لوحة إدارة المواقف</h1>
      </div>
      <nav class="nav-links" aria-label="Main navigation">
        <router-link to="/">الرئيسية</router-link>
        <router-link to="/about">حول المشروع</router-link>
      </nav>
    </header>
    <main class="page-content">
      <router-view />
    </main>
  </div>
</template>

<style lang="scss">
:root {
  color-scheme: light;
}

* {
  box-sizing: border-box;
}

body {
  margin: 0;
  min-width: 320px;
  font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
  background:
    radial-gradient(circle at top left, rgba(15, 118, 110, 0.18), transparent 28%),
    radial-gradient(circle at top right, rgba(245, 158, 11, 0.16), transparent 30%),
    linear-gradient(180deg, #f7fafc 0%, #edf4f7 100%);
  color: #163042;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

body::before {
  content: "";
  position: fixed;
  inset: 0;
  background-image:
    linear-gradient(rgba(255, 255, 255, 0.5) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255, 255, 255, 0.45) 1px, transparent 1px);
  background-size: 36px 36px;
  opacity: 0.3;
  pointer-events: none;
}

a {
  color: inherit;
  text-decoration: none;
}

#app-shell {
  position: relative;
  min-height: 100vh;
  padding: 24px;
}

.app-background {
  position: absolute;
  inset: 0;
  background:
    radial-gradient(circle at 20% 20%, rgba(255, 255, 255, 0.8), transparent 34%),
    radial-gradient(circle at 80% 0%, rgba(255, 255, 255, 0.55), transparent 26%);
  pointer-events: none;
}

.topbar,
.page-content {
  position: relative;
  z-index: 1;
}

.topbar {
  max-width: 1280px;
  margin: 0 auto 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 20px 24px;
  border: 1px solid rgba(148, 163, 184, 0.25);
  border-radius: 24px;
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(16px);
  box-shadow: 0 16px 45px rgba(15, 23, 42, 0.08);
}

.brand-block {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 6px;
}

.brand-kicker {
  font-size: 0.78rem;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: #0f766e;
  font-weight: 700;
}

.brand-block h1 {
  margin: 0;
  font-size: clamp(1.45rem, 2vw, 2.2rem);
  color: #102a43;
}

.nav-links {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
}

.nav-links a {
  padding: 10px 16px;
  border-radius: 999px;
  font-weight: 700;
  color: #486581;
  transition:
    background-color 160ms ease,
    color 160ms ease,
    transform 160ms ease,
    box-shadow 160ms ease;
}

.nav-links a:hover {
  color: #102a43;
  background: rgba(255, 255, 255, 0.88);
  box-shadow: 0 10px 24px rgba(15, 23, 42, 0.08);
  transform: translateY(-1px);
}

.nav-links a.router-link-exact-active {
  color: #ffffff;
  background: linear-gradient(135deg, #0f766e, #0ea5a4);
  box-shadow: 0 14px 28px rgba(15, 118, 110, 0.25);
}

.page-content {
  max-width: 1280px;
  margin: 0 auto;
}

@media (max-width: 768px) {
  #app-shell {
    padding: 16px;
  }

  .topbar {
    padding: 18px;
    flex-direction: column;
    align-items: stretch;
  }

  .nav-links {
    justify-content: center;
  }
}
</style>
