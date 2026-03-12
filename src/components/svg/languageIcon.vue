<template>
    <svg :fill="fill" :height="size" :width="size" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"
        :class="className">
        <g clip-path="url(#clip0_229_3004)">
            <path d="M10 2.58301C13.8892 6.68884 13.8892 13.3105 10 17.4163" stroke="currentColor" stroke-width="1.5"
                stroke-linecap="round" stroke-linejoin="round"></path>
            <path d="M9.99988 17.4163C6.11072 13.3105 6.11072 6.68884 9.99988 2.58301" stroke="currentColor"
                stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
            <path d="M10 2.5C14.1517 2.5 17.5 5.84833 17.5 10C17.5 14.1517 14.1517 17.5 10 17.5" stroke="currentColor"
                stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
            <path d="M10 17.5C5.84833 17.5 2.5 14.1517 2.5 10C2.5 5.84833 5.84833 2.5 10 2.5" stroke="currentColor"
                stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
            <path d="M2.92505 7.5H17.0751" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"
                stroke-linejoin="round"></path>
            <path d="M2.92505 12.5H17.0751" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"
                stroke-linejoin="round"></path>
        </g>
        <defs>
            <clipPath id="clip0_229_3004">
                <rect width="20" height="20" fill="white"></rect>
            </clipPath>
        </defs>
    </svg>
</template>

<script>
export default {
    name: 'LanguangeIcon',
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