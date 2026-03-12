<template>
    <div class="property-layout">
        <div class="">
            <div class="layout-wrapper">
                <!-- 左侧菜单 -->
                <div class="sidebar">
                    <nav class="nav-menu">
                        <router-link v-for="item in menuItems" :key="item.path" :to="item.path" class="nav-item"
                            active-class="active">
                            <img :src="item.icon" alt="" class="nav-icon">
                            <span style="margin-left: 5px;">{{ item.name }}</span>
                        </router-link>
                    </nav>
                </div>

                <!-- 右侧路由出口 -->
                <div class="main-content">
                    <router-view></router-view>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'PropertyLayout',
    data() {
        return {
            menuItems: [
                {
                    name: '资产总览',
                    path: '/assets/overview',
                    icon: require('../../assets/svg/property.svg')
                },
                {
                    name: '资金账户',
                    path: '/assets/spot',
                    icon: require('../../assets/svg/instock.svg')
                },
                {
                    name: '合约账户',
                    path: '/assets/contract',
                    icon: require('../../assets/svg/contract.svg')
                },
            ]
        }
    }
}
</script>

<style scoped>
.property-layout {
    min-height: 100vh;
}

.layout-wrapper {
    display: flex;
}

.sidebar {
    width: 280px;
    border-right: 1px solid #eaeaed;
    background: white;
    min-height: 100vh;
    border-radius: 8px;
    padding: 36px 0 0 0;
}

.nav-menu {
    display: flex;
    flex-direction: column;
    gap: 8px;
}

.nav-item {
    display: flex;
    margin-right: 24px;
    align-items: center;
    gap: 12px;
    margin-bottom: 10px;
    padding: 12px 16px;
    border-radius: 6px;
    cursor: pointer;
    color: #000;
    transition: all 0.3s ease;
    font-size: 14px;
    text-decoration: none;
}

.nav-item:hover {
    --un-bg-opacity: 1;
    background-color: rgba(248, 248, 248, var(--un-bg-opacity));
}

.nav-item.active {
    --un-bg-opacity: 1;
    background-color: rgba(248, 248, 248, var(--un-bg-opacity));
    font-weight: 500;
}

.nav-icon {
    width: 24px;
    height: 24px;
}

.main-content {
    width: 1272px;
    background: white;
    border-radius: 8px;
    padding: 30px 0 30px 30px;
    min-height: 600px;
}
</style>