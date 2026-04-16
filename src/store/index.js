import { createStore } from "vuex";

const OCCUPANCY_RATE = 0.5;

function generateSpotId(section, index) {
  return `${section}${index + 1}`;
}

function createRandomStatus() {
  return Math.random() < OCCUPANCY_RATE ? "occupied" : "free";
}

function getInitialTheme() {
  if (typeof window !== "undefined" && window.matchMedia) {
    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  }
  return "dark";
}

export default createStore({
  state: {
    occupancyRate: OCCUPANCY_RATE,
    spotIdGenerator: generateSpotId,
    randomStatus: createRandomStatus,
    theme: getInitialTheme(),
  },
  getters: {
    getOccupancyRate: (state) => state.occupancyRate,
    createSpotStatus: (state) => () => state.randomStatus(),
    isDark: (state) => state.theme === "dark",
    currentTheme: (state) => state.theme,
  },
  mutations: {
    SET_THEME(state, theme) {
      state.theme = theme;
    },
  },
  actions: {
    toggleTheme({ commit, state }) {
      const newTheme = state.theme === "dark" ? "light" : "dark";
      commit("SET_THEME", newTheme);
    },
    setTheme({ commit }, theme) {
      commit("SET_THEME", theme);
    },
    initTheme({ commit, dispatch }) {
      const theme = getInitialTheme();
      commit("SET_THEME", theme);
      if (typeof window !== "undefined" && window.matchMedia) {
        const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
        mediaQuery.addEventListener("change", (e) => {
          dispatch("setTheme", e.matches ? "dark" : "light");
        });
      }
    },
  },
  modules: {},
});
