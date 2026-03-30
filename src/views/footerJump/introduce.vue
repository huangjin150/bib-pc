<template>
    <div class="introduce-page dark-skin">
        <div class="banner">
            <div class="flex banner_describe">
                <div class="logged-in">
                    <div class="logged-in-content">
                        <div class="welcome-text">
                            <h1 class="main-titles">Abtcoin</h1>
                            <div class="main-title">安全，快捷，轻松交易超过 3,400 种加密货币</div>
                        </div>
                        <button v-if="!isLogin" @click="loginClick" class="action-buttons">
                            联系我们
                        </button>
                    </div>
                    <div class="banner_describe_left">
                        <div>
                            <div class="banner_left_title">$226.01 <span style="font-size: 16px;">亿</span></div>
                            <div>24 小时交易量</div>
                        </div>
                        <div>
                            <div class="banner_left_title">4300 <span style="font-size: 16px;">万</span></div>
                            <div>全球用户</div>
                        </div>
                        <div>
                            <div class="banner_left_title">11.23%</div>
                            <div>余币宝理财年化</div>
                        </div>
                    </div>
                </div>
                <div class="phoneList">
                    <img class="phone_box" src="../../assets/svg/introduce_banner.svg" alt="">
                </div>
            </div>
        </div>

        <div class="about-section">
            <div class="container">
                <h2 class="section-title">关于我们</h2>
                <p class="about-text">
                    创立于 2013 年，全球真实交易量顶尖的加密货币交易所，为超过 4300 万用户提供安全、可靠、真实、透明的数字资产交易服务。
                </p>
            </div>
            <div class="container_flex">
                <div class="container_flex_left">
                    <div class="container_flex_left_top">
                        <div class="container_flex_left_top_1">世界一流</div>
                        <div class="container_flex_left_top_2">支持 3,400+ 数字资产，覆盖广泛的主流与新兴币种，满足多样化投资需求。</div>
                    </div>
                    <div class="container_flex_left_bottom">
                        <div class="container_flex_left_bottom_1">全球首家</div>
                        <div class="container_flex_left_bottom_2">首家承诺 100% 储备金，超行业基准 20%+。储备金总量位列全球顶尖</div>
                        <div style="display: flex; justify-content: flex-end;"><img style="width: 160px;height: 160px;"
                                src="../../assets/images/banner-proof-dark.webp" alt=""></div>
                    </div>
                </div>
                <div class="container_flex_middle">
                    <div class="">
                        <div class="container_flex_middle_title">全球领先</div>
                        <div class="container_flex_middle_text">现货交易量及流动性排名顶尖，综合实力领先。</div>
                    </div>
                    <div style="display: flex; justify-content: flex-end;"><img
                            style="max-width: 100%; height: 314px; margin:  0  auto;"
                            src="../../assets/images/top2-dark.webp" alt=""></div>
                </div>
                <div class="container_flex_right">
                    <div>
                        <div class="container_flex_right_title">全网最快</div>
                        <div class="container_flex_right_text">新币、热币、极速上线各类潜力币种</div>
                    </div>
                    <div style="display: flex; justify-content: flex-end;"><img style="width: 300px;height: 218px;"
                            src="../../assets/images/fast-light.webp" alt=""></div>
                </div>
            </div>
        </div>


        <div class="vision-section">
            <div class="container">
                <EcosystemCarousel :title="'我们的生态'" :items="ecosystemItems" />
            </div>
        </div>

        <div class="vision-section">
            <div class="container">
                <SecurityAssurance />
            </div>
        </div>

        <div class="container" style="padding-bottom: 50px;">
            <MediaTestimonials :items="mediaReviews" />
        </div>
    </div>
</template>

<script>
import EcosystemCarousel from './components/EcosystemCarousel.vue';
import SecurityAssurance from './components/SecurityAssurance.vue';
import MediaTestimonials from './components/MediaTestimonials.vue';

export default {
    name: 'IntroduceView',
    components: {
        EcosystemCarousel,
        SecurityAssurance,
        MediaTestimonials
    },
    computed: {
        isLogin: function () {
            return this.$store.getters.isLogin;
        },
        allExpanded() {
            return this.values.every(value => value.expanded);
        }
    },
    data() {
        return {
            values: [
                {
                    title: '安全',
                    icon: require('../../assets/svg/introduce_b_list1.svg'),
                    description: '用户资产的安全是我们的最高优先级。我们已实施严格的安全措施，确保用户的数字资产免受任何潜在威胁。',
                    expanded: false
                },
                {
                    title: '透明与诚信',
                    icon: require('../../assets/svg/introduce_b_list2.svg'),
                    description: '我们坚持透明度和诚信原则，确保所有交易信息对用户完全公开，并保证平台运营符合所有适用的法律法规。',
                    expanded: false
                },
                {
                    title: '创新与进步',
                    icon: require('../../assets/svg/introduce_b_list3.svg'),
                    description: '我们坚持透明度和诚信原则，持续向用户公开交易信息，并确保平台运营符合所有适用的法律法规。',
                    expanded: false
                },
                {
                    title: '以用户为中心',
                    icon: require('../../assets/svg/introduce_b_list4.svg'),
                    description: '我们不断追求创新，致力于提升交易体验，并为用户提供更先进的功能。我们鼓励团队成员持续学习和进步，以适应行业的变化和发展。',
                    expanded: false
                },
                {
                    title: '我们的服务',
                    icon: require('../../assets/svg/introduce_b_list5.svg'),
                    description: '我们提供多种数字资产的现货和衍生品交易，包括比特币、以太坊及其他加密货币，并通过先进技术和严格的安全措施，确保交易平台的安全性和稳定性。',
                    expanded: false
                },
                {
                    title: '专业客户服务',
                    icon: require('../../assets/svg/introduce_b_list6.svg'),
                    description: '我们的客户服务团队由经验丰富的专业人士组成，提供 24/7 全天候支持和帮助，以满足用户需求。',
                    expanded: false
                }
            ],
            ecosystemItems: [
                {
                    title: 'Abtcoin 交易平台',
                    desc: '全球 TOP3 加密货币交易所，拥有超过 3,400 种加密货币。24 小时现货交易量排名全球第二，支持 BTC、ETH、DOGE 等热门资产，提供现货交易、合约交易、杠杆交易以及理财等全方位产品与服务。',
                    icon: require('../../assets/svg/introduction_svg1.svg')
                },
                {
                    title: 'Abtcoin Layer',
                    desc: '基于 OP Stack 构建的高性能二层网络，完全兼容以太坊 EVM，可实现每秒 5,700 笔以上交易，区块生成时间仅 1 秒，交易费用远低于多数现有二层网络，为 Web3 应用提供更快、更安全、更经济的基础设施。',
                    icon: require('../../assets/svg/introduction_svg2.svg')
                },
                {
                    title: 'Abtcoin Perp DEX',
                    desc: 'Abtcoin 自主研发的去中心化永续合约交易所，基于高性能二层网络 Abtcoin Layer，内置高性能撮合引擎，支持高并发处理与低延迟交易，打造接近专业 CEX 的使用体验。',
                    icon: require('../../assets/svg/introduction_svg3.svg')
                },
                {
                    title: 'Abtcoin Fun',
                    desc: 'Abtcoin 生态首个专为 Meme 代币设计的发射平台，聚焦“零代码发币+全场景交易”，旨在为 Web3 创作者和投资者打造一条从代币发行到流通的完整生态路径。',
                    icon: require('../../assets/svg/introduction_svg4.svg')
                },
                {
                    title: 'Abtcoin Alpha',
                    desc: '专注于早期优质链上项目的交易平台，融合 CEX 的便捷体验与 DEX 的链上自由。用户可直接使用交易所的 USDT 无缝购买链上热门代币，轻松探索 Web3 潜力项目。',
                    icon: require('../../assets/svg/introduction_svg5.svg')
                },
                {
                    title: 'Abtcoin Travel',
                    desc: 'Abtcoin 旗下全新一站式出行预订平台，覆盖 190+ 国家、100 万+ 酒店及 150 家航空公司，支持多种加密支付，Abtcoin 用户专享 5% 折扣，让出行更轻松、更便捷。',
                    icon: require('../../assets/svg/introduction_svg6.svg')
                },
                {
                    title: 'Abtcoin Pay',
                    desc: '从收单、下发到法币出入金，一站式加密支付服务，快速、安全，驱动数字支付融入更多场景。',
                    icon: require('../../assets/svg/introduction_svg6.svg')
                },
                {
                    title: 'Abtcoin Labs',
                    desc: '用专业点燃创意，为初创项目提供孵化支持与运营资源，陪伴每一个创新想法从起步走向成功。',
                    icon: require('../../assets/svg/introduction_svg6.svg')
                },
                {
                    title: 'Abtcoin Life',
                    desc: '数字货币消费与娱乐的一站式平台，集成 Abtcoin Gift Card、Abtcoin Pay 支付、C2C 转账等核心功能。',
                    icon: require('../../assets/svg/introduction_svg6.svg')
                },
                {
                    title: 'Abtcoin Ventures',
                    desc: '聚焦区块链与金融科技基础设施投资的加密风投基金，赋能未来，推动数字经济的创新与变革。',
                    icon: require('../../assets/svg/introduction_svg6.svg')
                },
                {
                    title: 'Abtcoin Learn & Research',
                    desc: 'Abtcoin Learn 精心打造区块链知识教育平台，Abtcoin Research 深度解析行业趋势，呈现前沿洞察与深刻见解。',
                    icon: require('../../assets/svg/introduction_svg6.svg')
                },
                {
                    title: 'Abtcoin Web3',
                    desc: 'Abtcoin Web3 是 Abtcoin 生态的全新链上入口，集钱包、跨链、交易、空投、赚币与 DApp 于一体，构建开放互联的 Web3 全域生态。',
                    icon: require('../../assets/svg/introduction_svg6.svg')
                },
                {
                    title: 'Abtcoin Post',
                    desc: '加密用户专属社交平台，聚焦热点资讯、洞悉行业脉搏、链接全球加密用户，发现加密价值。',
                    icon: require('../../assets/svg/introduction_svg6.svg')
                },
                {
                    title: 'Abtcoin Live',
                    desc: 'Abtcoin 官方直播平台，汇聚全球行业前沿分析师，为加密用户提供专业的市场趋势分析、交易策略和投资机会解读等内容。',
                    icon: require('../../assets/svg/introduction_svg6.svg')
                },
                {
                    title: 'Abtcoin Charity',
                    desc: '全球性非盈利慈善基金组织，致力于将区块链技术与传统公益相结合，打造透明、高效、可持续的慈善生态。',
                    icon: require('../../assets/svg/introduction_svg6.svg')
                },

            ],
            mediaReviews: [
                {
                    quote: 'Abtcoin 是 Winkrypto 值得信赖的合作伙伴。我们见证了 Abtcoin 团队不断的努力和奉献。合约产品是众多 CEX 和 DEX 平台核心竞争力的关键特征之一。 Abtcoin 通过提供稳定的交互用户体验，是市场波动时的完美主机。Abtcoin 上架的许多主流加密资产都具有高流动性，并提供有竞争力的价格。',
                    img_icon: require('@/assets/images/aboutUs_icon.png'),
                    source: 'Media',
                    logo: null
                },
                {
                    quote: '全球数字金融联合主席 Lawrence Wintermeyer 评论说：“全球加密和数字资产领域继续快速成熟我们看到数字金融得到更广泛的采用。我们很高兴 Abtcoin 加入 GDF 赞助人委员会，作为该领域的领先创新者，我们期待与他们合作，参与和促进 GDF 在社区中的知识共享计划。”',
                    img_icon: require('@/assets/images/aboutUsIcon2.png'),
                    source: 'Media',
                    logo: null
                },
                {
                    quote: 'Abtcoin 将无数的加密货币和市场汇集在一个地方。几乎有太多的加密货币可供选择，甚至有更多的市场可供选择。当您打开“市场”选项卡时，左侧会打开一个加密货币列表，您可以搜索您的首选货币。',
                    img_icon: require('@/assets/images/aboutUsIcon3.png'),
                    source: 'Media',
                    logo: null
                },
                {
                    quote: '我们一直在 Abtcoin 上进行愉快的交易，并高度重视我们的业务关系并期待继续下去。',
                    img_icon: require('@/assets/images/aboutUsIcon4.png'),
                    source: 'Media',
                    logo: null
                },
                {
                    quote: 'Tower Research Capital 很高兴成为 Abtcoin 的一部分，并为交易所的交易币组合提供流动性',
                    img_icon: require('@/assets/images/aboutUsIcon5.png'),
                    source: 'Media',
                    logo: null
                },
                {
                    quote: 'Banxa 的整个团队很自豪能与 Abtcoin 合作，以推进我们将数字资产推向世界的共同使命。',
                    img_icon: require('@/assets/images/aboutUsIcon6.png'),
                    source: 'Media',
                    logo: null
                },
                {
                    quote: '我们是 Abtcoin 的忠实拥护者，见证了它在过去几年中不断攀升的排名，并达到了超过 100 亿美元的日交易量（有时）。作为一个交易平台，设计师们做了了不起的工作，引入了友好的质押服务、期货交易、保证金交易、期权交易、以友好的利率借贷，以及一个包容性的“启动”计划，以支持新兴数字资产的兴起。',
                    img_icon: require('@/assets/images/aboutUsIcon7.png'),
                    source: 'Media',
                    logo: null
                },
                {
                    quote: '据 CoinMarketCap.com 称，Abtcoin 让用户可以访问超过 1500 种不同的代币，这对于寻找不太常见的山寨币的高级加密交易者来说是更好的选择。',
                    img_icon: require('@/assets/images/aboutUsIcon8.png'),
                    source: 'Media',
                    logo: null
                },
            ]
        }
    },
    created: function () { },
    methods: {
        toggleValue(index) {
            this.values.forEach(value => {
                value.expanded = !value.expanded;
            });
        },
        loginClick() {
            this.$router.push({ path: '/login', query: { tab: 'register' } })
        }
    }
}
</script>

<style scoped lang="scss">
/* 强制黑色背景布局覆盖 */
.dark-skin {
    background-color: #000 !important;
    color: #fff !important;
    min-height: 100vh;
}

.dark-skin .banner_describe .logged-in .banner_describe_left .banner_left_title {
    color: #fff !important;
}

.dark-skin .banner_describe .logged-in .main-title {
    color: #888 !important;
}

.dark-skin .main-titles {
    color: #fff !important;
}

.dark-skin .banner_describe .logged-in .action-buttons {
    background-color: #d4ff00 !important;
    color: #000 !important;
}

.dark-skin .about-section {
    background-color: #000 !important;
}

.dark-skin .about-section .section-title {
    color: #fff !important;
}

.dark-skin .about-section .about-text {
    color: #888 !important;
}

.dark-skin .container_flex_left_top,
.dark-skin .container_flex_left_bottom,
.dark-skin .container_flex_middle,
.dark-skin .container_flex_right {
    background-color: #0c0c0c !important;
    border: 1px solid #1a1a1a !important;
}

.dark-skin .container_flex_left_top_1,
.dark-skin .container_flex_left_bottom_1,
.dark-skin .container_flex_middle_title,
.dark-skin .container_flex_right_title {
    color: #fff !important;
}

.dark-skin .container_flex_left_top_2,
.dark-skin .container_flex_left_bottom_2,
.dark-skin .container_flex_middle_text,
.dark-skin .container_flex_right_text {
    color: #888 !important;
}

.dark-skin .vision-section {
    background-color: #000 !important;
}

/* EcosystemCarousel 组件覆盖 */
.dark-skin ::v-deep .ecosystem__title {
    color: #fff !important;
}

.dark-skin ::v-deep .eco-card {
    background-color: #0c0c0c !important;
    border-color: #1a1a1a !important;
}

.dark-skin ::v-deep .eco-card__title {
    color: #fff !important;
}

.dark-skin ::v-deep .eco-card__desc {
    color: #888 !important;
}

.dark-skin ::v-deep .icon-placeholder {
    background: #1a1a1a !important;
    border-color: #333 !important;
}

.dark-skin ::v-deep .eco-btn {
    background-color: #1a1a1a !important;
    border-color: #333 !important;
}

.dark-skin ::v-deep .eco-btn::after {
    border-color: #fff !important;
}

.dark-skin ::v-deep .eco-btn:hover {
    background-color: #d4ff00 !important;
    border-color: #d4ff00 !important;
}

.dark-skin ::v-deep .eco-btn:hover::after {
    border-color: #000 !important;
}

/* SecurityAssurance 组件覆盖 */
.dark-skin ::v-deep .security-assurance-title {
    color: #fff !important;
}

.dark-skin ::v-deep .sa-title {
    color: #fff !important;
}

.dark-skin ::v-deep .sa-desc {
    color: #888 !important;
}

/* MediaTestimonials 组件覆盖 */
.dark-skin ::v-deep .media__title {
    color: #fff !important;
}

.dark-skin ::v-deep .media__card {
    background-color: #0c0c0c !important;
    border-color: #1a1a1a !important;
}

.dark-skin ::v-deep .media__quote {
    color: #fff !important;
}

.dark-skin ::v-deep .brand-text {
    color: #fff !important;
}

.dark-skin ::v-deep .media__source {
    color: #888 !important;
}

.dark-skin ::v-deep .media-btn {
    background-color: #1a1a1a !important;
    border-color: #333 !important;
}

.dark-skin ::v-deep .media-btn::after {
    border-color: #fff !important;
}

.dark-skin ::v-deep .media-btn:hover {
    background-color: #d4ff00 !important;
    border-color: #d4ff00 !important;
}

.dark-skin ::v-deep .media-btn:hover::after {
    border-color: #000 !important;
}

.dark-skin ::v-deep .media__dots .dot {
    background-color: #333 !important;
}

.dark-skin ::v-deep .media__dots .dot.active {
    background-color: #d4ff00 !important;
}

.dark-skin .banner_describe .logged-in .banner_describe_left>div>div:nth-child(2) {
    color: #888 !important;
}

.introduce-page {
    padding-top: 50px;
    background-color: transparent;
}

.banner {
    position: relative;
    overflow: hidden;
    background-size: 100%;
    background-repeat: no-repeat;
    background-position: center bottom;
}

.banner_text {
    color: #fff;
    font-weight: 700;
    font-size: 60px;
}

.banner_describe {
    width: 100%;
    max-width: 1200px;
    margin: 0 auto;
    display: flex;
    align-items: center;
    padding-bottom: 50px;

    .logged-in {
        flex: 0.8;

        .banner_describe_left {
            margin-top: 80px;
            display: flex;
            align-items: center;
            gap: 40px;

            .banner_left_title {
                font-size: 26px;
                color: #000;
                font-weight: 700;
            }
        }

        .main-title {
            --un-text-opacity: 1;
            color: #262933;
            font-size: 16px;
            text-align: start;
            margin-top: 10px;
        }

        .action-buttons {
            width: 182px;
            background-color: #000;
            color: #fff;
            padding: 11px 16px;
            border-radius: 99999px;
            line-height: 12px;
            font-size: 13px;
            margin-top: 45px;
            cursor: pointer;
        }
    }

    .phoneList {
        display: flex;
        justify-content: flex-end;
        flex: 1.2;

        .phone_box {
            width: 400px;
            height: 300px;
        }
    }
}

.main-titles {
    color: #000;
    text-align: start;
    font-size: 40px;
    font-weight: 700;
    font-stretch: expanded;
    line-height: 1.2;
}

.about-section {
    padding: 60px 0;
    background-color: transparent;

    .container_flex {
        width: 1200px;
        height: 434px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 24px;
        margin: 0 auto;

        .container_flex_left {
            height: 100%;
            display: flex;
            flex-direction: column;
            gap: 24px;

            .container_flex_left_top {
                background-color: transparent;
                border: none;
                padding: 20px;
                border-radius: 8px;

                .container_flex_left_top_1 {
                    color: #262933;
                    font-size: 20px;
                    margin-bottom: 12px;
                }

                .container_flex_left_top_2 {
                    height: 63px;
                    line-height: 1.5;
                    color: #8e949e;
                }
            }

            .container_flex_left_bottom {
                background-color: transparent;
                flex: 1 1 0%;
                border: none;
                padding: 20px;
                border-radius: 8px;

                .container_flex_left_bottom_1 {
                    color: #262933;
                    font-size: 20px;
                    margin-bottom: 12px;
                }

                .container_flex_left_bottom_2 {
                    color: #8e949e;
                }
            }
        }

        .container_flex_middle {
            background-color: transparent;
            flex: 1 1 0%;
            height: 100%;
            border: none;
            border-radius: 8px;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            padding: 20px 20px 0 20px;


            .container_flex_middle_title {
                color: #262933;
                font-size: 20px;
                margin-bottom: 12px;
            }

            .container_flex_middle_text {
                color: #8e949e;
            }
        }

        .container_flex_right {
            background-color: transparent;
            flex: 1 1 0%;
            height: 100%;
            border: none;
            border-radius: 8px;
            padding: 20px;
            display: flex;
            flex-direction: column;
            justify-content: space-between;

            .container_flex_right_title {
                color: #262933;
                font-size: 20px;
                margin-bottom: 12px;
            }

            .container_flex_right_text {
                color: #8e949e;
            }
        }
    }
}

.container {
    max-width: 1200px;
    margin: 0 auto;

}

.section-title {
    font-size: 36px;
    font-weight: 700;
    color: #000;
    margin-bottom: 10px;
    text-align: left;
}

.about-text {
    font-size: 16px;
    line-height: 1.8;
    color: #666;
    max-width: 1000px;
    margin-bottom: 60px;
}

.vision-section {
    padding: 50px 0;
}

.features-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 1px;
    margin-top: 60px;
    background-color: #e5e5e5;
    border-radius: 12px;
    overflow: hidden;
    padding: 1px;
}

.feature-item {
    display: flex;
    align-items: flex-start;
    gap: 30px;
    padding: 58px 32px;
    background-color: transparent;
    transition: all 0.3s ease;
}

.feature-icon {
    flex-shrink: 0;
    width: 120px;
    height: 120px;
    display: flex;
    align-items: center;
    justify-content: center;

    img {
        width: 120px;
        height: 120px;
        object-fit: contain;
    }
}

.feature-content {
    flex: 1;
}

.feature-title {
    font-size: 24px;
    font-weight: 600;
    color: #000;
    margin-bottom: 16px;
    line-height: 1.3;
}

.feature-description {
    font-size: 14px;
    --un-text-opacity: 1;
    color: rgba(142, 142, 146, var(--un-text-opacity));
    margin: 0;
}

@media (max-width: 768px) {
    .features-grid {
        grid-template-columns: 1fr;
        gap: 40px;
    }

    .feature-item {
        flex-direction: column;
        text-align: center;
        gap: 20px;
    }

    .section-title {
        font-size: 36px;
        text-align: center;
    }

    .main-titles {
        font-size: 40px;
        text-align: center;
    }

    .banner_describe {
        flex-direction: column;
        text-align: center;
    }
}

.values-section {
    padding: 80px 0;
}

.values-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    margin-top: 60px;
    border-radius: 12px;
    gap: 20px;
    overflow: hidden;
}

.value-item {
    background-color: #fff;
    cursor: pointer;
    transition: all 0.3s ease;


}

.value-header {
    padding: 24px;
    position: relative;
    border: 1px solid #eaeaed;
    border-radius: 16px;

    .value-flex {
        display: flex;
        justify-content: space-between;
        padding: 0 0 24px 0;
    }

    .expand-icon-box {
        width: 40px;
        height: 40px;
        border: 1px solid #eaeaed;
        border-radius: 999999px;
        display: flex;
        align-items: center;
        justify-content: center;
    }
}

.value-icon {
    width: 60px;
    height: 60px;
    margin-bottom: 20px;
    display: flex;
    align-items: center;


    img {
        width: 60px;
        height: 60px;
        object-fit: contain;
    }
}

.value-title {
    font-size: 24px;
    font-weight: 600;
    color: #000;
    margin: 0;
    line-height: 1.3;
}

.expand-icon {
    width: 24px;
    height: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #666;
    transition: transform 0.3s ease;
    transform: rotate(270deg);


    &.expanded {
        transform: rotate(360deg);
    }
}

.value-content {
    max-height: 0;
    overflow: hidden;
    transition: max-height 0.3s ease;

    &.expanded {
        max-height: 200px;
    }
}

.value-description {
    padding: 20px 0 0 0;
    font-size: 14px;
    line-height: 1.6;
    border-top: 1px solid #eaeaed;
    color: #666;
    margin: 0;
    text-align: left;
}

.cta-section {
    padding: 0;
    margin: 80px 0;
}

.cta-content {
    background-image: url('../../assets/svg/s4bg.1fc94da6.svg');
    background-repeat: no-repeat;
    border-radius: 20px;
    text-align: center;
    color: #000;
    padding: 20px 0;
    height: 230px;
}

.cta-title {
    font-size: 36px;
    font-weight: 700;
    margin-bottom: 12px;
    color: #000;
}

.cta-description {
    font-size: 16px;
    line-height: 1.6;
    margin-bottom: 20px;
    margin-top: 40px;
    max-width: 800px;
    margin-left: auto;
    margin-right: auto;
    color: #000;
}

.cta-button {
    background-color: #000;
    color: rgba(208, 245, 0, 1) !important;
    padding: 4px 32px;
    border-radius: 50px;
    font-size: 12px;
    font-weight: 600;
    border: none;
    cursor: pointer;
    transition: all 0.3s ease;

    &:hover {
        background-color: #333;
        transform: translateY(-2px);
    }
}


@media (max-width: 768px) {
    .values-grid {
        grid-template-columns: 1fr;
        gap: 1px;
    }

    .value-header {
        padding: 30px 20px;
    }

    .value-description {
        padding: 0 20px 30px;
    }

    .cta-content {
        padding: 40px 20px;
    }

    .cta-title {
        font-size: 36px;
    }
}
</style>
