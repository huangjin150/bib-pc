<template>
    <div class="indicator-selector-overlay" v-if="visible" @click="closeSelector">
        <div class="indicator-selector" @click.stop>
            <div class="selector-header">
                <div class="selector-title">指标</div>
                <div class="close-btn" @click="closeSelector">
                    <span class="close-icon">×</span>
                </div>
            </div>

            <div class="selector-content">
                <!-- 主图指标 -->
                <div class="indicator-section">
                    <div class="section-title">主图</div>
                    <div class="indicator-list">
                        <div v-for="indicator in mainIndicators" :key="indicator.name" class="indicator-item"
                            :class="{ active: selectedIndicators.includes(indicator.name) }"
                            @click="toggleIndicator(indicator.name, 'main')">
                            <div class="indicator-content">
                                <span class="indicator-label">{{ indicator.label }}</span>
                                <span class="indicator-checkbox"
                                    :class="{ checked: selectedIndicators.includes(indicator.name) }">
                                    <span v-if="selectedIndicators.includes(indicator.name)" class="checkmark">✓</span>
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- 副图指标 -->
                <div class="indicator-section">
                    <div class="section-title">副图</div>
                    <div class="indicator-list">
                        <div v-for="indicator in subIndicators" :key="indicator.name" class="indicator-item"
                            :class="{ active: selectedIndicators.includes(indicator.name) }"
                            @click="toggleIndicator(indicator.name, 'sub')">
                            <div class="indicator-content">
                                <span class="indicator-label">{{ indicator.label }}</span>
                                <span class="indicator-checkbox"
                                    :class="{ checked: selectedIndicators.includes(indicator.name) }">
                                    <span v-if="selectedIndicators.includes(indicator.name)" class="checkmark">✓</span>
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'IndicatorSelector',
    data() {
        return {
            visible: false,
            selectedIndicators: ['VOL'], // 默认选中成交量
            // 主图指标配置
            mainIndicators: [
                { name: 'MA', label: 'MA' },
                { name: 'EMA', label: 'EMA' },
                { name: 'BOLL', label: 'BOLL' },
                { name: 'TRIX', label: 'TRIX' },
                { name: 'SAR', label: 'SAR' }
            ],
            // 副图指标配置
            subIndicators: [
                { name: 'VOL', label: 'VOL' },
                { name: 'MACD', label: 'MACD' },
                { name: 'KDJ', label: 'KDJ' },
                { name: 'RSI', label: 'RSI' },
                { name: 'WR', label: 'WR' },
                { name: 'CCI', label: 'CCI' },
                { name: 'DMI', label: 'DMI' },
                { name: 'BIAS', label: 'BIAS' },
                { name: 'OBV', label: 'OBV' },
                { name: 'PVT', label: 'PVT' },
                { name: 'EMV', label: 'EMV' },
                { name: 'AVP', label: 'AVP' }
            ]
        }
    },
    methods: {
        openSelector() {
            this.visible = true
        },
        closeSelector() {
            this.visible = false
        },
        toggleIndicator(indicatorName, type) {
            const index = this.selectedIndicators.indexOf(indicatorName)

            if (index > -1) {
                // 如果已选中，则取消选中
                this.selectedIndicators.splice(index, 1)
            } else {
                // 如果未选中，则添加选中
                this.selectedIndicators.push(indicatorName)
            }

            // 立即触发指标变化事件，实现实时更新
            this.$emit('indicatorChange', this.selectedIndicators)
        },
        confirmSelection() {
            this.$emit('indicatorChange', this.selectedIndicators)
            this.closeSelector()
        }
    }
}
</script>

<style scoped>
.indicator-selector-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 1000;
    display: flex;
    justify-content: center;
    align-items: center;
}

.indicator-selector {
    border-radius: 8px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
    width: 400px;
    max-height: 600px;
    display: flex;
    flex-direction: column;
    background-color: #000;
    border: 1px solid #292929;

}

.selector-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 16px 20px;
    border-bottom: 1px solid #292929;
    border-radius: 8px 8px 0 0;
}

.selector-title {
    font-size: 16px;
    font-weight: 600;
}

.close-btn {
    cursor: pointer;
    padding: 4px;
    border-radius: 4px;
    transition: background-color 0.2s;
}

.close-btn:hover {}

.close-icon {
    font-size: 20px;
    color: #666666;
    line-height: 1;
}

.selector-content {
    padding: 20px 15px;
    max-height: 500px;
    overflow-y: auto;
}

.indicator-section {
    margin-bottom: 24px;
}

.indicator-section:last-child {
    margin-bottom: 0;
}

.section-title {
    font-size: 14px;
    font-weight: 600;
    margin-bottom: 12px;
    padding-left: 4px;
}

.indicator-list {
    display: flex;
    flex-direction: column;
    gap: 8px;
}

.indicator-item {
    padding: 12px 16px;
    border-radius: 6px;
    cursor: pointer;
    transition: all 0.2s ease;
}

.indicator-item:hover {
    border-color: #dee2e6;
}

.indicator-item.active {}

.indicator-content {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.indicator-label {
    font-size: 14px;
    font-weight: 500;
}


.indicator-checkbox {
    width: 18px;
    height: 18px;
    border: 2px solid #ddd;
    border-radius: 3px;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s ease;

}

.indicator-checkbox.checked {
    background-color: #EAECEF
}

.checkmark {
    color: #2B3139;
    font-size: 12px;
    font-weight: bold;
    line-height: 1;
}

.selector-content::-webkit-scrollbar {
    width: 3px;
}

.selector-content::-webkit-scrollbar-track {
    border-radius: 3px;
}
</style>