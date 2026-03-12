<template>
    <div style="margin-bottom: 100px;">
        <div class="market-page">
            <div class="market-page-title">
                <h2>行情</h2>
            </div>
            <div class="Gainers_box">
                <div class="Gainers_item" style="width: 31%;">
                    <!-- 涨幅榜 -->
                    <div class="flex" style="padding: 0 20px;">
                        <div class="title">涨幅榜</div>
                        <div class="arrow_rg" @click="jumpToClick"><img style="width: 16.8px; height: 16.8px;"
                                src="../../assets/svg/arrow_right.svg" alt=""></div>
                    </div>
                    <GainersRanking :sort-type="'rise'" :default-limit="3" @coin-selected="onCoinSelected" />
                </div>
                <div class="Gainers_item" style="width: 31%;">
                    <!--跌幅榜 -->
                    <div class="flex" style="padding: 0 20px;">
                        <div class="title">跌幅榜</div>
                        <div class="arrow_rg" @click="jumpToClick"><img style="width: 16.8px; height: 16.8px;"
                                src="../../assets/svg/arrow_right.svg" alt=""></div>
                    </div>
                    <GainersRanking :sort-type="'fall'" :default-limit="3" @coin-selected="onCoinSelected" />
                </div>
                <div class="Gainers_item" style="width: 31%;">
                    <!-- 成交额 -->
                    <div class="flex" style="padding: 0 20px;">
                        <div class="title">成交额</div>
                        <div class="arrow_rg" @click="jumpToClick"><img style="width: 16.8px; height: 16.8px;"
                                src="../../assets/svg/arrow_right.svg" alt=""></div>
                    </div>
                    <GainersRanking :sort-type="'volume'" :default-limit="3" @coin-selected="onCoinSelected" />
                </div>
            </div>
        </div>
        <div class="Market">
            <Market />
        </div>

        <div class="faq-section">
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
        </div>
    </div>
</template>

<script>
import GainersRanking from '@/components/GainersRanking.vue'
import Market from '@/views/index/components/Market.vue';

export default {
    components: {
        GainersRanking,
        Market

    },
    name: 'MarketView',
    data() {
        return {
            activeFaqIndex: '',
            faqList: [
                {
                    q: '今天的加密货币价格、图表和数据',
                    a: '欢迎来到 Abtcoin！本网站由 Doctor.Han 于2013年创立，旨在提供最新的加密货币价格、图表和有关新兴加密货币市场的数据。Abtcoin 是全球首家承诺100%储备金的主流交易所，与美国知名审计公司 Armanino LLP 密切合作，定期公开 Merkle Tree 开源方案，让用户可以验证他们的资产100%存放在 Abtcoin 中。'
                },
                {
                    q: '我们免费提供实时和历史加密货币图表',
                    a: 'Abtcoin 的加密货币价格和行情图表展示了全球多种加密货币的实时市场，不仅有准确的实时价格走势，还有专业的趋势分析。Abtcoin 帮助您即时掌握加密货币市场的最新动态。  Abtcoin 实时更新热门加密货币的价格，显示过去 1 小时、24 小时和 7 天的币种价格变化，以及过去 24 小时的交易量和加密货币的当前市值。Abtcoin 还提供清晰简洁的近 7 天价格趋势图，帮助您更好地了解加密货币市场的波动情况。'
                },
                {
                    q: '我们如何计算我们的加密货币价格？',
                    a: '基于特定加密货币在不同交易所的币对，Abtcoin 使用全球交易量和平均价格公式计算加密货币价格。  每个加密货币交易所呈现的加密货币价格都不尽相同，但差别并不大。原因简单分为：投资吸引力、供求关系、挖矿难度或哈希率、监管政策的变化以及热门加密货币的波动性。此外，每种加密货币在不同的交易所市场进行交易和流通，其经济影响和流动性不同，计算出来的价格也会不同。'
                },
                {
                    q: '最值得投资的加密货币是什么？',
                    a: 'Abtcoin 加密货币价格和行情图表页为您提供了多种不同的加密货币，包括当前热门币种比特币、以太币和泰达币，及其他具有不同市场价值的代币。您可以关注收藏此页面，以便长期追踪加密货币价格走势，选择更好的投资方向。'
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
                    a: 'Abtcoin 不提供关于哪个加密货币、代币或资产是否是良好投资的金融或投资建议，也不提供关于购买或出售时机的建议。我们是一家严谨的交易平台。 请记住，金融资产的价格、收益和价值会发生变化。这意味着您可能投资的任何资本都有风险。我们建议您寻求专业投资顾问的建议，以获得与您的个人情况相关的指导。'
                },
                {
                    q: '我今天应该投资加密货币吗？',
                    a: '我们必须谨记，加密货币会受到极端市场条件、法律政策、项目团队管理和其他不可预测因素的影响。因此，加密货币的波动很大，管理好自己的风险水平至关重要。建议用户在做出加密货币市场的投资决定时，一定要自己做好研究(DYOR)。'
                },
            ]
        }
    },
    methods: {
        onCoinSelected(coin) {
        },
        jumpToClick() {
            this.$router.push("/market/popular");
        },
        toggleFaq(index) {
            this.activeFaqIndex = this.activeFaqIndex === index ? -1 : index
        }
    },
}


</script>

<style scoped lang="scss">
.market-page {
    padding: 0 0 80px 0;
    width: 1260px;
    margin: auto;

    .market-page-title {
        margin-top: 80px;
        color: #000;

        h2 {
            font-size: 36px;
        }
    }


    .Gainers_box {
        padding-top: 25px;
        width: 1260px;
        margin: 0 auto;
        display: flex;
        align-items: center;
        justify-content: space-between;

        .Gainers_item {
            height: 260px;
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
    }
}

.Market {
    width: 1260px;
    padding: 20px;
    border-radius: 20px;
    margin: 0 auto;
    border: 1px solid #eaeaed;
}

.Market ::v-deep .page2 {
    display: none;
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
</style>