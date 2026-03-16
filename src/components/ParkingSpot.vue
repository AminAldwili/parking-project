<!-- eslint-disable prettier/prettier -->
<template>
  <div
    class="relative inline-block"
    @mouseenter="isHover = true"
    @mouseleave="isHover = false"
  >
    <div
      class="rounded-lg flex items-center justify-center cursor-pointer transition-transform duration-150 hover:scale-105"
      :class="statusClass"
      :style="spotStyle"
      role="button"
      tabindex="0"
      :aria-pressed="status === 'occupied'"
      @click="onClick"
      @keydown.enter="onClick"
    >
      <span class="select-none">{{ spotId }}</span>
    </div>

    <div
      v-if="isHover"
      class="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded z-50 pointer-events-none"
      aria-hidden="true"
    >
      {{ status === "occupied" ? "مشغولة" : "فاضية" }}
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
      return this.status === "free"
        ? "bg-[#4ade80] text-black"
        : "bg-[#ef4444] text-white";
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
/* sizing handled by inline styles from props.size */
</style>
