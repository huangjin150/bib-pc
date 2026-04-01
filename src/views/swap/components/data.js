
export default function getData(self) {
	return {
		currentConnectionId: null,
		// buyLeverage: "10",
		// sellLeverage: "10",
		showMarginTip: false,
		leverage: "10",
		marks: {
			0: '',
			20: '',
			40: '',
			60: '',
			80: '',
			100: ''
		},
		value1: 0,
		showPopup: false,
		changeLeverageType: 1, // 多仓：1，空仓：2
		leverageList: [],
		leverageModal: false,
		leverageLong: 10,
		leverageShort: 10,
		holderslength: 0,
		currentlength: 0,
		leverageAdjustVal: 10,
		leverageModalValue: 10,
		checkSellCount: 0,
		hide: true,
		checkBuyCount: 0,
		checkAllCount: 0,
		marginModeModal: false,
		pageVisibility: 'visible',
		marginMode: '0',
		accountMode: 0,
		entrustType: 1,
		entrustOrderType: "0",
		sliderStep: [25, 50, 75, 100],
		sliderOpenPercent: 0,
		activeName: 'first',
		sliderClosePercent: 0,
		memberRate: 0,
		// userRealVerified: false, //是否实名认证
		collecRequesting: false,
		currentCoinIsFavor: false,
		openFee: '',
		isUseBHB: false,
		skin: "night", //皮肤样式day&night
		currentImgTable: "k",
		selectedOrder: "currentPositions", //当前显示的委托记录
		selectedPlate: "all", //当前显示的买卖盘
		CNYRate: null,
		datafeed: null,
		defaultPath: "btc_usdt",
		basecion: "usdt",
		coinScale: 6,
		baseCoinScale: 6,
		symbolFee: 0.001,
		dataIndex: [],
		searchKey: "",
		coinInfo: {

		},
		leverageType: 1,
		contractCoinInfo: {
			id: 0,
			baseSymbol: "",
			coinSymbol: "",
			symbol: "",
			openFee: 0,
			closeFee: 0,
			enableTriggerEntrust: 1,
			feePercent: 0,
			leverageType: 1,
			leverage: "10,20,30,40,50,60,70,80,90,100",
			maxShare: 0,
			minShare: 0,
			shareNumber: 0
		},
		contractWalletInfo: {
			usdtBalance: 0.0,
			usdtBuyPosition: 0.0,
			usdtSellPosition: 0.0,
			usdtBuyLeverage: 10,
			usdtSellLeverage: 10,
			usdtFrozenBalance: 0.0,
			usdtBuyPrincipalAmount: 0.0,
			usdtSellPrincipalAmount: 0.0
		},
		currentCoin: {
			base: "",
			coin: "",
			symbol: "",
			price: 0.0
		},
		enableMarketBuy: 1, // 0:禁用  1:启用
		enableMarketSell: 1,
		exchangeable: 1, // 0:可交易   1:不可交易
		currentEntrustOrderList: [],
		historyEntrustOrderList: [],
		currentPositionList: [],
		historyHoldersList: [],
		profitLossForm: {
			id: '',
			targetProfit: "",
			targetLoss: "",
			openPrice: '',
			volume: 0
		},
		coinList: [],
		profitLossModel: false,
		backhandtradingModel: false,
		backhandData: {},
		tabs: [{
			name: 'first',
			label: '委托订单'
		},
		{
			name: 'second',
			label: '最新交易'
		},
		],
		coins: {
			_map: [],
			USDT: [],
			columns: [{
				title: self.$t("swap.contract") + "/" + self.$t("swap.vol"),
				key: "coin",
				minWidth: 70,
				sortable: false,
				className: "coin-menu-symbol swap-coin-menu-symbol",
				render: (h, params) => {
					return h("div", {
						style: {
							padding: "8px 0",
							display: "flex",
							alignItems: "center"
						}
					}, [
						h("img", {
							attrs: {
								src: params.row.logo,
								alt: params.row.coin + "图标",
								width: 24,
								height: 24
							},
							style: {
								marginRight: "10px",
								borderRadius: "50%",
								verticalAlign: "middle",
								flexShrink: 0
							}
						}),
						h("div", {
							style: {
								flex: 1,
								minWidth: 0
							}
						}, [
							h("div", {
								style: {
									fontSize: "14px",
									fontWeight: "bold",
									marginBottom: "6px",
									lineHeight: "1.2"
								}
							}, params.row.coin + "/USDT " + self.$t("swap.swapindex")),
							h("div", {
								style: {
									color: "#61688A",
									fontSize: "14px",
									lineHeight: "1.2"
								}
							}, params.row.volume.toFixed(4))
						])
					]);
				}
			},
			{
				title: self.$t("swap.lastprice") + "/" + self.$t("swap.daychange"),
				key: "rose",
				className: "swap-coin-menu-lastprice",
				sortMethod: function (a, b, type) {
					let a1 = a.replace(/[^\d|.|-]/g, "") - 0;
					let b1 = b.replace(/[^\d|.|-]/g, "") - 0;
					if (type == "asc") {
						return a1 - b1;
					} else {
						return b1 - a1;
					}
				},
				render: (h, params) => {
					const row = params.row;
					const className = parseFloat(row.rose) < 0 ? "sell" : "buy";
					return h("div", {
						style: {
							textAlign: "right",
							fontSize: "14px"
						}
					}, [
						h("div", {
							style: {
								lineHeight: "1.2"
							}
						}, params.row.close),
						h("div", {
							attrs: {
								class: className
							},
							style: {
								lineHeight: "1.2"
							}
						}, row.rose)
					]);
				}
			}]
		},
		wallet: {
			base: 0.0,
			coin: 0.0
		},
		showMarket: false,
		fixHistoryHeight: 295,
		// rechargeUrl:'#/finance/recharge',
		// rechargeUSDTUrl:'#/finance/recharge?name=USDT',
		form: {
			trigglePrice: "",
			entrustPrice: "",
			volume: ""
		},
		trade: {
			rows: [],
			columns: [{
				title: self.$t("swap.price"),
				key: "price",
				render: (h, params) => {
					const row = params.row;
					const className = row.direction == "BUY" ? "buy" : "sell";

					return h(
						"span", {
						attrs: {
							class: className
						}
					},
						params.row.price.toFixed(self.accuracys(self.currentCoin.symbol))
					);
				},
				renderHeader: (h, params) => {
					const title =
						self.$t("swap.price") + "(" + currentCoin.base + ")";
					return h("span", {}, title);
				}
			},
			{
				title: self.$t("swap.num"),
				key: "amount",
				render: (h, params) => {
					return h("span", {}, params.row.amount.toFixed(4));
				},
				renderHeader: (h, params) => {
					const title =
						self.$t("swap.num") + "(" + self.currentCoin.coin + ")";
					return h("span", {}, title);
				}
			},
			{
				title: self.$t("swap.time"),
				key: "time",
				render: (h, params) => {
					return h("span", {}, self.timeFormat(params.row.time));
				}
			}
			]
		},
		//   最新价的 table 数据;
		plate: {
			maxPostion: 13,
			columns: [{
				title: self.$t("swap.price"),
				width: 120,
				key: "price",
				render: (h, params) => {
					let str = "";
					let price = "";
					const className = params.row.direction.toLowerCase();
					params.row.price == 0 && (str = h("span", {}, "--"));
					params.row.price != 0 &&
						(price = params.row.price.toFixed(self.accuracys(self.currentCoin.symbol))) &&
						(str = h(
							"span", {
							attrs: {
								class: className
							}
						},
							price
						));
					return str;
				},
				renderHeader: (h, params) => {
					const title =
						self.$t("swap.price") + "(" + self.currentCoin.base + ")";
					return h("span", {}, title);
				}
			},
			{
				title: self.$t("swap.num"),
				key: "amount",
				render: (h, params) => {
					let str = "";
					params.row.amount == 0 && (str = h("span", {}, "--"));
					params.row.amount != 0 &&
						(str = h(
							"span", {},
							params.row.amount.toFixed(4)
						));
					return str;
				},
				renderHeader: (h, params) => {
					const title =
						self.$t("swap.num") + "(" + self.currentCoin.coin + ")";
					return h("span", {}, title);
				}
			},
			{
				title: self.$t("swap.total"),
				key: "totalAmount",
				render: (h, params) => {
					if (params.row.price == 0 || params.row.totalAmount == 0) {
						return h("span", {}, "--");
					} else {
						return h(
							"span", {},
							params.row.totalAmount.toFixed(4)
						);
					}
				},
				renderHeader: (h, params) => {
					const title =
						self.$t("swap.total") + "(" + self.currentCoin.coin + ")";
					return h("span", {}, title);
				}
			},
			{
				className: "percenttd",
				width: 1,
				render: (h, params) => {
					let width = "0",
						backgroundColor =
							params.row.direction === "BUY" ? "#00b275" : "#f15057",
						totle =
							params.row.direction === "BUY" ?
								self.plate.bidTotle :
								self.plate.askTotle;
					if (params.row.totalAmount) {
						width = (params.row.totalAmount / totle).toFixed(4) * 100 + "%";
					}
					return h(
						"div", {
						style: {
							width,
							backgroundColor
						},
						attrs: {
							class: "percentdiv"
						}
					},
						" "
					);
				}
			}
			],
			askRows: [],
			bidRows: []
		},
		currentPosition: {//当前持仓
			columns: [{
				title: self.$t("swap.pos_leverage"),
				width: 120,
				key: "leverage",
				render: (h, params) => {
					if (params.row.direction == 0) {
						return h("span", {
							style: {
								color: '#FFF',
								backgroundColor: "#42b983",
								padding: "3px 5px",
								borderRadius: "3px",
								display: "inline-block",
								width: "100px"
							}
						}, params.row.symbol + self.$t("swap.pos_long") + " " + params.row
							.leverage + "X");
					} else {
						return h("span", {
							style: {
								color: '#FFF',
								backgroundColor: "#FF0000",
								padding: "3px 5px",
								borderRadius: "3px",
								display: "inline-block",
								width: "100px"
							}
						}, params.row.symbol + self.$t("swap.pos_short") + " " + params.row
							.leverage + "X");
					}
				}
			},
			{
				title: self.$t("swap.pos_pos"),
				width: 120,
				key: "volume",
				render: (h, params) => {
					return h("span", {
						style: {
							display: "inline-block",
							width: '100px',
						}
					}, params.row.volume + params.row.coinSymbol);
				}
			},
			{
				title: self.$t("swap.pos_openPrice"),
				width: 120,
				key: "tradedPrice",
				render: (h, params) => {
					return h("span", {
						style: {
							display: "inline-block",
							width: '100px',
						}
					}, params.row.tradedPrice);

				}
			},
			{
				title: "标记价格",
				width: 120,
				key: "closePrice",
				render: (h, params) => {
					let currentCoin = self.getCoin(params.row.symbol)
					return h("span", {
						style: {
							width: '100px',
						}
					}, currentCoin.close);
				}
			},
			{
				title: self.$t("swap.pos_qiangping"),
				width: 120,
				key: "qiangping",
				render: (h, params) => {
					let data = params.row;
					let currentCoin = self.getCoin(data.symbol)
					let mintHolderUsdt = data.tradedPrice * data.volume * currentCoin.maintenanceMarginRate
					/**
					 * 强平价格计算
					 * 1.全仓： 可用保证金<最小维持保证金
					 *   钱
					 */
					// console.log("钱包余额：",self.contractWalletInfo.usdtBalance)
					// console.log("未实现盈亏之和：",self.unrealizedProfitAndLoss())
					let shouyi = (currentCoin.close - data.tradedPrice) * data.volume
					if (data.direction == 1) {
						shouyi = (data.tradedPrice - currentCoin.close) * data.volume
					}
					let totalCanUse = self.contractWalletInfo.usdtBalance + self.unrealizedProfitAndLoss() - shouyi
					// console.log("可以爆仓的金额：",totalCanUse)
					let blastPrice = data.tradedPrice - ((totalCanUse - mintHolderUsdt) / data.volume)
					if (data.direction == 1) {
						blastPrice = data.tradedPrice + ((totalCanUse - mintHolderUsdt) / data.volume)
					}
					if (blastPrice < 0) {
						blastPrice = 0
					}
					return h("span", {
						style: {
							width: '120px',
						}
					}, blastPrice == 0 ? "--" : blastPrice.toFixed(
						4));
				}
			},
			{
				title: self.$t("swap.pos_Pl"),
				width: 120,
				key: "pl",
				render: (h, params) => {
					let data = params.row;
					let currentCoin = self.getCoin(data.symbol)
					let shouyi = (currentCoin.close - data.tradedPrice) * data.volume
					if (data.direction == 1) {
						shouyi = (data.tradedPrice - currentCoin.close) * data.volume
					}
					if (shouyi > 0) {
						return h("span", {
							style: {
								color: '#42b983'
							}
						}, "+" + shouyi.toFixed(4) + " USDT");
					}
					return h("span", {
						style: {
							color: '#FF0000',
							width: '100px',
						}
					}, shouyi.toFixed(4) + " USDT");
				}
			},
			{
				title: self.$t("swap.pos_Ratio"),
				width: 120,
				key: "plRatio",
				render: (h, params) => {
					let data = params.row;
					let currentCoin = self.getCoin(data.symbol)
					let shouyi = (currentCoin.close - data.tradedPrice) * data.volume
					if (data.direction == 1) {
						shouyi = (data.tradedPrice - currentCoin.close) * data.volume
					}
					let margin = data.volume * data.tradedPrice / data.leverage
					let value = shouyi / margin * 100
					if (value > 0) {
						return h("span", {
							style: {
								color: '#42b983',
								width: '100px',
							}
						}, value.toFixed(2) + " %");
					}
					return h("span", {
						style: {
							width: '100px',
							color: '#FF0000'
						}
					}, value.toFixed(2) + " %");
				}
			},
			{
				key: "mintHolderUsdt",
				width: 120,
				renderHeader: (h, params) => {
					return h('span', {

					}, [
						'维持保证金',
						h('Tooltip', {
							props: {
								content: `维持保证金=持仓名义价值*0.3%`,
								placement: 'top'
							}
						}, [
							h('img', {
								attrs: {
									src: require('../../../assets/images/wenhao.png'),
									alt: '问号',
									width: 16,
									height: 16
								},
								style: {
									marginLeft: '4px',
									cursor: 'pointer',
									verticalAlign: 'middle',
								}
							})
						])
					]);
				},
				render: (h, params) => {
					let data = params.row;
					let currentCoin = self.getCoin(data.symbol)
					let mintHolderUsdt = data.tradedPrice * data.volume * currentCoin.maintenanceMarginRate
					return h("span", {
						style: {
							width: '100px',
						}
					}, mintHolderUsdt.toFixed(2) + " USDT");
				}
			},
			{
				title: "占用保证金",
				width: 120, // 调整列宽
				key: "margin",
				renderHeader: (h, params) => {
					return h('span', [
						'占用保证金',
						h('Tooltip', {
							props: {
								content: '占用保证金=持仓量*开仓均价/杠杆倍数',
								placement: 'top'
							}
						}, [
							h('img', {
								attrs: {
									src: require('../../../assets/images/wenhao.png'),
									alt: '问号',
									width: 16,
									height: 16
								},
								style: {
									marginLeft: '4px',
									cursor: 'pointer',
									verticalAlign: 'middle'
								}
							})
						])
					]);
				},
				render: (h, params) => {
					let data = params.row;
					let margin = data.bond;
					if (data.patterns == 0) {//市价保证金
						margin = data.volume * data.tradedPrice / data.leverage
					}
					return h("span", {}, margin.toFixed(2) + " USDT",);

				}
			}, {
				title: "止盈止损", // 止盈止损列
				width: 200, // 调整列宽
				key: "stopLimit",
				render: (h, params) => {
					let targetProfit = params.row.targetProfit ? params.row.targetProfit.toFixed(2) : "--";
					let targetLoss = params.row.targetLoss ? params.row.targetLoss.toFixed(2) : "--";
					return h("div", {
						style: {
							display: "flex",
							alignItems: "center",
							justifyContent: "center"
						}
					}, [
						h("span", {}, `${targetProfit} / ${targetLoss}`), // 显示止盈/止损
						h(
							"a", {
							style: {
								color: "#f0a70a",
								marginLeft: "8px",
								cursor: "pointer",
							},
							on: {
								click: () => {
									self.profitLossForm.openPrice = params.row.tradedPrice
									self.profitLossForm.volume = params.row.volume
									self.profitLossForm.id = params.row.id
									self.profitLossForm.direction = params.row.direction//0.做多 1.做空
									self.profitLossForm.symbol = params.row.symbol
									self.profitLossForm.targetProfit = params.row.targetProfit
									self.profitLossForm.targetLoss = params.row.targetLoss
									self.editStopLimit();
								}
							}
						},
							self.$t("修改")
						)
					]);
				}
			}, {
				title: self.$t("操作"),
				key: "actions",
				width: 200, // 调整列宽
				render: (h, params) => {
					return h("div", {
						style: {

						}
					}, [
						// 平仓按钮
						h(
							"Button", {
							props: {
								size: "small",
								type: "error"
							},
							style: {
								backgroundColor: "#D0F500",
								margin: '0 5px 0  0',
								color: "#000",
								border: 'none'
							},
							on: {
								click: () => {
									self.closePosition(params.row);
								}
							}
						},
							self.$t("swap.close")
						),
						// 反手交易按钮
						h(
							"Button", {
							props: {
								size: "small",
								type: "error"
							},
							style: {
								backgroundColor: "#D0F500",
								color: "#000",
								border: 'none'
							},
							on: {
								click: () => {
									self.backhandtrading(params.row);
								}
							}
						},
							self.$t("swap.backhandtrading")
						),
						// 限价委托（带输入框）
						h("div", {
							style: {
								display: "flex",
								alignItems: "center"

							}
						}, [
							h(
								"Button", {
								props: {
									size: "small",
									type: "primary"
								},
								style: {
									backgroundColor: "#D0F500",
									color: "#000",
									border: 'none'
								},
								on: {
									click: () => {
										self.placeLimitOrder(params.row.id, params.row
											.limitPrice, params.row.limitAmount);
									}
								}
							},
								"限价"
							),
							h("input", {
								attrs: {
									type: "text",
									placeholder: self.$t("价格")
								},
								style: {
									width: "70px",
									margin: ' 0  3px  0  2px',
									padding: "3px",
									border: "1px solid #eee",
									outline: "#d0f500 ",
									backgroundColor: "#fff ",
									color: "#000",
								},
								domProps: {
									value: params.row.limitPrice
								},
								on: {
									input: event => {
										params.row.limitPrice = event.target.value;
									}
								}
							}),

							h("input", {
								attrs: {
									type: "text",
									placeholder: self.$t("数量")
								},
								style: {
									width: "70px",
									padding: "3px",
									border: "1px solid #eee",
									outline: "#d0f500 ",
									backgroundColor: "#fff ",
									color: "#000",
								},
								domProps: {
									value: params.row.limitAmount
								},
								on: {
									input: event => {
										params.row.limitAmount = event.target.value;
									}
								}
							})
						]),
					]);
				}
			}
			]
		},
		currentOrder: {//当前委托
			columns: [{
				title: self.$t("swap.time"),
				key: "createTime",
				render: (h, params) => {
					return h("span", {}, self.dateFormat(params.row.createTime));
				}
			},
			{
				title: "币种",
				key: "symbol",
				render: (h, params) => {
					return h("span", {}, params.row.symbol);
				}
			},
			{
				title: self.$t("swap.ent_entrustType"),
				key: "entrustType",
				render: (h, params) => {
					if (params.row.entrustType == "0") {
						return h("span", {}, self.$t("swap.open"));
					} else {
						return h("span", {}, self.$t("swap.close"));
					}
				}
			},
			{
				title: self.$t("swap.ent_direction"),
				key: "direction",
				render: (h, params) => {
					if (params.row.entrustType == "0") {
						if (params.row.direction == "0") {
							return h("span", {
								style: {
									color: "#42b983"
								}
							}, self.$t("swap.openup"));
						} else {
							return h("span", {
								style: {
									color: "#FF0000"
								}
							}, self.$t("swap.opendown"));
						}
					} else {
						if (params.row.direction == "0") {
							return h("span", {
								style: {
									color: "#42b983"
								}
							}, self.$t("swap.closedown"));
						} else {
							return h("span", {
								style: {
									color: "#FF0000"
								}
							}, self.$t("swap.closeup"));
						}
					}
				}
			},
			{
				title: self.$t("swap.ent_type"),
				key: "type",
				render: (h, params) => {
					if (params.row.type == "1") {
						return h("span", {}, self.$t("swap.limited_price"));
					} else if (params.row.type == "0") {
						return h("span", {}, self.$t("swap.market_price"));
					} else {
						return h("span", {}, self.$t("swap.spot_price"));
					}
				}
			},
			{
				title: self.$t("swap.ent_entrustPrice"),
				key: "entrustPrice",
				render: (h, params) => {
					return h("span", {}, params.row.entrustPrice.toFixed(2));
				}
			},
			{
				title: self.$t("swap.ent_tradedPrice"),
				key: "tradedPrice",
				render: (h, params) => {
					return h("span", {}, params.row.tradedPrice.toFixed(2));
				}
			},
			{
				title: self.$t("swap.ent_margin"),
				key: "principalAmount",
				render: (h, params) => {
					return h("span", {}, (params.row.principalAmount / self.leverage).toFixed(2) + "USDT");
				}
			},
			{
				title: self.$t("swap.ent_volume"),
				key: "volume",
				render: (h, params) => {
					return h("span", {}, params.row.volume + params.row.coinSymbol);
				}
			},
			{
				title: self.$t("swap.ent_status"),
				key: "status",
				render: (h, params) => {
					if (params.row.status == "0") {
						return h("span", {}, self.$t("swap.ent_status1"));
					} else if (params.row.status == "1") {
						return h("span", {}, self.$t("swap.ent_status2"));
					} else if (params.row.status == "2") {
						return h("span", {}, self.$t("swap.ent_status3"));
					} else if (params.row.status == "3") {
						return h("span", {}, self.$t("swap.ent_status4"));
					} else { }
				}
			},
			{
				title: self.$t("swap.action"),
				key: "operate",
				width: 110,
				render: (h, params) => {
					return h(
						"Button", {
						props: {
							size: "small"
						},
						style: {
							color: "#f1ac19",
							"line-height": "1.2",
							backgroundColor: "transparent"
						},
						on: {
							click: () => {
								self.cancel(params.row.id);
							}
						}
					},
						self.$t("swap.undo")
					);
				}
			}
			],
			rows: []
		},
		historyOrder: {
			pageSize: 10,
			total: 10,
			page: 0,
			columns: [{
				title: self.$t("swap.time"),
				key: "createTime",
				render: (h, params) => {
					return h("span", {}, self.dateFormat(params.row.createTime));
				}
			},
			{
				title: "币种",
				key: "symbol",
				render: (h, params) => {
					return h("span", {}, params.row.symbol);
				}
			},
			{
				title: self.$t("swap.ent_entrustType"),
				key: "entrustType",
				render: (h, params) => {
					if (params.row.entrustType == "0") {
						return h("span", {
							style: {
								color: "#42b983"
							}
						}, self.$t("swap.open"));
					} else {
						return h("span", {
							style: {
								color: "#FF0000"
							}
						}, self.$t("swap.close"));
					}
					// if (params.row.entrustType == "0") {
					// 	return h("span", {}, self.$t("swap.open"));
					// } else {
					// 	return h("span", {}, self.$t("swap.close"));
					// }
				}
			},
			{
				title: self.$t("swap.ent_direction"),
				key: "direction",
				render: (h, params) => {
					if (params.row.entrustType == "0") {
						if (params.row.direction == "0") {
							return h("span", {
								style: {
									color: "#42b983"
								}
							}, self.$t("swap.openup"));
						} else {
							return h("span", {
								style: {
									color: "#FF0000"
								}
							}, self.$t("swap.opendown"));
						}
					} else {
						if (params.row.direction == "0") {
							return h("span", {
								style: {
									color: "#FF0000"
								}
							}, self.$t("swap.closedown"));
						} else {
							return h("span", {
								style: {
									color: "#42b983"
								}
							}, self.$t("swap.closeup"));
						}
					}
				}
			},
			{
				title: self.$t("swap.ent_type"),
				key: "type",
				render: (h, params) => {
					if (params.row.isFromSpot == 1) {
						return h("span", {}, self.$t("swap.spot_price"));
					}
					if (params.row.type == "1") {
						return h("span", {}, self.$t("swap.limited_price"));
					} else if (params.row.type == "0") {
						return h("span", {}, self.$t("swap.market_price"));
					} else {
						return h("span", {}, self.$t("swap.spot_price"));
					}
				}
			},
			{
				title: self.$t("swap.ent_entrustPrice"),
				key: "entrustPrice",
				render: (h, params) => {
					return h("span", {}, params.row.entrustPrice.toFixed(2));
				}
			},
			{
				title: self.$t("swap.ent_tradedPrice"),
				key: "tradedPrice",
				render: (h, params) => {
					return h("span", {}, params.row.tradedPrice.toFixed(2));
				}
			},
			{
				title: self.$t("swap.ent_margin"),
				key: "principalAmount",
				render: (h, params) => {
					return h("span", {}, params.row.principalAmount.toFixed(2) + "USDT");
				}
			},
			{
				title: self.$t("swap.ent_volume"),
				key: "volume",
				render: (h, params) => {
					return h("span", {}, params.row.volume + params.row.coinSymbol);
				}
			},
			{
				title: "手续费",
				key: "rate",
				render: (h, params) => {
					return h("span", {}, params.row.openFee + params.row.closeFee);
				}
			},
			{
				title: self.$t("swap.ent_status"),
				key: "status",
				render: (h, params) => {
					if (params.row.isBlast == 1) {
						return h("span", {}, self.$t("swap.ent_statusblast"));
					}
					if (params.row.status == "1") {
						return h("span", {}, self.$t("swap.ent_status2"));
					} else if (params.row.status == "2") {
						return h("span", {}, self.$t("swap.ent_status3"));
					} else if (params.row.status == "3") {
						return h("span", {}, self.$t("swap.ent_status4"));
					}
				}
			}
			],
			rows: []
		},
		historyHolders: {
			pageSize: 10,
			total: 10,
			page: 0,
			columns: [{
				title: '开仓时间',
				key: "createTime",
				render: (h, params) => {
					return h("span", {}, self.dateFormat(params.row.createTime));
				}
			}, {
				title: '平仓时间',
				key: "triggeringTime",
				render: (h, params) => {
					return h("span", {}, params.row.triggeringTime > 0 ? self.dateFormat(params.row.triggeringTime) : '--');
				}
			},
			{
				title: self.$t("swap.ent_direction"),
				key: "direction",
				render: (h, params) => {
					let message = ""
					if (params.row.isBlast == 1) {
						message = "[爆仓]"
					}
					if (params.row.direction == "0") {
						return h("span", {
							style: {
								color: "#42b983"
							}
						}, "做多" + message);
					} else {
						return h("span", {
							style: {
								color: "#FF0000"
							}
						}, "做空" + message);
					}
				}
			},
			{
				title: "开仓价",
				key: "tradedPrice",
				render: (h, params) => {
					return h("span", {}, params.row.tradedPrice.toFixed(2));
				}
			},
			{
				title: "平仓价",
				key: "tradedPrice",
				render: (h, params) => {
					return h("span", {}, params.row.status == 1 ? params.row.closePrice.toFixed(2) : '--');
				}
			},
			{
				title: "最大持仓量",
				key: "maxVolume",
				render: (h, params) => {
					return h("span", {}, params.row.maxVolume + params.row.coinSymbol);
				}
			},
			{
				title: "平仓量",
				key: "closeVolume",
				render: (h, params) => {
					return h("span", {}, params.row.status == 1 ? params.row.closeVolume + params.row.coinSymbol : '--');
				}
			},
			{
				title: "实现盈亏",
				key: "profitAndLoss",
				render: (h, params) => {
					if (params.row.status == 0) {
						return h("span", {
							style: {
								color: "#42b983"
							}
						}, '--');
					}
					else if (params.row.profitAndLoss > 0) {
						return h("span", {
							style: {
								color: "#42b983"
							}
						}, params.row.profitAndLoss + " USDT");
					} else {
						return h("span", {
							style: {
								color: "#FF0000"
							}
						}, params.row.profitAndLoss + " USDT");
					}
				}
			},
			{
				title: "开/平仓手续费",
				key: "fee",
				render: (h, params) => {
					return h("span", {}, (params.row.openFee + params.row.closeFee).toFixed(4));
				}
			}
			],
			rows: []
		},
	};
}
