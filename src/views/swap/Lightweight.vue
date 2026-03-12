<template>
	<div class="lw-chart-container">
		<div class="tabs">
			<!-- 时间选择按钮 -->
			<button v-for="resolution in resolutions" :key="resolution.time"
				:class="{ 'active': localResolution === resolution.time }" @click="changeResolution(resolution)">
				{{ getResolutionText(resolution.time) }}
			</button>

			<!-- 更多按钮 -->
			<div class="more-wrapper" @mouseenter="showMoreOptions = true" @mouseleave="showMoreOptions = false">
				<button class="more-btn">更多</button>
				<!-- 悬浮框 -->
				<div v-if="showMoreOptions" class="dropdown">
					<button v-for="moreOption in moreOptions" :key="moreOption"
						:class="{ 'active': localResolution === moreOption }" @click="changeMoreResolution(moreOption)">
						{{ getResolutionText(moreOption) }}
					</button>
				</div>
			</div>
		</div>

		<!-- 两个独立图表区域 -->
		<div class="chart-wrapper">
			<!-- K 线图区域 -->
			<div class="kline-chart" ref="klineChart"></div>
			<!-- 成交量图区域 -->
			<div class="volume-chart" ref="volumeChart"></div>
		</div>

		<!-- 价格显示 -->
		<div class="price-display" ref="priceDisplay">
			<div>开: <span class="value">{{ open }}</span></div>
			<div>高: <span class="value">{{ high }}</span></div>
			<div>低: <span class="value">{{ low }}</span></div>
			<div>收: <span class="value">{{ close }}</span></div>
		</div>
		<!-- 成交量显示 -->
		<div class="position">成交量: <span class="value">{{ value }}</span></div>
	</div>
</template>
  
<script>
import { createChart } from 'lightweight-charts';
import moment from 'moment';

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
	data() {
		return {
			// 两个图表对象
			klineChart: null,
			volumeChart: null,
			// 两个图表的数据系列
			klineSeries: null,
			volumeSeries: null,
			localResolution: this.currentResolution,
			data: [],
			volumeData: [],
			// K 线图配置（上部图表）
			klineChartOptions: {
				height: 400,
				layout: { backgroundColor: '#0b1520', textColor: '#fff' },
				grid: { vertLines: { color: '#232831' }, horzLines: { color: '#232831' } },
			},
			// 成交量图配置（下部图表）
			volumeChartOptions: {
				height: 200,
				layout: { backgroundColor: '#0b1520', textColor: '#fff' },
				grid: { vertLines: { color: '#232831' }, horzLines: { color: '#232831' } },
			},
			// K 线系列参数
			seriesOptions: {
				upColor: '#18B762',
				downColor: '#E8503A',
				wickUpColor: '#18B762',
				wickDownColor: '#E8503A',
			},
			timeScaleOptions: {
				visible: false,
				rightOffset: 10,
				fixLeftEdge: true,
				timeVisible: true,
				fixRightEdge: false,
			},
			HScaleOptions: {
				rightOffset: 10,
				fixLeftEdge: true,
				timeVisible: true,
				fixRightEdge: false,
			},
			priceScaleOptions: {
				autoScale: true,
			},
			// 用于价格显示的数据
			high: '--',
			open: '--',
			low: '--',
			close: '--',
			value: '--',
			showMoreOptions: false,
			resolutions: [
				{ time: '1', size: 97 },
				{ time: '5', size: 95 },
				{ time: '15', size: 93 },
				{ time: '30', size: 91 },
				{ time: '1h', size: 89 },
				{ time: '4h', size: 87 }
			],
			moreOptions: ['1w', '1M'],
		};
	},
	async mounted() {
		await this.fetchData();
		this.initCharts();
		this.$nextTick(() => {
			this.resizeHandler();
		});
	},
	beforeDestroy() {
		this.destroyCharts();
	},
	watch: {
		autosize(enabled) {
			if (enabled) {
				window.addEventListener('resize', this.resizeHandler);
			} else {
				window.removeEventListener('resize', this.resizeHandler);
			}
		},
		type(newType) {
			// 如果类型改变，移除原来的系列，重新添加
			if (this.klineChart && this.klineSeries) {
				this.klineChart.removeSeries(this.klineSeries);
			}
			this.addKlineSeries();
		},
		data(newData) {
			if (!this.klineSeries) return;
			this.klineSeries.setData(newData);
		},
	},
	methods: {
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
		changeResolution(resolution) {
			this.localResolution = resolution.time;
			this.fetchData();
		},
		changeMoreResolution(resolution) {
			this.localResolution = resolution;
			this.fetchData();
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

				this.data = response.data.map((d) => ({
					time: moment(d[0] + 8 * 3600 * 1000).unix(),
					open: d[1],
					high: d[2],
					low: d[3],
					close: d[4],
				}));

				this.volumeData = response.data.map((d) => ({
					time: moment(d[0] + 8 * 3600 * 1000).unix(),
					value: d[5],
					color: d[4] >= d[1] ? 'rgba(0, 150, 136, 0.8)' : 'rgba(255, 82, 82, 0.8)',
				}));

				if (this.klineSeries) {
					this.klineSeries.setData(this.data);
				}
				if (this.volumeSeries) {
					this.volumeSeries.setData(this.volumeData);
				}

				// 如果有数据，调整图表显示范围到最新一个数据点
				if (this.data.length > 0) {
					const lastTime = this.data[this.data.length - 1].time;
					const range = {
						from: lastTime - 1,
						to: lastTime + 1,
					};
					if (this.klineChart) {
						this.klineChart.timeScale().setVisibleRange(range);
					}
					if (this.volumeChart) {
						this.volumeChart.timeScale().setVisibleRange(range);
					}
				}
			} catch (error) {
				console.error('数据获取失败:', error);
			}
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
				const newDate = moment(newLine.time + 8 * 3600 * 1000).unix();
				const lastKLine = this.data[this.data.length - 1];
				if (!lastKLine) {
					console.error('当前数据为空，无法更新');
					return;
				}
				if (newDate > lastKLine.time) {
					this.newLastKline(newLine);
				} else if (newDate === lastKLine.time) {
					this.updateLastKline(newLine);
				} else {
					console.error('新数据时间早于最后一根 K 线时间，无法处理');
				}
			}
		},
		updateLastKline(newLine) {
			const lastKLine = this.data[this.data.length - 1];
			const lastVolume = this.volumeData[this.volumeData.length - 1];
			// 更新 K 线数据
			lastKLine.high = Math.max(lastKLine.high, newLine.highestPrice);
			lastKLine.low = Math.min(lastKLine.low, newLine.lowestPrice);
			lastKLine.close = newLine.closePrice;
			// 更新成交量数据
			lastVolume.value = newLine.volume;
			lastVolume.color = newLine.closePrice >= newLine.openPrice ? 'rgba(0, 150, 136, 0.8)' : 'rgba(255, 82, 82, 0.8)';
			if (this.klineSeries) this.klineSeries.update(lastKLine);
			if (this.volumeSeries) this.volumeSeries.update(lastVolume);
		},
		newLastKline(newLine) {
			const newKLine = {
				time: moment(newLine.time + 8 * 3600 * 1000).unix(),
				open: newLine.openPrice,
				high: newLine.highestPrice,
				low: newLine.lowestPrice,
				close: newLine.closePrice,
			};
			const newVolume = {
				time: moment(newLine.time + 8 * 3600 * 1000).unix(),
				value: newLine.volume,
				color: newLine.closePrice >= newLine.openPrice ? 'rgba(0, 150, 136, 0.8)' : 'rgba(255, 82, 82, 0.8)',
			};
			this.data.push(newKLine);
			this.volumeData.push(newVolume);
			if (this.klineSeries) this.klineSeries.update(newKLine);
			if (this.volumeSeries) this.volumeSeries.update(newVolume);
		},
		initCharts() {
			// 初始化 K 线图
			this.klineChart = createChart(this.$refs.klineChart, this.klineChartOptions);
			this.klineChart.timeScale().applyOptions(this.timeScaleOptions);
			if (this.priceScaleOptions) {
				this.klineChart.priceScale().applyOptions(this.priceScaleOptions);
			}
			this.klineSeries = this.klineChart.addCandlestickSeries(this.seriesOptions);
			this.klineSeries.setData(this.data);

			// 初始化成交量图
			this.volumeChart = createChart(this.$refs.volumeChart, this.volumeChartOptions);
			this.volumeChart.timeScale().applyOptions(this.HScaleOptions);
			this.volumeSeries = this.volumeChart.addHistogramSeries({
				color: '#f0f0f0',
				priceFormat: { type: 'volume' },
			});
			this.volumeSeries.setData(this.volumeData);

			// **同步 X 轴的缩放和拖动**
			const klineTimeScale = this.klineChart.timeScale();
			const volumeTimeScale = this.volumeChart.timeScale();

			klineTimeScale.subscribeVisibleTimeRangeChange((range) => {
				console.log(range)
				if (range) volumeTimeScale.setVisibleRange(range);
			});

			volumeTimeScale.subscribeVisibleTimeRangeChange((range) => {
				console.log(range)
				if (range) klineTimeScale.setVisibleRange(range);
			});

			this.klineChart.subscribeCrosshairMove((param) => {
				console.log(param)
				if (param.point) {
					const price = param.seriesPrices.get(this.klineSeries);
					console.log(price)
					if (price) {
						this.high = price.high.toFixed(2);
						this.open = price.open.toFixed(2);
						this.low = price.low.toFixed(2);
						this.close = price.close.toFixed(2);
						// this.value = valueData.toFixed(2);
					}
					const valueData = param.seriesPrices.get(this.volumeSeries)
					console.log(valueData)
					if (valueData) {
						this.value = valueData.toFixed(2);
					}
				}
			});
			this.volumeChart.subscribeCrosshairMove((param) => {
				console.log(param)
				if (param.point) {
					const valueData = param.seriesPrices.get(this.volumeSeries)
					if (valueData) {
						this.value = valueData.toFixed(2);
					}
				}
			});
		},


		destroyCharts() {
			if (this.klineChart) {
				this.klineChart.remove();
				this.klineChart = null;
			}
			if (this.volumeChart) {
				this.volumeChart.remove();
				this.volumeChart = null;
			}
			this.klineSeries = null;
			this.volumeSeries = null;
			window.removeEventListener('resize', this.resizeHandler);
		},
		resizeHandler() {
			if (this.klineChart && this.$refs.klineChart) {
				const klineDimensions = this.$refs.klineChart.getBoundingClientRect();
				this.klineChart.resize(klineDimensions.width, klineDimensions.height);
			}
			if (this.volumeChart && this.$refs.volumeChart) {
				const volumeDimensions = this.$refs.volumeChart.getBoundingClientRect();
				this.volumeChart.resize(volumeDimensions.width, volumeDimensions.height);
			}
		},
		fitContent() {
			if (!this.klineChart) return;
			this.klineChart.timeScale().fitContent();
		},
		getChart() {
			return this.klineChart;
		},
	},
};
</script>
  
<style scoped>
.lw-chart-container {
	position: relative;
	width: 100%;
	height: 100%;
}

.tabs {
	display: flex;
	align-items: center;
	margin-bottom: 10px;
}

.tabs button {
	margin-right: 10px;
}

.more-wrapper {
	position: relative;
}

.dropdown {
	position: absolute;
	top: 100%;
	left: 0;
	background: #0b1520;
	padding: 5px;
	z-index: 10;
}

.chart-wrapper {
	display: flex;
	flex-direction: column;
}

.kline-chart,
.volume-chart {
	width: 100%;
}

.kline-chart {
	flex: 0 0 400px;
	/* K 线图高度 */
}

.volume-chart {
	flex: 0 0 200px;
	/* 成交量图高度 */
}

.price-display,
.position {
	margin-top: 10px;
	color: #fff;
}
</style>
  

<style scoped>
.lw-chart-container {
	position: relative;
	height: 100%;
	width: 100%;
	overflow: hidden;
}

.lw-chart {
	height: 100%;
	width: 100%;
}

.price-display {
	position: absolute;
	display: flex;
	top: 25px;
	left: 5px;
	background: rgba(0, 0, 0, 0.7);
	padding: 0px;
	border-radius: 4px;
	color: #fff;
	font-family: Arial, sans-serif;
	font-size: 14px;
	z-index: 10;

	div {
		padding: 0 5px;
	}
}

.price-display .value {
	color: #26a69a;
	/* 可根据需要调整颜色 */
}

.value {
	color: #26a69a;
	/* 可根据需要调整颜色 */
}


.tabs {
	display: flex;
	align-items: center;
	position: relative;
}

.tabs button {
	background-color: #0D151F;
	color: white;
	border-right: 1px solid black;
	padding: 1px;
	border: none;
	cursor: pointer;
	padding: 0 8px;
	transition: background-color 0.3s;
}

.tabs button:hover {
	background-color: #292B31;
	border-radius: 5px;
}

/* 高亮选中的按钮 */
.tabs button.active {
	border-radius: 5px;
	background-color: #292B31;
	color: white;
}

/* 更多按钮样式 */
.more-btn {
	background-color: #0D151F;
	color: white;
	border: none;
	cursor: pointer;
	padding: 0 8px;
	transition: background-color 0.3s;
}

.more-btn:hover {
	background-color: #292B31;
	border-radius: 5px;
}



.tabs .dropdown {
	display: block;
}


.more-wrapper {
	position: relative;
	margin-left: 10px;
}

.chart-container {
	width: 100%;
	/* height: 800px; */
}



.tabs button {
	background-color: #0D151F;
	color: white;
	border-right: 1px solid black;
	padding: 1px;
	border: none;
	cursor: pointer;
	padding: 0 8px;
	transition: background-color 0.3s;
}


/* 更多按钮容器 */
.more-wrapper {
	position: relative;
	margin-left: 10px;
}

/* 更多按钮样式 */
.more-btn {
	background-color: #0D151F;
	color: white;
	border: none;
	cursor: pointer;
	padding: 0 8px;
	transition: background-color 0.3s;
}

.more-btn:hover {
	background-color: #292B31;
	border-radius: 5px;
}

/* 悬浮框样式 */
.dropdown {
	position: absolute;
	top: 100%;
	/* 从更多按钮的底部开始 */
	left: 0;
	background-color: #0D151F;
	border: 1px solid #333;
	border-radius: 5px;
	z-index: 1000;
	box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
	display: none;
	min-width: 100px;
}

.more-wrapper .dropdown {
	display: block;
}

.dropdown button {
	display: block;
	width: 100%;
	text-align: left;
	padding: 8px 12px;
	border: none;
	background-color: transparent;
	color: white;
	cursor: pointer;
	transition: background-color 0.3s;
}

.dropdown button:hover {
	border-radius: 5px;
	background-color: #292B31;
}

/* 悬浮框中高亮选中的按钮 */
.dropdown button.active {
	background-color: #292B31;
	border-radius: 5px;
	color: white;
}

.up-to-date {
	display: flex;
	align-items: center;
}

.position {
	position: absolute;
	z-index: 1000;
	top: 450px;
}
</style>