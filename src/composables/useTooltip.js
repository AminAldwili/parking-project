import { ref } from "vue";
import { TOOLTIP_AUTO_DISMISS_MS } from "@/constants";

/**
 * Global tooltip state - shared singleton across all spot instances.
 * Uses module-level ref to ensure only one tooltip is visible at a time.
 */
const activeTooltip = ref(null);
let tooltipTimer = null;

/**
 * Composable for managing the global frozen tooltip.
 * Tooltip appears on hover/touch, stays frozen in place, auto-dismisses after 5s.
 */
export function useTooltip() {
  /**
   * Shows tooltip at fixed screen position.
   * Clears any existing tooltip and timer, then sets new position.
   * Auto-dismisses after 5 seconds.
   *
   * @param {string|number} spotId - The spot identifier
   * @param {number} x - X coordinate (center of spot, viewport-relative)
   * @param {number} y - Y coordinate (bottom of spot, viewport-relative)
   * @param {string} text - Tooltip text to display
   */
  function showTooltip(spotId, x, y, text) {
    if (tooltipTimer) {
      clearTimeout(tooltipTimer);
      tooltipTimer = null;
    }

    activeTooltip.value = { spotId, x, y, text };

    tooltipTimer = setTimeout(() => {
      activeTooltip.value = null;
      tooltipTimer = null;
    }, TOOLTIP_AUTO_DISMISS_MS);
  }

  /**
   * Clears the tooltip and cancels the timer.
   */
  function clearTooltip() {
    if (tooltipTimer) {
      clearTimeout(tooltipTimer);
      tooltipTimer = null;
    }
    activeTooltip.value = null;
  }

  return { activeTooltip, showTooltip, clearTooltip };
}
