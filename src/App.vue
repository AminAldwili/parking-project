<template>
  <div id="app-shell">
    <div class="app-background"></div>
    <header class="topbar">
      <div class="brand-block">
        <div class="brand-sign">
          <span class="sign-border"></span>
          <span class="sign-content">P</span>
          <span class="sign-border"></span>
        </div>
        <div class="brand-text">
          <span class="brand-kicker">Parking Guide</span>
          <h1>لوحة إدارة المواقف</h1>
        </div>
      </div>
      <nav class="nav-links" aria-label="Main navigation">
        <router-link to="/">
          <span class="nav-icon">🏠</span>
          الرئيسية
        </router-link>
        <router-link to="/about">
          <span class="nav-icon">ℹ️</span>
          حول المشروع
        </router-link>
      </nav>
    </header>
    <main class="page-content">
      <router-view />
    </main>
  </div>
</template>

<style lang="scss">
:root {
  color-scheme: dark;

  --asphalt-dark: #0f0f1a;
  --asphalt-base: #1a1a2e;
  --asphalt-light: #16213e;
  --asphalt-lighter: #252547;

  --road-white: #f1f5f9;
  --road-yellow: #fbbf24;

  --spot-free: #22c55e;
  --spot-occupied: #ef4444;
  --spot-free-bg: #166534;
  --spot-occupied-bg: #991b1b;

  --accent-orange: #f59e0b;
  --accent-glow: rgba(245, 158, 11, 0.3);
  --accent-teal: #14b8a6;

  --glass-bg: rgba(26, 26, 46, 0.85);
  --glass-border: rgba(255, 255, 255, 0.08);
}

* {
  box-sizing: border-box;
}

html {
  scroll-behavior: smooth;
}

body {
  margin: 0;
  direction: rtl;
  min-width: clamp(280px, 85vw, 100%);
  font-family: "Tajawal", "Segoe UI", Tahoma, sans-serif;
  background: var(--asphalt-dark);
  color: var(--road-white);
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  -webkit-tap-highlight-color: transparent;
  touch-action: manipulation;
  overflow-x: hidden;
}

body::before {
  content: "";
  position: fixed;
  inset: 0;
  background:
    repeating-linear-gradient(
      90deg,
      transparent,
      transparent 80px,
      rgba(255, 255, 255, 0.015) 80px,
      rgba(255, 255, 255, 0.015) 81px
    ),
    repeating-linear-gradient(
      0deg,
      transparent,
      transparent 80px,
      rgba(255, 255, 255, 0.015) 80px,
      rgba(255, 255, 255, 0.015) 81px
    );
  pointer-events: none;
  z-index: 0;
}

a {
  color: inherit;
  text-decoration: none;
}

#app-shell {
  position: relative;
  min-height: 100vh;
  padding: clamp(10px, 3vw, 20px);
}

.app-background {
  position: fixed;
  inset: 0;
  background:
    radial-gradient(
      ellipse at 20% 0%,
      rgba(99, 102, 241, 0.08),
      transparent 50%
    ),
    radial-gradient(
      ellipse at 80% 100%,
      rgba(245, 158, 11, 0.06),
      transparent 50%
    ),
    var(--asphalt-dark);
  pointer-events: none;
  z-index: 0;
}

.topbar,
.page-content {
  position: relative;
  z-index: 1;
}

.topbar {
  max-width: 1400px;
  margin: 0 auto 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  padding: 16px 24px;
  border: 1px solid var(--glass-border);
  border-radius: 20px;
  background: var(--glass-bg);
  backdrop-filter: blur(20px);
  box-shadow:
    0 8px 32px rgba(0, 0, 0, 0.3),
    inset 0 1px 0 rgba(255, 255, 255, 0.05);
}

.brand-block {
  display: flex;
  align-items: center;
  gap: 16px;
}

.brand-sign {
  position: relative;
  width: 52px;
  height: 52px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(145deg, var(--accent-orange), #d97706);
  border-radius: 12px;
  box-shadow:
    0 4px 16px var(--accent-glow),
    inset 0 1px 0 rgba(255, 255, 255, 0.2);
}

.brand-sign::before,
.brand-sign::after {
  content: "";
  position: absolute;
  width: 100%;
  height: 100%;
  border: 3px dashed rgba(255, 255, 255, 0.3);
  border-radius: 12px;
  animation: rotate-sign 20s linear infinite;
}

.brand-sign::after {
  width: 120%;
  height: 120%;
  border-color: rgba(245, 158, 11, 0.2);
  animation-direction: reverse;
}

@keyframes rotate-sign {
  to {
    transform: rotate(360deg);
  }
}

.sign-content {
  font-size: 1.8rem;
  font-weight: 800;
  color: #fff;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.brand-text {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.brand-kicker {
  font-size: 0.72rem;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--accent-orange);
  font-weight: 700;
}

.brand-block h1 {
  margin: 0;
  font-size: clamp(1.2rem, 2vw, 1.6rem);
  font-weight: 800;
  color: var(--road-white);
}

.nav-links {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}

.nav-links a {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 18px;
  border-radius: 12px;
  font-weight: 700;
  font-size: 0.95rem;
  color: rgba(241, 245, 249, 0.7);
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid transparent;
  transition: all 200ms ease;
}

.nav-icon {
  font-size: 1rem;
}

.nav-links a:hover {
  color: var(--road-white);
  background: rgba(255, 255, 255, 0.08);
  border-color: rgba(255, 255, 255, 0.1);
  transform: translateY(-2px);
}

.nav-links a.router-link-exact-active {
  color: #fff;
  background: linear-gradient(135deg, var(--accent-orange), #d97706);
  border-color: transparent;
  box-shadow: 0 4px 20px var(--accent-glow);
}

.page-content {
  max-width: 1400px;
  margin: 0 auto;
}

@media (max-width: 768px) {
  .topbar {
    flex-wrap: wrap;
    gap: clamp(12px, 2vw, 16px);
  }
}

@media (max-width: 480px) {
  .topbar {
    flex-direction: column;
    gap: clamp(10px, 2vw, 14px);
  }

  .brand-block {
    width: 100%;
    justify-content: center;
  }

  .nav-links {
    width: 100%;
    justify-content: center;
    gap: clamp(4px, 1.5vw, 8px);
  }

  .nav-links a {
    flex: 1;
    justify-content: center;
  }
}

@media (max-width: 360px) {
  .brand-block {
    flex-direction: column;
    gap: clamp(8px, 2vw, 12px);
  }
}
</style>
