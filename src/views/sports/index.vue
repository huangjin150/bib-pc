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
                            <div v-for="(team, idx) in event.teams" :key="'odd-' + team.id" class="odd-btn-row">
                                <button class="odd-btn" :class="team.color" @click.stop="openTrade(event, team, null)">
                                    <span class="team-short">{{ team.shortName || team.name.substring(0,
                                        7).toUpperCase() }}</span>
                                    <span class="team-price">{{ team.price }}</span>
                                </button>
                            </div>
                        </div>
                    </div>

                    <el-collapse-transition>
                        <div class="expanded-section" v-show="event.expanded" @click.stop>
                            <div class="markets-container" v-if="event.markets && event.markets.length > 0">
                                <div v-for="market in event.markets" :key="'market-' + market.id"
                                    class="expanded-market-section">
                                    <div class="market-header">
                                        <div class="market-title-wrap">
                                            <span class="market-blue-bar"></span>
                                            <span class="market-title-text">{{ market.marketTitle }}</span>
                                        </div>
                                        <div class="market-stats">
                                            <div class="stat-item">总下注: ${{ market.totalBetAmount || 0 }}</div>
                                            <div class="stat-item">参与人数: {{ market.totalUserCount || 0 }}</div>
                                        </div>
                                    </div>
                                    <div class="market-options-grid">
                                        <div v-for="(option, idx) in market.options" :key="'opt-' + option.id"
                                            class="option-row-btn" @click.stop="openTrade(event, option, market)">
                                            <span class="opt-name">{{ option.optionName }}</span>
                                            <span class="opt-price">{{ Number(option.currentPrice).toFixed(4) }}
                                                $</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="no-data" v-else>
                                加载中...
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
                    <button v-if="selectedTeam && selectedTeam.marketData"
                        v-for="option in selectedTeam.marketData.options" :key="'tp-' + option.id" class="tp-team-btn"
                        :class="{ active: selectedTeam.id === option.id, [selectedTeam.color]: selectedTeam.id === option.id }"
                        @click="openTrade(selectedEvent, option, selectedTeam.marketData)">
                        {{ option.optionName.substring(0, 3).toUpperCase() }} ${{ Number(option.currentPrice).toFixed(4)
                        }}
                    </button>
                    <!-- Fallback for events without marketData loaded yet -->
                    <button v-if="!selectedTeam || !selectedTeam.marketData" v-for="team in selectedEvent.teams"
                        :key="'tp-fallback-' + team.id" class="tp-team-btn"
                        :class="{ active: selectedTeam && selectedTeam.id === team.id, [team.color]: selectedTeam && selectedTeam.id === team.id }"
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

                <div class="tp-matching-info" v-if="selectedTeam.price === '$0.63'">
                    <i class="el-icon-info"></i> 61.85 正在撮合
                </div>

                <div class="tp-setting">
                    <span>设置过期时间</span>
                    <el-switch v-model="expireEnabled"></el-switch>
                </div>

                <div class="tp-summary">
                    <div class="summary-row">
                        <span>总计</span>
                        <span class="value total-val">${{ (tradeShares * parseFloat(selectedTeam.price.replace('$',
                            ''))).toFixed(2) }}</span>
                    </div>
                    <div class="summary-row win-row">
                        <span>赢取 <i class="el-icon-info"></i></span>
                        <span class="value win-val"><i class="el-icon-money"></i> ${{ tradeShares.toFixed(2) }}</span>
                    </div>
                </div>

                <button class="tp-submit-btn" :class="selectedTeam.color" @click="submitBet" :disabled="isSubmitting">
                    {{ isSubmitting ? '交易中...' : '交易' }}
                </button>

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
            categories: [],
            isSubmitting: false
        }
    },
    methods: {
        getLeagues() {
            this.$http.get(this.swapHost + "/quiz/leagues").then(response => {
                let resp = response.body;
                if (resp && resp.code == 0 && resp.data) {
                    const leagues = resp.data.map(item => ({
                        id: item.id,
                        name: item.leagueName,
                        leagueCode: item.leagueCode,
                        country: item.country,
                        sportType: item.sportType,
                        matchCount: item.matchCount,
                        events: []
                    }));

                    this.categories = leagues;
                    this.getMatches();
                }
            });
        },
        getMatches() {
            // 遍历所有联赛，分别通过 ?leagueId=xxx 请求比赛数据
            this.categories.forEach(league => {
                this.$http.get(this.swapHost + `/quiz/matches?leagueId=${league.id}`).then(response => {
                    let resp = response.body;
                    if (resp && resp.code == 0 && resp.data) {
                        resp.data.forEach(match => {
                            // 拆分队名
                            let teamNames = match.matchName.split(' 对阵 ');
                            if (teamNames.length !== 2) teamNames = match.matchName.split(' vs ');
                            if (teamNames.length !== 2) teamNames = [match.matchName, 'Unknown'];

                            const team1 = match.homeTeam || teamNames[0];
                            const team2 = match.awayTeam || teamNames[1];

                            const event = {
                                id: match.id,
                                time: new Date(match.startTime).toLocaleString(),
                                volume: match.marketCount + " 市场",
                                title: match.matchName,
                                views: match.marketCount, // 用 marketCount 暂代浏览量/市场数
                                expanded: false,
                                isLive: match.matchStatus === 1,
                                teams: [
                                    {
                                        id: "t1_" + match.id,
                                        name: team1,
                                        shortName: team1.substring(0, 3).toUpperCase(),
                                        score: match.homeScore || "0-0",
                                        price: "",
                                        color: "light-blue",
                                        icon: match.homeLogo || "🏳️"
                                    },
                                    {
                                        id: "t2_" + match.id,
                                        name: team2,
                                        shortName: team2.substring(0, 3).toUpperCase(),
                                        score: match.awayScore || "0-0",
                                        price: "",
                                        color: "dark-red",
                                        icon: match.awayLogo || "🏳️"
                                    }
                                ],
                                orderBook: null
                            };
                            league.events.push(event);
                        });

                        // 首次加载到有数据的比赛时，更新右侧交易面板的默认选中
                        if (!this.selectedEvent && league.events.length > 0) {
                            this.selectedEvent = league.events[0];
                            this.selectedTeam = league.events[0].teams[1];
                            this.getMatchDetails(league.events[0].id);
                        }
                    }
                });
            });
        },
        handleCardClick(event) {
            this.selectEvent(event);
            this.toggleExpand(event);
        },
        selectEvent(event) {
            if (this.selectedEvent && this.selectedEvent.id === event.id) return;
            this.selectedEvent = event;
            this.selectedTeam = event.teams[0];

            // 请求比赛详情获取 markets
            this.getMatchDetails(event.id);
        },
        getMatchDetails(matchId) {
            this.$http.get(this.swapHost + `/quiz/matches/${matchId}`).then(response => {
                let resp = response.body;
                if (resp && resp.code == 0 && resp.data) {
                    const matchData = resp.data;
                    // Find the event in categories and update it
                    for (let league of this.categories) {
                        const event = league.events.find(e => e.id === matchId);
                        if (event && matchData.markets && matchData.markets.length > 0) {
                            // 将接口返回的所有 markets 存入 event
                            event.markets = matchData.markets;

                            // 更新 event 里面的 teams 数据为第一个 options 的数据（仅更新价格和附加数据，保留队名和图标）
                            const mainMarket = matchData.markets[0];
                            if (mainMarket.options && mainMarket.options.length >= 2) {
                                event.teams[0].price = "$" + Number(mainMarket.options[0].currentPrice).toFixed(4);
                                event.teams[0].optionData = mainMarket.options[0];
                                event.teams[0].marketData = mainMarket;

                                event.teams[1].price = "$" + Number(mainMarket.options[1].currentPrice).toFixed(4);
                                event.teams[1].optionData = mainMarket.options[1];
                                event.teams[1].marketData = mainMarket;
                            }

                            // 更新当前选中状态
                            if (this.selectedEvent && this.selectedEvent.id === matchId) {
                                // 默认选中第一个 market 的第一个 option
                                const mainMarket = matchData.markets[0];
                                if (mainMarket.options && mainMarket.options.length > 0) {
                                    this.openTrade(event, mainMarket.options[0], mainMarket);
                                }
                            }

                            // 强制 Vue 响应式更新
                            this.$forceUpdate();
                            break;
                        }
                    }
                }
            });
        },
        openTrade(event, optionOrTeam, market) {
            this.selectedEvent = event;
            let color = "blue";
            let icon = "🎯";

            // 如果从快捷按钮点过来，且包含 optionData 和 marketData，按市场逻辑处理
            if (!market && optionOrTeam.marketData && optionOrTeam.optionData) {
                market = optionOrTeam.marketData;
                color = optionOrTeam.color || "blue";
                icon = optionOrTeam.icon || "🎯";
                optionOrTeam = optionOrTeam.optionData;
            }

            if (market) {
                // 尝试从 teams 中匹配颜色和图标
                const matchingTeam = event.teams.find(t => t.optionData && t.optionData.id === optionOrTeam.id);
                if (matchingTeam) {
                    color = matchingTeam.color || color;
                    icon = matchingTeam.icon || icon;
                }

                // from markets list
                this.selectedTeam = {
                    id: optionOrTeam.id,
                    name: optionOrTeam.optionName,
                    shortName: optionOrTeam.optionName.substring(0, 3).toUpperCase(),
                    price: "$" + Number(optionOrTeam.currentPrice).toFixed(4),
                    color: color,
                    icon: icon,
                    optionData: optionOrTeam,
                    marketData: market
                };
            } else {
                // from teams list
                this.selectedTeam = optionOrTeam;
            }
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
        },
        submitBet() {
            if (!this.selectedTeam || !this.selectedTeam.marketData || !this.selectedTeam.optionData) {
                this.$message.warning('请选择有效的下注选项（比赛数据可能仍在加载中）');
                return;
            }
            if (!this.tradeShares || this.tradeShares <= 0) {
                this.$message.warning('请输入有效的下注份额');
                return;
            }

            this.isSubmitting = true;
            const payload = {
                marketId: this.selectedTeam.marketData.id,
                optionId: this.selectedTeam.optionData.id,
                betAmount: this.tradeShares,
                deviceId: 'pc'
            };

            this.$http.post(this.swapHost + '/quiz/bet', payload).then(response => {
                this.isSubmitting = false;
                let resp = response.body;
                if (resp && resp.code == 0) {
                    this.$message.success('交易成功');
                    // 可以在这里刷新用户余额或更新比赛数据
                    this.getMatchDetails(this.selectedEvent.id);
                } else {
                    this.$message.error((resp && resp.msg) ? resp.msg : '交易失败');
                }
            }).catch(err => {
                this.isSubmitting = false;
                this.$message.error('网络请求失败，请稍后重试');
            });
        }
    },
    mounted() {
        this.getLeagues();
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
                height: 36px;
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
                    height: 36px;
                    border: 1px solid #eaeaea;
                    background: #fafafa;
                    border-radius: 8px;
                    padding: 8px;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
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

        .markets-container {
            display: flex;
            flex-direction: column;
            gap: 16px;

            .expanded-market-section {
                background: #fff;
                border-radius: 12px;
                padding: 16px;
                border: 1px solid #f0f0f0;
                box-shadow: 0 2px 8px rgba(0, 0, 0, 0.02);

                .market-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    border-bottom: 1px solid #f0f0f0;
                    padding-bottom: 12px;
                    margin-bottom: 12px;

                    .market-title-wrap {
                        display: flex;
                        align-items: center;
                        gap: 8px;

                        .market-blue-bar {
                            width: 3px;
                            height: 16px;
                            background-color: #2f62fd;
                            border-radius: 2px;
                        }

                        .market-title-text {
                            font-size: 15px;
                            font-weight: bold;
                            color: #333;
                        }
                    }

                    .market-stats {
                        display: flex;
                        flex-direction: column;
                        align-items: flex-end;
                        font-size: 12px;
                        color: #888;
                        gap: 4px;
                    }
                }

                .market-options-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
                    gap: 10px;

                    .option-row-btn {
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                        padding: 12px 16px;
                        background-color: #f8f9fa;
                        border-radius: 8px;
                        cursor: pointer;
                        transition: all 0.2s ease;
                        border: 1px solid transparent;

                        &:hover {
                            background-color: #f0f2f5;
                            border-color: #2f62fd;
                        }

                        .opt-name {
                            font-size: 14px;
                            color: #333;
                            font-weight: 500;
                        }

                        .opt-price {
                            font-size: 14px;
                            font-weight: bold;
                            color: #2f62fd;
                        }
                    }
                }
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