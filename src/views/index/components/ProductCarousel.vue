<template>
    <div class="product-carousel">
        <div class="carousel-header">
            <h2 class="carousel-title">探索更多产品</h2>
            <p class="carousel-subtitle">为满足您的需求而设计</p>
        </div>

        <div style="position: relative;">
            <div class="swiper" ref="swiperContainer">
                <div class="swiper-wrapper">
                    <div class="swiper-slide" v-for="(item, index) in productList" :key="index">
                        <div class="product-card">
                            <div class="card-icon">
                                <img :src="item.url" alt="">
                            </div>
                            <div class="card-content">
                                <h3 class="card-title">{{ item.title }}</h3>
                                <p class="card-description">{{ item.description }}</p>
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
    name: 'ProductCarousel',
    data() {
        return {
            swiper: null,
            productList: [
                {
                    id: 1,
                    title: '产品优势',
                    description: 'BIBCEX使用尖端技术和多样化的产品来满足您的需求',
                    url: require('@/assets/svg/swiper_tip1.svg')
                },
                {
                    id: 2,
                    title: '合约',
                    description: 'BIBCEX提供以 USDT 计价的线性永续合约',
                    url: require('@/assets/svg/swiper_tip2.svg')
                },
                {
                    id: 3,
                    title: '现货',
                    description: 'BIBCEX提供多种订单类型的现货交易',
                    url: require('@/assets/svg/swiper_tip3.svg')
                },
                {
                    id: 4,
                    title: '快捷买币',
                    description: '通过多种方式交易USDT',
                    url: require('@/assets/svg/swiper_tip4.svg')
                },
                {
                    id: 5,
                    title: '行情资讯',
                    description: '通过价格趋势、交易量、资金流向和新闻，助您做出更明智的市场决策',
                    url: require('@/assets/svg/swiper_tip5.svg')
                },
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
                return
            }

            this.swiper = new Swiper(this.$refs.swiperContainer, {
                modules: [Navigation, Pagination, Autoplay],

                // 基础配置
                slidesPerView: 3,
                spaceBetween: 30,
                centeredSlides: false,
                loop: false,

                // 自动播放
                autoplay: {
                    delay: 5000,
                    disableOnInteraction: false,
                    pauseOnMouseEnter: true
                },

                // 导航
                navigation: {
                    nextEl: '.swiper-button-next',
                    prevEl: '.swiper-button-prev'
                },

                // 分页器
                pagination: {
                    el: '.swiper-pagination',
                    clickable: true,
                    type: 'bullets'
                },

                // 响应式断点
                breakpoints: {
                    320: {
                        slidesPerView: 1,
                        spaceBetween: 20
                    },
                    768: {
                        slidesPerView: 2,
                        spaceBetween: 25
                    },
                    1024: {
                        slidesPerView: 3,
                        spaceBetween: 30
                    }
                },

                // 事件回调
                on: {
                    init: function () {
                    },
                    slideChange: function () {
                    }
                }
            })
        }
    }
}
</script>

<style scoped lang="scss">
.product-carousel {
    padding: 80px 20px;
    max-width: 1240px;
    margin: 0 auto;
}

.carousel-header {
    text-align: center;
    margin-bottom: 60px;
}

.carousel-title {
    font-size: 36px;
    font-weight: 700;
    margin: 0 0 16px 0;
    line-height: 1.2;
}

.carousel-subtitle {
    font-size: 16px;
    color: #6c757d;
    margin: 0;
    font-weight: 400;
}

.swiper {
    padding: 20px;
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
    width: 99%;
    height: 100%;
    position: relative;
    transition-property: transform;
}

.product-card {
    border-radius: 16px;
    box-shadow: 1px 3px 15px rgba(0, 0, 0, 0.1);
    transition: all 0.3s ease;
    height: 480px;
    display: flex;
    flex-direction: column;
    width: 100%;

    &:hover {
        border: 1px solid #D0f500;
    }
}

.card-icon {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;

    img {
        width: 100%;
        height: auto;
        border-top-left-radius: 16px;
        border-top-right-radius: 16px;
    }
}

.card-content {
    padding: 24px;
    text-align: center;
    flex: 1;
}

.card-title {
    text-align: start;
    font-size: 20px;
    font-weight: 700;
    margin: 0 0 12px 0;
    line-height: 1.3;
}

.card-description {
    text-align: start;
    font-size: 14px;
    color: #6c757d;
    line-height: 1.5;
    margin: 0;
}

:deep(.swiper-button-prev),
:deep(.swiper-button-next) {
    z-index: 1000;
    width: 48px;
    height: 48px;
    margin-top: -24px;
    border-radius: 50%;
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
    }

    &.swiper-button-disabled {
        opacity: 0.3;
        cursor: not-allowed;

        &:hover {
            border-color: #e9ecef;
            color: #6c757d;
        }
    }
}

:deep(.swiper-button-prev) {
    left: -100px;
}

:deep(.swiper-button-next) {
    right: -100px;
}

// 自定义分页器样式
:deep(.swiper-pagination) {
    bottom: 20px;

    .swiper-pagination-bullet {
        width: 12px;
        height: 12px;
        background: #e9ecef;
        opacity: 1;
        transition: all 0.3s ease;

        &.swiper-pagination-bullet-active {
            background: #d4ff00;
            transform: scale(1.2);
        }
    }
}

// 响应式设计
@media (max-width: 768px) {
    .product-carousel {
        padding: 60px 15px;
    }

    .carousel-title {
        font-size: 28px;
    }

    :deep(.swiper-button-prev),
    :deep(.swiper-button-next) {
        display: none;
    }
}

@media (max-width: 480px) {
    .carousel-title {
        font-size: 24px;
    }

    .product-card {
        height: 400px;
    }
}

.card-icon img {
    filter: drop-shadow(#ff0 100px 0);
}
</style>