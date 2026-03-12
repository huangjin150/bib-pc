<template>
	<div class="chart-container">
		<div class="tabs">
			<!-- 时间选择按钮 -->
			<button v-for="resolution in resolutions" :key="resolution.time"
				:class="{ 'active': localResolution === resolution.time }" @click="changeResolution(resolution)">
				{{ getResolutionText(resolution.time) }}
			</button>

			<!-- 更多按钮 -->
			<div class="more-wrapper" @mouseenter="showMoreOptions = true" @mouseleave="showMoreOptions = false">
				<button class="more-btn">
					更多
				</button>

				<!-- 悬浮框 -->
				<div v-if="showMoreOptions" class="dropdown">
					<button v-for="moreOption in moreOptions" :key="moreOption"
						:class="{ 'active': localResolution === moreOption }" @click="changeResolution(moreOption)">
						{{ getResolutionText(moreOption) }}
					</button>
				</div>
			</div>
		</div>
		<div v-if="tooltipData" class="up-to-date">
			<div style="position: absolute;
    top: 400px;
    left: 20px;">量：{{ tooltipData[0] }}</div>
			<div> 开：{{ tooltipData[1] }}</div>
			<div> 收：{{ tooltipData[2] }}</div>
			<div> 高：{{ tooltipData[3] }}</div>
			<div> 低：{{ tooltipData[4] }}</div>
		</div>
		<div ref="chart" class="chart"></div>
	</div>
</template>

<script>
import * as echarts from "echarts";
import moment from 'moment';
var SockJS = require("sockjs-client");

export default {
	props: {
		currentResolution: {
			type: String,
			default: "15"
		},
		symbol: {
			type: String,
			require: true
		}
	},
	watch: {
		symbol(newSymbol, oldSymbol) {
			if (newSymbol !== oldSymbol) {
				this.init(); // 重新加载数据
			}
		}
	},
	data() {
		return {
			myChart: null,
			tooltipData: null,
			resizeObserver: null,
			chartData: null,
			chartsSize: 90,
			localResolution: this.currentResolution,
			// 时间分辨率选项
			resolutions: [
				//'1', '5', '15', '30', '1h', '4h', '1d'
				{
					time: '1',
					size: 97,
				},
				{
					time: '5',
					size: 95,
				},
				{
					time: '15',
					size: 93,
				},
				{
					time: '30',
					size: 91,
				},
				{
					time: '1h',
					size: 89,
				},
				{
					time: '4h',
					size: 87,
				}
			],
			// 更多选项
			moreOptions: ['1w', '1m'],
			// 是否显示更多选项
			showMoreOptions: false
		};
	},
	async mounted() {
		// 确保 DOM 更新完成后再初始化图表
		this.$nextTick(async () => {
			this.init()
			this.initChart()
			this.addResizeListener();
		});
	},
	beforeDestroy() {
		if (this.myChart) {
			this.myChart.dispose();
		}
		this.removeResizeListener();
	},
	methods: {
		async init() {
			this.myChart = echarts.init(this.$refs.chart);
			console.log(this.myChart)
			await this.fetchData();
			this.dispatchBrushAction();
			this.setChartOption();

		},
		async fetchData() {
			console.log("this.localResolution", this.localResolution)
			try {
				// const response = await this.$http.get("http://192.168.0.102:1101/history ", {
				const response = await this.$http.get(this.swapHost + "/history", {
					params: {
						//symbol: "BTC/USDT",
						symbol: this.symbol,
						resolution: this.localResolution,
						from: 0, // 30天前的时间戳
						to: Date.now(), // 当前时间戳
					}
				});
				this.chartData = this.processData(response.body);
				//console.log(this.chartData)
			} catch (error) {
				console.error("数据获取失败:", error);
			}
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
				'1m': '1月'
			};
			return resolutionMap[resolution] || resolution;
		},

		processData(rawData) {
			const categoryData = [];
			const values = [];
			const volumes = [];

			rawData.forEach(item => {
				// Assuming the data format is [time, open, high, low, close, volume]
				const time = item[0];
				const open = item[1];
				const high = item[2];
				const low = item[3];
				const close = item[4];
				const volume = item[5];

				// Convert time to date string
				const date = moment(time).format("YYYY-MM-DD HH:mm");
				
				categoryData.push(date);
				values.push([
					open,
					close,
					low,
					high
				]);
				volumes.push([
					rawData.indexOf(item),
					volume,
					close > open ? 1 : -1
				]);
			});
			return {
				categoryData,
				values,
				volumes
			};
		},

		initChart() {
			const chartDom = this.$refs.chart;
			const chartInstance = echarts.init(chartDom);
			// 监听鼠标移动事件
			// chartInstance.on('mousemove', (params) => {
			// 	//console.log(params)
			// 	this.tooltipData = params.data;
			// });

			// chartInstance.on('tooltip', function (params) {
			// 	//console.log('十字线数据:', params);
			// });
		},
		refreshKline(data){
			let newLine=null
			if (this.localResolution == 1) {
				newLine=data["1m"]
			} else if (this.localResolution == 5) {
				newLine=data["5m"]
			} else if (this.localResolution == 15) {
				newLine=data["15m"]
			} else if (this.localResolution == 30) {
				newLine=data["30m"]
			} else if (this.localResolution == "1h") {
				newLine=data["1h"]
			} else if (this.localResolution == "4h") {
				newLine=data["4h"]
			} else if (this.localResolution == "1D") {
				newLine=data["1d"]
			} else if (this.localResolution == "1w") {
				newLine=data["1w"]
			} else if (this.localResolution == "1M") {
				newLine=data["1M"]
			}
			const newDate = moment(newLine.time).format("YYYY-MM-DD HH:mm");
			let kLineLastTime = this.chartData.categoryData[this.chartData.categoryData.length - 1];
			if(newDate>kLineLastTime){
				//新增
				this.newLastKline(newLine);
			}else{
				//更新
				this.updateLastKline(newLine);
			}
		},
		updateLastKline(data) {
			this.chartData.values[this.chartData.values.length - 1][1]= data.closePrice
			this.chartData.values[this.chartData.values.length - 1][2]= data.lowestPrice
			this.chartData.values[this.chartData.values.length - 1][3]= data.highestPrice
			this.chartData.volumes[this.chartData.volumes.length - 1] = data.volume
			this.updateData()

		},
		newLastKline(data) {
			const value=[data.openPrice,data.closePrice,data.lowestPrice,data.highestPrice]
			const volume=[data.volume]
			const date = moment(data.time).format("YYYY-MM-DD HH:mm");
			console.log("newLastKline-------------------", date)
			this.chartData.categoryData.push(date);
			this.chartData.values.push(value);
			this.chartData.volumes.push(volume);
			this.updateData()
		},
		timeIntevelSum(dateStr1, dateStr2) {
			const date1 = new Date(dateStr1.replace(' ', 'T') + ':00');
			const date2 = new Date(dateStr2.replace(' ', 'T') + ':00');
			const timeDiff = Math.abs(date2 - date1);
			const minutesDiff = Math.floor(timeDiff / (1000 * 60));

			return minutesDiff;
		},
		setChartOption() {
			const latestData = this.chartData.values[this.chartData.values.length - 1]; // 获取最新的 K 线数据
			this.tooltipData = latestData
			console.log('1111', this.tooltipData)
			const latestClose = latestData[1]; // 获取最新的收盘价
			console.log(latestClose)
			const option = {
				animation: false,
				backgroundColor: 'transparent', // 设置背景颜色为透明
				tooltip: {
					trigger: 'axis',
					showContent: false, // 隐藏悬浮框
					position: [0, 0],
					axisPointer: {
						type: 'cross',
						snap: true,
						label: {
							show: true // 隐藏指示器上的文本标签
						}
					},
					legend: {
						show: false
					},
					borderWidth: 1,
					borderColor: '#ccc',
					padding: 10,
					textStyle: {
						color: '#000'
					},
					position: (pos, params, el, elRect, size) => {
						const obj = {
							top: 10
						};
						obj[['left', 'right'][+(pos[0] < size.viewSize[0] / 2)]] = 30;
						return obj;
					}
				},
				axisPointer: {
					link: [{
						xAxisIndex: 'all'
					}],
					label: {
						backgroundColor: '#777'
					}
				},
				// toolbox: {
				// 	feature: {
				// 		dataZoom: {
				// 			yAxisIndex: false
				// 		},
				// 		brush: {
				// 			type: ['lineX', 'clear']
				// 		}
				// 	}
				// },
				// brush: {
				// 	xAxisIndex: 'all',
				// 	brushLink: 'all',
				// 	outOfBrush: {
				// 		colorAlpha: 1
				// 	}
				// },
				visualMap: {
					show: false,
					seriesIndex: 5,
					dimension: 2,
					pieces: [{
						value: 1,
						color: '#80353D'
					},
					{
						value: -1,
						color: '#315E45'
					}
					]
				},
				grid: [{
					left: '1%',
					top: '5%',
					right: '5%',
					height: '50%',

				},
				{
					left: '1%',
					right: '5%',
					top: '60%',
					height: '30%',

				}
				],
				xAxis: this.getXAxis(),
				yAxis: [{
					scale: true,
					position: 'right',
					splitArea: {
						show: false
					},
					splitLine: {
						show: false
					}, // 隐藏分割线
				},

				{
					scale: true,
					gridIndex: 1,

					axisLabel: {
						show: false
					},
					axisLine: {
						show: false
					},
					splitLine: {
						show: false
					}, // 隐藏分割线

				},
				],
				dataZoom: [{
					type: 'inside',
					xAxisIndex: [0, 1],
					start: this.chartsSize, // 初始显示范围的起始百分比
					end: 100 // 初始显示范围的结束百分比
				},
				{
					show: false, // 隐藏滚动条
					xAxisIndex: [0, 1],
					type: 'slider',
					top: '85%',
					start: this.chartsSize, // 初始显示范围的起始百分比
					end: 100 // 初始显示范围的结束百分比
				}
				],
				series: this.getSeries().concat([{
					type: 'line',
					data: [],
					markLine: {
						silent: true, // 静默模式，鼠标移入不会触发事件
						label: {
							show: true,
							position: 'end',
							formatter: '{b}: {c}'
						},
						lineStyle: {
							type: 'dashed',
							width: 2,
							color: '#ff7300'
						},
						data: [{
							yAxis: latestClose, // 使用最新的收盘价作为横线的 Y 轴值
						}]
					}
				}])
			}
			this.myChart.setOption(option);
			// window.addEventListener('resize', () => {
			// 	this.myChart.resize();
			// });
		},
		addResizeListener() {
			this.resizeObserver = new ResizeObserver(entries => {
				for (let entry of entries) {
					if (entry.target === this.$refs.chartContainer) {
						this.handleResize();
					}
				}
			});
			this.resizeObserver.observe(this.$refs.chartContainer);
		},
		removeResizeListener() {
			if (this.resizeObserver) {
				this.resizeObserver.unobserve(this.$refs.chartContainer);
				this.resizeObserver.disconnect();
			}
		},

		calculateMA(dayCount) {
			const result = [];
			const values = this.chartData.values;

			for (let i = 0; i < values.length; i++) {
				if (i < dayCount) {
					result.push('-');
					continue;
				}
				let sum = 0;
				for (let j = 0; j < dayCount; j++) {
					sum += values[i - j][1]; // 收盘价
				}
				result.push(+(sum / dayCount).toFixed(3));
			}
			return result;
		},
		dispatchBrushAction() {
			this.myChart.dispatchAction({
				type: 'brush',
				areas: [{
					brushType: 'lineX',
					xAxisIndex: 0,
					coordRange: [0, 100] // 指定坐标范围
				}]
			});
		},
		changeResolution(resolution) {
			console.log("resolution", resolution)
			this.localResolution = resolution.time;
			this.chartsSize = resolution.size
			this.fetchData();
			this.setChartOption();
			// this.updateData();
		},

		updateData() {
			this.myChart.setOption({
				series: this.getSeries().concat([{
					type: 'line',
					data: [],
					markLine: {
						data: [{
							yAxis: this.chartData.values[this.chartData.values.length - 1][
								1
							], // 更新为最新的收盘价
						}]
					}
				}]),
				xAxis: this.getXAxis()
			}, false, true);
		},
		getSeries() {
			const upColor = '#4CA56E';
			const downColor = '#EA5461';
			return [{
				//name: 'BTC/USDT',
				name: this.symbol,
				type: 'candlestick',
				data: this.chartData.values,
				itemStyle: {
					color: upColor,
					color0: downColor,
					borderColor: upColor,
					borderColor0: downColor
				},
				xAxisIndex: 0,
				yAxisIndex: 0 
			},
			{
				name: 'MA5',
				type: 'line',
				showSymbol: false,
				data: this.calculateMA(5),
				smooth: true,
				lineStyle: {
					opacity: 0.9
				}
			},
			{
				name: 'MA10',
				type: 'line',
				showSymbol: false,
				data: this.calculateMA(10),
				smooth: true,
				lineStyle: {
					opacity: 0.9
				}
			},
			{
				name: 'MA20',
				type: 'line',
				data: this.calculateMA(20),
				smooth: true,
				showSymbol: false,
				lineStyle: {
					opacity: 0.9
				}
			},
			{
				name: 'MA30',
				type: 'line',
				data: this.calculateMA(30),
				smooth: true,
				showSymbol: false,
				lineStyle: {
					opacity: 0.9
				}
			},
			{
				name: 'Volume',
				type: 'bar',
				xAxisIndex: 1,
				yAxisIndex: 1,
				data: this.chartData.volumes
			}
			]
		},
		getXAxis() {
			return [{
				type: 'category',
				data: this.chartData.categoryData,
				boundaryGap: false,
				axisLine: {
					onZero: false,
					show: true
				},
				splitLine: {
					show: false
				}, // 隐藏分割线
				axisTick: {
					show: false
				},
				axisLabel: {
					show: false
				},
				splitLine: {
					show: false
				},
				min: 'dataMin',
				max: 'dataMax',
				axisPointer: {
					z: 100
				}
			},{
				type: 'category',
				data: this.chartData.categoryData,
				boundaryGap: false,
				axisLine: {
					onZero: false,
					show: true
				},
				splitLine: {
					show: false
				}, // 隐藏分割线
				axisTick: {
					show: false
				},
				axisLabel: {
					show: false
				},
				splitLine: {
					show: false
				},
				min: 'dataMin',
				max: 'dataMax',
				axisPointer: {
					z: 100
				},
				gridIndex: 1,
			},
			]
		},
		handleResize() {
			if (this.chart) {
				this.chart.resize();
			}
		}
	}
}
</script>

<style scoped>
.chart {
	width: 100%;
	height: 620px;
}

.chart-container {
	width: 100%;
	/* height: 800px; */
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
</style>