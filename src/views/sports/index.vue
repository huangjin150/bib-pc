<template>
    <div class="sports-page">
        <div class="main-content">
            <div class="header">
                <h1>体育直播</h1>
                <div class="actions">
                    <i class="el-icon-search"></i>
                    <i class="el-icon-s-operation"></i>
                </div>
            </div>

            <div v-for="category in categories" :key="category.name" class="category-section">
                <h2 class="category-title">{{ category.name }}</h2>

                <div v-for="event in category.events" :key="event.id" class="event-card"
                    @click="handleCardClick(event)">
                    <div class="event-header">
                        <div class="event-info">
                            <span v-if="event.isLive" class="live-badge"><span class="dot"></span>实时</span>
                            <span v-if="event.set" class="set-info">{{ event.set }}</span>
                            <span v-else class="time-info">{{ event.time }}</span>
                            <span class="volume-info">{{ event.volume }} 交易量</span>
                            <span v-if="event.title" class="title-info">· {{ event.title }}</span>
                        </div>
                        <div class="event-actions">
                            <div class="views-badge" @click.stop="handleCardClick(event)">
                                <span class="view-count">{{ event.views }}</span>
                                <span>比赛视图 <i
                                        :class="event.expanded ? 'el-icon-arrow-up' : 'el-icon-arrow-right'"></i></span>
                            </div>
                        </div>
                    </div>

                    <div class="event-body">
                        <div class="teams-list">
                            <div v-for="team in event.teams" :key="team.id" class="team-row">
                                <div class="team-info">
                                    <span class="team-icon">{{ team.icon }}</span>
                                    <span class="team-name">{{ team.name }}</span>
                                    <span class="team-score" v-if="team.score">{{ team.score }}</span>
                                </div>
                            </div>
                        </div>
                        <div class="odds-list">
                            <div class="odds-header" v-if="event.id === 3">
                                <span>胜负线</span>
                                <span>让分</span>
                                <span>总分</span>
                            </div>
                            <div v-for="(team, idx) in event.teams" :key="'odd-' + team.id" class="odd-btn-row">
                                <button class="odd-btn" :class="team.color" @click.stop="openTrade(event, team)">
                                    <span class="team-short">{{ team.shortName || team.name.substring(0,
                                        7).toUpperCase()
                                    }}</span>
                                    <span class="team-price">{{ team.price }}</span>
                                </button>
                                <div v-if="event.id === 3 || event.id === 4" class="extra-odds">
                                    <button class="extra-btn disabled">--</button>
                                    <button class="extra-btn extra-val"><span class="val-label">{{ idx === 0 ? 'O 21.5'
                                        : 'U 21.5' }}</span> <span class="val-price">{{ idx === 0 ? '0¢' : '99¢'
                                            }}</span></button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <el-collapse-transition>
                        <div class="expanded-section" v-show="event.expanded" @click.stop>
                            <div class="expanded-tabs">
                                <div class="tabs-left">
                                    <span class="tab active">Order Book</span>
                                    <span class="tab">Graph</span>
                                </div>
                                <div class="tabs-right">
                                    <span class="rebate"><i class="el-icon-money"></i> 挂单返佣</span>
                                    <i class="el-icon-refresh refresh-icon"></i>
                                </div>
                            </div>
                            <div class="order-book" v-if="event.orderBook">
                                <div class="ob-header">
                                    <span class="trade-title">TRADE {{ event.teams[1].shortName ||
                                        event.teams[1].name.substring(0, 3).toUpperCase() }} <i
                                            class="el-icon-sort"></i></span>
                                    <span class="col-price">价格</span>
                                    <span class="col-shares">份额</span>
                                    <span class="col-total">总计</span>
                                </div>
                                <div class="ob-asks">
                                    <div v-for="(ask, idx) in event.orderBook.asks" :key="'ask' + idx"
                                        class="ob-row ask-row">
                                        <div class="bg-bar"
                                            :style="{ width: (ask.shares / event.orderBook.maxShare * 100) + '%' }">
                                        </div>
                                        <span class="col-label"><span class="badge red-badge"
                                                v-if="idx === event.orderBook.asks.length - 1">卖单</span></span>
                                        <span class="col-price text-red">{{ ask.price }}</span>
                                        <span class="col-shares">{{ ask.shares.toFixed(2) }}</span>
                                        <span class="col-total">{{ ask.total }}</span>
                                    </div>
                                </div>
                                <div class="ob-middle">
                                    <span>最新价: {{ event.orderBook.lastPrice }}</span>
                                    <span>点差: {{ event.orderBook.spread }}</span>
                                </div>
                                <div class="ob-bids">
                                    <div v-for="(bid, idx) in event.orderBook.bids" :key="'bid' + idx"
                                        class="ob-row bid-row">
                                        <div class="bg-bar"
                                            :style="{ width: (bid.shares / event.orderBook.maxShare * 100) + '%' }">
                                        </div>
                                        <span class="col-label"><span class="badge green-badge"
                                                v-if="idx === 0">买单</span></span>
                                        <span class="col-price text-green">{{ bid.price }}</span>
                                        <span class="col-shares">{{ bid.shares.toFixed(2) }}</span>
                                        <span class="col-total">{{ bid.total }}</span>
                                    </div>
                                </div>
                            </div>
                            <div class="no-data" v-else>
                                暂无订单簿数据
                            </div>
                        </div>
                    </el-collapse-transition>
                </div>
            </div>
        </div>

        <div class="sidebar">
            <div class="trade-panel" v-if="selectedEvent">
                <div class="tp-header">
                    <div class="tp-match">
                        <span class="tp-icon">{{ selectedEvent.teams[0].icon || '🏳️' }}</span>
                        <div class="tp-title-col">
                            <div class="tp-title">{{ selectedEvent.teams[0].shortName ||
                                selectedEvent.teams[0].name.substring(0, 3).toUpperCase() }} vs {{
                                    selectedEvent.teams[1].shortName ||
                                    selectedEvent.teams[1].name.substring(0, 3).toUpperCase() }}</div>
                            <div class="tp-subtitle">
                                <span class="badge-team">{{ selectedTeam.shortName ||
                                    selectedTeam.name.substring(0, 3).toUpperCase() }}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="tp-tabs">
                    <div class="tp-tabs-left">
                        <span class="tp-tab active">买入</span>
                        <span class="tp-tab">卖出</span>
                    </div>
                    <div class="tp-order-type">
                        限价 <i class="el-icon-arrow-down"></i>
                    </div>
                </div>

                <div class="tp-teams-toggle">
                    <button v-for="team in selectedEvent.teams" :key="'tp-' + team.id" class="tp-team-btn"
                        :class="{ active: selectedTeam.id === team.id, [team.color]: selectedTeam.id === team.id }"
                        @click="selectedTeam = team">
                        {{ team.shortName || team.name.substring(0, 3).toUpperCase() }} {{ team.price }}
                    </button>
                </div>

                <div class="tp-input-group">
                    <label>限价</label>
                    <div class="tp-input-control">
                        <button class="minus-btn">-</button>
                        <input type="text" :value="selectedTeam.price" readonly />
                        <button class="plus-btn">+</button>
                    </div>
                </div>

                <div class="tp-input-group">
                    <label>份额</label>
                    <div class="tp-input-control shares-control">
                        <input type="number" v-model.number="tradeShares" />
                    </div>
                </div>

                <div class="tp-quick-amounts">
                    <button @click="tradeShares = Math.max(0, tradeShares - 100)">-100</button>
                    <button @click="tradeShares = Math.max(0, tradeShares - 10)">-10</button>
                    <button @click="tradeShares = tradeShares + 10">+10</button>
                    <button @click="tradeShares = tradeShares + 100">+100</button>
                </div>

                <div class="tp-matching-info" v-if="selectedTeam.price === '63¢'">
                    <i class="el-icon-info"></i> 61.85 正在撮合
                </div>

                <div class="tp-setting">
                    <span>设置过期时间</span>
                    <el-switch v-model="expireEnabled"></el-switch>
                </div>

                <div class="tp-summary">
                    <div class="summary-row">
                        <span>总计</span>
                        <span class="value total-val">${{ (tradeShares * parseFloat(selectedTeam.price) /
                            100).toFixed(2) }}</span>
                    </div>
                    <div class="summary-row win-row">
                        <span>赢取 <i class="el-icon-info"></i></span>
                        <span class="value win-val"><i class="el-icon-money"></i> ${{ tradeShares.toFixed(2) }}</span>
                    </div>
                </div>

                <button class="tp-submit-btn" :class="selectedTeam.color">交易</button>

                <div class="tp-terms">
                    交易即表示你同意 <a>使用条款</a>.
                </div>
            </div>
            <div v-else class="empty-trade-panel">
                请在左侧选择一个队伍进行交易
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'SportsPage',
    data() {
        return {
            tradeShares: 137.95,
            expireEnabled: false,
            selectedEvent: null,
            selectedTeam: null,
            categories: [
                {
                    name: "CRINT",
                    events: [
                        {
                            id: 1,
                            time: "下午 3:00",
                            volume: "$5.00K",
                            title: "T20 Challenge Trophy, Women",
                            views: 12,
                            expanded: true,
                            teams: [
                                { id: "t1", name: "Rwanda", shortName: "RWA", score: "0-0", price: "40¢", color: "light-blue", icon: "🇷🇼" },
                                { id: "t2", name: "USA", shortName: "USA", score: "0-0", price: "63¢", color: "dark-red", icon: "🇺🇸" }
                            ],
                            orderBook: {
                                maxShare: 600,
                                asks: [
                                    { price: "70¢", shares: 59.00, total: "$441.98" },
                                    { price: "67¢", shares: 530.01, total: "$400.68" },
                                    { price: "66¢", shares: 10.00, total: "$45.57" },
                                    { price: "63¢", shares: 61.85, total: "$38.97" }
                                ],
                                bids: [
                                    { price: "60¢", shares: 188.11, total: "$112.87" },
                                    { price: "55¢", shares: 500.00, total: "$387.87" },
                                    { price: "50¢", shares: 10.00, total: "$392.87" },
                                    { price: "45¢", shares: 10.00, total: "$397.37" }
                                ],
                                lastPrice: "60¢",
                                spread: "3¢"
                            }
                        },
                        {
                            id: 2,
                            time: "下午 3:30",
                            volume: "$0.00",
                            title: "",
                            views: 12,
                            expanded: false,
                            teams: [
                                { id: "t3", name: "Himalayan Xi", shortName: "HIM", score: "0-0", price: "99¢", color: "blue", icon: "🏔️" },
                                { id: "t4", name: "Kokrajhar", shortName: "KOK", score: "0-0", price: "99¢", color: "blue", icon: "🌲" }
                            ],
                            orderBook: null
                        }
                    ]
                },
                {
                    name: "ATP",
                    events: [
                        {
                            id: 3,
                            isLive: true,
                            set: "S2",
                            volume: "$37.38K",
                            title: "",
                            views: 9,
                            expanded: false,
                            teams: [
                                { id: "t5", name: "Dali Blanch", shortName: "BLAN", score: "7⁷ 1", price: "97.7¢", color: "blue", icon: "🇺🇸" },
                                { id: "t6", name: "Denis Yevseyev", shortName: "YEVSEYE", score: "6² 0", price: "3.0¢", color: "blue", icon: "🇰🇿" }
                            ],
                            orderBook: null
                        },
                        {
                            id: 4,
                            isLive: true,
                            set: "S2",
                            volume: "$34.11K",
                            title: "",
                            views: 9,
                            expanded: false,
                            teams: [
                                { id: "t7", name: "August Holmgren", shortName: "HOLMGRE", score: "", price: "90¢", color: "blue", icon: "🇩🇰" },
                                { id: "t8", name: "Yunchaokete Bu", shortName: "BU", score: "", price: "11¢", color: "blue", icon: "🇨🇳" }
                            ],
                            orderBook: null
                        }
                    ]
                }
            ]
        }
    },
    methods: {
        handleCardClick(event) {
            this.selectEvent(event);
            this.toggleExpand(event);
        },
        selectEvent(event) {
            if (this.selectedEvent && this.selectedEvent.id === event.id) return;
            this.selectedEvent = event;
            this.selectedTeam = event.teams[0];
        },
        openTrade(event, team) {
            this.selectedEvent = event;
            this.selectedTeam = team;
        },
        toggleExpand(targetEvent) {
            const isExpanding = !targetEvent.expanded;
            // 先把所有其他的折叠起来
            this.categories.forEach(category => {
                category.events.forEach(event => {
                    event.expanded = false;
                });
            });
            // 如果原本是折叠状态，则将其展开
            if (isExpanding) {
                targetEvent.expanded = true;
            }
        }
    },
    mounted() {
        // default selection
        this.selectedEvent = this.categories[0].events[0];
        this.selectedTeam = this.categories[0].events[0].teams[1];
    }
}
</script>

<style lang="scss" scoped>
.sports-page {
    display: flex;
    max-width: 1400px;
    margin: 0 auto;
    padding: 20px;
    gap: 20px;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
    color: #1a1a1a;
    min-height: 100vh;
}

.main-content {
    flex: 1;
    min-width: 0;
}

.header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;

    h1 {
        font-size: 28px;
        font-weight: 800;
        margin: 0;
    }

    .actions {
        font-size: 20px;

        i {
            margin-left: 15px;
            cursor: pointer;
            color: #333;
        }
    }
}

.category-section {
    margin-bottom: 30px;

    .category-title {
        font-size: 16px;
        font-weight: 700;
        margin-bottom: 15px;
        text-transform: uppercase;
    }
}

.event-card {
    background: #fff;
    border-radius: 12px;
    padding: 16px;
    margin-bottom: 15px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
    border: 1px solid #eaeaea;
    cursor: pointer;
    transition: box-shadow 0.2s;

    &:hover {
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
    }

    .event-header {
        display: flex;
        justify-content: space-between;
        font-size: 13px;
        color: #666;
        margin-bottom: 15px;

        .event-info {
            display: flex;
            align-items: center;
            gap: 8px;

            .live-badge {
                color: #ff4d4f;
                font-weight: bold;
                display: flex;
                align-items: center;

                .dot {
                    width: 6px;
                    height: 6px;
                    background-color: #ff4d4f;
                    border-radius: 50%;
                    margin-right: 4px;
                }
            }

            .set-info {
                font-weight: bold;
                color: #333;
            }
        }

        .views-badge {
            background: #f0f2f5;
            padding: 2px 8px;
            border-radius: 12px;
            font-size: 12px;
            display: flex;
            align-items: center;
            gap: 4px;
            color: #333;
            cursor: pointer;

            .view-count {
                background: #fff;
                border: 1px solid #ddd;
                border-radius: 8px;
                padding: 0 4px;
                font-size: 11px;
            }
        }
    }

    .event-body {
        display: flex;
        justify-content: space-between;

        .teams-list {
            flex: 1;
            display: flex;
            flex-direction: column;
            gap: 12px;

            .team-row {
                display: flex;
                align-items: center;
                justify-content: space-between;

                .team-info {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    font-size: 15px;
                    font-weight: 600;

                    .team-icon {
                        font-size: 18px;
                    }

                    .team-score {
                        color: #888;
                        font-weight: normal;
                    }
                }
            }
        }

        .odds-list {
            display: flex;
            flex-direction: column;
            gap: 10px;
            min-width: 260px;
            align-items: flex-end;

            .odds-header {
                display: flex;
                font-size: 12px;
                color: #888;
                width: 100%;
                justify-content: space-around;
                margin-bottom: -4px;
            }

            .odd-btn-row {
                display: flex;
                gap: 8px;
            }

            .odd-btn {
                border: none;
                border-radius: 8px;
                padding: 8px 12px;
                color: #fff;
                font-weight: bold;
                cursor: pointer;
                display: flex;
                justify-content: space-between;
                align-items: center;
                width: 120px;
                font-size: 14px;

                &.light-blue {
                    background-color: #5ba3d4;
                }

                &.dark-red {
                    background-color: #a92b3a;
                }

                &.blue {
                    background-color: #2f62fd;
                }

                .team-price {
                    font-weight: 800;
                }
            }

            .extra-odds {
                display: flex;
                gap: 8px;

                .extra-btn {
                    width: 80px;
                    border: 1px solid #eaeaea;
                    background: #fafafa;
                    border-radius: 8px;
                    padding: 8px;
                    display: flex;
                    justify-content: space-between;
                    font-size: 13px;
                    color: #333;

                    &.disabled {
                        color: #ccc;
                        justify-content: center;
                    }

                    .val-price {
                        font-weight: bold;
                    }
                }
            }
        }
    }

    .expanded-section {
        margin-top: 15px;
        border-top: 1px solid #eaeaea;
        padding-top: 15px;

        .expanded-tabs {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 10px;
            font-size: 13px;
            font-weight: bold;

            .tabs-left {
                display: flex;
                gap: 15px;

                .tab {
                    cursor: pointer;
                    color: #888;
                    padding-bottom: 4px;

                    &.active {
                        color: #333;
                        border-bottom: 2px solid #333;
                    }
                }
            }

            .tabs-right {
                display: flex;
                align-items: center;
                gap: 10px;
                color: #d46b08;

                .refresh-icon {
                    color: #888;
                    cursor: pointer;
                }
            }
        }

        .order-book {
            font-size: 13px;
            color: #333;

            .ob-header {
                display: flex;
                color: #888;
                padding: 8px 10px;
                border-bottom: 1px solid #eee;
                font-size: 11px;
                text-transform: uppercase;

                .trade-title {
                    flex: 2;
                    color: #888;
                }

                .col-price,
                .col-shares,
                .col-total {
                    flex: 1;
                    text-align: right;
                }
            }

            .ob-row {
                display: flex;
                padding: 4px 10px;
                position: relative;
                align-items: center;

                .bg-bar {
                    position: absolute;
                    top: 0;
                    left: 0;
                    bottom: 0;
                    opacity: 0.1;
                    z-index: 0;
                }

                &.ask-row .bg-bar {
                    background-color: #ff4d4f;
                }

                &.bid-row .bg-bar {
                    background-color: #52c41a;
                }

                .text-red {
                    color: #ff4d4f;
                    font-weight: bold;
                }

                .text-green {
                    color: #52c41a;
                    font-weight: bold;
                }

                span {
                    z-index: 1;
                }

                .col-label {
                    flex: 2;

                    .badge {
                        font-size: 10px;
                        padding: 2px 6px;
                        border-radius: 4px;
                        color: #fff;

                        &.red-badge {
                            background-color: #ff4d4f;
                        }

                        &.green-badge {
                            background-color: #52c41a;
                        }
                    }
                }

                .col-price,
                .col-shares,
                .col-total {
                    flex: 1;
                    text-align: right;
                }
            }

            .ob-middle {
                display: flex;
                justify-content: space-between;
                padding: 8px 10px;
                color: #888;
                font-size: 12px;
                border-top: 1px solid #eee;
                border-bottom: 1px solid #eee;
            }
        }

        .no-data {
            text-align: center;
            color: #888;
            padding: 20px;
            font-size: 13px;
        }
    }
}

.sidebar {
    width: 340px;
    flex-shrink: 0;

    .trade-panel {
        background: #fff;
        border-radius: 16px;
        padding: 20px;
        box-shadow: 0 4px 16px rgba(0, 0, 0, 0.06);
        position: sticky;
        top: 80px;
        border: 1px solid #eaeaea;

        .tp-header {
            margin-bottom: 20px;

            .tp-match {
                display: flex;
                align-items: center;
                gap: 12px;

                .tp-icon {
                    font-size: 24px;
                    background: #f0f2f5;
                    width: 40px;
                    height: 40px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    border-radius: 50%;
                }

                .tp-title-col {
                    .tp-title {
                        font-weight: 800;
                        font-size: 16px;
                    }

                    .tp-subtitle {
                        margin-top: 4px;

                        .badge-team {
                            background: #f0f2f5;
                            color: #666;
                            padding: 2px 6px;
                            border-radius: 4px;
                            font-size: 11px;
                        }
                    }
                }
            }
        }

        .tp-tabs {
            display: flex;
            justify-content: space-between;
            border-bottom: 1px solid #eee;
            margin-bottom: 15px;

            .tp-tabs-left {
                display: flex;
                gap: 15px;

                .tp-tab {
                    font-size: 16px;
                    font-weight: bold;
                    color: #888;
                    padding-bottom: 8px;
                    cursor: pointer;

                    &.active {
                        color: #333;
                        border-bottom: 2px solid #333;
                    }
                }
            }

            .tp-order-type {
                font-size: 13px;
                color: #666;
                cursor: pointer;
            }
        }

        .tp-teams-toggle {
            display: flex;
            gap: 10px;
            margin-bottom: 20px;

            .tp-team-btn {
                flex: 1;
                border: 1px solid #eaeaea;
                background: #f7f9fa;
                color: #666;
                padding: 12px;
                border-radius: 8px;
                font-weight: bold;
                font-size: 15px;
                cursor: pointer;
                display: flex;
                justify-content: space-between;
                transition: all 0.2s;

                &.active {
                    color: #fff;
                    border-color: transparent;

                    &.light-blue {
                        background-color: #5ba3d4;
                    }

                    &.dark-red {
                        background-color: #a92b3a;
                    }

                    &.blue {
                        background-color: #2f62fd;
                    }
                }
            }
        }

        .tp-input-group {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 15px;

            label {
                font-size: 14px;
                color: #666;
                font-weight: 500;
            }

            .tp-input-control {
                display: flex;
                border: 1px solid #eaeaea;
                border-radius: 8px;
                overflow: hidden;
                width: 140px;

                button {
                    width: 36px;
                    background: #fff;
                    border: none;
                    font-size: 16px;
                    cursor: pointer;
                    color: #666;

                    &:hover {
                        background: #f0f2f5;
                    }
                }

                input {
                    flex: 1;
                    width: 100%;
                    border: none;
                    text-align: center;
                    font-weight: bold;
                    font-size: 15px;
                    outline: none;
                    border-left: 1px solid #eaeaea;
                    border-right: 1px solid #eaeaea;
                }

                &.shares-control {
                    width: 180px;

                    input {
                        border: none;
                        text-align: right;
                        padding-right: 10px;
                    }
                }
            }
        }

        .tp-quick-amounts {
            display: flex;
            justify-content: flex-end;
            gap: 6px;
            margin-bottom: 15px;

            button {
                background: #fff;
                border: 1px solid #eaeaea;
                border-radius: 16px;
                padding: 4px 10px;
                font-size: 12px;
                color: #666;
                cursor: pointer;

                &:hover {
                    background: #f0f2f5;
                }
            }
        }

        .tp-matching-info {
            text-align: right;
            color: #52c41a;
            font-size: 12px;
            margin-bottom: 15px;
        }

        .tp-setting {
            display: flex;
            justify-content: space-between;
            align-items: center;
            font-size: 13px;
            color: #888;
            margin-bottom: 20px;
            padding-top: 15px;
            border-top: 1px solid #eaeaea;
        }

        .tp-summary {
            margin-bottom: 20px;

            .summary-row {
                display: flex;
                justify-content: space-between;
                margin-bottom: 8px;
                font-size: 14px;
                color: #666;

                .value {
                    font-weight: bold;
                    color: #333;
                }

                &.win-row {
                    .win-val {
                        color: #52c41a;
                    }
                }
            }
        }

        .tp-submit-btn {
            width: 100%;
            border: none;
            border-radius: 8px;
            padding: 14px;
            color: #fff;
            font-weight: bold;
            font-size: 16px;
            cursor: pointer;
            margin-bottom: 15px;

            &.light-blue {
                background-color: #5ba3d4;
            }

            &.dark-red {
                background-color: #a92b3a;
            }

            &.blue {
                background-color: #2f62fd;
            }

            &:hover {
                opacity: 0.9;
            }
        }

        .tp-terms {
            text-align: center;
            font-size: 11px;
            color: #888;

            a {
                color: #666;
                text-decoration: underline;
            }
        }
    }

    .empty-trade-panel {
        background: #fff;
        border-radius: 16px;
        padding: 40px 20px;
        text-align: center;
        color: #888;
        box-shadow: 0 4px 16px rgba(0, 0, 0, 0.06);
        border: 1px solid #eaeaea;
    }
}

/* 覆盖 ElementUI switch 样式使其更贴近原生 */
::v-deep(.el-switch__core) {
    height: 24px;
    border-radius: 12px;
}

::v-deep(.el-switch__core:after) {
    width: 20px;
    height: 20px;
}
</style>