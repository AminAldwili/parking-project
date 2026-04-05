<template>
  <div ref="container" class="floor-container" role="region">
    <div
      class="aisle-line"
      :style="{ left: aisleXPercent + '%' }"
      aria-hidden="true"
    >
      <div ref="aisleSurface" class="aisle-surface">
        <div class="aisle-center-line"></div>
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
          <span class="section-letter">{{ g.section }}</span>
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
            size: { width: 130, height: 75 },
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
  },
  beforeUnmount() {
    window.removeEventListener("resize", this.updateContainerSize.bind(this));
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
      this.resizeObserver = null;
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

@media (max-width: 768px) {
  .floor-container {
    min-height: 480px;
    padding: 50px 16px 20px;
  }

  .aisle-line {
    width: 50px;
  }

  .aisle-edge {
    width: 3px;
  }

  .spots-wrapper {
    inset: 50px 0 20px;
  }

  .spot-wrapper {
    padding: 22px 10px;
  }

  .group-label {
    min-width: 32px;
    padding: 3px 8px;
    font-size: 0.8rem;
    border-radius: 6px;
  }
}

@media (max-width: 480px) {
  .floor-container {
    min-height: 400px;
    padding: 44px 12px 16px;
  }

  .aisle-line {
    width: 40px;
  }

  .aisle-edge {
    width: 3px;
  }

  .spots-wrapper {
    inset: 44px 0 16px;
  }

  .spot-wrapper {
    padding: 18px 8px;
  }

  .group-label {
    min-width: 28px;
    padding: 2px 6px;
    font-size: 0.75rem;
    border-radius: 5px;
    top: 6px;
  }
}

@media (max-width: 360px) {
  .floor-container {
    min-height: auto;
    padding: 40px 10px 14px;
  }

  .aisle-line {
    display: none;
  }

  .spots-wrapper {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 14px;
    padding: 10px 0;
    inset: auto;
    position: relative;
  }

  .spot-wrapper {
    position: relative !important;
    left: auto !important;
    top: auto !important;
    transform: none;
    padding: 6px;
  }

  .group-labels {
    display: none;
  }
}
</style>
