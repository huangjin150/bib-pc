<template>
    <div class="notice">
        <div class="box">
            <div class="breadcrumb">
                <span @click="goToHome">首页</span>
                <span class="separator">></span>
                <span class="current">{{ currentCategory.title }}</span>
            </div>

            <div class="notice-container">
                <div class="sidebar">

                    <div v-for="(item, index) in sidebarItems" :key="index" class="sidebar-item"
                        :class="{ active: activeCategory == item.id }" @click="changeCategory(item.id)">
                        <img class="image" :src="item.icon" alt="">
                        <span class="text">{{ item.title }}</span>
                    </div>
                </div>

                <div class="content">
                    <div class="content-header">
                        <h2>{{ currentCategory.title }}</h2>
                    </div>

                    <div class="notice-list">
                        <div v-for="(notice, index) in notices" :key="index" class="notice-item"
                            @click="goToDetail(notice.id)">
                            <div class="notice-title">{{ notice.title }}</div>
                            <div class="notice-date">{{ notice.createTime }}</div>
                        </div>
                        <Page :total="total" :pageSize="pageSize" show-total :current="page" @on-change="changePage">
                        </Page>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { marketItems } from "./data.js";
export default {
    data() {
        return {
            activeCategory: null,
            sidebarItems: [
                { id: marketItems[0].id, title: marketItems[0].title, icon: require('@/assets/images/notice_new.png') },
                { id: marketItems[1].id, title: marketItems[1].title, icon: require('@/assets/images/notice_activity.png') },
                { id: marketItems[2].id, title: marketItems[2].title, icon: require('@/assets/images/notice_withdrawal.png') },
                { id: marketItems[3].id, title: marketItems[3].title, icon: require('@/assets/images/notice_updata.png') },
                { id: marketItems[4].id, title: marketItems[4].title, icon: require('@/assets/images/notice_trading.png') },
                { id: marketItems[5].id, title: marketItems[5].title, icon: require('@/assets/images/vote.png') },
                { id: marketItems[6].id, title: marketItems[6].title, icon: require('@/assets/images/other.png') },
            ],
            notices: [
                { id: 1, categoryId: 'crypto', title: '币安合约将上线ATHUSDT USDT永续合约', date: '2023-04-02' },
                { id: 2, categoryId: 'activities', title: '币安将推出第二期投票上市活动', date: '2023-04-02' },
                { id: 3, categoryId: 'news', title: '关于币安现货新增交易对及交易机器人服务的公告', date: '2023-04-03' },
                { id: 4, categoryId: 'crypto', title: '币安Megadrop上线KernelDAO (KERNEL)：申购BNB定期产品或完成Web3任务，获取空投奖励！', date: '2023-04-01' },
                { id: 5, categoryId: 'crypto', title: '币安理财、一键买币、闪兑、杠杆、合约上线GUNZ (GUN)', date: '2023-03-31' },
                { id: 6, categoryId: 'crypto', title: '币安合约将上线FUNUSDT和MLNUSDT USDT永续合约', date: '2023-03-31' },
                { id: 7, categoryId: 'crypto', title: '币安理财、一键买币、闪兑、杠杆上线Mubarak (MUBARAK)、CZ\'S Dog (BROCCOLI714)、Tutorial (TUT)、Banana For Scale (BANANAS31)', date: '2023-03-28' }
            ],
            pageSize: 7,
            page: 1,
            total: 0,
        }
    },
    computed: {
        currentCategory() {
            return this.sidebarItems.find(item => item.id === this.activeCategory) || { title: 'Abtcoin最新动态' };
        }
    },
    created() {
        this.initFromRoute();
        this.$watch(
            () => this.$route.params.id,
            (newId) => {
                if (newId) {
                    this.activeCategory = newId;
                    this.initFromRoute();
                }
            }
        );
    },
    methods: {
        initFromRoute() {
            const id = this.$route.params.id;
            if (id) {
                this.activeCategory = id;
            } else {
                this.activeCategory = '1';
                this.$router.replace(`/announcementList/1`).catch(err => {
                    if (err.name !== 'NavigationDuplicated') {
                        throw err;
                    }
                });
            }
            let params = {
                announcementClassification: this.activeCategory,
                pageNo: this.page,
                pageSize: this.pageSize
            }
            this.$http.post(this.host + "/announcement/page", params).then(response => {
                var resp = response.body;
                if (resp.code == 0) {
                    this.notices = resp.data.records
                    this.total = resp.data.total
                } else {
                    this.$Message.error(resp.message);
                }
            });
        },
        changeCategory(categoryId) {
            if (this.activeCategory === categoryId) return;
            this.activeCategory = categoryId;
            this.$router.push(`/announcementList/${categoryId}`);
        },
        goToDetail(noticeId) {
            this.$router.push(`/announcementItem/${noticeId}`);
        },
        goToHome() {
            this.$router.push('/');
        },
        changePage(pageindex) {
            this.page = pageindex;
            this.initFromRoute();
        },
    }
}
</script>

<style lang="scss" scoped>
.image {
    width: 20px;
    height: 20px;
    margin-right: 5px;
}

.flex {
    display: flex;
    align-items: center;
    justify-content: space-between;
}

.flex_b {
    display: flex;
    align-items: center;
}

.flex_c {
    display: flex;
    justify-content: space-between;
}

.notice {
    min-height: 100vh;
}

.box {
    max-width: 1200px;
    margin: 0 auto;
}

.breadcrumb {
    padding: 20px 0;
    display: flex;
    align-items: center;
    margin-bottom: 20px;
    font-size: 14px;
    color: #848E9C;

    span {
        cursor: pointer;

        &:hover {
            color: #F0B90B;
        }

        &.current {
            cursor: default;

            &:hover {}
        }
    }

    .separator {
        margin: 0 8px;
        cursor: default;

        &:hover {
            color: #848E9C;
        }
    }
}

.notice-container {
    display: flex;
    gap: 20px;
}

.sidebar {
    width: 220px;
    border-radius: 12px;
    padding: 10px 0;

    .back-btn {
        padding: 10px 20px;
        cursor: pointer;
        display: flex;
        align-items: center;
        color: #000;

        &:hover {
            color: #F0B90B;
        }

        .icon {
            font-size: 20px;
            margin-right: 10px;
        }
    }

    .sidebar-item {
        padding: 12px 20px;
        cursor: pointer;
        display: flex;
        align-items: center;
        color: #000;
        border-radius: 10px;
        margin-bottom: 10px;

        &:hover {
            background-color: #f9f9f9;
        }

        &.active {
            background-color: #f7f7f7;
            font-weight: 700;
        }

        .icon {
            margin-right: 10px;
            display: flex;
            align-items: center;
        }
    }
}

.content {
    border-left: 1px solid #eaeaed;
    flex: 1;
    padding: 20px 20px 0 20px;

    .content-header {
        padding-bottom: 15px;

        h2 {
            font-size: 20px;
            font-weight: 500;
        }
    }

    .notice-list {
        .notice-item {
            padding: 15px 0;
            cursor: pointer;

            &:hover {
                .notice-title {
                    color: #000;
                    font-weight: 700;
                }
            }

            .notice-title {
                font-size: 16px;
                margin-bottom: 8px;
            }

            .notice-date {
                font-size: 12px;
                color: #848E9C;
            }
        }
    }
}

.latest-news {
    width: 280px;
    background-color: #1E2329;
    border-radius: 8px;
    padding: 20px;

    .latest-header {
        padding-bottom: 15px;
        border-bottom: 1px solid #2C3138;
        margin-bottom: 20px;

        h3 {
            font-size: 16px;
            font-weight: 500;
            color: #EAECEF;
        }
    }

    .latest-list {
        .latest-item {
            padding: 12px 0;
            border-bottom: 1px solid #2C3138;
            cursor: pointer;

            &:hover {
                .latest-title {
                    color: #F0B90B;
                }
            }

            .latest-title {
                font-size: 14px;
                color: #EAECEF;
                margin-bottom: 6px;
                line-height: 1.4;
            }

            .latest-date {
                font-size: 12px;
                color: #848E9C;
            }
        }
    }
}

::v-deep(.ivu-page) {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    padding: 15px 0;
}

::v-deep(.ivu-page-prev) {
    border: none;
}

::v-deep(.ivu-page-next) {
    border: none;
}

::v-deep(.ivu-page-item) {
    border: none;
}
</style>