<template>
  <div class="notice-center dark-skin">
    <!-- 顶部 Banner 区 -->
    <div class="hero-header">
      <div class="hero-content">
        <h1 class="hero-title">公告中心</h1>
        <p class="hero-subtitle">掌握平台最新动态、活动资讯与系统升级公告</p>
      </div>
      <div class="hero-glow"></div>
    </div>

    <!-- 公告卡片网格 -->
    <div class="notice-container">
      <div class="notice-grid">
        <div 
          class="notice-card" 
          v-for="(item, index) in marketItems" 
          :key="index" 
          @click="goToDetail(item.id)"
        >
          <div class="card-icon-wrapper">
            <img :src="item.img" alt="" class="card-icon">
          </div>
          <div class="card-content">
            <h3 class="card-title">{{ item.title }}</h3>
            <p class="card-desc">{{ item.description }}</p>
          </div>
          <div class="card-footer">
            <span class="view-more">查看详情</span>
            <svg class="arrow-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { marketItems } from "./data.js";

export default {
  data() {
    return {
      marketItems: marketItems
    }
  },
  methods: {
    goToDetail(id) {
      // 跳转到对应的分类页面
      this.$router.push(`/announcementList/${id}`);
    }
  }
}
</script>

<style lang="scss" scoped>
.dark-skin {
  background-color: #000;
  color: #fff;
  min-height: 100vh;
  padding-bottom: 100px;
}

.hero-header {
  position: relative;
  padding: 80px 0 60px;
  text-align: center;
  overflow: hidden;
  
  .hero-content {
    position: relative;
    z-index: 2;
  }

  .hero-title {
    font-size: 48px;
    font-weight: 700;
    color: #fff;
    margin-bottom: 16px;
    letter-spacing: 2px;
  }

  .hero-subtitle {
    font-size: 16px;
    color: #8e949e;
    max-width: 600px;
    margin: 0 auto;
  }

  .hero-glow {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 600px;
    height: 400px;
    background: radial-gradient(circle, rgba(212, 255, 0, 0.08) 0%, transparent 70%);
    z-index: 1;
    pointer-events: none;
  }
}

.notice-container {
  max-width: 1260px;
  margin: 0 auto;
  padding: 0 24px;
}

.notice-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(360px, 1fr));
  gap: 24px;
}

.notice-card {
  background: linear-gradient(180deg, #111113 0%, #0a0a0c 100%);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 16px;
  padding: 32px 24px;
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  flex-direction: column;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(180deg, rgba(212, 255, 0, 0.03) 0%, transparent 100%);
    opacity: 0;
    transition: opacity 0.4s ease;
  }

  &:hover {
    transform: translateY(-8px);
    border-color: rgba(212, 255, 0, 0.3);
    box-shadow: 0 12px 40px rgba(0, 0, 0, 0.5), 0 0 20px rgba(212, 255, 0, 0.05);

    &::before {
      opacity: 1;
    }

    .card-icon-wrapper {
      background: rgba(212, 255, 0, 0.1);
      border-color: rgba(212, 255, 0, 0.2);
      
      .card-icon {
        transform: scale(1.1);
      }
    }

    .card-footer {
      color: #d4ff00;
      
      .arrow-icon {
        transform: translateX(6px);
      }
    }
  }
}

.card-icon-wrapper {
  width: 64px;
  height: 64px;
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.03);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 24px;
  transition: all 0.3s ease;
  border: 1px solid rgba(255, 255, 255, 0.05);

  .card-icon {
    width: 32px;
    height: 32px;
    object-fit: contain;
    transition: transform 0.3s ease;
  }
}

.card-content {
  flex: 1;
}

.card-title {
  font-size: 20px;
  font-weight: 600;
  color: #fff;
  margin: 0 0 12px 0;
  line-height: 1.4;
}

.card-desc {
  font-size: 14px;
  color: #888;
  line-height: 1.6;
  margin: 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.card-footer {
  margin-top: 32px;
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  font-weight: 500;
  color: #666;
  transition: color 0.3s ease;

  .arrow-icon {
    width: 16px;
    height: 16px;
    transition: transform 0.3s ease;
  }
}

@media (max-width: 768px) {
  .hero-header {
    padding: 40px 0 30px;
  }
  .hero-title {
    font-size: 32px;
  }
  .hero-subtitle {
    font-size: 14px;
    padding: 0 20px;
  }
  .notice-grid {
    grid-template-columns: 1fr;
  }
}
</style>