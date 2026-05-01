# Smart Parking - Project Documentation

## Overview

Smart Parking is a Vue 3 + Vuex + Firebase real-time parking management system with Arabic RTL support. It displays a two-floor parking layout with interactive spot navigation paths.

---

## Project Structure

```
parking-project/
├── src/
│   ├── App.vue                      # Main shell + theme provider
│   ├── main.js                      # App entry point
│   ├── components/
│   │   ├── ParkingSpot.vue          # Individual parking spot (543 lines)
│   │   ├── ParkingFloor.vue         # Single floor container (306 lines)
│   │   ├── ParkingFloors.vue       # Main layout with 2 floors (929 lines)
│   │   ├── PathDrawer.vue         # SVG navigation path (255 lines)
│   │   └── ThemeToggle.vue        # Dark/light theme switch
│   ├── store/
│   │   └── index.js               # Vuex + Firebase store (123 lines)
│   ├── firebase/
│   │   └── config.js            # Firebase configuration
│   └── router/                    # Vue Router configuration
```

---

## Components

### 1. ParkingSpot.vue

The smallest unit - a single parking spot.

**Props:**
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `spotId` | String/Number | required | Unique identifier (e.g., "A1") |
| `status` | Number | 0 | 0=free, 1=occupied, 2=reserved, 3=maintenance |
| `position` | Object | `{x:0, y:0}` | Percentage position {x, y} |
| `size` | Object | `{width:130, height:75}` | Dimensions in pixels |
| `isActive` | Boolean | false | Whether this spot is currently highlighted |

**Status Mapping:**
```javascript
0: { class: "is-free", label: "متاحة" }        // Green
1: { class: "is-occupied", label: "مشغولة" }    // Red
2: { class: "is-reserved", label: "محجوز" }    // Orange
3: { class: "is-maintenance", label: "صيانة" }    // Gray
```

**Events:**
- `spot-click` - Emits `{spotId, position}` on click

**Features:**
- Hover tooltip with status label (teleported to body)
- Touch support for mobile
- Keyboard accessibility (Enter/Space)
- Glow effects and animations
- Dark/light theme variants

---

### 2. ParkingFloor.vue

A single floor level containing multiple parking spots.

**Props:**
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `floor` | String/Number | 1 | Floor identifier (1 or 2) |
| `spotsProp` | Array | null | Array of spot objects |
| `aisleXPercent` | Number | 50 | Center aisle position (%) |
| `activeSpotId` | String | null | Currently active spot |

**Events:**
- `request-path` - Emits when a spot is clicked
- `floor-resize` - Emits when floor dimensions change

**Layout:**
- Central aisle (50% from left)
- Section labels (A, B for Floor 1; C for Floor 2)
- Spot groups positioned by percentage

---

### 3. ParkingFloors.vue

Main container combining both floors with ramp connector.

**Structure:**
```
Floors Container:
├── PathDrawer (SVG overlay)
├── Section Header
├── Floor 2 (Section C - Top)
├── Ramp Connector (Floor 1 ↔ Floor 2)
└── Floor 1 (Sections A & B - Bottom)
```

**Key Features:**
- Real-time spot data from Vuex store
- Responsive spot sizing based on floor width
- Route origin indicator at bottom center
- Ramp animations when navigating to Floor 2

**Path Drawing:**
- Start point: Bottom center (aisleXPercent, bottom)
- End point: Clicked spot position
- L-shaped path: Vertical then horizontal
- Auto-clear after 5 seconds
- Ramp path for Floor 2 destinations

---

### 4. PathDrawer.vue

SVG-based navigation path overlay.

**Visual Style:**
- Stroke: Linear gradient (#f59e0b → #fbbf24)
- Stroke width: 4-6px (responsive)
- Line cap: Round
- Glow filter effect
- Animated node endpoints

**Path Calculation:**
```javascript
// L-shaped path
pathD = `M ${start.x} ${start.y} L ${start.x} ${end.y} L ${end.x} ${end.y}`
```

---

## State Management (Vuex)

### Store Structure

```javascript
state: {
  spots: {
    floor1: { A1: 0, A2: 0, ..., B1: 0, ... },  // Sections A & B
    floor2: { C1: 0, C2: 0, ... }                  // Section C
  },
  theme: "dark" | "light",
  firebaseInitialized: false
}
```

### Getters
- `getSpots` - All spots object
- `getFloor1Spots` - Floor 1 spots only
- `getFloor2Spots` - Floor 2 spots only
- `getSpotStatus(floor, spot)` - Single spot status
- `currentTheme` - Current theme value
- `isFirebaseInitialized` - Firebase sync status

### Mutations
- `SET_SPOTS` - Update spots from Firebase
- `SET_THEME` - Change theme
- `SET_FIREBASE_INITIALIZED` - Set Firebase ready flag

### Actions
- `initSpots` - Subscribe to Firebase `Garage` ref
- `toggleTheme` - Switch dark/light
- `initTheme` - Set initial theme from system preference

---

## Firebase Schema

```
Garage/
├── Floor1/
│   ├── A1: { status: 0 }
│   ├── A2: { status: 1 }
│   ├── ...
│   └── A5: { status: 3 }
├── Floor2/
│   ├── B1: { status: 0 }
│   └── ...
└── Floor3/
    ├── C1: { status: 0 }
    └── ...
```

**Status Values:**
- `0` = Available (Free)
- `1` = Occupied
- `2` = Reserved
- `3` = Maintenance

---

## Theme System

### CSS Custom Properties (`:root`)

**Colors - Dark:**
- `--asphalt-dark`: #0f1419 (background)
- `--asphalt-base`: #1a1f26
- `--spot-free`: #10b981 (green)
- `--spot-occupied`: #ef4444 (red)
- `--accent-primary`: #0ea5e9 (blue)
- `--accent-gold`: #f59e0b (path/navigation)

**Colors - Light:**
- `--asphalt-dark`: #f1f5f9
- `--asphalt-base`: #ffffff
- `--spot-free`: #059669
- `--spot-occupied`: #dc2626
- `--accent-primary`: #0284c7

**Design Tokens:**
- Spacing: `--space-xs` through `--space-2xl` (fluid with clamp)
- Typography: `--text-xs` through `--text-2xl`
- Radius: `--radius-sm` through `--radius-xl`
- Transitions: `--duration-fast`, `--duration-normal`, `--duration-slow`

---

## How It Works

### 1. App Startup

```
main.js → App.vue (mount)
       → store.dispatch('initTheme')
       → store.dispatch('initSpots') → Firebase listener
```

### 2. Spot Click Flow

```
User clicks ParkingSpot
    ↓
ParkingSpot emits 'spot-click' {spotId, position}
    ↓
ParkingFloor handles → emits 'request-path'
    ↓
ParkingFloors calculates path coordinates
    ↓
PathDrawer renders SVG with animation
    ↓
Auto-clear after 5000ms
```

### 3. Firebase Sync

```
Firebase onValue listener triggered
    ↓
parseFirebaseData() processes snapshot
    ↓
commit('SET_SPOTS', {bottomFloor, topFloor})
    ↓
Getters update → Components reactively update
```

---

## Responsive Behavior

**Breakpoints:**
- Mobile: < 480px
- Tablet: 480-768px
- Desktop: > 768px

**Fluid Sizing:**
All dimensions use `clamp()` for smooth scaling across viewports.

---

## Accessibility

- ARIA labels on interactive elements
- Keyboard navigation (Tab, Enter, Space)
- Focus visible rings
- Reduced motion support (`prefers-reduced-motion`)
- Screen reader friendly tooltips

---

## Dependencies

```json
{
  "vue": "^3.x",
  "vuex": "^4.x",
  "vue-router": "^4.x",
  "firebase": "^10.x"
}
```

---

## Development Commands

```bash
npm run dev      # Start dev server
npm run build   # Production build
npm run preview # Preview production build
```

---

## File Statistics

| File | Lines | Purpose |
|------|-------|---------|
| ParkingSpot.vue | 543 | Individual spot component |
| ParkingFloor.vue | 306 | Floor container |
| ParkingFloors.vue | 929 | Main layout |
| PathDrawer.vue | 255 | SVG path rendering |
| store/index.js | 123 | Vuex + Firebase |
| App.vue | 551 | Shell + theme |
| **Total** | **2707** | Core application |