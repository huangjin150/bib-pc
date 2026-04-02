<template>
  <section class="media">
    <div class="media__header">
      <h2 class="media__title">第三方评价</h2>
      <div class="media__nav">
        <button class="media-btn media-btn--prev" :class="{ disabled: currentIndex === 0 }" aria-label="上一页"
          @click="prev"></button>
        <button class="media-btn media-btn--next" :class="{ disabled: currentIndex >= items.length - 1 }"
          aria-label="下一页" @click="next"></button>
      </div>
    </div>

    <div class="media__card">
      <p class="media__quote">“{{ currentItem.quote }}”</p>

      <div class="media__brand">
        <img :src="currentItem.img_icon" alt="" />
      </div>

      <div class="media__source">{{ currentItem.source }}</div>

      <div class="media__dots">
        <span v-for="(dot, i) in items.length" :key="i" class="dot" :class="{ active: i === currentIndex }"
          @click="go(i)"></span>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  name: 'MediaTestimonials',
  props: {
    items: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      currentIndex: 0
    };
  },
  computed: {
    currentItem() {
      return this.items[this.currentIndex] || {};
    }
  },
  methods: {
    prev() {
      if (this.currentIndex > 0) this.currentIndex -= 1;
    },
    next() {
      if (this.currentIndex < this.items.length - 1) this.currentIndex += 1;
    },
    go(i) {
      this.currentIndex = i;
    }
  }
};
</script>

<style scoped lang="scss">
.media {
  margin-top: 36px;
}

.media__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
}

.media__title {
  font-size: 32px;
  font-weight: 800;
  color: #fff;
}

.media__nav {
  display: flex;
  gap: 10px;
}

/* 顶部右侧圆形箭头样式，交互与 EcosystemCarousel 保持一致 */
.media-btn {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border: 1px solid #333;
  background: #1a1a1a;
  cursor: pointer;
  position: relative;
  transition: all .2s ease;
}

.media-btn:hover {
  background: #d4ff00;
  border-color: #d4ff00;
}

.media-btn.disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.media-btn::after {
  content: '';
  position: absolute;
  left: 50%;
  top: 50%;
  width: 8px;
  height: 8px;
  border-top: 2px solid #fff;
  border-right: 2px solid #fff;
  transform: translate(-50%, -50%) rotate(45deg);
  transition: border-color .2s ease;
}

.media-btn:hover::after {
  border-color: #000;
}

.media-btn.media-btn--prev::after {
  transform: translate(-50%, -50%) rotate(225deg);
}

.media__card {
  background: #0c0c0c;
  height: 258px;
  border: 1px solid #1a1a1a;
  border-radius: 12px;
  padding: 32px 24px;
  text-align: center;
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: space-between;
}

.media__quote {
  color: #fff;
  font-size: 16px;
  line-height: 1.5;
  max-width: 812px;
  height: 60%;
}

.media__brand {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 28px;
  margin: 16px 0 8px;
}

.media__brand img {
  height: 28px;
  object-fit: contain;
}

.brand-text {
  font-weight: 700;
  color: #fff;
}

.media__source {
  color: #8e949e;
  font-size: 14px;
  margin-bottom: 12px;
}

.media__dots {
  display: flex;
  justify-content: center;
  gap: 8px;
  margin-top: 8px;
}

.media__dots .dot {
  width: 6px;
  height: 6px;
  border-radius: 9999px;
  background: #333;
  transition: all .2s ease;
}

.media__dots .dot.active {
  background: #d4ff00;
  transform: scale(1.2);
}

@media (max-width: 768px) {
  .media__title {
    font-size: 24px;
  }

  .media__quote {
    font-size: 15px;
    line-height: 1.8;
    padding: 0 8px;
  }
}
</style>