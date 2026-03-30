const fs = require('fs');

const filePath = 'c:\\frontend\\bib-pc\\src\\views\\swap\\SwapIndex.vue';
let content = fs.readFileSync(filePath, 'utf-8');

const startMarker = '      <!-- 成交记录 -->';
const endMarker = '    <!-- 弹出框: 变更仓位模式 -->';

const newBlock = `      <!-- 成交记录 / 下单区域 -->
      <div class="left plate-wrap box3 new-trade-panel" style="position:relative;width: 20%;">
        <div class="trade-panel-inner">
          <!-- 顶部 Tabs -->
          <div class="trade-tabs">
            <div class="trade-tab active">开仓</div>
            <div class="trade-tab">平仓</div>
          </div>

          <!-- 全仓/逐仓 与 杠杆 -->
          <div class="margin-leverage-row">
            <div class="ml-dropdown" @click="showMarginModeModal()">
              <span>{{ marginMode === '0' ? '全仓' : '逐仓' }} 合仓</span>
              <span class="arrow">▼</span>
            </div>
            <div class="ml-dropdown green-text" @click="showAdjustLeverage(1)">
              <span>{{ leverage }}x</span>
              <span class="arrow">▼</span>
            </div>
            <div class="ml-dropdown red-text" @click="showAdjustLeverage(1)">
              <span>{{ leverage }}x</span>
              <span class="arrow">▼</span>
            </div>
          </div>

          <!-- 订单类型 -->
          <div class="order-types-row">
            <span class="order-type-item" :class="{ active: entrustOrderType == '1' }" @click="changeEntrustOrderType('1')">限价单</span>
            <span class="order-type-item" :class="{ active: entrustOrderType == '0' }" @click="changeEntrustOrderType('0')">市价单</span>
            <span class="order-type-item" :class="{ active: entrustOrderType == '2' }" @click="changeEntrustOrderType('2')">计划委托</span>
            <span class="order-type-icon">
              <!-- placeholder for setting icon -->
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#888" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="4" y1="21" x2="4" y2="14"></line><line x1="4" y1="10" x2="4" y2="3"></line><line x1="12" y1="21" x2="12" y2="12"></line><line x1="12" y1="8" x2="12" y2="3"></line><line x1="20" y1="21" x2="20" y2="16"></line><line x1="20" y1="12" x2="20" y2="3"></line><line x1="1" y1="14" x2="7" y2="14"></line><line x1="9" y1="8" x2="15" y2="8"></line><line x1="17" y1="16" x2="23" y2="16"></line></svg>
            </span>
          </div>

          <!-- 可用 -->
          <div class="available-row">
            <span class="label">可用</span>
            <span class="value">{{ freeMargin() | fixed4 }}USDT <span style="color: #b5d820; cursor: pointer; margin-left: 4px;" @click="$router.push('/assets/transfer')">⇌</span></span>
          </div>

          <!-- 表单区域 (只保留开仓逻辑) -->
          <div class="trade-form">
            <!-- 委托价格 (如果非市价单) -->
            <div class="input-box-wrapper" v-if="entrustOrderType == '1'">
              <div class="input-box">
                <input type="text" :placeholder="$t('swap.entrustprice')" v-model="form.entrustPrice" @keyup="form.entrustPrice = form.entrustPrice.replace(/[^\\d^\\.]+/g, '')" />
                <div class="suffix">
                  <span>{{ currentCoin.base }}</span>
                </div>
              </div>
            </div>

            <!-- 触发价格 (如果是计划委托) -->
            <div class="input-box-wrapper" v-if="entrustOrderType == '2'">
              <div class="input-box">
                <input type="text" :placeholder="$t('swap.triggleprice')" v-model="form.triggerPrice" @keyup="form.triggerPrice = form.triggerPrice.replace(/[^\\d^\\.]+/g, '')" />
                <div class="suffix">
                  <span>{{ currentCoin.base }}</span>
                </div>
              </div>
            </div>
            
            <div class="input-box-wrapper" v-if="entrustOrderType == '2'">
              <div class="input-box">
                <input type="text" :placeholder="$t('swap.entrustprice')" v-model="form.entrustPrice" @keyup="form.entrustPrice = form.entrustPrice.replace(/[^\\d^\\.]+/g, '')" />
                <div class="suffix">
                  <span>{{ currentCoin.base }}</span>
                </div>
              </div>
            </div>

            <!-- 市价单提示 -->
            <div class="input-box-wrapper" v-if="entrustOrderType == '0'">
              <div class="input-box disabled">
                <input type="text" :value="$t('swap.marketpriceplaceholder')" disabled />
              </div>
            </div>

            <!-- 保证金/数量 输入框 -->
            <div class="input-box-wrapper margin-input-wrapper">
              <div class="input-box">
                <input type="text" placeholder="保证金" v-model="form.volume" @keyup="form.volume = form.volume.replace(/[^\\d^\\.]+/g, '')" />
                <div class="suffix suffix-dropdown">
                  <span>保证金</span>
                  <span class="arrow">▼</span>
                </div>
              </div>
            </div>

            <!-- 滑块 -->
            <div class="slider-wrapper">
              <div class="slider-track-container">
                <div class="slider-track">
                  <div class="slider-fill" :style="{ width: sliderOpenPercent + '%' }"></div>
                  <div class="slider-points">
                    <div class="point" :class="{ active: sliderOpenPercent >= 0 }" @click="onChangeOpenPercent(0)"></div>
                    <div class="point" :class="{ active: sliderOpenPercent >= 25 }" @click="onChangeOpenPercent(25)"></div>
                    <div class="point" :class="{ active: sliderOpenPercent >= 50 }" @click="onChangeOpenPercent(50)"></div>
                    <div class="point" :class="{ active: sliderOpenPercent >= 75 }" @click="onChangeOpenPercent(75)"></div>
                    <div class="point" :class="{ active: sliderOpenPercent >= 100 }" @click="onChangeOpenPercent(100)"></div>
                  </div>
                </div>
              </div>
              <div class="slider-labels">
                <span>0%</span>
                <span>25%</span>
                <span>50%</span>
                <span>75%</span>
                <span>100%</span>
              </div>
            </div>

            <!-- 止盈止损 -->
            <div class="tpsl-row">
              <label class="custom-checkbox">
                <input type="checkbox" />
                <span class="checkmark" @click="profitLossModel = true"></span>
                <span class="label-text" style="border-bottom: 1px dashed #fff; padding-bottom: 1px; margin-left: 5px;" @click="profitLossModel = true">止盈止损</span>
              </label>
            </div>

            <!-- 充值/开仓 按钮 -->
            <div class="submit-btn-row">
              <button v-if="!isLogin" class="submit-btn green-bg" @click="$router.push('/login')">登录 / 注册</button>
              <button v-else-if="contractWalletInfo.usdtBalance === 0" class="submit-btn green-bg" @click="$router.push('/assets/transfer')">充值</button>
              <div v-else style="display: flex; gap: 10px; width: 100%;">
                <button class="submit-btn green-bg" style="flex: 1; padding: 12px 0;" @click="onOpen(0)">买入开多</button>
                <button class="submit-btn red-bg" style="flex: 1; padding: 12px 0;" @click="onOpen(1)">卖出开空</button>
              </div>
            </div>
          </div>

          <!-- 资产列表 -->
          <div class="assets-section">
            <div class="assets-header">
              <div class="left">资产 <span class="eye-icon" style="margin-left: 5px;">👁</span></div>
              <div class="right">USDT <span class="arrow">▼</span></div>
            </div>
            <div class="assets-list">
              <div class="asset-item"><span class="label">币种权益</span><span class="value">--</span></div>
              <div class="asset-item"><span class="label">可用保证金</span><span class="value">{{ freeMargin() | fixed4 }}</span></div>
              <div class="asset-item"><span class="label">持仓保证金</span><span class="value">{{ bonds() | fixed4 }}</span></div>
              <div class="asset-item"><span class="label">未实现盈亏</span><span class="value">{{ unrealizedProfitAndLoss() | fixed4 }}</span></div>
              <div class="asset-item"><span class="label">抵扣金</span><span class="value">--</span></div>
              <div class="asset-item"><span class="label">体验金</span><span class="value">--</span></div>
            </div>
            <div class="assets-actions">
              <button class="action-btn outline" @click="$router.push('/assets/transfer')">划转</button>
              <button class="action-btn outline" @click="$router.push('/assets/transfer')">充值</button>
            </div>
          </div>

          <!-- 合约信息 -->
          <div class="contract-info-section">
            <div class="contract-info-header">
              合约信息 <span class="arrow" style="float: right;">▼</span>
            </div>
          </div>

        </div>
      </div>
    </div>`;

const startIndex = content.indexOf(startMarker);
const endIndex = content.indexOf(endMarker);

if (startIndex !== -1 && endIndex !== -1) {
    const before = content.substring(0, startIndex);
    const after = content.substring(endIndex);
    fs.writeFileSync(filePath, before + newBlock + '\n\n    ' + after);
    console.log("Replaced");
} else {
    console.log("Marker not found");
}
