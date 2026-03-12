<template>
	<div class="nav-rights">
		<div class="nav-right col-xs-12 col-md-10 padding-right-clear">
			<div class="bill_box rightarea padding-right-clear">
				<div class="shaow">
					<div>
						<div class="boder">
							<div class="section_box">
								<div class="section">
									<div class="section_title">钱包地址:</div>
									<div class="item_info">
										{{ address }}
									</div>
								</div>
								<div class="section">
									<div class="section_title">钱包余额:</div>
									<div class="item_info">{{ balance }}USDT</div>
								</div>
								<div class="section">
									<div class="section_title"> 资金账户余额:</div>
									<div class="item_info">{{ canWithdrawBalance }}USDT</div>
								</div>
							</div>
							<div style="display: flex; justify-content: start; margin-top: 80px;">
								<div class="section_btn">
									<button type="success" @click="rechargeBsc = true">钱包充值</button>
								</div>
								<!-- <div class="section_btn">
									<button @click="withdrawBsc = true">钱包提现</button>
								</div> -->
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
		<Modal v-model="rechargeBsc" width="360">
			<div class="nav-rights">
				<p slot="header" style="color:#f60;text-align:center">
					<Icon type="ios-mail" size="20" color="#00b5f6;" />
					<span>{{ $t('uc.finance.recharge.rechargeconfirm') }}</span>
				</p>
				<div style="text-align:center">
					<p><span>{{ $t('uc.finance.recharge.symbol') }}: </span><span>{{ walletToken.name }}</span></p>
					<Form ref="formValidate" :label-width="0">
						<FormItem>
							<Input v-model="rechrageForm.amount"
								:placeholder="$t('uc.finance.recharge.amount')"></Input>
						</FormItem>
					</Form>
					<p><span>当前钱包地址: </span><span>{{ address }}</span></p>
					<p><span>钱包可用: </span><span>{{ balance }}</span></p>
				</div>
				<!-- <Button type="primary" size="large" long @click="rechargeHandler">{{$t('uc.finance.withdraw.submit')}}</Button> -->
			</div>
			<div slot="footer">
				<Button size="large" @click="rechargeBsc = false">{{ $t("common.close") }}</Button>
				<Button type="primary" size="large" @click="rechargeHandler">{{ $t("uc.finance.withdraw.submit")
				}}</Button>
			</div>
		</Modal>
		<Modal v-model="withdrawBsc" width="360">
			<div class="nav-rights">
				<p slot="header" style="color:#f60;text-align:center">
					<Icon type="ios-mail" size="20" color="#00b5f6;" />
					<span>{{ $t('uc.finance.withdraw.pickup') }}</span>
				</p>
				<div style="text-align:left">
					<Form ref="formValidate" :label-width="0">
						<FormItem>
							<span style="float: left;">{{ $t('uc.finance.withdraw.num') }}{{ walletToken.name }}:
							</span>
							<Input v-model="withdrawForm.amount"></Input>
						</FormItem>
						<FormItem>
							<span style="float: left;">{{ $t('uc.finance.withdraw.fundpwdtip') }}: </span>
							<Input v-model="withdrawForm.jyPassword"></Input>
						</FormItem>
					</Form>
					<p><span>当前钱包地址: </span><span>{{ address }}</span></p>
					<p><span>可提现金额: </span><span>{{ canWithdrawBalance }}</span></p>
				</div>
			</div>
			<div slot="footer">
				<Button size="large" @click="withdrawBsc = false">{{ $t("common.close") }}</Button>
				<Button type="primary" size="large" @click="withdrawHandler">{{ $t("uc.finance.withdraw.submit")
				}}</Button>
			</div>
		</Modal>
	</div>
</template>
<script>
import { rechargeAbi } from "../../assets/js/recharge.js";
import { withdrawAbi } from "../../assets/js/withdraw.js";
import { erc20Abi } from "../../assets/js/erc20.js";
import Web3 from 'web3/dist/web3.min.js';
export default {
	components: {
	},
	data() {
		return {
			loginmsg: this.$t("common.logintip"),
			loading: true,
			rechargeBsc: false,
			withdrawBsc: false,
			walletToken: null,
			usdtAddress: '',
			address: '',
			balance: '',
			usdtContract: {},
			withdrawForm: {
				amount: null,
				jyPassword: ''
			},
			rechrageForm: {
				amount: null,
			},
			canWithdrawBalance: 0
		};
	},
	methods: {
		getWallet() {
			//获取
			this.$http.post(this.host + "/asset/wallet").then(response => {
				var resp = response.body;
				if (resp.code == 0) {
					this.walletToken = resp.data.find(item => item.coin === "USDT").coinVo;
					this.canWithdrawBalance = resp.data.find(item => item.coin === "USDT").balance
					this.initializeWeb3()
				}
			});
		},
		recharge() {
			this.rechargeBsc = true
		},
		withdraw() {
			this.withdrawBsc = true
		},
		initializeWeb3: async function () {
			console.log("this.walletToken", this.walletToken)
			if (window.ethereum) {
				this.rechargeAddress = this.walletToken.depositAddress
				let withdrawAddress = this.walletToken.withdrawContractBsc
				this.usdtAddress = this.walletToken.contractAddressBsc,
					this.web3 = new Web3(window.ethereum);
				await this.checkNetwork();
				await this.connectWallet();
				this.rechargeContract = new this.web3.eth.Contract(rechargeAbi, this.rechargeAddress);
				this.withdrawContract = new this.web3.eth.Contract(withdrawAbi, withdrawAddress);
				this.usdtContract = new this.web3.eth.Contract(erc20Abi, this.usdtAddress);
				this.balanceOf()
			} else {
				alert('请安装 MetaMask 或其他支持的以太坊钱包');
			}
		},
		connectWallet: async function () {
			try {
				const accounts = await window.ethereum.request({
					method: 'eth_requestAccounts'
				});
				this.address = accounts[0];
				//uni.setStorageSync('address', this.address);
				console.log("钱包连接成功，地址:", this.address);
			} catch (error) {
				console.error("用户拒绝了连接请求", error);
			}
		},
		checkNetwork: async function () {
			try {
				const networkId = await window.ethereum.request({
					method: 'eth_chainId'
				});
				const desiredNetworkId = Web3.utils.numberToHex(56); // 测试网 ID
				if (networkId !== desiredNetworkId) {
					await this.switchNetwork(desiredNetworkId);
				}
			} catch (error) {
				console.error("获取网络 ID 失败", error);
			}
		},
		switchNetwork: async function (chainId) {
			try {
				await window.ethereum.request({
					method: 'wallet_switchEthereumChain',
					params: [{
						chainId
					}]
				});
			} catch (error) {
				if (error.code === 4902) {
					await this.addNetwork();
				} else if (error.code === 4001) {
					console.log("用户拒绝了切换网络请求");
				} else {
					console.error("切换网络时出错", error);
				}
			}
		},
		addNetwork: async function () {
			try {
				await window.ethereum.request({
					method: 'wallet_addEthereumChain',
					params: [{
						chainId: Web3.utils.numberToHex(56), // 主网 ID
						chainName: 'BSC Mainnet',
						nativeCurrency: {
							name: 'BNB',
							symbol: 'BNB',
							decimals: 18
						},
						rpcUrls: ['https://bsc-dataseed1.defibit.io'],
						blockExplorerUrls: ['https://bscscan.com/']
					}]
				});
			} catch (error) {
				console.error("添加网络时出错", error);
			}
		},
		async balanceOf() {
			console.log("this.usdtContract", this.usdtContract)
			console.log("this.address", this.address)
			const res = await this.usdtContract.methods.balanceOf(this.address).call({ from: this.address });
			console.log("res", this.usdtContract.methods.balanceOf(this.address))
			this.balance = Math.round((res / 10 ** 18) * 10000) / 10000;
		},
		rechargeHandler() {
			let message = "recharge"
			let self = this
			this.web3.eth.personal.sign(message, this.address, '').then(signature => {
				console.log('Signature:', signature);
				let params = {};
				params["address"] = this.address;
				params["message"] = message;
				params["signature"] = signature;
				self.$http.post(self.host + "/asset/wallet/recharge", params).then(response => {
					var resp = response.body;
					if (resp.code == 0) {
						if (self.rechargeContract) {
							// uni.showLoading({
							//   mask: true,
							//   title: this.$t('message.loading'),
							//   duration: 2000,
							// });
							let price = self.rechrageForm.amount * 10 ** 18
							try {
								//获取合约中被授权转账的金额
								console.log("this.usdtAddress", self.usdtAddress)
								console.log("this.rechargeAddress", self.rechargeAddress)
								self.usdtContract.methods.allowance(self.address, self.rechargeAddress).call({ from: self.address }).then(allowance => {
									console.log("allowance", allowance)
									console.log("price", price)
									if (BigInt(allowance) < BigInt(price)) {
										//当授权金额小于价格时，去授权
										const maxValue = BigInt(2 ** 128 - 1);//BigInt(2 ** 128 - 1);
										self.usdtContract.methods.approve(self.rechargeAddress, maxValue).send({ from: self.address }).then(receipt => {
											console.log("批准成功，交易哈希：", receipt.transactionHash);
											//uni.hideLoading()
											self.recharge()
										})
									} else {
										//uni.hideLoading()
										self.recharge()
									}
								})
							} catch (error) {
								//uni.hideLoading()
								console.error("调用合约出错", error);
							}
						} else {
							console.error("合约未初始化");
						}
					} else {
						self.$Notice.error({ title: self.$t("common.tip"), desc: resp.message });
					}
				})
			})
		},
		async recharge() {
			if (this.rechargeContract) {
				//let price=this.tokenAmount*10**18
				let price = this.web3.utils.toWei(this.rechrageForm.amount.toString(), 'ether');
				try {
					// uni.showLoading({
					//   mask: true,
					//   title: this.$t('message.loading'),
					//   duration: 2000,
					// });
					console.log("price", price)
					const receipt = await this.rechargeContract.methods.recharge(price).send({ from: this.address })
					// uni.hideLoading()
					// uni.showToast({
					//   icon: 'success', 
					//   title: this.$t('message.success'),
					//   duration: 2000,
					// });
					this.rechrageForm.amount = 0
					this.$Notice.success({
						title: "提示",
						desc: "充值成功"
					});
				} catch (error) {
					// uni.hideLoading()
					console.error("调用合约出错", error);
				}
			} else {
				console.error("合约未初始化");
			}
		},
		withdrawHandler() {
			console.log(this.withdrawForm.amount, this.withdrawForm.jyPassword)
			if (!this.withdrawForm.amount || !this.withdrawForm.jyPassword) {
				return
			}
			let self = this
			let withdrawAddress = this.walletToken.withdrawContractBsc
			let tokenAddress = this.walletToken.contractAddressBsc
			if (withdrawAddress == '') {
				return
			}
			// uni.showLoading({
			//   mask: true,
			//   title: this.$t('message.loading'),
			//   duration: 2000,
			// });
			let params = {
			};
			params["coinUint"] = this.walletToken.unit;
			params["withdrawNum"] = this.withdrawForm.amount;
			params["jyPassword"] = this.withdrawForm.jyPassword;
			params["withdrawAddress"] = this.address;
			this.$http
				.post(this.host + "/withdraw/withdraw", params)
				.then(response => {
					var resp = response.body;
					if (resp.code == 0) {
						const item = resp.data
						let amount = this.web3.utils.toBN(item.withdrawNum);
						console.log("res.withdrawAddress", withdrawAddress)
						console.log("tokenAddress", tokenAddress)
						this.withdrawContract = new this.web3.eth.Contract(withdrawAbi, withdrawAddress);
						this.withdrawContract.methods.transfer(tokenAddress, item.userAddress, amount.toString(), item.expireTime, item.orderId, item.signature).send({ from: this.address }).then(res => {
							// uni.hideLoading()
							// uni.showToast({
							//   icon: 'success', 
							//   title: this.$t('message.success'),
							//   duration: 2000,
							// });
							this.withdrawMoney = ''
							self.$emit("overWithdraw")
						})
					}
				}).catch(error => {
					this.$Notice.error({ title: this.$t("common.tip"), desc: error.body ? error.body.message : "服务器内部错误，请稍后重试" });
				});
		},
	},
	created() {
		this.getWallet();
	},
	filters: {
		fixed2: function (value) {
			return Math.floor(value * 100) / 100;
		}
	},
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
	display: flex;
	align-items: center;
	margin: 20px;
	flex: 1;

}

.section_title {
	font-size: 18px;
	font-weight: 700;

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

.item_info {
	margin-left: 40px;
	font-size: 21px;
}

.section_box {}

.section_btn {
	margin-left: 10px;
	cursor: pointer;

	button {
		padding: 6px 15px;
		letter-spacing: 2px;
		color: rgb(240, 172, 25);
		background-color: transparent;
		border: 1px solid rgb(240, 172, 25);
	}
}
</style>