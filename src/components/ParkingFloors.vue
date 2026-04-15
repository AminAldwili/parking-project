<template>
  <div class="parking-floors" ref="container">
    <PathDrawer :active-path="activePath" :container-size="containerSize" />
    <div class="parking-shell">
      <div class="section-heading">
        <div>
          <span class="eyebrow">
            <span class="eyebrow-icon">🗺️</span>
            Interactive Layout
          </span>
          <h3>خريطة المواقف</h3>
        </div>
        <p>
          اختر أي موقف لترى مسارًا مرئيًا يبدأ من مرجع الدور الأول في أسفل
          المنتصف وينتهي عند الموقف المحدد.
        </p>
      </div>

      <div class="floors-container">
        <section class="floor-box" ref="secondFloorBox">
          <div class="floor-header">
            <div class="floor-sign">
              <span class="floor-level">2</span>
            </div>
            <div class="floor-info">
              <h3 class="floor-title">الدور 2</h3>
              <p class="floor-subtitle">
                المسار يصل لأي موقف في هذا الدور أيضًا
              </p>
            </div>
          </div>
          <ParkingFloor
            :floor="2"
            :spots-prop="floor2Spots"
            :aisle-x-percent="aisleXPercent"
            @floor-resize="handleFloorResize"
            @request-path="handleRequestPath"
          />
        </section>

        <div
          class="ramp-connector"
          :class="{ 'ramp-active': activePath && activePath.targetFloor === 2 }"
          ref="rampConnector"
        >
          <div class="ramp-wrapper">
            <div class="ramp-track">
              <div class="ramp-edge left"></div>
              <div class="ramp-edge right"></div>
              <div class="ramp-lane-mark top"></div>
              <div class="ramp-lane-mark bottom"></div>
              <div class="ramp-center-line"></div>
              <div class="ramp-arrows-layer">
                <svg
                  class="ramp-arrow-svg"
                  viewBox="0 0 40 60"
                  preserveAspectRatio="xMidYMid meet"
                >
                  <defs>
                    <linearGradient
                      id="arrowGrad"
                      x1="0%"
                      y1="100%"
                      x2="0%"
                      y2="0%"
                    >
                      <stop
                        offset="0%"
                        stop-color="#fbbf24"
                        stop-opacity="0.4"
                      />
                      <stop
                        offset="100%"
                        stop-color="#fbbf24"
                        stop-opacity="1"
                      />
                    </linearGradient>
                  </defs>
                  <path
                    d="M20 55 L20 15 M20 15 L8 30 M20 15 L32 30"
                    stroke="url(#arrowGrad)"
                    stroke-width="4"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    fill="none"
                  />
                </svg>
              </div>
            </div>
            <div class="ramp-sign">
              <div class="sign-badge">
                <span class="sign-level">2</span>
              </div>
              <span class="sign-text">الدور</span>
            </div>
          </div>
        </div>

        <section class="floor-box first-floor-box" ref="firstFloorBox">
          <div class="floor-header">
            <div class="floor-sign">
              <span class="floor-level">1</span>
            </div>
            <div class="floor-info">
              <h3 class="floor-title">الدور 1</h3>
              <p class="floor-subtitle">
                المدخل المرجعي للمسار موجود أسفل المنتصف
              </p>
            </div>
            <div class="route-origin-pill">
              <span class="route-origin-dot"></span>
              نقطة الدخول
            </div>
          </div>
          <div class="route-origin-anchor" aria-hidden="true"></div>
          <ParkingFloor
            :floor="1"
            :spots-prop="floor1Spots"
            :aisle-x-percent="aisleXPercent"
            @floor-resize="handleFloorResize"
            @request-path="handleRequestPath"
          />
        </section>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, onUnmounted, nextTick } from "vue";
import ParkingFloor from "@/components/ParkingFloor.vue";
import PathDrawer from "@/components/PathDrawer.vue";

function randomStatus() {
  return Math.random() < 0.5 ? "occupied" : "free";
}

function buildYPositions(count) {
  return Array.from(
    { length: count },
    (_, idx) => ((idx + 1) / (count + 1)) * 100,
  ).reverse();
}

const aisleXPercent = 50;

const spotCount = 5;
const yPositions = buildYPositions(spotCount);

const floor1Spots = reactive([]);
const floor2Spots = reactive([]);

yPositions.forEach((y, idx) => {
  floor1Spots.push({
    id: `A${idx + 1}`,
    x: 75,
    y,
    section: "A",
    status: randomStatus(),
    size: { width: 130, height: 75 },
  });
});

yPositions.forEach((y, idx) => {
  floor1Spots.push({
    id: `B${idx + 1}`,
    x: 25,
    y,
    section: "B",
    status: randomStatus(),
    size: { width: 130, height: 75 },
  });
});

yPositions.forEach((y, idx) => {
  floor2Spots.push({
    id: `C${idx + 1}`,
    x: 75,
    y,
    section: "C",
    status: randomStatus(),
    size: { width: 130, height: 75 },
  });
});

const container = ref(null);
const rampConnector = ref(null);
const firstFloorBox = ref(null);
const secondFloorBox = ref(null);

const containerSize = ref({ width: 0, height: 0 });
const activePath = ref(null);
const rampRect = ref(null);
const clearTimer = ref(null);
const resizeObserver = ref(null);
const floorWidths = reactive({ 1: 0, 2: 0 });

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function measureFloorWidths() {
  const firstRect = firstFloorBox.value?.getBoundingClientRect();
  const secondRect = secondFloorBox.value?.getBoundingClientRect();
  if (firstRect?.width) floorWidths[1] = firstRect.width;
  if (secondRect?.width) floorWidths[2] = secondRect.width;
}

function getFluidSpotSize(floorWidth) {
  const baseWidth =
    Number.isFinite(floorWidth) && floorWidth > 0 ? floorWidth : window.innerWidth;
  const spotWidth = clamp(Math.round(baseWidth * 0.28), 64, 130);
  const spotHeight = clamp(Math.round(spotWidth * 0.58), 42, 75);
  return { width: spotWidth, height: spotHeight };
}

function updateContainerSize() {
  nextTick(() => {
    const el = container.value;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    containerSize.value = { width: rect.width, height: rect.height };
  });
}

function updateSpotSizes() {
  if (!floorWidths[1] || !floorWidths[2]) {
    measureFloorWidths();
  }
  applySpotSizes();
}

function applySpotSizes() {
  const floor1Size = getFluidSpotSize(floorWidths[1]);
  const floor2Size = getFluidSpotSize(floorWidths[2]);
  floor1Spots.forEach((spot) => {
    spot.size = { ...floor1Size };
  });
  floor2Spots.forEach((spot) => {
    spot.size = { ...floor2Size };
  });
}

function handleFloorResize(payload) {
  if (!payload?.floor || !payload?.rect?.width) return;
  floorWidths[Number(payload.floor)] = payload.rect.width;
  updateSpotSizes();
}

function handleWindowResize() {
  updateContainerSize();
  updateRampRect();
  measureFloorWidths();
  updateSpotSizes();
}

function updateRampRect() {
  nextTick(() => {
    const ramp = rampConnector.value;
    if (ramp) {
      rampRect.value = ramp.getBoundingClientRect();
    }
  });
}

function handleRequestPath(payload) {
  if (!containerSize.value.width || !containerSize.value.height) {
    updateContainerSize();
  }

  const containerRect = container.value?.getBoundingClientRect();
  const floorRectData = firstFloorBox.value?.getBoundingClientRect();
  updateRampRect();

  if (
    !containerRect ||
    !floorRectData ||
    !payload.floorRect ||
    !payload.spotCenter
  ) {
    return;
  }

  const end = {
    x: payload.floorRect.left - containerRect.left + payload.spotCenter.x,
    y: payload.floorRect.top - containerRect.top + payload.spotCenter.y,
  };

  const start = {
    x:
      floorRectData.left -
      containerRect.left +
      (aisleXPercent / 100) * floorRectData.width,
    y: floorRectData.bottom - containerRect.top - 18,
  };

  const targetFloor = payload.floor;

  activePath.value = {
    start,
    end,
    aisleXPercent: payload.aisleXPercent,
    targetFloor,
    rampRect: rampRect.value,
    containerRect,
  };

  if (clearTimer.value) clearTimeout(clearTimer.value);
  clearTimer.value = setTimeout(() => {
    activePath.value = null;
    clearTimer.value = null;
  }, 5000);
}

onMounted(() => {
  nextTick(() => {
    const el = container.value;
    if (el && window.ResizeObserver) {
      resizeObserver.value = new ResizeObserver(() => {
        updateContainerSize();
        measureFloorWidths();
        updateSpotSizes();
      });
      resizeObserver.value.observe(el);
    }
    updateContainerSize();
    updateRampRect();
    measureFloorWidths();
    updateSpotSizes();
  });

  window.addEventListener("resize", handleWindowResize);
});

onUnmounted(() => {
  window.removeEventListener("resize", handleWindowResize);
  if (resizeObserver.value) {
    resizeObserver.value.disconnect();
    resizeObserver.value = null;
  }
  if (clearTimer.value) clearTimeout(clearTimer.value);
});
</script>

<style scoped>
/*
 * ============================================================================
 * ParkingFloors - Interactive Parking Layout
 * ============================================================================
 * 
 * Contains:
 * - Floor boxes (Floor 1 & Floor 2)
 * - Ramp connector between floors
 * - Route path visualization
 * 
 * Features:
 * - Dynamic path drawing on spot selection
 * - Ramp animation on path activation
 * - Fluid spacing via CSS Custom Properties
 * 
 * ============================================================================
 */

.parking-floors {
  width: 100%;
  position: relative;
  padding-bottom: 28px;
}

.parking-shell {
  position: relative;
  padding: max(clamp(12px, 4vw, 28px), env(safe-area-inset-top))
    max(
      clamp(12px, 4vw, 28px),
      env(safe-area-inset-right),
      env(safe-area-inset-left)
    )
    max(clamp(12px, 4vw, 28px), env(safe-area-inset-bottom));
  border-radius: clamp(14px, 4vw, 28px);
  background: var(--asphalt-base);
  border: 1px solid var(--glass-border);
  box-shadow:
    0 24px 60px rgba(0, 0, 0, 0.4),
    inset 0 1px 0 rgba(255, 255, 255, 0.03);
}

.parking-shell::before {
  content: "";
  position: absolute;
  inset: 0;
  border-radius: inherit;
  background: repeating-linear-gradient(
    90deg,
    transparent,
    transparent 40px,
    rgba(255, 255, 255, 0.015) 40px,
    rgba(255, 255, 255, 0.015) 41px
  );
  pointer-events: none;
}

.section-heading {
  display: flex;
  align-items: end;
  justify-content: space-between;
  gap: clamp(8px, 2vw, 16px);
  margin-bottom: clamp(16px, 3vw, 24px);
  padding-bottom: clamp(12px, 3vw, 20px);
  border-bottom: 1px dashed rgba(255, 255, 255, 0.1);
}

.section-heading h3 {
  margin: var(--space-xs) 0 0;
  font-size: clamp(1.3rem, 2vw, 1.8rem);
  color: var(--road-white);
}

.section-heading p {
  margin: 0;
  max-width: 440px;
  line-height: 1.7;
  color: rgba(241, 245, 249, 0.6);
}

.eyebrow {
  display: inline-flex;
  align-items: center;
  gap: var(--space-xs);
  font-size: var(--text-xs);
  font-weight: 700;
  color: var(--accent-orange);
  text-transform: uppercase;
  letter-spacing: 0.12em;
}

.eyebrow-icon {
  font-size: var(--text-sm);
}

.floors-container {
  display: flex;
  flex-direction: column;
  gap: var(--space-md);
}

.floor-box {
  position: relative;
  border: 2px solid rgba(251, 191, 36, 0.2);
  border-radius: var(--radius-xl);
  overflow: hidden;
  background: var(--asphalt-light);
  box-shadow:
    inset 0 2px 0 rgba(251, 191, 36, 0.05),
    0 4px 20px rgba(0, 0, 0, 0.2);
}

.floor-box::before {
  content: "";
  position: absolute;
  inset: 0;
  background:
    repeating-linear-gradient(
      90deg,
      transparent,
      transparent 100px,
      rgba(255, 255, 255, 0.01) 100px,
      rgba(255, 255, 255, 0.01) 101px
    ),
    linear-gradient(
      180deg,
      rgba(251, 191, 36, 0.03) 0%,
      transparent 30%,
      transparent 70%,
      rgba(0, 0, 0, 0.15) 100%
    );
  pointer-events: none;
  z-index: 1;
}

.floor-header {
  display: flex;
  align-items: center;
  gap: clamp(10px, 2vw, 16px);
  padding: clamp(10px, 2vw, 16px) clamp(12px, 3vw, 20px) clamp(8px, 2vw, 12px);
  background: rgba(0, 0, 0, 0.2);
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

.floor-sign {
  width: var(--icon-md);
  height: var(--icon-md);
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, var(--road-yellow), #f59e0b);
  border-radius: var(--radius-md);
  box-shadow:
    0 4px 16px rgba(251, 191, 36, 0.3),
    inset 0 1px 0 rgba(255, 255, 255, 0.3);
}

.floor-level {
  font-size: var(--text-xl);
  font-weight: 800;
  color: var(--asphalt-dark);
}

.floor-info {
  flex: 1;
}

.floor-title {
  margin: 0;
  font-size: var(--text-md);
  font-weight: 800;
  color: var(--road-white);
}

.floor-subtitle {
  margin: var(--space-2xs) 0 0;
  color: rgba(241, 245, 249, 0.5);
  font-size: var(--text-sm);
}

.route-origin-pill {
  display: inline-flex;
  align-items: center;
  gap: var(--space-sm);
  padding: var(--space-xs) var(--space-sm);
  border-radius: 999px;
  background: rgba(245, 158, 11, 0.15);
  border: 1px solid rgba(245, 158, 11, 0.3);
  color: var(--accent-orange);
  font-size: var(--text-base);
  font-weight: 700;
}

.route-origin-dot {
  width: var(--space-xs);
  height: var(--space-xs);
  border-radius: 50%;
  background: var(--road-yellow);
  box-shadow:
    0 0 8px var(--road-yellow),
    0 0 0 3px rgba(251, 191, 36, 0.25);
  animation: ambient-pulse 2s ease-in-out infinite;
}

@keyframes ambient-pulse {
  0%,
  100% {
    opacity: 1;
    transform: scale(1);
    box-shadow:
      0 0 8px var(--road-yellow),
      0 0 0 3px rgba(251, 191, 36, 0.25);
  }
  50% {
    opacity: 0.7;
    transform: scale(0.9);
    box-shadow:
      0 0 4px var(--road-yellow),
      0 0 0 5px rgba(251, 191, 36, 0.15);
  }
}

.route-origin-anchor {
  position: absolute;
  bottom: var(--space-sm);
  left: 50%;
  width: clamp(18px, 4vw, 22px);
  height: clamp(18px, 4vw, 22px);
  border: 3px solid var(--road-white);
  border-radius: 999px;
  transform: translateX(-50%);
  background: linear-gradient(135deg, var(--road-yellow), var(--accent-orange));
  box-shadow:
    0 0 0 6px rgba(251, 191, 36, 0.25),
    0 0 20px rgba(251, 191, 36, 0.4);
  z-index: 10;
  animation: anchor-glow 3s ease-in-out infinite;
}

@keyframes anchor-glow {
  0%,
  100% {
    box-shadow:
      0 0 0 6px rgba(251, 191, 36, 0.25),
      0 0 15px rgba(251, 191, 36, 0.3);
  }
  50% {
    box-shadow:
      0 0 0 8px rgba(251, 191, 36, 0.2),
      0 0 25px rgba(251, 191, 36, 0.5);
  }
}

.ramp-connector {
  position: relative;
  height: clamp(70px, 12vw, 90px);
  display: flex;
  align-items: center;
  justify-content: center;
}

.ramp-wrapper {
  position: relative;
  width: min(300px, 80%);
  height: clamp(48px, 10vw, 64px);
}

.ramp-track {
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, #0a0a14 0%, #12121f 50%, #0a0a14 100%);
  border-radius: var(--radius-md);
  border: 3px solid rgba(251, 191, 36, 0.35);
  box-shadow:
    0 4px 20px rgba(0, 0, 0, 0.5),
    inset 0 0 40px rgba(0, 0, 0, 0.4);
  overflow: hidden;
}

.ramp-track::before {
  content: "";
  position: absolute;
  inset: 0;
  background: repeating-linear-gradient(
    90deg,
    transparent,
    transparent 38px,
    rgba(255, 255, 255, 0.02) 38px,
    rgba(255, 255, 255, 0.02) 40px
  );
}

.ramp-edge {
  position: absolute;
  top: 0;
  bottom: 0;
  width: var(--space-2xs);
  background: linear-gradient(
    180deg,
    rgba(251, 191, 36, 0.25) 0%,
    rgba(251, 191, 36, 0.6) 20%,
    rgba(251, 191, 36, 0.6) 80%,
    rgba(251, 191, 36, 0.25) 100%
  );
}

.ramp-edge.left {
  left: var(--space-sm);
}

.ramp-edge.right {
  right: var(--space-sm);
}

.ramp-center-line {
  position: absolute;
  top: 50%;
  left: clamp(24px, 6vw, 30px);
  right: clamp(24px, 6vw, 30px);
  height: clamp(3px, 0.8vw, 4px);
  transform: translateY(-50%);
  background: repeating-linear-gradient(
    90deg,
    var(--road-yellow) 0px,
    var(--road-yellow) 20px,
    transparent 20px,
    transparent 35px
  );
  opacity: 0.5;
  transition: opacity 400ms ease;
}

.ramp-lane-mark {
  position: absolute;
  left: clamp(24px, 6vw, 30px);
  right: clamp(24px, 6vw, 30px);
  height: 2px;
  background: rgba(255, 255, 255, 0.06);
  border-radius: 1px;
}

.ramp-lane-mark.top {
  top: clamp(14px, 4vw, 18px);
}

.ramp-lane-mark.bottom {
  bottom: clamp(14px, 4vw, 18px);
}

.ramp-arrows-layer {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0.7;
}

.ramp-arrow-svg {
  width: clamp(24px, 5vw, 30px);
  height: clamp(36px, 8vw, 45px);
}

.ramp-sign {
  position: absolute;
  top: calc(-1 * var(--space-md));
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-2xs);
  z-index: 100;
}

.sign-badge {
  width: var(--icon-md);
  height: var(--icon-md);
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(145deg, var(--road-yellow), #f59e0b);
  border-radius: var(--radius-sm);
  box-shadow:
    0 2px 12px rgba(251, 191, 36, 0.3),
    inset 0 2px 0 rgba(255, 255, 255, 0.3);
  transition: box-shadow 400ms ease;
}

.sign-level {
  font-size: var(--text-lg);
  font-weight: 800;
  color: var(--asphalt-dark);
}

.sign-text {
  font-size: var(--text-2xs);
  font-weight: 700;
  color: rgba(241, 245, 249, 0.7);
  text-transform: uppercase;
  letter-spacing: 0.1em;
}

.ramp-connector.ramp-active .ramp-track {
  border-color: rgba(251, 191, 36, 0.6);
  box-shadow:
    0 2px 16px rgba(251, 191, 36, 0.2),
    inset 0 0 20px rgba(251, 191, 36, 0.05);
  transition: all 400ms ease;
}

.ramp-connector.ramp-active .ramp-center-line {
  opacity: 0.85;
  animation: dash-flow 1.2s linear infinite;
}

.ramp-connector.ramp-active .sign-badge {
  box-shadow:
    0 2px 16px rgba(251, 191, 36, 0.4),
    inset 0 2px 0 rgba(255, 255, 255, 0.3);
  transition: box-shadow 400ms ease;
}

@keyframes dash-flow {
  to {
    background-position: 30px 0;
  }
}

.parking-floors > .path-drawer {
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 50;
}

@media (max-width: 768px) {
  .ramp-wrapper {
    width: min(260px, 85%);
  }

  .section-heading {
    flex-direction: column;
    align-items: flex-start;
    gap: var(--space-sm);
  }

  .floor-header {
    flex-wrap: wrap;
    gap: var(--space-sm);
  }

  .route-origin-pill {
    align-self: flex-start;
  }
}

@media (max-width: 480px) {
  .floor-box {
    border-radius: var(--radius-lg);
    border-width: 1.5px;
  }

  .section-heading h3 {
    font-size: var(--text-lg);
  }
}

@media (max-width: 360px) {
  .ramp-wrapper {
    width: min(200px, 85vw);
  }
}
</style>
