<template>
    <div>
        <div class="banner" :class="themeClass">
            <div class="banner_describe">
                <div class="">
                    <div style="font-size: 70px; font-weight: bold; color: #000; margin-bottom: 10px;">
                        Abt coin
                    </div>
                    <!-- <img style="width: 297px; height: 167px;" src="../../assets/images/banner_title.webp" alt=""> -->
                    <div style="font-size: 24px;   text-align: start;margin-top: 14px ; color: #070808;">
                        <span style="font-size: 32px; color: #0068ff; font-weight: 700;"> 4300万</span>交易者的信赖首选
                    </div>
                    <div v-if="!isLogin" class="flex input_box">
                        <div>
                            <input style="border: none; height: 100%; outline: 2px solid transparent;
                          outline-offset: 2px" type="text" placeholder="邮箱/手机号">
                        </div>
                        <router-link to="/login">
                            <div class="start_btn">立即注册</div>
                        </router-link>
                    </div>
                    <div style="display: flex; gap: 40px; width: 380px; margin-top: 60px " v-else>
                        <div @click="rechargeClick" class="buyCoins_btn">充值</div>
                        <div @click="transactionClick" class="transaction_btn">交易</div>
                    </div>
                </div>
                <div class="Gainers_item" style="width: 31%;">
                    <!--跌幅榜 -->
                    <GainersRanking :sort-type="'none'" :default-limit="6" @coin-selected="onCoinSelected" />
                </div>
            </div>
        </div>
        <div class="downloadModule">
            <div>
                <img style="width: 463px; height: 556px;" src="../../assets/images/index_phone_images.webp" alt="">
            </div>
            <div
                style="height: 100%; display: flex; flex-direction: column; justify-content: space-between; padding: 100px 0; ">
                <div class="download_title">交易 ,随时随地</div>
                <div class="">
                    <div class="download_code_box">
                        <div class="download_code">
                            <img style="width: 100%; height: 100%;" src="../../assets/images/unload_code.png" alt="">
                        </div>
                        <div class="download_text_box">
                            <div class="download_text_1">扫码下载</div>
                            <div class="download_text_2">iOS & Android</div>

                        </div>
                    </div>
                </div>
                <div></div>
            </div>
        </div>

        <div v-if="!isLogin" class="newbie-guide-section">
            <h2 class="guide-main-title">新手指南</h2>
            <div class="guide-content">
                <div class="guide-steps">
                    <div class="step-item">
                        <div class="step-number">1</div>
                        <div class="step-details">
                            <h3 class="step-title">创建账户</h3>
                            <p class="step-description">注册并领取新人独家奖励</p>
                            <button class="step-button primary" @click="onGuideClick('/login')">即刻注册 →</button>
                        </div>
                    </div>
                    <div class="step-item">
                        <div class="step-number">2</div>
                        <div class="step-details">
                            <h3 class="step-title">快捷买币</h3>
                            <p class="step-description">简单几步购买加密货币</p>
                            <button class="step-button" @click="onGuideClick('/buy')">即刻买币 →</button>
                        </div>
                    </div>
                    <div class="step-item">
                        <div class="step-number">3</div>
                        <div class="step-details">
                            <h3 class="step-title">开始交易</h3>
                            <p class="step-description">买卖数字货币、轻松跟单，探索更多玩法</p>
                            <button class="step-button" @click="onGuideClick('/swap')">即刻交易 →</button>
                        </div>
                    </div>
                </div>
                <div class="guide-image">
                    <img src="../../assets/images/gift-light.d.webp" alt="新手指南">
                </div>
            </div>
        </div>
        <div class="security-section">
            <h2 class="section-title">为您的安全交易保驾护航</h2>
            <div class="features-container">
                <div class="feature-item">
                    <img src="../../assets/svg/securitySection1.svg" class="feature-icon">
                    <h3 class="feature-title">智能合约安全</h3>
                    <p class="feature-description">合约权限审计与链上监控, 覆盖大量合约漏洞类型</p>
                    <a href="#" class="feature-link">
                        <img src="../../assets/svg/arrow_rg.svg" alt="详情">
                    </a>
                </div>
                <div class="feature-item">
                    <img src="../../assets/svg/securitySection2.svg" class="feature-icon">
                    <h3 class="feature-title">储备金审计证明</h3>
                    <p class="feature-description">Abtcoin 是首家承诺 100% 储备金的主流平台</p>
                    <a href="#" class="feature-link">
                        <img src="../../assets/svg/arrow_rg.svg" alt="详情">
                    </a>
                </div>
                <div class="feature-item">
                    <img src="../../assets/svg/securitySection3.svg" class="feature-icon">
                    <h3 class="feature-title">冷/热钱包分离储存</h3>
                    <p class="feature-description">设置合理策略将大部分资产存储于冷钱包以保证资产安全</p>
                    <a href="#" class="feature-link">
                        <img src="../../assets/svg/arrow_rg.svg" alt="详情">
                    </a>
                </div>
            </div>
        </div>

        <div style="background-color: #fafafa; margin-bottom: 100px;">
            <div class="transaction_box">
                <div>
                    <div class="transaction_box_text1">$353.22亿</div>
                    <div class="transaction_box_text2">24 小时交易量</div>
                </div>
                <div>
                    <div class="transaction_box_text1">3,400+</div>
                    <div class="transaction_box_text2">币种</div>
                </div>
                <div>
                    <div class="transaction_box_text1">11.29%</div>
                    <div class="transaction_box_text2">余币宝年化收益</div>
                </div>
                <div>
                    <div class="transaction_box_text1">124%</div>
                    <div class="transaction_box_text2">总储备金率</div>
                </div>
            </div>
        </div>

        <div class="faq-section">
            <h2 class="faq-title">常见问题</h2>
            <div class="faq-list">
                <div class="faq-item" v-for="(faq, idx) in faqList" :key="idx">
                    <button class="faq-header" @click="toggleFaq(idx)">
                        <span class="faq-question">{{ faq.q }}</span>
                        <span class="faq-arrow" :class="{ open: activeFaqIndex === idx }">
                            <img src="../../assets/images/arrow__bottom.png" alt="展开/收起">
                        </span>
                    </button>
                    <div class="faq-content" v-show="activeFaqIndex === idx">
                        <p style="font-size: 16px;" v-html="faq.a"></p>
                    </div>
                </div>
            </div>
        </div>

        <div>
            <CustomerServicePop ref="customerService" />
        </div>

        <!-- <div v-if="isLogin">
            <Chat ref="chat" />
        </div> -->
    </div>
</template>

<script>
import CarouselBanner from '@/views/index/components/CarouselBanner.vue'
import ProductCarousel from '@/views/index/components/ProductCarousel.vue'
import VerticalCarousel from '@/views/index/components/VerticalCarousel.vue'
import AdvantageSwiper from '@/views/index/components/AdvantageSwiper.vue'
import IsLoginStatusView from './components/IsLoginStatusView.vue';
import CustomerServicePop from '@/components/customerServicepop.vue'
import Chat from '@/components/chat.vue'
import GainersRanking from '@/components/GainersRanking.vue'


export default {
    components: {
        CarouselBanner,
        ProductCarousel,
        VerticalCarousel,
        AdvantageSwiper,
        IsLoginStatusView,
        CustomerServicePop,
        GainersRanking,
        Chat
    },

    name: 'IndexView',
    computed: {
        isLogin: function () {
            return this.$store.getters.isLogin;
        },
        isDarkTheme() {
            return this.$store.getters.isDarkTheme;
        },

        themeClass() {
            return this.$store.getters.themeClass;
        }

    },
    data() {
        return {
            activeFaqIndex: '',
            faqList: [
                {
                    q: '什么是加密货币交易所？',
                    a: '加密货币交易所是为用户提供加密货币买卖和交易的平台，支持包括 BTC、ETH、GT  等超过 3,400 种。Abtcoin 是全球领先的加密货币交易所，致力于为用户提供现货、合约、理财等多元化服务及全方位的数字资产交易体验。'
                },
                {
                    q: 'Abtcoin 提供哪些产品？',
                    a: '作为全球领先的加密货币交易平台，Abtcoin 提供丰富的产品和服务，包括现货交易、合约交易、Launchpool、余币宝、链上赚币、机器人以及跟单等，满足不同用户的投资需求。请注意，Abtcoin 可能会限制或禁止来自受限制地区的所有或部分服务。请阅读用户协议了解更多信息。'
                },
                {
                    q: '如何在 Abtcoin 购买比特币和其他加密货币？',
                    a: '在 Abtcoin 购买加密货币仅需注册账户，完成身份验证，充值法币或数字货币，前往交易页面选择所需资产并下单即可。平台支持多种支付方式。关于详细的购买流程，请参阅用户指南'
                },
                {
                    q: '如何追踪加密货币价格？',
                    a: '您可以通过 Abtcoin官网 或 APP 实时查看市场行情，亦可设置价格提醒、自选币种列表，也可以通过 Abtcoin 提供行情工具的和数据面板，随时掌握价格动态。'
                },
                {
                    q: '如何在 Abtcoin 进行加密货币交易？',
                    a: '用户登录 Abtcoin 后，可前往交易和合约页面，挑选想要交易的币种进行买入或卖出。同时，也可使用跟单功能，跟随高阶用户策略自动交易。'
                },
                {
                    q: '为什么选择 Abtcoin 作为您的加密货币交易平台？',
                    a: 'Abtcoin 成立于 2013 年，是全球最早的加密货币交易所之一。平台储备金规模超过 100 亿美元，支持 3,400 多种加密资产交易。注册用户可享受新人福利，是全球超过 4300万 用户的首选平台。'
                }
            ]
        }
    },
    created: function () {
        console.log('执行2')
        const code = this.getCodeFromHash()
        if (code) {
            localStorage.setItem('promotion_code', code);
        }
    },
    methods: {
        onGuideClick(path) {
            this.$router.push(path);
        },
        getCodeFromHash() {
            const hash = this.$route.hash;
            if (hash && hash.includes('?')) {
                const queryString = hash.split('?')[1];
                const params = new URLSearchParams(queryString);
                return params.get('code');
            }
            return null;
        },
        rechargeClick() {
            this.$router.push('/recharge')
        },
        transactionClick() {
            this.$router.push('/swap')
        },
        onCoinSelected(coin) {

        },
        toggleFaq(index) {
            this.activeFaqIndex = this.activeFaqIndex === index ? -1 : index
        },


    },
}


</script>

<style scoped lang="scss">
.banner {
    height: 673px;
    position: relative;
    overflow: hidden;
}

.banner_left {
    position: absolute;
    left: 0;
    top: 0;
    width: 500px;
}

.banner_right {
    position: absolute;
    right: 0;
    bottom: 0;
    width: 500px;
}

.banner_rb {
    position: absolute;
    width: 125px;
    height: 145px;
    margin-left: 414px;
    left: 50%;
    top: 146px;
    z-index: 3;
}

.phone_box {
    width: 310px;
    position: absolute;
    top: 28px;
    left: 24px;
    border-radius: 20px;
}

.phoneList {
    position: absolute;
    width: 310px;
    height: 100%;
    margin-left: 130px;
    top: 70px;
    left: 50%;

}

.banner_phone {
    width: 370px;
    height: 100%;
    margin-left: 130px;
    top: 70px;
    left: 50%;
    position: absolute;
}

.banner_text {
    color: #fff;
    font-weight: 700;
    font-size: 60px;
}

.banner_describe {
    height: 100%;
    max-width: 1200px;
    margin: 0 auto;
    display: flex;
    align-items: center;
    justify-content: space-between;
}

.input_box {
    width: 408px;
    background-color: #fff;
    height: 56px;
    padding: 4px 4px 4px 28px;
    border-radius: 30px;
    margin-top: 20px;
    border: 1px solid #dfe0e2;
}

.start_btn {
    cursor: pointer;
    height: 48px;
    background-color: #0068ff;
    color: #fff;
    padding: 13px 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 30px;
    font-size: 16px;
}

.bg-gradient-to-t {
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    height: 200px;
    background: linear-gradient(to top, rgba(0, 0, 0, 0.8) 0%, transparent 100%);
    z-index: 4;
    pointer-events: none;
}



.arrow-icon {
    font-size: 18px;
    transition: transform 0.3s ease;
}

.start-trading-btn:hover .arrow-icon {
    transform: translateX(4px);
}

.stats-container {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 40px;
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 20px;
}

.stat-item {
    text-align: center;
}

.stat-number {
    font-size: 48px;
    font-weight: 700;
    margin-bottom: 12px;
    line-height: 1;
}

.stat-label {
    font-size: 16px;
    color: #6c757d;
    font-weight: 500;
    line-height: 1.4;
}

@media (max-width: 768px) {
    .stats-section {
        padding: 60px 15px;
    }

    .main-title {
        font-size: 36px;
    }

    .stats-container {
        grid-template-columns: repeat(2, 1fr);
        gap: 40px;
    }

    .stat-number {
        font-size: 36px;
    }
}

@media (max-width: 480px) {
    .main-title {
        font-size: 28px;
    }

    .stats-container {
        grid-template-columns: 1fr;
        gap: 30px;
    }

    .stat-number {
        font-size: 32px;
    }
}

#page2 {
    height: auto;
    min-height: 320px;
    padding: 40px 14%;

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
                background: #1e2834;
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
            -moz-box-shadow: 2px 2px 5px transparent, -2px -2px 4px transparent;
            -webkit-box-shadow: 2px 2px 5px transparent, -2px -2px 4px transparent;
            box-shadow: 2px 2px 5px transparent, -2px -2px 4px transparent;

            .ivu-table {
                .ivu-table-header {
                    .ivu-table-column-center {}
                }

            }
        }
    }
}

.bittap-section {
    box-sizing: border-box;
    max-width: 1200px;
    margin: 0 auto;
    padding-bottom: 120px;
}

.bittap-header {
    margin-top: 50px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 60px;

    @media (max-width: 768px) {
        flex-direction: column;
        gap: 30px;
        text-align: center;
    }
}

.bittap-title {
    font-size: 36px;
    font-weight: 700;
    margin: 0;

    @media (max-width: 768px) {
        font-size: 28px;
    }
}

.start-now-btn {
    background: linear-gradient(135deg, #d4ff00 0%, #b8e000 100%);
    color: #000;
    border: none;
    padding: 16px 32px;
    font-size: 16px;
    font-weight: 600;
    border-radius: 8px;
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    gap: 8px;
    transition: all 0.3s ease;
    box-shadow: 0 4px 15px rgba(212, 255, 0, 0.3);

    &:hover {
        transform: translateY(-2px);
        box-shadow: 0 6px 20px rgba(212, 255, 0, 0.4);

        .arrow-right {
            transform: translateX(4px);
        }
    }
}

.arrow-right {
    font-size: 18px;
    transition: transform 0.3s ease;
}

.feature-cards {
    position: relative;
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
    gap: 30px;

    @media (max-width: 768px) {
        grid-template-columns: 1fr;
        gap: 20px;
    }
}

.feature-card {
    border-radius: 16px;
    overflow: hidden;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
    transition: all 0.3s ease;
    cursor: pointer;

    &:hover {}
}

.card-image {
    width: 100%;
    height: auto;
    overflow: hidden;
    border-radius: 14px;

    img {
        border-radius: 14px;
        width: 100%;
        height: 100%;
        object-fit: cover;
        transition: transform 0.3s ease;
    }
}


.card-content {
    position: absolute;
    padding: 24px;
    color: #fff;
    bottom: 0;
}

.card-title {
    text-align: start;
    font-size: 24px;
    font-weight: 700;
    color: #fff;
}

.card-description {
    font-size: 16px;
    color: #b0b0b0;
    margin: 0;
    line-height: 1.5;
}

.app-section {
    max-width: 1260px;
    margin: 80px auto;
}

.section-header {

    text-align: center;
    margin-bottom: 60px;

    .main-title {
        font-size: 40px;
        font-weight: 700;
        color: #000;
        margin-bottom: 16px;
        line-height: 1.2;

        @media (max-width: 768px) {
            font-size: 32px;
        }
    }

    .subtitle {
        font-size: 20px;
        color: #999;
        margin: 0;
        line-height: 1.5;
    }
}

.content-container {
    --un-bg-opacity: 1;
    background-color: rgba(17, 20, 23, var(--un-bg-opacity));
    border-radius: 24px;
    position: relative;
    overflow: hidden;

    @media (max-width: 768px) {
        padding: 40px 20px;
    }
}

.features-sections {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 60px;
    margin-bottom: 40px;
    padding-left: 128px;
    padding-right: 128px;
    padding-top: 48px;

    @media (max-width: 768px) {
        grid-template-columns: 1fr;
        gap: 30px;
        text-align: center;
    }

    .feature-item {
        .feature-title {
            font-size: 18px;
            font-weight: 600;
            color: #fff;
            line-height: 1.3;
        }

        .feature-desc {
            font-size: 14px;
            --un-text-opacity: 1;
            color: rgba(142, 142, 146, var(--un-text-opacity));

            margin: 0;
        }
    }
}

.phones-container {
    display: flex;
    justify-content: center;
    align-items: flex-end;
    position: relative;

    @media (max-width: 768px) {
        height: 300px;
        gap: -10px;
    }

    .phone-item {
        position: relative;
        transition: transform 0.3s ease;

        img {
            height: 350px;
            width: auto;
            object-fit: contain;

            @media (max-width: 768px) {
                height: 250px;
            }
        }


        &.phone-center {
            transform: translateY(0);
            z-index: 3;

            img {
                height: 380px;

                @media (max-width: 768px) {
                    height: 280px;
                }
            }
        }

        &.phone-right {
            transform: rotate(15deg) translateY(20px);
            z-index: 2;
        }
    }
}

.logged-in {
    .logged-in-content {
        text-align: center;

        .welcome-text {
            margin-bottom: 40px;

            .main-title {
                color: #fff;
                font-size: 48px;
                font-weight: 700;
                line-height: 1.2;
                margin: 0;
            }
        }

        .action-buttons {
            display: flex;
            gap: 20px;
            justify-content: flex-start;

            .action-btn {
                text-align: center;
                display: flex;
                align-items: center;
                gap: 12px;
                width: 192px;
                height: 52px;
                border: none;
                border-radius: 12px;
                font-size: 16px;
                font-weight: 600;
                cursor: pointer;
                transition: all 0.3s ease;


                .btn-icon {
                    margin-left: 1px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    border-radius: 12px;
                    width: 72px;
                    height: 50px;
                    background-color: #000;

                    img {
                        width: 24px;
                        height: 24px;
                    }
                }

                &.deposit-btn {
                    background: linear-gradient(135deg, #d4ff00 0%, #b8e000 100%);
                    color: #000;
                }

                &.trade-btn {
                    border: 1px solid rgba(255, 255, 255, 0.2);
                }
            }
        }
    }
}

.swap.dark-theme {
    background: #1a1a1a !important;
    color: #ffffff !important;
}

.Gainers_item {
    padding: 20px 0;
    border: 1px solid #eaeaed;
    border-radius: 16px;

    .title {
        font-size: 20px;
        font-weight: 700;
    }

    .arrow_rg {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 32px;
        height: 32px;
        border-radius: 9999px;
        border: 1px solid #eaeaed;
        cursor: pointer;

        &:hover {
            background-color: #d0f500;
        }
    }
}

::v-deep(.coin-centers) {
    display: flex;
    align-items: center !important;
    flex-direction: row;
}

::v-deep(.coin-price) {
    margin-right: 20px;
}

.downloadModule {
    width: 1200px;
    margin: 0 auto;
    padding: 0 56px;
    display: flex;
    align-items: center;
    gap: 50px;
    height: 556px;

    .download_title {
        font-size: 48px;
        font-weight: 700;
        color: #000;
    }

    .download_code_box {
        display: flex;
        gap: 20px;

        .download_code {
            width: 182px;
            height: 182px;
            border: 1px solid #dfe0e2;
            border-radius: 20px;
        }

        .download_text_box {
            padding: 25px 0;
            display: flex;
            flex-direction: column;

            .download_text_1 {
                color: #84888c;
                font-size: 16px;
            }

            .download_text_2 {
                font-size: 24px;
                color: #070808;
                font-weight: 600;
            }

        }
    }
}

.newbie-guide-section {
    max-width: 1100px;
    margin: 120px auto;
    padding: 0 20px;

    .guide-main-title {
        font-size: 44px;
        font-weight: 700;
        text-align: center;
        margin-bottom: 70px;
        color: #000;
    }

    .guide-content {
        display: flex;
        align-items: center;
        justify-content: space-between;
    }

    .guide-steps {
        display: flex;
        flex-direction: column;
        gap: 50px;
    }

    .step-item {
        display: flex;
        align-items: flex-start;
        gap: 18px;
    }

    .step-number {
        font-size: 36px;
        font-weight: 700;
        line-height: 1;
        color: #1a1a1a;
        margin-top: 10px;
    }

    .step-details {
        text-align: left;

        .step-title {
            font-size: 20px;
            font-weight: 600;
            margin: 0 0 8px;
            color: #1a1a1a;
        }

        .step-description {
            font-size: 14px;
            color: #999;
            margin: 0 0 20px;
        }

        .step-button {
            border: 1px solid #EAEAEB;
            background-color: #F8F8F8;
            color: #1A1A1A;
            padding: 10px 24px;
            border-radius: 20px;
            cursor: pointer;
            font-weight: 500;
            font-size: 14px;

            &.primary {
                background-color: #0068FF;
                color: #fff;
                border: none;
            }
        }
    }

    .guide-image img {
        max-width: 450px;
    }
}

.security-section {
    max-width: 1200px;
    margin: 120px auto;
    padding: 0 20px;
    text-align: center;

    .section-title {
        font-size: 44px;
        font-weight: 700;
        margin-bottom: 70px;
        color: #000;
    }

    .features-container {
        display: flex;
        justify-content: space-between;
        gap: 40px;
    }

    .feature-item {
        flex: 1;
        text-align: left;
    }

    .feature-icon {
        width: 40px;
        height: 40px;
        margin-bottom: 24px;
    }

    .feature-title {
        font-size: 20px;
        font-weight: 700;
        margin-bottom: 12px;
        color: #000;
    }

    .feature-description {
        font-size: 16px;
        color: #999;
        margin-bottom: 24px;
        height: 40px;
        text-overflow: ellipsis;
    }

    .feature-link {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: 40px;
        height: 40px;
        border-radius: 50%;
        transition: background-color 0.3s ease;

        img {
            width: 20px;
            height: 20px;
        }

        &:hover {
            background-color: #000;

            img {
                filter: invert(1);
            }
        }
    }
}

.transaction_box {
    display: flex;
    align-items: center;
    width: 1100px;
    justify-content: space-between;
    margin: 0 auto;
    padding: 50px 0;
    background-color: #fafafa;

    .transaction_box_text1 {
        font-size: 40px;
        font-weight: 700;
        color: #000;
    }

    .transaction_box_text2 {
        font-size: 18px;
        text-align: center;
        color: #a0a3a7;
    }
}

.faq-section {
    max-width: 1200px;
    margin: 160px auto 60px;
    padding: 0 20px;

    .faq-title {
        text-align: center;
        font-size: 36px;
        font-weight: 700;
        margin-bottom: 36px;
        color: #000;
    }

    .faq-list {
        .faq-item {}

        .faq-header {
            width: 100%;
            padding: 22px 8px;
            background: transparent;
            border: 0;
            outline: none;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: space-between;

            .faq-question {
                font-size: 22px;
                font-weight: 700;
                color: #000;
                text-align: left;
            }

            .faq-arrow {
                display: inline-flex;
                align-items: center;
                justify-content: center;
                width: 32px;
                height: 32px;
                border-radius: 50%;
                transition: all .2s ease;

                img {
                    width: 16px;
                    height: 16px;
                    transition: transform .2s ease;
                }

                &:hover {

                    img {}
                }

                &.open img {
                    transform: rotate(180deg);
                }
            }
        }

        .faq-content {
            padding: 0 8px 22px 8px;
            color: #333;
            line-height: 1.8;

            a {
                color: #0068ff;
                text-decoration: none;
            }
        }
    }
}

.buyCoins_btn {
    flex: 1;
    height: 56px;
    background-color: #0068ff;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 30px;
    color: #fff;
    font-weight: 600;
    font-size: 16px;
    cursor: pointer;
}

.transaction_btn {
    flex: 1;
    height: 56px;
    background-color: #f5f6f7;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 30px;
    font-weight: 600;
    font-size: 16px;
    cursor: pointer;
}
</style>