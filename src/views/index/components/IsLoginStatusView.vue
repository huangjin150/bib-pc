<template>
    <div class="crypto-journey-section">
        <div class="container">
            <div class="content-wrapper">
                <!-- 左侧3D图形区域 -->
                <div class="crypto-visual">
                    <div class="safe-box">
                        <img src="../../../assets/svg/bg_img.svg" alt="">
                    </div>

                </div>

                <!-- 右侧文字内容区域 -->
                <div class="content-area">
                    <h1 class="main-title">开启您的加密货币之旅</h1>
                    <p class="subtitle">安全可靠的交易平台，提供实时现货和期货交易</p>

                    <div v-if="!isLogin" class="action-buttons">
                        <button class="btn btn-register">注册</button>
                        <button class="btn btn-login">登录</button>
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
        }
    },
    computed: {
        isLogin: function () {
            return this.$store.getters.isLogin;
        },

    },
    mounted() {

    },
    methods: {

    }
}
</script>

<style scoped lang="scss">
.crypto-journey-section {
    --un-bg-opacity: 1;
    background-color: rgba(208, 245, 0, var(--un-bg-opacity));
    padding: 20px 0 0 0;
    position: relative;
    overflow: hidden;
}

.container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 20px;
}

.content-wrapper {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 60px;
}

.crypto-visual {
    flex: 1;
    position: relative;
    height: 380px;
    perspective: 1000px;
}

.safe-box {
    background-image: url('../../../assets/images/bg.397b96ce.png');
    background-repeat: no-repeat;
    background-size: cover;
    background-position: right center;
    height: 340px;
    display: flex;
    align-items: center;
    justify-content: center;
}




.box-face {
    position: absolute;
    width: 200px;
    height: 200px;
    border: 3px solid #333;
    border-radius: 10px;
}


.bitcoin-icon {
    width: 60px;
    height: 60px;
    color: #f7931a;

    svg {
        width: 100%;
        height: 100%;
    }
}

.crypto-icons {
    position: absolute;
    width: 100%;
    height: 100%;
}

.crypto-icon {
    position: absolute;
    animation: floatIcon 3s ease-in-out infinite;

    &.crypto-icon-1 {
        top: 10%;
        left: 10%;
        animation-delay: 0s;
    }

    &.crypto-icon-2 {
        top: 20%;
        right: 15%;
        animation-delay: 1s;
    }

    &.crypto-icon-3 {
        bottom: 20%;
        left: 20%;
        animation-delay: 2s;
    }

    &.crypto-icon-4 {
        bottom: 15%;
        right: 10%;
        animation-delay: 1.5s;
    }
}

.icon-base {
    width: 60px;
    height: 60px;
    background: linear-gradient(45deg, #333, #555);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.3);
    transform-style: preserve-3d;

    &::before {
        content: '';
        position: absolute;
        width: 100%;
        height: 100%;
        background: linear-gradient(45deg, #666, #444);
        border-radius: 50%;
        transform: translateZ(-10px);
        z-index: -1;
    }
}

.icon-symbol {
    color: #c4ff00;
    font-size: 24px;
    font-weight: bold;
}

.content-area {
    flex: 1;
    text-align: left;
}

.main-title {
    font-size: 48px;
    font-weight: bold;
    color: #333;
    margin-bottom: 20px;
    line-height: 1.2;
}

.subtitle {
    font-size: 18px;
    color: #666;
    margin-bottom: 40px;
    line-height: 1.5;
}

.action-buttons {
    display: flex;
    gap: 20px;
}

.btn {
    padding: 12px 30px;
    border: none;
    border-radius: 8px;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    min-width: 120px;

    &.btn-register {
        background: #fff;
        color: #333;
    }

    &.btn-login {
        background: #333;
        color: #fff;

        &:hover {
            background: #555;
        }
    }
}

// 动画效果
@keyframes rotateBox {
    0% {
        transform: translate(-50%, -50%) rotateX(-15deg) rotateY(25deg);
    }

    100% {
        transform: translate(-50%, -50%) rotateX(-15deg) rotateY(385deg);
    }
}

@keyframes floatIcon {

    0%,
    100% {
        transform: translateY(0px) rotateY(0deg);
    }

    50% {
        transform: translateY(-20px) rotateY(180deg);
    }
}

// 响应式设计
@media (max-width: 768px) {
    .content-wrapper {
        flex-direction: column;
        text-align: center;
        gap: 40px;
    }

    .crypto-visual {
        height: 300px;
    }

    .safe-box {
        width: 150px;
        height: 150px;
    }

    .box-face {
        width: 150px;
        height: 150px;
    }

    .main-title {
        font-size: 36px;
    }

    .action-buttons {
        justify-content: center;
        flex-wrap: wrap;
    }
}
</style>