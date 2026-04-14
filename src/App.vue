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
/*
 * ============================================================================
 * Fluid Design System - Parking Project
 * ============================================================================
 * 
 * This project uses a modern CSS fluid design approach for responsive layouts.
 * 
 * Key Features:
 * - CSS Custom Properties for consistent spacing, typography, and sizing
 * - clamp() functions for fluid values that scale smoothly between breakpoints
 * - Safe area support for edge screens (iPhone notch, Samsung edge, etc.)
 * 
 * Browser Support:
 * - Chrome 79+, Firefox 75+, Safari 13.1+, Edge 79+
 * 
 * Viewport Range: 280px - 1400px+
 * 
 * ============================================================================
 */

:root {
  color-scheme: dark;

  /* ================================
     Design Tokens - Colors
     ================================ */
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

  /* ================================
     Fluid Design System - Spacing
     Fluid range: 280px - 1400px viewport
     ================================ */
  --space-2xs: clamp(2px, 0.5vw, 6px);
  --space-xs: clamp(4px, 1vw, 10px);
  --space-sm: clamp(6px, 1.5vw, 14px);
  --space-md: clamp(10px, 2.5vw, 20px);
  --space-lg: clamp(14px, 4vw, 28px);
  --space-xl: clamp(20px, 5vw, 40px);
  --space-2xl: clamp(24px, 6vw, 48px);

  /* ================================
     Fluid Design System - Typography
     ================================ */
  --text-2xs: clamp(0.55rem, 1.3vw, 0.65rem);
  --text-xs: clamp(0.65rem, 1.5vw, 0.78rem);
  --text-sm: clamp(0.75rem, 2vw, 0.9rem);
  --text-base: clamp(0.85rem, 2.2vw, 1rem);
  --text-md: clamp(0.95rem, 2.5vw, 1.15rem);
  --text-lg: clamp(1.1rem, 3vw, 1.4rem);
  --text-xl: clamp(1.3rem, 4vw, 2.2rem);
  --text-2xl: clamp(1.5rem, 5vw, 2.5rem);

  /* ================================
     Fluid Design System - Sizing
     ================================ */
  --icon-xs: clamp(16px, 4vw, 22px);
  --icon-sm: clamp(20px, 5vw, 28px);
  --icon-md: clamp(28px, 7vw, 40px);
  --icon-lg: clamp(38px, 9vw, 52px);
  --icon-xl: clamp(48px, 11vw, 64px);

  /* ================================
     Fluid Design System - Border Radius
     ================================ */
  --radius-sm: clamp(6px, 1.5vw, 10px);
  --radius-md: clamp(10px, 2.5vw, 16px);
  --radius-lg: clamp(14px, 3.5vw, 20px);
  --radius-xl: clamp(18px, 4.5vw, 28px);

  /* ================================
     Safe Area Support - Edge Screens
     Fallback: 0 on unsupported browsers
     ================================ */
  --safe-top: max(clamp(10px, 3vw, 20px), env(safe-area-inset-top));
  --safe-bottom: max(clamp(10px, 3vw, 20px), env(safe-area-inset-bottom));
  --safe-left: max(clamp(10px, 3vw, 20px), env(safe-area-inset-left));
  --safe-right: max(clamp(10px, 3vw, 20px), env(safe-area-inset-right));
  --safe-inline: max(
    clamp(10px, 3vw, 20px),
    env(safe-area-inset-left),
    env(safe-area-inset-right)
  );
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
  padding: var(--safe-top) var(--safe-inline) var(--safe-bottom);
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
  margin: 0 auto var(--space-lg);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-lg);
  padding: var(--space-md) var(--space-lg);
  border: 1px solid var(--glass-border);
  border-radius: var(--radius-lg);
  background: var(--glass-bg);
  backdrop-filter: blur(20px);
  box-shadow:
    0 8px 32px rgba(0, 0, 0, 0.3),
    inset 0 1px 0 rgba(255, 255, 255, 0.05);
}

.brand-block {
  display: flex;
  align-items: center;
  gap: var(--space-md);
}

.brand-sign {
  position: relative;
  width: var(--icon-lg);
  height: var(--icon-lg);
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(145deg, var(--accent-orange), #d97706);
  border-radius: var(--radius-md);
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
  border-radius: var(--radius-md);
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
  font-size: var(--text-xl);
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
  font-size: var(--text-xs);
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
  gap: var(--space-sm);
  flex-wrap: wrap;
}

.nav-links a {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  padding: var(--space-sm) var(--space-md);
  border-radius: var(--radius-md);
  font-weight: 700;
  font-size: var(--text-sm);
  color: rgba(241, 245, 249, 0.7);
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid transparent;
  transition: all 200ms ease;
}

.nav-icon {
  font-size: var(--text-base);
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
