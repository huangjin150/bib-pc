<template>
    <div class="features-section">
        <div class="section-header">
            <h2 class="section-title">为什么选择我们？</h2>
            <p class="section-subtitle">提供安全、可信赖的数字资产交易和资产管理服务，覆盖全球多个国家的用户</p>
        </div>

        <div class="features-carousel">
            <div class="swiper" ref="swiperContainer">
                <div class="swiper-wrapper">
                    <div class="swiper-slide" v-for="(feature, index) in features" :key="index">
                        <div class="feature-card">
                            <div class="card-icon">
                                <img :src="feature.url" alt="" />
                            </div>
                            <div class="feature_info1">
                                <div class="feature_info">
                                    <h3 class="card-title">{{ feature.title }}</h3>
                                    <p class="card-description">{{ feature.description }}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <!-- 导航按钮 -->
            <div class="swiper-button-prev"></div>
            <div class="swiper-button-next"></div>
        </div>
    </div>
</template>

<script>
import Swiper from 'swiper'
import { Navigation, Pagination, Autoplay } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'

export default {
    name: 'AdvantageSwiper',
    data() {
        return {
            swiper: null,
            features: [
                {
                    title: '多样化交易工具',
                    description: '提供市价单、限价单、止损单等高级限价单等多种交易工具，帮助用户高效交易',
                    url: require('@/assets/svg/swiper_bom1.svg')
                },
                {
                    title: '极速市场数据',
                    description: '提供实时市场数据，包括价格走势、交易量、深度图等，让您快速掌握市场动态',
                    url: require('@/assets/svg/swiper_bom2.svg')
                },
                {
                    title: '教程资源',
                    description: '我们为高级交易者和机构提供深度分析和定制研究，助力在不断发展的加密市场中抢占先机',
                    url: require('@/assets/svg/swiper_bom3.svg')
                },
                {
                    title: '社区活动',
                    description: '组织丰富的社区活动，促进用户互动和交流',
                    url: require('@/assets/svg/swiper_bom4.svg')
                },
                {
                    title: '合作伙伴关系',
                    description: '与银行、支付服务商、项目团队建立合作，提供多样化的支付选项和交易对',
                    url: require('@/assets/svg/swiper_bom5.svg')
                },
                {
                    title: '新用户福利',
                    description: '提供新用户注册奖励、交易返佣、邀请奖励等多种激励，促进用户参与',
                    url: require('@/assets/svg/swiper_bom6.svg')
                },
                {
                    title: '顶级交易系统',
                    description: '由全球化技术团队打造，采用分布式并行技术和高速撮合引擎，确保流畅的交易体验',
                    url: require('@/assets/svg/swiper_bom7.svg')
                },
                {
                    title: '一流风控保障',
                    description: '顶级安全体系，为用户交易和资金保驾护航',
                    url: require('@/assets/svg/swiper_bom8.svg')
                },
                {
                    title: '丰富的产品功能',
                    description: '提供高杠杆合约、多币种现货交易、快速充值和提现',
                    url: require('@/assets/svg/swiper_bom9.svg')
                },
                {
                    title: '多样化交易工具',
                    description: '提供市价单、限价单、止损单、高级限价单等多种交易工具，帮助用户高效交易',
                    url: require('@/assets/svg/swiper_bom10.svg')
                }
            ]
        }
    },
    mounted() {
        this.$nextTick(() => {
            this.initSwiper()
        })
    },
    beforeDestroy() {
        if (this.swiper) {
            this.swiper.destroy(true, true)
        }
    },
    methods: {
        initSwiper() {
            if (!this.$refs.swiperContainer) {
                console.error('Swiper container not found')
                return
            }

            this.swiper = new Swiper(this.$refs.swiperContainer, {
                modules: [Navigation, Pagination, Autoplay],
                slidesPerView: 4,
                spaceBetween: 20,
                centeredSlides: false,
                loop: false,
                autoplay: {
                    delay: 5000,
                    disableOnInteraction: false,
                    pauseOnMouseEnter: true
                },
                navigation: {
                    nextEl: '.swiper-button-next',
                    prevEl: '.swiper-button-prev'
                },

                breakpoints: {
                    320: {
                        slidesPerView: 1,
                        spaceBetween: 20
                    },
                    768: {
                        slidesPerView: 2,
                        spaceBetween: 20
                    },
                    1024: {
                        slidesPerView: 3,
                        spaceBetween: 20
                    },
                    1260: {
                        slidesPerView: 4,
                        spaceBetween: 20
                    }
                },
                on: {
                }
            })
        }
    }
}
</script>

<style scoped lang="scss">
.features-section {
    max-width: 1260px;
    margin: 80px auto;
    padding: 80px 20px 80px 20px;
}

.section-header {
    text-align: start;
    margin-bottom: 60px;

    .section-title {
        font-size: 40px;
        font-weight: 700;
        color: #000;
        margin-bottom: 16px;
        line-height: 1.2;
    }

    .section-subtitle {
        font-size: 18px;
        color: #6c757d;
        line-height: 1.5;
    }
}

.features-carousel {
    position: relative;

    .swiper {
        width: 100%;
        height: auto;
        position: relative;
    }

    .swiper-wrapper {
        display: flex;
        transition-property: transform;
        box-sizing: content-box;
    }

    .swiper-slide {
        flex-shrink: 0;
        width: 100%;
        height: 100%;
        position: relative;
        transition-property: transform;
    }

    .feature-card {
        min-width: 100%;
        background: #fff;
        border-radius: 16px;
        box-shadow: 1 3px 10px rgba(0, 0, 0, 0.08);
        border: 1px solid #f0f0f0;
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        position: relative;
        transition: all 0.3s ease;

        &:hover {
            border-color: #d4ff00;
        }

        .card-icon {
            background-image: url('../../../assets/svg/feature_bg.svg');
            padding: 34px 0;
            width: 100%;
            display: flex;
            align-items: center;
            justify-content: center;

            img {
                width: 100px;
                height: 100px;
                object-fit: contain;
            }
        }

        .card-title {
            font-size: 16px;
            font-weight: 600;
            color: #000;
            margin-bottom: 8px;
            line-height: 1.3;
        }

        .card-description {
            font-size: 14px;
            color: #6c757d;
            line-height: 1.5;
            margin: 0;
        }

        .feature_info {
            padding: 12px;
            height: 170px;
            border-radius: 16px;
            background-color: #f8f8f8;
        }

        .feature_info1 {
            position: relative;
            padding: 12px;


        }

        .feature_info1::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            width: 0;
            height: 0;
            border-left: 12px solid #d4ff00;
            border-bottom: 12px solid transparent;
            z-index: 1;
        }
    }

    :deep(.swiper-button-prev),
    :deep(.swiper-button-next) {
        z-index: 1000;
        width: 48px;
        height: 48px;
        margin-top: -24px;
        border-radius: 50%;
        background: #ffffff;
        border: 2px solid #e9ecef;
        color: #6c757d;
        transition: all 0.3s ease;

        &:after {
            font-size: 18px;
            font-weight: 700;
        }

        &:hover {
            border-color: #d4ff00;
            background: #d4ff00;
            color: #000;
            transform: scale(1.05);
        }

        &.swiper-button-disabled {
            opacity: 0.5;
            cursor: not-allowed;

            &:hover {
                border-color: #e9ecef;
                background: #ffffff;
                color: #6c757d;
                transform: none;
            }
        }
    }

    :deep(.swiper-button-prev) {
        left: -100px;
    }

    :deep(.swiper-button-next) {
        right: -100px;
    }
}

@media (max-width: 768px) {
    .features-section {
        margin: 60px auto;
        padding: 0 15px;
    }

    .section-header {
        .section-title {
            font-size: 32px;
        }

        .section-subtitle {
            font-size: 16px;
        }
    }

    .features-carousel {

        :deep(.swiper-button-prev),
        :deep(.swiper-button-next) {
            display: none;
        }

        .feature-card {
            height: auto;
            min-height: 280px;
        }
    }
}
</style>