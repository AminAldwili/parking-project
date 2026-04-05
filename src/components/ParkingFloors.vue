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
        <section class="floor-box">
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
          <Floor
            :floor="2"
            :spots-prop="floor2Spots"
            :aisle-x-percent="aisleXPercent"
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
          <Floor
            :floor="1"
            :spots-prop="floor1Spots"
            :aisle-x-percent="aisleXPercent"
            @request-path="handleRequestPath"
          />
        </section>
      </div>
    </div>
  </div>
</template>

<script>
import Floor from "@/components/Floor.vue";
import PathDrawer from "@/components/PathDrawer.vue";

function randomStatus() {
  return Math.random() < 0.5 ? "occupied" : "free";
}

function buildYPositions(count) {
  return Array.from(
    { length: count },
    (_, idx) => ((idx + 1) / (count + 1)) * 100,
  );
}

export default {
  name: "ParkingFloors",
  components: { Floor, PathDrawer },
  data() {
    const spotCount = 5;
    const yPositions = buildYPositions(spotCount).slice().reverse();

    const floor1Spots = [];
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

    const floor2Spots = [];
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

    return {
      aisleXPercent: 50,
      floor1Spots,
      floor2Spots,
      containerSize: { width: 0, height: 0 },
      activePath: null,
      clearTimer: null,
      resizeObserver: null,
      rampRect: null,
      currentSpotSize: { width: 130, height: 75 },
    };
  },
  mounted() {
    this.$nextTick(() => {
      const el = this.$refs.container;
      if (el && window.ResizeObserver) {
        this.resizeObserver = new ResizeObserver(() =>
          this.updateContainerSize(),
        );
        this.resizeObserver.observe(el);
      }
      this.updateContainerSize();
      this.updateRampRect();
      this.updateSpotSizes();
    });
    window.addEventListener("resize", () => {
      this.updateContainerSize();
      this.updateSpotSizes();
    });
  },
  beforeUnmount() {
    window.removeEventListener("resize", this.updateContainerSize.bind(this));
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
      this.resizeObserver = null;
    }
    if (this.clearTimer) clearTimeout(this.clearTimer);
  },
  methods: {
    updateContainerSize() {
      this.$nextTick(() => {
        const el = this.$refs.container;
        if (!el) return;
        const rect = el.getBoundingClientRect();
        this.containerSize = { width: rect.width, height: rect.height };
      });
    },
    updateSpotSizes() {
      const width = window.innerWidth;
      if (width < 360) {
        this.currentSpotSize = { width: "100%", height: 50, maxWidth: 200 };
      } else if (width < 480) {
        this.currentSpotSize = { width: 90, height: 55 };
      } else if (width < 768) {
        this.currentSpotSize = { width: 110, height: 65 };
      } else {
        this.currentSpotSize = { width: 130, height: 75 };
      }
      this.applySpotSizes();
    },
    applySpotSizes() {
      const size = this.currentSpotSize;
      this.floor1Spots.forEach((spot) => {
        spot.size = { ...size };
      });
      this.floor2Spots.forEach((spot) => {
        spot.size = { ...size };
      });
    },
    updateRampRect() {
      this.$nextTick(() => {
        const ramp = this.$refs.rampConnector;
        if (ramp) {
          this.rampRect = ramp.getBoundingClientRect();
        }
      });
    },
    handleRequestPath(payload) {
      if (!this.containerSize.width || !this.containerSize.height) {
        this.updateContainerSize();
      }

      const containerRect = this.$refs.container?.getBoundingClientRect();
      const firstFloorRect = this.$refs.firstFloorBox?.getBoundingClientRect();
      this.updateRampRect();

      if (
        !containerRect ||
        !firstFloorRect ||
        !payload.floorRect ||
        !payload.spotCenter
      ) {
        return;
      }

      const floorRect = payload.floorRect;
      const end = {
        x: floorRect.left - containerRect.left + payload.spotCenter.x,
        y: floorRect.top - containerRect.top + payload.spotCenter.y,
      };
      const start = {
        x:
          firstFloorRect.left -
          containerRect.left +
          (this.aisleXPercent / 100) * firstFloorRect.width,
        y: firstFloorRect.bottom - containerRect.top - 18,
      };

      const targetFloor = payload.floor;

      this.activePath = {
        start,
        end,
        aisleXPercent: payload.aisleXPercent,
        targetFloor,
        rampRect: this.rampRect,
        containerRect,
      };
      if (this.clearTimer) clearTimeout(this.clearTimer);
      this.clearTimer = setTimeout(() => {
        this.activePath = null;
        this.clearTimer = null;
      }, 5000);
    },
  },
};
</script>

<style scoped>
.parking-floors {
  width: 100%;
  position: relative;
  padding-bottom: 28px;
}

.parking-shell {
  position: relative;
  padding: 28px;
  border-radius: 28px;
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
  gap: 16px;
  margin-bottom: 24px;
  padding-bottom: 20px;
  border-bottom: 1px dashed rgba(255, 255, 255, 0.1);
}

.section-heading h3 {
  margin: 8px 0 0;
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
  gap: 6px;
  font-size: 0.78rem;
  font-weight: 700;
  color: var(--accent-orange);
  text-transform: uppercase;
  letter-spacing: 0.12em;
}

.eyebrow-icon {
  font-size: 0.9rem;
}

.floors-container {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.floor-box {
  position: relative;
  border: 2px solid rgba(251, 191, 36, 0.2);
  border-radius: 24px;
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
  gap: 16px;
  padding: 16px 20px 12px;
  background: rgba(0, 0, 0, 0.2);
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

.floor-sign {
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, var(--road-yellow), #f59e0b);
  border-radius: 12px;
  box-shadow:
    0 4px 16px rgba(251, 191, 36, 0.3),
    inset 0 1px 0 rgba(255, 255, 255, 0.3);
}

.floor-level {
  font-size: 1.5rem;
  font-weight: 800;
  color: var(--asphalt-dark);
}

.floor-info {
  flex: 1;
}

.floor-title {
  margin: 0;
  font-size: 1.1rem;
  font-weight: 800;
  color: var(--road-white);
}

.floor-subtitle {
  margin: 4px 0 0;
  color: rgba(241, 245, 249, 0.5);
  font-size: 0.88rem;
}

.route-origin-pill {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 14px;
  border-radius: 999px;
  background: rgba(245, 158, 11, 0.15);
  border: 1px solid rgba(245, 158, 11, 0.3);
  color: var(--accent-orange);
  font-size: 0.85rem;
  font-weight: 700;
}

.route-origin-dot {
  width: 10px;
  height: 10px;
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
  bottom: 10px;
  left: 50%;
  width: 22px;
  height: 22px;
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
  height: 90px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.ramp-wrapper {
  position: relative;
  width: min(300px, 80%);
  height: 64px;
}

.ramp-track {
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, #0a0a14 0%, #12121f 50%, #0a0a14 100%);
  border-radius: 12px;
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
  width: 5px;
  background: linear-gradient(
    180deg,
    rgba(251, 191, 36, 0.25) 0%,
    rgba(251, 191, 36, 0.6) 20%,
    rgba(251, 191, 36, 0.6) 80%,
    rgba(251, 191, 36, 0.25) 100%
  );
}

.ramp-edge.left {
  left: 10px;
}

.ramp-edge.right {
  right: 10px;
}

.ramp-center-line {
  position: absolute;
  top: 50%;
  left: 30px;
  right: 30px;
  height: 4px;
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
  left: 30px;
  right: 30px;
  height: 2px;
  background: rgba(255, 255, 255, 0.06);
  border-radius: 1px;
}

.ramp-lane-mark.top {
  top: 18px;
}

.ramp-lane-mark.bottom {
  bottom: 18px;
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
  width: 30px;
  height: 45px;
}

.ramp-sign {
  position: absolute;
  top: -16px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  z-index: 100;
}

.sign-badge {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(145deg, var(--road-yellow), #f59e0b);
  border-radius: 10px;
  box-shadow:
    0 2px 12px rgba(251, 191, 36, 0.3),
    inset 0 2px 0 rgba(255, 255, 255, 0.3);
  transition: box-shadow 400ms ease;
}

.sign-level {
  font-size: 1.4rem;
  font-weight: 800;
  color: var(--asphalt-dark);
}

.sign-text {
  font-size: 0.7rem;
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
  .parking-shell {
    padding: 18px;
    border-radius: 20px;
  }

  .ramp-wrapper {
    width: min(260px, 85%);
    height: 56px;
  }

  .ramp-connector {
    height: 80px;
  }

  .sign-badge {
    width: 34px;
    height: 34px;
  }

  .sign-level {
    font-size: 1.2rem;
  }

  .sign-text {
    font-size: 0.65rem;
  }

  .section-heading {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }

  .section-heading h3 {
    font-size: 1.2rem;
  }

  .section-heading p {
    font-size: 0.9rem;
  }

  .floor-header {
    flex-wrap: wrap;
    padding: 14px 16px 10px;
    gap: 12px;
  }

  .floor-sign {
    width: 42px;
    height: 42px;
  }

  .floor-level {
    font-size: 1.3rem;
  }

  .floor-title {
    font-size: 1rem;
  }

  .floor-subtitle {
    font-size: 0.82rem;
  }

  .route-origin-pill {
    align-self: flex-start;
    font-size: 0.8rem;
  }
}

@media (max-width: 480px) {
  .parking-shell {
    padding: 14px;
    border-radius: 16px;
  }

  .ramp-wrapper {
    width: min(220px, 90%);
    height: 48px;
  }

  .ramp-connector {
    height: 70px;
  }

  .sign-badge {
    width: 30px;
    height: 30px;
  }

  .sign-level {
    font-size: 1.1rem;
  }

  .sign-text {
    font-size: 0.6rem;
  }

  .floor-box {
    border-radius: 16px;
    border-width: 1.5px;
  }

  .floor-sign {
    width: 38px;
    height: 38px;
    border-radius: 10px;
  }

  .floor-level {
    font-size: 1.2rem;
  }

  .floor-subtitle {
    font-size: 0.78rem;
  }

  .section-heading h3 {
    font-size: 1.1rem;
  }

  .section-heading p {
    font-size: 0.85rem;
    line-height: 1.5;
  }

  .eyebrow {
    font-size: 0.7rem;
  }

  .eyebrow-icon {
    font-size: 0.8rem;
  }

  .floor-header {
    padding: 12px 14px 8px;
  }

  .floor-title {
    font-size: 0.95rem;
  }
}

@media (max-width: 360px) {
  .parking-shell {
    padding: 12px;
    border-radius: 14px;
  }

  .ramp-wrapper {
    width: 200px;
    height: 44px;
  }

  .ramp-connector {
    height: 65px;
  }

  .sign-badge {
    width: 28px;
    height: 28px;
  }

  .sign-level {
    font-size: 1rem;
  }

  .floor-header {
    padding: 10px 12px 6px;
  }

  .floor-sign {
    width: 34px;
    height: 34px;
  }

  .floor-level {
    font-size: 1.1rem;
  }
}
</style>
