<template>
  <div
    class="parking-spot"
    @mouseenter="isHover = true"
    @mouseleave="isHover = false"
  >
    <div
      class="spot-card"
      :class="statusClass"
      :style="spotStyle"
      role="button"
      tabindex="0"
      :aria-pressed="status === 'occupied'"
      @click="onClick"
      @keydown.enter="onClick"
    >
      <span class="spot-id">{{ spotId }}</span>
      <small class="spot-state">{{ statusLabel }}</small>
    </div>

    <div v-if="isHover" class="spot-tooltip" aria-hidden="true">
      {{ statusLabel }}
    </div>
  </div>
</template>

<script>
export default {
  name: "ParkingSpot",
  props: {
    spotId: { type: [String, Number], required: true },
    status: {
      type: String,
      default: "free",
      validator: (v) => ["free", "occupied"].includes(v),
    },
    position: { type: Object, default: () => ({ x: 0, y: 0 }) },
    size: { type: Object, default: () => ({ width: 120, height: 80 }) },
  },
  emits: ["spot-click"],
  data() {
    return {
      isHover: false,
    };
  },
  computed: {
    statusClass() {
      return this.status === "free" ? "is-free" : "is-occupied";
    },
    statusLabel() {
      return this.status === "occupied" ? "مشغولة" : "متاحة";
    },
    spotStyle() {
      return {
        width: `${this.size.width}px`,
        height: `${this.size.height}px`,
      };
    },
  },
  methods: {
    onClick() {
      this.$emit("spot-click", {
        spotId: this.spotId,
        position: this.position,
      });
    },
  },
};
</script>

<style scoped>
.parking-spot {
  position: relative;
  display: inline-block;
}

.spot-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 6px;
  border-radius: 24px;
  cursor: pointer;
  user-select: none;
  border: 2px solid rgba(255, 255, 255, 0.9);
  box-shadow:
    0 18px 28px rgba(15, 23, 42, 0.12),
    inset 0 1px 0 rgba(255, 255, 255, 0.55);
  transition:
    transform 180ms ease,
    box-shadow 180ms ease,
    filter 180ms ease;
}

.spot-card:hover,
.spot-card:focus-visible {
  transform: translateY(-4px) scale(1.03);
  box-shadow:
    0 22px 38px rgba(15, 23, 42, 0.16),
    inset 0 1px 0 rgba(255, 255, 255, 0.7);
  outline: none;
}

.spot-id {
  font-size: 1.15rem;
  font-weight: 800;
  letter-spacing: 0.04em;
}

.spot-state {
  font-size: 0.8rem;
  opacity: 0.9;
}

.is-free {
  color: #123524;
  background: linear-gradient(180deg, #86efac, #4ade80);
}

.is-occupied {
  color: #fff7ed;
  background: linear-gradient(180deg, #fb7185, #ef4444);
}

.spot-tooltip {
  position: absolute;
  top: -14px;
  left: 50%;
  transform: translate(-50%, -100%);
  padding: 8px 12px;
  border-radius: 12px;
  background: rgba(15, 23, 42, 0.92);
  color: #ffffff;
  font-size: 0.75rem;
  white-space: nowrap;
  z-index: 60;
  pointer-events: none;
  box-shadow: 0 12px 30px rgba(15, 23, 42, 0.2);
}

@media (max-width: 768px) {
  .spot-card {
    border-radius: 18px;
  }

  .spot-id {
    font-size: 0.95rem;
  }
}
</style>
