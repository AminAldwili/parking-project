<template>
  <div
    class="parking-spot"
    :data-spot-id="spotId"
    ref="spotRef"
    @mouseenter="handleMouseEnter"
    @mouseleave="handleMouseLeave"
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
        <div class="indicator-glow"></div>
      </div>
    </div>

    <Teleport to="body">
      <Transition name="tooltip-fade">
        <div
          v-if="isHover || isTapped"
          class="spot-tooltip"
          :style="tooltipStyle"
          aria-hidden="true"
        >
          {{ statusLabel }}
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from "vue";

const STATUS_MAP = {
  0: { class: "is-free", label: "متاحة" },
  1: { class: "is-occupied", label: "مشغولة" },
  2: { class: "is-reserved", label: "محجوز" },
  3: { class: "is-maintenance", label: "صيانة" }
};

const props = defineProps({
  spotId: { type: [String, Number], required: true },
  status: {
    type: Number,
    default: 0,
    validator: (v) => [0, 1, 2, 3].includes(v),
  },
  position: { type: Object, default: () => ({ x: 0, y: 0 }) },
  size: { type: Object, default: () => ({ width: 130, height: 75 }) },
});

const emit = defineEmits(["spot-click"]);

const isHover = ref(false);
const isTapped = ref(false);
const spotRef = ref(null);
const tooltipPosition = ref({ x: 0, y: 0 });

const statusClass = computed(() => {
  return STATUS_MAP[props.status]?.class || "is-free";
});

const statusLabel = computed(() => {
  return STATUS_MAP[props.status]?.label || "متاحة";
});

const spotStyle = computed(() => {
  const w = props.size.width;
  const h = props.size.height;
  return {
    width: typeof w === "string" ? w : `${w}px`,
    height: typeof h === "string" ? h : `${h}px`,
  };
});

const tooltipStyle = computed(() => {
  const offset = 12;
  return {
    position: "fixed",
    left: `${tooltipPosition.value.x}px`,
    top: `${tooltipPosition.value.y + offset}px`,
    transform: "translateX(-50%)",
  };
});

function updateTooltipPosition() {
  const el = spotRef.value;
  if (!el) return;
  const rect = el.getBoundingClientRect();
  tooltipPosition.value = {
    x: rect.left + rect.width / 2,
    y: rect.top + rect.height,
  };
}

function handleMouseEnter() {
  isHover.value = true;
  updateTooltipPosition();
}

function handleMouseLeave() {
  isHover.value = false;
}

function onClick() {
  emit("spot-click", {
    spotId: props.spotId,
    position: props.position,
  });
}

onMounted(() => {
  window.addEventListener("resize", updateTooltipPosition);
});

onUnmounted(() => {
  window.removeEventListener("resize", updateTooltipPosition);
});
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
  border-radius: var(--radius-md);
  cursor: pointer;
  user-select: none;
  transition:
    transform var(--duration-normal) var(--ease-out),
    box-shadow var(--duration-normal) var(--ease-out);
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
  font-weight: 700;
  letter-spacing: 0.02em;
  transition: transform var(--duration-normal) var(--ease-out);
}

.spot-state {
  font-size: clamp(0.65rem, 1.8vw, 0.75rem);
  font-weight: 600;
  opacity: 0.85;
  transition: opacity var(--duration-normal) var(--ease-out);
}

.spot-indicator {
  position: absolute;
  bottom: clamp(4px, 1vw, 6px);
  right: clamp(4px, 1vw, 6px);
  width: clamp(8px, 2vw, 10px);
  height: clamp(8px, 2vw, 10px);
  border-radius: 50%;
  transition: all var(--duration-normal) var(--ease-out);
}

.indicator-glow {
  position: absolute;
  inset: 0;
  border-radius: 50%;
  opacity: 0;
  transition: all var(--duration-normal) var(--ease-out);
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
  border-radius: calc(var(--radius-md) + 3px);
  border: 2px solid var(--focus-ring);
  box-shadow: 0 0 16px var(--focus-ring);
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
  background: linear-gradient(145deg, var(--spot-free), #059669);
  color: #fff;
  box-shadow:
    var(--shadow-sm),
    0 0 0 1px rgba(16, 185, 129, 0.3),
    inset 0 1px 0 rgba(255, 255, 255, 0.2);
}

.is-free .spot-indicator {
  background: rgba(255, 255, 255, 0.9);
  box-shadow: 0 0 8px rgba(16, 185, 129, 0.6);
}

.is-free .indicator-glow {
  background: var(--spot-free);
}

.is-free:hover,
.is-free:focus-visible,
.is-free.is-hovered {
  transform: translateY(-4px) scale(1.02);
  box-shadow:
    var(--shadow-lg),
    0 0 20px rgba(16, 185, 129, 0.4),
    inset 0 1px 0 rgba(255, 255, 255, 0.25);
}

.is-free:hover .spot-indicator,
.is-free:focus-visible .spot-indicator {
  box-shadow: 0 0 16px rgba(16, 185, 129, 0.8);
}

.is-free:hover .indicator-glow,
.is-free:focus-visible .indicator-glow {
  animation: indicator-blink 1s ease-in-out infinite;
}

.is-occupied {
  background: linear-gradient(145deg, var(--spot-occupied), #dc2626);
  color: #fff;
  box-shadow:
    var(--shadow-sm),
    0 0 0 1px rgba(239, 68, 68, 0.3),
    inset 0 1px 0 rgba(255, 255, 255, 0.2);
}

.is-occupied .spot-indicator {
  background: rgba(255, 255, 255, 0.9);
  box-shadow: 0 0 8px rgba(239, 68, 68, 0.6);
}

.is-occupied .indicator-glow {
  background: var(--spot-occupied);
}

.is-occupied:hover,
.is-occupied:focus-visible,
.is-occupied.is-hovered {
  transform: translateY(-4px) scale(1.02);
  box-shadow:
    var(--shadow-lg),
    0 0 20px rgba(239, 68, 68, 0.4),
    inset 0 1px 0 rgba(255, 255, 255, 0.25);
}

.is-occupied:hover .spot-indicator,
.is-occupied:focus-visible .spot-indicator {
  box-shadow: 0 0 16px rgba(239, 68, 68, 0.8);
}

.is-occupied:hover .indicator-glow,
.is-occupied:focus-visible .indicator-glow {
  animation: indicator-blink 1s ease-in-out infinite;
}

@keyframes indicator-blink {
  0%,
  100% {
    opacity: 0;
    transform: scale(1);
  }
  50% {
    opacity: 0.5;
    transform: scale(2);
  }
}

.is-reserved {
  background: linear-gradient(145deg, var(--spot-reserved), #f97316);
  color: #fff;
  box-shadow:
    var(--shadow-sm),
    0 0 0 1px rgba(249, 115, 22, 0.3),
    inset 0 1px 0 rgba(255, 255, 255, 0.2);
}

.is-reserved .spot-indicator {
  background: rgba(255, 255, 255, 0.9);
  box-shadow: 0 0 8px rgba(249, 115, 22, 0.6);
}

.is-reserved .indicator-glow {
  background: var(--spot-reserved);
}

.is-reserved:hover,
.is-reserved:focus-visible,
.is-reserved.is-hovered {
  transform: translateY(-4px) scale(1.02);
  box-shadow:
    var(--shadow-lg),
    0 0 20px rgba(249, 115, 22, 0.4),
    inset 0 1px 0 rgba(255, 255, 255, 0.25);
}

.is-reserved:hover .spot-indicator,
.is-reserved:focus-visible .spot-indicator {
  box-shadow: 0 0 16px rgba(249, 115, 22, 0.8);
}

.is-reserved:hover .indicator-glow,
.is-reserved:focus-visible .indicator-glow {
  animation: indicator-blink 1s ease-in-out infinite;
}

.is-maintenance {
  background: linear-gradient(145deg, var(--spot-maintenance), #6b7280);
  color: #fff;
  box-shadow:
    var(--shadow-sm),
    0 0 0 1px rgba(107, 114, 128, 0.3),
    inset 0 1px 0 rgba(255, 255, 255, 0.2);
}

.is-maintenance .spot-indicator {
  background: rgba(255, 255, 255, 0.9);
  box-shadow: 0 0 8px rgba(107, 114, 128, 0.6);
}

.is-maintenance .indicator-glow {
  background: var(--spot-maintenance);
}

.is-maintenance:hover,
.is-maintenance:focus-visible,
.is-maintenance.is-hovered {
  transform: translateY(-4px) scale(1.02);
  box-shadow:
    var(--shadow-lg),
    0 0 20px rgba(107, 114, 128, 0.4),
    inset 0 1px 0 rgba(255, 255, 255, 0.25);
}

.is-maintenance:hover .spot-indicator,
.is-maintenance:focus-visible .spot-indicator {
  box-shadow: 0 0 16px rgba(107, 114, 128, 0.8);
}

.is-maintenance:hover .indicator-glow,
.is-maintenance:focus-visible .indicator-glow {
  animation: indicator-blink 1s ease-in-out infinite;
}

.spot-tooltip {
  padding: 6px 12px;
  border-radius: 6px;
  background: var(--asphalt-dark);
  color: var(--road-white);
  font-size: 12px;
  font-weight: 600;
  white-space: nowrap;
  z-index: 9999;
  pointer-events: none;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.4);
}

.tooltip-fade-enter-active,
.tooltip-fade-leave-active {
  transition: opacity 200ms ease, transform 200ms ease;
}

.tooltip-fade-enter-from,
.tooltip-fade-leave-to {
  opacity: 0;
  transform: translateX(-50%) translateY(8px);
}

@media (max-width: 768px) {
  .spot-indicator {
    width: clamp(6px, 1.5vw, 8px);
    height: clamp(6px, 1.5vw, 8px);
  }
}

@media (max-width: 480px) {
  .spot-card {
    border-radius: clamp(6px, 1.5vw, 8px);
    min-width: clamp(44px, 12vw, 50px);
    min-height: clamp(44px, 12vw, 50px);
  }

  .spot-indicator {
    width: clamp(5px, 1.2vw, 6px);
    height: clamp(5px, 1.2vw, 6px);
    bottom: clamp(2px, 0.8vw, 4px);
    right: clamp(2px, 0.8vw, 4px);
  }
}

:root.light .is-free {
  box-shadow:
    0 4px 16px rgba(5, 150, 105, 0.15),
    0 2px 4px rgba(0, 0, 0, 0.05),
    inset 0 1px 0 rgba(255, 255, 255, 0.6);
}

:root.light .is-free:hover,
:root.light .is-free:focus-visible,
:root.light .is-free.is-hovered {
  box-shadow:
    0 12px 32px rgba(5, 150, 105, 0.2),
    0 4px 8px rgba(0, 0, 0, 0.06),
    inset 0 1px 0 rgba(255, 255, 255, 0.7);
}

:root.light .is-occupied {
  box-shadow:
    0 4px 16px rgba(220, 38, 38, 0.12),
    0 2px 4px rgba(0, 0, 0, 0.04),
    inset 0 1px 0 rgba(255, 255, 255, 0.6);
}

:root.light .is-occupied:hover,
:root.light .is-occupied:focus-visible,
:root.light .is-occupied.is-hovered {
  box-shadow:
    0 12px 32px rgba(220, 38, 38, 0.18),
    0 4px 8px rgba(0, 0, 0, 0.05),
    inset 0 1px 0 rgba(255, 255, 255, 0.7);
}

:root.light .is-reserved {
  box-shadow:
    0 4px 16px rgba(249, 115, 22, 0.15),
    0 2px 4px rgba(0, 0, 0, 0.05),
    inset 0 1px 0 rgba(255, 255, 255, 0.6);
}

:root.light .is-reserved:hover,
:root.light .is-reserved:focus-visible,
:root.light .is-reserved.is-hovered {
  box-shadow:
    0 12px 32px rgba(249, 115, 22, 0.2),
    0 4px 8px rgba(0, 0, 0, 0.06),
    inset 0 1px 0 rgba(255, 255, 255, 0.7);
}

:root.light .is-maintenance {
  box-shadow:
    0 4px 16px rgba(107, 114, 128, 0.12),
    0 2px 4px rgba(0, 0, 0, 0.04),
    inset 0 1px 0 rgba(255, 255, 255, 0.6);
}

:root.light .is-maintenance:hover,
:root.light .is-maintenance:focus-visible,
:root.light .is-maintenance.is-hovered {
  box-shadow:
    0 12px 32px rgba(107, 114, 128, 0.18),
    0 4px 8px rgba(0, 0, 0, 0.05),
    inset 0 1px 0 rgba(255, 255, 255, 0.7);
}
</style>
