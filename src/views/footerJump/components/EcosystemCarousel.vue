<template>
  <section class="ecosystem">
    <div class="ecosystem__header">
      <h2 class="ecosystem__title">{{ title }}</h2>
      <div class="ecosystem__nav">
        <button class="eco-btn eco-btn--prev" :class="{ disabled: currentPage === 0 }" aria-label="上一页"
          @click="prevPage"></button>
        <button class="eco-btn eco-btn--next" :class="{ disabled: currentPage >= totalPages - 1 }" aria-label="下一页"
          @click="nextPage"></button>
      </div>
    </div>

    <div class="eco-grid">
      <div class="eco-card" v-for="(item, idx) in visibleItems" :key="idx">
        <div class="eco-card__icon">
          <img v-if="item.icon" :src="item.icon" alt="" />
          <div v-else class="icon-placeholder"></div>
        </div>
        <div class="eco-card__body">
          <div class="eco-card__title">{{ item.title }}</div>
          <div class="eco-card__desc">{{ item.desc }}</div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  name: 'EcosystemCarousel',
  props: {
    title: {
      type: String,
      default: '我们的生态'
    },
    items: {
      type: Array,
      default: () => []
    },
    perPage: {
      type: Number,
      default: 6 // 3列 × 2行
    }
  },
  data() {
    return {
      currentPage: 0
    };
  },
  computed: {
    pages() {
      const src = Array.isArray(this.items) && this.items.length ? this.items : [];
      const groups = [];
      for (let i = 0; i < src.length; i += this.perPage) {
        groups.push(src.slice(i, i + this.perPage));
      }
      return groups.length ? groups : [[]];
    },
    totalPages() {
      return this.pages.length;
    },
    visibleItems() {
      return this.pages[this.currentPage] || [];
    }
  },
  methods: {
    prevPage() {
      if (this.currentPage > 0) this.currentPage -= 1;
    },
    nextPage() {
      if (this.currentPage < this.totalPages - 1) this.currentPage += 1;
    }
  }
};
</script>

<style scoped lang="scss">
.ecosystem {
  margin-top: 36px;
}

.ecosystem__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
}

.ecosystem__title {
  font-size: 32px;
  font-weight: 800;
  color: #000;
}

.ecosystem__nav {
  display: flex;
  gap: 10px;
}

.eco-btn {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border: 1px solid #e5e7eb;
  background: #fff;
  cursor: pointer;
  position: relative;
  transition: all .2s ease;
}

.eco-btn:hover {
  background: #111827;
  border-color: #111827;
}

.eco-btn.disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.eco-btn::after {
  content: '';
  position: absolute;
  left: 50%;
  top: 50%;
  width: 8px;
  height: 8px;
  border-top: 2px solid #111827;
  border-right: 2px solid #111827;
  transform: translate(-50%, -50%) rotate(45deg);
  transition: border-color .2s ease;
}

.eco-btn:hover::after {
  border-color: #fff;
}

.eco-btn--prev::after {
  transform: translate(-50%, -50%) rotate(225deg);
}

.eco-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 16px;
  padding: 8px 0 6px;
}

.eco-card {
  background: #fff;
  border-radius: 16px;
  border: 1px solid #eef2f7;
  padding: 24px;
  column-gap: 16px;
  min-height: 160px;
}

.eco-card__icon img {
  width: 48px;
  width: 48px;
  object-fit: contain;
}

.icon-placeholder {
  width: 60px;
  height: 60px;
  border-radius: 12px;
  background: #f1f5f9;
  border: 1px dashed #cbd5e1;
}

.eco-card__title {
  font-size: 20px;
  font-weight: 700;
  color: #0f172a;
}

.eco-card__desc {
  margin-top: 10px;
  font-size: 16px;
  line-height: 1.5;
  color: #8e949e;
}

@media (max-width: 768px) {
  .ecosystem__title {
    font-size: 24px;
  }

  .eco-grid {
    grid-template-columns: 1fr;
  }
}
</style>