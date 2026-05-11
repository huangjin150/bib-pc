<template>
    <div class="sports-page">
        <div class="main-content">
            <div class="header">
                <div>
                    <h1>体育竞猜</h1>
                </div>
            </div>

            <div class="match-tabs">
                <button
                    v-for="tab in tabs"
                    :key="tab.key"
                    class="match-tab"
                    :class="{ active: activeTab === tab.key }"
                    @click="activeTab = tab.key"
                >
                    {{ tab.label }}
                    <span class="tab-count">{{ getTabEventCount(tab.key) }}</span>
                </button>
            </div>

            <div v-for="category in categories" :key="category.id" class="category-section">
                <template v-if="filteredEvents(category).length">
                    <h2 class="category-title">{{ category.name }}</h2>

                    <div v-for="event in filteredEvents(category)" :key="event.id" class="event-card" @click="handleCardClick(event)">
                        <div class="event-header">
                            <div class="event-info">
                                <span v-if="event.matchStatus === 2" class="live-badge"><span class="dot"></span>进行中</span>
                                <span class="time-info">{{ event.time }}</span>
                                <span class="title-info">{{ event.title }}</span>
                            </div>
                            <div class="event-actions">
                                <span class="market-count">{{ event.marketCount }} 个市场</span>
                                <span class="match-status" :class="statusClass(event.statusText)">{{ event.statusText }}</span>
                            </div>
                        </div>

                        <div class="event-body">
                            <div class="teams-list">
                                <div v-for="team in event.teams" :key="team.id" class="team-row">
                                    <div class="team-info">
                                        <span class="team-icon">{{ team.icon }}</span>
                                        <span class="team-name">{{ team.name }}</span>
                                    </div>
                                    <span class="team-score">{{ team.score }}</span>
                                </div>
                            </div>

                            <div class="odds-list">
                                <button
                                    v-for="team in event.teams"
                                    :key="'odd-' + team.id"
                                    class="odd-btn"
                                    :class="[team.color, { disabled: !team.bettable }]"
                                    :disabled="!team.bettable"
                                    @click.stop="openTrade(event, team.optionData, team.marketData)"
                                >
                                    <span class="team-short">{{ team.shortName }}</span>
                                    <span class="team-price">{{ formatOddsLabel(team.optionData) }}</span>
                                </button>
                            </div>
                        </div>

                        <el-collapse-transition>
                            <div class="expanded-section" v-show="event.expanded" @click.stop>
                                <div class="markets-container" v-if="event.markets && event.markets.length">
                                    <div v-for="market in event.markets" :key="'market-' + market.id" class="expanded-market-section">
                                        <div class="market-header">
                                            <div class="market-title-wrap">
                                                <span class="market-blue-bar"></span>
                                                <div>
                                                    <div class="market-title-text">{{ market.marketTitle }}</div>
                                                    <div class="market-meta">
                                                        <span :class="['status-pill', statusClass(market.marketStatusText)]">
                                                            {{ market.marketStatusText }}
                                                        </span>
                                                        <span>截止 {{ formatDateTime(market.closeTime) }}</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="market-stats">
                                                <div class="stat-item">总下注: {{ formatAmount(market.totalBetAmount) }} USDT</div>
                                                <div class="stat-item">参与人数: {{ market.totalUserCount || 0 }}</div>
                                            </div>
                                        </div>

                                        <div class="market-options-grid">
                                            <button
                                                v-for="option in market.options"
                                                :key="'opt-' + option.id"
                                                class="option-row-btn"
                                                :class="{ disabled: !option.bettable, active: isSelectedOption(option) }"
                                                :disabled="!option.bettable"
                                                @click.stop="openTrade(event, option, market)"
                                            >
                                                <span class="opt-name">{{ option.optionName }}</span>
                                                <span class="opt-values">
                                                    <span class="opt-odds">{{ formatOdds(option.currentOdds) }}</span>
                                                    <span class="opt-price">{{ formatPrice(option.currentPrice) }}</span>
                                                </span>
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                <div class="no-data" v-else>
                                    暂无可展示市场
                                </div>
                            </div>
                        </el-collapse-transition>
                    </div>
                </template>
            </div>

            <div v-if="!hasVisibleEvents" class="empty-list-state">
                当前分类下暂无赛事
            </div>
        </div>

        <div class="sidebar">
            <div class="trade-panel" v-if="selectedEvent && selectedTeam && selectedTeam.marketData">
                <div class="tp-header">
                    <div class="tp-match">
                        <span class="tp-icon">{{ selectedTeam.icon || '🏳️' }}</span>
                        <div class="tp-title-col">
                            <div class="tp-title">{{ selectedEvent.title }}</div>
                            <div class="tp-subtitle">{{ selectedTeam.marketData.marketTitle }}</div>
                        </div>
                    </div>
                </div>

                <div class="tp-market-status">
                    <span :class="['status-pill', statusClass(selectedTeam.marketData.marketStatusText)]">
                        {{ selectedTeam.marketData.marketStatusText }}
                    </span>
                    <span>截止 {{ formatDateTime(selectedTeam.marketData.closeTime) }}</span>
                </div>

                <div class="tp-outcomes">
                    <button
                        v-for="option in selectedTeam.marketData.options"
                        :key="'tp-' + option.id"
                        class="tp-outcome-btn"
                        :class="{
                            active: selectedTeam.id === option.id,
                            disabled: !option.bettable
                        }"
                        :disabled="!option.bettable"
                        @click="openTrade(selectedEvent, option, selectedTeam.marketData)"
                    >
                        <span>{{ option.optionName }}</span>
                        <span>{{ formatOdds(option.currentOdds) }}</span>
                    </button>
                </div>

                <div class="stake-panel">
                    <div class="stake-header">
                        <span>下注金额</span>
                        <span v-if="betPreview.walletBalance !== null">余额 {{ formatAmount(betPreview.walletBalance) }} USDT</span>
                    </div>

                    <div class="stake-input-wrap">
                        <input
                            type="number"
                            v-model.number="tradeAmount"
                            min="0"
                            step="1"
                            placeholder="输入下注金额"
                        />
                        <span class="stake-unit">USDT</span>
                    </div>

                    <div class="stake-range" v-if="betPreview.minBetAmount || betPreview.maxBetAmount">
                        <span>最小 {{ formatAmount(betPreview.minBetAmount) }}</span>
                        <span v-if="betPreview.maxBetAmount">最大 {{ formatAmount(betPreview.maxBetAmount) }}</span>
                    </div>

                    <div class="tp-quick-amounts">
                        <button v-for="amount in quickAmounts" :key="amount" @click="setTradeAmount(amount)">
                            {{ amount }}
                        </button>
                    </div>
                </div>

                <div class="tp-summary">
                    <div class="summary-card">
                        <span class="summary-label">当前赔率</span>
                        <span class="summary-value">{{ formatOdds(betPreview.odds || selectedTeam.optionData.currentOdds) }}</span>
                    </div>
                    <div class="summary-card">
                        <span class="summary-label">预计可得</span>
                        <span class="summary-value emphasis">{{ formatAmount(betPreview.expectReturnAmount) }} USDT</span>
                    </div>
                    <div class="summary-card">
                        <span class="summary-label">预计盈利</span>
                        <span class="summary-value profit">{{ formatAmount(betPreview.expectProfit) }} USDT</span>
                    </div>
                </div>

                <div class="tp-notice" v-if="previewError">
                    {{ previewError }}
                </div>

                <button
                    class="tp-submit-btn"
                    :class="selectedTeam.color"
                    @click="submitBet"
                    :disabled="isSubmitting || isPreviewLoading || !canSubmit"
                >
                    {{ isSubmitting ? '下注中...' : '确认下注' }}
                </button>
            </div>

            <div v-else class="empty-trade-panel">
                请选择左侧比赛结果开始下注
            </div>

            <div class="orders-panel">
                <div class="orders-header">
                    <h3>我的订单</h3>
                    <button class="refresh-orders-btn" @click="getMyOrders">刷新</button>
                </div>

                <div class="order-tabs">
                    <button
                        v-for="tab in orderTabs"
                        :key="tab.key"
                        class="order-tab"
                        :class="{ active: activeOrderTab === tab.key }"
                        @click="activeOrderTab = tab.key"
                    >
                        {{ tab.label }}
                        <span class="tab-count">{{ getOrderTabCount(tab.key) }}</span>
                    </button>
                </div>

                <div v-if="visibleOrders.length" class="orders-list">
                    <div v-for="order in visibleOrders" :key="order.id" class="order-card">
                        <div class="order-top">
                            <div class="order-title">{{ order.marketTitle }}</div>
                            <div class="order-status" :class="getOrderStatusClass(order)">
                                {{ getOrderStatusText(order) }}
                            </div>
                        </div>
                        <div class="order-option">{{ order.optionName }}</div>
                        <div class="order-metrics">
                            <div class="metric-item">
                                <span>下注</span>
                                <strong>{{ formatAmount(order.betAmount) }} USDT</strong>
                            </div>
                            <div class="metric-item">
                                <span>赔率</span>
                                <strong>{{ formatOdds(order.odds) }}</strong>
                            </div>
                            <div class="metric-item">
                                <span>预计可得</span>
                                <strong>{{ formatAmount(order.expectReturnAmount) }} USDT</strong>
                            </div>
                            <div class="metric-item" v-if="order.settleStatus === 1">
                                <span>实际返还</span>
                                <strong>{{ formatAmount(order.actualReturnAmount) }} USDT</strong>
                            </div>
                        </div>
                        <div class="order-time">{{ formatDateTime(order.betTime) }}</div>
                    </div>
                </div>

                <div v-else class="empty-orders-state">
                    当前暂无订单
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'SportsPage',
    data() {
        return {
            categories: [],
            selectedEvent: null,
            selectedTeam: null,
            tradeAmount: null,
            isSubmitting: false,
            isPreviewLoading: false,
            previewError: '',
            previewTimer: null,
            quickAmounts: [10, 20, 50, 100, 500],
            tabs: [
                { key: 'live', label: '进行中' },
                { key: 'upcoming', label: '未开始' },
                { key: 'ended', label: '已结束' }
            ],
            activeTab: 'live',
            orderTabs: [
                { key: 'active', label: '当前记录' },
                { key: 'history', label: '历史订单' }
            ],
            activeOrderTab: 'active',
            orders: [],
            betPreview: this.createEmptyPreview()
        }
    },
    computed: {
        canSubmit() {
            return Boolean(
                this.selectedTeam &&
                this.selectedTeam.optionData &&
                this.selectedTeam.marketData &&
                this.selectedTeam.optionData.bettable &&
                this.tradeAmount > 0 &&
                !this.previewError &&
                this.betPreview.bettable !== false
            );
        },
        hasVisibleEvents() {
            return this.categories.some(category => this.filteredEvents(category).length > 0);
        },
        visibleOrders() {
            if (this.activeOrderTab === 'active') {
                return this.orders.filter(order => !this.isHistoryOrder(order));
            }
            return this.orders.filter(order => this.isHistoryOrder(order));
        }
    },
    watch: {
        tradeAmount() {
            this.schedulePreview();
        },
        selectedTeam: {
            deep: true,
            handler() {
                this.schedulePreview();
            }
        }
    },
    methods: {
        createEmptyPreview() {
            return {
                odds: null,
                expectProfit: 0,
                expectReturnAmount: 0,
                walletBalance: null,
                minBetAmount: null,
                maxBetAmount: null,
                bettable: false
            };
        },
        statusClass(statusText) {
            if (statusText === '可下注') return 'is-open';
            if (statusText === '进行中') return 'is-live';
            if (statusText === '未开始') return 'is-pending';
            return 'is-closed';
        },
        formatAmount(value) {
            const number = Number(value || 0);
            return number.toFixed(2);
        },
        formatPrice(value) {
            const number = Number(value || 0);
            return number ? number.toFixed(4) + ' $' : '--';
        },
        formatOdds(value) {
            const number = Number(value || 0);
            return number ? number.toFixed(2) + 'x' : '--';
        },
        formatOddsLabel(option) {
            if (!option) {
                return '--';
            }
            return this.formatOdds(option.currentOdds);
        },
        formatDateTime(value) {
            if (!value) {
                return '--';
            }
            return new Date(value).toLocaleString();
        },
        isSelectedOption(option) {
            return this.selectedTeam && this.selectedTeam.id === option.id;
        },
        setTradeAmount(amount) {
            this.tradeAmount = amount;
        },
        getLeagues() {
            this.$http.get(this.swapHost + '/quiz/leagues').then(response => {
                const resp = response.body;
                if (resp && resp.code === 0 && resp.data) {
                    this.categories = resp.data.map(item => ({
                        id: item.id,
                        name: item.leagueName,
                        leagueCode: item.leagueCode,
                        country: item.country,
                        sportType: item.sportType,
                        matchCount: item.matchCount,
                        events: []
                    }));
                    this.getMatches();
                }
            });
        },
        getMatches() {
            this.categories.forEach(league => {
                this.$http.get(this.swapHost + `/quiz/matches?leagueId=${league.id}`).then(response => {
                    const resp = response.body;
                    if (!(resp && resp.code === 0 && resp.data)) {
                        return;
                    }

                    resp.data.forEach(match => {
                        const event = {
                            id: match.id,
                            title: match.matchName,
                            time: this.formatDateTime(match.startTime),
                            marketCount: match.marketCount || 0,
                            matchStatus: match.matchStatus,
                            statusText: this.getMatchStatusText(match.matchStatus),
                            expanded: false,
                            teams: [
                                {
                                    id: 't1_' + match.id,
                                    name: match.homeTeam || '主队',
                                    shortName: (match.homeTeam || '主队').substring(0, 4).toUpperCase(),
                                    score: match.homeScore == null ? '-' : match.homeScore,
                                    color: 'light-blue',
                                    icon: match.homeLogo || '🏳️',
                                    optionData: null,
                                    marketData: null,
                                    bettable: false
                                },
                                {
                                    id: 't2_' + match.id,
                                    name: match.awayTeam || '客队',
                                    shortName: (match.awayTeam || '客队').substring(0, 4).toUpperCase(),
                                    score: match.awayScore == null ? '-' : match.awayScore,
                                    color: 'dark-red',
                                    icon: match.awayLogo || '🏳️',
                                    optionData: null,
                                    marketData: null,
                                    bettable: false
                                }
                            ],
                            markets: []
                        };
                        league.events.push(event);
                    });

                    if (!this.selectedEvent && league.events.length > 0) {
                        this.selectEvent(league.events[0]);
                    }
                });
            });
        },
        getMatchStatusText(status) {
            if (status === 1) return '未开始';
            if (status === 2) return '进行中';
            if (status === 3) return '已结束';
            if (status === 4) return '已取消';
            return '未知';
        },
        isEndedEvent(event) {
            return event.matchStatus === 3 || event.matchStatus === 4;
        },
        isUpcomingEvent(event) {
            return event.matchStatus === 1;
        },
        filteredEvents(category) {
            const events = category.events || [];
            if (this.activeTab === 'live') {
                return events.filter(event => event.matchStatus === 2);
            }
            if (this.activeTab === 'upcoming') {
                return events.filter(event => this.isUpcomingEvent(event));
            }
            return events.filter(event => this.isEndedEvent(event));
        },
        getTabEventCount(tabKey) {
            let total = 0;
            this.categories.forEach(category => {
                const events = category.events || [];
                if (tabKey === 'live') {
                    total += events.filter(event => event.matchStatus === 2).length;
                    return;
                }
                if (tabKey === 'upcoming') {
                    total += events.filter(event => this.isUpcomingEvent(event)).length;
                    return;
                }
                total += events.filter(event => this.isEndedEvent(event)).length;
            });
            return total;
        },
        getOrderStatusText(order) {
            if (order.settleStatus === 1) {
                return '已结算';
            }
            if (order.orderStatus === 2) {
                return '已取消';
            }
            return '进行中';
        },
        getOrderStatusClass(order) {
            if (order.settleStatus === 1) {
                return 'is-settled';
            }
            if (order.orderStatus === 2) {
                return 'is-cancelled';
            }
            return 'is-active';
        },
        isHistoryOrder(order) {
            return order.settleStatus === 1 || order.orderStatus === 2;
        },
        getOrderTabCount(tabKey) {
            if (tabKey === 'active') {
                return this.orders.filter(order => !this.isHistoryOrder(order)).length;
            }
            return this.orders.filter(order => this.isHistoryOrder(order)).length;
        },
        getMyOrders() {
            this.$http.get(this.swapHost + '/quiz/orders').then(response => {
                const resp = response.body;
                if (resp && resp.code === 0 && resp.data) {
                    this.orders = resp.data || [];
                }
            });
        },
        handleCardClick(event) {
            this.selectEvent(event);
            this.toggleExpand(event);
        },
        selectEvent(event) {
            this.selectedEvent = event;
            this.getMatchDetails(event.id);
        },
        getMatchDetails(matchId) {
            this.$http.get(this.swapHost + `/quiz/matches/${matchId}`).then(response => {
                const resp = response.body;
                if (!(resp && resp.code === 0 && resp.data)) {
                    return;
                }

                const matchData = resp.data;
                for (const league of this.categories) {
                    const event = league.events.find(item => item.id === matchId);
                    if (!event) {
                        continue;
                    }

                    event.markets = (matchData.markets || []).map(market => ({
                        ...market,
                        options: (market.options || []).map(option => ({
                            ...option,
                            currentOdds: option.currentOdds || 0,
                            currentPrice: option.currentPrice || 0
                        }))
                    }));
                    event.matchStatus = matchData.match ? matchData.match.matchStatus : event.matchStatus;
                    event.statusText = this.getMatchStatusText(event.matchStatus);
                    this.bindPrimaryTeams(event);

                    if (this.selectedEvent && this.selectedEvent.id === matchId) {
                        const defaultOption = this.findFirstBettableOption(event);
                        if (defaultOption) {
                            this.openTrade(event, defaultOption.option, defaultOption.market);
                        } else {
                            this.selectedTeam = null;
                            this.betPreview = this.createEmptyPreview();
                        }
                    }

                    this.$forceUpdate();
                    break;
                }
            });
        },
        bindPrimaryTeams(event) {
            const mainMarket = event.markets && event.markets.length ? event.markets[0] : null;
            if (!mainMarket || !mainMarket.options || mainMarket.options.length < 2) {
                return;
            }

            event.teams[0].optionData = mainMarket.options[0];
            event.teams[0].marketData = mainMarket;
            event.teams[0].bettable = Boolean(mainMarket.options[0].bettable);

            event.teams[1].optionData = mainMarket.options[1];
            event.teams[1].marketData = mainMarket;
            event.teams[1].bettable = Boolean(mainMarket.options[1].bettable);
        },
        findFirstBettableOption(event) {
            const markets = event.markets || [];
            for (const market of markets) {
                const option = (market.options || []).find(item => item.bettable);
                if (option) {
                    return { market, option };
                }
            }
            return null;
        },
        openTrade(event, option, market) {
            if (!option || !market || !option.bettable) {
                return;
            }

            this.selectedEvent = event;
            const matchingTeam = event.teams.find(team => team.optionData && team.optionData.id === option.id);
            this.selectedTeam = {
                id: option.id,
                name: option.optionName,
                shortName: option.optionName.substring(0, 4).toUpperCase(),
                color: matchingTeam ? matchingTeam.color : 'blue',
                icon: matchingTeam ? matchingTeam.icon : '🎯',
                optionData: option,
                marketData: market
            };
            this.previewError = '';
        },
        toggleExpand(targetEvent) {
            const isExpanding = !targetEvent.expanded;
            this.categories.forEach(category => {
                category.events.forEach(event => {
                    event.expanded = false;
                });
            });
            if (isExpanding) {
                targetEvent.expanded = true;
            }
        },
        schedulePreview() {
            if (this.previewTimer) {
                clearTimeout(this.previewTimer);
            }

            if (!this.selectedTeam || !this.selectedTeam.optionData || !this.selectedTeam.marketData || !(this.tradeAmount > 0)) {
                this.previewError = '';
                this.betPreview = this.createEmptyPreview();
                return;
            }

            this.previewTimer = setTimeout(() => {
                this.fetchBetPreview();
            }, 250);
        },
        fetchBetPreview() {
            if (!this.selectedTeam || !this.selectedTeam.optionData || !this.selectedTeam.marketData || !(this.tradeAmount > 0)) {
                return;
            }

            this.isPreviewLoading = true;
            this.previewError = '';
            const url = `${this.swapHost}/quiz/bet/preview?marketId=${this.selectedTeam.marketData.id}&optionId=${this.selectedTeam.optionData.id}&betAmount=${this.tradeAmount}`;
            this.$http.get(url).then(response => {
                this.isPreviewLoading = false;
                const resp = response.body;
                if (resp && resp.code === 0 && resp.data) {
                    this.betPreview = Object.assign(this.createEmptyPreview(), resp.data);
                    return;
                }
                this.betPreview = this.createEmptyPreview();
                this.previewError = resp && resp.msg ? resp.msg : '当前无法下注';
            }).catch(() => {
                this.isPreviewLoading = false;
                this.betPreview = this.createEmptyPreview();
                this.previewError = '预览失败，请稍后重试';
            });
        },
        submitBet() {
            if (!this.selectedTeam || !this.selectedTeam.marketData || !this.selectedTeam.optionData) {
                this.$message.warning('请选择有效的下注选项');
                return;
            }
            if (!(this.tradeAmount > 0)) {
                this.$message.warning('请输入有效的下注金额');
                return;
            }
            if (!this.canSubmit) {
                this.$message.warning(this.previewError || '当前选项不可下注');
                return;
            }

            this.isSubmitting = true;
            const payload = {
                marketId: this.selectedTeam.marketData.id,
                optionId: this.selectedTeam.optionData.id,
                betAmount: this.tradeAmount,
                deviceId: 'pc'
            };

            this.$http.post(this.swapHost + '/quiz/bet', payload).then(response => {
                this.isSubmitting = false;
                const resp = response.body;
                if (resp && resp.code === 0) {
                    this.$message.success('下注成功');
                    this.tradeAmount = null;
                    this.getMatchDetails(this.selectedEvent.id);
                    this.getMyOrders();
                    return;
                }
                this.$message.error(resp && resp.msg ? resp.msg : '下注失败');
            }).catch(() => {
                this.isSubmitting = false;
                this.$message.error('网络请求失败，请稍后重试');
            });
        }
    },
    mounted() {
        this.getLeagues();
        this.getMyOrders();
    },
    beforeDestroy() {
        if (this.previewTimer) {
            clearTimeout(this.previewTimer);
        }
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
    min-height: 100vh;
    color: #1f2937;
    background: #f5f7fb;
}

.main-content {
    flex: 1;
    min-width: 0;
}

.header {
    margin-bottom: 20px;

    h1 {
        margin: 0;
        font-size: 30px;
        font-weight: 800;
    }

    .header-subtitle {
        margin: 8px 0 0;
        color: #6b7280;
        font-size: 14px;
    }
}

.match-tabs {
    display: flex;
    gap: 10px;
    margin-bottom: 20px;
}

.match-tab {
    height: 40px;
    padding: 0 16px;
    border: 1px solid #dbe3f0;
    border-radius: 999px;
    background: #fff;
    color: #4b5563;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;

    &.active {
        border-color: #2563eb;
        color: #2563eb;
        background: #eff6ff;
    }
}

.tab-count {
    margin-left: 6px;
    font-size: 12px;
}

.category-section {
    margin-bottom: 28px;
}

.category-title {
    margin: 0 0 14px;
    font-size: 16px;
    font-weight: 700;
}

.event-card {
    background: #fff;
    border: 1px solid #e5e7eb;
    border-radius: 8px;
    padding: 16px;
    margin-bottom: 14px;
    cursor: pointer;
    transition: box-shadow 0.2s ease;

    &:hover {
        box-shadow: 0 6px 18px rgba(15, 23, 42, 0.08);
    }
}

.event-header,
.market-header,
.summary-row,
.stake-header,
.tp-market-status,
.event-body,
.team-row,
.option-row-btn,
.tp-outcome-btn {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.event-header {
    margin-bottom: 14px;
    gap: 12px;
}

.event-info {
    display: flex;
    align-items: center;
    gap: 8px;
    flex-wrap: wrap;
}

.event-actions {
    display: flex;
    align-items: center;
    gap: 10px;
    flex-wrap: wrap;
}

.market-count,
.time-info,
.title-info {
    font-size: 13px;
    color: #6b7280;
}

.title-info {
    color: #111827;
    font-weight: 600;
}

.live-badge,
.status-pill,
.match-status {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    padding: 3px 8px;
    border-radius: 999px;
    font-size: 12px;
    font-weight: 600;
}

.live-badge,
.is-live {
    background: #fee2e2;
    color: #dc2626;
}

.is-open {
    background: #dcfce7;
    color: #15803d;
}

.is-pending {
    background: #dbeafe;
    color: #1d4ed8;
}

.is-closed {
    background: #f3f4f6;
    color: #6b7280;
}

.dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: currentColor;
}

.event-body {
    gap: 16px;
}

.teams-list {
    flex: 1;
}

.team-row + .team-row {
    margin-top: 12px;
}

.team-info {
    display: flex;
    align-items: center;
    gap: 10px;
    min-width: 0;
}

.team-name {
    font-size: 15px;
    font-weight: 600;
}

.team-score {
    color: #6b7280;
    font-size: 14px;
    margin-left: 8px;
}

.odds-list {
    display: flex;
    flex-direction: column;
    gap: 10px;
    min-width: 220px;
}

.odd-btn,
.tp-submit-btn,
.tp-quick-amounts button,
.option-row-btn,
.tp-outcome-btn {
    transition: all 0.2s ease;
}

.odd-btn {
    width: 100%;
    border: none;
    border-radius: 8px;
    padding: 10px 12px;
    color: #fff;
    font-weight: 700;
    cursor: pointer;
    display: flex;
    justify-content: space-between;
    align-items: center;

    &.light-blue {
        background: #2563eb;
    }

    &.dark-red {
        background: #dc2626;
    }

    &.blue {
        background: #2563eb;
    }
}

.odd-btn.disabled,
.option-row-btn.disabled,
.tp-outcome-btn.disabled {
    background: #f3f4f6;
    color: #9ca3af;
    border-color: #e5e7eb;
    cursor: not-allowed;
}

.expanded-section {
    margin-top: 16px;
    padding-top: 16px;
    border-top: 1px solid #e5e7eb;
}

.markets-container {
    display: flex;
    flex-direction: column;
    gap: 14px;
}

.expanded-market-section {
    border: 1px solid #eef2f7;
    border-radius: 8px;
    padding: 14px;
    background: #fbfcfe;
}

.market-title-wrap {
    display: flex;
    align-items: flex-start;
    gap: 10px;
}

.market-blue-bar {
    width: 3px;
    height: 28px;
    background: #2563eb;
    border-radius: 999px;
}

.market-title-text {
    font-size: 15px;
    font-weight: 700;
    color: #111827;
}

.market-meta {
    margin-top: 6px;
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
    font-size: 12px;
    color: #6b7280;
}

.market-stats {
    text-align: right;
    font-size: 12px;
    color: #6b7280;
}

.stat-item + .stat-item {
    margin-top: 4px;
}

.market-options-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 10px;
    margin-top: 14px;
}

.option-row-btn {
    width: 100%;
    border: 1px solid #dbe3f0;
    border-radius: 8px;
    padding: 12px;
    background: #fff;
    cursor: pointer;
    text-align: left;

    &.active {
        border-color: #2563eb;
        box-shadow: inset 0 0 0 1px #2563eb;
    }
}

.opt-name {
    font-size: 14px;
    font-weight: 600;
    color: #111827;
}

.opt-values {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: 2px;
}

.opt-odds {
    font-size: 14px;
    font-weight: 700;
    color: #2563eb;
}

.opt-price {
    font-size: 12px;
    color: #6b7280;
}

.sidebar {
    width: 360px;
    flex-shrink: 0;
}

.trade-panel,
.empty-trade-panel,
.orders-panel {
    background: #fff;
    border: 1px solid #e5e7eb;
    border-radius: 8px;
    padding: 20px;
}

.trade-panel,
.empty-trade-panel {
    position: sticky;
    top: 80px;
}

.tp-header {
    margin-bottom: 16px;
}

.tp-match {
    display: flex;
    align-items: center;
    gap: 12px;
}

.tp-icon {
    width: 44px;
    height: 44px;
    border-radius: 50%;
    background: #eff6ff;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 20px;
}

.tp-title {
    font-size: 17px;
    font-weight: 700;
    color: #111827;
}

.tp-subtitle {
    margin-top: 4px;
    font-size: 13px;
    color: #6b7280;
}

.tp-market-status {
    margin-bottom: 16px;
    font-size: 12px;
    color: #6b7280;
}

.tp-outcomes {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 10px;
    margin-bottom: 18px;
}

.tp-outcome-btn {
    border: 1px solid #dbe3f0;
    background: #fff;
    border-radius: 8px;
    padding: 12px;
    cursor: pointer;
    color: #111827;
    font-weight: 600;

    &.active {
        border-color: #2563eb;
        color: #2563eb;
        box-shadow: inset 0 0 0 1px #2563eb;
    }
}

.stake-panel {
    border: 1px solid #e5e7eb;
    border-radius: 8px;
    padding: 14px;
    background: #f9fafb;
    margin-bottom: 16px;
}

.stake-header,
.stake-range {
    font-size: 12px;
    color: #6b7280;
}

.stake-input-wrap {
    margin-top: 10px;
    position: relative;

    input {
        width: 100%;
        height: 48px;
        border: 1px solid #d1d5db;
        border-radius: 8px;
        padding: 0 72px 0 14px;
        font-size: 20px;
        font-weight: 700;
        color: #111827;
        outline: none;
        background: #fff;
    }
}

.stake-unit {
    position: absolute;
    right: 14px;
    top: 50%;
    transform: translateY(-50%);
    font-size: 13px;
    color: #6b7280;
}

.stake-range {
    display: flex;
    justify-content: space-between;
    margin-top: 10px;
    gap: 10px;
}

.tp-quick-amounts {
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    gap: 8px;
    margin-top: 12px;

    button {
        height: 34px;
        border: 1px solid #dbe3f0;
        border-radius: 8px;
        background: #fff;
        cursor: pointer;
        font-size: 13px;
        color: #374151;
    }
}

.tp-summary {
    display: grid;
    grid-template-columns: 1fr;
    gap: 10px;
    margin-bottom: 16px;
}

.summary-card {
    border: 1px solid #e5e7eb;
    border-radius: 8px;
    padding: 12px 14px;
    background: #fff;
}

.summary-label {
    display: block;
    font-size: 12px;
    color: #6b7280;
    margin-bottom: 6px;
}

.summary-value {
    font-size: 20px;
    font-weight: 700;
    color: #111827;
}

.summary-value.emphasis {
    color: #2563eb;
}

.summary-value.profit {
    color: #15803d;
}

.tp-notice {
    margin-bottom: 12px;
    padding: 10px 12px;
    border-radius: 8px;
    background: #fef2f2;
    color: #b91c1c;
    font-size: 13px;
}

.tp-submit-btn {
    width: 100%;
    height: 46px;
    border: none;
    border-radius: 8px;
    color: #fff;
    font-size: 16px;
    font-weight: 700;
    cursor: pointer;

    &.light-blue,
    &.blue {
        background: #2563eb;
    }

    &.dark-red {
        background: #dc2626;
    }

    &:disabled {
        background: #cbd5e1;
        cursor: not-allowed;
    }
}

.empty-trade-panel {
    text-align: center;
    color: #6b7280;
}

.orders-panel {
    margin-top: 16px;
}

.orders-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 14px;

    h3 {
        margin: 0;
        font-size: 16px;
        font-weight: 700;
        color: #111827;
    }
}

.refresh-orders-btn {
    height: 32px;
    padding: 0 12px;
    border: 1px solid #dbe3f0;
    border-radius: 8px;
    background: #fff;
    color: #4b5563;
    font-size: 12px;
    cursor: pointer;
}

.order-tabs {
    display: flex;
    gap: 8px;
    margin-bottom: 14px;
}

.order-tab {
    flex: 1;
    height: 36px;
    border: 1px solid #dbe3f0;
    border-radius: 8px;
    background: #fff;
    color: #4b5563;
    font-size: 13px;
    font-weight: 600;
    cursor: pointer;

    &.active {
        border-color: #2563eb;
        color: #2563eb;
        background: #eff6ff;
    }
}

.orders-list {
    display: flex;
    flex-direction: column;
    gap: 12px;
}

.order-card {
    border: 1px solid #e5e7eb;
    border-radius: 8px;
    padding: 14px;
    background: #fbfcfe;
}

.order-top {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 10px;
}

.order-title {
    font-size: 14px;
    font-weight: 700;
    color: #111827;
}

.order-option {
    margin-top: 6px;
    font-size: 13px;
    color: #2563eb;
    font-weight: 600;
}

.order-status {
    flex-shrink: 0;
    padding: 3px 8px;
    border-radius: 999px;
    font-size: 12px;
    font-weight: 600;

    &.is-active {
        background: #dcfce7;
        color: #15803d;
    }

    &.is-settled {
        background: #dbeafe;
        color: #1d4ed8;
    }

    &.is-cancelled {
        background: #f3f4f6;
        color: #6b7280;
    }
}

.order-metrics {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 10px;
    margin-top: 12px;
}

.metric-item {
    display: flex;
    flex-direction: column;
    gap: 4px;

    span {
        font-size: 12px;
        color: #6b7280;
    }

    strong {
        font-size: 13px;
        color: #111827;
    }
}

.order-time {
    margin-top: 12px;
    font-size: 12px;
    color: #9ca3af;
}

.empty-orders-state {
    padding: 32px 0;
    text-align: center;
    color: #9ca3af;
    font-size: 13px;
}

.no-data {
    text-align: center;
    color: #9ca3af;
    padding: 24px 0;
    font-size: 13px;
}

.empty-list-state {
    padding: 48px 0;
    text-align: center;
    color: #9ca3af;
    font-size: 14px;
}

@media (max-width: 1100px) {
    .sports-page {
        flex-direction: column;
    }

    .sidebar {
        width: 100%;
    }

    .trade-panel,
    .empty-trade-panel {
        position: static;
    }
}
</style>
