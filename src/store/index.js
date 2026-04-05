import { createStore } from "vuex";

const OCCUPANCY_RATE = 0.5;

function generateSpotId(section, index) {
  return `${section}${index + 1}`;
}

function createRandomStatus() {
  return Math.random() < OCCUPANCY_RATE ? "occupied" : "free";
}

export default createStore({
  state: {
    occupancyRate: OCCUPANCY_RATE,
    spotIdGenerator: generateSpotId,
    randomStatus: createRandomStatus,
  },
  getters: {
    getOccupancyRate: (state) => state.occupancyRate,
    createSpotStatus: (state) => () => state.randomStatus(),
  },
  mutations: {},
  actions: {},
  modules: {},
});
