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
          <stop offset="100%" stop-color="#fbbf24" />
        </linearGradient>
        <linearGradient id="rampGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="#fbbf24" />
          <stop offset="100%" stop-color="#f59e0b" />
        </linearGradient>
        <filter id="pathGlow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="8" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <filter id="rampGlow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="4" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      <path
        v-if="activePath.targetFloor === 2"
        :d="rampPathD"
        stroke="url(#rampGradient)"
        stroke-width="8"
        stroke-linecap="round"
        stroke-linejoin="round"
        fill="none"
        class="ramp-path-line"
        filter="url(#rampGlow)"
      />

      <path
        :d="pathD"
        stroke="url(#routeGradient)"
        stroke-width="6"
        stroke-linecap="round"
        stroke-linejoin="round"
        fill="none"
        class="path-line"
        filter="url(#pathGlow)"
      />

      <circle
        :cx="activePath.start.x"
        :cy="activePath.start.y"
        r="12"
        class="path-node start-node"
      />
      <circle
        :cx="activePath.end.x"
        :cy="activePath.end.y"
        r="10"
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
    rampPathD() {
      if (
        !this.activePath ||
        !this.activePath.rampRect ||
        !this.activePath.containerRect
      )
        return "";

      const containerRect = this.activePath.containerRect;
      const rampRect = this.activePath.rampRect;

      const rampCenterX =
        rampRect.left - containerRect.left + rampRect.width / 2;
      const rampTop = rampRect.top - containerRect.top;
      const rampBottom = rampRect.bottom - containerRect.top;

      const start = this.activePath.start;

      const x1 = start.x;
      const y1 = start.y;
      const x2 = rampCenterX;
      const y2 = rampTop + 20;
      const x3 = rampCenterX;
      const y3 = rampBottom - 20;
      const x4 = start.x;
      const y4 = start.y + (start.y < y3 ? 60 : -60);

      return `M ${x1} ${y1} L ${x2} ${y2} L ${x3} ${y3} L ${x4} ${y4}`;
    },
  },
};
</script>

<style scoped>
.path-drawer {
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 50;
}

.path-line {
  opacity: 0;
  animation: fade-in 400ms ease-out forwards;
}

.ramp-path-line {
  opacity: 0;
  animation: ramp-fade-in 300ms ease-out forwards;
}

@keyframes fade-in {
  to {
    opacity: 1;
  }
}

@keyframes ramp-fade-in {
  to {
    opacity: 0.9;
  }
}

.path-node {
  opacity: 0;
  transform-origin: center;
  transform: scale(0.5);
  animation: pop-in 300ms cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
}

.start-node {
  fill: var(--accent-orange);
  stroke: rgba(255, 255, 255, 0.5);
  stroke-width: 3;
  filter: drop-shadow(0 0 16px var(--accent-orange));
  animation-delay: 200ms;
}

.end-node {
  fill: var(--road-yellow);
  stroke: rgba(255, 255, 255, 0.5);
  stroke-width: 3;
  filter: drop-shadow(0 0 14px var(--road-yellow));
  animation-delay: 350ms;
}

@keyframes pop-in {
  to {
    opacity: 1;
    transform: scale(1);
  }
}
</style>
