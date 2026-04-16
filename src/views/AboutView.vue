<template>
  <div class="about">
    <div class="about-card">
      <div class="info-board">
        <div class="board-header">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="16" x2="12" y2="12" />
            <line x1="12" y1="8" x2="12.01" y2="8" />
          </svg>
          <span>About</span>
        </div>
        <div class="board-content">
          <h2>نموذج تجريبي لعرض المواقف والمسارات داخل مبنى متعدد الأدوار</h2>
          <p>
            هذه الصفحة توضّح أن المشروع صار بهوية بصرية موحدة، مع تتبع بصري
            للمسار يبدأ من الدور الأول ويتجه إلى الموقف المختار في أي دور.
          </p>
        </div>
      </div>

      <div class="features-grid">
        <div class="feature-item">
          <div class="feature-icon">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <polygon points="3 11 22 2 13 21 11 13 3 11" />
            </svg>
          </div>
          <h4>تتبع المسار</h4>
          <p>عرض مرئي للمسار من نقطة الدخول إلى الموقف</p>
        </div>

        <div class="feature-item">
          <div class="feature-icon">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <rect x="3" y="3" width="18" height="18" rx="2" />
              <path d="M9 17V7h4a3 3 0 0 1 0 6H9" />
            </svg>
          </div>
          <h4>إدارة المواقف</h4>
          <p>عرض حالة جميع المواقف في الوقت الفعلي</p>
        </div>

        <div class="feature-item">
          <div class="feature-icon">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
              <polyline points="9,22 9,12 15,12 15,22" />
            </svg>
          </div>
          <h4>أدوار متعددة</h4>
          <p>دعم عدة أدوار مع تصاعد سلس بينها</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.about {
  padding: 12px 0 24px;
}

.about-card {
  padding: 32px;
  border-radius: 24px;
  background: var(--asphalt-base);
  border: 1px solid var(--glass-border);
  box-shadow:
    0 20px 50px rgba(0, 0, 0, 0.35),
    inset 0 1px 0 rgba(255, 255, 255, 0.03);
}

.info-board {
  position: relative;
  padding: 24px;
  border-radius: 16px;
  background: var(--asphalt-light);
  border: 1px solid var(--aisle-border);
  margin-bottom: 28px;
}

.info-board::before {
  content: "";
  position: absolute;
  top: 0;
  right: 0;
  left: 0;
  height: 4px;
  background: linear-gradient(
    90deg,
    var(--accent-primary),
    var(--accent-secondary),
    var(--accent-primary)
  );
  border-radius: 16px 16px 0 0;
}

.board-header {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
  padding: 6px 14px;
  border-radius: 999px;
  background: var(--accent-glow);
  color: var(--accent-primary);
  font-size: var(--text-xs);
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.1em;
}

.board-header svg {
  width: 14px;
  height: 14px;
}

.board-content h2 {
  margin: 0 0 12px;
  font-size: clamp(1.1rem, 2vw, 1.4rem);
  font-weight: 700;
  color: var(--text-primary);
  line-height: 1.4;
}

.board-content p {
  margin: 0;
  color: var(--text-secondary);
  line-height: 1.8;
  font-size: var(--text-sm);
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
}

.feature-item {
  padding: 20px;
  border-radius: 16px;
  background: var(--asphalt-dark);
  border: 1px solid var(--glass-border);
  text-align: center;
  transition: all var(--duration-normal) var(--ease-out);
}

.feature-item:hover {
  transform: translateY(-4px);
  border-color: var(--aisle-border);
  box-shadow: var(--shadow-md);
}

.feature-icon {
  width: 48px;
  height: 48px;
  margin: 0 auto 12px;
  padding: 10px;
  border-radius: 12px;
  background: var(--accent-glow);
  color: var(--accent-primary);
}

.feature-icon svg {
  width: 100%;
  height: 100%;
}

.feature-item h4 {
  margin: 0 0 6px;
  font-size: var(--text-md);
  font-weight: 700;
  color: var(--text-primary);
}

.feature-item p {
  margin: 0;
  font-size: var(--text-sm);
  color: var(--text-tertiary);
}

@media (max-width: 768px) {
  .about-card {
    padding: 20px;
  }

  .info-board {
    padding: 18px;
  }

  .features-grid {
    grid-template-columns: 1fr;
  }
}
</style>
