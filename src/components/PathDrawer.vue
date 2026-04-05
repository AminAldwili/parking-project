<template>
  <div class="path-drawer" aria-hidden="true">
    <svg
      v-if="activePath && containerSize.width && containerSize.height"
      :width="containerSize.width"
      :height="containerSize.height"
      :viewBox="`0 0 ${containerSize.width} ${containerSize.height}`"
      preserveAspectRatio="none"
    >
      <defs>
        <linearGradient id="routeGradient" x1="0%" x2="100%" y1="0%" y2="0%">
          <stop offset="0%" stop-color="#f59e0b" />
          <stop offset="100%" stop-color="#fde047" />
        </linearGradient>
      </defs>
      <path
        :d="pathD"
        stroke="url(#routeGradient)"
        stroke-width="4"
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-dasharray="12 8"
        fill="none"
        opacity="0.9"
        class="path-line"
      />
      <circle
        :cx="activePath.start.x"
        :cy="activePath.start.y"
        r="8"
        class="path-node start-node"
      />
      <circle
        :cx="activePath.end.x"
        :cy="activePath.end.y"
        r="7"
        class="path-node end-node"
      />
    </svg>
  </div>
</template>

<script>
export default {
  name: "PathDrawer",
  props: {
    activePath: { type: Object, default: null },
    containerSize: { type: Object, default: () => ({ width: 0, height: 0 }) },
  },
  computed: {
    pathD() {
      if (!this.activePath) return "";
      const s = this.activePath.start;
      const e = this.activePath.end;
      return `M ${s.x} ${s.y} L ${s.x} ${e.y} L ${e.x} ${e.y}`;
    },
  },
};
</script>

<style scoped>
.path-drawer {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.path-line {
  filter: drop-shadow(0 0 10px rgba(245, 158, 11, 0.45));
  transition: opacity 160ms ease-in-out, stroke-dashoffset 200ms ease-in-out;
  opacity: 0;
  animation: draw 200ms forwards ease-in-out;
}

.path-node {
  stroke: rgba(255, 255, 255, 0.9);
  stroke-width: 3;
  filter: drop-shadow(0 0 10px rgba(245, 158, 11, 0.35));
  animation: pulse 900ms ease-out;
}

.start-node {
  fill: #f59e0b;
}

.end-node {
  fill: #fde047;
}

@keyframes draw {
  from {
    opacity: 0;
    stroke-dashoffset: 1000;
  }
  to {
    opacity: 0.9;
    stroke-dashoffset: 0;
  }
}

@keyframes pulse {
  from {
    transform: scale(0.85);
    opacity: 0.35;
  }
  to {
    transform: scale(1);
    opacity: 1;
  }
}
</style>
