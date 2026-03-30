const fs = require('fs');

const filePath = 'c:\\frontend\\bib-pc\\src\\views\\swap\\SwapIndex.vue';
let content = fs.readFileSync(filePath, 'utf-8');

const startMarker = '    <!-- 弹出框: 调整杠杆 -->';
const endMarker = '    <!-- 弹出框: 设置止盈止损 -->';

const newBlock = `    <!-- 弹出框: 调整杠杆 -->
    <Modal v-model="leverageModal" title="" width="450" class-name="vertical-center-modal custom-leverage-modal" :footer-hide="true" :closable="false">
      <div class="modal-header">
        <span class="title">调整杠杆</span>
        <span class="close-icon" @click="leverageModal = false">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#888" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
        </span>
      </div>

      <div class="leverage-content">
        <!-- Info tags row -->
        <div class="info-tags">
          <span class="symbol">{{ currentCoin.symbol ? currentCoin.symbol.replace('/', '') : '' }}</span>
          <span class="tag gray">{{ marginMode === '0' ? '全仓' : '逐仓' }} 合仓</span>
          <span class="tag green" v-if="changeLeverageType == 1">做多</span>
          <span class="tag red" v-else>做空</span>
          <span class="tag green">{{ leverageAdjustVal }}x</span>
        </div>

        <!-- Input Box -->
        <div class="leverage-input-box">
          <input type="number" v-model.number="leverageAdjustVal" @input="onLeverageChange(leverageAdjustVal)" />
        </div>

        <!-- Custom Slider -->
        <div class="leverage-slider">
          <div class="custom-range-slider">
            <input type="range" :min="1" :max="contractCoinInfo && contractCoinInfo.leverage ? Number(contractCoinInfo.leverage.split(',').pop()) : 200" v-model.number="leverageAdjustVal" class="range-input" />
            <div class="range-track">
              <div class="range-fill" :style="{ width: ((leverageAdjustVal - 1) / ((contractCoinInfo && contractCoinInfo.leverage ? Number(contractCoinInfo.leverage.split(',').pop()) : 200) - 1) * 100) + '%' }"></div>
              <div class="range-thumb" :style="{ left: ((leverageAdjustVal - 1) / ((contractCoinInfo && contractCoinInfo.leverage ? Number(contractCoinInfo.leverage.split(',').pop()) : 200) - 1) * 100) + '%' }">
                <div class="thumb-circle"></div>
                <div class="thumb-circle"></div>
              </div>
            </div>
            <div class="range-marks">
               <span>1x</span>
               <span>40x</span>
               <span>80x</span>
               <span>120x</span>
               <span>160x</span>
               <span>200x</span>
            </div>
          </div>
        </div>

        <!-- Quick Select -->
        <div class="leverage-quick-select" v-if="leverageType == 1">
          <div class="quick-items">
            <span v-for="item in leverageList" :key="item" 
                  class="quick-item" :class="{ active: Number(item) === leverageAdjustVal }"
                  @click="changeLeverage(Number(item))">
              {{ item }}x
            </span>
          </div>
          <span class="scroll-arrow">❯</span>
        </div>
        
        <div class="leverage-quick-select" v-if="leverageType == 2">
          <div class="quick-items">
            <span v-for="item in [1, 2, 3, 5, 10, 20, 30, 50, 75, 100, 125, 150, 200]" :key="item" 
                  class="quick-item" :class="{ active: leverageAdjustVal === item }"
                  @click="changeLeverage(item)">
              {{ item }}x
            </span>
          </div>
          <span class="scroll-arrow">❯</span>
        </div>

        <!-- Info Text -->
        <div class="leverage-info-text">
          <p>当前杠杆倍数最大可开 <span style="color: #fff; font-weight: bold;">0.0000 USDT</span></p>
          <p>当前仓位占用保证金 <span style="color: #fff; font-weight: bold;">0 USDT</span></p>
          <p class="link">查看完整仓位档位说明 ❯</p>
        </div>

        <!-- Footer Buttons -->
        <div class="leverage-footer-btns">
          <button class="btn-cancel" @click="leverageModal = false">取消</button>
          <button class="btn-confirm" @click="adjustLeverage()">确认</button>
        </div>
      </div>
    </Modal>`;

const startIndex = content.indexOf(startMarker);
const endIndex = content.indexOf(endMarker);

if (startIndex !== -1 && endIndex !== -1) {
    const before = content.substring(0, startIndex);
    const after = content.substring(endIndex);
    fs.writeFileSync(filePath, before + newBlock + '\n\n    ' + after);
    console.log('Replaced Leverage Modal structure.');
} else {
    console.log('Marker not found');
}
