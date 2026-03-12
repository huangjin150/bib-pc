<template>
	<div class="nav-rights">
		<p slot="header" style="color:#f60;text-align:center">
			<Icon type="ios-mail" size="20" color="#00b5f6;" />
			<span>{{$t('uc.finance.recharge.rechargeconfirm')}}</span>
		</p>
		<div style="text-align:center">
			<p><span>{{$t('uc.finance.recharge.symbol')}}: </span><span>{{localWallet.name}}</span></p>
			<Form ref="formValidate" :label-width="0">
			  <FormItem>
			    <Input v-model="rechargeMoney" :placeholder="$t('uc.finance.recharge.amount')"></Input>
			  </FormItem>
			</Form>
			<p><span>当前钱包地址: </span><span>{{address}}</span></p>
			<p><span>钱包可用: </span><span>{{balance}}</span></p>
		</div>
		<!-- <Button type="primary" size="large" long @click="rechargeHandler">{{$t('uc.finance.withdraw.submit')}}</Button> -->
	</div>
</template>
<script>
	import Vue from "vue";
	import {rechargeAbi} from "../../assets/js/recharge.js";
	import {erc20Abi} from "../../assets/js/erc20.js";
	import Web3 from 'web3/dist/web3.min.js';

	export default {
		inject: ['reload'],
		data() {
			return {
				rechargeAddress:{},
				usdtAddress:{},
				rechargeMoney:'',
				balance:0,
				address:'',
				localWallet:{}
			};
		},
		props: {
			rechargeToken: {
				type: Object,
				defaultValue:{
					name:''
				}
			}
		},
		watch: {
		    rechargeToken: {
		      deep: true,
		      immediate: true, // 组件初始化时立即执行一次
		      handler(newVal) {
				 // console.log("11111111:",newVal)
		        this.localWallet = newVal; // 赋值新对象，触发响应式
				//this.initializeWeb3()
		      }
		    }
		},
		methods: {
			rechargeHandler(){
				let message = "recharge"
				let self=this
				this.web3.eth.personal.sign(message, this.address, '').then(signature => {
					console.log('Signature:', signature);
					let params = {};
					params["address"] = this.address;
					params["message"] = message;
					params["signature"] = signature;
					self.$http.post(self.host + "/asset/wallet/recharge", params).then(response => {
					  var resp = response.body;
					  if(resp.code==0){
						  if (self.rechargeContract) {
						  	// uni.showLoading({
						  	//   mask: true,
						  	//   title: this.$t('message.loading'),
						  	//   duration: 2000,
						  	// });
						  	let price=self.rechargeMoney*10**18
						  	try {
						  		//获取合约中被授权转账的金额
						  		console.log("this.usdtAddress",self.usdtAddress)
						  		console.log("this.rechargeAddress",self.rechargeAddress)
						  		self.usdtContract.methods.allowance(self.address,self.rechargeAddress).call({from:self.address}).then(allowance=>{
									console.log("allowance",allowance)
									if(BigInt(allowance)<BigInt(price)){
										//当授权金额小于价格时，去授权
										const maxValue = BigInt(2 ** 128 - 1);//BigInt(2 ** 128 - 1);
										self.usdtContract.methods.approve(self.rechargeAddress,maxValue).send({from:self.address}).then(receipt=>{
											console.log("批准成功，交易哈希：", receipt.transactionHash);
											//uni.hideLoading()
											self.recharge()
										})
									}else{
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
					  }else{
						  self.$Notice.error({ title: self.$t("common.tip"), desc: resp.message });
					  }
					})
				})
			},
			async recharge(){
				if (this.rechargeContract) {
					//let price=this.tokenAmount*10**18
					let price = this.web3.utils.toWei(this.rechargeMoney.toString(), 'ether');
					try {
						// uni.showLoading({
						//   mask: true,
						//   title: this.$t('message.loading'),
						//   duration: 2000,
						// });
						console.log("price",price)
						const receipt = await this.rechargeContract.methods.recharge(price).send({from:this.address})
						// uni.hideLoading()
						// uni.showToast({
						//   icon: 'success', 
						//   title: this.$t('message.success'),
						//   duration: 2000,
						// });
						this.show=false
						this.rechargeMoney=100
						console.log("充值成功", receipt.transactionHash);
					} catch (error) {
						// uni.hideLoading()
						console.error("调用合约出错", error);
					}
				} else {
					console.error("合约未初始化");
				}
			},
			initializeWeb3: async function() {
				console.log("this.localWallet",this.localWallet)
				if (window.ethereum) {
					this.rechargeAddress=this.localWallet.depositAddress,
					this.usdtAddress=this.localWallet.contractAddressBsc,
					this.web3 = new Web3(window.ethereum);
					await this.checkNetwork();
					await this.connectWallet();
					this.rechargeContract = new this.web3.eth.Contract(rechargeAbi,this.rechargeAddress);
					this.usdtContract = new this.web3.eth.Contract(erc20Abi,this.usdtAddress);
					this.balanceOf()
				} else {
					alert('请安装 MetaMask 或其他支持的以太坊钱包');
				}
			},
			connectWallet: async function() {
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
			checkNetwork: async function() {
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
			switchNetwork: async function(chainId) {
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
			addNetwork: async function() {
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
			async balanceOf(){
				console.log("-------------------------")
				const res = await this.usdtContract.methods.balanceOf(this.address).call({ from: this.address });
				console.log("res",res)
				this.balance = Math.round((res / 10**18) * 10000) / 10000;
			},
		},
		created() {
		   // this.initializeWeb3()
		},
		computed: {}
	};
</script>
<style scoped>
	.table-inner {
		position: relative;
		text-align: left;
		border-radius: 3px;
	}

	.acb-p1 {
		font-size: 16px;
		font-weight: 400;
		line-height: 50px;
	}

	.acb-p2 {
		font-size: 13px;
		line-height: 24px;
		color: #8c979f;
	}

	.action-inner {
		width: 100%;
		display: table;
	}

	.action-inner .inner-box {
		display: table-cell;
		width: 100%;
	}

	.action-box .title .copy {
		user-select: text;
	}

	.action-box .title a.link-copy {
		font-size: 14px;
		margin-left: 20px;
		color: #f0a70a;
	}

	.hb-night a {
		text-decoration: none;
		color: #7a98f7;
		transition: all 0.2s ease-in-out;
		cursor: pointer;
	}

	.action-box .title a.link-qrcode {
		margin-left: 20px;
		font-size: 14px;
		position: relative;
		color: #f0a70a;
	}

	.hb-night a {
		text-decoration: none;
		color: #7a98f7;
		transition: all 0.2s ease-in-out;
		cursor: pointer;
	}

	.action-box .subtitle {
		font-size: 12px;
		margin-top: 30px;
	}

	.action-content {
		width: 100%;
		margin-top: 30px;
		/* overflow: hidden; */
		display: table;
		color: #ccc;
	}

	.action-box .title {
		margin-top: 20px;
		font-size: 20px;
		user-select: none;
	}

	.action-box .title .show-qrcode {
		position: absolute;
		top: -100px;
		left: 40px;
		padding: 10px;
		background: #FFF;
	}

	.action-inner .inner-box.deposit-address {
		width: 80%;
	}

	p.describe {
		font-size: 16px;
		font-weight: 600;
	}

	.merchant-icon {
		display: inline-block;
		margin-left: 4px;
		background-size: 100% 100%;
	}

	.merchant-icon.tips {
		width: 4px;
		height: 22px;
		margin-right: 10px;
		background: #f0a70a;
	}

	.bill_box {
		width: 100%;
		height: auto;
		/* overflow: hidden; */
	}

	.nav-right {
		height: auto;
		overflow: hidden;
		padding: 0 15px;
	}

	.order_box {
		width: 100%;
		background: #fff;
		height: 56px;
		line-height: 56px;
		margin-bottom: 20px;
		border-bottom: 2px solid #ccf2ff;
		position: relative;
		text-align: left;
	}

	.order_box a {
		color: #8994a3;
		font-size: 16px;
		padding: 0 30px;
		cursor: pointer;
		text-decoration: none;
		text-align: center;
		line-height: 54px;
		display: inline-block;
	}

	.order_box .search {
		position: absolute;
		width: 300px;
		height: 32px;
		top: 12px;
		right: 0;
		display: flex;
		/* border: #c5cdd7 solid 1px; */
	}

	a.withdrawcoderecharge {
		font-weight: normal;
		line-height: 40px;
		color: #f0a70a;
		width: 160px;
		height: 40px;
		border: 1px solid #f0a70a;
		display: inline-block;
		text-align: center;
	}
</style>