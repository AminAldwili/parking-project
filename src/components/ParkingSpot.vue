<template>
  <div
    class="parking-spot"
    @mouseenter="isHover = true"
    @mouseleave="isHover = false"
  >
    <div
      class="spot-card"
      :class="[statusClass, { 'is-hovered': isHover || isTapped }]"
      :style="spotStyle"
      role="button"
      tabindex="0"
      :aria-pressed="status === 'occupied'"
      :aria-label="`موقف ${spotId} - ${statusLabel}`"
      @click="onClick"
      @touchstart.passive="isTapped = true"
      @touchend="isTapped = false"
      @touchcancel="isTapped = false"
      @keydown.enter="onClick"
      @keydown.space.prevent="onClick"
    >
      <div class="spot-inner">
        <span class="spot-id">{{ spotId }}</span>
        <span class="spot-state">{{ statusLabel }}</span>
      </div>
      <div class="spot-indicator">
        <div class="indicator-pulse"></div>
      </div>
    </div>

    <Transition name="tooltip-fade">
      <div v-if="isHover || isTapped" class="spot-tooltip" aria-hidden="true">
        {{ statusLabel }}
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";

const props = defineProps({
  spotId: { type: [String, Number], required: true },
  status: {
    type: String,
    default: "free",
    validator: (v) => ["free", "occupied"].includes(v),
  },
  position: { type: Object, default: () => ({ x: 0, y: 0 }) },
  size: { type: Object, default: () => ({ width: 130, height: 75 }) },
});

const emit = defineEmits(["spot-click"]);

const isHover = ref(false);
const isTapped = ref(false);

const statusClass = computed(() => {
  return props.status === "free" ? "is-free" : "is-occupied";
});

const statusLabel = computed(() => {
  return props.status === "occupied" ? "مشغولة" : "متاحة";
});

const spotStyle = computed(() => {
  const w = props.size.width;
  const h = props.size.height;
  return {
    width: typeof w === "string" ? w : `${w}px`,
    height: typeof h === "string" ? h : `${h}px`,
  };
});

function onClick() {
  emit("spot-click", {
    spotId: props.spotId,
    position: props.position,
  });
}
</script>

<style scoped>
.parking-spot {
  position: relative;
  display: inline-block;
  z-index: 10;
  overflow: visible;
}

.spot-card {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4px;
  border-radius: 8px;
  cursor: pointer;
  user-select: none;
  transition: all 250ms cubic-bezier(0.4, 0, 0.2, 1);
}

.spot-inner {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
}

.spot-id {
  font-size: clamp(0.9rem, 2.5vw, 1.1rem);
  font-weight: 800;
  letter-spacing: 0.02em;
  transition: transform 200ms ease;
}

.spot-state {
  font-size: clamp(0.65rem, 1.8vw, 0.75rem);
  font-weight: 600;
  opacity: 0.85;
  transition: opacity 200ms ease;
}

.spot-indicator {
  position: absolute;
  bottom: 6px;
  right: 6px;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  transition: all 250ms ease;
}

.indicator-pulse {
  position: absolute;
  inset: 0;
  border-radius: 50%;
  opacity: 0;
  transition: all 250ms ease;
}

.spot-card:hover .spot-id,
.spot-card:focus-visible .spot-id {
  transform: scale(1.05);
}

.spot-card:hover .spot-state,
.spot-card:focus-visible .spot-state {
  opacity: 1;
}

.spot-card:focus-visible {
  outline: none;
}

.spot-card:focus-visible::after {
  content: "";
  position: absolute;
  inset: -3px;
  border-radius: 11px;
  border: 2px solid var(--road-yellow);
  box-shadow: 0 0 12px rgba(251, 191, 36, 0.5);
  animation: focus-pulse 1.5s ease-in-out infinite;
}

@keyframes focus-pulse {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

.is-free {
  background: linear-gradient(145deg, var(--spot-free-bg), #15803d);
  color: #fff;
  box-shadow:
    0 4px 16px rgba(34, 197, 94, 0.15),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
}

.is-free .spot-indicator {
  background: var(--spot-free);
  box-shadow: 0 0 8px rgba(34, 197, 94, 0.6);
}

.is-free .indicator-pulse {
  background: var(--spot-free);
}

.is-free:hover,
.is-free:focus-visible,
.is-free.is-hovered {
  transform: translateY(-6px) scale(1.02);
  box-shadow:
    0 12px 32px rgba(34, 197, 94, 0.35),
    inset 0 1px 0 rgba(255, 255, 255, 0.15);
}

.is-free:hover .spot-indicator,
.is-free:focus-visible .spot-indicator {
  box-shadow: 0 0 16px rgba(34, 197, 94, 0.9);
}

.is-free:hover .indicator-pulse,
.is-free:focus-visible .indicator-pulse {
  animation: indicator-blink 1s ease-in-out infinite;
}

.is-occupied {
  background: linear-gradient(145deg, var(--spot-occupied-bg), #7f1d1d);
  color: #fff;
  box-shadow:
    0 4px 16px rgba(239, 68, 68, 0.1),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
}

.is-occupied .spot-indicator {
  background: var(--spot-occupied);
  box-shadow: 0 0 8px rgba(239, 68, 68, 0.6);
}

.is-occupied .indicator-pulse {
  background: var(--spot-occupied);
}

.is-occupied:hover,
.is-occupied:focus-visible,
.is-occupied.is-hovered {
  transform: translateY(-6px) scale(1.02);
  box-shadow:
    0 12px 32px rgba(239, 68, 68, 0.3),
    inset 0 1px 0 rgba(255, 255, 255, 0.15);
}

.is-occupied:hover .spot-indicator,
.is-occupied:focus-visible .spot-indicator {
  box-shadow: 0 0 16px rgba(239, 68, 68, 0.9);
}

.is-occupied:hover .indicator-pulse,
.is-occupied:focus-visible .indicator-pulse {
  animation: indicator-blink 1s ease-in-out infinite;
}

@keyframes indicator-blink {
  0%,
  100% {
    opacity: 0;
    transform: scale(1);
  }
  50% {
    opacity: 0.4;
    transform: scale(1.8);
  }
}

.spot-tooltip {
  position: absolute;
  bottom: -12px;
  left: 50%;
  transform: translateX(-50%) translateY(100%);
  padding: 6px 12px;
  border-radius: 8px;
  background: var(--asphalt-dark);
  border: 1px solid var(--glass-border);
  color: var(--road-white);
  font-size: 0.75rem;
  font-weight: 700;
  white-space: nowrap;
  z-index: 60;
  pointer-events: none;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.4);
}

.spot-tooltip::before {
  content: "";
  position: absolute;
  top: -6px;
  left: 50%;
  transform: translateX(-50%);
  border: 6px solid transparent;
  border-bottom-color: var(--asphalt-dark);
}

.tooltip-fade-enter-active,
.tooltip-fade-leave-active {
  transition: all 200ms ease;
}

.tooltip-fade-enter-from,
.tooltip-fade-leave-to {
  opacity: 0;
  transform: translateX(-50%) translateY(90%);
}

@media (max-width: 768px) {
  .spot-id {
    font-size: 1rem;
  }

  .spot-state {
    font-size: 0.7rem;
  }

  .spot-indicator {
    width: 8px;
    height: 8px;
  }
}

@media (max-width: 480px) {
  .spot-card {
    border-radius: 6px;
    min-width: 44px;
    min-height: 44px;
  }

  .spot-id {
    font-size: 0.9rem;
  }

  .spot-state {
    font-size: 0.65rem;
  }

  .spot-indicator {
    width: 6px;
    height: 6px;
    bottom: 4px;
    right: 4px;
  }
}

@media (max-width: 360px) {
  .spot-card {
    width: 100%;
    max-width: 200px;
    min-height: 50px;
    flex-direction: row;
    justify-content: space-between;
    padding: 12px 16px;
    border-radius: 8px;
  }

  .spot-inner {
    flex-direction: row;
    gap: 12px;
  }

  .spot-id {
    font-size: 1rem;
  }

  .spot-state {
    font-size: 0.8rem;
  }

  .spot-indicator {
    position: relative;
    bottom: auto;
    right: auto;
    align-self: center;
    width: 8px;
    height: 8px;
  }
}
</style>
