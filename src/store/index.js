import { createStore } from "vuex";
import { database, ref, onValue } from "../firebase/config";

const FIREBASE_FLOOR1_SPOTS = {
  A1: 0, A2: 0, A3: 0, A4: 0, A5: 3
};

const FIREBASE_FLOOR2_SPOTS = {
  B1: 0, B2: 0, B3: 0, B4: 0, B5: 0
};

const FIREBASE_FLOOR3_SPOTS = {
  C1: 0, C2: 0, C3: 0, C4: 0, C5: 0
};

function getInitialTheme() {
  if (typeof window !== "undefined" && window.matchMedia) {
    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  }
  return "dark";
}

function parseFirebaseData(snapshot) {
  const data = snapshot.val(); // البيانات هنا هي محتويات Garage مباشرة
  console.log(" Firebase raw data inside parse:", data);

  const bottomFloor = {};
  const topFloor = {};

  if (data) {
    // التحقق من Floor1 (A1-A4)
    if (data.Floor1) {
      Object.keys(FIREBASE_FLOOR1_SPOTS).forEach(spot => {
        const spotData = data.Floor1[spot];
        bottomFloor[spot] = (spotData && spotData.status !== undefined) ? spotData.status : 0;
      });
    }

    // التحقق من Floor2 (B1-B5)
    if (data.Floor2) {
      Object.keys(FIREBASE_FLOOR2_SPOTS).forEach(spot => {
        const spotData = data.Floor2[spot];
        bottomFloor[spot] = (spotData && spotData.status !== undefined) ? spotData.status : 0;
      });
    }

    // التحقق من Floor3 (C1-C5)
    if (data.Floor3) {
      Object.keys(FIREBASE_FLOOR3_SPOTS).forEach(spot => {
        const spotData = data.Floor3[spot];
        topFloor[spot] = (spotData && spotData.status !== undefined) ? spotData.status : 0;
      });
    }
  }

  return { bottomFloor, topFloor };
}

export default createStore({
  state: {
    spots: {
      floor1: { ...FIREBASE_FLOOR1_SPOTS, ...FIREBASE_FLOOR2_SPOTS },
      floor2: { ...FIREBASE_FLOOR3_SPOTS }
    },
    theme: getInitialTheme(),
    firebaseInitialized: false
  },
  getters: {
    getSpots: (state) => state.spots,
    getFloor1Spots: (state) => state.spots.floor1,
    getFloor2Spots: (state) => state.spots.floor2,
    getSpotStatus: (state) => (floor, spot) => {
      return state.spots[floor]?.[spot] ?? 0;
    },
    isDark: (state) => state.theme === "dark",
    currentTheme: (state) => state.theme,
    isFirebaseInitialized: (state) => state.firebaseInitialized
  },
  mutations: {
    SET_SPOTS(state, { bottomFloor, topFloor }) {
      state.spots.floor1 = { ...FIREBASE_FLOOR1_SPOTS, ...FIREBASE_FLOOR2_SPOTS, ...bottomFloor };
      state.spots.floor2 = { ...FIREBASE_FLOOR3_SPOTS, ...topFloor };
    },
    SET_THEME(state, theme) {
      state.theme = theme;
    },
    SET_FIREBASE_INITIALIZED(state, value) {
      state.firebaseInitialized = value;
    }
  },
  actions: {
    initSpots({ commit }) {
      const garageRef = ref(database, "Garage");

      onValue(garageRef, (snapshot) => {
        console.log("🔥 Firebase listener triggered!");
        const { bottomFloor, topFloor } = parseFirebaseData(snapshot);
        commit("SET_SPOTS", { bottomFloor, topFloor });
        commit("SET_FIREBASE_INITIALIZED", true);
      });
    },
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
    }
  },
  modules: {}
});