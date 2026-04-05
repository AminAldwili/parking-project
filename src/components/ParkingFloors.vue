<template>
  <div class="parking-floors" ref="container">
    <PathDrawer :active-path="activePath" :container-size="containerSize" />
    <div class="parking-shell">
      <div class="section-heading">
        <div>
          <span class="eyebrow">Interactive Layout</span>
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
            <div>
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

        <div class="ramp-connector" aria-hidden="true">
          <div class="ramp-bar">
            <div class="ramp-steps">
              <span></span>
              <span></span>
              <span></span>
              <span></span>
            </div>
            <div class="ramp-text">صعود للدور 2</div>
            <div class="ramp-arrows">
              <div class="ramp-arrow"></div>
              <div class="ramp-arrow"></div>
            </div>
          </div>
        </div>

        <section class="floor-box first-floor-box" ref="firstFloorBox">
          <div class="floor-header">
            <div>
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
    const yPositions = buildYPositions(spotCount);

    const floor1Spots = [];
    yPositions.forEach((y, idx) => {
      floor1Spots.push({
        id: `A${idx + 1}`,
        x: 25,
        y,
        section: "A",
        status: randomStatus(),
        size: { width: 120, height: 80 },
      });
    });
    yPositions.forEach((y, idx) => {
      floor1Spots.push({
        id: `B${idx + 1}`,
        x: 75,
        y,
        section: "B",
        status: randomStatus(),
        size: { width: 120, height: 80 },
      });
    });

    const floor2Spots = [];
    yPositions.forEach((y, idx) => {
      floor2Spots.push({
        id: `C${idx + 1}`,
        x: 25,
        y,
        section: "C",
        status: randomStatus(),
        size: { width: 120, height: 80 },
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
    });
    window.addEventListener("resize", this.updateContainerSize.bind(this));
  },
  beforeUnmount() {
    window.removeEventListener("resize", this.updateContainerSize);
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
    handleRequestPath(payload) {
      if (!this.containerSize.width || !this.containerSize.height) {
        this.updateContainerSize();
      }

      const containerRect = this.$refs.container?.getBoundingClientRect();
      const firstFloorRect = this.$refs.firstFloorBox?.getBoundingClientRect();

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

      this.activePath = { start, end, aisleXPercent: payload.aisleXPercent };
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
  padding: 24px;
  border-radius: 32px;
  background: rgba(255, 255, 255, 0.78);
  border: 1px solid rgba(148, 163, 184, 0.24);
  box-shadow: 0 22px 50px rgba(15, 23, 42, 0.08);
  backdrop-filter: blur(16px);
}

.section-heading {
  display: flex;
  align-items: end;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 20px;
}

.section-heading h3 {
  margin: 4px 0 0;
  font-size: clamp(1.4rem, 2.2vw, 2rem);
  color: #102a43;
}

.section-heading p {
  margin: 0;
  max-width: 460px;
  line-height: 1.7;
  color: #52606d;
}

.eyebrow {
  font-size: 0.8rem;
  font-weight: 700;
  color: #0f766e;
  text-transform: uppercase;
  letter-spacing: 0.12em;
}

.floors-container {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.floor-box {
  position: relative;
  border: 1px solid rgba(148, 163, 184, 0.22);
  border-radius: 28px;
  overflow: hidden;
  background: linear-gradient(
    180deg,
    rgba(255, 255, 255, 0.86),
    rgba(248, 250, 252, 0.94)
  );
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.75);
}

.floor-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 18px 22px 8px;
}

.floor-title {
  margin: 0;
  font-size: 1.2rem;
  font-weight: 800;
  color: #102a43;
}

.floor-subtitle {
  margin: 4px 0 0;
  color: #7b8794;
  font-size: 0.92rem;
}

.route-origin-pill {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 14px;
  border-radius: 999px;
  background: rgba(15, 118, 110, 0.1);
  color: #0f766e;
  font-size: 0.88rem;
  font-weight: 700;
}

.route-origin-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: #f59e0b;
  box-shadow: 0 0 0 6px rgba(245, 158, 11, 0.14);
}

.route-origin-anchor {
  position: absolute;
  bottom: 10px;
  left: 50%;
  width: 16px;
  height: 16px;
  border: 3px solid #ffffff;
  border-radius: 999px;
  transform: translateX(-50%);
  background: linear-gradient(135deg, #f59e0b, #facc15);
  box-shadow: 0 0 0 8px rgba(245, 158, 11, 0.18);
}

.ramp-connector {
  position: relative;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.ramp-bar {
  width: min(240px, 62%);
  height: 48px;
  border-radius: 999px;
  background: linear-gradient(
    120deg,
    rgba(148, 163, 184, 0.9),
    rgba(226, 232, 240, 0.95)
  );
  border: 1px solid rgba(148, 163, 184, 0.45);
  box-shadow: 0 10px 22px rgba(15, 23, 42, 0.12);
  transform: skewX(-14deg);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  color: #1f2937;
  font-weight: 700;
  letter-spacing: 0.02em;
  position: relative;
  overflow: hidden;
}

.ramp-bar::before {
  content: "";
  position: absolute;
  inset: 6px;
  border-radius: 999px;
  background: repeating-linear-gradient(
    135deg,
    rgba(255, 255, 255, 0.2),
    rgba(255, 255, 255, 0.2) 8px,
    rgba(255, 255, 255, 0.05) 8px,
    rgba(255, 255, 255, 0.05) 16px
  );
  opacity: 0.6;
}

.ramp-steps {
  position: relative;
  display: flex;
  align-items: center;
  gap: 6px;
  z-index: 1;
}

.ramp-steps span {
  width: 10px;
  height: 12px;
  border-radius: 6px;
  background: rgba(15, 23, 42, 0.3);
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.45),
    0 4px 8px rgba(15, 23, 42, 0.22);
  transform-origin: bottom center;
}

.ramp-steps span:nth-child(2) {
  height: 16px;
}

.ramp-steps span:nth-child(3) {
  height: 20px;
}

.ramp-steps span:nth-child(4) {
  height: 24px;
}

.ramp-text {
  position: relative;
  z-index: 1;
  font-size: 0.95rem;
}

.ramp-arrows {
  position: relative;
  display: flex;
  gap: 6px;
  z-index: 1;
}

.ramp-arrow {
  width: 0;
  height: 0;
  border-left: 8px solid transparent;
  border-right: 8px solid transparent;
  border-bottom: 16px solid #0f766e;
}

.parking-floors > .path-drawer {
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 50;
}

@media (max-width: 900px) {
  .parking-shell {
    padding: 18px;
    border-radius: 24px;
  }

  .section-heading,
  .floor-header {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>
