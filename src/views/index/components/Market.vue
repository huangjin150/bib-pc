<template>
    <div>
        <div class="section" id="page2">
            <div class="page2"
                style="font-size: 40px; margin-bottom: 70px; font-weight: 700;color: #000; border: none;">市场趋势</div>
            <div style="border: none;" class="ptjy">
                <Table style="border: none;" :columns="coins.columns" :data="dataIndex" class="tables"
                    :disabled-hover="false" :loading="loading" :no-data-text="$t('common.nodata')">
                </Table>
            </div>
        </div>
    </div>
</template>

<script>
var Stomp = require("stompjs");
var SockJS = require("sockjs-client");
import SvgLine from "@/components/exchange/SvgLine.vue";

export default {
    name: 'MarketComponents',
    data() {
        let self = this;
        return {
            loading: false,
            dataIndex: [],
            trendData: {
                highest: 0,
                lowest: 0,
                close: 0,
                volume: 0
            },
            coins: {
                _map: [],
                USDT: [],
                USDT2: [],
                BTC: [],
                BTC2: [],
                ETH: [],
                ETH2: [],
                favor: [],
                columns: [
                    {
                        title: self.$t("service.COIN"),
                        key: "coin",
                        whiteSSpace: 'nowrap',
                        width: 280,
                        render: function (h, params) {
                            return h("div", {
                                attrs: { class: "coin-cell" },
                                style: {
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '12px'
                                }
                            }, [
                                h("img", {
                                    attrs: {
                                        src: params.row.logo,
                                        alt: params.row.coin,
                                    },
                                    style: {
                                        width: '32px',
                                        height: '32px',
                                        borderRadius: '50%'
                                    }
                                }),
                                h("span", {
                                    style: { fontSize: "16px", fontWeight: 600, color: "#333" }
                                }, params.row.coin + "/" + params.row.base)
                            ]);
                        }
                    },
                    {
                        title: self.$t("service.NewPrice"),
                        key: "price",
                        minWidth: 90,
                        sortable: true,
                        sortMethod: function (a, b, type) {
                            let a1 = parseFloat(a);
                            let b1 = parseFloat(b);
                            if (type == "asc") {
                                return a1 - b1;
                            } else {
                                return b1 - a1;
                            }
                        },
                        render: function (h, params) {
                            const isUp = parseFloat(params.row.rose) >= 0;
                            return h("div", {
                                attrs: { class: "price-td" }
                            }, [
                                h("span", {
                                    style: {
                                        fontSize: "16px",
                                        fontWeight: 600,
                                        verticalAlign: "middle"
                                    },
                                    class: { green: isUp, red: !isUp }
                                }, String(params.row.price)),
                                h("span", {
                                    style: {
                                        fontSize: "14px",
                                        color: "#999",
                                        marginLeft: "8px"
                                    }
                                }, "$" + String(params.row.price))
                            ]);
                        }
                    },
                    {
                        title: self.$t("service.Change"),
                        key: "rose",
                        minWidth: 60,
                        sortable: true,
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
                            const isUp = parseFloat(row.rose) >= 0;
                            return h(
                                "span",
                                { class: { green: isUp, red: !isUp }, style: { fontWeight: 600 } },
                                row.rose
                            );
                        }
                    },
                    {
                        title: self.$t("service.high"),
                        minWidth: 60,
                        key: "high",
                        render: (h, params) => {
                            return h("div", { attrs: { class: "cell-text" } }, params.row.high);
                        }
                    },
                    {
                        title: self.$t("service.ExchangeNum"),
                        key: "volume",
                        minWidth: 70,
                        sortable: true,
                        sortMethod: function (a, b, type) {
                            let a1 = parseFloat(a);
                            let b1 = parseFloat(b);
                            if (type == "asc") {
                                return a1 - b1;
                            } else {
                                return b1 - a1;
                            }
                        }
                    },
                    {
                        title: self.$t("service.PriceTrend"),
                        minWidth: 120,
                        render: function (h, params) {
                            let valus = null;
                            let len = params.row.trend.length;
                            valus = len > 0 ? params.row.trend : Array(25).fill(0);
                            return h(SvgLine, {
                                props: {
                                    values: valus,
                                    rose: params.row.rose,
                                    width: 120,
                                    height: 35
                                }
                            });
                        }
                    },
                    {
                        title: self.$t("service.Operate"),
                        key: "buyBtn",
                        minWidth: 100,
                        render: function (h, params) {
                            return h("div", [
                                h("span", {
                                    attrs: { class: "trade-btn" },
                                    style: {
                                        backgroundColor: '#f8f8f8',
                                        cursor: "pointer",
                                        textAlign: 'center',
                                        width: '100px',
                                        color: "#000",
                                        display: "inline-block",
                                        padding: "10px 15px",
                                        borderRadius: '10px'
                                    },
                                    on: {
                                        click: function () {
                                            self.$router.push({
                                                name: 'SwapPair',
                                                params: { pair: params.row.href }
                                            });
                                        }
                                    }
                                }, self.$t("service.trading"))
                            ]);
                        }
                    }
                ],
            },
        }
    },
    methods: {
        addClass(index) {
            this.choseBtn = index;
            if (index == 0) {
                this.dataIndex = this.coins.favor;
            } else if (index == 1) {
                this.dataIndex = this.coins.USDT;
            } else if (index == 2) {
                this.dataIndex = this.coins.BTC;
            } else if (index == 3) {
                this.dataIndex = this.coins.ETH;
            }
        },
        // loadTrendData() {
        //     this.$http
        //         .post(this.swapHost + "/btc/trend", {})
        //         .then(response => {
        //             var resp = response.body;
        //             this.lineValues = resp.data;
        //             // this.$refs["svgIndexRef"].reload(this.lineValues, this.$refs.trendPanel.offsetWidth, this.$refs.trendPanel.offsetWidth / 8);
        //         });
        // },
        isLogin: function () {
            return this.$store.getters.isLogin;
        },
        getCoin(symbol) {
            return this.coins._map[symbol];
        },
        getSymbol() {
            this.loading = true;
            this.$http
                .post(this.swapHost + this.api.market.thumbTrend, {})
                .then(response => {
                    var resp = response.body;
                    for (var i = 0; i < resp.length; i++) {
                        var coin = resp[i];
                        coin.price = resp[i].close;
                        coin.rose =
                            resp[i].chg > 0
                                ? "+" + (resp[i].chg * 100).toFixed(2) + "%"
                                : (resp[i].chg * 100).toFixed(2) + "%";
                        coin.coin = resp[i].symbol.split("/")[0];
                        coin.base = resp[i].symbol.split("/")[1];
                        coin.href = (coin.coin + "_" + coin.base).toLowerCase();
                        coin.isFavor = false;
                        this.coins._map[coin.symbol] = coin;
                        if (coin.zone == 0) {
                            this.coins[coin.base].push(coin); // 主板
                        } else {
                            this.coins[coin.base + "2"].push(coin); // 创新版
                        }

                        if (resp[i].symbol == "BTC/USDT") {
                            this.trendData.highest = resp[i].high;
                            this.trendData.lowest = resp[i].low;
                            this.trendData.volume = resp[i].volume;
                            this.trendData.close = resp[i].close;
                            this.trendData.rose = resp[i].chg > 0
                                ? "+" + (resp[i].chg * 100).toFixed(2) + "%"
                                : (resp[i].chg * 100).toFixed(2) + "%";
                        }
                    }
                    this.startWebsock();
                    this.loading = false;
                });

            // this.loadTrendData();
        },

        startWebsock() {
            var stompClient = null;
            var that = this;
            var socket = new SockJS(that.swapHost + that.api.market.ws);
            stompClient = Stomp.over(socket);
            stompClient.debug = false;
            stompClient.connect({}, function (frame) {
                //订阅价格变化消息
                stompClient.subscribe("/topic/swap/thumb", function (msg) {
                    var resp = JSON.parse(msg.body);
                    var coin = that.getCoin(resp.symbol);
                    if (coin != null) {
                        coin.price = resp.close;
                        coin.rose =
                            resp.chg > 0
                                ? "+" + (resp.chg * 100).toFixed(2) + "%"
                                : (resp.chg * 100).toFixed(2) + "%";
                        coin.close = resp.close;
                        coin.high = resp.high;
                        coin.low = resp.low;
                        coin.turnover = parseInt(resp.volume);

                        if (resp.symbol == "BTC/USDT") {
                            that.trendData.highest = resp.high;
                            that.trendData.lowest = resp.low;
                            that.trendData.volume = resp.volume;
                            that.trendData.close = resp.close;
                            that.trendData.rose = resp.chg > 0
                                ? "+" + (resp.chg * 100).toFixed(2) + "%"
                                : (resp.chg * 100).toFixed(2) + "%";
                        }
                    }
                });
            });
        },
        init() {
            this.getSymbol()
            this.addClass(1);
        },

    },
    created: function () {
        this.init();
    },

}


</script>

<style scoped lang="scss">
#page2 {
    height: auto;
    min-height: 320px;
    max-width: 1260px;
    margin: 0 auto;

    .page2nav {
        line-height: 50px;
        font-size: 20px;
        min-width: 864px;
        display: flex;

        .board-title {
            width: 20%;
            height: 60px;
            line-height: 60px;
            text-align: center;
            background: #ffa800;
            color: #000;
        }

        .brclearfix {
            width: 100%;

            li {
                float: left;
                cursor: pointer;
                color: #fff;
                list-style: none;
                font-size: 16px;
                padding: 5px 40px;
                -moz-box-shadow: 2px 2px 5px transparent, -2px -2px 4px transparent;
                -webkit-box-shadow: 2px 2px 5px transparent, -2px -2px 4px transparent;
                box-shadow: 2px 2px 5px transparent, -2px -2px 4px transparent;

                &:hover {
                    background: #222b38;
                }
            }

            li.active {
                background: #27313e;
                color: #f0a70a;
                position: relative;
                border-bottom: 2px solid #f0a70a;
            }
        }
    }

    .ptjy {
        height: 100%;
        min-width: 864px;

        .tables {
            border: none;

            .ivu-table {
                .ivu-table-header {
                    .ivu-table-column-center {
                        background: #fff !important;
                    }
                }
            }

            th {
                background-color: #fff;
                font-weight: 600;
                color: #666;
                padding: 14px 0;
            }
        }

        .tables ::v-deep .ivu-table-header th {
            background-color: #fff;
            padding: 14px 0;
        }

        .tables ::v-deep .ivu-table-tbody .ivu-table-row td {
            background-color: #fff;
            padding: 14px 0;
        }

        /* 行 hover 高亮 */
        .tables ::v-deep .ivu-table-tbody .ivu-table-row:hover td {
            background-color: #f8f9fa;
        }
    }
}

/* 统一涨跌色 */
.green {
    color: #84cc16;
}

.red {
    color: #f43f5e;
}

.price-td {
    display: flex;
    align-items: baseline;
    gap: 8px;
}

.cell-text {
    font-size: 14px;
    color: #333;
}

/* 操作按钮保持首页风格 */
.trade-btn {
    transition: all .2s ease;
}

.trade-btn:hover {
    background-color: #ececec;
}
</style>