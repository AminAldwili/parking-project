import { onMounted, onUnmounted } from "vue";

/**
 * Composable that sets up a ResizeObserver on a given element.
 * Automatically cleans up on component unmount.
 *
 * @param {import('vue').Ref<HTMLElement|null>} elementRef - The element to observe
 * @param {Function} callback - Called on resize with (entries, observer)
 */
export function useResizeObserver(elementRef, callback) {
  let observer = null;

  onMounted(() => {
    const el = elementRef.value;
    if (el && window.ResizeObserver) {
      observer = new ResizeObserver(callback);
      observer.observe(el);
    }
  });

  onUnmounted(() => {
    if (observer) {
      observer.disconnect();
      observer = null;
    }
  });
}

/**
 * Composable that registers a window resize listener.
 * Automatically cleans up on component unmount.
 *
 * @param {Function} callback - Called on window resize
 */
export function useWindowResize(callback) {
  onMounted(() => {
    window.addEventListener("resize", callback);
  });

  onUnmounted(() => {
    window.removeEventListener("resize", callback);
  });
}
