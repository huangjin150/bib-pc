<template>
    <div class="charts">
        <div class="tabs">
            <!-- 时间选择按钮 -->
            <div v-for="resolution in resolutions" :key="resolution.time" class="tabs_btn"
                :class="{ 'active': isResolutionActive(resolution.time) }" @click="changeResolution(resolution.time)">
                {{ getResolutionText(resolution.time) }}
            </div>

            <!-- 更多按钮 -->
            <div class="more-wrapper" @mouseenter="showMoreOptions = true" @mouseleave="showMoreOptions = false">
                <div class="more-btn">更多</div>
                <!-- 悬浮框 -->
                <div v-if="showMoreOptions" class="dropdown">
                    <div class="dropdown_2">
                        <div v-for="tabsmoreOption in moreOptions" class="dropdown_item" :key="tabsmoreOption"
                            :class="{ 'active': localResolution === tabsmoreOption }"
                            @click="changeMoreResolution(tabsmoreOption)">
                            {{ getResolutionText(tabsmoreOption) }}
                        </div>
                    </div>
                </div>
            </div>
            <div @click="openIndicatorSelector" class="chart-index">
                <img class="chart-index-img" src="../../assets/images/index-pc.png" alt="">
            </div>
        </div>
        <IndicatorSelector ref="indicatorSelector" @indicatorChange="handleIndicatorChange" />
        <div id="chart_box" style="width: 100%; height: 550px"></div>
    </div>
</template>

<script>
import { init, registerLocale, registerOverlay } from 'klinecharts';
import IndicatorSelector from '../../components/uc/indicatorSelector.vue'


var moment = require("moment");
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
                { time: 'Time', size: 97 },
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
            klineMarkerMap: [],
            klineData: [],
            status: false,
            addedOrderMarkers: [],
            chart: null,
            timeSharing: false,
            test: false,
            newmarkKlineData: [],
            currentIndicators: ['VOL'],// 当前选中的指标
            option: {
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
                    type: 'candle_solid',
                    bar: {
                        compareRule: 'current_open',
                        upColor: '#2bc287',
                        downColor: '#f92855',
                        noChangeColor: '#888888',
                        upBorderColor: '#2DC08E',
                        downBorderColor: '#F92855',
                        noChangeBorderColor: '#888888',
                        upWickColor: '#2DC08E',
                        downWickColor: '#F92855',
                        noChangeWickColor: '#888888'
                    },
                    tooltip: {
                        offsetLeft: 4,
                        offsetTop: 6,
                        offsetRight: 4,
                        offsetBottom: 6,
                        showRule: 'always',
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
                            upColor: '#2bc287',
                            downColor: '#f74b60',
                            noChangeColor: '#888888',
                            line: {
                                show: true,
                                style: 'solid',
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
                },
                grid: {
                    show: true,
                    horizontal: {
                        show: true,
                        size: 1,
                        color: '#eaeaed',
                        style: 'solid',
                        dashedValue: [2, 2]
                    },
                    vertical: {
                        show: true,
                        size: 1,
                        color: '#eaeaed',
                        style: 'solid',
                        dashedValue: [2, 2]
                    }
                },

                indicator: {
                    tooltip: {
                        offsetLeft: 4,
                        offsetTop: 6,
                        offsetRight: 4,
                        offsetBottom: 6,
                        showRule: 'always',
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
                    position: 'right',
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
                        color: '#000',
                        family: 'Helvetica Neue',
                        weight: 'normal',
                        size: 12,
                        marginStart: 4,
                        marginEnd: 4
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
                    color: '#eaeaed',
                    fill: true,
                    activeBackgroundColor: 'rgba(230, 230, 230, .15)'
                },
                xAxis: {
                    show: true,
                    size: 'auto',
                    axisLine: {
                        show: false,
                        color: '#222831',
                        size: 1
                    },
                    tickText: {
                        show: true,
                        color: '#000',
                        family: 'Helvetica Neue',
                        weight: 'normal',
                        size: 12,
                        marginStart: 4,
                        marginEnd: 4
                    },
                    tickLine: {
                        show: true,
                        size: 1,
                        length: 3,
                        color: '#888888'
                    }
                },

            }

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
        //k线图数据
        getResolutionText(resolution) {
            const resolutionMap = {
                'Time': '分时',
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
                    this.status = true//控制标记覆盖物是否重新加载状态
                    this.$nextTick(() => {
                        this.reloadMarkers()
                    })
                }
            } catch (error) {
                console.error('数据获取失败:', error);
            }
        },
        changeResolution(resolution) {
            if (resolution == 'Time') {
                this.localResolution = '1'
                this.timeSharing = true
                // 设置为分时图样式
                this.chart.setStyles({
                    candle: {
                        type: 'area',
                    },
                });

                this.fetchData();
                return
            } else {
                // 设置回K线图样式
                this.chart.setStyles(this.option);
                if (this.chart.getIndicators({
                    name: 'VOL'
                }).length == 0) {
                    this.chart.addOrderMarkerAtStartTime('VOL');
                }
            }
            this.timeSharing = false
            this.localResolution = resolution;
            this.fetchData();
        },
        changeMoreResolution(resolution) {
            this.localResolution = resolution;
            this.status = true
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
                }
                if (!this.test) {
                    this.test = true
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
            if (this.chart) {
                this.chart.updateData(lastKLine);
            }
            if (this.status == true) {
                this.$nextTick(() => {
                    this.reloadMarkers()
                })
                this.status = false
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
                this.stopWebsock();
                // if (this.chart) {
                // dispose(this.chart)
                // }
            } else {
                this.pageVisibility = 'visible';
                this.getCoinList();
                this.startWebsock();
                this.fetchData()
            }
        },
        destroyChartResizeObserver() {
            if (this.chartResizeObserver) {
                this.chartResizeObserver.disconnect();
                this.chartResizeObserver = null;
            }
        },
        initchart() {
            this.chart = init('chart_box', {
                width: this.autosize ? '100%' : 600,
                height: this.autosize ? '100%' : 600,
                locale: 'zh-HK',
                timezone: 'Asia/Shanghai',
            });
            this.chart.setOffsetRightDistance(200);
            this.chart.resize();

            //创建k柱标识
            registerOverlay({
                name: 'orderMarker',
                totalStep: 1,
                lock: false,
                createPointFigures: ({ coordinates, overlay }) => {
                    const result = overlay.extendData.result;
                    let text = '';
                    if (result === 1) {
                        text = 'W';
                    } else if (result === 2) {
                        text = 'L';
                    } else if (result === 3) {
                        text = '未开始';
                    } else if (result === 0) {
                        text = '';
                    } else if (result === 4) {
                        text = '平';
                    }
                    // 如果是未开始，只显示文字
                    if (result === 3) {
                        return [
                            {
                                type: 'text',
                                attrs: {
                                    x: coordinates[0].x,
                                    y: coordinates[0].y + overlay.styles.shape.offsetY,
                                    text: text,
                                    align: 'center',
                                    baseline: 'middle'
                                },
                                styles: {
                                    color: '#f0a70a',
                                    size: 10,
                                    fontSize: 5,
                                    backgroundColor: 'transparent'
                                }
                            }
                        ];
                    }
                    // 其他情况显示圆和文字
                    return [
                        {
                            type: 'circle',
                            attrs: {
                                x: coordinates[0].x,
                                y: coordinates[0].y + overlay.styles.shape.offsetY,
                                r: overlay.styles.shape.size
                            },
                            styles: {
                                color: overlay.styles.shape.color
                            }
                        },
                        {
                            type: 'text',
                            attrs: {
                                x: coordinates[0].x,
                                y: coordinates[0].y + overlay.styles.shape.offsetY,
                                text: text,
                                align: 'center',
                                baseline: 'middle'
                            },
                            styles: {
                                color: '#fff',
                                fontSize: 16,
                                size: 8,
                                backgroundColor: 'transparent'
                            }
                        }
                    ];
                }
            });

            //创建价格线
            registerOverlay({
                name: 'customPriceLine',
                totalStep: 1,
                lock: false,
                zLevel: 3,
                createPointFigures: ({ coordinates, overlay }) => {
                    const [point] = coordinates;
                    return [
                        {
                            type: 'line',
                            attrs: {
                                coordinates: [
                                    { x: 0, y: point.y },
                                    { x: 1700, y: point.y }
                                ]
                            },
                            styles: {
                                style: 'dashed',
                                color: overlay.styles.line.color,
                                size: overlay.styles.line.size
                            }
                        },
                        {
                            type: 'text',
                            attrs: {
                                x: point.x,
                                y: point.y,
                                text: overlay.extendData.label || '',
                                align: 'left',
                                baseline: 'middle'
                            },
                            styles: {
                                color: overlay.styles.text.color,
                                size: overlay.styles.text.size,
                                backgroundColor: overlay.styles.text.backgroundColor,
                                family: overlay.styles.text.family,
                                weight: overlay.styles.text.weight
                            }
                        }
                    ];
                }
            });
        },

        //创建价格线
        addOrderPriceLine(price, hasUp, hasDown) {
            if (!this.chart) return;
            let Klinecolor = '#2DC08E';
            let icons = '';
            // 判断方向
            if (hasUp == 1) {
                Klinecolor = '#2DC08E';
                icons = '↑';
            } else if (hasDown == 2) {
                Klinecolor = '#F92855';
                icons = '↓';
            }
            this.chart.createOverlay({
                name: 'customPriceLine',
                id: this.orderLineId,
                groupId: 'order_price_lines',
                points: [{ value: price }],
                extendData: {
                    label: ` ${price} ${icons}` // 自定义文本内容
                },
                styles: {
                    line: {
                        style: 'dashed',
                        color: Klinecolor,
                        size: 2
                    },
                    text: {
                        color: '#ffffff',
                        size: 12,
                        backgroundColor: Klinecolor,
                        family: 'Helvetica Neue',
                        weight: 'bold'
                    }
                },
                lock: true
            });
        },
        isResolutionActive(resolutionTime) {
            if (resolutionTime === 'Time') {
                return this.timeSharing;
            }
            return !this.timeSharing && this.localResolution === resolutionTime;
        },
        getTimeIntervalByResolution() {//根据分时获得时间间隔
            let timeRange;
            if (this.localResolution === 'Time') {
                // 分时图
                timeRange = 60 * 1000;
            } else if (this.localResolution <= 1) {
                // 1分钟及以下周期
                timeRange = 80 * 1000;
            } else if (this.localResolution <= 5) {
                // 5分钟周期
                timeRange = 5 * 60 * 1000;
            } else if (this.localResolution <= 15) {
                // 15分钟周期
                timeRange = 15 * 60 * 1000;
            } else if (this.localResolution <= 30) {
                // 30分钟周期
                timeRange = 30 * 60 * 1000;
            } else if (this.localResolution == '1h') {
                // 1小时周期
                timeRange = 60 * 60 * 1000;
            } else if (this.localResolution == '4h') {
                // 4小时周期
                timeRange = 4 * 60 * 60 * 1000;
            } else if (this.localResolution == '1d') {
                // 一天
                timeRange = 24 * 60 * 60 * 1000;
            } else if (this.localResolution == '1w') {
                //一周
                timeRange = 24 * 7 * 60 * 60 * 1000;
            } else if (this.localResolution == '1M') {
                //一月
                timeRange = 24 * 30 * 60 * 60 * 1000;
            }
            return timeRange;
        },
        //清空标记
        clearAllMarkers() {
            if (!this.chart) {
                console.error('图表实例不存在');
                return;
            }
            // 清空之前的标记
            if (this.addedOrderMarkers && this.addedOrderMarkers.length > 0) {
                this.addedOrderMarkers.forEach(item => {
                    try {
                        this.chart.removeOverlay({
                            id: String(item.id),
                            name: "orderMarker"
                        });
                    } catch (error) {
                        console.error('删除标记失败:', error, markerId);
                    }
                });
                this.addedOrderMarkers = [];
            }

            // 重置标记映射
            this.klineMarkerMap = {};
        },

        //创建k柱标记
        addOrderMarkerAtStartTime(param, StartTimes) {
            const startTime = StartTimes;
            const result = param.result;
            const markId = String(param.id);
            if (!this.addedOrderMarkers) this.addedOrderMarkers = [];
            const exists = this.addedOrderMarkers.some(m => m.id === markId);
            if (!exists) {
                let obj = {
                    id: markId,
                    item: param,
                    StartTimestart: StartTimes,
                }
                this.addedOrderMarkers.push(obj);
            }

            let startTimestamp = moment(startTime).valueOf();
            let kline;
            if (this.klineData && this.klineData.length > 0) {
                // 如果时间小于第一根k线的时间 说明数据有限 不显示
                if (startTimestamp < this.klineData[0].timestamp) {
                    return
                }
                // kline = this.klineData.find(item => item.timestamp >= startTimestamp);
                // 查找第一个时间大于 startTimestamp 的 k线
                const nextKlineIndex = this.klineData.findIndex(item => item.timestamp > startTimestamp);

                if (nextKlineIndex > 0) {
                    // 取前一个，即 <= startTimestamp 的最后一个
                    kline = this.klineData[nextKlineIndex - 1];
                } else if (nextKlineIndex === -1) {
                    // 如果没找到比它大的，说明都在它前面（或相等），取最后一个
                    kline = this.klineData[this.klineData.length - 1];
                } else {
                    // nextKlineIndex === 0
                    // 理论上上面 check startTimestamp < klineData[0] 已经拦截了这种情况
                    // 这里作为一个 fallback
                    kline = this.klineData[0];
                }

                if (!kline) {
                    kline = this.klineData[this.klineData.length - 1]
                }
            }
            if (!kline) {
                return
            }
            if (!this.klineMarkerMap) this.klineMarkerMap = {};
            let markerKey = null
            markerKey = kline.timestamp;
            if (!this.klineMarkerMap[markerKey]) {
                this.klineMarkerMap[markerKey] = 0;
            }
            const markerIndex = this.klineMarkerMap[markerKey];
            this.klineMarkerMap[markerKey] += 1;
            const baseOffsetY = 15;
            const offsetStep = 20;
            const offsetY = baseOffsetY + markerIndex * offsetStep;
            try {
                this.chart.createOverlay({
                    id: markId,
                    name: 'orderMarker',
                    points: [
                        {
                            // timestamp: startTimestamp,
                            timestamp: kline.timestamp,
                            value: kline.low
                        }
                    ],
                    styles: {
                        shape: {
                            type: 'circle',
                            color: result === 1 ? '#42b983' : (result === 2 ? '#DF484C' : (result === 3 ? '#f0a70a' : (result === 0 ? '#dfe0e2' : (result === 4 ? '#f0a70a' : '#999')))),
                            size: 7,
                            offsetY
                        }
                    },
                    extendData: { result },
                    lock: true
                });
                return true;
            } catch (error) {
                console.error('添加标记失败:', error);
                return false;
            }
        },
        reloadMarkers() {
            if (this.addedOrderMarkers.length > 0) {
                let before = this.addedOrderMarkers;
                this.clearAllMarkers();
                this.$nextTick(() => {
                    before.forEach(item => {
                        this.addOrderMarkerAtStartTime(item.item, item.StartTimestart)
                    })
                })
            }
        },
        openIndicatorSelector() {
            this.$refs.indicatorSelector.openSelector()
        },

        // 指标变化
        handleIndicatorChange(selectedIndicators) {
            console.log('选中的指标:', selectedIndicators)
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
                    console.log('VOL')
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
        },
        ReSize() {
            if (this.chart) {
                this.chart.resize()
            }
        },
    },
    mounted() {
        this.initchart()
        this.chart.setStyles(this.option);
        this.chart.setBarSpace(14)
        this.chart.createIndicator('VOL');
        this.chart.isZoomEnabled()
        this.chart.setPrecision(7)
        this.fetchData();
        this.klineMarkerMap = {};
    },
    beforeDestroy() {
        document.removeEventListener('visibilitychange', this.handleVisibilityChange);
        this.destroyChartResizeObserver();
    },
};
</script>

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
    display: flex;
    align-items: center;
    gap: 20px;
    position: relative;

    .tabs_btn {
        cursor: pointer;
        padding: 0 8px;
    }

    .tabs_btn:hover {
        background-color: #292B31;
        color: #fff;
        border-radius: 5px;
    }
}

.tabs .tabs_btn.active {
    color: #fff;
    background-color: #000;
    border-radius: 5px;

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

.dropdown .dropdown_item {
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


.dropdown .dropdown_item:hover {
    border-radius: 5px;
    background-color: #292B31;
    color: #fff;
}

.tabs .dropdown {
    display: block;
}

.dropdown div.active {
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

.more-btn {
    cursor: pointer;
}
</style>