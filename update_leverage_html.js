const fs = require('fs');

const filePath = 'c:\\frontend\\bib-pc\\src\\views\\swap\\SwapIndex.vue';
let content = fs.readFileSync(filePath, 'utf-8');

// The new UI structure keeping original components
const customModal = `    <!-- 弹出框: 调整杠杆 -->
    <Modal v-model="leverageModal" title="调整杠杆" width="25" class-name="vertical-center-modal custom-leverage-modal">
      <div class="leverage-custom-content">
        <div class="leverage-info-header">
          <span class="symbol-name">{{ currentCoin.symbol ? currentCoin.symbol.replace('/', '') : '' }}</span>
          <span class="mode-tag">{{ marginMode === '0' ? '全仓' : '逐仓' }} 合仓</span>
          <span class="direction-tag" :class="changeLeverageType == 1 ? 'green' : 'red'">{{ changeLeverageType == 1 ? '做多' : '做空' }}</span>
          <span class="leverage-tag">{{ leverageAdjustVal }}x</span>
        </div>

        <div class="leverage-input-wrapper">
          <InputNumber size="large" style="width: 100%;" :value.sync="leverageAdjustVal" v-if="leverageType == 2" @on-change="onLeverageChange"></InputNumber>
          <div class="discrete-leverage-display" v-else>
            {{ leverageAdjustVal }}
          </div>
        </div>

        <div class="leverage-slider-wrapper" v-if="leverageType == 2">
          <!-- We keep the original functionality but style it later, using a simple range input for visual effect as requested, synced with InputNumber -->
          <input type="range" :min="1" :max="contractCoinInfo && contractCoinInfo.leverage ? Number(contractCoinInfo.leverage.split(',').pop()) : 200" v-model.number="leverageAdjustVal" class="custom-range-slider" @input="onLeverageChange(leverageAdjustVal)" />
          <div class="range-labels">
            <span>1x</span>
            <span>40x</span>
            <span>80x</span>
            <span>120x</span>
            <span>160x</span>
            <span>200x</span>
          </div>
        </div>

        <!-- 离散杠杆快速选择区 -->
        <div class="leverage-quick-select" v-if="leverageType == 1">
          <div class="quick-items">
            <span v-for="item in leverageList" :key="item" 
                  class="quick-item" :class="{ active: Number(item) === leverageAdjustVal }"
                  @click="changeLeverage(Number(item))">
              {{ item }}x
            </span>
          </div>
        </div>
        
        <div class="leverage-quick-select" v-if="leverageType == 2">
          <div class="quick-items">
            <span v-for="item in [1, 2, 3, 5, 10, 20, 30, 50, 75, 100, 125, 150, 200]" :key="item" 
                  class="quick-item" :class="{ active: leverageAdjustVal === item }"
                  @click="changeLeverage(item)">
              {{ item }}x
            </span>
          </div>
        </div>

        <div class="leverage-details">
          <div class="detail-row">
            <span>当前杠杆倍数最大可开</span>
            <span class="val">0.0000 USDT</span>
          </div>
          <div class="detail-row">
            <span>当前仓位占用保证金</span>
            <span class="val">0 USDT</span>
          </div>
          <div class="detail-link">查看完整仓位档位说明 ❯</div>
        </div>
      </div>
      <div slot="footer" class="custom-modal-footer">
        <Button class="btn-cancel" size="large" @click="leverageModal = false">{{ $t("common.close") }}</Button>
        <Button class="btn-confirm" size="large" @click="adjustLeverage()">{{ $t("common.ok") }}</Button>
      </div>
    </Modal>`;

const newModalRegex = /    <!-- 弹出框: 调整杠杆 -->[\s\S]*?<\/Modal>/;

if (newModalRegex.test(content)) {
    content = content.replace(newModalRegex, customModal);
    fs.writeFileSync(filePath, content);
    console.log("Updated leverage modal HTML.");
} else {
    console.log("Could not find modal to replace.");
}
