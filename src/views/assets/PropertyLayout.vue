<template>
    <div class="property-layout">
        <div class="layout-wrapper">
            <div class="sidebar">
                <nav class="nav-menu">
                    <router-link v-for="item in menuItems" :key="item.path" :to="item.path" class="nav-item"
                        active-class="active">
                        <img :src="item.icon" alt="" class="nav-icon">
                        <span class="nav-label">{{ item.name }}</span>
                    </router-link>
                </nav>
            </div>

            <div class="main-content">
                <router-view></router-view>
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
    box-sizing: border-box;
}

.layout-wrapper {
    display: flex;
    align-items: flex-start;
    margin: 0 auto;
}

.sidebar {
    height: 100vh;
    width: 260px;
    border-right: 1px solid #eaeaed;
    flex-shrink: 0;
    background: #ffffff;
    padding: 20px 0;
    box-sizing: border-box;
    position: sticky;
    top: 24px;
}

.nav-menu {
    display: flex;
    flex-direction: column;
    gap: 6px;
    padding: 0 12px;
}

.nav-item {
    display: flex;
    align-items: center;
    gap: 10px;
    min-height: 48px;
    padding: 0 14px;
    border-radius: 12px;
    cursor: pointer;
    color: #111111;
    transition: all 0.3s ease;
    font-size: 15px;
    text-decoration: none;
    box-sizing: border-box;
}

.nav-item:hover {
    background-color: #f2f2f2;
}

.nav-item.active {
    background-color: #ededed;
    font-weight: 600;
}

.nav-icon {
    width: 24px;
    height: 24px;
    flex-shrink: 0;
}

.nav-label {
    line-height: 1;
}

.main-content {
    flex: 1;
    min-width: 0;
    min-height: calc(100vh - 48px);
}

@media (max-width: 1200px) {
    .property-layout {
        padding: 16px;
    }

    .layout-wrapper {
        flex-direction: column;
    }

    .sidebar {
        width: 100%;
        position: static;
    }

    .main-content {
        width: 100%;
        min-height: auto;
    }
}
</style>
