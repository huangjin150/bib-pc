<template>
	<div class="nav-rights">
		<div class="nav-right col-xs-12 col-md-10 padding-right-clear">
			<div class="bill_box rightarea padding-right-clear">
				<div class="shaow">
					<div class="money_table">
						<div style="width: 100%;height: 50px;">
							<div style="float:left;letter-spacing:1px;padding-top: 5px;">
								<div class="profit">
									今日已实现盈亏
									<span :class="{ 'negative': walletInfo.todayProfit < 0 }">{{
										walletInfo.todayProfit | fixed2 }}
										({{ walletInfo.todayProfitPercent | fixed2 }}%)
									</span>
								</div>
								<!-- <span style="font-size:12px;color:#828ea1;">{{$t('uc.finance.swap.totalassets')}}</span>
								<span style="font-size: 18px;color:#D8E1EB;">${{totalUSDT}}</span>
								<span style="font-size:10px;color:#828ea1;margin-left: 5px;"> ≈ ¥{{totalCny}}</span> -->
							</div>
							<Button type="primary" @click="onTransferClick"
								style="padding: 6px 15px;margin-right:30px;letter-spacing:2px;color:#f0ac19;background-color:transparent;border:1px solid #f0ac19;float:right;">{{
									$t('uc.finance.swap.transfor') }}</Button>
						</div>
					</div>
					<div>
						<div class="boder">
							<div class="flex">
								<div class="section">
									<div class="title">保证金余额(USDT)</div>
									<div class="amount">
										{{ walletInfo.canUse | fixed2 }}
									</div>
									<div class="sub-amount">≈ ￥{{ walletInfo.canUse * walletAsset.cnyRate | fixed2 }}
									</div>
								</div>
								<div class="section">
									<div class="title">钱包余额(USDT)</div>
									<div class="amount">{{ walletInfo.walletBalance | fixed2 }}</div>
									<div class="sub-amount">≈ ￥{{ walletInfo.walletBalance * walletAsset.cnyRate |
										fixed2
									}}</div>
								</div>
								<div class="section" v-if="walletInfo.rakeBack>0">
									<div class="title">返佣账户(USDT)</div>
									<div class="amount">{{ walletInfo.rakeBack | fixed2 }}
									<Button type="primary" @click="rewardRakeBack"
										style="padding: 3px 10px;margin-right:30px;letter-spacing:2px;color:#f0ac19;background-color:transparent;border:1px solid #f0ac19;float:right;">领取</Button>
									</div>
									<div class="sub-amount">≈ ￥{{ walletInfo.rakeBack * walletAsset.cnyRate |
										fixed2
									}}</div>
								</div>
								<div class="section">
									<div class="title Bottom_px">未实现盈亏(USDT)</div>
									<div :class="{
										'amount positive': walletInfo.unrealizedProfit > 0,
										'amount negative': walletInfo.unrealizedProfit < 0
									}">{{ walletInfo.unrealizedProfit }}</div>
									<div :class="{
										'sub-amount positive': walletInfo.unrealizedProfit > 0,
										'sub-amount negative': walletInfo.unrealizedProfit < 0
									}">≈ ￥{{ walletInfo.unrealizedProfit * walletAsset.cnyRate | fixed2 }}</div>
								</div>
							</div>
						</div>
						<div class="order-table">
							<Table :no-data-text="$t('common.nodata')" :columns="tableColumnsRecord"
								:data="filteredRecords" :disabled-hover="true" :loading="loading"></Table>
							<div style="margin: 10px;overflow: hidden">
								<div style="float: right;">
									<Page :total="total" :pageSize="pageSize" show-total :current="page"
										@on-change="changePage" id="record_pages"></Page>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
		<Modal v-model="transferModal" :title="$t('uc.finance.swap.transfor') + ' - USDT'">
			<div style="width: 100%; min-height: 32px;margin-top: 15px;">
				<div style="width: 45%;display: inline-flex;height:32px;line-height: 32px;float:left;">
					<Select v-model="walletOne" style="width: 450px;"
						:placeholder="$t('uc.finance.swap.currencyaccount') + '(USDT)'">
						<Option v-for="item in walletOneList" :value="item" :key="item">{{ item }}</Option>
					</Select>
				</div>

				<div v-if="transferDirection == 1" @click="changeTo(2)"
					style="width: 10%;float: left;text-align: center;font-size:18px;height: 30px; line-height:30px;font-weight: bold;color:">
					<Tooltip :content="$t('uc.finance.swap.clickchange')">
						<Icon style="font-weight:bold;color:#19be6b;" type="md-arrow-forward" />
					</Tooltip>
				</div>

				<div v-if="transferDirection == 2" @click="changeTo(1)"
					style="width: 10%;float: left;text-align: center;font-size:18px;height: 30px; line-height:30px;font-weight: bold;color:">
					<Tooltip :content="$t('uc.finance.swap.clickchange')">
						<Icon style="font-weight:bold;color:#19be6b;" type="md-arrow-back" />
					</Tooltip>
				</div>

				<div style="width: 45%;display: inline-flex;height:32px;line-height: 32px;float: right;">
					<Select style="width: 450px;" v-model="walletTwo"
						:placeholder="$t('uc.finance.swap.swapaccount') + '(USDT)'">
						<Option>{{ $t('uc.finance.swap.swapaccount') + '(USDT)' }}</Option>
					</Select>
				</div>
			</div>
			<div style="width: 100%; min-height: 20px;margin-top: 0px;font-size: 10px;color:rgb(97, 104, 138);">
				<div style="width: 50%;height:20px;line-height: 20px;float:left;text-align: left;">
					{{ $t('uc.finance.swap.avaamount') }}：{{ assetsWallet.balance | fixed2 }}
				</div>
				<div style="width: 50%;height:20px;line-height: 20px;float: right;text-align: right;">
					{{ $t('uc.finance.swap.avaamount') }}：{{ walletInfo.canUse | fixed2 }}
				</div>
			</div>
			<p style="margin-top: 15px;">{{ $t('uc.finance.swap.inputtransferamount') }}:
				<InputNumber style="width: 330px;margin-left:15px;" type="text" v-model="transferAmount"
					:placeholder="$t('uc.finance.swap.inputtransferamount')"></InputNumber>
				<span class="trans-all-btn" @click="onTransAll">{{ $t('uc.finance.swap.all') }}</span>
			</p>

			<div slot="footer">
				<Button size="large" @click="transferModal = false">{{ $t("common.close") }}</Button>
				<Button type="primary" size="large" @click="confirmOk">{{ $t("uc.finance.swap.oktransfer") }}</Button>
			</div>
		</Modal>
	</div>
</template>
<script>
export default {
	components: {},
	data() {
		return {
			loginmsg: this.$t("common.logintip"),
			loading: true,
			ordKeyword: "",
			walletAsset: {},
			searchKey: "",
			transferModal: false,
			transferDirection: 1,
			filteredRecords: [],
			walletOne: null,
			walletTwo: null,
			pageSize: 10,
			page: 1,
			total: 0,
			tableRecord: [],
			transferAmount: 0,
			predictAmount: 0,
			walletTwoList: [],
			walletOneList: [this.$t('uc.finance.swap.currencyaccount') + '(USDT)'],
			assetsWallet: {
				id: 0,
				balance: 0
			},
			swapWallet: {
				id: 0,
				avaBalance: 0
			},
			walletInfo: {
				marginBalance: 0,
				todayProfit: 0,
				todayProfitPercent: 0,
				walletBalance: 0,
				unrealizedProfit: 0,
				canUse: 0
			}
		};
	},
	methods: {
		getMoney() {
			//获取
			this.$http.post(this.swapHost + "/wallet/list").then(response => {
				var resp = response.body;
				if (resp.code == 0) {
					this.walletAsset = resp.data
					this.walletInfo.walletBalance = this.walletAsset.usdtBalance//钱包余额
					this.walletInfo.rakeBack = this.walletAsset.rakeBack//返佣账户
					this.walletInfo.marginBalance = this.walletInfo.walletBalance - this.walletInfo.unrealizedProfit//保证金余额
					this.walletInfo.todayProfit = this.walletAsset.usdtTodayProfitAndLoss//今日盈亏
					if (this.walletInfo.walletBalance != 0) {
						this.walletInfo.todayProfitPercent = this.walletInfo.todayProfit / this.walletInfo.walletBalance * 100//今日盈亏比例
					}
					this.walletInfo.marginBalanceUSD = this.walletInfo.walletBalance * this.walletAsset.cnyRate//钱包余额换算人民币
					this.walletInfo.unrealizedProfit = this.walletAsset.unsettledProfitAndLos//未实现盈亏
					this.walletInfo.canUse = this.walletAsset.canUse
					this.loading = false;
				} else {
					this.$Message.error(this.loginmsg);
				}
			});
		},
		changePage(pageindex) {
			this.page = pageindex;
			this.getList(this.page);
		},
		getAssets() {
			//获取
			this.$http.post(this.host + "/asset/wallet/usdt").then(response => {
				var resp = response.body;
				if (resp.code == 0) {
					this.assetsWallet = resp.data;
				} else {
					this.$Message.error(this.loginmsg);
				}
			});
		},
		onTransferClick() {
			this.transferModal = true;
		},
		changeTo(val) {
			this.transferDirection = val;
			this.transferAmount = 0.00;
		},
		confirmOk() {
			if (this.transferAmount <= 0 || this.transferAmount == "" || this.transferAmount == undefined) {
				this.$Message.error(this.$t('uc.finance.swap.pleaseinputamount'));
				return;
			}
			let params = {
				unit: "USDT",
				from: this.transferDirection == 1 ? 0 : 1,
				to: this.transferDirection == 1 ? 1 : 0,
				amount: this.transferAmount
			};

			this.$http.post(this.swapHost + "/wallet/trans", params).then(response => {
				var resp = response.body;
				if (resp.code == 0) {
					console.log(resp.data);
					this.transferAmount = 0
					this.getList(this.page);
					this.getMoney();
					this.getAssets();
					this.onChangeTwo();
					this.$Message.success('划转成功');

				} else {
					this.$Message.error(resp.message);
				}
			});

			this.transferModal = false;
		},
		rewardRakeBack(){
			this.$http.post(this.swapHost + "/wallet/reward-rake-back", {}).then(response => {
				var resp = response.body;
				if (resp.code == 0) {
					this.getList(this.page);
					this.getMoney();
					this.getAssets();
					this.onChangeTwo();
					this.$Message.success('领取成功');
				} else {
					this.$Message.error(resp.message);
				}
			});
		},
		getList(pageNo) {
			let memberId = 0;
			!this.$store.getters.isLogin && this.$router.push("/login");
			this.$store.getters.isLogin && (memberId = this.$store.getters.member.id);
			let startTime = "";
			let endTime = "";
			let symbol = "";
			let type = "";
			let params = {
				pageNo: pageNo,
				pageSize: this.pageSize,
				startTime,
				endTime,
				memberId,
				symbol,
				type,
				assetType: 1,
			};
			this.$http.post(this.host + "/asset/transaction/all", params).then(response => {
				var resp = response.body;
				if (resp.code == 0) {
					this.loading = false;
					if (resp.data) {
						this.total = resp.data.total;
						this.filteredRecords = resp.data.records;
					}
				} else {
					this.$Message.error(resp.message);
				}
				this.loading = false;
			});
		},

		onChangeTwo() {
			console.log(this.walletTwo);
			for (let i = 0; i < this.tableMoney.length; i++) {
				if (this.tableMoney[i].id == this.walletTwo) {
					this.swapWallet = this.tableMoney[i];
				}
			}
		},
		onTransAll() {
			if (this.transferDirection == 1) {
				this.transferAmount = this.assetsWallet.balance;
			} else {
				this.transferAmount = Math.floor(this.walletInfo.canUse * 100) / 100;
			}
		}
	},
	created() {
		this.getMoney();
		this.getList(this.page);
		this.getAssets();
	},
	filters: {
		fixed2: function (value) {
			return Math.floor(value * 100) / 100;
		}
	},
	computed: {
		totalUSDT() {
			return this.walletAsset.usdtBalance;
		},
		totalCny() {
			return (this.walletAsset.usdtBalance * this.walletAsset.cnyRate);
		},
		tableColumnsRecord() {
			let columns = [];
			var that = this;
			columns.push({
				title: this.$t("uc.finance.record.chargetime"),
				align: "center",
				width: 160,
				key: "createTime"
			});
			columns.push({
				title: this.$t("uc.finance.record.type"),
				render: function (h, params) {
					let str = "";
					let type = params.row.type;
					if (type == 0) {
						str = that.$t("uc.finance.record.charge");
					} else if (type == 1) {
						str = that.$t("uc.finance.record.pickup");
					} else if (type == 2) {
						str = that.$t("uc.finance.record.transMessage2");
					} else if (type == 3) {
						str = that.$t("uc.finance.record.transMessage3");
					} else if (type == 4) {
						str = that.$t("uc.finance.record.transMessage4");
					} else if (type == 5) {
						str = that.$t("uc.finance.record.transMessage5");
					} else if (type == 6) {
						str = that.$t("uc.finance.record.transMessage6");
					} else if (type == 7) {
						str = that.$t("uc.finance.record.transMessage7");
					} else if (type == 8) {
						str = that.$t("uc.finance.record.transMessage8");
					} else if (type == 9) {
						str = that.$t("uc.finance.record.transMessage9");
					} else if (type == 10) {
						str = that.$t("uc.finance.record.transMessage10");
					} else if (type == 11) {
						str = that.$t("uc.finance.record.transMessage11");
					} else if (type == 12) {
						str = that.$t("uc.finance.record.transMessage12");
					} else if (type == 13) {
						str = that.$t("uc.finance.record.transMessage13");
					} else if (type == 14) {
						str = that.$t("uc.finance.record.transMessage14");
					} else if (type == 15) {
						str = that.$t("uc.finance.record.transMessage15");
					} else if (type == 16) {
						str = that.$t("uc.finance.record.transMessage16");
					} else if (type == 17) {
						str = that.$t("uc.finance.record.transMessage17");
					} else if (type == 18) {
						str = that.$t("uc.finance.record.transMessage18");
					} else if (type == 19) {
						str = that.$t("uc.finance.record.transMessage19");
					} else if (type == 20) {
						str = that.$t("uc.finance.record.transMessage20");
					} else if (type == 21) {
						str = that.$t("uc.finance.record.transMessage21");
					} else if (type == 22) {
						str = that.$t("uc.finance.record.transMessage22");
					} else if (type == 23) {
						str = that.$t("uc.finance.record.transMessage23");
					} else if (type == 24) {
						str = that.$t("uc.finance.record.transMessage24");
					} else if (type == 25) {
						str = that.$t("uc.finance.record.transMessage25");
					} else if (type == 26) {
						str = that.$t("uc.finance.record.transMessage26");
					} else if (type == 27) {
						str = that.$t("uc.finance.record.transMessage27");
					} else if (type == 28) {
						str = that.$t("uc.finance.record.transMessage28");
					} else if (type == 29) {
						str = that.$t("uc.finance.record.transMessage29");
					} else if (type == 30) {
						str = that.$t("uc.finance.record.transMessage30");
					} else if (type == 31) {
						str = that.$t("uc.finance.record.transMessage31");
					} else if (type == 32) {
						str = that.$t("uc.finance.record.transMessage32");
					} else if (type == 33) {
						str = that.$t("uc.finance.record.transMessage33");
					}else if (type == 34) {
						str = that.$t("uc.finance.record.transMessage34");
					}  else {
						str = that.$t("uc.finance.record.other");
					}
					return h("div", str, "");
				}
			});
			columns.push({
				title: this.$t("uc.finance.record.symbol"),
				align: "center",
				key: "symbol"
				// render: (h, param) => {
				//   return h("div", {}, param.row._source.symbol);
				// }
			});
			columns.push({
				title: this.$t("uc.finance.record.num"), //到账数量
				align: "center",
				render(h, params) {
					let str = that.toFloor(params.row.amount.toFixed(4) || "0");
					let children = [
						h("span", str)
					];
					if (parseFloat(params.row.discountFee) != "0") {
						children.push(
							h("span", { style: { color: '#f0ac19', marginLeft: '4px' } },
								"(抵扣" + parseFloat(params.row.discountFee).toFixed(4) + ")"
							)
						);
					}
					return h("span", {}, children);
				}
			});
			columns.push({
				title: "当前余额", //"抵扣手续费"
				align: "center",
				render(h, params) {
					return h(
						"span",
						{
							attrs: {
								title: params.row.balance
							}
						},
						that.toFloor(params.row.balance || "0")
					);
				}
			});
			columns.push({
				title: "账户类型",
				align: "assetType",
				render(h, params) {
					let str = "";
					let type = params.row.assetType;
					if (type == 0) {
						str = "资金账户";
					} else if (type == 1) {
						str = "合约账户";
					} else if (type == 2) {
						str = "返佣账户";
					}
					return h("div", str, "");
				}
			});
			columns.push({
				title: this.$t("uc.finance.record.status"),
				// key: "status",
				align: "center",
				render: (h, params) => {
					return h("div", that.$t("uc.finance.record.finish"), "");
				}
			});
			return columns;
		}
	}

};
</script>
<style lang="scss">
.nav-right {
	.rightarea.bill_box {
		.shaow {
			padding: 5px;
		}

		.money_table {
			.search {
				width: 200px;
				margin-bottom: 10px;
			}

			.ivu-table-wrapper {
				.ivu-table-header {
					background: #27313e;

					th {
						color: #fff;
					}
				}

				.ivu-table-body {
					td {
						color: #fff;

						.ivu-table-cell {
							padding: 10px 10px;

							p .ivu-btn {
								background: transparent;
								height: 25px;
								padding: 0 0px;
								border-radius: 0;

								span {
									display: inline-block;
									line-height: 20px;
									font-size: 12px;
									padding: 0 15px;
									letter-spacing: 1px;
								}
							}

							p .ivu-btn.ivu-btn-info {
								border: 1px solid #f0ac19;

								span {
									color: #f0ac19;
								}
							}

							p .ivu-btn.ivu-btn-error {
								border: 1px solid #f15057;

								span {
									color: #f15057;

								}
							}

							p .ivu-btn.ivu-btn-primary {
								border: 1px solid #00b275;
								border: 1px solid #00b275;

								span {
									color: #00b275;
								}
							}

							p .ivu-btn.ivu-btn-default {
								border: 1px solid #2c384f;
								background: #222c3e;

								span {
									color: #54637a;
								}
							}
						}
					}
				}
			}
		}
	}
}
</style>

<style scoped lang="scss">
.nav-right {
	height: auto;
	overflow: hidden;
	padding: 0 0 0 15px;

	.rightarea.bill_box {
		padding-left: 15px;
		width: 100%;
		height: auto;
		overflow: hidden;
	}
}

.demo-spin-icon-load {
	animation: ani-demo-spin 1s linear infinite;
}

@media screen and (max-width:768px) {
	.search {
		display: none;
	}
}

.trans-all-btn {
	display: inline-block;
	margin-left: 20px;
	font-weight: bold;
	color: #f0ac19;
	background-color: transparent;

	&:hover {
		cursor: pointer;
	}
}

.financial-overview {
	width: 100%;
	height: 100vh;
	background-color: #181A1F;
	color: #fff;
	padding: 20px;
	font-family: Arial, sans-serif;
}

.section {
	margin-bottom: 20px;
}

.Bottom_px {
	border-bottom: 1px dashed #666;
}

.title {
	font-size: 18px;
	font-weight: bold;
	margin-bottom: 10px;
	display: flex;
	align-items: center;
	justify-content: space-between;
}

.eye-icon {
	cursor: pointer;
	margin-left: 10px;
}

.amount {
	font-size: 24px;
	font-weight: bold;
}

.flex {
	display: flex;
	justify-content: space-between;

}

.sub-amount {
	font-size: 14px;
	color: #999;
}

.profit {
	font-size: 14px;
	margin-top: 10px;
}

.negative {
	color: #ff4d4f;
}

.positive {
	color: #00b275;
}

.btn {
	background-color: #F6D758;
	border: none;
	color: black;
	padding: 2px 10px;
	border-radius: 8px;
	margin-bottom: 10px;
}

.boder {
	border: 1px solid #262A30;
	padding: 10px;
	border-radius: 7px;
}

.btn_box {
	padding: 0 20px;
	display: flex;
	justify-content: end;
}

.box {
	padding: 50px 0 0 0;
}
</style>