<template>
    <div class="market-dark-page">
        <!-- 顶部 Banner 区域 -->
        <div class="market-banner">
            <div class="banner-content">
                <div class="banner-left">
                    <h1 class="banner-title">行情</h1>
                    <p class="banner-subtitle">捕捉行业最新动态</p>
                </div>
                <div class="banner-right">
                    <!-- 这里留出位置，由您来放置右侧图片 -->
                    <div class="banner-image-placeholder"></div>
                </div>
            </div>
        </div>

        <div class="market-page">
            <div class="Market">
                <Market :is-market-page="true" />
            </div>
        </div>

        <!-- <div class="faq-section">
            <h2 class="faq-title">了解我们的工作方式</h2>
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
        </div> -->
    </div>
</template>

<script>
import Market from '@/views/index/components/Market.vue';

export default {
    components: {
        Market
    },
    name: 'MarketView',
    data() {
        return {
            activeFaqIndex: '',
            faqList: [
                {
                    q: '今天的加密货币价格、图表和数据',
                    a: '欢迎来到 Bibcoin！本网站由 Doctor.Han 于2013年创立，旨在提供最新的加密货币价格、图表和有关新兴加密货币市场的数据。Bibcoin 是全球首家承诺100%储备金的主流交易所，与美国知名审计公司 Armanino LLP 密切合作，定期公开 Merkle Tree 开源方案，让用户可以验证他们的资产100%存放在 Bibcoin 中。'
                },
                {
                    q: '我们免费提供实时和历史加密货币图表',
                    a: 'Bibcoin 的加密货币价格和行情图表展示了全球多种加密货币的实时市场，不仅有准确的实时价格走势，还有专业的趋势分析。Bibcoin 帮助您即时掌握加密货币市场的最新动态。  Bibcoin 实时更新热门加密货币的价格，显示过去 1 小时、24 小时和 7 天的币种价格变化，以及过去 24 小时的交易量和加密货币的当前市值。Bibcoin 还提供清晰简洁的近 7 天价格趋势图，帮助您更好地了解加密货币市场的波动情况。'
                },
                {
                    q: '我们如何计算我们的加密货币价格？',
                    a: '基于特定加密货币在不同交易所的币对，Bibcoin 使用全球交易量和平均价格公式计算加密货币价格。  每个加密货币交易所呈现的加密货币价格都不尽相同，但差别并不大。原因简单分为：投资吸引力、供求关系、挖矿难度或哈希率、监管政策的变化以及热门加密货币的波动性。此外，每种加密货币在不同的交易所市场进行交易和流通，其经济影响和流动性不同，计算出来的价格也会不同。'
                },
                {
                    q: '最值得投资的加密货币是什么？',
                    a: 'Bibcoin 加密货币价格和行情图表页为您提供了多种不同的加密货币，包括当前热门币种比特币、以太币和泰达币，及其他具有不同市场价值的代币。您可以关注收藏此页面，以便长期追踪加密货币价格走势，选择更好的投资方向。'
                },
                {
                    q: '什么原因导致某些加密货币变得热门？',
                    a: '某种加密货币要成为热门币种，市场上必须有明显的积极因素，导致买入量增加，推动币种价格上涨。可以想象，币友们在社交媒体上高喊这些代币即将大涨，从而进一步推动了市场对这些币种的兴趣。 在社交媒体的喧嚣之下，有一些常见的关键因素造成了热门币种的上涨势头。虽然某些因素合乎逻辑，但市场往往是非理性的，会造成大规模的价格波动。这就是为什么必须进行技术分析，以确定此时是否仍是进入市场的正确、安全时机。'
                },
                {
                    q: '什么是山寨币？',
                    a: '第一个加密货币是比特币。由于其开源，其他人可以使用大部分代码，进行一些更改，然后发布自己的独立货币。许多人正是这样做的。有些代币与比特币非常相似，仅修改了一两个特性(如莱特币)，而其他代币则非常不同，具有不同的安全性、发行和治理模式。然而，它们都共享同一个名称——每个在比特币之后发行的代币都被认为是山寨币。'
                },
                {
                    q: '什么是 ETFs？',
                    a: '2024年1月，美国证券交易委员会批准了11只投资于比特币的交易基金。其他国家已经有一些比特币 ETF，但这一变化使它们可以向美国的散户投资者开放。这为更广泛的投资者群体提供了在其投资组合中增加一些加密货币风险敞口的机会。'
                },
                {
                    q: '哪个是最值得投资的加密货币？',
                    a: 'Bibcoin 不提供关于哪个加密货币、代币或资产是否是良好投资的金融或投资建议，也不提供关于购买或出售时机的建议。我们是一家严谨的交易平台。 请记住，金融资产的价格、收益和价值会发生变化。这意味着您可能投资的任何资本都有风险。我们建议您寻求专业投资顾问的建议，以获得与您的个人情况相关的指导。'
                },
                {
                    q: '我今天应该投资加密货币吗？',
                    a: '我们必须谨记，加密货币会受到极端市场条件、法律政策、项目团队管理和其他不可预测因素的影响。因此，加密货币的波动很大，管理好自己的风险水平至关重要。建议用户在做出加密货币市场的投资决定时，一定要自己做好研究(DYOR)。'
                },
            ]
        }
    },
    methods: {
        toggleFaq(index) {
            this.activeFaqIndex = this.activeFaqIndex === index ? -1 : index
        }
    },
}


</script>

<style scoped lang="scss">
.market-dark-page {
    background-color: #000;
    min-height: 100vh;
    padding-bottom: 100px;
    color: #fff;
}

/* 顶部 Banner 样式 */
.market-banner {
    width: 100%;
    background-color: #000;
    border-bottom: 1px solid #1a1a1a;
    padding: 60px 0;
}

.banner-content {
    max-width: 1260px;
    margin: 0 auto;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 20px;
}

.banner-left {
    .banner-title {
        font-size: 48px;
        font-weight: bold;
        color: #fff;
        margin: 0 0 16px 0;
        letter-spacing: 2px;
    }

    .banner-subtitle {
        font-size: 16px;
        color: #999;
        margin: 0;
    }
}

.banner-right {
    .banner-image-placeholder {
        width: 300px;
        height: 200px;
        /* 在这里替换为您的图片背景，或者直接在模板里放 img 标签 */
        background-image: url('../../assets/images/illustration-1.png');
        background-size: contain;
        background-position: center;
        background-repeat: no-repeat;
    }
}

.market-page {
    width: 1260px;
    margin: 0 auto;
    padding-top: 40px;
}

.Market {
    width: 100%;
    margin: 0;
}

.Market ::v-deep .page2 {
    display: none;
}

.Market ::v-deep .market-container {
    padding: 0;
}

.section {
    border: none !important;
}

.faq-section {
    max-width: 1260px;
    margin: 100px auto 60px;

    .faq-title {
        text-align: start;
        font-size: 30px;
        font-weight: 700;
        margin-bottom: 36px;
        color: #fff;
    }

    .faq-list {
        .faq-item {
            border-bottom: 1px solid #1a1a1a;
        }

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
                color: #fff;
                text-align: left;
                font-weight: 500;
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
                    filter: invert(1);
                }

                &.open img {
                    transform: rotate(180deg);
                }
            }
        }

        .faq-content {
            padding: 0 8px 22px 8px;
            color: #999;
            line-height: 1.8;

            a {
                color: #d4ff00;
                text-decoration: none;
            }
        }
    }
}
</style>