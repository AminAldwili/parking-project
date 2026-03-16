# ToDO LIst

```src/
├── components/
│ ├── 1-ParkingSpot.vue ← الأولى (الأساسي)
│ ├── 2-Floor.vue ← الثانية (الأب)
│ ├── 3-PathDrawer.vue ← الثالثة (المسار)
│ └── 4-ParkingFloors.vue ← الرابعة (الجمع)

```

## ✅ **TODO List (الترتيب الإجباري)**

### **1️⃣ ParkingSpot.vue** - **أولاً**

```

✅ Props: spotId, status, position, size
✅ Hover tooltip "مشغولة/فاضية"
✅ Click emit مع position
✅ ألوان: أخضر/أحمر
✅ Responsive 120x80px

```

### **2️⃣ Floor.vue** - **ثانياً**

```

✅ v-for 15 spot من array
✅ activePath state management
✅ @spot-click ➜ draw path
✅ Tailwind container 100vh

```

### **3️⃣ PathDrawer.vue** - **ثالثاً**

```

✅ SVG overlay absolute
✅ path أصفر من ممر لـ spot
✅ stroke-width 4px منقّط
✅ auto-clear 5 ثواني

```

### **4️⃣ ParkingFloors.vue** - **رابعاً**

```

✅ يجمع Floor دور 1 + دور 2
✅ ممر مستمر بين الدورين
✅ قاطع A/B (دور1) + C (دور2)
✅ responsive stacking

```

---

## 🔧 **التفاصيل التنفيذية**

### **1️⃣ ParkingSpot.vue**

```

📍 الموقع: src/components/1-ParkingSpot.vue
🎯 المهام:
├─ div relative position container
├─ div spot box :class="statusClass"
├─ v-if tooltip عند hover
├─ @mouseenter/@mouseleave/@click
├─ emit('spot-click', {spotId, position})
└─ Tailwind: w-30 h-20 rounded-lg

🎨 المميزات:
├─ أخضر #4ade80 (فاضي)
├─ أحمر #ef4444 (مشغول)
├─ tooltip أسود شفاف z-50
└─ hover:scale-105 transition

```

### **2️⃣ Floor.vue**

```

📍 الموقع: src/components/2-Floor.vue
🎯 المهام:
├─ const activePath = ref(null)
├─ const spots = ref([...15 spots])
├─ <ParkingSpot v-for="spot in spots"
│ :key="spot.id"
│ @spot-click="drawPath"
├─ <PathDrawer :active-path="activePath" />
└─ div h-screen w-full relative

🎨 المميزات:
├─ position نسبي 0-100%
├─ ممر start ثابت x=50 y=0
├─ reactive path updates
└─ clearPath() بعد 5s

```

### **3️⃣ PathDrawer.vue**

```

📍 الموقع: src/components/3-PathDrawer.vue
🎯 المهام:
├─ svg absolute top-0 left-0 w-full h-full
├─ path v-if="activePath"
│ :d="`M${startX},${startY} L${endX},${endY}`"
├─ stroke="#eab308" stroke-width="4"
├─ stroke-dasharray="10 5" opacity-80
└─ animate entrance 300ms

🎨 المميزات:
├─ خط منقّط أصفر ذهبي
├─ stroke-linecap round
├─ pointer-events-none
└─ smooth disappear

```

### **4️⃣ ParkingFloors.vue**

```

📍 الموقع: src/components/4-ParkingFloors.vue
🎯 المهام:
├─ <Floor floor="1" :spots="floor1Spots" />
├─ <Floor floor="2" :spots="floor2Spots" />
├─ ممر مستمر بين الدورين
├─ flex flex-col md:flex-row gap-4
└─ App.vue ➜ <ParkingFloors />

🎨 المميزات:
├─ دور1: A(5)+B(5) spots
├─ دور2: C(5) spots فقط
├─ ممر متّصل بصرياً
└─ mobile stack / desktop side-by-side

```

---

## 🚀 **ترتيب التنفيذ الإجباري**

```

1. اعمل 1-ParkingSpot.vue ➜ test hover+click
2. اعمل 2-Floor.vue ➜ test مع 3 spots
3. اعمل 3-PathDrawer.vue ➜ test المسار
4. اعمل 4-ParkingFloors.vue ➜ النسخة الكاملة

```

**كل ملف لوحده يشتغل + يختبر قبل اللي بعده.**

```

```

```

```

```

```
