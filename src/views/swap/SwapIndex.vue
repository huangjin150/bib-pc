<template>
  <div class="swap" :class="skin">
    <!-- <section v-loading="loading"></section> -->
    <div class="symbol">
      <div class="item" @mouseenter="showPopup = true" @mouseleave="showPopup = false">
        <div class="coin-box">
          <div>
            <img style="width: 24px; height: 24px;" :src="currentCoin.logo" alt="">
          </div>
          <div>
            <div class="coin">{{ currentCoin.symbol }}</div>
            <div style="font-size: 12px; color: #8e8e92;">{{ $t("swap.swapindex") }}</div>
          </div>
        </div>
        <!-- 悬浮框内容 -->
        <div v-if="showPopup" class="popup">
          <div class="">
            <div class="coin-menu">
              <div style="padding: 8px 10px;height:48px;">
                <Input search :placeholder="$t('common.searchplaceholderswap')" @on-change="seachInputChange"
                  v-model="searchKey" />
              </div>
              <div class="sc_filter" style="display: none;">
                <span @click="changeBaseCion('usdt')" :class="{ active: basecion === 'usdt' }">USDT</span>
              </div>
              <Table height="463" @on-current-change="gohref" highlight-row id="USDT" v-show="basecion === 'usdt'"
                :columns="coins.columns" :data="dataIndex"></Table>
            </div>
          </div>
        </div>
      </div>
      <div class="item" style="width: 100px;">
        <div class="num" style="font-size: 14px; font-weight: 700;"
          :class="{ buy: currentCoin.change > 0, sell: currentCoin.change < 0 }">{{
            currentCoin.close }}</div>
        <div class="price-cny">≈ ${{ currentCoin.close }}</div>
      </div>
      <div class="item">
        <span class="text">资金费率</span>
        <span class="num ">{{ currentCoin.feePercent }}</span>
      </div>
      <div class="item">
        <span class="text">{{ $t('service.Change') }}</span>
        <span class="num" :class="{ buy: currentCoin.change > 0, sell: currentCoin.change < 0 }">{{
          currentCoin.rose
        }}</span>
      </div>
      <div class="item">
        <span class="text">{{ $t('service.high') }}</span>
        <span class="num ">{{ currentCoin.high | toFixed(accuracys(currentCoin.symbol)) }}</span>
      </div>
      <div class="item">
        <span class="text">{{ $t('service.low') }}</span>
        <span class="num ">{{ currentCoin.low | toFixed(accuracys(currentCoin.symbol)) }}</span>
      </div>
      <div class="item">
        <span class="text">成交数量({{ currentCoin.coin }})</span>
        <span class="num ">{{ currentCoin.volume | toFixed(4) }}</span>
      </div>
      <div class="item">
        <!-- <img src="../../assets/images/exchange/light-switch.png" alt=""> -->
      </div>
    </div>
    <div class="main_box" id="main_box">
      <div class="box1">
        <div style="display: flex; justify-content: space-between; width: 100%;">
          <div class="center">
            <!--K线和深度图-->
            <div class="imgtable">
              <div class="handler">
                <span @click="changeImgTable('k')" :class="{ active: currentImgTable === 'k' }">{{ $t("swap.kline")
                }}</span>
                <span @click="changeImgTable('s')" :class="{ active: currentImgTable === 's' }">{{ $t("swap.depth")
                }}</span>
              </div>
              <div style="width: 100%;">
                <KlineCharts type="candlestick" :autosize="true" :symbol="currentCoin.symbol" currentResolution="5"
                  ref="kline" :class="{ hidden: currentImgTable === 's' }" id="kline_container" />
              </div>
              <DepthGraph :class="{ hidden: currentImgTable === 'k' }" ref="depthGraph"></DepthGraph>
            </div>
          </div>
          <!-- 盘口 -->
          <div class="left plate-wrap box2  custom-tabs" style="position:relative;width: 20%;">
            <div style="height: 100%;">
              <div class="tab-header">
                <span v-for="tab in tabs" :key="tab.name" :class="['tab-item', { active: activeName === tab.name }]"
                  @click="activeNameClick(tab.name)">
                  {{ tab.label }}
                </span>
              </div>
              <div style="height: 100%;" class="tab-content newHeight">
                <div v-if="activeName === 'first'" style="height: 100%;" class="tab-pane">
                  <div class="handlers">
                    <span class="ceneter" :class="{ active: selectedPlate == 'all' }"><span @click="changePlate('all')"
                        class="handler handler-all"></span></span>
                    <span class="ceneter" :class="{ active: selectedPlate == 'buy' }"> <span @click="changePlate('buy')"
                        class="handler handler-green"></span></span>
                    <span class="ceneter" :class="{ active: selectedPlate == 'sell' }"> <span
                        @click="changePlate('sell')" class="handler handler-red"></span></span>
                  </div>
                  <div class="New_flex">
                    <!-- 盘口：卖 -->
                    <div class="">
                      <Table v-show="selectedPlate != 'buy'" @on-current-change="buyPlate" highlight-row
                        ref="currentRowTable" :columns="plate.columns" style="height: 100%;" :data="plate.askRows"
                        :no-data-text="$t('common.nodata')">
                      </Table>
                    </div>
                    <div class="plate-nowprice">
                      <div style="display: flex; align-items: center; justify-content: center;">
                        <div class="price" :class="{ buy: currentCoin.change > 0, sell: currentCoin.change < 0 }">{{
                          currentCoin.price |
                          toFixed(baseCoinScale) }}</div>
                        <span v-if="currentCoin.change > 0" class="buy"><img
                            style="width: 20px;height: 20px; color: red;" src="../../assets/svg/up_arrow.svg"
                            alt=""></span>
                        <span v-else-if="currentCoin.change < 0" class="sell"><img
                            style="width: 20px;height: 20px; color: red;" src="../../assets/svg/down_arrow.svg"
                            alt=""></span>
                      </div>
                      <div>
                        <span class="price-cny"> {{ currentCoin.usdRate * CNYRate | toFixed(2) }} CNY</span>
                      </div>
                    </div>
                    <div class="buyPlate">
                      <!-- 盘口：买 -->
                      <Table style="height: 100%;" v-show="selectedPlate != 'sell'" @on-current-change="sellPlate"
                        highlight-row :class="{ hidden: selectedPlate === 'all' }" :columns="plate.columns"
                        :data="plate.bidRows" :no-data-text="$t('common.nodata')"></Table>
                    </div>
                  </div>

                </div>
                <div v-if="activeName === 'second'" class="tab-pane">
                  <div class="left plate-wrap" style="position:relative;  height:100%">
                    <div style="height:40px;line-height:40px;padding-left:5px;color:#61688A;font-size: 13px;">
                      <span>{{ $t("swap.latestdeal") }}</span>
                    </div>
                    <div style="height:100%" class="trade-wrap">
                      <Table class="newHeight" height="" :columns="trade.columns" :data="trade.rows"
                        :no-data-text="$t('common.nodata')">
                      </Table>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
        <div class="order-box">
          <div class="order" style="margin-right: 5px; margin-bottom: 10px;">
            <div class="order-handler">
              <span @click="changeOrder('currentPositions')"
                :class="{ active: selectedOrder === 'currentPositions' }">{{
                  $t('swap.currentposition') }} ({{ holderslength }})</span>
              <span @click="changeOrder('currentEntrustOrders')"
                :class="{ active: selectedOrder === 'currentEntrustOrders' }">{{ $t('swap.curdelegation') }} ({{
                  currentlength }})</span>
              <span @click="changeOrder('historyEntrustOrders')"
                :class="{ active: selectedOrder === 'historyEntrustOrders' }">{{ $t('swap.hisdelegation') }}</span>
              <span @click="changeOrder('historyHolders')"
                :class="{ active: selectedOrder === 'historyHolders' }">历史成交</span>
            </div>
            <div class="table">
              <Table height="285" v-if="selectedOrder === 'currentPositions'" :columns="currentPosition.columns"
                :data="currentPositionList" :no-data-text="$t('common.nodata')">
              </Table>
              <Table height="285" v-if="selectedOrder === 'currentEntrustOrders'" :columns="currentOrder.columns"
                :no-data-text="$t('common.nodata')" :data="currentEntrustOrderList"></Table>
              <Table height="285" v-if="selectedOrder === 'historyEntrustOrders'" :columns="historyOrder.columns"
                :no-data-text="$t('common.nodata')" :data="historyEntrustOrderList"></Table>
              <Table height="285" v-if="selectedOrder === 'historyHolders'" :columns="historyHolders.columns"
                :no-data-text="$t('common.nodata')" :data="historyHoldersList"></Table>
            </div>
          </div>
        </div>
      </div>

      <!-- 成交记录 -->
      <div class="left plate-wrap box3 " style="position:relative;width: 20%;">
        <!-- 开仓/平仓 -->
        <div class=" flex3">
          <div class="order" style="margin-top: 5px; ">
            <div v-if="marginMode === '0'" @click="showMarginModeModal()"
              style="border-bottom: 1px solid #eaeaed; cursor: pointer; padding: 5px 10px ;font-size: 12px;">
              全仓
            </div>
            <div v-if="marginMode === '1'" @click="showMarginModeModal()"
              style="border-bottom: 1px solid #eaeaed; cursor: pointer; padding: 5px 10px ;font-size: 12px;">
              逐仓
            </div>
            <div class="order-handler" style="justify-content: space-between;">
              <span class="order-handler-item" @click="entrustChange(1)" :class="{ active: entrustType === 1 }">{{
                $t('swap.open') }}</span>
              <span style="display: none;" class="order-handler-item" @click="entrustChange(2)"
                :class="{ active: entrustType === 2 }">{{
                  $t('平仓') }}</span>
            </div>
            <div class="table open-close">
              <div v-if="entrustType === 1" class="open" style="width: 100%;">
                <RadioGroup class="radioGroup-border" v-model="entrustOrderType" type="button" size="default"
                  @on-change="changeEntrustOrderType">
                  <Radio label="0">{{ $t('swap.market_price') }}</Radio>
                  <Radio label="1">{{ $t('swap.limited_price') }}</Radio>
                  <!-- <Radio label="2">{{ $t('swap.spot_price') }}</Radio> -->
                </RadioGroup>
                <Form style="width: 94%;margin-left: 3%;margin-top:10px;">
                  <FormItem style="margin-bottom: 10px;" v-if="entrustOrderType == '1'">
                    <label class="before">{{ $t('swap.entrustprice') }}</label>
                    <Input v-model="form.entrustPrice"
                      @on-keyup="form.entrustPrice = form.entrustPrice.replace(/[^\d^\.]+/g, '')"></Input>
                    <label class="after">{{ currentCoin.base }}</label>
                  </FormItem>
                  <FormItem style="margin-bottom: 10px;" v-if="entrustOrderType == '0'">
                    <label class="before">{{ $t('swap.entrustprice') }}</label>
                    <Input :value="$t('swap.marketpriceplaceholder')" disabled class="market-price"></Input>
                  </FormItem>

                  <FormItem style="margin-bottom: 10px;" v-if="entrustOrderType == '2'">
                    <label class="before">{{ $t('swap.triggleprice') }}</label>
                    <Input v-model="form.triggerPrice"
                      @on-keyup="form.triggerPrice = form.triggerPrice.replace(/[^\d^\.]+/g, '')"></Input>
                    <label class="after">{{ currentCoin.base }}</label>
                  </FormItem>

                  <FormItem style="margin-bottom: 10px;" v-if="entrustOrderType == '2'">
                    <label class="before">{{ $t('swap.entrustprice') }}</label>
                    <Input v-model="form.entrustPrice" :placeholder="$t('swap.triggleplaceholder')"
                      @on-keyup="form.entrustPrice = form.entrustPrice.replace(/[^\d^\.]+/g, '')"></Input>
                    <label class="after">{{ currentCoin.base }}</label>
                  </FormItem>

                  <FormItem style="margin-bottom: 10px;">
                    <label class="before">{{ $t('swap.openvolume') }}</label>
                    <Input @input="openChange" v-model="form.volume" v-if="sliderOpenPercent == 0"
                      @on-keyup="form.volume = form.volume.replace(/[^\d^\.]+/g, '')"></Input>
                    <Input class="market-price" :readonly="true" v-if="sliderOpenPercent != 0"
                      @on-focus="onOpenAmountFocus" :value="sliderOpenPercent + ' %'"></Input>
                    <label class="after" v-if="sliderOpenPercent == 0">{{ currentCoin.coin }}</label>
                  </FormItem>
                  <div class="split-panel" v-if="entrustOrderType != '2'">
                    <div :class="{ selected: Number(sliderOpenPercent) === 25 }" @click="onChangeOpenPercent(25)">25%
                    </div>
                    <div :class="{ selected: Number(sliderOpenPercent) === 50 }" @click="onChangeOpenPercent(50)">50%
                    </div>
                    <div :class="{ selected: Number(sliderOpenPercent) === 75 }" @click="onChangeOpenPercent(75)">75%
                    </div>
                    <div :class="{ selected: Number(sliderOpenPercent) === 100 }" @click="onChangeOpenPercent(100)">100%
                    </div>
                  </div>

                </Form>
                <div class="open-tips">
                  <div><span class="open_tips_up">{{ $t('swap.canup') }}:</span><span class="num">{{ avaOpenBuy() |
                    fixed4 }}
                      {{ currentCoin.coin }}</span></div>
                  <div><span class="open_tips_up_down">{{ $t('swap.candown') }}:</span><span class="num">{{
                    avaOpenSell() | fixed4 }}
                      {{ currentCoin.coin }}</span></div>
                </div>
                <div class="operate" v-if="isLogin">
                  <Button type="primary" shape="circle" class="open-up" @click="onOpen(0)">{{ $t('swap.openup')
                  }}</Button>
                  <Button type="primary" shape="circle" class="open-down" @click="onOpen(1)">{{ $t('swap.opendown')
                  }}</Button>
                </div>
                <div class="operate" v-if="form.volume > 0">
                  <div class="operate_lebal">保证金 : </div>
                  <div class="operate_value"> {{ calculateMargin }} USDT</div>
                </div>
                <div class="operate-login" v-if="!isLogin" style="width: 94%; margin-left:3%;">
                  <span
                    style="display: inline-block;width: 100%; text-align: center;border:1px solid #232d3a;padding: 5px 0;border-radius: 5px;">
                    {{ $t("common.please") }}
                    <router-link to="/login">
                      <span style="color:#f0a70a;">{{ $t("common.login") }}</span>
                    </router-link> /
                    <router-link to="/register">
                      <span style="color:#00dcff;">{{ $t("common.register") }}</span>
                    </router-link>
                  </span>
                </div>
              </div>
              <div v-else class="open" style="width: 100%;">
                <RadioGroup v-model="entrustOrderType" type="button" size="default" @on-change="changeEntrustOrderType">
                  <Radio label="1">{{ $t('swap.limited_price') }}</Radio>
                  <Radio label="0">{{ $t('swap.market_price') }}</Radio>
                  <Radio label="2">{{ $t('swap.spot_price') }}</Radio>
                </RadioGroup>
                <Form style="width: 94%;margin-left: 3%;margin-top:10px;">
                  <FormItem style="margin-bottom: 10px;" v-if="entrustOrderType == '1'">
                    <label class="before">{{ $t('swap.entrustprice') }}</label>
                    <Input v-model="form.entrustPrice"
                      @on-keyup="form.entrustPrice = form.entrustPrice.replace(/[^\d^\.]+/g, '')"></Input>
                    <label class="after">{{ currentCoin.base }}</label>
                  </FormItem>
                  <FormItem style="margin-bottom: 10px;" v-if="entrustOrderType == '0'">
                    <label class="before">{{ $t('swap.entrustprice') }}</label>
                    <Input :value="$t('swap.marketpriceplaceholder')" disabled class="market-price"></Input>
                  </FormItem>

                  <FormItem style="margin-bottom: 10px;" v-if="entrustOrderType == '2'">
                    <label class="before">{{ $t('swap.triggleprice') }}</label>
                    <Input v-model="form.triggerPrice"
                      @on-keyup="form.trigglePrice = form.triggerPrice.replace(/[^\d^\.]+/g, '')"></Input>
                    <label class="after">{{ currentCoin.base }}</label>
                  </FormItem>

                  <FormItem style="margin-bottom: 10px;" v-if="entrustOrderType == '2'">
                    <label class="before">{{ $t('swap.entrustprice') }}</label>
                    <Input v-model="form.entrustPrice" :placeholder="$t('swap.triggleplaceholder')"
                      @on-keyup="form.entrustPrice = form.entrustPrice.replace(/[^\d^\.]+/g, '')"></Input>
                    <label class="after">{{ currentCoin.base }}</label>
                  </FormItem>

                  <FormItem style="margin-bottom: 10px;">
                    <label class="before">{{ $t('swap.closevolume') }}</label>
                    <Input v-model="form.volume" v-if="sliderClosePercent == 0"
                      @on-keyup="form.volume = form.volume.replace(/\D/g, '')"></Input>
                    <Input class="market-price" :readonly="true" v-if="sliderClosePercent != 0"
                      @on-focus="onCloseAmountFocus"></Input>
                    <label class="after">{{ $t('swap.shareNumber') }}</label>
                    <div style="color: #7c7f82; text-align: end;">1{{ $t('swap.shareNumber') }} =
                      {{ contractCoinInfo.shareNumber }}USDT</div>
                  </FormItem>


                  <div class="split-panel" v-if="entrustOrderType != '2'">
                    <div :class="{ selected: Number(sliderClosePercent) === 25 }" @click="onChangeClosePercent(25)">25%
                    </div>
                    <div :class="{ selected: Number(sliderClosePercent) === 50 }" @click="onChangeClosePercent(50)">50%
                    </div>
                    <div :class="{ selected: Number(sliderClosePercent) === 75 }" @click="onChangeClosePercent(75)">75%
                    </div>
                    <div :class="{ selected: Number(sliderClosePercent) === 100 }" @click="onChangeClosePercent(100)">
                      100%
                    </div>
                  </div>
                </Form>
                <div class="open-tips">
                  <div><span class="red">{{ $t('swap.canclosedown') }}:</span><span class="num">{{
                    contractWalletInfo.usdtBuyPosition }} {{ $t('swap.shareNumber') }}</span></div>
                  <div><span class="green">{{ $t('swap.cancloseup') }}:</span><span class="num">{{
                    contractWalletInfo.usdtSellPosition }} {{ $t('swap.shareNumber') }}</span></div>
                </div>
                <div class="operate" v-if="isLogin">
                  <Button type="primary" shape="circle" class="open-down" @click="onClose(1)">{{ $t('swap.closedown')
                  }}</Button>
                  <Button type="primary" shape="circle" class="open-up" @click="onClose(0)">{{ $t('swap.closeup')
                  }}</Button>
                </div>
                <div class="operate-login" v-if="!isLogin" style="width: 94%; margin-left:3%;">
                  <span
                    style="display: inline-block;width: 100%; text-align: center;border:1px solid #232d3a;padding: 5px 0;border-radius: 5px;">
                    {{ $t("common.please") }}
                    <router-link to="/login">
                      <span style="color:#f0a70a;">{{ $t("common.login") }}</span>
                    </router-link> /
                    <router-link to="/register">
                      <span style="color:#00dcff;">{{ $t("common.register") }}</span>
                    </router-link>
                  </span>
                </div>
              </div>
            </div>
          </div>

          <!-- 我的合约账户 -->
          <div class="order" style="width: 100%; margin-top: 5px;min-height: 320px;color:#61688A;">
            <div
              style="height:32px;line-height:32px;padding-left:10px;border-bottom: 1px solid #eaeaed;font-size: 13px;">
              <span>{{ $t("swap.myswapaccount") }}</span>
              <router-link class="linkmore" to="/assets/transfer">{{ $t("swap.zijinhuazhuan") }}</router-link>
            </div>
            <div class="table swap-my-account">
              <div class="account-item">
                <div style="width:35%; color: #8e8e92;">{{ $t("swap.accountmargin") }}</div>
                <div class="margin" style="width: 65%;">
                  <Button @click="showAdjustLeverage(1)" size="small"
                    style="flex: 0 0 47%;;color: #fff; border-radius: 10px; background-color: #2bc287; ">{{ leverage
                    }}X</Button>
                </div>
              </div>
              <div class="account-item" style="padding-bottom:5px;">
                <div style="display: flex; align-items: center;">
                  <div style="color: #8e8e92">可用保证金</div>
                  <div class="tooltip-container" style="position: relative; display: inline-block;">
                    <img style="width: 12px; height: 12px; margin-left: 3px; cursor: pointer;"
                      src="../../assets/images/wenhao.png" alt="" @mouseenter="showMarginTip = true"
                      @mouseleave="showMarginTip = false">
                    <div v-show="showMarginTip" class="tooltip-content"
                      style="position: absolute; left: -70px; bottom: 20px; background-color: #333; color: #fff; padding: 5px 10px; border-radius: 4px; white-space: nowrap; z-index: 10; font-size: 12px;">
                      可用保证金=钱包余额-占用保证金+未实现盈亏
                    </div>
                  </div>
                </div>
                <div><span>{{ freeMargin() | fixed4 }}</span></div>
              </div>
              <div class="account-item">
                <div style="color: #8e8e92">钱包余额</div>
                <div><span>{{ contractWalletInfo.usdtBalance | fixed4 }}</span></div>
              </div>
              <div class="account-item">
                <div style="color: #8e8e92">未实现盈亏</div>
                <div><span>{{ unrealizedProfitAndLoss() | fixed4 }}</span></div>
              </div>
              <div class="account-item">
                <div style="color: #8e8e92">风险率</div>
                <div><span> {{
                  (() => {
                    const result = (maxBonds() / (contractWalletInfo.usdtBalance + unrealizedProfitAndLoss()) *
                      100).toFixed(2);
                    return isNaN(result) ? '0' : result;
                  })()
                }}%</span></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>


    <!-- 弹出框: 变更仓位模式 -->
    <Modal v-model="marginModeModal" :title="$t('swap.modifyMarginModeTitle')" width="20"
      class-name="vertical-center-modal">
      <div style="text-align: center;width:100%;">
        <ButtonGroup style="width: 80%;text-align: center;">
          <Button style="width: 50%;" v-if="marginMode === '1'" type="primary">{{ $t("swap.marginMode1") }}</Button>
          <Button style="width: 50%;" v-else @click="changeMarginMode('1')">{{ $t("swap.marginMode1") }}</Button>

          <Button style="width: 50%;" v-if="marginMode === '0'" type="primary">{{ $t("swap.marginMode2") }}</Button>
          <Button style="width: 50%;" v-else @click="changeMarginMode('0')">{{ $t("swap.marginMode2") }}</Button>
        </ButtonGroup>
      </div>
      <div slot="footer">
        <Button type="default" size="large" @click="marginModeModal = false">{{ $t("common.close") }}</Button>
      </div>
    </Modal>

    <!-- 弹出框: 调整杠杆 -->
    <Modal v-model="leverageModal" :title="$t('swap.modifyLeverage')" width="25" class-name="vertical-center-modal">
      <div class="leverage">
        <!-- 连续杠杆 -->
        <InputNumber size="large" style="width: 100%;" :value.sync="leverageAdjustVal" v-if="leverageType == 2"
          @on-change="onLeverageChange">
        </InputNumber>
        <!-- 离散杠杆 -->
        <div class="leverage-panel" v-if="leverageType == 1 && changeLeverageType == 1">
          <Button v-for="item in leverageList" style="margin-left:5px;margin-right:5px;margin-bottom: 10px;"
            @click="changeLeverage(Number(item))" :class="{ leverageSelect: Number(item) === leverageAdjustVal }">{{
              item }}X</Button>
        </div>
        <div class="leverage-panel" v-if="leverageType == 1 && changeLeverageType == 2">
          <Button v-for="item in leverageList" style="margin-left:5px;margin-right:5px;margin-bottom: 10px;"
            @click="changeLeverage(Number(item))" :class="{ leverageSelect: Number(item) === leverageAdjustVal }">{{
              item }}X</Button>
        </div>
      </div>
      <div slot="footer">
        <Button type="default" size="large" @click="leverageModal = false">{{ $t("common.close") }}</Button>
        <Button type="primary" size="large" @click="adjustLeverage()">{{ $t("common.ok") }}</Button>
      </div>
    </Modal>

    <!-- 弹出框: 设置止盈止损 -->
    <Modal v-model="profitLossModel" title="仓位止盈止损" width="25" class-name="vertical-center-modal">
      <Form style="width: 94%;margin-left: 3%;margin-top:10px;">
        <FormItem style="margin-bottom: 10px;">
          <label class="before">仓位止盈 :</label>
          <Input style="width: 80%; margin-left: 20px;" v-model="profitLossForm.targetProfit"
            @on-keyup="profitLossForm.targetProfit = profitLossForm.targetProfit.replace(/[^\d^\.]+/g, '')"></Input>
          <div class="after" style="color:#cccccc;white-space: normal" v-if="profitLossForm.direction == 0">当价格达到
            <span style="color:#000">{{ profitLossForm.targetProfit }}</span>时，
            将会触发市价止盈委托平仓当前仓位，预计盈亏为
            <span style="color:#3b8442" v-if="profitLossForm.targetProfit > profitLossForm.openPrice">
              {{ profitLossForm.targetProfit ? (((profitLossForm.targetProfit - profitLossForm.openPrice) *
                profitLossForm.volume).toFixed(4)) : "--" }}
            </span>
            <span style="color:#ed4014" v-else>
              {{ profitLossForm.targetProfit ? (((profitLossForm.targetProfit - profitLossForm.openPrice) *
                profitLossForm.volume).toFixed(4)) : "--" }}
            </span>
          </div>
          <div class="after" style="color:#cccccc;white-space: normal" v-else>当价格达到
            <span style="color:#000">{{ profitLossForm.targetProfit }}</span>时，
            将会触发市价止盈委托平仓当前仓位，预计盈亏为
            <span style="color:#3b8442" v-if="profitLossForm.targetProfit < profitLossForm.openPrice">
              {{ profitLossForm.targetProfit ? (((profitLossForm.openPrice - profitLossForm.targetProfit) *
                profitLossForm.volume).toFixed(4)) : "--" }}
            </span>
            <span style="color:#ed4014" v-else>
              {{ profitLossForm.targetProfit ? (((profitLossForm.openPrice - profitLossForm.targetProfit) *
                profitLossForm.volume).toFixed(4)) : "--" }}
            </span>
          </div>
        </FormItem>
        <FormItem style="margin-bottom: 10px;">
          <label class="before">仓位止损 :</label>
          <Input style="width: 80%; margin-left: 20px;" v-model="profitLossForm.targetLoss"
            @on-keyup="profitLossForm.targetLoss = profitLossForm.targetLoss.replace(/[^\d^\.]+/g, '')"></Input>
          <div class="after" style="color:#cccccc;white-space: normal" v-if="profitLossForm.direction == 0">当价格达到
            <span style="color:#000">{{ profitLossForm.targetLoss }}</span>时，
            将会触发市价止损委托平仓当前仓位，预计盈亏为
            <span style="color:#3b8442" v-if="profitLossForm.targetLoss > profitLossForm.openPrice">
              {{ profitLossForm.targetLoss ? (((profitLossForm.targetLoss - profitLossForm.openPrice) *
                profitLossForm.volume).toFixed(4)) : "--" }}
            </span>
            <span style="color:#ed4014" v-else>
              {{ profitLossForm.targetLoss ? (((profitLossForm.targetLoss - profitLossForm.openPrice) *
                profitLossForm.volume).toFixed(4)) : "--" }}
            </span>
          </div>
          <div class="after" style="color:#cccccc" v-else>当价格达到
            <span style="color:#ffffff">{{ profitLossForm.targetLoss }}</span>时，
            将会触发市价止损委托平仓当前仓位，预计盈亏为
            <span style="color:#3b8442" v-if="profitLossForm.targetLoss < profitLossForm.openPrice">
              {{ profitLossForm.targetLoss ? (((profitLossForm.openPrice - profitLossForm.targetLoss) *
                profitLossForm.volume).toFixed(4)) : "--" }}
            </span>
            <span style="color:#ed4014" v-else>
              {{ profitLossForm.targetLoss ? (((profitLossForm.openPrice - profitLossForm.targetLoss) *
                profitLossForm.volume).toFixed(4)) : "--" }}
            </span>
          </div>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button type="default" size="large" @click="profitLossModel = false">{{ $t("common.close") }}</Button>
        <Button type="primary" size="large" @click="handlerProfitLossModel()">{{ $t("common.ok") }}</Button>
      </div>
    </Modal>

    <!-- 弹出框: 设置止盈止损 -->
    <Modal v-model="backhandtradingModel" title="反手交易" width="25" class-name="vertical-center-modal">
      <div class="close-position-popup">
        <div class="popup-header">
          <div class="popup_header_top"></div>
        </div>
        <div class="popup-content ">
          <div class="popup-pair-info ">
            <div class="">
              <div class="">
                <div class="position-pair">{{ backhandData.symbol }}</div>
              </div>
              <div class="position-left ">
                <div class="position-type">永续</div>
                <div class="position-leverage" v-if="backhandData.patterns == 0">全仓</div>
                <div class="position-leverage" v-else>逐仓</div>
                <div class="position-buy" v-if="backhandData.direction == 0">买入到卖出</div>
                <div class="position-sell" v-else>卖出到买入</div>
              </div>
            </div>
            <div class="">
              <div style="text-align: right;" class="">
                最新
              </div>
              <div class="">
                {{ getCoins(backhandData.symbol).close }}
              </div>
            </div>
          </div>
          <div class="position-box">
            <div class="position-header">
              <div class="position-left">
                <div class="position-buy" v-if="backhandData.direction == 0">买</div>
                <div class="position-sell" v-else>卖</div>
                <div class="position-pair">{{ backhandData.symbol }}</div>
                <div class="position-type">永续</div>
                <div class="position-leverage" v-if="backhandData.patterns == 0">全仓
                  {{ backhandData.leverage }}x</div>
                <div class="position-leverage" v-else>逐仓 {{ backhandData.leverage }}x</div>
              </div>
            </div>
            <div class="flex1">
              <div class="">
                <div style="color: #999;" class="">
                  投入金额
                </div>
                <div style="" class="">
                  {{ backhandData.maxVolume }} {{ backhandData.coinSymbol }}
                </div>
              </div>
              <div class="">
                <div style="color: #999;" class="">
                  订单价格
                </div>
                <div style="text-align: right;" class="">
                  市价
                </div>
              </div>
            </div>
          </div>
          <div class="paragraph">
            <div class="paragraph-line"></div>
            <div class="paragraph-info">
              <div class="">
                <img style="width: 15px; height: 15px; margin-top: 4px;" src="../../assets/images/down-arrow.png" />
              </div>
              <div class="">
                {{ backhandData.direction == 0 ? '卖出' : '买入' }}{{ backhandData.maxVolume * 2 }}{{
                  backhandData.coinSymbol }}进行反向持仓
              </div>
            </div>
          </div>

          <div class="position-box">
            <div class="position-header">
              <div class="position-left">
                <div class="position-buy" v-if="backhandData.direction == 1">买</div>
                <div class="position-sell" v-else>卖</div>
                <div class="position-pair">{{ backhandData.symbol }}</div>
                <div class="position-type">永续</div>
                <div class="position-leverage" v-if="backhandData.patterns == 0">全仓
                  {{ backhandData.leverage }}x</div>
                <div class="position-leverage" v-else>逐仓 {{ backhandData.leverage }}x</div>
              </div>
            </div>
            <div class="flex1">
              <div class="">
                <div style="color: #999;" class="">
                  投入金额
                </div>
                <div class="">
                  {{ backhandData.maxVolume }} {{ backhandData.coinSymbol }}
                </div>
              </div>
              <div class="">
                <div style="color: #999;" class="">
                  订单价格
                </div>
                <div style="text-align: right;" class="">
                  市价
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div slot="footer">
        <Button type="default" size="large" @click="backhandtradingModel = false">{{ $t("common.close") }}</Button>
        <Button type="primary" style="background-color: #000;" size="large" @click="handlerbackhandtradingModel()">{{
          $t("common.ok") }}</Button>
      </div>
    </Modal>

  </div>
</template>

<script>
import expandRow from "@/components/exchange/expand.vue";
var Stomp = require("stompjs");
var SockJS = require("sockjs-client");
var moment = require("moment");
import DepthGraph from "@/components/exchange/DepthGraph.vue";
// import EchartKline from "./echarts.vue";
// import $ from "@js/jquery.min.js";
import getData from "./components/data.js";
import KlineCharts from "./KlineCharts.vue";

export default {
  components: { expandRow, DepthGraph, KlineCharts },
  data() {
    return getData(this)
  },
  filters: {

  },
  computed: {
    rechargeUSDTUrl: function () {
      return "/uc/recharge?name=" + this.currentCoin.base;
      // return "#/finance/recharge?name=" + this.currentCoin.base;
    },
    rechargeCoinUrl: function () {
      return "/uc/recharge?name=" + this.currentCoin.coin;
      // return "#/finance/recharge?name=" + this.currentCoin.coin;
    },

    calculateMargin: function () {
      if (this.entrustOrderType == 0) {
        return ((this.form.volume * this.currentCoin.close) / this.leverage).toFixed(2);
      } else if (this.entrustOrderType == 1) {
        return ((this.form.volume * this.form.entrustPrice) / this.leverage).toFixed(2);
      } else {
        return 0.00
      }
    },
    commission: function () {
      if (this.entrustOrderType == 0) {
        return ((this.form.volume * this.currentCoin.close) * this.openFee).toFixed(2);
      } else if (this.entrustOrderType == 1) {
        return ((this.form.volume * this.form.entrustPrice) * this.openFee).toFixed(2);
      } else {
        return 0.00
      }
    },
    isLogin: function () {
      return this.$store.getters.isLogin;
    },
    member: function () {
      return this.$store.getters.member;
    },
    lang: function () {
      return this.$store.state.lang;
    },
    assetRate: function () {
      if (!this.isLogin || this.contractWalletInfo == null) return 0;
      var zhanyong = this.contractWalletInfo.usdtFrozenBalance + this.contractWalletInfo.usdtBuyPrincipalAmount + this.contractWalletInfo.usdtSellPrincipalAmount;
      if (this.totalQuanyi > 0) {
        return zhanyong / this.totalQuanyi;
      } else {
        return 0;
      }
    },
  },
  watch: {
    lang: function () {
      this.updateLangData();
    },
    $route(to, from) {
      this.init();
    }
  },
  created: function () {
    this.init();
  },
  filters: {
    dateFormat: function (tick) {
      return moment(tick).format("MM-DD HH:mm");
    },
    fixed2: function (value) {
      return value.toFixed(2);
    },
    fixed4: function (value) {
      value = value == null ? 0 : value
      return value.toFixed(4);
    },
    percent: function (value) {
      return (value * 100).toFixed(2);
    }
  },
  mounted() {
    this.startWebsock();
    this.initKlineResizeObserver();
    this.changePlate('all')
    window.addEventListener('focus', this.onWindowFocus);
    window.addEventListener('blur', this.onWindowBlur);
    this.member = JSON.parse(localStorage.getItem("MEMBER") || "{}");
  },
  beforeDestroy() {
    this.stopWebsock();
    if (this.klineResizeObserver) {
      this.klineResizeObserver.disconnect();
      this.klineResizeObserver = null;
    }
    window.removeEventListener('focus', this.onWindowFocus);
    window.removeEventListener('blur', this.onWindowBlur);
  },
  methods: {
    onWindowFocus() {
      this.$refs.kline.fetchData();
      this.startWebsock();
    },

    onWindowBlur() {
      this.stopWebsock();

    },
    unrealizedProfitAndLoss() {//未实现盈亏
      //未实现盈亏=所有持仓单的盈亏的和
      let totalAmount = 0
      for (let i = 0; i < this.currentPositionList.length; i++) {
        let data = this.currentPositionList[i];
        let currentCoin = this.getCoin(data.symbol)
        if (data.direction == 0) {
          let shouyi = (currentCoin.close - data.tradedPrice) * data.volume
          totalAmount += shouyi
        } else {
          let shouyi = (data.tradedPrice - currentCoin.close) * data.volume
          totalAmount += shouyi
        }
      }
      return totalAmount;
    },
    bonds() {//所有持仓保证金
      //所有持仓保证金=所有持仓保证金的和
      let totalAmount = 0
      for (let i = 0; i < this.currentPositionList.length; i++) {
        let data = this.currentPositionList[i];
        let currentCoin = this.getCoin(data.symbol)//当前持仓的代币
        totalAmount += data.volume * data.tradedPrice / data.leverage
      }
      // console.log("保证金总和",totalAmount)
      return totalAmount;
    },
    maxBonds() {//获取最大的维持保证金,用于计算风险率
      let maxAmount = 0
      for (let i = 0; i < this.currentPositionList.length; i++) {
        let data = this.currentPositionList[i]
        let currentCoin = this.getCoin(data.symbol)
        let mintHolderUsdt = data.tradedPrice * data.volume * currentCoin.maintenanceMarginRate
        if (mintHolderUsdt > maxAmount) {
          maxAmount = mintHolderUsdt
        }
      }
      return maxAmount;
    },
    entrust() {//所有委托开仓的保证金
      let totalAmount = 0
      for (let i = 0; i < this.currentEntrustOrderList.length; i++) {
        let data = this.currentEntrustOrderList[i];
        let currentCoin = this.getCoin(data.symbol)//当前持仓的代币
        if (data.direction == 0 && data.leverage > 0) {//只计算开仓的
          totalAmount += data.volume * data.entrustPrice / data.leverage
        }
      }
      return totalAmount;
    },
    activeNameClick(name) {
      this.activeName = name
    },
    freeMargin() {//计算可用保证金
      //可用保证金=合约账户余额-所有持仓保证金-未实现盈亏
      let res = this.contractWalletInfo.usdtBalance - this.bonds() + this.unrealizedProfitAndLoss() - this.entrust();
      if (res < 0) {
        return 0
      }
      return res;
    },
    avaOpenBuy: function () { // 可开多
      if (!this.isLogin || this.contractWalletInfo == null) return 0;
      return this.leverage * this.freeMargin() / this.currentCoin.close
    },
    avaOpenSell: function () { // 可开空
      if (!this.isLogin || this.contractWalletInfo == null) return 0;
      return this.leverage * this.freeMargin() / this.currentCoin.close
    },
    editStopLimit() {//设置止盈止损
      this.profitLossModel = true
    },
    handlerProfitLossModel() { //止盈止损提交
      if (!this.profitLossForm.targetProfit) {
        this.profitLossForm.targetProfit = 0
      }
      if (!this.profitLossForm.targetLoss) {
        this.profitLossForm.targetLoss = 0
      }
      let currentCoin = this.getCoin(this.profitLossForm.symbol)
      if (this.profitLossForm.direction == 0) {//如果做多，止盈价格不能小于当前价，止损价格不能大于当前价
        if (this.profitLossForm.targetProfit != 0 && this.profitLossForm.targetProfit && this.profitLossForm.targetProfit < currentCoin.close) {
          this.$Notice.error({
            title: this.$t("swap.tip"),
            desc: "止盈价格不能小于当前价"
          });
          return
        }
        if (this.profitLossForm.targetLoss != 0 && this.profitLossForm.targetLoss && this.profitLossForm.targetLoss > currentCoin.close) {
          this.$Notice.error({
            title: this.$t("swap.tip"),
            desc: "止损价格不能大于当前价"
          });
          return
        }
      } else {//如果做空，止盈价格不能大于当前价，止损价格不能小于当前价
        if (this.profitLossForm.targetProfit != 0 && this.profitLossForm.targetProfit && this.profitLossForm.targetProfit > currentCoin.close) {
          this.$Notice.error({
            title: this.$t("swap.tip"),
            desc: "止盈价格不能大于当前价"
          });
          return
        }
        if (this.profitLossForm.targetLoss != 0 && this.profitLossForm.targetLoss && this.profitLossForm.targetLoss < currentCoin.close) {
          this.$Notice.error({
            title: this.$t("swap.tip"),
            desc: "止损价格不能小于当前价"
          });
          return
        }
      }
      this.$Spin.show();
      var that = this;
      let params = this.profitLossForm;
      this.$http
        .post(this.swapHost + this.api.swap.setOrderProfitAndLoss, params)
        .then(response => {
          var resp = response.body;
          if (resp.code == 0) {
            this.$Notice.success({
              title: that.$t("swap.tip"),
              desc: that.$t("swap.success")
            });
            that.getCurrentOrder()
          } else {
            this.$Notice.error({
              title: that.$t("swap.tip"),
              desc: resp.message
            });
          }
          this.$Spin.hide();
          this.profitLossModel = false;
        });
    },
    closePosition(row) {//市价平仓
      let params = {
        type: 0, // 0:市价 1:限价 2计划委托
        volume: row.volume,
        orderId: row.id,
        entrustPrice: 0
      };
      this.$Spin.show();
      var that = this;
      this.$http
        .post(this.swapHost + this.api.swap.close, params)
        .then(response => {
          var resp = response.body;
          if (resp.code == 0) {
            this.$Notice.success({
              title: that.$t("swap.tip"),
              desc: that.$t("swap.success")
            });
            setTimeout(function () {
              that.getMemberContractWallet();
            }, 1000);
          } else {
            this.$Notice.error({
              title: that.$t("swap.tip"),
              desc: resp.message
            });
          }
          this.$Spin.hide();
        });
    },
    placeLimitOrder(id, price, volumn) {//限价平仓
      if (!price) {
        this.$Notice.error({
          title: this.$t("swap.tip"),
          desc: "请填写价格"
        });
        return
      }
      if (!volumn) {
        this.$Notice.error({
          title: this.$t("swap.tip"),
          desc: "请填写数量"
        });
        return
      }
      let params = {
        type: 1, // 0:市价 1:限价 2计划委托
        volume: volumn,
        orderId: id,
        triggerPrice: price,
      };
      this.$Spin.show();
      var that = this;
      this.$http
        .post(this.swapHost + this.api.swap.close, params)
        .then(response => {
          var resp = response.body;
          if (resp.code == 0) {
            this.$Notice.success({
              title: that.$t("swap.tip"),
              desc: that.$t("swap.success")
            });
            setTimeout(function () {
              that.getMemberContractWallet();
            }, 1000);
          } else {
            this.$Notice.error({
              title: that.$t("swap.tip"),
              desc: resp.message
            });
          }
          this.$Spin.hide();
        });
    },
    seachInputChange() {
      this.searchKey = this.searchKey.toUpperCase();
      this.dataIndex = this.coins.USDT.filter(item => item["coin"].indexOf(this.searchKey) == 0);
    },
    handleClick(tab, event) {
      console.log(tab, event);
    },

    silderGo(silder, val) {
      this[silder] = val;
    },
    init() {
      var params = this.$route.params.pair;
      if (params == undefined) {
        this.$router.push("/swap/" + this.defaultPath);
        params = this.defaultPath;
      }
      const basecion = params.split("_")[1];
      if (basecion) {
        this.basecion = basecion;
      }
      var coin = params.toUpperCase().split("_")[0];
      var base = params.toUpperCase().split("_")[1];
      this.currentCoin.symbol = coin + "/" + base;
      this.currentCoin.coin = coin;
      this.currentCoin.base = base;
      this.$store.commit("navigate", "nav-swap");
      this.$store.commit("setSkin", this.skin);
      this.currentPositionList = new Array();
      this.getCNYRate();
      this.getSymbolInfo();
      this.getSymbolThumb(); //包含 K线图、getFavor、startWebsock等
      this.getPlate(); //买卖盘
      this.getPlateFull();
      this.sliderOpenPercent = 0;
      this.sliderClosePercent = 0;

    },
    tipFormat(val) {
      return val + "%";
    },
    changeBaseCion(str) {
      this.basecion = str;
      this.dataIndex = this.coins.USDT;
    },
    changePlate(str) {
      if (str != "all") {
        this.plate.maxPostion = 16;
      } else {
        this.plate.maxPostion = 8;
      }
      this.getPlate(str);
    },
    changeImgTable(str) {
      this.currentImgTable = str;
    },
    changeOrder(str) {
      this.selectedOrder = str;
    },
    entrustChange(val) {
      this.entrustType = val;
    },
    // setback() {
    //   var obk = document.getElementsByClassName("container")[0];
    //   var height = 0;
    //   var doc = document;
    //   window.innerHeight && (height = window.innerHeight);
    //   !window.innerHeight &&
    //     doc.body.clientHeight &&
    //     (height = doc.body.clientHeight);
    //   !window.innerHeight &&
    //     !doc.body.clientHeight &&
    //     doc.documentElement.clientHeight &&
    //     (height = doc.documentElement.clientHeight);
    //   obk.style.minHeight = height - 100 + "px";
    // },
    updateLangData() {

      this.coins.columns[0].title = this.$t("swap.coin");
      this.coins.columns[1].title = this.$t("swap.lastprice");
      this.coins.columns[2].title = this.$t("swap.daychange");
      // this.coins.columns[3].title = this.$t("swap.favorite");

      this.trade.columns[0].title = this.$t("swap.num");
      this.trade.columns[1].title = this.$t("swap.price");
      this.trade.columns[2].title = this.$t("swap.time");

      this.plate.columns[0].title = this.$t("swap.stall");
      this.plate.columns[1].title = this.$t("swap.price");
      this.plate.columns[2].title = this.$t("swap.num");
      this.plate.columns[3].title = this.$t("swap.total");

      this.currentOrder.columns[1].title = this.$t("swap.time");
      this.currentOrder.columns[2].title = this.$t("swap.symbol");
      this.currentOrder.columns[3].title = this.$t("swap.type");
      this.currentOrder.columns[4].title = this.$t("swap.direction");
      this.currentOrder.columns[5].title = this.$t("swap.price");
      this.currentOrder.columns[6].title = this.$t("swap.num");
      this.currentOrder.columns[7].title = this.$t("swap.traded");
      this.currentOrder.columns[8].title = this.$t("swap.dealamount");
      this.currentOrder.columns[9].title = this.$t("swap.action");

      this.historyOrder.columns[1].title = this.$t("swap.time");
      this.historyOrder.columns[2].title = this.$t("swap.symbol");
      this.historyOrder.columns[3].title = this.$t("swap.type");
      this.historyOrder.columns[4].title = this.$t("swap.direction");
      this.historyOrder.columns[5].title = this.$t("swap.price");
      this.historyOrder.columns[6].title = this.$t("swap.num");
      this.historyOrder.columns[7].title = this.$t("swap.done");
      this.historyOrder.columns[8].title = this.$t("swap.dealamount");
      this.historyOrder.columns[9].title = this.$t("swap.status");

      // window.tvWidget.options.time_frames[0].title = this.$t("swap.realtime");
    },
    getCNYRate() {
      this.$http
        .post(this.swapHost + "/exchange-rate/usd-cny")
        .then(response => {
          var resp = response.body;
          this.CNYRate = resp.data;
        });
    },
    getCoin(symbol) {
      return this.coins._map[symbol];
    },
    getCoins(symbol) {
      return this.coinList.find(coin => coin.symbol === symbol) || {};
    },
    getSymbolThumb() {
      this.$http.post(this.swapHost + this.api.swap.thumb, {}).then(response => {
        var resp = response.body;
        this.coinList = resp
        //先清空已有数据
        for (var i = 0; i < resp.length; i++) {
          var coin = resp[i];
          coin.base = resp[i].symbol.split("/")[1];
          this.coins[coin.base] = [];
          this.coins[coin.base + "2"] = [];
          this.coins._map = [];
        }
        for (var i = 0; i < resp.length; i++) {
          var coin = resp[i];
          coin.price = resp[i].close = resp[i].close.toFixed(
            this.baseCoinScale
          );
          coin.rose =
            resp[i].chg > 0
              ? "+" + (resp[i].chg * 100).toFixed(2) + "%"
              : (resp[i].chg * 100).toFixed(2) + "%";
          coin.coin = resp[i].symbol.split("/")[0];
          coin.base = resp[i].symbol.split("/")[1];
          coin.href = (coin.coin + "_" + coin.base).toLowerCase();
          coin.isFavor = false;
          this.coins._map[coin.symbol] = coin;
          if (coin.zone == 0) {
            this.coins[coin.base].push(coin);
          } else {
            this.coins[coin.base + "2"].push(coin);
          }
          if (coin.symbol == this.currentCoin.symbol) {
            this.currentCoin = coin;
            this.form.entrustPrice = coin.price;
          }
        }
        require(["../../assets/js/swap.js"], function (e) {
          e.clickScTab();
        });
        this.startWebsock();
        this.changeBaseCion(this.basecion);
      });
    },
    getSymbolInfo() {
      //获取当前代币详情
      this.$http
        .post(this.swapHost + this.api.swap.symbolInfo, {
          symbol: this.currentCoin.symbol
        })
        .then(response => {
          var resp = response.body;
          if (resp != null) {
            this.currentCoin.coinScale = resp.coinScale;
            this.openFee = resp.openFee
            this.currentCoin.baseCoinScale = resp.baseCoinScale;

            this.baseCoinScale = resp.baseCoinScale;
            this.coinScale = resp.coinScale;
            this.symbolFee = resp.fee;

            this.enableMarketBuy = resp.enableMarketBuy;
            this.enableMarketSell = resp.enableMarketSell;

            this.exchangeable = resp.exchangeable;

            this.contractCoinInfo = resp;
            if (this.contractCoinInfo.leverageType == 1) {
              this.leverageList = this.contractCoinInfo.leverage.split(",");
            }
            if (this.isLogin) {
              this.getMemberContractWallet(); // 获取用户合约资产信息
            }
          }
        });
    },
    getMemberContractWallet() {
      //获取合约钱包
      this.$http
        .post(this.swapHost + this.api.swap.contractWallet, {
          contractCoinId: this.contractCoinInfo.id
        }).then(response => {
          var resp = response.body;
          if (resp != null) {
            this.contractWalletInfo = resp.data;
            if (this.contractWalletInfo == null) {
              return;
            }
            this.marginMode = this.contractWalletInfo.coinPattern + ""//仓位类型：逐仓/全仓
            this.leverage = this.contractWalletInfo.leverage
            this.getCurrentEntrustOrders();
            this.getHistoryEntrustOrders();
            this.getCurrentOrder();
            this.getHistoryOrderHolders()
          }
        });
    },

    initKlineResizeObserver() {
      const that = this
      const klineBox = document.getElementById('main_box');
      if (!klineBox) return;
      that.klineResizeObserver = new ResizeObserver(() => {
        if (that.$refs.kline) {
          console.log('1')

          that.$refs.kline.ReSize();
        }
      });
      that.klineResizeObserver.observe(klineBox);
    },
    getPlate(str = "") {
      //买卖盘
      var params = {};
      params["symbol"] = this.currentCoin.symbol;
      this.$http.post(this.swapHost + this.api.swap.platemini, params).then(response => {
        this.plate.askRows = [];
        this.plate.bidRows = [];
        let resp = response.body;
        if (resp.ask && resp.ask.items) {
          for (var i = 0; i < resp.ask.items.length; i++) {
            if (i == 0) {
              resp.ask.items[i].totalAmount = resp.ask.items[i].amount;
            } else {
              resp.ask.items[i].totalAmount =
                resp.ask.items[i - 1].totalAmount + resp.ask.items[i].amount;
            }
          }
          if (resp.ask.items.length >= this.plate.maxPostion) {
            for (var i = this.plate.maxPostion; i > 0; i--) {
              var ask = resp.ask.items[i - 1];
              ask.direction = "SELL";
              ask.position = i;
              this.plate.askRows.push(ask);
            }
            const rows = this.plate.askRows,
              len = rows.length,
              totle = rows[0].totalAmount;
            this.plate.askTotle = totle;
          } else {
            for (var i = this.plate.maxPostion; i > resp.ask.items.length; i--) {
              var ask = { price: 0, amount: 0 };
              ask.direction = "SELL";
              ask.position = i;
              ask.totalAmount = ask.amount;
              this.plate.askRows.push(ask);
            }
            for (var i = resp.ask.items.length; i > 0; i--) {
              var ask = resp.ask.items[i - 1];
              ask.direction = "SELL";
              ask.position = i;
              this.plate.askRows.push(ask);
            }
            var askItemIndex = (resp.ask.items.length - 1) > 0 ? (resp.ask.items.length - 1) : 0;
            const rows = this.plate.askRows,
              len = rows.length,
              totle =
                rows[askItemIndex]
                  .totalAmount;
            this.plate.askTotle = totle;
          }
        }
        if (resp.bid && resp.bid.items) {
          for (var i = 0; i < resp.bid.items.length; i++) {
            if (i == 0)
              resp.bid.items[i].totalAmount = resp.bid.items[i].amount;
            else
              resp.bid.items[i].totalAmount =
                resp.bid.items[i - 1].totalAmount + resp.bid.items[i].amount;
          }
          for (var i = 0; i < resp.bid.items.length; i++) {
            var bid = resp.bid.items[i];
            bid.direction = "BUY";
            bid.position = i + 1;
            this.plate.bidRows.push(bid);
            if (i == this.plate.maxPostion - 1) break;
          }
          if (resp.bid.items.length < this.plate.maxPostion) {
            for (
              var i = resp.bid.items.length;
              i < this.plate.maxPostion;
              i++
            ) {
              var bid = { price: 0, amount: 0 };
              bid.direction = "BUY";
              bid.position = i + 1;
              bid.totalAmount = 0;
              this.plate.bidRows.push(bid);
            }
            var bidItemIndex = (resp.bid.items.length - 1) > 0 ? (resp.bid.items.length - 1) : 0;
            const rows = this.plate.bidRows,
              len = rows.length,
              totle = rows[bidItemIndex].totalAmount;
            this.plate.bidTotle = totle;
          } else {
            const rows = this.plate.bidRows,
              len = rows.length,
              totle = rows[len - 1].totalAmount;
            this.plate.bidTotle = totle;
          }
        }
        if (str != "") {
          this.selectedPlate = str;
        }
      });
    },
    getPlateFull() {
      //深度图
      var params = {};
      params["symbol"] = this.currentCoin.symbol;
      this.$http
        .post(this.swapHost + this.api.swap.platefull, params)
        .then(response => {
          var resp = response.body;
          this.fullTrade = resp;
          resp.skin = this.skin;
          this.$refs.depthGraph.draw(resp);
        });
    },
    getTrade() {
      var params = {};
      params["symbol"] = this.currentCoin.symbol;
      params["size"] = 20;
      this.$http
        .post(this.swapHost + this.api.swap.trade, params)
        .then(response => {
          this.trade.rows = [];
          var resp = response.body;
          for (var i = 0; i < resp.length; i++) {
            this.trade.rows.push(resp[i]);
          }
        });
    },
    startWebsock() {
      this.stopWebsock();
      var stompClient = null;
      var that = this;
      var connectionId = Date.now() + Math.random().toString(36);
      this.currentConnectionId = connectionId;
      console.log(that.swapHost)
      var socket = new SockJS(that.swapHost + that.api.swap.ws);
      stompClient = Stomp.over(socket);
      this.stompClient = stompClient;
      stompClient.debug = true;
      stompClient.connect({}, function (frame) {
        if (connectionId !== that.currentConnectionId) {
          console.log("Stale connection connected, ignoring.");
          try { stompClient.disconnect(); } catch (e) { }
          return;
        }
        //订阅持仓变化
        if (that.member) {
          stompClient.subscribe("/topic/swap/order/" + that.member.id, function (msg) {
            if (connectionId !== that.currentConnectionId) return;
            that.getMemberContractWallet();
          });
        }
        //订阅K线
        stompClient.subscribe("/topic/swap/kline/" + that.currentCoin.symbol, function (msg) {
          if (connectionId !== that.currentConnectionId) return;
          var resp = JSON.parse(msg.body);
          // console.log("++++",resp)
          if (resp["1m"]) {
            that.currentCoin.close = resp["1m"].closePrice
          }
          if (that.$refs.kline) {
            that.$refs.kline.refreshKline(resp);
          }
        });
        //订阅价格变化消息
        stompClient.subscribe("/topic/swap/thumb", function (msg) {
          if (connectionId !== that.currentConnectionId) return;
          var resp = JSON.parse(msg.body);
          var coin = that.getCoin(resp.symbol);
          // console.log("----", coin)
          if (coin != null) {
            // coin.price = resp.close.toFixed(2);
            coin.price = resp.close;
            if (that.currentCoin.symbol != coin.symbol) {//这里注释掉，close从K线获取
              coin.close = resp.close;
            }
            coin.rose =
              resp.chg > 0
                ? "+" + (resp.chg * 100).toFixed(2) + "%"
                : (resp.chg * 100).toFixed(2) + "%";
            // coin.close = resp.close.toFixed(2);
            // coin.high = resp.high.toFixed(2);
            // coin.low = resp.low.toFixed(2);
            coin.high = resp.high;
            coin.low = resp.low;
            coin.turnover = parseInt(resp.volume);
            coin.volume = resp.volume;
            coin.usdRate = resp.usdRate;
          }
        });
        //订阅实时成交信息
        stompClient.subscribe(
          "/topic/swap/trade/" + that.currentCoin.symbol,
          function (msg) {
            if (connectionId !== that.currentConnectionId) return;
            var resp = JSON.parse(msg.body);
            if (resp.length > 0) {
              for (var i = 0; i < resp.length; i++) {
                that.trade.rows.unshift(resp[i]);
              }
            }
            if (that.trade.rows.length > 30) {
              that.trade.rows = that.trade.rows.slice(0, 30);
              // if(that.$refs.kline){
              //  that.$refs.kline.pushKLine(that.trade.rows[0]);
              // }
            }
          }
        );
        if (that.isLogin) {
          //订阅委托取消信息
          /*
          stompClient.subscribe(
            "/topic/swap/order-canceled/" +
              that.currentCoin.symbol +
              "/" +
              that.member.id,
            function(msg) {
              var resp = JSON.parse(msg.body);
              that.refreshAccount();
            }
          );
          //订阅委托交易完成
          stompClient.subscribe(
            "/topic/swap/order-completed/" +
              that.currentCoin.symbol +
              "/" +
              that.member.id,
            function(msg) {
              var resp = JSON.parse(msg.body);
              that.refreshAccount();
            }
          );
          //订阅委托部分交易
          stompClient.subscribe(
            "/topic/swap/order-trade/" +
              that.currentCoin.symbol +
              "/" +
              that.member.id,
            function(msg) {
              var resp = JSON.parse(msg.body);
              that.refreshAccount();
            }
          );
          */
        }

        //订阅盘口消息
        stompClient.subscribe(
          "/topic/swap/trade-plate/" + that.currentCoin.symbol,
          function (msg) {
            if (connectionId !== that.currentConnectionId) return;
            var resp = JSON.parse(msg.body);
            console.log('resp', resp)
            if (resp.direction == "SELL") {
              var asks = resp.items;
              that.plate.askRows = [];
              let totle = 0;
              for (var i = that.plate.maxPostion - 1; i >= 0; i--) {
                var ask = {};
                if (i < asks.length) {
                  ask = asks[i];
                } else {
                  ask["price"] = 0;
                  ask["amount"] = 0;
                }
                ask.direction = "SELL";
                ask.position = i + 1;
                that.plate.askRows.push(ask);
              }
              for (var i = that.plate.askRows.length - 1; i >= 0; i--) {
                if (
                  i == that.plate.askRows.length - 1 ||
                  that.plate.askRows[i].price == 0
                ) {
                  that.plate.askRows[i].totalAmount =
                    that.plate.askRows[i].amount;
                } else {
                  that.plate.askRows[i].totalAmount =
                    that.plate.askRows[i + 1].totalAmount +
                    that.plate.askRows[i].amount;
                }
                totle += that.plate.askRows[i].amount;
              }
              that.plate.askTotle = totle;
            } else {
              var bids = resp.items;
              var reversedBids = bids.slice().reverse();
              that.plate.bidRows = [];
              let totle = 0;

              for (var i = 0; i < that.plate.maxPostion; i++) {
                var bid = {};
                if (i < reversedBids.length) {
                  bid = reversedBids[i];
                } else {
                  bid["price"] = 0;
                  bid["amount"] = 0;
                }
                bid.direction = "BUY";
                bid.position = i + 1;
                that.plate.bidRows.push(bid);
              }

              for (var i = 0; i < that.plate.bidRows.length; i++) {
                if (i == 0 || that.plate.bidRows[i].amount == 0) {
                  that.plate.bidRows[i].totalAmount =
                    that.plate.bidRows[i].amount;
                } else {
                  that.plate.bidRows[i].totalAmount =
                    that.plate.bidRows[i - 1].totalAmount +
                    that.plate.bidRows[i].amount;
                }
                totle += that.plate.bidRows[i].amount;
              }
              that.plate.bidTotle = totle;
            }
            if (that.currentImgTable === 's') {
              that.getPlateFull();
            }
          }
        );
      });
    },
    open_order() {
      this.showMarket = false;
    },
    close_order() {
      this.showMarket = true;
    },
    gohref(currentRow, oldCurrentRow) {
      console.log(currentRow)
      this.$router.push({
        name: 'SwapPair',
        params: {
          pair: currentRow.href
        }
      });
    },
    buyPlate(currentRow) {
      this.form.entrustPrice = currentRow.price;
    },
    sellPlate(currentRow) {
      this.form.entrustPrice = currentRow.price;
    },
    cancel(eid) {
      var that = this;
      this.$Modal.confirm({
        title: "撤单提示",
        content: this.$t("swap.undotip"),
        onOk: () => {
          let params = {
            entrustId: eid
          };
          this.$http
            .post(this.swapHost + this.api.swap.cancel, params)
            .then(response => {
              var resp = response.body;
              if (resp.code == 0) {
                this.$Notice.success({
                  title: this.$t("swap.tip"),
                  desc: this.$t("swap.cancelsuccess")
                });
                setTimeout(function () {
                  that.getMemberContractWallet();
                }, 1000);
              } else {
                this.$Notice.error({
                  title: this.$t("swap.tip"),
                  desc: resp.message
                });
              }
            });
        }
      });
    },
    timeFormat: function (tick) {
      return moment(tick).format("HH:mm:ss");
    },
    dateFormat: function (tick) {
      return moment(tick).format("MM-DD HH:mm:ss");
    },
    showMarginModeModal() {
      if (!this.isLogin) return;

      this.marginModeModal = true;
    },
    changeMarginMode(val) {
      if (!this.isLogin) {
        return;
      }
      var that = this;
      let params = {
        contractCoinId: this.contractCoinInfo.id,
        targetPattern: Number(val)
      };
      this.$http
        .post(this.swapHost + this.api.swap.switchPattern, params)
        .then(response => {
          var resp = response.body;
          if (resp.code == 0) {
            this.$Message.success(this.$t("swap.marginModeSuccessTip"));
            this.getMemberContractWallet();
          } else {
            this.$Message.error(resp.message);
          }
        });
    },
    showAdjustLeverage(type) {
      if (!this.isLogin) return;

      this.leverageModal = true;
      this.leverageType = this.contractCoinInfo.leverageType;
      if (type == 1) {
        this.leverageAdjustVal = Number(this.contractWalletInfo.usdtBuyLeverage);
      } else {
        this.leverageAdjustVal = Number(this.contractWalletInfo.usdtSellLeverage);
      }
      // 默认杠杆如不在范围内
      var levArr = this.contractCoinInfo.leverage.split(",");
      if (this.leverageAdjustVal < levArr[0]) {
        this.leverageAdjustVal = Number(levArr[0]);
      }
      if (this.leverageAdjustVal > levArr[levArr.length - 1]) {
        this.leverageAdjustVal = Number(levArr[levArr.length - 1]);
      }

      this.changeLeverageType = type;
    },
    changeLeverage(lev) { // 离散模式：选择杠杆
      if (this.changeLeverageType == 1) {//多仓杠杆
        this.leverageAdjustVal = lev;
      } else {//空仓杠杆
        this.leverageAdjustVal = lev;
      }
    },

    openChange() {
      console.log(this.form.volume)


    },
    changeEntrustOrderType(value) {
      this.form.entrustPrice = this.currentCoin.price;
      if (value == "2") { // 计划委托
        this.form.trigglePrice = "";
        this.form.volume = "";
      } else if (value == "0") { // 限价委托
        this.form.entrustPrice = this.currentCoin.price;
        this.form.volume = "";
      }
    },
    stopWebsock() {
      this.currentConnectionId = null;
      if (this.stompClient) {
        try {
          if (this.stompClient.ws && this.stompClient.ws.readyState === WebSocket.OPEN) {
            this.stompClient.ws.close();
          }

          if (this.stompClient.connected) {
            this.stompClient.disconnect(() => {
              console.log("WebSocket 已断开");
            });
          }
        } catch (error) {
          console.error("断开 WebSocket 时出错:", error);
        } finally {
          this.stompClient = null;
          console.log("WebSocket 连接已清理");
        }
      }
    },
    onLeverageChange(val) {
      if (!this.isLogin) return;
      this.leverageAdjustVal = val;
    },
    adjustLeverage() { // 连续模式，确认选择杠杆
      if (!this.isLogin) return;
      var levArr = this.contractCoinInfo.leverage.split(",");
      if (this.leverageAdjustVal < Number(levArr[0])) {
        this.leverageAdjustVal = Number(levArr[0]);
        this.$Message.error(this.$t("swap.levmintip"));
        return;
      }
      if (this.leverageAdjustVal > Number(levArr[levArr.length - 1])) {
        this.leverageAdjustVal = Number(levArr[levArr.length - 1]);
        this.$Message.error(this.$t("swap.levmaxtip"));
        return;
      }

      if (this.changeLeverageType == 1 && this.buyLeverage == this.leverageAdjustVal) {
        this.leverageModal = false;
        return;
      }
      if (this.changeLeverageType == 2 && this.sellLeverage == this.leverageAdjustVal) {
        this.leverageModal = false;
        return;
      }
      // TODO 检查是否能够更改为目标杠杆

      this.$Spin.show();

      var that = this;
      let hasChanged = false;
      let params = {
        contractCoinId: this.contractCoinInfo.id,
        leverage: this.leverageAdjustVal,
        direction: this.changeLeverageType == 1 ? 0 : 1
      };

      this.$http
        .post(this.swapHost + this.api.swap.modifyLeverage, params)
        .then(response => {
          var resp = response.body;
          if (resp.code == 0) {
            this.$Notice.success({
              title: that.$t("swap.tip"),
              desc: that.$t("swap.success")
            });
            hasChanged = true;
            this.getMemberContractWallet();
          } else {
            this.$Notice.error({
              title: that.$t("swap.tip"),
              desc: resp.message
            });
          }
          this.$Spin.hide();

          if (!hasChanged) {
            return;
          }
          if (this.changeLeverageType == 1) { //多仓杠杆
            this.buyLeverage = this.leverageAdjustVal;
          } else { // 空仓杠杆
            this.sellLeverage = this.leverageAdjustVal;
          }

          this.leverageModal = false;
        });
    },
    onOpenAmountFocus() {
      this.sliderOpenPercent = 0;
    },
    onChangeOpenPercent(val) {
      this.sliderOpenPercent = val;
    },
    onCloseAmountFocus() {
      this.sliderClosePercent = 0;
    },
    onChangeClosePercent(val) {
      this.sliderClosePercent = val;
    },
    onOpen(direction) { // 开仓：买入开多
      if (!this.isLogin) return;
      var temVolume = 0;
      if (this.sliderOpenPercent > 0) {
        if (direction == 0) {
          temVolume = this.formattedNumber(this.avaOpenBuy() * this.sliderOpenPercent / 100);
        } else {
          temVolume = this.formattedNumber(this.avaOpenSell() * this.sliderOpenPercent / 100);
        }
      } else {
        temVolume = this.form.volume;
      }
      if (this.form.triggerPrice == "" || this.form.triggerPrice == undefined) {
        this.form.triggerPrice = 0;
      }
      var oType = parseInt(this.entrustOrderType);
      if (oType == 2 && this.form.triggerPrice <= 0) {
        this.$Message.error(this.$t("swap.triggerpriceshouldbigger"));
        return;
      }
      let params = {
        type: oType, // 0:市价 1:限价 2计划委托
        direction: direction,// 买入
        contractCoinId: this.contractCoinInfo.id,
        triggerPrice: this.form.triggerPrice,
        entrustPrice: this.form.entrustPrice == "" ? 0 : this.form.entrustPrice,
        leverage: Number(this.leverage),
        volume: temVolume,
        terminal: 3
      };
      if (params.volume <= 0) {
        this.$Message.error(this.$t("swap.pleaseinputopenvolume"));
        return;
      }
      var reg = /^(?!0\d)\d+(\.\d+)?$/;
      if (!reg.test(params.volume)) {
        this.$Message.error(this.$t("swap.pleaseinputcorrectopenvolume"));
        return;
      }
      if (direction == 0) { // 买入开多(计划委托时，不需考虑额度问题)
        if (params.volume > this.avaOpenBuy() && params.type != 3) {
          this.$Message.error(this.$t("swap.noenoughbalance"));
          return;
        }
      } else { // 卖出开空
        if (params.volume > this.avaOpenSell() && params.type != 3) {
          this.$Message.error(this.$t("swap.noenoughbalance"));
          return;
        }
      }
      if (this.entrustOrderType == 1) { // 限价，必须输入价格
        if (this.form.entrustPrice == "" || this.form.entrustPrice == 0) {
          this.$Message.error(this.$t("swap.pleaseinputrightentrustprice"));
          return;
        }
      }
      this.$Spin.show();
      var that = this;
      this.$http
        .post(this.swapHost + this.api.swap.open, params)
        .then(response => {
          var resp = response.body;
          if (resp.code == 0) {
            this.$Notice.success({
              title: that.$t("swap.tip"),
              desc: that.$t("swap.success")
            });
            setTimeout(function () {
              that.getMemberContractWallet();
            }, 1000);
          } else {
            this.$Notice.error({
              title: that.$t("swap.tip"),
              desc: resp.message
            });
          }
          this.$Spin.hide();
        });
    },
    formattedNumber(number) {
      return Math.floor(number * 100) / 100;
    },
    onClose(direction) { // 平仓：卖出平多
      if (!this.isLogin) return;
      var temVolume = 0;
      if (this.sliderClosePercent > 0) {
        if (direction == 0) {
          temVolume = parseInt(this.contractWalletInfo.usdtSellPosition * this.sliderClosePercent / 100);
        } else {
          temVolume = parseInt(this.contractWalletInfo.usdtBuyPosition * this.sliderClosePercent / 100);
        }

        if (temVolume < 1) {
          temVolume = 1;
        }
      } else {
        temVolume = parseInt(this.form.volume);
      }
      if (this.form.triggerPrice == "" || this.form.triggerPrice == undefined) {
        this.form.triggerPrice = 0;
      }
      var oType = parseInt(this.entrustOrderType);
      if (oType == 2 && this.form.triggerPrice <= 0) {
        this.$Message.error(this.$t("swap.triggerpriceshouldbigger"));
        return;
      }
      let params = {
        type: this.entrustOrderType, // 0:市价 1:限价 2计划委托
        direction: direction,// 买入
        contractCoinId: this.contractCoinInfo.id,
        triggerPrice: Number(this.form.triggerPrice),
        entrustPrice: this.form.entrustPrice == "" ? 0 : Number(this.form.entrustPrice),
        volume: temVolume
      };
      if (params.volume <= 0) {
        this.$Message.error(this.$t("swap.pleaseinputclosevolume"));
        return;
      }
      var reg = /^\+?[1-9][0-9]*$/;
      if (!reg.test(params.volume)) {
        this.$Message.error(this.$t("swap.pleaseinputcorrectclosevolume"));
        return;
      }
      if (direction == 0) { // 买入开多(计划委托时，不需考虑额度问题)
        if (params.volume > this.contractWalletInfo.usdtSellPosition && params.type != 3) {
          this.$Message.error(this.$t("swap.noenoughposition"));
          return;
        }
      } else { // 卖出开空
        if (params.volume > this.contractWalletInfo.usdtBuyPosition && params.type != 3) {
          this.$Message.error(this.$t("swap.noenoughposition"));
          return;
        }
      }
      if (this.entrustOrderType == 1) { // 限价，必须输入价格
        if (this.form.entrustPrice == "" || this.form.entrustPrice == 0) {
          this.$Message.error(this.$t("swap.pleaseinputrightentrustprice"));
          return;
        }
      }

      this.$Spin.show();
      var that = this;
      this.$http
        .post(this.swapHost + this.api.swap.close, params)
        .then(response => {
          var resp = response.body;
          if (resp.code == 0) {
            this.$Notice.success({
              title: that.$t("swap.tip"),
              desc: that.$t("swap.success")
            });
            setTimeout(function () {
              that.getMemberContractWallet();
            }, 1000);
          } else {
            this.$Notice.error({
              title: that.$t("swap.tip"),
              desc: resp.message
            });
          }
          this.$Spin.hide();
        });
    },
    getCurrentEntrustOrders() {
      if (!this.isLogin) return;
      var that = this;
      let params = {
        //symbol: this.currentCoin.symbol,
        pageNo: 1,
        pageSize: 50
      };
      this.$http
        .post(this.swapHost + this.api.swap.getEntrustList, params)
        .then(response => {
          var resp = response.body;
          if (resp.records.length > 0) {
            this.currentEntrustOrderList.splice(0);
            resp.records.forEach(function (item) {
              that.currentEntrustOrderList.push(item);
            });
            this.currentlength = resp.total
          } else {
            this.currentEntrustOrderList.splice(0);
          }
        });
    },
    getHistoryEntrustOrders() {
      if (!this.isLogin) return;
      var that = this;
      let params = {
        //symbol: this.currentCoin.symbol,
        pageNo: 1,
        pageSize: 50
      };
      this.$http
        .post(this.swapHost + this.api.swap.getHistoryEntrustList, params)
        .then(response => {
          var resp = response.body;
          if (resp.records.length > 0) {
            this.historyEntrustOrderList.splice(0);
            resp.records.forEach(function (item) {
              that.historyEntrustOrderList.push(item);
            });
          } else {
            this.historyEntrustOrderList.splice(0);
          }
        });
    },
    getCurrentOrder() {
      if (!this.isLogin) return;
      var that = this;
      let params = {
        pageNo: 1,
        pageSize: 50
      };
      this.$http
        .post(this.swapHost + this.api.swap.getCurrentOrderList, params)
        .then(response => {
          var resp = response.body;
          if (resp.records.length > 0) {
            this.currentPositionList.splice(0);
            resp.records.forEach(function (item) {
              that.currentPositionList.push(item);
            });
            this.holderslength = resp.total
          } else {
            this.currentPositionList.splice(0);
          }
        });
    },
    getHistoryOrderHolders() {
      if (!this.isLogin) return;
      var that = this;
      let params = {
        pageNo: 1,
        pageSize: 50
      };
      this.$http
        .post(this.swapHost + this.api.swap.getHistoryOrderList, params)
        .then(response => {
          var resp = response.body;
          if (resp.records.length > 0) {
            this.historyHoldersList.splice(0);
            resp.records.forEach(function (item) {
              that.historyHoldersList.push(item);
            });
          } else {
            this.historyHoldersList.splice(0);
          }
        });
    },
    accuracys(item) {
      if (item == 'BTC/USDT' || item == 'ETH/USDT' || item == 'SOL/USDT' || item == 'BNB/USDT' || item == 'BCH/USDT') {
        return 2
      } else if (item == 'DOGE/USDT' || item == 'TRX/USDT') {
        return 5
      } else if (item == 'MEME/USDT') {
        return 6
      } else {
        return 4
      }
    },
    getsymbolid() {
      const sybolid = this.coinList.find(item => {
        return item.symbol == this.backhandData.symbol
      })
      return sybolid.id
    },
    //反手交易
    backhandtrading(item) {
      this.backhandData = item
      this.backhandtradingModel = true

    },
    async handlerbackhandtradingModel() {
      let params = {
        type: 0, // 0:市价 1:限价 2计划委托
        volume: this.backhandData.volume,
        orderId: this.backhandData.id,
        entrustPrice: this.getCoins(this.backhandData.symbol).close
      };
      let that = this
      this.$http
        .post(this.swapHost + this.api.swap.close, params)
        .then(response => {
          var resp = response.body;
          if (resp.code == 0) {
            let openparams = {
              type: 0, // 0:市价 1:限价 2计划委托
              direction: this.backhandData.direction == 0 ? '1' : '0',// 买入
              contractCoinId: this.getsymbolid(),
              triggerPrice: this.form.entrustPrice == "" ? 0 : this.form.entrustPrice,
              entrustPrice: this.form.entrustPrice == "" ? 0 : this.form.entrustPrice,
              leverage: this.backhandData.leverage,
              volume: this.backhandData.maxVolume,
              terminal: 3
            };
            this.$http
              .post(this.swapHost + this.api.swap.open, openparams)
              .then(response => {
                var resp = response.body;
                if (resp.code == 0) {
                  this.$Notice.success({
                    title: '修改成功',
                    desc: this.$t("swap.success")
                  });
                  setTimeout(function () {
                    that.getMemberContractWallet();
                  }, 1000);
                  this.backhandtradingModel = false

                } else {
                  this.$Notice.error({
                    title: this.$t("swap.tip"),
                    desc: resp.message
                  });
                }
              });
          }
        });
    },
  }
}
</script>

<style scoped lang="scss">
@import url(../../assets/css/swap.css);
$night-bg: #0b1520;
$night-headerbg: #27313e;
$night-contentbg: #192330;
$night-color: #fff;
$popper-background-color: #192330;


* {
  white-space: nowrap;
}

.swap {
  padding: 0 10px;

  .main_box {
    width: 100%;
    display: flex;
    justify-content: space-between;

    .left {
      border-radius: 0px;
      overflow: hidden;

      .handlers {
        width: 100px;
        display: inline-block;
        margin-top: 10px;
        margin-bottom: 5px;
        background-color: #eaeaed;
        font-size: 0;
        border-radius: 20px;
        height: 26px;
        display: flex;
        align-items: center;
        justify-content: space-between;

        .active {
          background-color: #fff;
          width: 32px;
          height: 21px;
          border-radius: 9999px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .ceneter {
          width: 32px;
          height: 21px;
          display: flex;
          align-items: center;
          justify-content: center;
        }


        .handler {
          display: inline-block;
          width: 15px;
          height: 15px;
          background-size: 100% 100%;
          cursor: pointer;

          &.handler-all {
            background-image: url("../../assets/images/plate_all.png");
          }

          &.handler-green {
            background-image: url("../../assets/images/plate_green.png");
          }

          &.handler-red {
            background-image: url("../../assets/images/plate_red.png");
          }
        }
      }

      .plate-nowprice {
        margin: 5px 0;
        height: 50px;
        font-size: 14px;
        font-weight: 500;
        display: flex;
        align-items: center;
        justify-content: center;

        .price {
          font-size: 20px !important;
          font-weight: 700;
          margin-right: 10px;
        }

        .price-cny {
          font-size: 12px;
          margin-left: 10px;
          font-weight: 400;
          color: #a0a3a7;
        }
      }
    }


    .center {
      margin-right: 10px;
      width: 80%;
      height: 620px;
      border: 1px solid #eaeaed;
      padding: 10px 10px 10px 0;
      border-radius: 12px;

      .imgtable {
        width: 100%;
        // height: 446px;
        position: relative;

        .handler {
          position: absolute;
          top: 10px;
          right: 40px;
          z-index: 100;

          >span {
            background-color: #f8f8f8;
            color: #000;
            padding: 4px 8px;
            cursor: pointer;
            font-size: 13px;
            opacity: 0.5;

            &.active {
              background-color: #D0F500;

            }
          }
        }
      }

      .trade_wrap {
        .trade_menu {
          position: relative;
          background-color: #192330;
          border-top-left-radius: 0px;
          border-top-right-radius: 0px;
          border-bottom: 1px solid #27313e;
          font-size: 0;
          height: 40px;
          line-height: 40px;

          >span {
            font-size: 16px;
            padding: 11px 20px;
            cursor: pointer;

            &.active {
              color: #FFF;
              border-bottom: 2px solid #f0a70a;
            }

            &:first-child {
              border-top-left-radius: 0px;
            }
          }

          .fee-wrap {
            position: absolute;
            top: 0;
            right: 20px;
            font-size: 12px;

            >span {
              margin-right: 10px;
              color: #7c7f82;
            }

            >a {
              vertical-align: middle;
            }
          }
        }

        .trade_panel {
          position: relative;

          .mask {
            position: absolute;
            width: 100%;
            height: 100%;
            display: flex;
            background-color: rgba(0, 52, 77, 0.8);
            justify-content: center;
            align-items: center;
            z-index: 100;
            font-size: 24px;
            border-radius: 0px;
            // color: #bcd7e6;
          }

          .publish-mask {
            position: absolute;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 37, 64, 0.93);
            justify-content: center;
            align-items: center;
            z-index: 101;
            font-size: 24px;
            border-radius: 0px;
            // color: #bcd7e6;
          }
        }

        .trade_panel .panel .hd {
          border-bottom: none;

          b {
            color: #fff;
          }

          a {
            color: #f0a70a;
          }
        }
      }
    }

    .right {
      flex: 0 0 23%;

      .coin-menu {
        overflow: hidden;
        height: 512px;
        border-radius: 0px;
      }
    }
  }

  .symbol {
    display: flex;
    gap: 30px;
    padding: 12px 0 12px 20px;
    margin-bottom: 5px;
    align-items: center;
    line-height: 1;
    border: 1px solid #eaeaed;
    border-radius: 8px;

    .item {

      .price-cny {
        font-size: 12px;
        color: #8e8e92;
        font-weight: 700;
      }

      .coin-box {
        display: flex;
        align-items: center;
        gap: 10px;
      }

      .coin {
        font-size: 14px;
        font-weight: 700;
        cursor: pointer;
        margin-bottom: 6px;
      }

      .text {
        width: 100%;
        display: block;
        font-size: 12px;
        color: #999;
        margin-bottom: 5px;
      }

      .num {
        font-size: 12px;
        margin-bottom: 6px;
      }

      >img {
        display: block;
        width: 18px;
        height: 18px;
        cursor: pointer;
      }
    }
  }

  .order {
    min-height: 227px;

    overflow: hidden;

    .order-handler {
      padding: 10px;
      background-color: #fff;
      display: flex;
      align-items: center;
      gap: 20px;

      >span {
        font-size: 12px;
        cursor: pointer;
        color: #8e8e92;

        &.active {
          font-weight: 700;
          color: #000;
          background-color: #2bc287;
          padding: 4px 10px;
          border-radius: 12px;
        }
      }
    }
  }
}

.exchange.day {
  color: #333;
  background-color: #fff;

  .main {
    .left {
      background-color: #fff;
      box-shadow: 0 0 2px #ccc;

      .handlers {
        background-color: #fff;
      }

      .plate-nowprice {
        background-color: #fff;
        border-top: 1px solid #f0f0f0;
        border-bottom: 1px solid #f0f0f0;
      }
    }

    .imgtable {
      width: 100%;
      box-shadow: 0 0 2px #ccc;

      .handler {
        >span {
          border: 1px solid #333;
        }
      }
    }

    .trade_wrap {
      box-shadow: 0 0 2px #ccc;

      .trade_menu {
        background-color: #fafafa;

        >span {
          background-color: #fafafa;
          border-right: 1px solid #f0f0f0;

          &.active {
            background-color: #fff;
            color: #f0a70a;
          }

          &:last-child {
            border-top-right-radius: 6px;
          }
        }

        .ivu-icon {
          color: #333 !important;
        }
      }

      .trade_panel {
        box-shadow: 0 0 2px #ccc;

        .mask {
          background-color: rgba(0, 52, 77, 0.8);
          color: #fff;
        }
      }

      .trade_panel .panel .hd {
        border-bottom: none;

        b {
          color: #333;
        }

        a {
          color: #f0a70a;
        }
      }
    }

    .right {
      .coin-menu {
        background-color: #fff;
        box-shadow: 0 2px 2px #ccc;
      }

      .trade-wrap {
        box-shadow: 0 0 2px #ccc;
        border-radius: 6px;
      }

      // .ivu-table-wrapper{
      //         box-shadow:0 0 2px #ccc;
      //       }
    }
  }

  .symbol {
    background-color: #fff;
    box-shadow: 0 0 2px #ccc;

    .item {
      .text {
        color: #999;
      }

      .num {
        color: #333;
      }
    }
  }

  .order {
    box-shadow: 0 2px 2px #ccc;
    min-height: 227px;

    .order-handler {
      border-bottom: 1px solid #eaeaed;
      margin-right: -2px;
      background-color: #fff;

      >span {
        color: #333;
        background-color: #fafafa;
        box-shadow: 0 0 2px #ccc;

        &.active {
          color: #f0a70a;
          background-color: #fff;
        }
      }
    }
  }
}

.coin-info {
  color: #8f9ca5;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 5;
  overflow: hidden;
  padding-top: 15px;
}

.tab-header {
  display: flex;
  border-bottom: 1px solid #eaeaed;
}

.tab-item {
  font-size: 12px;
  position: relative;
  font-weight: 400;
  padding: 10px 8px;
  cursor: pointer;
  text-align: center;
  display: inline-block;
  transition: color 0.3s;
  font-weight: 400;
  color: #494747;
}

.tab-item:hover {
  font-weight: 700;
}

.tab-item::after {
  content: '';
  position: absolute;
  left: 50%;
  bottom: 0;
  height: 3px;
  color: white;
  background: transparent;
  transition: background 0.3s;
  width: 0;
  transform: translateX(-50%);
}

.tab-item.active {
  font-weight: bold;
}

.tab-item.active::after {
  background: #D0F500;
  width: calc(100% - 30px);
}

.popup {
  position: absolute;
  left: 40px;
  width: 400px;
  box-shadow: 0 2px 10px #f5f5f5;
  background-color: #fff;
  z-index: 1000;
  padding: 10px;
  border-radius: 4px;


}

.flex2 {
  height: 99%;
  display: flex;
  flex-direction: column;
}

.order {
  width: 100%;
}

.New_flex {
  overflow: hidden;
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
}

.newHeight {
  height: calc(100% - 91px);
}

.operate_lebal {
  margin-top: 10px;
  color: #ccc;
  font-size: 14px;
}

.operate_value {
  margin-top: 10px;
  color: #ccc;
  font-size: 14px;
}

.box1 {
  width: 80%;
  margin-right: 10px;
  display: flex;
  min-width: 800px;
  flex-wrap: wrap;
  justify-content: space-between;
}

@media (max-width: 1024px) {
  .box1 {
    width: 100%;
  }

  .box2,
  .box3 {
    display: none;
  }
}

.box3 {
  border: 1px solid #eaeaed;
  border-radius: 12px !important;
}


::v-deep(.ivu-table) {
  overflow: visible !important;
}

::v-deep(.ivu-table-wrapper) {
  overflow: visible !important;

}

::v-deep(.ivu-tooltip-inner) {
  max-width: 300px;
  background-color: #fff;
  color: #000;
}

.close-position-popup {
  z-index: -1;
  border-top-left-radius: 20px;
  border-top-right-radius: 20px;



  .popup-content {
    padding: 10px;

    .position-pair {
      font-weight: bold;
      font-size: 15px;
      margin-right: 10px;
    }

    .popup-pair-info {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .position-left {
      display: flex;
      align-items: center;

      .position-buy {
        color: #4CAF50;
        font-weight: 700;
        padding: 0 5px;
        border-radius: 4px;
        font-size: 12px;
      }

      .position-sell {
        color: rgb(255, 0, 0);
        font-weight: 700;
        padding: 2px 10px;
        border-radius: 4px;
        font-size: 12px;
      }

      .position-type {
        font-size: 12px;
        padding: 0 4px;
        border-radius: 5px;
        color: #000;
        background-color: #f3f3f3;
        font-weight: 700;
        margin-right: 10px;
      }

      .position-leverage {
        font-size: 12px;
        border-radius: 5px;
        font-weight: 700;
        padding: 0 4px;
        color: #000;
        background-color: #f3f3f3;
        margin-right: 10px;
      }
    }

    .position-box {
      margin-top: 10px;
      border: 1px solid #eaeaed;
      padding: 15px;
      border-radius: 15px;

      .position-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 15px;
      }

      .position-buy {
        background-color: #4CAF50;
        color: white;
        padding: 1px 5px 0 5px;
        border-radius: 4px;
        font-size: 10px;
        margin-right: 4px;
      }

      .position-sell {
        background-color: #d81e06;
        color: white;
        padding: 1px 5px 0 5px;
        border-radius: 4px;
        font-size: 10px;
        margin-right: 4px;
        line-height: 16px;
      }

      .position-type {
        font-size: 12px;
        padding: 0 4px;
        border-radius: 5px;
        color: #000;
        background-color: #f3f3f3;
        margin-right: 10px;
      }

      .position-leverage {
        font-size: 12px;
        border-radius: 5px;
        padding: 0 4px;
        color: #000;
        background-color: #f3f3f3;
        margin-right: 10px;
      }
    }
  }
}

.paragraph {
  padding: 25px 0 15px 0;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;

  .paragraph-line {
    height: 1px;
    width: 100%;
    background-color: #27313e;
  }

  .paragraph-info {
    padding: 2px 10px;
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    position: absolute;
    background-color: #f3f3f3;
  }
}

.flex1 {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.custom-tabs {
  border: 1px solid #eaeaed;
  border-radius: 12px !important;
}

.tab-pane {
  height: 540px;
  overflow: hidden;
}

.order-box {
  width: 100%;
  margin-top: 5px;
  flex: 0 0 100%;
  border: 1px solid #eaeaed;
  border-radius: 12px;
}

::v-deep(.ivu-table-header) {
  padding: 5px 0;
  border-bottom: 1px solid #eaeaed !important;
  margin-bottom: 5px;
}

.buyPlate ::v-deep(.ivu-table-header) {
  display: none;
}

.order-handler-item {
  border-radius: 9999px;
  width: 45%;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 40px;
  text-align: center;
  color: #fff !important;
  background-color: #f8f8f8;
}

.radioGroup-border {
  border-bottom: 1px solid #eaeaed;
}

.account-item {
  margin-top: 10px !important;
}

.tooltip-content {
  background-color: #fff !important;
  color: #000 !important;
  box-shadow: 0 0 2px #ccc;

}

::v-deep(.ivu-table-row) {}

// ::v-deep(.ivu-input-default) {
//   width: 80%;
//   margin-left: 20px;
// }</style>