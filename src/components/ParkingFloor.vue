<template>
  <div
    ref="container"
    class="floor-container"
    :class="{ 'is-mobile-stack': isMobileStack }"
    role="region"
  >
    <div
      class="aisle-line"
      :style="{ left: aisleXPercent + '%' }"
      aria-hidden="true"
    >
      <div ref="aisleSurface" class="aisle-surface">
        <div class="aisle-center-line"></div>
      </div>
    </div>
    <div class="spots-wrapper" :class="{ 'mobile-stack': isMobileStack }">
      <div class="group-labels" :class="{ 'hidden-mobile': isMobileStack }">
        <div
          v-for="g in groupList"
          :key="g.section"
          class="group-label"
          :style="{ left: g.x + '%' }"
        >
          <span class="section-letter">{{ g.section }}</span>
        </div>
      </div>
      <div
        v-for="spot in spots"
        :key="spot.id"
        class="spot-wrapper"
        :class="{ 'mobile-spot': isMobileStack }"
        :style="isMobileStack ? {} : { left: spot.x + '%', top: spot.y + '%' }"
        :ref="(el) => setSpotRef(spot.id, el)"
      >
        <ParkingSpot
          :spot-id="spot.id"
          :status="spot.status"
          :position="{ x: spot.x, y: spot.y }"
          :size="spot.size"
          @spot-click="onSpotClick"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, nextTick } from "vue";
import ParkingSpot from "@/components/ParkingSpot.vue";

const props = defineProps({
  floor: { type: [String, Number], default: 1 },
  spotsProp: { type: Array, default: null },
  aisleXPercent: { type: Number, default: 50 },
});

const emit = defineEmits(["request-path"]);

const container = ref(null);
const spots = ref([]);
const resizeObserver = ref(null);
const spotRefs = ref({});
const windowWidth = ref(window.innerWidth);

const isMobileStack = computed(() => windowWidth.value <= 360);

const groupList = computed(() => {
  const map = {};
  (props.spots || []).forEach((s) => {
    if (!s || !s.section) return;
    if (!map[s.section]) map[s.section] = { section: s.section, x: s.x };
  });
  return Object.values(map);
});

function setSpotRef(id, el) {
  if (el) {
    spotRefs.value[id] = el;
  } else {
    delete spotRefs.value[id];
  }
}

function generateDefaultSpots() {
  const cols = 5;
  const rows = 3;
  const arr = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const index = r * cols + c;
      const id = `${props.floor}-${index + 1}`;
      const x = (c + 0.5) * (100 / cols);
      const y = (r + 0.5) * (100 / rows);
      let section = "C";
      if (Number(props.floor) === 1) {
        section = index < 5 ? "A" : "B";
      }
      arr.push({
        id,
        section,
        status: Math.random() > 0.5 ? "occupied" : "free",
        x,
        y,
        size: { width: 130, height: 75 },
      });
    }
  }
  return arr;
}

function updateContainerSize() {
  nextTick(() => {
    const el = container.value;
    if (el) {
      const rect = el.getBoundingClientRect();
      emit("floor-resize", { floor: props.floor, rect });
    }
  });
}

function handleResize() {
  windowWidth.value = window.innerWidth;
  updateContainerSize();
}

function onSpotClick(payload) {
  const floorRect = container.value?.getBoundingClientRect();
  let spotCenter = null;
  if (floorRect) {
    const spotEl = spotRefs.value[payload.spotId];
    if (spotEl) {
      const spotRect = spotEl.getBoundingClientRect();
      spotCenter = {
        x: spotRect.left - floorRect.left + spotRect.width / 2,
        y: spotRect.top - floorRect.top + spotRect.height / 2,
      };
    } else if (payload.position) {
      spotCenter = {
        x: (payload.position.x / 100) * floorRect.width,
        y: (payload.position.y / 100) * floorRect.height,
      };
    }
  }
  emit("request-path", {
    floor: props.floor,
    spotCenter,
    aisleXPercent: props.aisleXPercent,
    floorRect,
  });
}

onMounted(() => {
  if (props.spotsProp && props.spotsProp.length) {
    spots.value = props.spotsProp;
  } else {
    spots.value = generateDefaultSpots();
  }

  updateContainerSize();
  window.addEventListener("resize", handleResize);

  nextTick(() => {
    const el = container.value;
    if (el && window.ResizeObserver) {
      resizeObserver.value = new ResizeObserver(() => {
        handleResize();
      });
      resizeObserver.value.observe(el);
    }
  });
});

onUnmounted(() => {
  window.removeEventListener("resize", handleResize);
  if (resizeObserver.value) {
    resizeObserver.value.disconnect();
    resizeObserver.value = null;
  }
});
</script>

<style scoped>
.floor-container {
  position: relative;
  width: 100%;
  min-height: 520px;
  overflow: hidden;
  padding: 56px 24px 24px;
  background: var(--asphalt-dark);
}

.spots-wrapper {
  position: absolute;
  inset: 56px 0 24px;
}

.spot-wrapper {
  position: absolute;
  transform: translate(-50%, -50%);
  padding: 24px 12px;
}

.aisle-line {
  position: absolute;
  top: 0;
  bottom: 0;
  width: 70px;
  transform: translateX(-50%);
  z-index: 0;
  display: flex;
  justify-content: center;
  pointer-events: none;
}

.aisle-surface {
  position: relative;
  width: 100%;
  height: 100%;
  background: linear-gradient(180deg, #0a0a14, #12121f);
  border-left: 1px solid rgba(251, 191, 36, 0.15);
  border-right: 1px solid rgba(251, 191, 36, 0.15);
}

.aisle-center-line {
  position: absolute;
  top: 0;
  left: 50%;
  width: 2px;
  height: 100%;
  transform: translateX(-50%);
  background: linear-gradient(
    to bottom,
    transparent 0%,
    rgba(251, 191, 36, 0.2) 20%,
    rgba(251, 191, 36, 0.2) 80%,
    transparent 100%
  );
}

.group-labels {
  position: absolute;
  inset: 0 0 auto 0;
  pointer-events: none;
  z-index: 5;
}

.group-label {
  position: absolute;
  top: 8px;
  transform: translateX(-50%);
  min-width: 36px;
  text-align: center;
  background: var(--road-yellow);
  color: var(--asphalt-dark);
  padding: 4px 10px;
  border-radius: 8px;
  font-weight: 800;
  font-size: 0.85rem;
  box-shadow: 0 4px 12px rgba(251, 191, 36, 0.3);
}

.section-letter {
  font-weight: 800;
}

/* Mobile Stack Layout (360px and below) */
.spots-wrapper.mobile-stack {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  padding: 16px 0;
  inset: auto;
  position: relative;
}

.spot-wrapper.mobile-spot {
  position: relative;
  left: auto !important;
  top: auto !important;
  transform: none;
  padding: 8px;
}

.group-labels.hidden-mobile {
  display: none;
}

@media (max-width: 768px) {
  .floor-container {
    min-height: clamp(400px, 70vh, 520px);
    padding-top: clamp(44px, 10vw, 56px);
  }

  .aisle-line {
    width: clamp(40px, 8vw, 70px);
  }
}

@media (max-width: 360px) {
  .floor-container {
    min-height: auto;
    padding-inline: clamp(8px, 3vw, 16px);
  }

  .aisle-line {
    display: none;
  }
}
</style>
