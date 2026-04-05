<template>
  <div class="home-view">
    <section class="hero-card">
      <div class="hero-copy">
        <span class="hero-badge">Smart Parking Flow</span>
        <h2>اختيار الموقف صار أوضح وأسرع</h2>
        <p>
          اضغط على أي موقف ليظهر لك المسار الأصفر المنطلق من أعلى منتصف الدور
          الأول إلى موقع الموقف المختار مباشرة.
        </p>
      </div>
      <div class="hero-stats" aria-label="Parking summary">
        <div class="stat-chip">
          <strong>2</strong>
          <span>أدوار</span>
        </div>
        <div class="stat-chip">
          <strong>15</strong>
          <span>موقف</span>
        </div>
        <div class="stat-chip accent">
          <strong>Live</strong>
          <span>Route Trace</span>
        </div>
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
  gap: 20px;
}

.hero-card {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 18px;
  padding: 28px;
  border-radius: 28px;
  background:
    linear-gradient(135deg, rgba(15, 118, 110, 0.93), rgba(14, 165, 164, 0.84)),
    linear-gradient(135deg, #0f172a, #1e293b);
  color: #f8fafc;
  box-shadow: 0 22px 48px rgba(15, 23, 42, 0.14);
}

.hero-copy {
  max-width: 680px;
}

.hero-badge {
  display: inline-flex;
  margin-bottom: 12px;
  padding: 7px 12px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.16);
  font-size: 0.82rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  font-weight: 700;
}

.hero-copy h2 {
  margin: 0 0 10px;
  font-size: clamp(1.65rem, 2.6vw, 2.75rem);
}

.hero-copy p {
  margin: 0;
  font-size: 1rem;
  line-height: 1.8;
  color: rgba(248, 250, 252, 0.88);
}

.hero-stats {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  justify-content: flex-end;
}

.stat-chip {
  min-width: 110px;
  padding: 16px 18px;
  border-radius: 22px;
  background: rgba(255, 255, 255, 0.12);
  border: 1px solid rgba(255, 255, 255, 0.18);
  text-align: center;
  backdrop-filter: blur(10px);
}

.stat-chip strong {
  display: block;
  font-size: 1.3rem;
  margin-bottom: 6px;
}

.stat-chip span {
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.8);
}

.stat-chip.accent {
  background: rgba(245, 158, 11, 0.18);
}

@media (max-width: 900px) {
  .hero-card {
    flex-direction: column;
    align-items: flex-start;
    padding: 22px;
  }

  .hero-stats {
    width: 100%;
    justify-content: flex-start;
  }
}
</style>
