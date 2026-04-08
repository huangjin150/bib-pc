<template>
    <div class="introduce-page dark-skin">
        <!-- Hero Banner 区 - 极简科技风 -->
        <div class="hero-banner">
            <div class="hero-bg-lines"></div>
            <div class="hero-content container">
                <div class="hero-center">
                    <div class="brand-badge">Bibcoin Crypto Exchange</div>
                    <h1 class="hero-title">重新定义全球资产交易体验</h1>
                    <p class="hero-desc">安全、快捷、轻松交易 <strong>美股</strong>、<strong>大宗商品</strong> 与
                        <strong>虚拟币</strong>。<br>为全球 4300 万用户提供一站式、全方位的数字资产与传统金融服务。
                    </p>

                    <div class="hero-actions">
                        <button v-if="!isLogin" @click="loginClick" class="hero-btn primary">
                            立即开启交易
                        </button>
                        <button @click="rechangeClick" class="hero-btn secondary">
                            探索生态
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <!-- 悬浮数据条 -->
        <div class="stats-bar-wrapper">
            <div class="container">
                <div class="stats-bar">
                    <div class="stat-item">
                        <div class="stat-icon">
                            <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor"
                                stroke-width="2">
                                <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                            </svg>
                        </div>
                        <div class="stat-info">
                            <div class="stat-val">$226.01 亿</div>
                            <div class="stat-label">24小时交易量</div>
                        </div>
                    </div>
                    <div class="stat-divider"></div>
                    <div class="stat-item">
                        <div class="stat-icon">
                            <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor"
                                stroke-width="2">
                                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                                <circle cx="9" cy="7" r="4" />
                                <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                            </svg>
                        </div>
                        <div class="stat-info">
                            <div class="stat-val">4300 万+</div>
                            <div class="stat-label">全球信赖用户</div>
                        </div>
                    </div>
                    <div class="stat-divider"></div>
                    <div class="stat-item">
                        <div class="stat-icon">
                            <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor"
                                stroke-width="2">
                                <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
                                <polyline points="17 6 23 6 23 12" />
                            </svg>
                        </div>
                        <div class="stat-info">
                            <div class="stat-val highlight">11.23%</div>
                            <div class="stat-label">余币宝理财年化</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- 核心优势区 - 左右图文交替风 -->
        <div class="core-features-section">
            <div class="container">
                <div class="feature-row">
                    <div class="feature-text">
                        <div class="feature-tag">01 / 全品类覆盖</div>
                        <h2 class="feature-title">美股 · 大宗商品 · 虚拟币</h2>
                        <p class="feature-desc">打破传统金融与加密世界的壁垒。在同一个平台，您不仅可以交易数千种热门虚拟资产，还能零门槛投资全球顶级美股科技公司，以及黄金、原油等核心大宗商品。
                        </p>
                        <ul class="feature-list">
                            <li><span class="dot"></span> <span
                                    style="color: #fff; font-weight: bold; margin-right: 8px;">虚拟币:</span> 3400+
                                主流与新兴数字资产</li>
                            <li><span class="dot"></span> <span
                                    style="color: #fff; font-weight: bold; margin-right: 8px;">美股:</span> 顶级科技股与优质企业股票
                            </li>
                            <li><span class="dot"></span> <span
                                    style="color: #fff; font-weight: bold; margin-right: 8px;">大宗商品:</span>
                                黄金、白银、原油等全球硬核资产</li>
                        </ul>
                    </div>
                    <div class="feature-image">
                        <div class="image-box">
                            <!-- 如果有综合类图片可以替换，这里暂时保留原来的并加一点装饰框 -->
                            <img src="../../assets/images/banner-proof-dark.webp" alt="Multi Assets">
                            <div class="floating-badge">
                                <span class="badge-dot"></span>
                                一站式交易
                            </div>
                        </div>
                    </div>
                </div>

                <div class="feature-row reverse">
                    <div class="feature-text">
                        <div class="feature-tag">02 / 极致体验</div>
                        <h2 class="feature-title">全网最快发掘潜力项目</h2>
                        <p class="feature-desc">新币、热股、热门商品极速上线，覆盖广泛的主流与新兴投资标的。提供行业领先的交易深度及流动性，确保您在任何市场波动下都能获得极佳的成交价格。
                        </p>
                        <ul class="feature-list">
                            <li><span class="dot"></span> 一个账户，连通三大投资市场</li>
                            <li><span class="dot"></span> 微秒级撮合引擎，拒绝卡顿</li>
                            <li><span class="dot"></span> 深度流动性，大额交易滑点极低</li>
                        </ul>
                    </div>
                    <div class="feature-image">
                        <div class="image-box">
                            <img src="../../assets/images/fast-light.webp" alt="Fast listing">
                            <div class="floating-badge right">
                                <span class="badge-dot pulse"></span>
                                极速交易
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- 我们的生态 (原组件) -->
        <div class="ecosystem-section">
            <div class="container">
                <EcosystemCarousel :title="'全域 Web3 生态'" :items="ecosystemItems" />
            </div>
        </div>

        <!-- 安全保障 (原组件) -->
        <div class="security-section-wrapper">
            <div class="container">
                <SecurityAssurance />
            </div>
        </div>

        <!-- 媒体评价 (原组件) -->
        <div class="media-section">
            <div class="container">
                <div class="section-header center">
                    <h2 class="section-title">来自全球媒体的认可</h2>
                    <p class="section-subtitle">行业顶尖媒体如何评价 Bibcoin</p>
                </div>
                <MediaTestimonials :items="mediaReviews" />
            </div>
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
                    title: 'Bibcoin 交易平台',
                    desc: '全球领先的综合交易平台，一站式连通三大核心市场。不仅支持 3,400+ 种虚拟币现货与合约交易，更零门槛提供全球顶级美股及大宗商品（黄金、原油等）的极速交易服务，全方位满足您的投资需求。',
                    icon: require('../../assets/svg/introduction_svg1.svg')
                },
                {
                    title: 'Bibcoin Layer',
                    desc: '基于 OP Stack 构建的高性能二层网络，完全兼容以太坊 EVM，可实现每秒 5,700 笔以上交易，区块生成时间仅 1 秒，交易费用远低于多数现有二层网络，为 Web3 应用提供更快、更安全、更经济的基础设施。',
                    icon: require('../../assets/svg/introduction_svg2.svg')
                },
                {
                    title: 'Bibcoin Perp DEX',
                    desc: 'Bibcoin 自主研发的去中心化永续合约交易所，基于高性能二层网络 Bibcoin Layer，内置高性能撮合引擎，支持高并发处理与低延迟交易，打造接近专业 CEX 的使用体验。',
                    icon: require('../../assets/svg/introduction_svg3.svg')
                },
                {
                    title: 'Bibcoin 全域资产池',
                    desc: '打破传统金融与加密资产的隔阂。在全域资产池中，您可以将虚拟货币、美股持仓或大宗商品合约作为统一保证金，实现资金的高效周转与跨市场对冲。',
                    icon: require('../../assets/svg/introduction_svg4.svg')
                },
                {
                    title: 'Bibcoin Alpha',
                    desc: '专注于早期优质链上项目的交易平台，融合 CEX 的便捷体验与 DEX 的链上自由。用户可直接使用交易所的 USDT 无缝购买链上热门代币，轻松探索 Web3 潜力项目。',
                    icon: require('../../assets/svg/introduction_svg5.svg')
                },
                {
                    title: 'Bibcoin Wealth',
                    desc: '专业的全品类财富管理中心。提供从虚拟币余币宝、链上赚币，到挂钩美股和大宗商品表现的结构性理财产品，助您在不同市场周期中稳健增值。',
                    icon: require('../../assets/svg/introduction_svg6.svg')
                },
                {
                    title: 'Bibcoin Pay',
                    desc: '从收单、下发到法币出入金，一站式加密支付服务，快速、安全，驱动数字支付融入更多场景。',
                    icon: require('../../assets/svg/introduction_svg7.svg')
                },
                {
                    title: 'Bibcoin Labs',
                    desc: '用专业点燃创意，为初创项目提供孵化支持与运营资源，陪伴每一个创新想法从起步走向成功。',
                    icon: require('../../assets/svg/introduction_svg8.svg')
                },
                {
                    title: 'Bibcoin Life',
                    desc: '数字货币消费与娱乐的一站式平台，集成 Bibcoin Gift Card、Bibcoin Pay 支付、C2C 转账等核心功能。',
                    icon: require('../../assets/svg/introduction_svg9.svg')
                },
                {
                    title: 'Bibcoin Ventures',
                    desc: '聚焦区块链与金融科技基础设施投资的加密风投基金，赋能未来，推动数字经济的创新与变革。',
                    icon: require('../../assets/svg/introduction_svg10.svg')
                },
                {
                    title: 'Bibcoin Learn & Research',
                    desc: '全方位的投资教育与投研智库。从加密市场前沿洞察，到美股财报深度解析与大宗商品周期分析，为您提供最专业的交易参考。',
                    icon: require('../../assets/svg/introduction_svg11.svg')
                },
                {
                    title: 'Bibcoin Web3',
                    desc: 'Bibcoin Web3 是 Bibcoin 生态的全新链上入口，集钱包、跨链、交易、空投、赚币与 DApp 于一体，构建开放互联的 Web3 全域生态。',
                    icon: require('../../assets/svg/introduction_svg12.svg')
                },
                {
                    title: 'Bibcoin Post',
                    desc: '全领域投资者专属社交平台，聚焦加密、美股与大宗商品的热点资讯，洞悉行业脉搏、链接全球顶尖交易者。',
                    icon: require('../../assets/svg/introduction_svg13.svg')
                },
                {
                    title: 'Bibcoin Live',
                    desc: '官方专业直播平台，汇聚全球行业前沿分析师，为您提供覆盖加密资产、美股走势与大宗商品宏观周期的全天候行情解读。',
                    icon: require('../../assets/svg/introduction_svg14.svg')
                },
                {
                    title: 'Bibcoin Charity',
                    desc: '全球性非盈利慈善基金组织，致力于将区块链技术与传统公益相结合，打造透明、高效、可持续的慈善生态。',
                    icon: require('../../assets/svg/introduction_svg15.svg')
                },

            ],
            mediaReviews: [
                {
                    quote: 'Bibcoin 是 Winkrypto 值得信赖的合作伙伴。我们见证了 Bibcoin 团队不断的努力和奉献。合约产品是众多 CEX 和 DEX 平台核心竞争力的关键特征之一。 Bibcoin 通过提供稳定的交互用户体验，是市场波动时的完美主机。Bibcoin 上架的许多主流加密资产都具有高流动性，并提供有竞争力的价格。',
                    img_icon: require('@/assets/images/aboutUs_icon.png'),
                    source: 'Media',
                    logo: null
                },
                {
                    quote: '全球数字金融联合主席 Lawrence Wintermeyer 评论说：“全球加密和数字资产领域继续快速成熟我们看到数字金融得到更广泛的采用。我们很高兴 Bibcoin 加入 GDF 赞助人委员会，作为该领域的领先创新者，我们期待与他们合作，参与和促进 GDF 在社区中的知识共享计划。”',
                    img_icon: require('@/assets/images/aboutUsIcon2.png'),
                    source: 'Media',
                    logo: null
                },
                {
                    quote: 'Bibcoin 将无数的加密货币和市场汇集在一个地方。几乎有太多的加密货币可供选择，甚至有更多的市场可供选择。当您打开“市场”选项卡时，左侧会打开一个加密货币列表，您可以搜索您的首选货币。',
                    img_icon: require('@/assets/images/aboutUsIcon3.png'),
                    source: 'Media',
                    logo: null
                },
                {
                    quote: '我们一直在 Bibcoin 上进行愉快的交易，并高度重视我们的业务关系并期待继续下去。',
                    img_icon: require('@/assets/images/aboutUsIcon4.png'),
                    source: 'Media',
                    logo: null
                },
                {
                    quote: 'Tower Research Capital 很高兴成为 Bibcoin 的一部分，并为交易所的交易币组合提供流动性',
                    img_icon: require('@/assets/images/aboutUsIcon5.png'),
                    source: 'Media',
                    logo: null
                },
                {
                    quote: 'Banxa 的整个团队很自豪能与 Bibcoin 合作，以推进我们将数字资产推向世界的共同使命。',
                    img_icon: require('@/assets/images/aboutUsIcon6.png'),
                    source: 'Media',
                    logo: null
                },
                {
                    quote: '我们是 Bibcoin 的忠实拥护者，见证了它在过去几年中不断攀升的排名，并达到了超过 100 亿美元的日交易量（有时）。作为一个交易平台，设计师们做了了不起的工作，引入了友好的质押服务、期货交易、保证金交易、期权交易、以友好的利率借贷，以及一个包容性的“启动”计划，以支持新兴数字资产的兴起。',
                    img_icon: require('@/assets/images/aboutUsIcon7.png'),
                    source: 'Media',
                    logo: null
                },
                {
                    quote: '据 CoinMarketCap.com 称，Bibcoin 让用户可以访问超过 1500 种不同的代币，这对于寻找不太常见的山寨币的高级加密交易者来说是更好的选择。',
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
            this.$router.push({ path: '/login' })
        },
        rechangeClick() {
            this.$router.push({ path: '/swap' })

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

/* ==========================================================================
   Hero Banner Section (Minimalist & Tech)
   ========================================================================== */
.hero-banner {
    position: relative;
    padding: 120px 0 160px;
    background: #000;
    overflow: hidden;
    text-align: center;
}

.hero-bg-lines {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-image:
        linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px),
        linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px);
    background-size: 50px 50px;
    background-position: center center;
    opacity: 0.5;
    z-index: 0;

    &::after {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: radial-gradient(circle at center, transparent 0%, #000 80%);
    }
}

.hero-content {
    position: relative;
    z-index: 2;
    display: flex;
    flex-direction: column;
    align-items: center;
}

.hero-center {
    max-width: 800px;
    margin: 0 auto;
}

.brand-badge {
    display: inline-block;
    padding: 6px 16px;
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 20px;
    color: #888;
    font-size: 14px;
    font-weight: 500;
    margin-bottom: 32px;
    letter-spacing: 2px;
    text-transform: uppercase;
}

.hero-title {
    font-size: 64px;
    font-weight: 800;
    line-height: 1.2;
    color: #fff;
    margin-bottom: 24px;
    letter-spacing: -1px;
}

.hero-desc {
    font-size: 18px;
    line-height: 1.8;
    color: #888;
    margin-bottom: 48px;
}

.hero-actions {
    display: flex;
    gap: 20px;
    justify-content: center;
}

.hero-btn {
    padding: 16px 40px;
    border-radius: 8px;
    font-size: 16px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;

    &.primary {
        background: #d4ff00;
        color: #000;
        border: none;

        &:hover {
            transform: translateY(-2px);
            box-shadow: 0 8px 20px rgba(212, 255, 0, 0.2);
        }
    }

    &.secondary {
        background: transparent;
        color: #fff;
        border: 1px solid rgba(255, 255, 255, 0.2);

        &:hover {
            border-color: #fff;
            background: rgba(255, 255, 255, 0.05);
        }
    }
}

/* 悬浮数据条 */
.stats-bar-wrapper {
    position: relative;
    width: 100%;
    margin-top: -60px;
    margin-bottom: 60px;
    z-index: 10;
}

.stats-bar {
    background: #0c0c0c;
    border: 1px solid #1a1a1a;
    border-radius: 20px;
    padding: 40px;
    display: flex;
    justify-content: space-around;
    align-items: center;
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.5);
}

.stat-item {
    display: flex;
    align-items: center;
    gap: 20px;
}

.stat-icon {
    width: 56px;
    height: 56px;
    border-radius: 16px;
    background: rgba(255, 255, 255, 0.03);
    display: flex;
    align-items: center;
    justify-content: center;
    color: #fff;
}

.stat-info {
    text-align: left;
}

.stat-val {
    font-size: 28px;
    font-weight: 700;
    color: #fff;
    margin-bottom: 4px;

    &.highlight {
        color: #d4ff00;
    }
}

.stat-label {
    font-size: 14px;
    color: #666;
}

.stat-divider {
    width: 1px;
    height: 60px;
    background: #1a1a1a;
}

/* ==========================================================================
   Core Features Section (Row alternating)
   ========================================================================== */
.core-features-section {
    padding: 180px 0 100px;
    background: #000;
}

.feature-row {
    display: flex;
    align-items: center;
    gap: 80px;
    margin-bottom: 120px;

    &.reverse {
        flex-direction: row-reverse;
    }
}

.feature-text {
    flex: 1;
}

.feature-tag {
    font-size: 14px;
    font-weight: 600;
    color: #d4ff00;
    margin-bottom: 20px;
    letter-spacing: 1px;
}

.feature-title {
    font-size: 40px;
    font-weight: 700;
    color: #fff;
    margin-bottom: 24px;
    line-height: 1.2;
}

.feature-desc {
    font-size: 16px;
    line-height: 1.8;
    color: #888;
    margin-bottom: 32px;
}

.feature-list {
    list-style: none;
    padding: 0;
    margin: 0;

    li {
        display: flex;
        align-items: center;
        gap: 12px;
        font-size: 16px;
        color: #ccc;
        margin-bottom: 16px;

        .dot {
            width: 6px;
            height: 6px;
            border-radius: 50%;
            background: #d4ff00;
        }
    }
}

.feature-image {
    flex: 1;
    position: relative;
}

.image-box {
    position: relative;
    border-radius: 24px;
    overflow: hidden;
    border: 1px solid #1a1a1a;
    background: #0c0c0c;
    padding: 40px;

    img {
        width: 100%;
        height: auto;
        border-radius: 12px;
        transition: transform 0.5s ease;
    }

    &:hover img {
        transform: scale(1.02);
    }
}

.floating-badge {
    position: absolute;
    top: 40px;
    left: -20px;
    background: rgba(20, 20, 20, 0.9);
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.1);
    padding: 12px 24px;
    border-radius: 100px;
    display: flex;
    align-items: center;
    gap: 10px;
    color: #fff;
    font-size: 14px;
    font-weight: 500;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
    z-index: 2;

    &.right {
        left: auto;
        right: -20px;
    }

    .badge-dot {
        width: 8px;
        height: 8px;
        border-radius: 50%;
        background: #4caf50;

        &.pulse {
            background: #d4ff00;
            box-shadow: 0 0 10px #d4ff00;
        }
    }
}

/* ==========================================================================
   Ecosystem & Security Sections
   ========================================================================== */
.ecosystem-section {
    padding: 100px 0;
    background: #0a0a0c;
}

.security-section-wrapper {
    padding: 100px 0;
    background: #000;
}

.media-section {
    padding: 100px 0 120px;
    background: #0a0a0c;
}

.section-header {
    margin-bottom: 60px;

    &.center {
        text-align: center;
    }

    .section-title {
        font-size: 36px;
        font-weight: 700;
        color: #fff;
        margin-bottom: 16px;
    }

    .section-subtitle {
        font-size: 16px;
        color: #888;
    }
}

/* ==========================================================================
   Responsive Design
   ========================================================================== */
@media (max-width: 1024px) {
    .stats-bar {
        flex-direction: column;
        gap: 30px;
        padding: 30px;
    }

    .stat-divider {
        width: 100%;
        height: 1px;
    }

    .feature-row,
    .feature-row.reverse {
        flex-direction: column;
        gap: 60px;
        text-align: center;
    }

    .feature-list li {
        justify-content: center;
    }

    .floating-badge {
        display: none;
    }
}

@media (max-width: 768px) {
    .hero-banner {
        padding: 80px 0 120px;
    }

    .hero-title {
        font-size: 40px;
    }

    .hero-actions {
        flex-direction: column;
        width: 100%;
        max-width: 300px;
    }

    .core-features-section {
        padding: 240px 0 60px;
    }
}

.values-section {
    padding: 80px 0;
    background-color: #000;
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
    background-color: #0c0c0c;
    cursor: pointer;
    transition: all 0.3s ease;
}

.value-header {
    padding: 24px;
    position: relative;
    border: 1px solid #1a1a1a;
    border-radius: 16px;

    .value-flex {
        display: flex;
        justify-content: space-between;
        padding: 0 0 24px 0;
    }

    .expand-icon-box {
        width: 40px;
        height: 40px;
        border: 1px solid #333;
        border-radius: 999999px;
        display: flex;
        align-items: center;
        justify-content: center;
        background-color: rgba(255, 255, 255, 0.05);
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
    color: #fff;
    margin: 0;
    line-height: 1.3;
}

.expand-icon {
    width: 24px;
    height: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #888;
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
    border-top: 1px solid #1a1a1a;
    color: #888;
    margin: 0;
    text-align: left;
}

.cta-section {
    padding: 0;
    margin: 80px 0;
    background-color: #000;
}

.cta-content {
    background-image: url('../../assets/svg/s4bg.1fc94da6.svg');
    background-repeat: no-repeat;
    background-size: cover;
    border-radius: 20px;
    text-align: center;
    color: #fff;
    padding: 40px 20px;
    height: 280px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
}

.cta-title {
    font-size: 36px;
    font-weight: 700;
    margin-bottom: 12px;
    color: #fff;
}

.cta-description {
    font-size: 16px;
    line-height: 1.6;
    margin-bottom: 30px;
    max-width: 800px;
    color: rgba(255, 255, 255, 0.8);
}

.cta-button {
    background-color: #d4ff00;
    color: #000 !important;
    padding: 12px 40px;
    border-radius: 50px;
    font-size: 16px;
    font-weight: 600;
    border: none;
    cursor: pointer;
    transition: all 0.3s ease;

    &:hover {
        transform: translateY(-2px);
        box-shadow: 0 8px 20px rgba(212, 255, 0, 0.2);
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
