<template>
    <div class="hot-coins-page">
        <div class="page-header">
            <h2 class="page-title">热门币对</h2>
        </div>

        <div class="tabs-container">
            <div class="tabs">
                <div v-for="tab in tabs" :key="tab.key" class="tab-item" :class="{ active: activeTab === tab.key }"
                    @click="switchTab(tab.key)">
                    {{ tab.label }}
                </div>
            </div>
        </div>

        <div class="custom-table-box">
            <div class="custom-table-header">
                <div class="header-col">币对</div>
                <div class="header-col">最新价</div>
                <div class="header-col">{{ getHeaderText() }}</div>
                <div class="header-col">交易量</div>
                <div class="header-col">操作</div>
            </div>

            <div class="gainers-ranking-wrapper">
                <GainersRanking :activeState="2" :sort-type="activeTab" :default-limit="20" :allow-navigation="true" />
            </div>
        </div>
    </div>
</template>

<script>
import GainersRanking from '@/components/GainersRanking.vue'

export default {
    name: 'HotCoinsPage',
    components: {
        GainersRanking
    },
    data() {
        return {
            activeTab: 'rise',
            tabs: [
                { key: 'rise', label: '涨幅榜' },
                { key: 'fall', label: '跌幅榜' },
                { key: 'volume', label: '成交额' }
            ]
        }
    },
    methods: {
        getHeaderText() {
            switch (this.activeTab) {
                case 'rise':
                case 'fall':
                case 'new':
                    return '今日涨跌 24h'
                case 'volume':
                    return '24h成交额 24h'
                default:
                    return '今日涨跌 24h'
            }
        },
        switchTab(tabKey) {
            this.activeTab = tabKey
        },
        onCoinSelected(coin) {
            const symbol = this.convertSymbol(coin.symbol)
            this.$router.push(`/swap/${symbol}`);
        },
        convertSymbol(symbol) {
            return symbol.toLowerCase().replace(/\//g, '_');
        },
    }
}
</script>

<style scoped>
.hot-coins-page {
    background: #fff;
    border-radius: 8px;
    padding: 70px 0 120px 0;
    overflow: hidden;
    width: 100%;
    max-width: 1260px;
    margin: 0 auto;
}

.page-header {
    padding: 20px 20px 0 0;
}

.page-title {
    font-size: 40px;
    font-weight: 700;
    color: #000;
    margin: 0;
    padding-bottom: 30px;
}

.tabs-container {
    padding: 20px 20px 0 0;
}

.tabs {
    display: flex;
    gap: 24px;
}

.tab-item {
    font-size: 14px;
    color: #666;
    cursor: pointer;
    padding: 12px 0;
    position: relative;
    transition: color 0.2s;
    border-radius: 8px;
    padding: 8px 16px;
    background: #f5f5f5;
}

.tab-item.active {
    color: #000;
    background: #c6f906;
}

.tab-item:hover {
    color: #000;
}

.trade-type-container {
    padding: 16px 20px 0 20px;
}

.trade-type-tabs {
    display: flex;
    gap: 16px;
}

.trade-type-item {
    font-size: 14px;
    color: #666;
    cursor: pointer;
    padding: 4px 0;
    transition: color 0.2s;
}

.trade-type-item.active {
    color: #000;
    font-weight: 600;
}

.trade-type-item:hover {
    color: #000;
}

.custom-table-header {
    padding: 16px 20px 8px 20px;
    display: grid;
    grid-template-columns: 1.9fr 1fr 1fr 1fr 0.6fr;
    align-items: center;
    border-bottom: 1px solid #f0f0f0;
}

.header-col {
    font-size: 12px;
    color: #9ca3af;
    text-align: left;
}

.header-col:nth-of-type(5) {
    text-align: center;

}


.gainers-ranking-wrapper ::v-deep .gainers-ranking {
    border-radius: 0;
}

.gainers-ranking-wrapper ::v-deep .table-header {
    display: none;
}

.gainers-ranking-wrapper ::v-deep .coin-item {
    display: grid;
    grid-template-columns: 1.9fr 1fr 1fr 1fr 0.6fr;
    align-items: center;
    padding: 12px 20px;
    height: auto;
}

.gainers-ranking-wrapper ::v-deep .coin-left {
    justify-self: start;
}

.gainers-ranking-wrapper ::v-deep .coin-center {
    justify-self: start;
}

@media (max-width: 768px) {

    .custom-table-header,
    .gainers-ranking-wrapper ::v-deep .coin-item {
        grid-template-columns: 1.5fr 1fr 1fr 0.8fr;
        padding: 12px 16px;
    }

    .page-title {
        font-size: 20px;
    }

    .tabs {
        gap: 16px;
    }

    .tab-item {
        font-size: 12px;
        padding: 6px 12px;
    }
}

.custom-table-box {
    margin-top: 20px;
    border: 1px solid #eaeaed;
    border-radius: 10px;
}
</style>