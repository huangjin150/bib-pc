<template>
    <div class="swiper-banner-container">
        <div class="swiper-container" ref="swiperContainer">
            <div class="swiper-wrapper">
                <div v-for="(item, index) in bannerList" :key="index" class="swiper-slide">
                    <div class="banner-card" :style="{ background: item.background }">
                        <!-- 内容区域 -->
                        <div class="content-wrapper">

                            <div class="icon-section">
                                <div class="main-icon">
                                    <img :src="item.mainIcon" :alt="item.title" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- 导航按钮 -->
            <div class="swiper-button-next"></div>
            <div class="swiper-button-prev"></div>
        </div>
    </div>
</template>

<script>
import Swiper, { Navigation, Pagination, Autoplay } from 'swiper'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'

Swiper.use([Navigation, Pagination, Autoplay])

export default {
    name: 'SwiperBanner',
    data() {
        return {
            swiper: null,
            bannerList: [
                {
                    mainIcon: require('@/assets/images/swiper1.png'),
                },
                {
                    mainIcon: require('@/assets/images/swiper2.png'),
                },
                {
                    mainIcon: require('@/assets/images/swiper3.png'),
                },
                {
                    mainIcon: require('@/assets/images/swiper4.png'),
                }
            ]
        }
    },
    mounted() {
        this.initSwiper()
    },
    beforeDestroy() {
        if (this.swiper) {
            this.swiper.destroy()
        }
    },
    methods: {
        initSwiper() {
            this.$nextTick(() => {
                this.swiper = new Swiper(this.$refs.swiperContainer, {
                    // 基础配置
                    slidesPerView: 'auto',
                    spaceBetween: 20,
                    centeredSlides: false,
                    loop: true,

                    // 自动播放
                    autoplay: {
                        delay: 4000,
                        disableOnInteraction: false,
                    },

                    // 导航
                    navigation: {
                        nextEl: '.swiper-button-next',
                        prevEl: '.swiper-button-prev',
                    },

                    // 分页器
                    pagination: {
                        el: '.swiper-pagination',
                        clickable: true,
                        dynamicBullets: true,
                    },

                    // 响应式断点
                    breakpoints: {
                        320: {
                            slidesPerView: 1,
                            spaceBetween: 10
                        },
                        768: {
                            slidesPerView: 2,
                            spaceBetween: 15
                        },
                        1024: {
                            slidesPerView: 3,
                            spaceBetween: 20
                        },
                        1200: {
                            slidesPerView: 4,
                            spaceBetween: 20
                        }
                    },

                    // 鼠标悬停暂停

                })
            })
        }
    }
}
</script>

<style scoped lang="scss">
.swiper-banner-container {
    width: 100%;
    max-width: 1260px;
    margin: 0 auto;
    margin-top: 40px;
    position: relative;
}

.swiper-container {
    width: 100%;
    overflow: visible;
}

.swiper-slide {
    width: 300px;
    height: 150px;
}

.banner-card {
    position: relative;
    width: 100%;
    height: 100%;
    border-radius: 12px;
    overflow: hidden;
    color: white;
    cursor: pointer;
    transition: all 0.3s ease;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);

    &:hover {
        transform: translateY(-5px);
        box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);
    }
}

.brand-logo {
    position: absolute;
    top: 12px;
    left: 16px;
    z-index: 10;

    .logo {
        height: 20px;
        width: auto;
        filter: brightness(0) invert(1);
    }
}

.content-wrapper {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 100%;
    position: relative;
    z-index: 5;
}

.text-section {
    flex: 1;
    padding-right: 16px;
}

.title {
    font-size: 16px;
    font-weight: bold;
    margin: 0 0 4px 0;
    color: #ffffff;
    line-height: 1.2;
}

.subtitle {
    font-size: 12px;
    color: #cccccc;
    margin: 0 0 2px 0;
    line-height: 1.2;
}

.description {
    font-size: 10px;
    color: #aaaaaa;
    margin: 0;
    line-height: 1.2;
}

.icon-section {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
}

.main-icon {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;

    img {
        width: 100%;
        height: 100%;
        object-fit: contain;
    }
}

.coin-icons {
    position: absolute;
    top: -5px;
    right: -5px;
    display: flex;
    flex-direction: column;
    gap: 2px;
}

.coin-item {
    width: 24px;
    height: 24px;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.2);
    animation: float 2s ease-in-out infinite;

    img {
        width: 16px;
        height: 16px;
        object-fit: contain;
    }
}

@keyframes float {

    0%,
    100% {
        transform: translateY(0px);
    }

    50% {
        transform: translateY(-3px);
    }
}

:deep(.swiper-button-next),
:deep(.swiper-button-prev) {

    border: 1px solid #eaeaed;
    color: #333;
    width: 40px;
    height: 40px;
    border-radius: 50%;

    &:after {
        font-size: 16px;
        font-weight: bold;
    }

    &:hover {
        background: rgba(0, 0, 0, 0.7);
    }
}

:deep(.swiper-button-next) {
    right: -100px;
}

:deep(.swiper-button-prev) {
    left: -100px;
}

:deep(.swiper-pagination) {
    bottom: -30px;

    .swiper-pagination-bullet {
        width: 8px;
        height: 8px;
        background: #cccccc;
        opacity: 0.5;

        &.swiper-pagination-bullet-active {
            background: #007bff;
            opacity: 1;
        }
    }
}

/* 响应式设计 */
@media (max-width: 768px) {
    .swiper-slide {
        width: 260px;
    }

    .title {
        font-size: 14px;
    }

    .subtitle {
        font-size: 11px;
    }

    .description {
        font-size: 9px;
    }

    .icon-section {
        width: 60px;
        height: 60px;
    }

    .main-icon {
        width: 40px;
        height: 40px;
    }
}

@media (max-width: 480px) {
    .swiper-slide {
        width: 100%;
    }

    :deep(.swiper-button-next),
    :deep(.swiper-button-prev) {
        display: none;
    }
}
</style>