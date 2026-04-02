<template>
    <div class="market-container">
        <!-- 如果是行情页模式，展示单面板多Tab -->
        <div class="market-panels" v-if="isMarketPage">
            <div class="panel-box full-width">
                <div class="panel-header">
                    <div class="panel-title" v-for="(cat, index) in categories" :key="index"
                        :class="{ active: activeTab === cat }" @click="activeTab = cat">{{ cat }}</div>
                </div>

                <div class="sort-options">
                    <div class="sort-item" :class="{ active: activeSort === 'gainers' }"
                        @click="activeSort = 'gainers'">涨幅榜</div>
                    <div class="sort-item" :class="{ active: activeSort === 'losers' }" @click="activeSort = 'losers'">
                        跌幅榜</div>
                    <div class="sort-item" :class="{ active: activeSort === 'volume' }" @click="activeSort = 'volume'">
                        成交额</div>
                </div>

                <div class="panel-content">
                    <Table style="border: none;" :columns="contractColumns" :data="tableData" class="dark-tables"
                        :disabled-hover="false" :loading="loading" :no-data-text="$t('common.nodata')">
                    </Table>
                </div>
            </div>
        </div>

        <!-- 默认首页模式，展示单面板 -->
        <div class="market-panels" v-else>
            <div class="panel-box full-width">
                <div class="panel-header home-panel-header">
                    <div class="header-left">
                        <div class="panel-title" v-for="(cat, index) in categories" :key="index"
                            :class="{ active: activeTab === cat }" @click="activeTab = cat">{{ cat }}</div>
                    </div>
                    <div class="header-right">
                        <div class="sort-options home-sort">
                            <div class="sort-item" :class="{ active: activeSort === 'gainers' }"
                                @click="activeSort = 'gainers'">涨幅榜</div>
                            <div class="sort-item" :class="{ active: activeSort === 'losers' }"
                                @click="activeSort = 'losers'">跌幅榜</div>
                            <div class="sort-item" :class="{ active: activeSort === 'volume' }"
                                @click="activeSort = 'volume'">成交额</div>
                        </div>
                        <div class="more-link-top" @click="$router.push('/market')">
                            查看更多 <span style="font-size: 16px; margin-left: 2px;">→</span>
                        </div>
                    </div>
                </div>

                <div class="panel-content">
                    <Table style="border: none;" :columns="spotColumns" :data="tableData" class="dark-tables"
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
            activeTab: '',
            activeSort: 'gainers', // 默认涨幅榜
            activeHomeTab: 'gainers',
            allData: [],
            categories: [],
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

            // 1. 先按分类过滤
            if (this.activeTab && this.categories.includes(this.activeTab)) {
                data = data.filter(item => item.category === this.activeTab);
            }

            // 2. 再根据当前分类进行排序
            if (this.activeSort === 'gainers') {
                data.sort((a, b) => parseFloat(b.rose) - parseFloat(a.rose));
            } else if (this.activeSort === 'losers') {
                data.sort((a, b) => parseFloat(a.rose) - parseFloat(b.rose));
            } else if (this.activeSort === 'volume') {
                data.sort((a, b) => parseFloat(b.volume) - parseFloat(a.volume));
            }

            // 行情页展示更多数据，首页截取前8条
            return this.isMarketPage ? data : data.slice(0, 8);
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
                let categorySet = new Set();
                for (var i = 0; i < resp.length; i++) {
                    var coin = resp[i];
                    coin.price = resp[i].close;
                    coin.rose = resp[i].chg > 0 ? "+" + (resp[i].chg * 100).toFixed(2) + "%" : (resp[i].chg * 100).toFixed(2) + "%";
                    coin.coin = resp[i].symbol.split("/")[0];
                    coin.base = resp[i].symbol.split("/")[1];
                    coin.href = (coin.coin + "_" + coin.base).toLowerCase();
                    this.coins._map[coin.symbol] = coin;
                    processedData.push(coin);

                    if (coin.category) {
                        categorySet.add(coin.category);
                    }
                }

                this.allData = processedData;

                // 获取前三个类别
                this.categories = Array.from(categorySet).slice(0, 3);
                if (this.categories.length > 0) {
                    this.activeTab = this.categories[0];
                }

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
    transition: color 0.3s ease;

    &:hover {
        color: #fff;
    }

    &.active {
        color: #fff;

        &::after {
            content: '';
            position: absolute;
            bottom: -1px;
            left: 50%;
            transform: translateX(-50%);
            width: 30px;
            height: 3px;
            border-radius: 3px;
            background-color: #d4ff00;
        }
    }
}

.sort-options {
    display: flex;
    gap: 12px;
    margin-bottom: 20px;

    .sort-item {
        font-size: 13px;
        color: #8e949e;
        cursor: pointer;
        padding: 6px 16px;
        border-radius: 6px;
        background: rgba(255, 255, 255, 0.03);
        transition: all 0.3s ease;

        &:hover {
            color: #fff;
            background: rgba(255, 255, 255, 0.08);
        }

        &.active {
            color: #d4ff00;
            background: rgba(212, 255, 0, 0.1);
            font-weight: 600;
        }
    }
}

.home-panel-header {
    justify-content: space-between;
    align-items: flex-end;
    padding-right: 100px;
    margin-bottom: 20px;
    border-bottom: 1px solid #1a1a1a;
    display: flex;
    width: 100%;

    .header-left {
        display: flex;
        gap: 40px;
    }

    .header-right {
        display: flex;
        align-items: center;
        gap: 24px;
        padding-bottom: 16px;
    }

    .home-sort {
        margin-bottom: 0;
        gap: 12px;
    }
}

.more-link-top {
    color: #8e949e;
    font-size: 14px;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 4px;
    padding-left: 12px;
    border-left: 1px solid #333;
    transition: color 0.3s ease;

    &:hover {
        color: #d4ff00;
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