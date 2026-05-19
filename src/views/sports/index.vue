<template>
    <div class="sports-page">
        <!-- Left Sidebar: Sports Categories & Promotion -->
        <div class="left-sidebar">
            <div class="ls-header">
                <i class="el-icon-trophy"></i>
                <h2>体育竞猜</h2>
            </div>
            <div class="ls-menu">
                <div v-for="(leagues, country) in groupedLeagues" :key="country">
                    <div class="menu-country-header">{{ country }}</div>
                    <div class="menu-item" v-for="league in leagues" :key="league.id"
                        :class="{ active: activeLeagueId === league.id }" @click="activeLeagueId = league.id">
                        <img v-if="leagues.imgurl" style="width: 20px; height: 20px;" :src="leagues.imgurl" alt="">
                        <span class="menu-text">{{ league.name }}</span>
                        <span class="menu-count">{{ league.matchCount }}</span>
                    </div>
                </div>
            </div>
        </div>

        <div class="main-column">
            <div class="match-section">
                <div class="match-filters-top">
                    <div class="match-tabs">
                        <button v-for="tab in tabs" :key="tab.key" class="match-tab"
                            :class="{ active: activeTab === tab.key }" @click="activeTab = tab.key">
                            {{ tab.label }}
                            <span class="tab-badge" v-if="getTabEventCount(tab.key) > 0">{{
                                getTabEventCount(tab.key) }}</span>
                        </button>
                    </div>
                    <div class="filters-right">
                        <el-input v-model="searchKeyword" placeholder="搜索赛事/球队" prefix-icon="el-icon-search"
                            size="small" class="filter-search"></el-input>
                    </div>
                </div>

                <!-- Match List Table Layout -->
                <div class="match-table-container">
                    <!-- Empty State -->
                    <div v-if="!activeCategory || !filteredEvents(activeCategory).length" class="empty-match-state">
                        <div class="empty-text">暂无赛事</div>
                    </div>
                    <!-- Match List -->
                    <table v-else class="match-table">
                        <tbody>
                            <template v-for="(event, index) in filteredEvents(activeCategory)">
                                <tr class="sport-group-header" :key="'header-' + index" @click="handleCardClick(event)">
                                    <td colspan="7">
                                        <div class="group-header-content">
                                            <div class="group-header-left">
                                                <div class="match-time-display header-time">
                                                    <span class="time-date">{{ (event.markets && event.markets[0] &&
                                                        event.markets[0].matchTime) ?
                                                        event.markets[0].matchTime.substring(5, 10).replace('-', '/') :
                                                        '--' }}</span>
                                                    <span class="time-hour">{{ (event.markets && event.markets[0] &&
                                                        event.markets[0].matchTime) ?
                                                        event.markets[0].matchTime.substring(11, 16) : '--' }}</span>
                                                </div>
                                                <div class="league-title-display">
                                                    <span class="market-title">{{ event.markets && event.markets[0]
                                                        ? event.markets[0].marketTitle : event.title }}</span>
                                                </div>
                                            </div>
                                            <template
                                                v-if="event.markets && event.markets[0] && event.markets[0].options && event.markets[0].options.length > 2">
                                                <div class="group-header-options-full">
                                                    <div class="header-odd-item"
                                                        v-for="option in event.markets[0].options.slice(0, 6)"
                                                        :key="option.id">
                                                        <button class="table-odd-btn mini-btn"
                                                            :class="{ 'disabled': !option.bettable, 'active': isSelectedOption(option) }"
                                                            :disabled="!option.bettable"
                                                            @click.stop="openTrade(event, option, event.markets[0])">
                                                            <span class="header-odd-label">{{ option.optionName
                                                                }}</span>
                                                            <span class="header-odd-value">{{ formatOddsLabel(option)
                                                                }}</span>
                                                        </button>
                                                    </div>
                                                    <div class="header-odd-item"
                                                        v-if="event.markets[0].options.length > 6">
                                                        <button style="border: none; background-color: transparent;"
                                                            class="table-odd-btn mini-btn more-btn"
                                                            @click.stop="openMoreOptionsDialog(event)">
                                                            <span class="header-odd-label">更多选项</span>
                                                            <i class="el-icon-arrow-right more-icon"></i>
                                                        </button>
                                                    </div>
                                                </div>
                                            </template>
                                            <template v-else>
                                                <div class="group-header-center">
                                                    <div class="team home-team">
                                                        <img v-if="event.homeLogo" class="team-logo"
                                                            :src="event.homeLogo" alt="" />
                                                        <span class="team-name" :title="event.teams[0].name">{{
                                                            event.teams[0].name }}</span>
                                                    </div>
                                                    <div class="score-display">
                                                        VS
                                                    </div>
                                                    <div class="team away-team">
                                                        <span class="team-name" :title="event.teams[1].name">{{
                                                            event.teams[1].name }}</span>
                                                        <img v-if="event.awayLogo" class="team-logo"
                                                            :src="event.awayLogo" alt="" />
                                                    </div>
                                                </div>
                                                <div class="group-header-right">
                                                    <div class="header-odds"
                                                        v-if="event.teams[0].optionData || event.teams[1].optionData">
                                                        <div class="header-odd-item" v-if="event.teams[0].optionData">
                                                            <button class="table-odd-btn mini-btn"
                                                                :class="{ 'disabled': !event.teams[0].optionData.bettable, 'active': isSelectedOption(event.teams[0].optionData) }"
                                                                :disabled="!event.teams[0].optionData.bettable"
                                                                @click.stop="openTrade(event, event.teams[0].optionData, event.teams[0].marketData)">
                                                                <span class="header-odd-label">{{ event.teams[0].name
                                                                    }}</span>
                                                                <span class="header-odd-value">{{
                                                                    formatOddsLabel(event.teams[0].optionData) }}</span>
                                                            </button>
                                                        </div>
                                                        <div class="header-odd-item" v-if="event.teams[1].optionData">
                                                            <button class="table-odd-btn mini-btn"
                                                                :class="{ 'disabled': !event.teams[1].optionData.bettable, 'active': isSelectedOption(event.teams[1].optionData) }"
                                                                :disabled="!event.teams[1].optionData.bettable"
                                                                @click.stop="openTrade(event, event.teams[1].optionData, event.teams[1].marketData)">
                                                                <span class="header-odd-label">{{ event.teams[1].name
                                                                    }}</span>
                                                                <span class="header-odd-value">{{
                                                                    formatOddsLabel(event.teams[1].optionData) }}</span>
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </template>
                                        </div>
                                    </td>
                                </tr>
                            </template>
                        </tbody>
                    </table>
                </div>
            </div>
            <div class="orders-panel">
                <div class="orders-panel-top">
                    <div class="orders-header">
                        <div class="order-tabs">
                            <button v-for="tab in orderTabs" :key="tab.key" class="order-tab"
                                :class="{ active: activeOrderTab === tab.key }" @click="activeOrderTab = tab.key">
                                {{ tab.label }}
                                <span class="tab-count">({{ tab.count }})</span>
                            </button>
                        </div>
                    </div>
                </div>

                <div v-if="filteredOrders.length" class="orders-table-container" @scroll="handleOrderScroll">
                    <table class="orders-table">
                        <thead>
                            <tr>
                                <th>赛事</th>
                                <th>选项</th>
                                <th>下单时间</th>
                                <th>下注金额</th>
                                <th>赔率</th>
                                <th>预计可得</th>
                                <th v-if="activeOrderTab === 'history'">实际回报</th>
                                <th>状态</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="order in visibleOrders" :key="order.id">
                                <td>
                                    <div class="order-title">{{ order.marketTitle }}</div>
                                </td>
                                <td>
                                    <span class="order-option">{{ order.optionName }}</span>
                                </td>
                                <td class="time-col">{{ formatDateTime(order.betTime) }}</td>
                                <td><strong>{{ formatAmount(order.betAmount) }} USDT</strong></td>
                                <td><strong>{{ formatOdds(order.odds) }}</strong></td>
                                <td><strong>{{ formatAmount(order.expectReturnAmount) }} USDT</strong></td>
                                <td v-if="activeOrderTab === 'history'">
                                    <strong v-if="order.orderStatus !== 1">{{ formatAmount(order.actualReturnAmount) }}
                                        USDT</strong>
                                    <span v-else>--</span>
                                </td>
                                <td>
                                    <span class="order-status" :class="getOrderStatusClass(order)">
                                        {{ getOrderStatusText(order) }}
                                    </span>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                    <div v-if="isLoadingOrders" class="loading-more">
                        加载中...
                    </div>
                    <div v-if="!hasMoreOrders && orders.length > 0" class="no-more-data">
                        没有更多数据了
                    </div>
                </div>

                <div v-if="!isLogin" class="empty-orders-state">
                    <span @click="$router.push('/login')"
                        style="cursor: pointer; color: #0066ff; text-decoration: underline;">登录</span>后查看订单
                </div>
                <div v-else-if="!filteredOrders.length && !isLoadingOrders" class="empty-orders-state">
                    当前暂无订单
                </div>
            </div>
        </div>

        <div class="right-sidebar">
            <div class="betting-slip-panel">
                <div class="panel-header">
                    <h3>下单</h3>
                </div>
                <template v-if="selectedEvent">
                    <div class="slip-content">
                        <div class="selected-bet-card">
                            <div class="bet-match-header">
                                <div class="match-info">
                                    <div class="match-title">{{ selectedEvent.title }}</div>
                                    <div class="bet-status-row">
                                        <span
                                            :class="selectedEvent.matchStatus === 3 || selectedEvent.matchStatus === 4 ? 'status-badge-gray' : 'status-badge-green'">
                                            {{ selectedEvent.matchStatus === 3 || selectedEvent.matchStatus === 4 ?
                                                selectedEvent.statusText : '可下注' }}
                                        </span>
                                        <span class="deadline-text">截止 {{ selectedEvent.closeTime ?
                                            selectedEvent.closeTime.substring(0, 16).replace('T', ' ') : '--' }}</span>
                                    </div>
                                </div>
                            </div>

                            <div class="slip-options-group" v-if="selectedEvent.teams">
                                <button v-for="(team, index) in selectedEvent.teams" :key="index" v-if="team.optionData"
                                    class="slip-opt-btn"
                                    :class="{ 'active': selectedTeam && selectedTeam.id === team.optionData.id, 'disabled': !team.optionData.bettable || selectedEvent.matchStatus === 3 || selectedEvent.matchStatus === 4 }"
                                    :disabled="!team.optionData.bettable || selectedEvent.matchStatus === 3 || selectedEvent.matchStatus === 4"
                                    @click="openTrade(selectedEvent, team.optionData, team.marketData)">
                                    <img v-if="(index === 0 && selectedEvent.homeLogo) || (index === 1 && selectedEvent.awayLogo)"
                                        class="slip-team-logo"
                                        :src="index === 0 ? selectedEvent.homeLogo : selectedEvent.awayLogo" alt="" />
                                    <span class="opt-name">{{ team.name }}</span>
                                    <span class="opt-odds">{{ formatOddsLabel(team.optionData) }}</span>
                                </button>
                            </div>
                        </div>

                        <template
                            v-if="selectedTeam && selectedTeam.marketData && selectedEvent.matchStatus !== 3 && selectedEvent.matchStatus !== 4 && isAnyOptionBettable(selectedEvent)">
                            <div class="stake-section">
                                <div class="stake-input-label">下注金额</div>
                                <div class="stake-input-wrap">
                                    <input type="number" v-model.number="tradeAmount" min="0" step="1"
                                        placeholder="输入下注金额"
                                        :disabled="selectedEvent.matchStatus === 3 || selectedEvent.matchStatus === 4" />
                                    <span class="stake-unit">USDT</span>
                                </div>
                                <div class="stake-balance-row">
                                    <span class="balance-text">可用余额: {{ walletBalance !== null ?
                                        formatAmount(walletBalance) : '--' }} USDT</span>
                                    <a v-if="selectedEvent.matchStatus !== 3 && selectedEvent.matchStatus !== 4"
                                        href="javascript:void(0)" class="recharge-link"
                                        @click="$router.push('/recharge')">充值</a>
                                </div>
                            </div>

                            <div v-if="selectedEvent.matchStatus !== 3 && selectedEvent.matchStatus !== 4"
                                class="tp-quick-amounts">
                                <button v-for="amount in quickAmounts" :key="amount" @click="setTradeAmount(amount)">
                                    {{ amount }}
                                </button>
                            </div>

                            <div class="odds-info-card">
                                <div class="odds-info-row">
                                    <span class="info-label">当前赔率</span>
                                    <span class="info-value odds-value">{{ formatOddsLabel(selectedTeam.optionData)
                                    }}</span>
                                </div>
                            </div>

                            <div v-if="selectedEvent.matchStatus !== 3 && selectedEvent.matchStatus !== 4"
                                class="odds-info-card">
                                <div class="odds-info-row">
                                    <span class="info-label">预计可得</span>
                                    <span class="info-value return-value">{{ formatAmount(betPreview.expectReturnAmount
                                        || 0) }} USDT</span>
                                </div>
                            </div>

                            <div v-if="selectedEvent.matchStatus !== 3 && selectedEvent.matchStatus !== 4"
                                class="odds-info-card">
                                <div class="odds-info-row">
                                    <span class="info-label">预计盈利</span>
                                    <span v-if="formatAmount(expectedProfit) > 0" class="info-value profit-value">{{
                                        formatAmount(expectedProfit) }} USDT</span>
                                    <span v-else class="info-value profit-value">0.00 USDT</span>
                                </div>
                            </div>

                            <div class="tp-notice" v-if="previewError">
                                {{ previewError }}
                            </div>

                            <button v-if="!isLogin" class="tp-submit-btn blue" @click="$router.push('/login')">
                                请先登录
                            </button>
                            <button v-else class="tp-submit-btn blue" @click="submitBet"
                                :disabled="isSubmitting || isPreviewLoading || !canSubmit">
                                {{ selectedEvent.matchStatus === 3 || selectedEvent.matchStatus === 4 ? '比赛已结束' :
                                    (isSubmitting ? '下注中...' : '确认下注') }}
                            </button>
                        </template>
                        <div v-else class="empty-selection-hint">
                            请在上方选择你要下注的赛果
                        </div>
                    </div>
                </template>

                <div v-else class="empty-slip">
                    请选择比赛或赛果开始下注
                </div>
            </div>
        </div>

        <!-- More Options Dialog -->
        <el-dialog :visible.sync="showMoreOptionsDialog" title="更多选项" width="600px" custom-class="more-options-dialog"
            @close="currentMoreOptionsEvent = null">
            <div v-if="currentMoreOptionsEvent && currentMoreOptionsEvent.markets && currentMoreOptionsEvent.markets[0]"
                class="more-options-grid">
                <div v-for="option in currentMoreOptionsEvent.markets[0].options" :key="option.id"
                    class="more-option-item">
                    <button class="table-odd-btn mini-btn"
                        :class="{ 'disabled': !option.bettable, 'active': isSelectedOption(option) }"
                        :disabled="!option.bettable"
                        @click.stop="openTradeAndCloseDialog(currentMoreOptionsEvent, option, currentMoreOptionsEvent.markets[0])">
                        <span class="header-odd-label">{{ option.optionName }}</span>
                        <span class="header-odd-value">{{ formatOddsLabel(option) }}</span>
                    </button>
                </div>
            </div>
        </el-dialog>
    </div>
</template>

<script>
var SockJS = require("sockjs-client");

export default {
    name: 'SportsPage',
    data() {
        return {
            categories: [],
            activeLeagueId: null,
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
                { key: 'active', label: '当前记录', count: 0 },
                { key: 'history', label: '历史订单', count: 0 }
            ],
            activeOrderTab: 'active',
            orders: [],
            totalOrders: 0,
            orderCurrentPage: 1,
            orderPageSize: 5,
            isLoadingOrders: false,
            betType: 'single', // 'single' 单注, 'multi' 串关
            betPreview: this.createEmptyPreview(),
            walletBalance: null, // Track wallet balance separately
            filterLeague: 'all',
            filterTime: 'all',
            acceptHigherOdds: true,
            oddsChangeOption: 'any',
            searchKeyword: '',
            showMoreOptionsDialog: false,
            currentMoreOptionsEvent: null
        }
    },
    computed: {
        groupedLeagues() {
            const groups = {};
            this.categories.forEach(league => {
                const country = league.country || '其他';
                if (!groups[country]) {
                    groups[country] = [];
                }
                groups[country].push(league);
            });
            return groups;
        },
        activeCategory() {
            return this.categories.find(cat => cat.id === this.activeLeagueId) || null;
        },
        canSubmit() {
            return Boolean(
                this.selectedEvent &&
                this.selectedEvent.matchStatus !== 3 &&
                this.selectedEvent.matchStatus !== 4 &&
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
        expectedReturn() {
            if (!this.betPreview || this.betPreview.expectReturnAmount == null) {
                return 0;
            }
            return this.betPreview.expectReturnAmount;
        },
        expectedProfit() {
            if (!this.betPreview || this.betPreview.expectReturnAmount == null || !this.tradeAmount) {
                return 0;
            }
            return this.betPreview.expectReturnAmount - this.tradeAmount;
        },
        filteredOrders() {
            return this.orders;
        },
        visibleOrders() {
            return this.orders;
        },
        hasMoreOrders() {
            return this.orders.length < this.totalOrders;
        },
        isLogin() {
            return this.$store.getters.isLogin;
        }
    },
    watch: {
        activeOrderTab() {
            this.orderCurrentPage = 1;
            this.orders = [];
            this.totalOrders = 0;
            this.getMyOrders();
        },
        tradeAmount() {
            this.schedulePreview();
        },
        selectedTeam: {
            deep: true,
            handler() {
                this.schedulePreview();
            }
        },
        activeCategory: {
            deep: true,
            handler(newVal) {
                console.log('activeCategory changed:', newVal);
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
        clearSelectedBet() {
            this.selectedEvent = null;
            this.selectedTeam = null;
            this.betPreview = this.createEmptyPreview();
            this.previewError = '';
        },
        getDrawOption(event) {
            if (!event || !event.markets || event.markets.length === 0) return null;
            const mainMarket = event.markets[0];
            if (!mainMarket.options) return null;

            // Usually draw is the middle option or has a specific name/id
            // This is a simple heuristic: find option that is not team 1 or team 2
            const t1Id = event.teams[0].optionData ? event.teams[0].optionData.id : null;
            const t2Id = event.teams[1].optionData ? event.teams[1].optionData.id : null;

            const drawOption = mainMarket.options.find(opt => opt.id !== t1Id && opt.id !== t2Id);

            if (drawOption) {
                return {
                    market: mainMarket,
                    option: drawOption
                };
            }
            return null;
        },
        getSportIcon(sportType) {
            const icons = {
                1: '⚽', // Football
                2: '🏀', // Basketball
                3: '🎾', // Tennis
                4: '🏐', // Volleyball
                5: '🏒', // Ice Hockey
                6: '⚾', // Baseball
            };
            return icons[sportType] || '🏆';
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
                        expanded: true,
                        events: []
                    }));
                    if (this.categories.length > 0) {
                        this.activeLeagueId = this.categories[0].id;
                    }
                    this.getMatches();
                }
            });
        },
        getMatches() {
            this.$http.get(this.swapHost + `/quiz/matches/displayed`).then(response => {
                const resp = response.body;
                this.categories.forEach(league => {
                    league.events = [];
                });

                if (resp && resp.code === 0 && resp.data) {
                    resp.data.forEach(item => {
                        console.log('item', item)
                        const match = item.match;
                        const leagueData = item.league;
                        const markets = item.markets || [];

                        let league = this.categories.find(c => c.id === leagueData.id);
                        if (!league) {
                            league = {
                                id: leagueData.id,
                                name: leagueData.leagueName,
                                leagueCode: leagueData.leagueCode,
                                country: leagueData.country,
                                sportType: leagueData.sportType,
                                matchCount: 0,
                                expanded: true,
                                events: []
                            };
                            this.categories.push(league);
                        }

                        markets.forEach(market => {
                            const event = {
                                id: match.id + '_' + market.id, // Ensure unique ID for each market
                                matchId: match.id,
                                title: match.matchName,
                                time: match.startTime,
                                closeTime: market.closeTime,
                                marketCount: 1,
                                matchStatus: match.matchStatus,
                                statusText: this.getMatchStatusText(match.matchStatus),
                                expanded: false,
                                markets: [market], // Keep single market in array to match existing logic
                                teams: [],
                                homeLogo: match.homeLogo,
                                awayLogo: match.awayLogo
                            };

                            // Map options to teams for UI rendering
                            if (market.options) {
                                const options = market.options;
                                event.teams = options.map((opt, idx) => {
                                    return {
                                        id: 't' + (idx + 1) + '_' + match.id + '_' + market.id,
                                        name: opt.optionName,
                                        shortName: opt.optionName.substring(0, 4).toUpperCase(),
                                        score: idx === 0 ? (match.homeScore == null ? '-' : match.homeScore) : (idx === 1 ? (match.awayScore == null ? '-' : match.awayScore) : '-'),
                                        color: idx === 0 ? 'light-blue' : (idx === 1 ? 'dark-red' : 'blue'),
                                        icon: idx === 0 ? (match.homeLogo || '🏳️') : (idx === 1 ? (match.awayLogo || '🏳️') : '🎯'),
                                        optionData: opt,
                                        marketData: market,
                                        bettable: Boolean(opt.bettable)
                                    };
                                });
                                // fallback if options are less than 2
                                if (options.length === 0) {
                                    event.teams = [
                                        {
                                            id: 't1_' + match.id + '_' + market.id,
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
                                            id: 't2_' + match.id + '_' + market.id,
                                            name: match.awayTeam || '客队',
                                            shortName: (match.awayTeam || '客队').substring(0, 4).toUpperCase(),
                                            score: match.awayScore == null ? '-' : match.awayScore,
                                            color: 'dark-red',
                                            icon: match.awayLogo || '🏳️',
                                            optionData: null,
                                            marketData: null,
                                            bettable: false
                                        }
                                    ];
                                } else if (options.length === 1) {
                                    event.teams.push({
                                        id: 't2_' + match.id + '_' + market.id,
                                        name: match.awayTeam || '客队',
                                        shortName: (match.awayTeam || '客队').substring(0, 4).toUpperCase(),
                                        score: match.awayScore == null ? '-' : match.awayScore,
                                        color: 'dark-red',
                                        icon: match.awayLogo || '🏳️',
                                        optionData: null,
                                        marketData: null,
                                        bettable: false
                                    });
                                }
                            } else {
                                event.teams = [
                                    {
                                        id: 't1_' + match.id + '_' + market.id,
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
                                        id: 't2_' + match.id + '_' + market.id,
                                        name: match.awayTeam || '客队',
                                        shortName: (match.awayTeam || '客队').substring(0, 4).toUpperCase(),
                                        score: match.awayScore == null ? '-' : match.awayScore,
                                        color: 'dark-red',
                                        icon: match.awayLogo || '🏳️',
                                        optionData: null,
                                        marketData: null,
                                        bettable: false
                                    }
                                ];
                            }

                            league.events.push(event);
                        });
                    });
                    
                    // Re-bind selected event and team if they exist
                    if (this.selectedEvent) {
                        let newSelectedEvent = null;
                        this.categories.forEach(cat => {
                            const found = cat.events.find(e => e.id === this.selectedEvent.id);
                            if (found) newSelectedEvent = found;
                        });
                        
                        if (newSelectedEvent) {
                            this.selectedEvent = newSelectedEvent;
                            if (this.selectedTeam && this.selectedTeam.optionData) {
                                const newOptionTeam = newSelectedEvent.teams.find(t => t.optionData && t.optionData.id === this.selectedTeam.optionData.id);
                                if (newOptionTeam) {
                                    this.selectedTeam = {
                                        id: newOptionTeam.optionData.id,
                                        name: newOptionTeam.optionData.optionName,
                                        shortName: newOptionTeam.optionData.optionName.substring(0, 4).toUpperCase(),
                                        color: newOptionTeam.color,
                                        icon: newOptionTeam.icon,
                                        optionData: newOptionTeam.optionData,
                                        marketData: newOptionTeam.marketData
                                    };
                                    this.schedulePreview();
                                }
                            }
                        }
                    }
                } else {
                }
                this.isLoading = false;
            }).catch(err => {
                console.error('加载比赛数据失败:', err);
                this.isLoading = false;
                this.$message.error('加载比赛数据失败');
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
            let events = category.events || [];

            // Apply search filter
            if (this.searchKeyword && this.searchKeyword.trim() !== '') {
                const keyword = this.searchKeyword.trim().toLowerCase();
                events = events.filter(event => {
                    const titleMatch = event.title && event.title.toLowerCase().includes(keyword);
                    const teamMatch = event.teams && event.teams.some(team => team.name && team.name.toLowerCase().includes(keyword));
                    return titleMatch || teamMatch;
                });
            }

            if (this.activeTab === 'live') {
                return events.filter(event => event.matchStatus === 2);
            }
            if (this.activeTab === 'upcoming') {
                return events.filter(event => this.isUpcomingEvent(event));
            }
            return events.filter(event => this.isEndedEvent(event));
        },
        getTabEventCount(tabKey) {
            if (!this.activeCategory) return 0;
            const events = this.activeCategory.events || [];
            if (tabKey === 'live') {
                return events.filter(event => event.matchStatus === 2).length;
            }
            if (tabKey === 'upcoming') {
                return events.filter(event => this.isUpcomingEvent(event)).length;
            }
            return events.filter(event => this.isEndedEvent(event)).length;
        },
        getOrderStatusText(order) {
            if (order.orderStatus === 1) return '待结算';
            if (order.orderStatus === 2) return '赢';
            if (order.orderStatus === 3) return '输';
            if (order.orderStatus === 4) return '退款';
            return '未知';
        },
        getOrderStatusClass(order) {
            if (order.orderStatus === 1) return 'is-pending';
            if (order.orderStatus === 2) return 'is-win';
            if (order.orderStatus === 3) return 'is-lose';
            if (order.orderStatus === 4) return 'is-refund';
            return 'is-unknown';
        },
        isHistoryOrder(order) {
            return order.orderStatus === 2 || order.orderStatus === 3 || order.orderStatus === 4;
        },
        handlePageChange(page) {
            // Keep for backwards compatibility
        },
        handleOrderScroll(e) {
            const container = e.target;
            // 距离底部 20px 时触发加载
            const isAtBottom = container.scrollHeight - container.scrollTop - container.clientHeight < 20;

            if (isAtBottom && !this.isLoadingOrders && this.hasMoreOrders) {
                this.orderCurrentPage++;
                this.getMyOrders(true); // append data
            }
        },
        getMyOrders(isAppend = false) {
            if (!this.isLogin) return;
            if (this.isLoadingOrders) return;

            this.isLoadingOrders = true;
            const status = this.activeOrderTab === 'active' ? 1 : 2;
            const params = {
                pageNo: this.orderCurrentPage,
                pageSize: this.orderPageSize,
                status: status
            };
            this.$http.get(this.swapHost + '/quiz/orders', { params }).then(response => {
                this.isLoadingOrders = false;
                const resp = response.body;
                if (resp.code === 0) {
                    let newOrders = [];
                    let total = 0;
                    newOrders = resp.data || [];
                    total = resp.totalElement || 0;

                    if (isAppend) {
                        this.orders = [...this.orders, ...newOrders];
                    } else {
                        this.orders = newOrders;
                    }
                    this.totalOrders = total;

                    // Update tab count
                    const tab = this.orderTabs.find(t => t.key === this.activeOrderTab);
                    if (tab) {
                        tab.count = total;
                    }
                } else {
                    if (!isAppend) {
                        this.orders = [];
                        this.totalOrders = 0;
                    }
                }
            }).catch(() => {
                this.isLoadingOrders = false;
                if (!isAppend) {
                    this.orders = [];
                    this.totalOrders = 0;
                }
            });
        },
        getOrderCounts() {
            if (!this.isLogin) return;
            // Fetch active orders count
            this.$http.get(this.swapHost + '/quiz/orders', { params: { pageNo: 1, pageSize: 1, status: 1 } }).then(response => {
                const resp = response.body;
                if (resp.code === 0) {
                    const tab = this.orderTabs.find(t => t.key === 'active');
                    if (tab) tab.count = resp.totalElement || 0;
                }
            });
            // Fetch history orders count
            this.$http.get(this.swapHost + '/quiz/orders', { params: { pageNo: 1, pageSize: 1, status: 2 } }).then(response => {
                const resp = response.body;
                if (resp.code === 0) {
                    const tab = this.orderTabs.find(t => t.key === 'history');
                    if (tab) tab.count = resp.totalElement || 0;
                }
            });
        },
        handleCardClick(event) {
            this.selectedEvent = event;
            this.toggleExpand(event);

            if (event.matchStatus !== 3 && event.matchStatus !== 4) {
                const firstBettable = this.findFirstBettableOption(event);
                if (firstBettable) {
                    this.openTrade(event, firstBettable.option, firstBettable.market);
                } else {
                    this.clearSelectedBet();
                    this.selectedEvent = event; // Keep event selected for UI, but clear the bet details
                }
            } else {
                this.clearSelectedBet();
                this.selectedEvent = event; // Keep event selected for UI to show "Ended" status
            }
        },
        selectEvent(event) {
            this.selectedEvent = event;
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
        isAnyOptionBettable(event) {
            if (!event || !event.teams) return false;
            return event.teams.some(team => team.optionData && team.optionData.bettable);
        },
        openTradeAndCloseDialog(event, option, market) {
            this.openTrade(event, option, market);
            this.showMoreOptionsDialog = false;
        },
        openMoreOptionsDialog(event) {
            this.currentMoreOptionsEvent = event;
            this.showMoreOptionsDialog = true;
        },
        openTrade(event, option, market) {
            if (event.matchStatus === 3 || event.matchStatus === 4) {
                return;
            }
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

            // Immediately clear the preview when amount changes to prevent mismatch before API returns
            this.betPreview = this.createEmptyPreview();
            this.isPreviewLoading = true;

            this.previewTimer = setTimeout(() => {
                this.fetchBetPreview();
            }, 250);
        },
        fetchBetPreview() {
            if (!this.isLogin) return;
            if (!this.selectedTeam || !this.selectedTeam.optionData || !this.selectedTeam.marketData || !(this.tradeAmount > 0)) {
                this.isPreviewLoading = false;
                return;
            }

            this.previewError = '';
            // 记录发起请求时的金额
            const requestAmount = this.tradeAmount;

            const url = `${this.swapHost}/quiz/bet/preview?marketId=${this.selectedTeam.marketData.id}&optionId=${this.selectedTeam.optionData.id}&betAmount=${this.tradeAmount}`;
            this.$http.get(url).then(response => {
                // 如果当前金额已经改变，说明有新的请求发出了，直接丢弃这次响应
                if (this.tradeAmount !== requestAmount) {
                    return;
                }

                this.isPreviewLoading = false;
                const resp = response.body;
                if (resp && resp.code === 0 && resp.data) {
                    this.betPreview = Object.assign(this.createEmptyPreview(), resp.data);
                    // Update global wallet balance if provided in preview response
                    if (resp.data.walletBalance !== undefined) {
                        this.walletBalance = resp.data.walletBalance;
                    }
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
        fetchWalletBalance() {
            if (!this.isLogin) return;
            this.$http.post(this.host + '/asset/wallet').then(response => {
                const resp = response.body;
                if (resp && resp.code === 0 && resp.data) {
                    const usdtWallet = resp.data.find(w => w.coin === 'USDT');
                    this.walletBalance = usdtWallet ? usdtWallet.balance : 0;
                }
            }).catch(err => {
                console.error('Failed to fetch wallet balance', err);
            });
        },
        submitBet() {
            if (!this.$store.getters.isLogin) {
                this.$message.warning('请先登录');
                this.$router.push('/login');
                return;
            }
            if (!this.selectedEvent || this.selectedEvent.matchStatus === 3 || this.selectedEvent.matchStatus === 4) {
                this.$message.warning('该比赛已结束，无法下注');
                return;
            }
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
                expectedOdds: this.selectedTeam.optionData.currentOdds,
                deviceId: 'pc'
            };

            this.$http.post(this.swapHost + '/quiz/bet', payload).then(response => {
                this.isSubmitting = false;
                const resp = response.body;
                if (resp && resp.code === 0) {
                    this.$message.success('下注成功');
                    this.tradeAmount = null;
                    this.getMatches(); // Refresh matches to update odds
                    this.getMyOrders();
                    return;
                }
                this.$message.error(resp.message ? resp.message : '下注失败');
            }).catch(() => {
                this.isSubmitting = false;
                this.$message.error('网络请求失败，请稍后重试');
            });
        },
        startWebsock() {
            console.log('change')
            if (this.stompClient) {
                this.stompClient.ws.close();
            }
            let stompClient = null;
            const that = this;
            const socket = new SockJS(that.swapHost + that.api.swap.ws);
            stompClient = Stomp.over(socket);
            this.stompClient = stompClient;
            stompClient.debug = false;

            stompClient.connect({}, function (frame) {
                stompClient.subscribe("/topic/quiz/odds/change", function (msg) {
                    that.getMatches();
                    try {
                        const resp = JSON.parse(msg.body);
                        if (resp) {
                            that.updateOddsFromWebsocket(resp);
                        }
                    } catch (e) {
                        console.error('Failed to parse odds change message', e);
                    }
                });
            });
        },
        updateOddsFromWebsocket(data) {
            // Find the event that needs updating
            let eventFound = null;
            this.categories.forEach(category => {
                const event = category.events.find(e => e.matchId === data.matchId && e.markets && e.markets.some(m => m.id === data.marketId));
                if (event) {
                    eventFound = event;
                }
            });

            if (eventFound && data.options && Array.isArray(data.options)) {
                // Update market options
                const market = eventFound.markets.find(m => m.id === data.marketId);
                if (market) {
                    data.options.forEach(newOption => {
                        // Update in market options array
                        const optIndex = market.options.findIndex(o => o.id === newOption.id);
                        if (optIndex !== -1) {
                            this.$set(market.options[optIndex], 'currentOdds', newOption.currentOdds);
                            this.$set(market.options[optIndex], 'currentPrice', newOption.currentPrice);
                        }

                        // Update in mapped teams array
                        if (eventFound.teams) {
                            const team = eventFound.teams.find(t => t.optionData && t.optionData.id === newOption.id);
                            if (team) {
                                this.$set(team.optionData, 'currentOdds', newOption.currentOdds);
                                this.$set(team.optionData, 'currentPrice', newOption.currentPrice);
                            }
                        }
                        
                        // Update currently selected option in right panel if it matches
                        if (this.selectedTeam && this.selectedTeam.optionData && this.selectedTeam.optionData.id === newOption.id) {
                             this.$set(this.selectedTeam.optionData, 'currentOdds', newOption.currentOdds);
                             this.$set(this.selectedTeam.optionData, 'currentPrice', newOption.currentPrice);
                             this.schedulePreview(); // re-calculate expected profit
                        }
                    });
                }
            }
        },
        stopWebsock() {
            if (this.stompClient) {
                try {
                    if (this.stompClient.ws && this.stompClient.ws.readyState === WebSocket.OPEN) {
                        this.stompClient.ws.close();
                    }
                    if (this.stompClient.connected) {
                        this.stompClient.disconnect(() => {
                            console.log("WebSocket 已断开");
                        });
                    }
                } catch (error) {
                    console.error("Error stopping websocket", error);
                } finally {
                    this.stompClient = null;
                }
            }
        }
    },
    mounted() {
        this.getLeagues();
        this.getMyOrders();
        this.getOrderCounts();
        this.fetchWalletBalance();
        this.startWebsock();
    },
    beforeDestroy() {
        if (this.previewTimer) {
            clearTimeout(this.previewTimer);
        }
        this.stopWebsock();
    }
}
</script>

<style lang="scss" scoped>
.sports-page {
    display: flex;
    flex-direction: row;
    margin: 0 auto;
    padding: 20px;
    gap: 20px;
    height: calc(100vh - 70px);
    color: #1f2937;
    background: #f0f2f5;
    box-sizing: border-box;
    overflow: hidden;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
}

/* Left Sidebar */
.left-sidebar {
    width: 240px;
    flex-shrink: 0;
    display: flex;
    flex-direction: column;
    background: #fff;
    border-radius: 12px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
    overflow: hidden;
}

.ls-header {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 20px;
    color: #2563eb;
    border-bottom: 1px solid #f3f4f6;

    i {
        font-size: 20px;
    }

    h2 {
        margin: 0;
        font-size: 18px;
        font-weight: 700;
    }
}

.ls-menu {
    flex: 1;
    overflow-y: auto;
    padding: 10px;
}

.menu-item {
    display: flex;
    align-items: center;
    padding: 12px 16px;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.2s;
    color: #4b5563;
    margin-bottom: 4px;

    &:hover {
        background: #f8fafc;
    }

    &.active {
        background: #eff6ff;
        color: #2563eb;
        font-weight: 600;

        .menu-count {
            color: #2563eb;
        }
    }
}

.menu-icon {
    font-size: 18px;
    margin-right: 12px;
    width: 24px;
    text-align: center;
}

.menu-text {
    flex: 1;
    font-size: 14px;
}

.menu-count {
    font-size: 12px;
    color: #9ca3af;
}

.menu-country-header {
    padding: 8px 16px;
    font-size: 12px;
    font-weight: 600;
    color: #6b7280;
    text-transform: uppercase;
    letter-spacing: 0.5px;
}

.ls-banner {
    padding: 16px;
    border-top: 1px solid #f3f4f6;
}

.banner-content {
    background: linear-gradient(135deg, #4f46e5, #3b82f6);
    border-radius: 12px;
    padding: 20px 16px;
    color: #fff;
    text-align: center;
    position: relative;
    overflow: hidden;

    &::before {
        content: '💰';
        position: absolute;
        font-size: 60px;
        opacity: 0.2;
        right: -10px;
        bottom: -10px;
    }
}

.banner-tag {
    font-size: 12px;
    background: rgba(255, 255, 255, 0.2);
    display: inline-block;
    padding: 4px 8px;
    border-radius: 4px;
    margin-bottom: 10px;
}

.banner-title {
    font-size: 32px;
    font-weight: 800;
    margin-bottom: 4px;

    span {
        font-size: 16px;
        font-weight: 600;
    }
}

.banner-desc {
    font-size: 13px;
    opacity: 0.9;
    margin-bottom: 16px;
}

.banner-btn {
    width: 100%;
    background: #fff;
    color: #2563eb;
    border: none;
    padding: 10px;
    border-radius: 6px;
    font-weight: 700;
    cursor: pointer;
    transition: transform 0.1s;

    &:active {
        transform: scale(0.98);
    }
}

/* Main Column */
.main-column {
    flex: 1;
    min-width: 0;
    display: flex;
    flex-direction: column;
    gap: 20px;
    height: 100%;
}

.featured-match-banner {
    flex: 1;
    /* 1/6 of total height */
    min-height: 0;
    background: linear-gradient(90deg, #1e3a8a, #1e40af, #1e3a8a);
    border-radius: 12px;
    padding: 10px 20px;
    color: #fff;
    text-align: center;
    position: relative;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    overflow: hidden;
}

.league-info {
    text-align: left;
    display: flex;
    flex-direction: column;
    justify-content: center;
}

.league-name {
    font-size: 16px;
    font-weight: 700;
    margin-bottom: 4px;
}

.match-time {
    font-size: 12px;
    opacity: 0.8;
}

.match-teams {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 20px;
}

.team {
    display: flex;
    align-items: center;
    gap: 12px;
}

.team-home {
    flex-direction: row;
}

.team-away {
    flex-direction: row;
}

.team-name {
    font-size: 18px;
    font-weight: 800;
}

.team-logo {
    width: 40px;
    height: 40px;
    object-fit: cover;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
    background: #fff;
    border: 2px solid #f3f4f6;
}

.vs-text {
    font-size: 24px;
    font-weight: 900;
    color: #60a5fa;
    font-style: italic;
}

.bet-now-btn {
    background: #2563eb;
    color: #fff;
    border: none;
    padding: 8px 24px;
    border-radius: 20px;
    font-size: 14px;
    font-weight: 700;
    cursor: pointer;
    box-shadow: 0 4px 12px rgba(37, 99, 235, 0.4);
    transition: background 0.2s;

    &:hover {
        background: #1d4ed8;
    }
}

.match-section {
    background: #fff;
    border-radius: 12px;
    padding: 20px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
    flex: 3;
    /* 3/6 of total height */
    display: flex;
    flex-direction: column;
    min-height: 0;
}

.match-filters-top {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
}

.match-tabs {
    display: flex;
    gap: 24px;
}

.match-tab {
    background: transparent;
    border: none;
    font-size: 16px;
    color: #6b7280;
    font-weight: 600;
    cursor: pointer;
    padding: 0 0 8px 0;
    position: relative;

    &.active {
        color: #2563eb;

        &::after {
            content: '';
            position: absolute;
            bottom: 0;
            left: 0;
            width: 100%;
            height: 3px;
            background: #2563eb;
            border-radius: 2px;
        }
    }
}

.tab-badge {
    position: absolute;
    top: -8px;
    right: -16px;
    background: #ef4444;
    color: #fff;
    font-size: 10px;
    padding: 2px 6px;
    border-radius: 10px;
}

.filters-right {
    display: flex;
    gap: 12px;
}

.filter-select {
    width: 120px;
}

.filter-search {
    width: 200px;
}

/* Match Table */
.match-table-container {
    padding-right: 10px;
    overflow-x: auto;
    flex: 1;
    overflow-y: auto;
    min-height: 0;
    position: relative;

    &::-webkit-scrollbar {
        width: 8px;
        height: 8px;
    }

    &::-webkit-scrollbar-track {
        background: #f1f5f9;
        border-radius: 4px;
    }

    &::-webkit-scrollbar-thumb {
        background: #cbd5e1;
        border-radius: 4px;

        &:hover {
            background: #94a3b8;
        }
    }
}

.empty-match-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100%;
    min-height: 300px;
    padding: 40px 20px;
    text-align: center;
}

.empty-icon {
    font-size: 64px;
    margin-bottom: 16px;
    opacity: 0.6;
}

.empty-text {
    font-size: 18px;
    font-weight: 600;
    color: #374151;
    margin-bottom: 8px;
}

.empty-hint {
    font-size: 14px;
    color: #9ca3af;
}

.match-table {
    width: 100%;
    border-collapse: separate;
    border-spacing: 0 7px;
    text-align: center;
    table-layout: fixed;
}

.sport-group-header td {
    padding: 0;
    border: none;
}

.group-header-content {
    display: flex;
    align-items: center;
    justify-content: space-between;
    background: #fff;
    padding: 12px 20px 6px 20px;
    border-radius: 12px;
    border: 1px solid #f3f4f6;
    cursor: pointer;
    transition: all 0.2s;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.02);
}

.group-header-content:hover {
    border-color: #d1d5db;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
    transform: translateY(-1px);
}

.group-header-left {
    flex: 0 0 300px;
    display: flex;
    align-items: center;
    border-right: 1px solid #f3f4f6;
    padding-right: 16px;
}

.group-header-center {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 24px;
    padding: 0 20px;
}

.score-display {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 4px;
    min-width: 80px;
    font-weight: 700;
}

.score-text {
    font-size: 20px;
    font-weight: 800;
    color: #2563eb;
    letter-spacing: 2px;
}

.status-badge {
    font-size: 11px;
    padding: 2px 8px;
    border-radius: 10px;
    font-weight: 600;

    &.is-live {
        background: #fee2e2;
        color: #ef4444;
    }

    &.is-pending {
        background: #f3f4f6;
        color: #6b7280;
    }

    &.is-closed {
        background: #f3f4f6;
        color: #9ca3af;
    }
}

.team {
    display: flex;
    align-items: center;
    gap: 12px;
    flex: 1;
}

.team-logo-small {
    width: 28px;
    height: 28px;
    border-radius: 50%;
    object-fit: contain;
    background: #f9fafb;
    border: 1px solid #f3f4f6;
    flex-shrink: 0;
}

.home-team {
    justify-content: flex-end;
}

.away-team {
    justify-content: flex-start;
}

.team-name {
    font-size: 15px;
    font-weight: 600;
    color: #1f2937;
    max-width: 120px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.team-icon-emoji {
    font-size: 24px;
    line-height: 1;
}

.group-header-options-full {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: 8px;
    padding-left: 20px;
    padding-bottom: 6px;
    overflow-x: auto;
    flex-wrap: nowrap;
    scroll-behavior: smooth;

    &::-webkit-scrollbar {
        display: block;
        height: 6px;
    }

    &::-webkit-scrollbar-track {
        background: #f1f5f9;
        border-radius: 3px;
        margin-left: 20px;
    }

    &::-webkit-scrollbar-thumb {
        background: #cbd5e1;
        border-radius: 3px;

        &:hover {
            background: #94a3b8;
        }
    }

    .header-odd-item {
        flex: 0 0 auto;
        width: 90px;
    }
}

.group-header-right {
    flex: 0 0 220px;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    border-left: 1px solid #f3f4f6;
    padding-left: 16px;
}

.header-odds {
    display: flex;
    gap: 10px;
    width: 100%;
}

.header-odd-item {
    flex: 1;
}

.table-odd-btn {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background: #f8fafc;
    border: 1px solid #e2e8f0;
    border-radius: 8px;
    padding: 4px 8px;
    cursor: pointer;
    transition: all 0.2s;

    &:hover:not(:disabled) {
        background: #eff6ff;
        border-color: #bfdbfe;
    }

    &.active {
        background: #2563eb;
        border-color: #2563eb;

        .header-odd-label {
            color: #bfdbfe;
        }

        .header-odd-value {
            color: #fff;
        }
    }

    &:disabled {
        opacity: 0.5;
        cursor: not-allowed;
        background: #f1f5f9;
    }
}

.header-odd-label {
    font-size: 11px;
    color: #6b7280;
    font-weight: 500;
    max-width: 100px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.header-odd-value {
    font-size: 14px;
    font-weight: 700;
    color: #1f2937;
}

.match-time-display {
    display: flex;
    align-items: center;
    gap: 15px;
    min-width: 100px;
    color: #737985;
    margin-right: 12px;
    padding-right: 12px;
    border-right: 1px solid #e5e7eb;
}

.time-date {
    font-size: 14px;
    color: #737985;

}

.time-hour {
    font-size: 14px;
    color: #737985;
}

.league-title-display {
    display: flex;
    flex-direction: column;
    gap: 2px;
}

.sport-name {
    font-size: 14px;
    font-weight: 700;
    color: #374151;
}

.market-title {
    font-size: 16px;
    font-weight: 700;
    color: #000;
}

.sport-icon {
    font-size: 20px;
    margin-right: 10px;
}

/* remove legacy class */

/* Orders Panel */
.orders-panel {
    background: #fff;
    border-radius: 12px;
    padding: 20px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
    flex: 2;
    /* 2/6 of total height */
    display: flex;
    flex-direction: column;
    min-height: 0;
    overflow: hidden;
}

.orders-panel-top {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.order-tab-title {
    font-size: 16px;
    font-weight: 700;
    color: #1f2937;
    margin-right: 20px;
}

.order-tabs {
    display: flex;
    align-items: center;
    gap: 24px;
}

.order-tab {
    background: transparent;
    border: none;
    font-size: 14px;
    color: #6b7280;
    cursor: pointer;
    padding: 8px 0;
    position: relative;
    display: flex;
    align-items: center;

    &.active {
        color: #2563eb;
        font-weight: 600;

        &::after {
            content: '';
            position: absolute;
            bottom: 0;
            left: 0;
            width: 100%;
            height: 2px;
            background: #2563eb;
        }

        .tab-count {
            color: #2563eb;
        }
    }
}

.tab-count {
    color: #6b7280;
    font-size: 12px;
    padding: 2px 4px;
    border-radius: 10px;
    margin-left: 2px;
    font-weight: 600;
}

.view-all-orders {
    color: #2563eb;
    font-size: 14px;
    text-decoration: none;

    &:hover {
        text-decoration: underline;
    }
}

.orders-table-container {
    width: 100%;
    overflow-x: auto;
    overflow-y: auto;
    flex: 1;
    position: relative;

    &::-webkit-scrollbar {
        width: 8px;
        height: 8px;
    }

    &::-webkit-scrollbar-track {
        background: #f1f5f9;
        border-radius: 4px;
    }

    &::-webkit-scrollbar-thumb {
        background: #cbd5e1;
        border-radius: 4px;

        &:hover {
            background: #94a3b8;
        }
    }
}

.orders-table {
    width: 100%;
    border-collapse: separate;
    border-spacing: 0;
    text-align: left;

    th {
        position: sticky;
        top: 0;
        background-color: #fff;
        z-index: 10;
        color: #9ca3af;
        font-weight: 500;
        font-size: 13px;
        padding: 12px 16px;
        border-bottom: 1px solid #f3f4f6;
    }

    td {
        padding: 12px 16px;
        border-bottom: 1px solid #f9fafb;
        font-size: 14px;
        background-color: #fff;
    }
}

.time-col {
    color: #6b7280;
}

.order-title {
    font-weight: 600;
}

.order-option {
    color: #111827;
}

.order-status {
    padding: 4px 12px;
    border-radius: 4px;
    font-size: 12px;
    font-weight: 600;

    &.is-pending {
        background: #fef3c7;
        color: #d97706;
    }

    &.is-win {
        background: #dcfce7;
        color: #15803d;
    }

    &.is-lose {
        background: #fee2e2;
        color: #b91c1c;
    }

    &.is-refund {
        background: #f3f4f6;
        color: #6b7280;
    }

    &.is-unknown {
        background: #f3f4f6;
        color: #6b7280;
    }
}

.pagination-container {
    display: flex;
    justify-content: flex-end;
    margin-top: 20px;
}

.empty-orders-state {
    text-align: center;
    padding-top: 100px;
    color: #9ca3af;
    font-size: 14px;
}

.loading-more,
.no-more-data {
    text-align: center;
    padding: 15px;
    color: #9ca3af;
    font-size: 13px;
}

/* Right Sidebar */
.right-sidebar {
    width: 320px;
    flex-shrink: 0;
    display: flex;
    flex-direction: column;
    gap: 20px;
    overflow-y: auto;

    &::-webkit-scrollbar {
        width: 0;
    }
}

.betting-slip-panel {
    background: #fff;
    border-radius: 12px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
    overflow: hidden;
}

.panel-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 16px 20px;
    border-bottom: 1px solid #f3f4f6;

    h3 {
        margin: 0;
        font-size: 16px;
        font-weight: 700;
    }

    i {
        color: #9ca3af;
        cursor: pointer;
    }
}

.more-btn {
    flex-direction: row;
    gap: 6px;
    height: 100%;
}

.more-options-dialog {
    border-radius: 12px;
}

.more-options-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
    gap: 12px;
    padding: 10px 0;
    max-height: 60vh;
    overflow-y: auto;
}

.more-option-item {
    width: 100%;
}

.slip-tabs {
    display: flex;
    background: #f8fafc;
    padding: 10px 20px;
    gap: 10px;
}

.slip-tab {
    flex: 1;
    background: transparent;
    border: 1px solid transparent;
    padding: 8px;
    border-radius: 6px;
    color: #6b7280;
    font-weight: 600;
    cursor: pointer;

    &.active {
        background: #fff;
        color: #2563eb;
        border-color: #e5e7eb;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.02);
    }
}

.slip-content {
    padding: 20px;
}

.selected-bet-card {
    border-radius: 8px;
    margin-bottom: 20px;
    position: relative;
}

.bet-league {
    font-size: 12px;
    color: #6b7280;
}

.close-bet {
    color: #9ca3af;
    cursor: pointer;
    font-size: 14px;

    &:hover {
        color: #ef4444;
    }
}

.bet-match-title {
    font-size: 14px;
    font-weight: 700;
    color: #111827;
}

.slip-options-group {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(80px, 1fr));
    gap: 8px;
    margin-top: 12px;
}

.slip-opt-btn {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 4px;
    background: #fff;
    border: 1px solid #e2e8f0;
    border-radius: 6px;
    padding: 8px;
    cursor: pointer;
    transition: all 0.2s;

    &:hover:not(:disabled) {
        border-color: #93c5fd;
        background: #eff6ff;
    }

    &.active {
        background: #2563eb;
        border-color: #2563eb;
        color: #fff;

        .opt-name {
            color: #bfdbfe;
        }

        .opt-odds {
            color: #fff;
        }
    }

    &:disabled {
        opacity: 0.5;
        cursor: not-allowed;
        background: #f1f5f9;
    }
}

.opt-name {
    font-size: 12px;
    color: #6b7280;
    max-width: 100%;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.opt-odds {
    font-size: 14px;
    font-weight: 700;
    color: #1f2937;
}

.slip-team-logo {
    width: 32px;
    height: 32px;
    object-fit: cover;
    border-radius: 50%;
    background: #fff;
    border: 2px solid #f3f4f6;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.08);
}

.empty-selection-hint {
    text-align: center;
    color: #9ca3af;
    font-size: 13px;
    padding: 20px 0;
}

.quick-amounts-label,
.stake-input-label {
    font-size: 12px;
    color: #6b7280;
    margin-bottom: 8px;
}

.tp-quick-amounts {
    display: flex;
    gap: 8px;
    margin-bottom: 20px;

    button {
        flex: 1;
        background: #fff;
        border: 1px solid #e5e7eb;
        border-radius: 6px;
        padding: 6px 0;
        color: #4b5563;
        cursor: pointer;

        &:hover {
            border-color: #2563eb;
            color: #2563eb;
        }
    }
}

.stake-input-wrap {
    position: relative;
    margin-bottom: 12px;

    input {
        width: 100%;
        box-sizing: border-box;
        border: 1px solid #d1d5db;
        border-radius: 8px;
        padding: 12px 60px 12px 16px;
        font-size: 18px;
        font-weight: 700;
        outline: none;

        &:focus {
            border-color: #2563eb;
        }
    }
}

.stake-unit {
    position: absolute;
    right: 16px;
    top: 50%;
    transform: translateY(-50%);
    color: #6b7280;
    font-weight: 600;
}

.balance-row {
    display: flex;
    justify-content: space-between;
    font-size: 12px;
    color: #6b7280;
    margin-bottom: 24px;
}

.global-balance-container {
    background: #fff;
    border-radius: 0 0 12px 12px;
}

.global-balance {
    margin-top: 0;
    padding-bottom: 10px;
    border-bottom: 1px solid #f3f4f6;
    margin-bottom: 10px;
}

.recharge-link {
    color: #2563eb;
    text-decoration: none;
}

.expected-return {
    margin-bottom: 24px;
}

.return-label {
    font-size: 12px;
    color: #6b7280;
    margin-bottom: 4px;
}

.return-value {
    font-size: 20px;
    font-weight: 700;
    color: #2563eb;
}

.tp-submit-btn {
    width: 100%;
    padding: 14px;
    border: none;
    border-radius: 8px;
    font-size: 16px;
    font-weight: 700;
    color: #fff;
    cursor: pointer;

    &.blue {
        background: #2563eb;

        &:hover {
            background: #1d4ed8;
        }
    }

    &:disabled {
        background: #cbd5e1;
        cursor: not-allowed;
    }
}

.empty-slip {
    padding: 40px 20px;
    text-align: center;
    color: #9ca3af;
    font-size: 14px;
}

.settings-panel {
    background: #fff;
    border-radius: 12px;
    padding: 20px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);

    h3 {
        margin: 0 0 16px 0;
        font-size: 16px;
        font-weight: 700;
    }
}

.setting-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;
    font-size: 14px;
    color: #4b5563;

    &:last-child {
        margin-bottom: 0;
    }
}

.odds-select {
    width: 120px;
}

.promo-banner-right {
    background: linear-gradient(135deg, #2563eb, #60a5fa);
    border-radius: 12px;
    padding: 24px 20px;
    color: #fff;
    position: relative;
    overflow: hidden;
    box-shadow: 0 4px 12px rgba(37, 99, 235, 0.2);

    &::after {
        content: '🎁';
        position: absolute;
        font-size: 80px;
        right: -10px;
        bottom: -20px;
        opacity: 0.8;
    }
}

.promo-content {
    position: relative;
    z-index: 1;
}

.promo-title {
    font-size: 18px;
    font-weight: 800;
    margin-bottom: 4px;
}

.promo-desc {
    font-size: 13px;
    opacity: 0.9;
    margin-bottom: 12px;
}

.promo-amount {
    font-size: 36px;
    font-weight: 800;
    margin-bottom: 20px;

    span {
        font-size: 16px;
        font-weight: 600;
    }
}

.promo-btn {
    background: transparent;
    border: 1px solid rgba(255, 255, 255, 0.6);
    color: #fff;
    padding: 8px 24px;
    border-radius: 20px;
    font-size: 13px;
    cursor: pointer;
    transition: background 0.2s;

    &:hover {
        background: rgba(255, 255, 255, 0.1);
    }
}

@media (max-width: 1200px) {
    .sports-page {
        flex-wrap: wrap;
        overflow-y: auto;
    }

    .left-sidebar {
        display: none;
    }

    .main-column {
        flex: 1 1 100%;
    }

    .right-sidebar {
        flex: 1 1 100%;
        width: 100%;
        overflow-y: visible;
    }
}

.bet-match-header {
    display: flex;
    align-items: flex-start;
    gap: 12px;
    margin-bottom: 12px;
}

.team-icon {
    width: 40px;
    height: 40px;
    background: #f3f4f6;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 20px;
    flex-shrink: 0;
}

.match-info {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 4px;
}

.match-title {
    font-size: 16px;
    font-weight: 700;
    color: #1f2937;
    line-height: 1.2;
}

.match-subtitle {
    font-size: 13px;
    color: #6b7280;
    margin-bottom: 4px;
}

.bet-status-row {
    display: flex;
    align-items: center;
    margin-top: 10px;
    gap: 8px;
}

.status-badge-green {
    background: #dcfce7;
    color: #166534;
    padding: 4px 10px;
    border-radius: 12px;
    font-size: 12px;
    font-weight: 600;
}

.status-badge-gray {
    background: #f3f4f6;
    color: #6b7280;
    padding: 4px 10px;
    border-radius: 12px;
    font-size: 12px;
    font-weight: 600;
}

.deadline-text {
    font-size: 12px;
    color: #6b7280;
}

.stake-section {
    margin-bottom: 16px;
}

.stake-input-wrap {
    margin-top: 8px;
}

.stake-input-wrap input {
    padding: 12px 60px 12px 16px;
    font-size: 18px;
    font-weight: 600;
}

.stake-input-wrap input::placeholder {
    color: #9ca3af;
    font-weight: 400;
}

.stake-balance-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 8px;
    font-size: 13px;
}

.balance-text {
    color: #6b7280;
}

.recharge-link {
    color: #2563eb;
    text-decoration: none;
    font-weight: 600;
}

.odds-info-card {
    background: #fff;
    border: 1px solid #e5e7eb;
    border-radius: 8px;
    padding: 12px 16px;
    margin-bottom: 12px;
}

.odds-info-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.info-label {
    font-size: 14px;
    color: #6b7280;
}

.info-value {
    font-size: 18px;
    font-weight: 700;
}

.odds-value {
    color: #1f2937;
}

.return-value {
    color: #2563eb;
}

.profit-value {
    color: #16a34a;
}

.empty-orders-state {
    text-align: center;
    padding-top: 100px;
    color: #9ca3af;
    font-size: 14px;
}
</style>
