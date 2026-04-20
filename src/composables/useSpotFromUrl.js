import { computed } from "vue";
import { useRoute } from "vue-router";

export function useSpotFromUrl() {
  const route = useRoute();

  const slotParam = computed(() => {
    const slot = route.query.slot;
    return slot || null;
  });

  const cleanSpotId = computed(() => {
    if (!slotParam.value) return null;
    return slotParam.value.split(" ")[0];
  });

  const targetFloor = computed(() => {
    if (!cleanSpotId.value) return null;
    const prefix = cleanSpotId.value.charAt(0).toUpperCase();
    if (prefix === "A" || prefix === "B") return 1;
    if (prefix === "C") return 2;
    return null;
  });

  const hasSlotParam = computed(() => !!slotParam.value);

  return {
    slotParam,
    cleanSpotId,
    targetFloor,
    hasSlotParam
  };
}