<template>
    <div class="vertical-carousel-container">
        <div class="carousel-content">
            <div class="phone-container">
                <div style="width: 424px; height: auto; position: absolute; "><img style="width: 424px; height: 100%; "
                        src="../../../assets/images/banner-phone.png" alt=""></div>
                <div class="slides-container">
                    <transition-group name="slide-fade" tag="div" class="slide-wrapper">
                        <div v-for="(slide, index) in slides" :key="index" v-show="index === currentIndex"
                            class="slide-item">
                            <div style="position: absolute; width: 355px; height: 664px; top: 30px; left: 27px;">
                                <img style=" width: 100%; position: absolute;" :src="slide.url" alt="">
                            </div>
                        </div>
                    </transition-group>
                </div>
            </div>
            <div class="carousel-header">
                <div class="flex">
                    <h2 class="carousel-title">开始交易</h2>
                    <div class="carousel-navigation">
                        <button class="nav-btn prev-btn" @click="slidePrev">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                                <path d="M15 18L9 12L15 6" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                                    stroke-linejoin="round" />
                            </svg>
                        </button>
                        <button class="nav-btn next-btn" @click="slideNext">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                                <path d="M9 18L15 12L9 6" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                                    stroke-linejoin="round" />
                            </svg>
                        </button>
                    </div>
                </div>
                <p class="carousel-subtitle">仅需5个简单步骤即可开启加密之旅</p>
                <div>
                    <!-- 竖向轮播指示器 -->
                    <div class="carousel-indicators">
                        <div class="indicators-container"
                            :style="{ transform: `translateY(-${indicatorOffset * 200}px)` }">
                            <div v-for="(slide, index) in slides" :key="index" class="indicator"
                                :class="{ active: index === currentIndex }" @click="goToSlide(index)">
                                <div class="flex_alicenter" style="padding: 48px 0; border-bottom: 1px solid #eaeaed;">
                                    <div class="indicator_num">{{ slide.number }}</div>
                                    <div style="margin-left: 25px;">
                                        <div class="indicator_label">
                                            {{ slide.title }}
                                        </div>
                                        <div class="indicator_description">
                                            {{ slide.description }}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'VerticalCarousel',
    data() {
        return {
            currentIndex: 0,
            slides: [
                {
                    number: '01',
                    title: '创建账户',
                    description: '使用电子邮件或手机号注册',
                    url: require('@/assets/images/phone1.png')
                },
                {
                    number: '02',
                    title: '探索市场',
                    description: '浏览市场交易机会',
                    url: require('@/assets/images/phone2.png')
                },
                {
                    number: '03',
                    title: '新用户充值',
                    description: '完成首次充值开始交易',
                    url: require('@/assets/images/phone3.png')
                },
                {
                    number: '04',
                    title: '身份验证',
                    description: '完成KYC验证，提升资产安全性',
                    url: require('@/assets/images/phone4.png')
                },
                {
                    number: '05',
                    title: '开始交易',
                    description: '购买您喜爱的加密货币',
                    url: require('@/assets/images/phone5.png')
                }
            ]
        }
    },
    methods: {
        slideNext() {
            this.currentIndex = (this.currentIndex + 1) % this.slides.length
        },
        slidePrev() {
            this.currentIndex = this.currentIndex === 0 ? this.slides.length - 1 : this.currentIndex - 1
        },
        goToSlide(index) {
            this.currentIndex = index
        }
    },
    computed: {
        indicatorOffset() {
            if (this.currentIndex <= 1) return 0
            if (this.currentIndex >= this.slides.length - 2) return this.slides.length - 3
            return this.currentIndex - 1
        }
    },
}
</script>

<style scoped lang="scss">
.vertical-carousel-container {
    max-width: 1200px;
    margin: 80px auto;
    display: flex;
    gap: 80px;
    align-items: center;

    @media (max-width: 768px) {
        flex-direction: column;
        gap: 40px;
        margin: 60px auto;
    }
}

.carousel-header {
    flex: 1;

    .carousel-title {
        font-size: 40px;
        font-weight: 700;
        color: #000;
        margin-bottom: 16px;
        line-height: 1.2;

        @media (max-width: 768px) {
            font-size: 36px;
            text-align: center;
        }
    }

    .carousel-subtitle {
        font-size: 18px;
        text-align: start;
        color: #6c757d;
        margin-bottom: 40px;
        line-height: 1.5;

        @media (max-width: 768px) {
            text-align: center;
            font-size: 16px;
        }
    }

    .carousel-navigation {
        display: flex;
        gap: 12px;

        @media (max-width: 768px) {
            justify-content: center;
        }

        .nav-btn {
            width: 48px;
            height: 48px;
            border: 2px solid #e9ecef;
            background: #fff;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            transition: all 0.3s ease;
            color: #6c757d;
            z-index: 10;
            position: relative;

            &:hover {
                border-color: #d4ff00;
                background: #d4ff00;
                color: #000;
                transform: scale(1.05);
            }

            &:active {
                transform: scale(0.95);
            }
        }
    }
}

.carousel-content {
    width: 100%;
    display: flex;
    gap: 40px;

    @media (max-width: 768px) {
        flex-direction: column;
        gap: 30px;
    }
}

.phone-container {
    flex: 1;
    width: 460px;
    height: 700px;
    border-radius: 16px;
    overflow: hidden;
    position: relative;
}

.slides-container {
    width: 100%;
    height: 100%;
    position: relative;
}

.slide-wrapper {
    width: 100%;
    height: 100%;
    position: relative;
}

.slide-item {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
}

.slide-fade-enter-active,
.slide-fade-leave-active {
    transition: all 0.6s ease;
}

.slide-fade-enter-from {
    opacity: 0;
}

.slide-fade-leave-to {
    opacity: 0;
}

.slide-fade-enter-to,
.slide-fade-leave-from {
    opacity: 1;
    transform: translateY(0);
}

.carousel-indicators {
    height: 600px;
    overflow: hidden;
    position: relative;
    z-index: 10;

    @media (max-width: 768px) {
        height: auto;
        overflow: visible;
    }

    .indicators-container {
        transition: transform 0.3s ease;

        @media (max-width: 768px) {
            display: flex;
            flex-direction: row;
            justify-content: center;
            transform: none !important;
        }
    }

    .indicator {
        opacity: 0.5;
        transition: opacity 0.3s ease;
        cursor: pointer;
        height: 200px; // 固定每个指示器的高度

        &:hover {
            opacity: 0.8;
        }

        &.active {
            color: #000;
            opacity: 1;
        }

        @media (max-width: 768px) {
            height: auto;
            flex: 1;
            min-width: 200px;
        }

        .indicator_num {
            background-color: rgba(248, 248, 248);
            width: 86px;
            height: 86px;
            border-radius: 9999px;
            line-height: 86px;
            text-align: center;
            font-size: 26px;
            font-weight: 700;
            transition: all 0.3s ease;
        }

        &.active .indicator_num {
            color: #000;
        }

        .indicator_label {
            font-size: 24px;
            font-weight: 700;
        }

        .indicator_description {
            font-size: 16px;
        }
    }
}
</style>