<template>
    <div class="charts">
        <div class="tabs">
            <!-- 时间选择按钮 -->
            <span v-for="resolution in resolutions" :key="resolution.time" class="tabs_btn"
                :class="{ 'active': localResolution === resolution.time }" @click="changeResolution(resolution.time)">
                {{ getResolutionText(resolution.time) }}
            </span>

            <!-- 更多按钮 -->
            <div class="more-wrapper" @mouseenter="showMoreOptions = true" @mouseleave="showMoreOptions = false">
                <span class="more-btn">更多</span>
                <!-- 悬浮框 -->
                <div v-if="showMoreOptions" class="dropdown">
                    <div class="dropdown_2">
                        <span v-for="moreOption in moreOptions" :key="moreOption"
                            :class="{ 'active': localResolution === moreOption }"
                            @click="changeMoreResolution(moreOption)">
                            {{ getResolutionText(moreOption) }}
                        </span>
                    </div>
                </div>
            </div>
            <div @click="openIndicatorSelector" class="chart-index">
                <img class="chart-index-img" src="../../assets/images/index-pc.png" alt="">
            </div>
        </div>
        <IndicatorSelector ref="indicatorSelector" @indicatorChange="handleIndicatorChange" />
        <div class="chart-container" style="display: flex; width: 100%; position: relative;">
            <div class="drawing-tool-sidebar">
                <div v-for="(group, index) in toolGroups" :key="index" class="tool-group" @mouseenter="showGroup(index)"
                    @mouseleave="hideGroup" :class="{ 'active': activeGroupIndex === index }">
                    <div class="group-icon" @click="selectTool(index, selectedTools[index] || 0)">
                        <span v-if="group.items[selectedTools[index] || 0].icon"
                            v-html="group.items[selectedTools[index] || 0].icon"></span>
                        <img style="width: 30px;height: 34px;" v-if="group.items[selectedTools[index] || 0].img"
                            :src="group.items[selectedTools[index] || 0].img" alt="">
                        <div v-if="group.items.length > 1" class="arrow-corner"></div>
                    </div>
                    <!-- Popover -->
                    <div v-if="activeGroupIndex === index && group.items.length > 1" class="tool-popover">
                        <div v-for="(item, i) in group.items" :key="i" class="popover-item"
                            @click.stop="selectTool(index, i)" :class="{ 'active': selectedTools[index] === i }">
                            <span class="item-icon" v-html="item.icon"></span>
                            <span class="item-text">{{ item.text }}</span>
                        </div>
                    </div>
                    <!-- Tooltip -->
                    <div v-if="activeGroupIndex === index && group.items.length === 1" class="tool-tooltip">
                        {{ group.items[0].text }}
                    </div>
                </div>
            </div>
            <div id="chart_box" style="flex: 1; height: 570px"></div>
        </div>
    </div>
</template>

<script>
import { init, registerLocale, registerOverlay } from 'klinecharts';
import IndicatorSelector from '../../components/uc/indicatorSelector.vue'


registerLocale('zh-HK', {
    time: '时间',
    open: '开',
    high: '高：',
    low: '低：',
    close: '收：',
    VOLUME: '成交量：',
    turnover: '成交额',
    change: '涨幅'
});


export default {
    props: {
        type: {
            type: String,
            default: 'candlestick',
        },
        autosize: {
            type: Boolean,
            default: true,
        },
        currentResolution: {
            type: String,
            default: '1',
        },
        symbol: {
            type: String,
            required: true,
        },
    },
    components: {
        IndicatorSelector
    },
    data() {
        return {
            resolutions: [
                { time: '1', size: 97 },
                { time: '5', size: 95 },
                { time: '15', size: 93 },
                { time: '30', size: 91 },
                { time: '1h', size: 89 },
                { time: '4h', size: 87 }
            ],
            moreOptions: ['1d', '1w', '1M'],
            localResolution: this.currentResolution,
            showMoreOptions: false,
            klineData: [],
            chart: null,
            currentIndicators: ['VOL'], // 当前选中的指标
            activeGroupIndex: null,
            activeToolKey: null, // Globally active tool group key (or index)
            selectedTools: {}, // Stores the selected tool index for each group
            toolGroups: [
                {
                    key: 'trend',
                    items: [
                        { name: 'segment', text: '线段', icon: '<svg width="30" height="34" viewBox="0 0 20 20" fill="none" stroke="currentColor"><path d="M3 17L17 3"/><circle cx="3" cy="17" r="2" fill="currentColor" stroke="none"/><circle cx="17" cy="3" r="2" fill="currentColor" stroke="none"/></svg>' },
                        { name: 'straightLine', text: '直线', icon: '<svg width="30" height="34" viewBox="0 0 20 20" fill="none" stroke="currentColor"><path d="M3 17L17 3"/><circle cx="10" cy="10" r="2" fill="currentColor" stroke="none"/></svg>' },
                        { name: 'rayLine', text: '射线', icon: '<svg width="30" height="34" viewBox="0 0 20 20" fill="none" stroke="currentColor"><path d="M3 17L17 3"/><circle cx="3" cy="17" r="2" fill="currentColor" stroke="none"/></svg>' },
                    ]
                },
                {
                    key: 'lines',
                    items: [
                        { name: 'horizontalStraightLine', text: '水平直线', icon: '<svg width="30" height="34" viewBox="0 0 20 20" fill="none" stroke="currentColor"><path d="M2 10h16"/><circle cx="10" cy="10" r="2" fill="currentColor" stroke="none"/></svg>' },
                        { name: 'horizontalRayLine', text: '水平射线', icon: '<svg width="30" height="34" viewBox="0 0 20 20" fill="none" stroke="currentColor"><path d="M2 10h16"/><circle cx="2" cy="10" r="2" fill="currentColor" stroke="none"/></svg>' },
                        { name: 'horizontalSegment', text: '水平线段', icon: '<svg width="30" height="34" viewBox="0 0 20 20" fill="none" stroke="currentColor"><path d="M2 10h16"/><circle cx="2" cy="10" r="2" fill="currentColor" stroke="none"/><circle cx="18" cy="10" r="2" fill="currentColor" stroke="none"/></svg>' },
                        { name: 'verticalStraightLine', text: '垂直直线', icon: '<svg width="30" height="34" viewBox="0 0 20 20" fill="none" stroke="currentColor"><path d="M10 2v16"/><circle cx="10" cy="10" r="2" fill="currentColor" stroke="none"/></svg>' },
                        { name: 'verticalRayLine', text: '垂直射线', icon: '<svg width="30" height="34" viewBox="0 0 20 20" fill="none" stroke="currentColor"><path d="M10 2v16"/><circle cx="10" cy="2" r="2" fill="currentColor" stroke="none"/></svg>' },
                        { name: 'verticalSegment', text: '垂直线段', icon: '<svg width="30" height="34" viewBox="0 0 20 20" fill="none" stroke="currentColor"><path d="M10 2v16"/><circle cx="10" cy="2" r="2" fill="currentColor" stroke="none"/><circle cx="10" cy="18" r="2" fill="currentColor" stroke="none"/></svg>' },

                    ]
                },
                {
                    key: 'fib',
                    items: [
                        { name: 'fibonacciLine', text: '斐波那契回调', img: require('../../assets/svg/fibonacci.svg') }
                    ]
                },
                {
                    key: 'parallel',
                    items: [
                        { name: 'parallelStraightLine', text: '平行直线', icon: '<svg width="30" height="34" viewBox="0 0 20 20" fill="none" stroke="currentColor"><path d="M2 12L18 4"/><path d="M2 16L18 8"/></svg>' },]
                },
                {
                    key: 'price',
                    items: [
                        { name: 'priceChannelLine', text: '价格通道线', icon: '<svg width="30" height="34" viewBox="0 0 20 20" fill="none" stroke="currentColor"><path d="M2 14L18 6M2 10L18 2"/><path d="M2 18L18 10" stroke-dasharray="2 2"/></svg>' }]
                },
                {
                    key: 'remove',
                    action: 'remove',
                    items: [
                        { name: 'remove', text: '清除', icon: '<svg width="30" height="34" viewBox="0 0 20 20" fill="none" stroke="currentColor"><path d="M4 6h12M8 6V4h4v2M6 6v10h8V6"/></svg>' }
                    ]
                }
            ],
        };
    },

    watch: {
        symbol(newData) {
            if (newData) {
                this.fetchData();
            }
        }
    },
    methods: {
        selectTool(groupIndex, toolIndex) {
            const group = this.toolGroups[groupIndex];
            const tool = group.items[toolIndex];

            // Always update the preferred tool for this group
            // this.$set(this.selectedTools, groupIndex, toolIndex);

            this.activeGroupIndex = null;

            if (group.action === 'remove') {
                this.chart.removeOverlay();
            } else if (group.action === 'magnet') {
                // Magnet functionality if available
            } else if (group.action === 'lock') {
                // Lock functionality if available
            } else if (group.action === 'hide') {
                // Hide functionality if available
            } else {
                this.activateDrawingTool(tool.name);
            }
        },
        showGroup(index) {
            this.activeGroupIndex = index;
        },
        hideGroup() {
            this.activeGroupIndex = null;
        },
        //创建画线工具
        activateDrawingTool(name) {
            if (!this.chart) return;
            this.chart.createOverlay(name);
        },
        ReSize() {
            this.chart.resize()
        },
        getResolutionText(resolution) {
            const resolutionMap = {
                '1': '1分钟',
                '5': '5分钟',
                '15': '15分钟',
                '30': '30分钟',
                '1h': '1小时',
                '4h': '4小时',
                '1d': '1天',
                '1w': '1周',
                '1M': '1月'
            };
            return resolutionMap[resolution] || resolution;
        },
        async fetchData() {
            try {
                const response = await this.$http.get(this.swapHost + '/history', {
                    params: {
                        symbol: this.symbol,
                        resolution: this.localResolution,
                        from: 0,
                        to: Date.now(),
                    }
                });

                this.accuracy(this.symbol)

                // 解析接口返回的数据
                this.klineData = response.data.map((d) => ({
                    close: d[4],
                    high: d[2],
                    low: d[3],
                    open: d[1],
                    timestamp: d[0],
                    volume: d[5],
                }));

                // 更新图表数据
                if (this.chart) {
                    this.chart.applyNewData(this.klineData);
                }
            } catch (error) {
                console.error('数据获取失败:', error);
            }
        },
        accuracy(item) {
            if (item == 'BTC/USDT' || item == 'ETH/USDT' || item == 'SOL/USDT' || item == 'BNB/USDT' || item == 'BCH/USDT') {
                this.chart.setPrecision({
                    price: 2,
                })
            } else if (item == 'DOGE/USDT' || item == 'TRX/USDT') {
                this.chart.setPrecision({
                    price: 5,
                })
            } else if (item == 'MEME/USDT') {
                this.chart.setPrecision({
                    price: 6,
                })
            } else {
                this.chart.setPrecision({
                    price: 4,
                })
            }
        },

        changeResolution(resolution) {
            this.localResolution = resolution;
            this.fetchData();
        },
        changeMoreResolution(resolution) {
            console.log(resolution)
            this.localResolution = resolution;
            this.fetchData();
        },
        refreshKline(newData) {
            let newLine = null;
            if (this.localResolution === '1') {
                newLine = newData['1m'];
            } else if (this.localResolution === '5') {
                newLine = newData['5m'];
            } else if (this.localResolution === '15') {
                newLine = newData['15m'];
            } else if (this.localResolution === '30') {
                newLine = newData['30m'];
            } else if (this.localResolution === '1h') {
                newLine = newData['1h'];
            } else if (this.localResolution === '4h') {
                newLine = newData['4h'];
            } else if (this.localResolution === '1d') {
                newLine = newData['1d'];
            } else if (this.localResolution === '1w') {
                newLine = newData['1w'];
            } else if (this.localResolution === '1M') {
                newLine = newData['1M'];
            }
            if (newLine != null && newLine.time > 0) {
                const newDate = newLine.time;
                const lastKLine = this.klineData[this.klineData.length - 1];
                if (!lastKLine) {
                    console.error('当前数据为空，无法更新');
                    return;
                }
                if (newDate > lastKLine.timestamp) {
                    this.newLastKline(newLine);
                } else if (newDate === lastKLine.timestamp) {
                    this.updateLastKline(newLine);
                } else {
                    console.error('新数据时间早于最后一根 K 线时间，无法处理');
                }
            }
        },
        updateLastKline(newLine) {
            let lastKLine = this.klineData[this.klineData.length - 1];
            this.klineData[this.klineData.length - 1].high = Math.max(lastKLine.high, newLine.highestPrice);
            this.klineData[this.klineData.length - 1].low = Math.min(lastKLine.low, newLine.lowestPrice);
            this.klineData[this.klineData.length - 1].close = newLine.closePrice;
            this.klineData[this.klineData.length - 1].volume = newLine.volume;

            // 更新图表数据
            if (this.chart) {
                this.chart.updateData(this.klineData[this.klineData.length - 1]);
            }
        },
        newLastKline(newLine) {
            // 解析接口返回的数据
            this.klineData.push({
                close: newLine.closePrice,
                high: newLine.highestPrice,
                low: newLine.lowestPrice,
                open: newLine.openPrice,
                timestamp: newLine.time,
                volume: newLine.volume
            })
            // 更新图表数据
            if (this.chart) {
                this.chart.applyNewData(this.klineData);
            }
        },
        handleVisibilityChange() {
            // 根据页面的可见性状态更新数据
            if (document.hidden) {
                this.pageVisibility = 'hidden';
                console.log('页面被隐藏');
                // if (this.chart) {
                // dispose(this.chart)
                // }
            } else {
                this.pageVisibility = 'visible';
                console.log('页面被显示');
            }
        },
        openIndicatorSelector() {
            this.$refs.indicatorSelector.openSelector()
        },

        // 指标变化
        handleIndicatorChange(selectedIndicators) {
            this.currentIndicators = selectedIndicators
            this.updateChartIndicators(selectedIndicators)
        },

        // 更新图表指标
        updateChartIndicators(indicators) {
            if (!this.chart) return
            // 清除所有现有指标
            this.chart.removeIndicator()
            // 添加选中的指标
            indicators.forEach(indicator => {
                if (indicator == 'VOL') {
                    this.chart.createIndicator('VOL')
                } else if (['MA', 'EMA', 'BOLL', 'SAR'].includes(indicator)) {
                    // 主图指标 true是覆盖不删除之前的 false是把之前的顶替掉
                    this.chart.createIndicator(indicator, true, {
                        id: 'candle_pane'
                    })
                } else {
                    // 其他副图指标
                    this.chart.createIndicator(indicator, true)
                }
            })
        }

    },
    mounted() {
        document.addEventListener('visibilitychange', this.handleVisibilityChange);
        this.chart = init('chart_box', {
            width: this.autosize ? '100%' : 600,
            height: this.autosize ? '100%' : 600,
            locale: 'zh-HK',
        });
        this.chart.setBarSpace(6)

        const upColorPref = localStorage.getItem('upColor') || 'green';
        const isGreenUp = upColorPref === 'green';
        const klineUpColor = isGreenUp ? '#ABE127' : '#ff5a7a';
        const klineDownColor = isGreenUp ? '#ff5a7a' : '#ABE127';

        const option = {
            crosshair: {
                show: true,
                horizontal: {
                    show: true,
                    line: {
                        show: true,
                        style: 'dashed',
                        size: 0.3,
                        color: '#eaeaed',
                    },
                },
                vertical: {
                    show: true,
                    line: {
                        show: true,
                        style: 'dashed',
                        size: 1,
                        color: '#eaeaed',
                    },
                },
            },

            candle: {
                bar: {
                    compareRule: 'current_open',
                    upColor: klineUpColor,
                    downColor: klineDownColor,
                    noChangeColor: '#888888',
                    upBorderColor: klineUpColor,
                    downBorderColor: klineDownColor,
                    noChangeBorderColor: '#888888',
                    upWickColor: klineUpColor,
                    downWickColor: klineDownColor,
                    noChangeWickColor: '#888888'
                },
                tooltip: {
                    offsetLeft: 4,
                    offsetTop: 6,
                    offsetRight: 4,
                    offsetBottom: 6,
                    // 'always' | 'follow_cross' | 'none'
                    showRule: 'always',
                    // 'standard' | 'rect'
                    showType: 'standard',
                    custom: [
                        { title: 'open', value: '{open}' },
                        { title: 'high', value: '{high}' },
                        { title: 'low', value: '{low}' },
                        { title: 'close', value: '{close}' },
                    ],
                    features: []
                },
                priceMark: {
                    show: true,
                    high: {
                        show: true,
                        textMargin: 5,
                        textSize: 10,
                        textFamily: 'Helvetica Neue',
                        textWeight: 'normal'
                    },
                    low: {
                        show: true,
                        textMargin: 5,
                        textSize: 10,
                        textFamily: 'Helvetica Neue',
                        textWeight: 'normal',
                    },
                    last: {
                        show: true,
                        compareRule: 'current_open',
                        upColor: klineUpColor,
                        downColor: klineDownColor,
                        noChangeColor: '#888888',
                        line: {
                            show: true,
                            style: 'dashed',
                            dashedValue: [4, 4],
                            size: 1
                        },
                        text: {
                            show: true,
                            style: 'fill',
                            size: 12,
                            paddingLeft: 4,
                            paddingTop: 4,
                            paddingRight: 4,
                            paddingBottom: 4,
                            borderStyle: 'solid',
                            borderSize: 0,
                            borderColor: 'transparent',
                            borderDashedValue: [2, 2],
                            color: '#FFFFFF',
                            family: 'Helvetica Neue',
                            weight: 'normal',
                            borderRadius: 2
                        }
                    }
                },
                pricePrecision: 4
            },




            grid: {
                show: true,
                horizontal: {
                    show: true,
                    size: 1,
                    color: '#292929',
                    style: 'solid',
                    dashedValue: [2, 2]
                },
                vertical: {
                    show: true,
                    size: 1,
                    color: '#292929',
                    style: 'solid',
                    dashedValue: [2, 2]
                }
            },

            indicator: {
                ohlc: {
                    // 'current_open' | 'previous_close'
                    compareRule: 'current_open',
                    upColor: klineUpColor,
                    downColor: klineDownColor,
                    noChangeColor: '#888888'
                },
                bars: [{
                    // 'fill' | 'stroke' | 'stroke_fill'
                    style: 'fill',
                    // 'solid' | 'dashed'
                    borderStyle: 'solid',
                    borderSize: 1,
                    borderDashedValue: [2, 2],
                    upColor: klineUpColor,
                    downColor: klineDownColor,
                    noChangeColor: '#888888'
                }],
                tooltip: {
                    offsetLeft: 4,
                    offsetTop: 6,
                    offsetRight: 4,
                    offsetBottom: 6,
                    // 'always' | 'follow_cross' | 'none'
                    showRule: 'always',
                    // 'standard' | 'rect'
                    showType: 'standard',
                    showName: false,
                    showParams: true,
                    defaultValue: 'n/a',
                    text: {
                        size: 12,
                        family: 'Helvetica Neue',
                        weight: 'normal',
                        color: '#D9D9D9',
                        marginTop: 4,
                        marginRight: 8,
                        marginBottom: 4,
                        marginLeft: 8
                    },
                    features: []
                }
            },


            yAxis: {
                show: true,
                size: 'auto',
                // 'left' | 'right'
                position: 'right',
                // 'normal' | 'percentage' | 'log'
                type: 'normal',
                inside: false,
                reverse: false,
                axisLine: {
                    show: false,
                    color: '#222831',
                    size: 1
                },
                tickText: {
                    show: true,
                    color: '#fff',
                    family: 'Helvetica Neue',
                    weight: 'normal',
                    size: 12,
                    marginStart: 4,
                    marginEnd: 4,
                    precision: 4
                },
                tickLine: {
                    show: true,
                    size: 1,
                    length: 3,
                    color: '#888888'
                }
            },
            separator: {
                size: 1,
                color: '#353333',
                fill: true,
                activeBackgroundColor: 'rgba(230, 230, 230, .15)'
            },
            xAxis: {
                show: true,
                size: 'auto',
                type: 'normal',
                inside: false,
                reverse: false,
                axisLine: {
                    show: false,
                    color: '#222831',
                    size: 1
                },
                tickText: {
                    show: true,
                    color: '#fff',
                    family: 'Helvetica Neue',
                    weight: 'normal',
                    size: 12,
                    marginStart: 4,
                    marginEnd: 4,
                    precision: 4
                },
                tickLine: {
                    show: true,
                    size: 1,
                    length: 3,
                    color: '#888888'
                }
            },
        };

        this.chart.setStyles(option);
        this.chart.createIndicator('VOL');
        this.fetchData();

    },
    beforeDestroy() {
        document.removeEventListener('visibilitychange', this.handleVisibilityChange);
    },
};
</script>

<style scoped>
.chart-container {
    display: flex;
    flex-direction: row;
    width: 100%;
    position: relative;
}

.drawing-tool-sidebar {
    width: 50px;
    background: #000;
    border-right: 1px solid #292929;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding-top: 10px;
    height: 570px;
    user-select: none;
}

.tool-group {
    position: relative;
    width: 100%;
    display: flex;
    justify-content: center;
    margin-bottom: 10px;
}

.group-icon {
    width: 40px;
    height: 40px;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    color: #76808f;
    border-radius: 4px;
    transition: all 0.2s;
    position: relative;
}

.group-icon:hover,
.group-icon.selected {
    color: #191919;
    background: #f0f3fa;
}

.tool-group.active .group-icon {
    background: #e1e3eb;
}

.arrow-corner {
    position: absolute;
    bottom: 2px;
    right: 2px;
    width: 0;
    height: 0;
    border-style: solid;
    border-width: 0 0 4px 4px;
    border-color: transparent transparent #76808f transparent;
}

.tool-popover {
    position: absolute;
    left: 95%;
    top: 0;
    background: #fff;
    border-radius: 4px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    padding: 6px 0;
    z-index: 1000;
    width: 140px;
    border: 1px solid #e1e3eb;
    margin-left: 2px;
}

.tool-tooltip {
    position: absolute;
    left: 100%;
    top: 50%;
    transform: translateY(-50%);
    background: #fff;
    border-radius: 4px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    padding: 6px 10px;
    z-index: 1000;
    white-space: nowrap;
    border: 1px solid #e1e3eb;
    margin-left: 8px;
    color: #191919;
    font-size: 14px;
}

.tool-tooltip::before {
    content: '';
    position: absolute;
    left: -4px;
    top: 50%;
    transform: translateY(-50%) rotate(45deg);
    width: 8px;
    height: 8px;
    background: #fff;
    border-left: 1px solid #e1e3eb;
    border-bottom: 1px solid #e1e3eb;
}

.popover-item {
    display: flex;
    align-items: center;
    padding: 8px 12px;
    cursor: pointer;
    color: #191919;
    font-size: 14px;
}

.popover-item:hover,
.popover-item.active {
    background: #f0f3fa;
    color: #2962ff;
}

.item-icon {
    width: 20px;
    height: 20px;
    margin-right: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
}

.item-text {
    flex: 1;
}
</style>

<style lang="scss" scoped>
.charts {
    width: 100%;


    .time {
        display: flex;
        justify-content: space-around;
        font-size: 14px;

        .active {
            color: #1a89ee;
        }
    }

    #chart_box {}
}

.tabs {
    padding-left: 40px;
    display: flex;
    align-items: center;
    gap: 20px;
}



.tabs {
    display: flex;
    align-items: center;
    position: relative;
}

.tabs span {
    border-right: 1px solid black;
    padding: 1px;
    border: none;
    cursor: pointer;
    padding: 0 8px;
    transition: background-color 0.3s;
}

.tabs span:hover {
    background-color: #292B31;
    color: #fff;
    border-radius: 5px;
}

.tabs span.active {
    border-radius: 5px;
    background-color: #292B31;
    color: white;
}


.dropdown {
    position: absolute;
    top: 100%;
    border-radius: 5px;
    padding: 10px;
    z-index: 1000;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
    display: none;
    min-width: 100px;
    background-color: #fff;

    .dropdown_2 {
        display: flex;
        align-items: center;
        gap: 10px;
    }

}

.dropdown span {
    display: block;
    text-align: center;
    padding: 4px 20px;
    border: none;
    color: #000;
    cursor: pointer;
    transition: background-color 0.3s;
}

.more-wrapper .dropdown {
    display: block;
}


.dropdown span:hover {
    border-radius: 5px;
    background-color: #292B31;
    color: #fff;
}

.tabs .dropdown {
    display: block;
}

.dropdown span.active {
    background-color: #292B31;
    border-radius: 5px;
    color: white;
}

.chart-index {
    cursor: pointer;
    margin-left: 5px;
    width: 17px;
    height: 17px;
    margin-bottom: 2px;
}

.chart-index-img {
    width: 17px;
    height: 17px;
}
</style>