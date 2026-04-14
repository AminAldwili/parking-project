<template>
  <div class="home-view">
    <section class="hero-card">
      <div class="road-markings left">
        <span v-for="i in 5" :key="i" class="dash"></span>
      </div>

      <div class="hero-content">
        <div class="hero-badge">
          <span class="badge-icon">🅿️</span>
          <span>Smart Parking Flow</span>
        </div>
        <h2>اختيار الموقف صار أوضح وأسرع</h2>
        <p>
          اضغط على أي موقف ليظهر لك المسار الأصفر المنطلق من أعلى منتصف الدور
          الأول إلى موقع الموقف المختار مباشرة.
        </p>
      </div>

      <div class="hero-stats" aria-label="Parking summary">
        <div class="stat-chip">
          <div class="stat-icon">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
            >
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
              <polyline points="9,22 9,12 15,12 15,22" />
            </svg>
          </div>
          <strong>2</strong>
          <span>أدوار</span>
        </div>
        <div class="stat-chip">
          <div class="stat-icon">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
            >
              <rect x="3" y="3" width="18" height="18" rx="2" />
              <path d="M9 17V7h4a3 3 0 0 1 0 6H9" />
            </svg>
          </div>
          <strong>15</strong>
          <span>موقف</span>
        </div>
        <div class="stat-chip accent">
          <div class="stat-icon pulse">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
            >
              <circle cx="12" cy="12" r="10" />
              <polyline points="12,6 12,12 16,14" />
            </svg>
          </div>
          <strong>مسار</strong>
          <span>تتبع فوري</span>
        </div>
      </div>

      <div class="road-markings right">
        <span v-for="i in 5" :key="i" class="dash"></span>
      </div>
    </section>

    <ParkingFloors ref="floors" />
  </div>
</template>

<script>
import ParkingFloors from "@/components/ParkingFloors.vue";

export default {
  name: "HomeView",
  components: { ParkingFloors },
  mounted() {
    this.$nextTick(() => {
      const floors = this.$refs.floors?.$el;
      if (floors && floors.scrollIntoView) {
        floors.scrollIntoView({ behavior: "smooth", block: "end" });
      }
    });
  },
};
</script>

<style scoped>
.home-view {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.hero-card {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: clamp(16px, 3vw, 24px);
  padding: clamp(20px, 4vw, 40px);
  border-radius: clamp(16px, 3vw, 24px);
  background: linear-gradient(
    135deg,
    var(--asphalt-base) 0%,
    var(--asphalt-light) 100%
  );
  border: 1px solid var(--glass-border);
  overflow: hidden;
  box-shadow:
    0 20px 50px rgba(0, 0, 0, 0.4),
    inset 0 1px 0 rgba(255, 255, 255, 0.05);
}

.hero-card::before {
  content: "";
  position: absolute;
  inset: 0;
  background: repeating-linear-gradient(
    90deg,
    transparent,
    transparent 60px,
    rgba(255, 255, 255, 0.02) 60px,
    rgba(255, 255, 255, 0.02) 61px
  );
  pointer-events: none;
}

.hero-content {
  flex: 1;
  max-width: 600px;
}

.hero-badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 16px;
  padding: 8px 16px;
  border-radius: 999px;
  background: rgba(245, 158, 11, 0.15);
  border: 1px solid rgba(245, 158, 11, 0.3);
  font-size: 0.85rem;
  font-weight: 700;
  color: var(--accent-orange);
}

.badge-icon {
  font-size: 1rem;
}

.hero-content h2 {
  margin: 0 0 clamp(8px, 1.5vw, 12px);
  font-size: clamp(1.2rem, 3vw, 2.2rem);
  font-weight: 800;
  color: var(--road-white);
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
}

.hero-content p {
  margin: 0;
  font-size: clamp(0.85rem, 2vw, 1rem);
  line-height: clamp(1.5, 2.5vw, 1.8);
  color: rgba(241, 245, 249, 0.75);
}

.hero-stats {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.stat-chip {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: clamp(4px, 1vw, 6px);
  min-width: max(80px, 20%);
  padding: clamp(12px, 2.5vw, 20px);
  border-radius: clamp(12px, 2vw, 16px);
  background: var(--asphalt-dark);
  border: 1px solid var(--glass-border);
  text-align: center;
  transition: all 200ms ease;
}

.stat-chip:hover {
  transform: translateY(-3px);
  border-color: rgba(255, 255, 255, 0.15);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
}

.stat-icon {
  width: 28px;
  height: 28px;
  color: var(--accent-teal);
}

.stat-icon svg {
  width: 100%;
  height: 100%;
}

.stat-icon.pulse {
  animation: pulse-icon 2s ease-in-out infinite;
}

@keyframes pulse-icon {
  0%,
  100% {
    opacity: 1;
    transform: scale(1);
  }
  50% {
    opacity: 0.7;
    transform: scale(0.95);
  }
}

.stat-chip strong {
  font-size: 1.4rem;
  font-weight: 800;
  color: var(--road-white);
}

.stat-chip span {
  font-size: 0.85rem;
  color: rgba(241, 245, 249, 0.6);
}

.stat-chip.accent {
  background: rgba(245, 158, 11, 0.1);
  border-color: rgba(245, 158, 11, 0.25);
}

.stat-chip.accent .stat-icon {
  color: var(--accent-orange);
}

.stat-chip.accent strong {
  color: var(--accent-orange);
}

.road-markings {
  position: absolute;
  top: 0;
  bottom: 0;
  width: 40px;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  align-items: center;
  opacity: 0.4;
}

.road-markings.left {
  left: 0;
}

.road-markings.right {
  right: 0;
}

.road-markings .dash {
  width: 6px;
  height: 30px;
  background: var(--road-white);
  border-radius: 3px;
}

@media (max-width: 768px) {
  .hero-card {
    flex-direction: column;
    gap: clamp(14px, 3vw, 20px);
  }

  .hero-stats {
    flex-direction: row;
    width: 100%;
    justify-content: center;
  }

  .road-markings {
    display: none;
  }
}

@media (max-width: 480px) {
  .hero-badge {
    padding: clamp(5px, 1.5vw, 8px) clamp(10px, 2.5vw, 14px);
  }

  .hero-stats {
    gap: clamp(6px, 2vw, 10px);
  }
}
</style>
