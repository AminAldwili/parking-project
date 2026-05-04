<template>
  <Teleport to="body">
    <Transition name="tooltip-fade">
      <div
        v-if="activeTooltip"
        class="global-tooltip"
        :style="{
          position: 'fixed',
          left: `${activeTooltip.x}px`,
          top: `${activeTooltip.y + 12}px`,
          transform: 'translateX(-50%)',
        }"
      >
        {{ activeTooltip.text }}
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { onMounted, onUnmounted } from "vue";
import { useTooltip } from "@/composables/useTooltip";

const { activeTooltip, clearTooltip } = useTooltip();

onMounted(() => {
  window.addEventListener("scroll", clearTooltip, true);
});

onUnmounted(() => {
  window.removeEventListener("scroll", clearTooltip, true);
});
</script>

<style>
/* Global scope - not scoped, since teleported to body */
.global-tooltip {
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
  will-change: transform;
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
</style>
