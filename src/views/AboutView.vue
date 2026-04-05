<template>
  <div class="about">
    <div class="about-card">
      <div class="info-board">
        <div class="board-header">
          <span class="board-icon">ℹ️</span>
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
            >
              <path
                d="M12 22s-8-4.5-8-11.8A8 8 0 0 1 12 2a8 8 0 0 1 8 8.2c0 7.3-8 11.8-8 11.8z"
              />
              <circle cx="12" cy="10" r="3" />
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
  border: 1px solid rgba(245, 158, 11, 0.2);
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
    var(--accent-orange),
    var(--road-yellow),
    var(--accent-orange)
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
  background: rgba(245, 158, 11, 0.15);
  color: var(--accent-orange);
  font-size: 0.8rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.1em;
}

.board-icon {
  font-size: 0.9rem;
}

.board-content h2 {
  margin: 0 0 12px;
  font-size: 1.3rem;
  font-weight: 800;
  color: var(--road-white);
}

.board-content p {
  margin: 0;
  color: rgba(241, 245, 249, 0.65);
  line-height: 1.8;
  font-size: 0.95rem;
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
  transition: all 200ms ease;
}

.feature-item:hover {
  transform: translateY(-4px);
  border-color: rgba(255, 255, 255, 0.1);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
}

.feature-icon {
  width: 48px;
  height: 48px;
  margin: 0 auto 12px;
  padding: 10px;
  border-radius: 12px;
  background: rgba(245, 158, 11, 0.1);
  color: var(--accent-orange);
}

.feature-icon svg {
  width: 100%;
  height: 100%;
}

.feature-item h4 {
  margin: 0 0 6px;
  font-size: 1rem;
  font-weight: 700;
  color: var(--road-white);
}

.feature-item p {
  margin: 0;
  font-size: 0.85rem;
  color: rgba(241, 245, 249, 0.5);
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
