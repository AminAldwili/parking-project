<template>
  <div ref="container" class="floor-container" role="region">
    <div
      class="aisle-line"
      :style="{ left: aisleXPercent + '%' }"
      aria-hidden="true"
    >
      <div ref="aisleSurface" class="aisle-surface">
        <span class="aisle-label">المسار المركزي</span>
        <div class="aisle-dashes">
          <span v-for="idx in dashCount" :key="idx" class="aisle-dash"></span>
        </div>
      </div>
    </div>
    <div class="spots-wrapper">
      <div class="group-labels">
        <div
          v-for="g in groupList"
          :key="g.section"
          class="group-label"
          :style="{ left: g.x + '%' }"
        >
          {{ g.section }}
        </div>
      </div>
      <div
        v-for="spot in spots"
        :key="spot.id"
        class="spot-wrapper"
        :style="{ left: spot.x + '%', top: spot.y + '%' }"
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

<script>
import ParkingSpot from "@/components/ParkingSpot.vue";

export default {
  name: "ParkingFloor",
  components: { ParkingSpot },
  props: {
    floor: { type: [String, Number], default: 1 },
    spotsProp: { type: Array, default: null },
    aisleXPercent: { type: Number, default: 50 },
  },
  data() {
    return {
      spots: [],
      resizeObserver: null,
      spotRefs: {},
      dashCount: 3,
      aisleObserver: null,
    };
  },
  computed: {
    groupList() {
      const map = {};
      (this.spots || []).forEach((s) => {
        if (!s || !s.section) return;
        if (!map[s.section]) map[s.section] = { section: s.section, x: s.x };
      });
      return Object.values(map);
    },
  },
  mounted() {
    if (this.spotsProp && this.spotsProp.length) {
      this.spots = this.spotsProp;
    } else {
      const cols = 5;
      const rows = 3;
      const arr = [];
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const index = r * cols + c;
          const id = `${this.floor}-${index + 1}`;
          const x = (c + 0.5) * (100 / cols);
          const y = (r + 0.5) * (100 / rows);
          let section = "C";
          if (Number(this.floor) === 1) {
            section = index < 5 ? "A" : "B";
          }
          arr.push({
            id,
            section,
            status: Math.random() > 0.5 ? "occupied" : "free",
            x,
            y,
            size: { width: 120, height: 80 },
          });
        }
      }
      this.spots = arr;
    }

    this.updateContainerSize();
    window.addEventListener("resize", this.updateContainerSize.bind(this));

    this.$nextTick(() => {
      const el = this.$refs.container;
      if (el && window.ResizeObserver) {
        this.resizeObserver = new ResizeObserver(() =>
          this.updateContainerSize(),
        );
        this.resizeObserver.observe(el);
      }
    });

    this.$nextTick(() => {
      const surface = this.$refs.aisleSurface;
      if (surface && window.ResizeObserver) {
        this.aisleObserver = new ResizeObserver(() => this.updateDashCount());
        this.aisleObserver.observe(surface);
      }
      this.updateDashCount();
    });
  },
  beforeUnmount() {
    window.removeEventListener("resize", this.updateContainerSize);
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
      this.resizeObserver = null;
    }
    if (this.aisleObserver) {
      this.aisleObserver.disconnect();
      this.aisleObserver = null;
    }
  },
  methods: {
    setSpotRef(id, el) {
      if (el) {
        this.spotRefs[id] = el;
      } else {
        delete this.spotRefs[id];
      }
    },
    updateContainerSize() {
      this.$nextTick(() => {
        const el = this.$refs.container;
        if (el) {
          const rect = el.getBoundingClientRect();
          this.$emit("floor-resize", { floor: this.floor, rect });
        }
      });
    },
    updateDashCount() {
      this.$nextTick(() => {
        const surface = this.$refs.aisleSurface;
        if (!surface) return;
        const rect = surface.getBoundingClientRect();
        const dashSize = 32;
        const dashGap = 22;
        const dashArea = rect.height * 0.7;
        const usable = Math.max(dashArea, dashSize);
        this.dashCount = Math.max(
          3,
          Math.floor((usable + dashGap) / (dashSize + dashGap)),
        );
      });
    },
    onSpotClick(payload) {
      const floorRect = this.$refs.container?.getBoundingClientRect();
      let spotCenter = null;
      if (floorRect) {
        const spotEl = this.spotRefs[payload.spotId];
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
      this.$emit("request-path", {
        floor: this.floor,
        spotCenter,
        aisleXPercent: this.aisleXPercent,
        floorRect,
      });
    },
  },
};
</script>

<style scoped>
.floor-container {
  position: relative;
  width: 100%;
  min-height: 620px;
  overflow: hidden;
  padding: 52px 24px 28px;
  background: linear-gradient(
    180deg,
    rgba(239, 246, 255, 0.86),
    rgba(226, 232, 240, 0.9)
  );
}

.spots-wrapper {
  position: absolute;
  inset: 52px 0 28px;
}

.spot-wrapper {
  position: absolute;
  transform: translate(-50%, -50%);
  padding: 16px;
}

.aisle-line {
  position: absolute;
  top: 0;
  bottom: 0;
  width: 82px;
  transform: translateX(-50%);
  z-index: 0;
  display: flex;
  justify-content: center;
  pointer-events: none;
}

.aisle-surface {
  position: relative;
  width: 70px;
  height: 100%;
  background: linear-gradient(180deg, #1f2937, #0f172a);
  border-radius: 18px;
  box-shadow:
    inset 0 0 0 2px rgba(148, 163, 184, 0.25),
    inset 0 10px 20px rgba(255, 255, 255, 0.08);
  display: block;
  padding: 0;
}

.aisle-label {
  display: none;
}

.aisle-dashes {
  position: absolute;
  top: 15%;
  left: 50%;
  height: 70%;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
}

.aisle-dash {
  width: 8px;
  height: 32px;
  border-radius: 999px;
  background: rgba(248, 250, 252, 0.75);
  box-shadow: 0 6px 14px rgba(15, 23, 42, 0.2);
}

.group-labels {
  position: absolute;
  inset: 0 0 auto 0;
  pointer-events: none;
}

.group-label {
  position: absolute;
  top: 8px;
  transform: translateX(-50%);
  min-width: 44px;
  text-align: center;
  background: rgba(255, 255, 255, 0.9);
  color: #102a43;
  padding: 6px 10px;
  border-radius: 999px;
  font-weight: 800;
  font-size: 12px;
  box-shadow: 0 12px 24px rgba(15, 23, 42, 0.08);
}

@media (max-width: 768px) {
  .floor-container {
    min-height: 820px;
    padding: 52px 12px 24px;
  }

  .spots-wrapper {
    inset: 52px 0 24px;
  }
}
</style>
