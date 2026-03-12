<template>
    <div class="user-overview-container">
        <div class="">
            <div class="layout-wrapper">
                <!-- 左侧导航菜单 -->
                <div class="sidebar">
                    <nav class="nav-menu">
                        <div class="nav-item active" @click="activeTab = 'overview'">
                            <img src="../../assets/svg/all.svg" alt="" class="nav-icon">
                            <span>总览</span>
                        </div>
                        <div class="nav-item" @click="activeTab = 'security'">
                            <img src="../../assets/svg/secure.svg" alt="" class="nav-icon">
                            <span>安全中心</span>
                        </div>
                        <div class="nav-item" @click="activeTab = 'cards'">
                            <img src="../../assets/svg/cardCoupons.svg" alt="" class="nav-icon">
                            <span>卡券中心</span>
                        </div>
                        <div class="nav-item" @click="activeTab = 'invite'">
                            <img src="../../assets/svg/invite.svg" alt="" class="nav-icon">
                            <span>邀请好友</span>
                        </div>
                    </nav>
                </div>

                <!-- 右侧内容区域 -->
                <div class="main-content">
                    <div v-if="activeTab === 'overview'" class="overview-content">
                        <h1>总览</h1>
                        <!-- 资产信息 -->
                        <div class="asset-card">
                            <h3>资产总览</h3>
                            <div class="asset-amount">
                                <span class="amount">0.0000</span>
                                <span class="currency">USDT</span>
                            </div>
                            <div class="asset-equivalent">
                                ≈ ¥ 0
                            </div>
                        </div>

                        <!-- 更多信息 -->
                        <div class="more-info">
                            <h3>更多信息</h3>
                            <div class="info-list">
                                <div class="info-item">
                                    <span class="item-label">身份认证</span>
                                    <span class="item-time">2025-07-18 09:27:09</span>
                                    <button class="btn-action">完成认证</button>
                                </div>
                                <div class="info-item">
                                    <span class="item-label">注册时间</span>
                                    <span class="item-time">2025-07-07 18:06:39</span>
                                    <button class="btn-action disabled">--</button>
                                </div>
                                <div class="info-item">
                                    <span class="item-label">认证时间</span>
                                    <span class="item-time">--</span>
                                    <button class="btn-action">去认证</button>
                                </div>
                                <div class="info-item">
                                    <span class="item-label">青少年时间</span>
                                    <span class="item-time">--</span>
                                    <button class="btn-action">关闭</button>
                                </div>
                                <div class="info-item">
                                    <span class="item-label">最大资金密码</span>
                                    <span class="item-time">--</span>
                                    <button class="btn-action">关闭</button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- 其他标签页内容 -->
                    <div v-else class="tab-content">
                        <h2>{{ getTabTitle(activeTab) }}</h2>
                        <p>{{ activeTab }} 页面内容开发中...</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'UserOverview',
    data() {
        return {
            activeTab: 'overview'
        }
    },
    computed: {
        userEmail() {
            const member = this.$store.getters.member;
            return member ? member.email : '23**7@qq.com';
        },
        userUID() {
            const member = this.$store.getters.member;
            return member ? member.uid : '888311878';
        },
        registerTime() {
            return '2025-07-07 18:06:39';
        },
        lastLoginTime() {
            return '2025-07-18 09:27:09';
        }
    },
    methods: {
        getTabTitle(tab) {
            const titles = {
                'security': '安全中心',
                'kyc': 'KYC状态',
                'cards': '卡券中心',
                'invite': '邀请好友',
                'settings': '系统设置'
            };
            return titles[tab] || '总览';
        }
    }
}
</script>

<style scoped>
.user-overview-container {
    min-height: 100vh;
}

.layout-wrapper {
    display: flex;
}

.sidebar {
    border-right: 1px solid #eaeaed;
    height: 100vh;
    margin: right 38px;
    width: 280px;
    background: white;
    padding: 36px 0 0 0;
}

.user-info-section {
    text-align: center;
    padding-bottom: 20px;
    border-bottom: 1px solid #eee;
    margin-bottom: 20px;
}

.user-avatar img {
    width: 60px;
    height: 60px;
    border-radius: 50%;
    margin-bottom: 10px;
}

.user-details h3 {
    font-size: 16px;
    font-weight: 600;
    margin-bottom: 5px;
    color: #333;
}

.user-details p {
    font-size: 14px;
    color: #666;
}

.nav-menu {
    display: flex;
    flex-direction: column;
}

.nav-item {
    display: flex;
    align-items: center;
    gap: 20px;
    margin-right: 36px;
    padding: 12px 0 12px 16px;
    border-radius: 6px;
    cursor: pointer;
    transition: all 0.3s ease;
    font-size: 14px;
    color: #000;
    margin-bottom: 16px;
}

.nav-item:hover {
    background-color: #f0f8ff;
    color: #000;
}

.nav-item.active {
    --un-bg-opacity: 1;
    background-color: rgba(248, 248, 248, var(--un-bg-opacity));
}

.nav-icon {}

.main-content {

    flex: 1;
    background: white;
    border-radius: 8px;
    padding: 30px;
}

.overview-content h1 {
    font-size: 36px;
    font-weight: 600;
    margin-bottom: 30px;
    color: #000;
}

.status-active {
    color: #52c41a;
}

.asset-card {
    text-align: center;
    padding: 20px;
    border: 1px solid #eee;
    border-radius: 8px;
    margin-bottom: 20px;
}

.asset-card h3 {
    font-size: 16px;
    color: #666;
    margin-bottom: 15px;
}

.asset-amount {
    font-size: 32px;
    font-weight: 600;
    color: #333;
    margin-bottom: 5px;
}

.currency {
    font-size: 18px;
    color: #666;
    margin-left: 8px;
}

.asset-equivalent {
    font-size: 14px;
    color: #999;
}

/* 更多信息 */
.more-info h3 {
    font-size: 16px;
    font-weight: 600;
    margin-bottom: 20px;
    color: #333;
}

.info-list {
    display: flex;
    flex-direction: column;
    gap: 12px;
}

.info-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 12px 0;
    border-bottom: 1px solid #f5f5f5;
}

.info-item:last-child {
    border-bottom: none;
}

.item-label {
    color: #333;
    font-size: 14px;
    flex: 1;
}

.item-time {
    color: #666;
    font-size: 14px;
    flex: 1;
    text-align: center;
}

.btn-action {
    background-color: #000;
    color: white;
    border: none;
    padding: 6px 16px;
    border-radius: 15px;
    cursor: pointer;
    font-size: 12px;
    min-width: 60px;
}

.btn-action:hover {
    background-color: #333;
}

.btn-action.disabled {
    background-color: #ccc;
    cursor: not-allowed;
}

.tab-content {
    text-align: center;
    padding: 40px 20px;
}

.tab-content h2 {
    font-size: 24px;
    margin-bottom: 20px;
    color: #333;
}

.tab-content p {
    color: #666;
    font-size: 16px;
}
</style>