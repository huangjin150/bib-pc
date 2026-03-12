<template>
  <section class="security-assurance">
    <div class="security-assurance-title">
      全方位的资产安全保障
    </div>
    <div class="sa-grid">
      <div v-for="(item, idx) in items" :key="idx" class="sa-row" :class="{ reverse: idx % 2 === 1 }">
        <div class="sa-text">
          <h3 class="sa-title">{{ item.title }}</h3>
          <p class="sa-desc">{{ item.desc }}</p>
        </div>

        <div class="sa-illustration">
          <img v-if="item.icon" :src="item.icon" alt="" />
        </div>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  name: 'SecurityAssurance',
  props: {
    items: {
      type: Array,
      default: () => ([
        { title: '100% 储备金', desc: 'Abtcoin 坚持以默克尔树与 zk-SNARK 技术构建透明验证机制，利用零知识证明高效守护用户资产，让公众随时核查平台 100% 储备金并保护隐私，真正实现安全与信任的结合。', icon: require('@/assets/images/illustration-proof.png'), },
        { title: 'Abtcoin SAFU', desc: 'Abtcoin SAFU 用户安全资产基金，为用户资产安全提供了第二重保障，最大限度保障用户资产安全。Abtcoin SAFU 基金以平台交易费收入为基础，由各种稳定币和其他数字资产组成，可在极端情况下无压力兑付用户资产。', icon: require('@/assets/images/illustration-safu.png'), },
        { title: '多重安全保障', desc: '作为全球最安全的交易所之一，Abtcoin 提供十余种安全措施，覆盖登录、交易、提现等环节，全方位守护用户资产。通过采用中心化与去中心化结合的资金存储方案，在保障资产安全的同时，确保交易高效便捷。', icon: require('@/assets/images/illustration-safe.png'), }
      ])
    }
  },
  methods: {
    onClick(item) {
      this.$emit('cta', item);
    }
  }
};
</script>

<style scoped lang="scss">
.security-assurance {
  padding: 24px 0;

  .security-assurance-title {
    font-size: 32px;
    color: #262933;
    font-weight: 700;
  }
}

.sa-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 60px;
}

.sa-row {
  display: grid;
  grid-template-columns: 1.15fr 0.85fr;
  align-items: center;
  gap: 40px;
}

.sa-row.reverse {
  grid-template-columns: 0.85fr 1.15fr;
}

.sa-row.reverse .sa-text {
  order: 2;
}

.sa-row.reverse .sa-illustration {
  order: 1;
}

.sa-title {
  font-size: 28px;
  font-weight: 700;
  color: #0f172a;
  margin: 0 0 12px;
}

.sa-desc {
  font-size: 14px;
  line-height: 1.8;
  color: #6b7280;
  margin: 0 0 20px;
  max-width: 600px;
}

.sa-btn {
  padding: 10px 16px;
  background: #2563eb;
  color: #fff;
  border: none;
  border-radius: 9999px;
  font-size: 13px;
  line-height: 1;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(37, 99, 235, 0.25);
  transition: transform .15s ease, box-shadow .15s ease, background .15s ease;
}

.sa-btn:hover {
  transform: translateY(-1px);
  background: #1d4ed8;
  box-shadow: 0 6px 18px rgba(29, 78, 216, 0.28);
}

.sa-illustration {
  display: flex;
  align-items: center;
  justify-content: flex-start;
}

.sa-illustration img {
  width: 560px;
  height: 240px;
  object-fit: contain;
}

.sa-placeholder {
  width: 320px;
  height: 220px;
  border: 1px dashed #cbd5e1;
  border-radius: 12px;
  background: #f8fafc;
}

@media (max-width: 992px) {

  .sa-row,
  .sa-row.reverse {
    grid-template-columns: 1fr;
    gap: 24px;
  }

  .sa-text {
    order: 1 !important;
  }

  .sa-illustration {
    order: 2 !important;
    justify-content: center;
  }

  .sa-illustration img,
  .sa-placeholder {
    width: 260px;
    height: 200px;
  }
}
</style>