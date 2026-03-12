<template>
    <svg :fill="fill" :height="size" :width="size" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"
        :class="className">
        <path
            d="M2.5 15.8333H17.5V17.5H2.5V15.8333ZM10.8333 10.9766L15.8925 5.91663L17.0708 7.09496L10 14.1666L2.92917 7.09579L4.1075 5.91663L9.16667 10.975V1.66663H10.8333V10.9766Z"
            fill="currentColor" />
    </svg>
</template>

<script>
export default {
    name: 'DownloadIcon',
    props: {
        size: {
            type: [String, Number],
            default: 20
        },
        fill: {
            type: String,
            default: 'none'
        },
        className: {
            type: String,
            default: ''
        }
    }
}
</script>

<style scoped>
svg {
    display: inline-block;
    vertical-align: middle;
}
</style>