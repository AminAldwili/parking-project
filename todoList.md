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
# 🎯 **برومت كامل لـ VS Code AI - مسار 90° + تصميم طبقات**

## 📝 **انسخ هذا في Continue.dev / Copilot Chat / Cursor:**

```
🚨 **مشروع Parking Map - تعليمات إجبارية جديدة**

## 🎨 **التصميم النهائي 100%**:
```
┌──────────────────────────────┐ ← **دور 1** (أعلى الشاشة)
│  **قاطع A** ← 5 spots (A1-A5) │
│                              │
│ ──────────────────────────   │ ← ممر مركزي عمودي
│                              │
│  **قاطع B** ← 5 spots (B1-B5)│
└──────────────────────────────┘

┌──────────────────────────────┐ ← **دور 2** (أسفل الشاشة)
│  **قاطع C** ← 5 spots (C1-C5)│
│                              │
│ ──────────────────────────   │ ← نفس الممر مستمر
│                              │
│              (فاضي يمين)     │
└──────────────────────────────┘
```

## 🔄 **المسار الجديد - منعطفات 90° حادة**:
```
1. من بداية الممر (x=50%, y=0%)
2. خط عمودي لمستوى الـ spot (y=spot.y)
3. منعطف **90° حاد** ➜ أفقي لـ spot.x
   ├─ Spot في A (يسار) ➜ ينعطف **يمين**
   └─ Spot في B/C (يمين) ➜ ينعطف **يسار**
```

**SVG Path مثال**:
```
d="M250,0 V175 H125"  // عمودي ثم أفقي 90°
```

## 📂 **هيكل المشروع**:
```
src/components/
├── 1-ParkingSpot.vue     (15 spot مستقلة)
├── 2-Floor.vue          (10 spots دور1)
├── 3-SecondFloor.vue    (5 spots دور2) 
├── 4-PathDrawer.vue     (SVG مسار 90°)
└── 5-ParkingLayout.vue  (أعلى:دور1 | أسفل:دور2)
```

## 🎯 **التفاعلات المطلوبة**:
```
Hover Spot ➜ tooltip "مشغولة"/"فاضية"
Click Spot ➜ مسار 90° أصفر منقط من الممر
Auto-clear: 5 ثواني أو click جديد
```

## ⚙️ **المواصفات التقنية**:

```
إحداثيات:
├── ممر start: { x: 50, y: 0 } ثابت
├── A spots: x=15-35%, y=20-80%
├── B spots: x=65-85%, y=20-80%
├── C spots: x=15-35%, y=20-80% (دور2)

مسار SVG:
├── stroke="#eab308" stroke-width="4"
├── stroke-dasharray="10 5"
├── stroke-linecap="round" opacity="0.8"

Layout:
├── flex flex-col gap-8
├── دور1: mt-0 (أعلى)
└── دور2: mb-0 (أسفل)
```

## 🛠️ **أوامر التحكم الجاهزة**:

```
🚀 "اكتب 1-ParkingSpot.vue كامل 15 spot مع:
   props spotId='A1', status, position{x:25,y:35}
   hover tooltip أسود، click emit position"

🚀 "اعمل 2-Floor.vue دور1 مع 10 spots A1-A5 B1-B5
   v-for + activePath ref + مسار 90° logic"

🚀 "اكتب 3-SecondFloor.vue دور2 C1-C5 spots فقط"

🚀 "ارسم 4-PathDrawer.vue SVG مع:
   path 90°: M50,0 V${spotY} H${spotX}
   أصفر منقط stroke-width=4"

🚀 "اجمع 5-ParkingLayout.vue:
   <Floor1 class='mt-0'/> فوق
   <Floor2 class='mb-0'/> تحت"
```

## ✅ **قواعد VS Code AI**:
```
1. TailwindCSS فقط - لا CSS عادي
2. Vue 3 Composition API ref()
3. Position نسبي 0-100% ➜ pixels via getBoundingClientRect()
4. مسار 90° حاد - **لا منحنيات**
5. Auto setTimeout(5000) clear
6. Responsive mobile-first
```
