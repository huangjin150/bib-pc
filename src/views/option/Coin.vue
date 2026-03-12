<template>
    <div class="coin" :style="coinStyle"></div>
</template>

<script>
export default {
    props: {
        startPosition: {
            type: Object,
            required: true
        },
        endPosition: {
            type: Object,
            required: true
        }
    },
    data() {
        return {
            isFlying: false
        };
    },
    computed: {
        coinStyle() {
            const { x, y } = this.startPosition;
            const { targetX, targetY } = this.endPosition;
            return {
                position: 'absolute',
                top: `${y}px`,
                left: `${x}px`,
                width: '30px',
                height: '30px',
                backgroundColor: 'gold',
                borderRadius: '50%',
                transition: this.isFlying ? 'all 1s ease' : 'none',
                transform: this.isFlying
                    ? `translate(${targetX - x}px, ${targetY - y}px)`
                    : ''
            };
        }
    },
    methods: {
        startAnimation() {
            this.isFlying = true;
            setTimeout(() => {
                this.$emit('animation-complete');
            }, 1000); // 动画完成后通知父组件
        }
    },
    mounted() {
        this.startAnimation();
    }
};
</script>

<style scoped>
.coin {
    background-color: gold;
    border-radius: 50%;
    animation: explode 1s ease-out;
}

@keyframes explode {
    0% {
        transform: scale(1);
        opacity: 1;
    }

    100% {
        transform: scale(2);
        opacity: 0;
    }
}
</style>