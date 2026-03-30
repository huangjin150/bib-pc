<template>
  <div class="notice dark-skin">
    <div class="box">
      <h1>公告</h1>
      <div class="market-grid">
        <div class="market-card flex_b" v-for="(item, index) in marketItems" :key="index" @click="goToDetail(item.id)">
          <div class="market-icon">
            <img :src="item.img" alt="">
          </div>
          <div style="width: 60%; margin-left: 20px;">
            <h3 class="market-title">{{ item.title }}</h3>
            <div class="market-desc">{{ item.description }}</div>
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
/* 强制深色主题 */
.dark-skin {
  background-color: #000;
  color: #fff;
  min-height: 100vh;
}

.flex {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.flex_b {
  display: flex;
  align-items: center;
}

.flex_c {
  display: flex;
  justify-content: space-between;
}

.notice {
  min-height: 100vh;
}

.box {
  max-width: 1260px;
  margin: 0 auto;

  h1 {
    font-size: 36px;
    font-weight: 600;
    color: #fff;
    padding: 48px 0;
  }
}

.market-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;


}

.market-card {
  border-radius: 14px;
  border: 1px solid #1a1a1a;
  background-color: #0c0c0c;
  padding: 40px 24px;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background-color: #1a1a1a;
    border-color: #d4ff00;
  }

  .market-icon {

    img {
      width: 40px;
      height: 40px;
    }
  }

  .market-title {
    font-size: 20px;
    font-weight: 500;
    line-height: 28px;
    color: #fff;
  }

  .market-desc {
    margin-top: 7px;
    font-size: 14px;
    font-weight: 500;
    line-height: 22px;
    color: #888;
  }
}
</style>