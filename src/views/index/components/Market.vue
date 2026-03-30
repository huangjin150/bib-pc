<template>
    <div class="market-container">
        <!-- 如果是行情页模式，展示单面板多Tab -->
        <div class="market-panels" v-if="isMarketPage">
            <div class="panel-box full-width">
                <div class="panel-header">
                    <div class="panel-title" :class="{ active: activeTab === 'contract' }" @click="activeTab = 'contract'">热门合约榜</div>
                    <div class="panel-title" :class="{ active: activeTab === 'gainers' }" @click="activeTab = 'gainers'">涨幅榜</div>
                    <div class="panel-title" :class="{ active: activeTab === 'losers' }" @click="activeTab = 'losers'">跌幅榜</div>
                    <div class="panel-title" :class="{ active: activeTab === 'volume' }" @click="activeTab = 'volume'">成交额</div>
                </div>
                <div class="panel-content">
                    <Table style="border: none;" :columns="contractColumns" :data="tableData" class="dark-tables"
                        :disabled-hover="false" :loading="loading" :no-data-text="$t('common.nodata')">
                    </Table>
                </div>
            </div>
        </div>

        <!-- 默认首页模式，展示双面板 -->
        <div class="market-panels" v-else>
            <div class="panel-box">
                <div class="panel-header">
                    <div class="panel-title active">热门合约榜</div>
                </div>
                <div class="panel-content">
                    <Table style="border: none;" :columns="contractColumns" :data="homeContractData" class="dark-tables"
                        :disabled-hover="false" :loading="loading" :no-data-text="$t('common.nodata')">
                    </Table>
                </div>
                <div class="more-link" @click="$router.push('/market')">
                    更多 <span style="font-size: 18px; margin-left: 4px;">→</span>
                </div>
            </div>

            <div class="panel-box">
                <div class="panel-header">
                    <div class="panel-title" :class="{ active: activeHomeTab === 'gainers' }" @click="activeHomeTab = 'gainers'">涨幅榜</div>
                    <div class="panel-title" :class="{ active: activeHomeTab === 'losers' }" @click="activeHomeTab = 'losers'">跌幅榜</div>
                    <div class="panel-title" :class="{ active: activeHomeTab === 'volume' }" @click="activeHomeTab = 'volume'">成交额</div>
                </div>
                <div class="panel-content">
                    <Table style="border: none;" :columns="spotColumns" :data="homeSpotData" class="dark-tables"
                        :disabled-hover="false" :loading="loading" :no-data-text="$t('common.nodata')">
                    </Table>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
var Stomp = require("stompjs");
var SockJS = require("sockjs-client");

export default {
    name: 'MarketComponents',
    props: {
        isMarketPage: {
            type: Boolean,
            default: false
        }
    },
    data() {
        let self = this;
        return {
            loading: false,
            activeTab: 'contract',
            activeHomeTab: 'gainers',
            allData: [],
            coins: {
                _map: []
            },
            contractColumns: [
                {
                    title: '币种',
                    key: "coin",
                    render: function (h, params) {
                        return h("div", {
                            style: {
                                display: 'flex',
                                alignItems: 'center',
                                gap: '12px'
                            }
                        }, [
                            h("img", {
                                attrs: { src: params.row.logo },
                                style: { width: '24px', height: '24px', borderRadius: '50%' }
                            }),
                            h("span", {
                                style: { fontSize: "14px", fontWeight: 600, color: "#fff" }
                            }, params.row.coin + params.row.base)
                        ]);
                    }
                },
                {
                    title: '最新成交价',
                    key: "price",
                    render: function (h, params) {
                        return h("span", {
                            style: { fontSize: "14px", fontWeight: 600, color: "#fff" }
                        }, String(params.row.price));
                    }
                },
                {
                    title: '24H 涨跌幅',
                    key: "rose",
                    render: (h, params) => {
                        const isUp = parseFloat(params.row.rose) >= 0;
                        return h("span", {
                            class: { green: isUp, red: !isUp },
                            style: { fontWeight: 600, fontSize: "14px" }
                        }, params.row.rose);
                    }
                },
                {
                    title: '24小时交易量',
                    key: "volume",
                    render: function (h, params) {
                        let vol = (params.row.volume / 1000000).toFixed(2) + ' M';
                        return h("span", {
                            style: { fontSize: "14px", fontWeight: 600, color: "#fff" }
                        }, vol);
                    }
                },
                {
                    title: '操作',
                    key: "action",
                    align: 'right',
                    render: function (h, params) {
                        return h("div", {
                            style: {
                                backgroundColor: '#2a2a2a',
                                color: "#ccc",
                                padding: "6px 20px",
                                width: '100px',
                                borderRadius: '6px',
                                textAlign: 'center',
                                cursor: "pointer",
                                fontSize: "14px",
                                display: 'inline-block'
                            },
                            on: {
                                click: function () {
                                    self.$router.push({ name: 'SwapPair', params: { pair: params.row.href } });
                                }
                            }
                        }, "交易");
                    }
                }
            ],
            spotColumns: [
                {
                    title: '币种',
                    key: "coin",
                    render: function (h, params) {
                        return h("div", {
                            style: {
                                display: 'flex',
                                alignItems: 'center',
                                gap: '12px'
                            }
                        }, [
                            h("img", {
                                attrs: { src: params.row.logo },
                                style: { width: '24px', height: '24px', borderRadius: '50%' }
                            }),
                            h("span", {
                                style: { fontSize: "14px", fontWeight: 600, color: "#fff" }
                            }, params.row.coin + params.row.base)
                        ]);
                    }
                },
                {
                    title: '最新成交价',
                    key: "price",
                    render: function (h, params) {
                        return h("span", {
                            style: { fontSize: "14px", fontWeight: 600, color: "#fff" }
                        }, String(params.row.price));
                    }
                },
                {
                    title: '24H 涨跌幅',
                    key: "rose",
                    align: 'right',
                    render: (h, params) => {
                        const isUp = parseFloat(params.row.rose) >= 0;
                        return h("span", {
                            class: { green: isUp, red: !isUp },
                            style: { fontWeight: 600, fontSize: "14px" }
                        }, params.row.rose);
                    }
                }
            ]
        }
    },
    computed: {
        tableData() {
            let data = [...this.allData];
            if (this.activeTab === 'contract') {
                return data.slice(0, 10);
            } else if (this.activeTab === 'gainers') {
                data.sort((a, b) => parseFloat(b.rose) - parseFloat(a.rose));
            } else if (this.activeTab === 'losers') {
                data.sort((a, b) => parseFloat(a.rose) - parseFloat(b.rose));
            } else if (this.activeTab === 'volume') {
                data.sort((a, b) => parseFloat(b.volume) - parseFloat(a.volume));
            }
            return data.slice(0, 10);
        },
        homeContractData() {
            return this.allData.slice(0, 6);
        },
        homeSpotData() {
            let data = [...this.allData];
            if (this.activeHomeTab === 'gainers') {
                data.sort((a, b) => parseFloat(b.rose) - parseFloat(a.rose));
            } else if (this.activeHomeTab === 'losers') {
                data.sort((a, b) => parseFloat(a.rose) - parseFloat(b.rose));
            } else if (this.activeHomeTab === 'volume') {
                data.sort((a, b) => parseFloat(b.volume) - parseFloat(a.volume));
            }
            return data.slice(0, 6);
        }
    },
    methods: {
        getCoin(symbol) {
            return this.coins._map[symbol];
        },
        getSymbol() {
            this.loading = true;
            this.$http.post(this.swapHost + this.api.market.thumbTrend, {}).then(response => {
                var resp = response.body;
                let processedData = [];
                for (var i = 0; i < resp.length; i++) {
                    var coin = resp[i];
                    coin.price = resp[i].close;
                    coin.rose = resp[i].chg > 0 ? "+" + (resp[i].chg * 100).toFixed(2) + "%" : (resp[i].chg * 100).toFixed(2) + "%";
                    coin.coin = resp[i].symbol.split("/")[0];
                    coin.base = resp[i].symbol.split("/")[1];
                    coin.href = (coin.coin + "_" + coin.base).toLowerCase();
                    this.coins._map[coin.symbol] = coin;
                    processedData.push(coin);
                }

                this.allData = processedData;

                this.startWebsock();
                this.loading = false;
            });
        },
        startWebsock() {
            var stompClient = null;
            var that = this;
            var socket = new SockJS(that.swapHost + that.api.market.ws);
            stompClient = Stomp.over(socket);
            stompClient.debug = false;
            stompClient.connect({}, function (frame) {
                stompClient.subscribe("/topic/swap/thumb", function (msg) {
                    var resp = JSON.parse(msg.body);
                    var coin = that.getCoin(resp.symbol);
                    if (coin != null) {
                        coin.price = resp.close;
                        coin.rose = resp.chg > 0 ? "+" + (resp.chg * 100).toFixed(2) + "%" : (resp.chg * 100).toFixed(2) + "%";
                        coin.volume = resp.volume;
                    }
                });
            });
        },
        init() {
            this.getSymbol();
        }
    },
    created() {
        this.init();
    }
}
</script>

<style scoped lang="scss">
.market-container {
    width: 100%;
}

.market-panels {
    display: flex;
    gap: 20px;

    .panel-box {
        background-color: #0c0c0c;
        border: 1px solid #1a1a1a;
        border-radius: 16px;
        padding: 30px;
        position: relative;
        display: flex;
        flex-direction: column;

        &:first-child:not(.full-width) {
            flex: 0 0 calc(66.666% - 10px);
            width: calc(66.666% - 10px);
        }

        &:last-child:not(.full-width) {
            flex: 0 0 calc(33.333% - 10px);
            width: calc(33.333% - 10px);
        }

        &.full-width {
            flex: 1;
            width: 100%;
        }
    }
}

.panel-header {
    display: flex;
    gap: 30px;
    margin-bottom: 30px;
    border-bottom: 1px solid #1a1a1a;
}

.panel-content {
    flex: 1;
}

.more-link {
    text-align: center;
    color: #fff;
    font-size: 16px;
    margin-top: auto;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    padding-top: 20px;

    &:hover {
        color: #d4ff00;
    }
}

.panel-title {
    font-size: 20px;
    color: #666;
    padding-bottom: 16px;
    cursor: pointer;
    font-weight: 600;
    position: relative;

    &.active {
        color: #fff;

        &::after {
            content: '';
            position: absolute;
            bottom: -1px;
            left: 0;
            width: 100%;
            height: 2px;
            background-color: #d4ff00;
        }
    }
}

.dark-tables {
    ::v-deep {
        .ivu-table {
            background-color: transparent;
            color: #fff;

            &::before,
            &::after {
                display: none;
            }
        }

        .ivu-table-header th {
            background-color: transparent;
            border-bottom: none;
            color: #666;
            font-weight: normal;
            font-size: 13px;
            padding: 10px 0;
        }

        .ivu-table-tbody td {
            background-color: transparent;
            border-bottom: none;
            padding: 16px 0;
        }

        .ivu-table-row:hover td {
            background-color: rgba(255, 255, 255, 0.02);
        }
    }
}

.green {
    color: #d4ff00 !important;
}

.red {
    color: #f43f5e !important;
}

::v-deep(.ivu-table-column-right) {
    display: flex;
    align-items: center;
    justify-content: center;
}
</style>