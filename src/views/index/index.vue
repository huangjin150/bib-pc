<template>
    <div class="dark-home">
        <div class="banner" :class="themeClass" v-if="!isLogin">
            <div class="banner_describe">
                <div class="banner_left_content">
                    <div style="font-size: 54px; color: #fff; margin-bottom: 5px; letter-spacing: 2px;">
                        福利尽在掌握
                    </div>
                    <div
                        style="font-size: 54px; color: #fff; margin-bottom: 40px; letter-spacing: 2px; display: inline-block;  padding: 0 10px;">
                        奖励真实可见
                    </div>
                    <router-link to="/login" style="text-decoration: none;">
                        <div
                            style="background-color: #fff; color: #000; font-size: 18px; font-weight: 600; padding: 15px 48px; border-radius: 8px; display: inline-block; cursor: pointer;">
                            登录/注册
                        </div>
                    </router-link>
                </div>
                <div class="banner_right_image"> </div>
            </div>
        </div>

        <div class="banner_logged_in" :class="themeClass" v-else>
            <div class="banner_describe_logged_in">
                <div class="banner_left_content" style="margin-left: 50px;">
                    <div
                        style="font-size: 52px;  color: #fff; margin-bottom: 30px; line-height: 1.4; letter-spacing: 1px; max-width: 540px;">
                        限时活动
                    </div>
                    <div
                        style="font-size: 40px;  color: #fff; margin-bottom: 30px; line-height: 1.4; letter-spacing: 1px; max-width: 540px;">
                        注册立得100USDT手续费减免券
                    </div>

                    <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 30px;">
                        <span
                            style="color: #fff; font-size: 16px; font-weight: 600; display: flex; align-items: center;">
                            <span style="margin-right: 8px; font-size: 20px;">🎁</span>新用户专享
                        </span>
                    </div>

                    <div @click="transactionClick"
                        style="background-color: #fff; width: 100%; color: #000; font-size: 18px;  padding: 16px 0; border-radius: 8px; cursor: pointer; text-align: center;  margin-bottom: 40px; transition: opacity 0.3s;"
                        onmouseover="this.style.opacity='0.9'" onmouseout="this.style.opacity='1'">
                        即刻交易
                    </div>

                    <div style="display: flex; gap: 16px;">
                        <div style="width: 50px; height: 50px; border: 1px solid #333; border-radius: 8px; display: flex; justify-content: center; align-items: center; cursor: pointer; background-color: rgba(255,255,255,0.05); transition: all 0.3s;"
                            onmouseover="this.style.borderColor='#888'" onmouseout="this.style.borderColor='#333'">
                            <svg width="35" height="35" viewBox="0 0 24 24" fill="#fff">
                                <path
                                    d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.78 1.18-.19 2.31-.88 3.5-.84 1.58.11 2.81.7 3.58 1.84-3.02 1.76-2.5 5.76.28 6.84-.71 1.81-1.74 3.39-2.44 4.35zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
                            </svg>
                        </div>
                        <div style="width: 50px; height: 50px; border: 1px solid #333; border-radius: 8px; display: flex; justify-content: center; align-items: center; cursor: pointer; background-color: rgba(255,255,255,0.05); transition: all 0.3s;"
                            onmouseover="this.style.borderColor='#888'" onmouseout="this.style.borderColor='#333'">
                            <svg width="35" height="35" viewBox="0 0 24 24" fill="#fff">
                                <path
                                    d="M17.523 15.3414c-.5511 0-.9993-.4486-.9993-.9997s.4482-.9993.9993-.9993c.5511 0 .9993.4482.9993.9993.0004.5511-.4482.9997-.9993.9997zm-11.046 0c-.5511 0-.9993-.4486-.9993-.9997s.4482-.9993.9993-.9993c.5511 0 .9993.4482.9993.9993 0 .5511-.4482.9997-.9993.9997zm11.4045-6.02l1.9973-3.4592c.1158-.201.0467-.4584-.1545-.5745-.2006-.1154-.4576-.0463-.5741.1545l-2.0418 3.5361c-1.3533-.6182-2.8893-.9645-4.5097-.9645s-3.156.3463-4.5097.9645l-2.0418-3.5361c-.1165-.2006-.3735-.2695-.5741-.1545-.2009.1162-.2702.3735-.1545.5745l1.9973 3.4592c-2.6133 1.4426-4.3828 4.0955-4.5772 7.151h19.7196c-.1943-3.0555-1.9635-5.7084-4.5768-7.151z" />
                            </svg>
                        </div>
                    </div>
                </div>
                <div class="banner_right_image_logged_in"> </div>
            </div>
        </div>

        <div class="market-section">
            <h2 class="market-title">热门币对</h2>
            <Market />
        </div>

        <div v-if="!isLogin" class="newbie-guide-section">
            <h2 class="guide-main-title" style="color: #fff;">新手指南</h2>
            <div class="guide-content">
                <div class="guide-steps">
                    <div class="step-item">
                        <div class="step-number" style="color: #fff;">1</div>
                        <div class="step-details">
                            <h3 class="step-title" style="color: #fff;">创建账户</h3>
                            <p class="step-description" style="color: #aaa;">注册并领取新人独家奖励</p>
                            <button class="step-button primary" @click="onGuideClick('/login')">即刻注册 →</button>
                        </div>
                    </div>
                    <div class="step-item">
                        <div class="step-number" style="color: #fff;">2</div>
                        <div class="step-details">
                            <h3 class="step-title" style="color: #fff;">快捷买币</h3>
                            <p class="step-description" style="color: #aaa;">简单几步购买加密货币</p>
                            <button class="step-button" style="background-color: #333; color: #fff; border-color: #555;"
                                @click="onGuideClick('/buy')">即刻买币 →</button>
                        </div>
                    </div>
                    <div class="step-item">
                        <div class="step-number" style="color: #fff;">3</div>
                        <div class="step-details">
                            <h3 class="step-title" style="color: #fff;">开始交易</h3>
                            <p class="step-description" style="color: #aaa;">买卖数字货币、轻松跟单，探索更多玩法</p>
                            <button class="step-button" style="background-color: #333; color: #fff; border-color: #555;"
                                @click="onGuideClick('/swap')">即刻交易 →</button>
                        </div>
                    </div>
                </div>
                <div class="guide-image">
                    <img src="../../assets/images/gift-light.d.webp" alt="新手指南" style="filter: brightness(0.8);">
                </div>
            </div>
        </div>
        <div class="security-section">
            <h2 class="section-title" style="color: #fff;">为您的安全交易保驾护航</h2>
            <div class="features-container">
                <div class="feature-item">
                    <img src="../../assets/svg/securitySection1.svg" class="feature-icon" style="filter: invert(1);">
                    <h3 class="feature-title" style="color: #fff;">智能合约安全</h3>
                    <p class="feature-description" style="color: #aaa;">合约权限审计与链上监控, 覆盖大量合约漏洞类型</p>
                    <a href="#" class="feature-link">
                        <img src="../../assets/svg/arrow_rg.svg" alt="详情" style="filter: invert(1);">
                    </a>
                </div>
                <div class="feature-item">
                    <img src="../../assets/svg/securitySection2.svg" class="feature-icon" style="filter: invert(1);">
                    <h3 class="feature-title" style="color: #fff;">储备金审计证明</h3>
                    <p class="feature-description" style="color: #aaa;">Bibcoin 是首家承诺 100% 储备金的主流平台</p>
                    <a href="#" class="feature-link">
                        <img src="../../assets/svg/arrow_rg.svg" alt="详情" style="filter: invert(1);">
                    </a>
                </div>
                <div class="feature-item">
                    <img src="../../assets/svg/securitySection3.svg" class="feature-icon" style="filter: invert(1);">
                    <h3 class="feature-title" style="color: #fff;">冷/热钱包分离储存</h3>
                    <p class="feature-description" style="color: #aaa;">设置合理策略将大部分资产存储于冷钱包以保证资产安全</p>
                    <a href="#" class="feature-link">
                        <img src="../../assets/svg/arrow_rg.svg" alt="详情" style="filter: invert(1);">
                    </a>
                </div>
            </div>
        </div>

        <div style="background-color: #111; margin-bottom: 100px;">
            <div class="transaction_box" style="background-color: #111;">
                <div>
                    <div class="transaction_box_text1" style="color: #fff;">$353.22亿</div>
                    <div class="transaction_box_text2">24 小时交易量</div>
                </div>
                <div>
                    <div class="transaction_box_text1" style="color: #fff;">3,400+</div>
                    <div class="transaction_box_text2">币种</div>
                </div>
                <div>
                    <div class="transaction_box_text1" style="color: #fff;">11.29%</div>
                    <div class="transaction_box_text2">余币宝年化收益</div>
                </div>
                <div>
                    <div class="transaction_box_text1" style="color: #fff;">124%</div>
                    <div class="transaction_box_text2">总储备金率</div>
                </div>
            </div>
        </div>

        <div class="faq-section">
            <h2 class="faq-title" style="color: #fff;">常见问题</h2>
            <div class="faq-list">
                <div class="faq-item" v-for="(faq, idx) in faqList" :key="idx">
                    <button class="faq-header" @click="toggleFaq(idx)">
                        <span class="faq-question" style="color: #fff;">{{ faq.q }}</span>
                        <span class="faq-arrow" :class="{ open: activeFaqIndex === idx }">
                            <img src="../../assets/images/arrow__bottom.png" alt="展开/收起" style="filter: invert(1);">
                        </span>
                    </button>
                    <div class="faq-content" v-show="activeFaqIndex === idx">
                        <p style="font-size: 16px; color: #ccc;" v-html="faq.a"></p>
                    </div>
                </div>
            </div>
        </div>

        <div v-if="!isLogin" class="bottom-banner-section">
            <div class="bottom-text">福利尽在掌握，奖励真实可见。</div>
            <router-link to="/login" class="bottom-btn-link">
                <div class="bottom-btn">登录/注册</div>
            </router-link>
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
import Market from './components/Market.vue'


export default {
    components: {
        CarouselBanner,
        ProductCarousel,
        VerticalCarousel,
        AdvantageSwiper,
        IsLoginStatusView,
        CustomerServicePop,
        Chat,
        Market
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
                    a: '加密货币交易所是为用户提供加密货币买卖和交易的平台，支持包括 BTC、ETH、GT  等超过 3,400 种。Bibcoin 是全球领先的加密货币交易所，致力于为用户提供现货、合约、理财等多元化服务及全方位的数字资产交易体验。'
                },
                {
                    q: 'Bibcoin 提供哪些产品？',
                    a: '作为全球领先的加密货币交易平台，Bibcoin 提供丰富的产品和服务，包括现货交易、合约交易、Launchpool、余币宝、链上赚币、机器人以及跟单等，满足不同用户的投资需求。请注意，Bibcoin 可能会限制或禁止来自受限制地区的所有或部分服务。请阅读用户协议了解更多信息。'
                },
                {
                    q: '如何在 Bibcoin 购买比特币和其他加密货币？',
                    a: '在 Bibcoin 购买加密货币仅需注册账户，完成身份验证，充值法币或数字货币，前往交易页面选择所需资产并下单即可。平台支持多种支付方式。关于详细的购买流程，请参阅用户指南'
                },
                {
                    q: '如何追踪加密货币价格？',
                    a: '您可以通过 Bibcoin官网 或 APP 实时查看市场行情，亦可设置价格提醒、自选币种列表，也可以通过 Bibcoin 提供行情工具的和数据面板，随时掌握价格动态。'
                },
                {
                    q: '如何在 Bibcoin 进行加密货币交易？',
                    a: '用户登录 Bibcoin 后，可前往交易和合约页面，挑选想要交易的币种进行买入或卖出。同时，也可使用跟单功能，跟随高阶用户策略自动交易。'
                },
                {
                    q: '为什么选择 Bibcoin 作为您的加密货币交易平台？',
                    a: 'Bibcoin 成立于 2013 年，是全球最早的加密货币交易所之一。平台储备金规模超过 100 亿美元，支持 3,400 多种加密资产交易。注册用户可享受新人福利，是全球超过 4300万 用户的首选平台。'
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
.market-section {
    max-width: 1440px;
    margin: 80px auto;
    padding: 0 20px;

    .market-title {
        font-size: 36px;
        font-weight: 700;
        color: #fff;
        text-align: center;
        margin-bottom: 40px;
    }
}

.dark-home {
    background-color: #000;
    color: #fff;
    min-height: 100vh;
}

.bottom-banner-section {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 80px 0 120px;
    background: linear-gradient(to bottom, #000 0%, #2b3a00 100%);
    text-align: center;

    .bottom-text {
        font-size: 32px;
        font-weight: bold;
        color: #fff;
        margin-bottom: 30px;
    }

    .bottom-btn-link {
        text-decoration: none;
    }

    .bottom-btn {
        background-color: #d4ff00;
        color: #000;
        font-size: 16px;
        font-weight: 600;
        padding: 12px 60px;
        border-radius: 8px;
        cursor: pointer;
        transition: opacity 0.3s;

        &:hover {
            opacity: 0.9;
        }
    }
}

.banner {
    padding: 50px 20px;
    position: relative;
    overflow: hidden;
}

.banner_logged_in {
    padding: 0 20px;
    position: relative;
    overflow: hidden;
    background-image: url(../../assets/images/bg-pc.png);
    background-size: cover;
    background-position: center;
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
    padding: 40px 240px;
    margin: 0 auto;
    display: flex;
    align-items: center;
    justify-content: space-between;
}

.banner_describe_logged_in {
    padding-top: 100px;
    padding-bottom: 50px;
    max-width: 1440px;
    height: 100%;
    margin: 0 auto;
    display: flex;
    align-items: center;
    justify-content: space-between;
}

.input_box {
    width: 408px;
    background-color: #1a1a1a;
    height: 56px;
    padding: 4px 4px 4px 28px;
    border-radius: 30px;
    margin-top: 20px;
    border: 1px solid #333;
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
        color: #fff;
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
    border: 1px solid #333;
    background-color: #111;
    border-radius: 16px;

    .title {
        font-size: 20px;
        font-weight: 700;
        color: #fff;
    }

    .arrow_rg {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 32px;
        height: 32px;
        border-radius: 9999px;
        border: 1px solid #333;
        cursor: pointer;

        &:hover {
            background-color: #d0f500;
            border-color: #d0f500;
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

::v-deep(.ivu-table-cell) {
    padding: 0 !important;
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
        color: #fff;
    }

    .download_code_box {
        display: flex;
        gap: 20px;

        .download_code {
            width: 182px;
            height: 182px;
            border: 1px solid #333;
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
        color: #fff;
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
        color: #fff;
        margin-top: 10px;
    }

    .step-details {
        text-align: left;

        .step-title {
            font-size: 20px;
            font-weight: 600;
            margin: 0 0 8px;
            color: #fff;
        }

        .step-description {
            font-size: 14px;
            color: #999;
            margin: 0 0 20px;
        }

        .step-button {
            border: 1px solid #555;
            background-color: #333;
            color: #fff;
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
        color: #fff;
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
        color: #fff;
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
    background-color: #111;

    .transaction_box_text1 {
        font-size: 40px;
        font-weight: 700;
        color: #fff;
    }

    .transaction_box_text2 {
        font-size: 18px;
        text-align: center;
        color: #a0a3a7;
    }
}

.faq-section {
    max-width: 1200px;
    margin: 160px auto 0;
    padding: 0 20px 60px 20px;

    .faq-title {
        text-align: center;
        font-size: 36px;
        font-weight: 700;
        margin-bottom: 36px;
        color: #fff;
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
                color: #fff;
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
            color: #ccc;
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
    background-color: #333;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 30px;
    font-weight: 600;
    font-size: 16px;
    color: #fff;
    cursor: pointer;
}

.banner_right_image {
    width: 390px;
    height: 350px;
    background: url(../../assets/images/illustration-1.png) no-repeat;
    background-size: cover;
    background-position: 50%;
}

.banner_right_image_logged_in {
    width: 500px;
    height: 400px;
    background: url(../../assets/images/illustration-1.png) no-repeat;
    background-size: contain;
    background-position: center;
}


.panel-box {}
</style>