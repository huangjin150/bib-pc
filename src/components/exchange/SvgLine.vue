<template>
    <svg :style="{ height: opts.height + 'px', width: opts.width + 'px' }">
        <defs>
            <!-- 上涨渐变 -->
            <linearGradient id="upGradient" x1="0%" y1="100%" x2="0%" y2="0%">
                <stop offset="0%" :stop-color="gradientColors.up.start" stop-opacity="0.1" />
                <stop offset="100%" :stop-color="gradientColors.up.end" stop-opacity="0.8" />
            </linearGradient>
            <!-- 下跌渐变 -->
            <linearGradient id="downGradient" x1="0%" y1="100%" x2="0%" y2="0%">
                <stop offset="0%" :stop-color="gradientColors.down.start" stop-opacity="0.1" />
                <stop offset="100%" :stop-color="gradientColors.down.end" stop-opacity="0.8" />
            </linearGradient>
        </defs>
        <polygon :fill="gradientFill" :points="polygonPoints">
        </polygon>
        <polyline fill="none" :points="polylinePoints" :stroke="sColor" :stroke-width="opts.strokeWidth"
            stroke-linecap="square">
        </polyline>
    </svg>
</template>
<script>
export default {
    data: function () {
        return {
            coords: [],
            opts: { strokeWidth: 1 },
            pColor: '#c6d9fd',
            sColor: '#4d89f9',
            gradientColors: {
                up: {
                    start: '#84cc16',
                    end: '#66a488'
                },
                down: {
                    start: '#f43f5e',
                    end: '#e67f7f'
                }
            }
        }
    },
    props: {
        values: {
            type: Array,
            required: true
        },
        width: {
            type: Number,
            required: false
        },
        height: {
            type: Number,
            required: false
        },
        rose: {
            type: String,
            required: false
        }
    },
    created: function () {
        this.opts.width = this.width || 120;
        this.opts.height = this.height || 50;
        this.opts.rose = this.rose || 0;
        if (parseFloat(this.opts.rose) < 0) {
            this.pColor = "#f39494";  // 下跌时的填充色（粉红色）
            this.sColor = "#f43f5e";  // 下跌时的线条色（红色）
        } else {
            this.pColor = "#84cc16";  // 上涨时的填充色（绿色）
            this.sColor = "#84cc16";  // 上涨时的线条色（深绿色）
        }
        this.draw();
    },
    computed: {
        polylinePoints: function () {
            return this.coords.slice(2, this.coords.length - 2).join(' ');
        },
        polygonPoints: function () {
            return this.coords.join(' ');
        },
        gradientFill: function () {
            return parseFloat(this.opts.rose) < 0 ? 'url(#downGradient)' : 'url(#upGradient)';
        }
    },
    mounted: function () {

    },
    methods: {
        draw() {
            var opts = this.opts;
            var values = this.values;
            if (values.length == 1) values.push(values[0])
            var max = Math.max.apply(Math, opts.max == undefined ? values : values.concat(opts.max))
                , min = Math.min.apply(Math, opts.min == undefined ? values : values.concat(opts.min))

            var strokeWidth = opts.strokeWidth
                , width = opts.width
                , height = opts.height - strokeWidth
                , diff = max - min

            var xScale = this.x = function (input) {
                return input * (width / (values.length - 1))
            }

            var yScale = this.y = function (input) {
                var y = height

                if (diff) {
                    y -= ((input - min) / diff) * height
                }

                return y + strokeWidth / 2
            }

            var zero = yScale(Math.max(min, 0));
            this.coords = [];
            this.coords = [0, zero]

            for (var i = 0; i < values.length; i++) {
                this.coords.push(
                    xScale(i),
                    yScale(values[i])
                )
            }

            this.coords.push(width, zero);
        }
    }
}
</script>
