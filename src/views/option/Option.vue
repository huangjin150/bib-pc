<template>
  <div class="option">
    <div
      style="display:none;background-image: linear-gradient( 135deg, #FD6585 10%, #0D25B9 100%);text-align: center;height:30px;line-height:30px;letter-spacing: 1px;color:#FFF;">
    </div>
    <div class="ctc_container">
      <h1>{{ $t('option.desc') }}</h1>
      <div class="main">
        <div class="ctc-container">
          <div class="trade_wrap">
            <div class="trade_panel">
              <div class="trade_bd_ctc">
                <div class="panel panel_buy">
                  <div class="bd bd_limited">
                    <!-- 选择币种 -->
                    <div style="position: relative;">
                      <div style="position: relative;">
                        <div>
                          <el-progress style="width: 100%; padding: 10px 0; overflow: hidden;" :show-text="false"
                            :color="progressColor" :stroke-width="8" :text-inside="true"
                            :percentage="progressValue"></el-progress>
                        </div>
                        <div class="current-period">
                          <div class="animated-image_box">
                            <transition name="image-transition" @after-enter="onAnimationEnd">
                              <img v-if="show" src="../../assets/images/goldcoin2.gif" alt="弹出图片" class="animated-image"
                                :style="imageStyle" />
                            </transition>
                          </div>
                          <div class="NewFlex">
                            <div class="NewFlex_left">
                              <div class="last-period">
                                <div
                                  style="width: 16%;text-align: center;  display: flex; float:left;height:40px;line-height: 40px;font-size: 20px;font-weight: bold;">
                                  <span style="color: #000;">BTC/USDT &nbsp;</span>
                                  <span v-if="openingOption.optionNo" style=" white-space: nowrap;color: #000;">
                                    {{
                                      $t('option.seriers') }} {{
                                      openingOption.optionNo }}
                                    {{ $t('option.period')
                                    }}</span>
                                  <div>
                                    <Icon type="ios-alarm" style="margin-top: -3px; margin-left: 3px;color: #000;" />
                                  </div>
                                </div>
                                <div class="period-content">
                                  <div class="content-item color_gold" v-if="isLogin">
                                    <span>下单总额: <b>{{ myOpeningOption.totalBetAmount }}</b> USDT</span>
                                    &nbsp;&nbsp;
                                  </div>
                                  <div style="float:left;" v-if="!isLogin">{{ $t('option.myamount') }}:
                                    <router-link to="/login" id="login">{{ $t("common.login")
                                    }}</router-link>/<router-link to="/register" id="register">{{
                                        $t("common.register") }}</router-link>
                                  </div>
                                </div>
                                <div v-if="isLogin" class="reward_box">
                                  <div style="margin-right: 10px;" class="Noreward">未领取奖励：<span>{{ rewardAmount
                                      }}USDT</span>
                                  </div>
                                  <div style="padding:  0 10px;"><button @click="showImage"
                                      :disabled="isCollecting">领取</button>
                                  </div>
                                  <div id="balance" style="color: #000;" class="flex">
                                    <div>余额: </div>
                                    <div>{{ assetUsdt }}USDT</div>
                                  </div>
                                </div>
                              </div>
                              <KlineCharts type="candlestick" :autosize="true" :symbol="currentCoinList.symbol"
                                currentResolution="5" ref="kline" id="kline_container" />
                            </div>
                            <div class="NewFlex_right">
                              <div style="height: 100%;">
                                <el-card class="transaction_box" :class="{ 'is-flipped': isFlipped }">
                                  <div class="card-inner">
                                    <div class="card-front">
                                      <div slot="header" class="transaction_head clearfix flex">
                                        <div style="display: flex; align-items: center;">
                                          <div>预测</div>
                                          <div><img @click="noticeCLick"
                                              style="width: 20px; height: 20px; margin-top: 3px; margin-left: 10px; cursor: pointer;"
                                              src="../../assets/images/wenhao1.png" alt=""></div>
                                        </div>
                                        <div v-if="startingOption?.number" style="margin-left: 70px;"> 第{{
                                          startingOption.number }}期</div>
                                        <div v-else></div>
                                        <div v-if="countdownText !== '00:00:00' && countdownText !== '结算中'"
                                          class="Time_label f_a_c ">
                                          <div class="f_a_c">
                                            <div>
                                              <Icon type="ios-alarm" class="Time_Icon" />
                                            </div>
                                            <div style="color: white">本期截止: &nbsp;</div>
                                          </div>
                                          {{ countdownText }}
                                        </div>
                                      </div>
                                      <div class="Time_label_select">
                                        <div class="flex">
                                          <div v-if="startingOption?.number" class="Time_label">预测周期：{{
                                            formatDate(startingOption.startTime) }}
                                            -
                                            {{ formatDate(startingOption.endTime) }}
                                          </div>
                                        </div>
                                        <div style="margin-top: 15px; " class="price_row">
                                          <button class="Btn_n" :class="{ 'active': currentCoin.id == item.id }"
                                            @click="TimeClick(item)" v-for="(item, index) in coinList">{{
                                              item.guessCycle
                                            }}分钟</button>
                                        </div>

                                      </div>
                                      <div v-if="isLoading" class="loading-container">
                                      </div>
                                      <div v-else-if="startingOption?.number" class="card-info">
                                        <div class="card_info_box" style="height: 115px;">
                                          <div class="card_info_box_svg">
                                            <svg height="130px" width="400px" viewBox="0 0 240 65" color="text"
                                              xmlns="http://www.w3.org/2000/svg" class="sc-df97f1b-0 ejMcUv">
                                              <g filter="url(#filter0_i)">
                                                <path
                                                  d="M10.0001 49.2757L10.0003 64H234L234 49.2753C234 42.5136 229.749 36.4819 223.381 34.2077L138.48 3.8859C127.823 0.0796983 116.177 0.0796931 105.519 3.8859L20.6188 34.2076C14.2508 36.4819 10.0001 42.5138 10.0001 49.2757Z"
                                                  fill="#D0F500">
                                                </path>
                                              </g>
                                              <defs>
                                                <filter id="filter0_i" x="10.0001" y="1.03125" width="224"
                                                  height="62.9688" filterUnits="userSpaceOnUse"
                                                  color-interpolation-filters="sRGB">
                                                  <feFlood flood-opacity="0" result="BackgroundImageFix"></feFlood>
                                                  <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix"
                                                    result="shape">
                                                  </feBlend>
                                                  <feColorMatrix in="SourceAlpha" type="matrix"
                                                    values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                                                    result="hardAlpha">
                                                  </feColorMatrix>
                                                  <feOffset></feOffset>
                                                  <feGaussianBlur stdDeviation="1"></feGaussianBlur>
                                                  <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1">
                                                  </feComposite>
                                                  <feColorMatrix type="matrix"
                                                    values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.15 0">
                                                  </feColorMatrix>
                                                  <feBlend mode="normal" in2="shape" result="effect1_innerShadow">
                                                  </feBlend>
                                                </filter>
                                              </defs>
                                            </svg>
                                          </div>

                                          <div class="upData">
                                            <div class="indicator_top">上升</div>
                                            <div class="rate">{{ openingOption.upRate }}x 比率</div>
                                          </div>
                                        </div>
                                        <div class=" transaction_info">
                                          <div>
                                            <div class="" style="position: relative;">
                                              <button class="rise" @click="handlerBets(1)">
                                                预测上升
                                              </button>
                                              <div v-if="startingOption.myBetUp != 0" class="deposit_flex_n">
                                                <div class="label_title_now_now">
                                                  <div style="text-align: center;">已投入 </div>
                                                  <div v-if="startingOption.myBetUp !== 0" class="label_title_value">
                                                    {{
                                                      startingOption.myBetUp }}</div>
                                                </div>
                                              </div>
                                            </div>
                                            <div style="position: relative;">
                                              <button class="decline" @click="handlerBets(2)">
                                                预测下降
                                              </button>
                                              <div v-if="startingOption.myBetdown != 0" class="deposit_flex_n_down">
                                                <div class="label_title_now_now">
                                                  <div style="text-align: center;">已投入 </div>
                                                  <div v-if="startingOption.myBetdown !== 0" class="label_title_value">
                                                    {{
                                                      startingOption.myBetdown }}</div>
                                                </div>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                        <div class="card_info_box" style="height:115px;">
                                          <div
                                            style="position: absolute;margin: 0 auto; transform: translateX(-50%); left: 50%; top: -14px;">
                                            <svg height="130px" width="400px" viewBox="0 0 240 65" color="text"
                                              xmlns="http://www.w3.org/2000/svg" class="sc-df97f1b-0 ejMcUv">
                                              <g filter="url(#filter0_i)">
                                                <path
                                                  d="M10.0001 15.7243L10.0003 1H234L234 15.7247C234 22.4864 229.749 28.5181 223.381 30.7923L138.48 61.1141C127.823 64.9203 116.177 64.9203 105.519 61.1141L20.6188 30.7924C14.2508 28.5181 10.0001 22.4862 10.0001 15.7243Z"
                                                  fill="#ed4014">
                                                </path>
                                              </g>
                                              <defs>
                                                <filter id="filter0_i" x="10.0001" y="1" width="224" height="62.9688"
                                                  filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
                                                  <feFlood flood-opacity="0" result="BackgroundImageFix"></feFlood>
                                                  <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix"
                                                    result="shape">
                                                  </feBlend>
                                                  <feColorMatrix in="SourceAlpha" type="matrix"
                                                    values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                                                    result="hardAlpha">
                                                  </feColorMatrix>
                                                  <feOffset></feOffset>
                                                  <feGaussianBlur stdDeviation="1"></feGaussianBlur>
                                                  <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1">
                                                  </feComposite>
                                                  <feColorMatrix type="matrix"
                                                    values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.15 0">
                                                  </feColorMatrix>
                                                  <feBlend mode="normal" in2="shape" result="effect1_innerShadow">
                                                  </feBlend>
                                                </filter>
                                              </defs>
                                            </svg>
                                          </div>
                                          <div class="decline_Data_now" style="top: 30%;">
                                            <div class="rate">{{ openingOption.downRate }}x 比率</div>
                                            <div class="indicator_down">下降</div>
                                          </div>
                                        </div>
                                      </div>
                                      <div v-else>
                                        <div class="UnderMaintenance_text">维护中</div>
                                      </div>
                                    </div>
                                    <div class="card-back">
                                      <div class="buy_box_info_head flex">
                                        <img style="cursor: pointer;" @click="transactionRetrunClick"
                                          src="../../assets/images/options_retrun.png" alt="">
                                        <div class="flex buy_box_info_top">
                                          <div class=" buy_box_info_top_box" v-if="BettingformStatus == 1">
                                            <img style="width: 20px ; height: 20px;"
                                              src="../../assets/images/arrow_up.png" alt="">
                                            <div class="buy_box_info_top_title">上升</div>
                                          </div>
                                          <div class="buy_box_info_down_box" v-if="BettingformStatus == 2">
                                            <img style="width: 20px ; height: 20px;"
                                              src="../../assets/images/arrow_down.png" alt="">
                                            <div class="buy_box_info_top_title"> 下降</div>
                                          </div>
                                        </div>

                                      </div>

                                      <div v-if="startingOption" class="Betting_form">
                                        <!-- <div class="deposit_flex"
                                          v-if="startingOption.myBetUp != 0 || startingOption.myBetdown != 0">
                                          <div class="deposit_flex_title">已投入 : &nbsp;</div>
                                          <div class="flex deposit_flex_up" v-if="startingOption.myBetUp !== 0">
                                            <div>上升：</div>
                                            <div class="">{{
                                              startingOption.myBetUp }}</div>
                                          </div>
                                          <div class="flex deposit_flex_d" v-if="startingOption.myBetdown !== 0">
                                            <div>下降：</div>
                                            <div class="">{{
                                              startingOption.myBetdown }}</div>
                                          </div>
                                        </div> -->
                                        <div class="buy_box_info">
                                          <el-input style="margin-top: 10px;" v-model="buyNumber"
                                            @focus="isFocused = true" @input="handleInput" placeholder="请输入"
                                            class="buy_box_input">
                                          </el-input>

                                          <div class="balance">
                                            余额:{{ assetUsdt }}USDT
                                          </div>
                                          <div class="block">
                                            <el-slider class="slider" @input="styleAdd" :marks="marks"
                                              @change="updatePercentage(value1)" v-model="value1"
                                              :show-tooltip="false"></el-slider>
                                            <div class="t_left demonstration_color">{{ value1 }}%</div>
                                          </div>
                                          <div class="flex margin">
                                            <button class="Btn_n" @click="setValue(10)">10%</button>
                                            <button class="Btn_n" @click="setValue(25)">25%</button>
                                            <button class="Btn_n" @click="setValue(50)">50%</button>
                                            <button class="Btn_n" @click="setValue(75)">75%</button>
                                            <button class="Btn_n" @click="setValue(100)">最大</button>
                                          </div>
                                        </div>
                                        <div>
                                          <div style="text-align: start; color: #666;">快捷下单</div>
                                          <div class="quick-order-btns">
                                            <button v-for="amount in quickNumData" :key="amount" class="quick-btn"
                                              @click="handleQuickOrder(amount)">
                                              {{ amount }}{{ quickOrderCounts[amount] > 0 ? 'X' +
                                                quickOrderCounts[amount] : '' }}
                                            </button>
                                          </div>
                                        </div>
                                        <div class="price-row" style="margin-top: 20px;">
                                          <div class="label">周期：</div>
                                          <div class="value">
                                            {{ formatDate(startingOption.startTime) }}--{{
                                              formatDate(startingOption.endTime) }}
                                          </div>
                                        </div>
                                        <div @click="BettingClick" class="Betting_btn">
                                          <div v-if="BettingformStatus == 1"><button
                                              class="Betting_btn_up">预测上升</button>
                                          </div>
                                          <div v-if="BettingformStatus == 2"><button
                                              class="Betting_btn_down">预测下降</button>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </el-card>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div class="items-container-box">
                        <div class="items-container">
                          <div v-if="openingOption.number" class="Card_box">
                            <el-card class="box-Newcard">
                              <div slot="header" class="clearfix1">
                                <div>进行中</div>
                                <div>
                                  {{ countdownText }}
                                </div>
                                <div>
                                  <div>第{{ openingOption.number }}期</div>
                                </div>
                              </div>

                              <div class="content">
                                <el-progress style="margin-top: 5px;" :show-text="false" :color="progressColor"
                                  :stroke-width="8" :text-inside="true" :percentage="progressValue"></el-progress>
                                <div v-if="openingOption.myBetUp !== 0" class="deposit_flex_now">
                                  <div class="label_title_now">
                                    <div style="text-align: center;">已投入 </div>
                                    <div v-if="openingOption.myBetUp !== 0" class="label_title_value">{{
                                      openingOption.myBetUp }}</div>
                                  </div>
                                </div>
                                <div class="indicator" style="margin-top: 16px;">
                                  <div class="indicator_info">
                                    <svg height="65px" width="260px" viewBox="0 0 240 65" color="text"
                                      xmlns="http://www.w3.org/2000/svg" class="sc-df97f1b-0 ejMcUv">
                                      <g filter="url(#filter0_i)">
                                        <path
                                          d="M10.0001 49.2757L10.0003 64H234L234 49.2753C234 42.5136 229.749 36.4819 223.381 34.2077L138.48 3.8859C127.823 0.0796983 116.177 0.0796931 105.519 3.8859L20.6188 34.2076C14.2508 36.4819 10.0001 42.5138 10.0001 49.2757Z"
                                          :fill="openingOption.startPrice < currentCoin.nowPrice ? '#d0f500' : '#EFF4F5'">
                                        </path>
                                      </g>
                                      <defs>
                                        <filter id="filter0_i" x="10.0001" y="1.03125" width="224" height="62.9688"
                                          filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
                                          <feFlood flood-opacity="0" result="BackgroundImageFix"></feFlood>
                                          <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix"
                                            result="shape">
                                          </feBlend>
                                          <feColorMatrix in="SourceAlpha" type="matrix"
                                            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha">
                                          </feColorMatrix>
                                          <feOffset></feOffset>
                                          <feGaussianBlur stdDeviation="1"></feGaussianBlur>
                                          <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1">
                                          </feComposite>
                                          <feColorMatrix type="matrix"
                                            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.15 0">
                                          </feColorMatrix>
                                          <feBlend mode="normal" in2="shape" result="effect1_innerShadow"></feBlend>
                                        </filter>
                                      </defs>
                                    </svg>
                                    <div class="upData">
                                      <div :class="openingOption.startPrice < currentCoin.nowPrice ? 'white' : 'black'"
                                        class="indicator_top">上升</div>
                                      <div :class="openingOption.startPrice < currentCoin.nowPrice ? 'white' : 'black'"
                                        class="rate">{{ openingOption.upRate }}x 比率</div>
                                    </div>
                                  </div>
                                </div>
                                <div class="price-info"
                                  :style="openingOption.startPrice < currentCoin.nowPrice ? 'border: 2px solid #d0f500;' : 'border: 2px solid #DF484C'">
                                  <div class="price">
                                    <div class="label_ovo">当前价格</div>
                                    <div class="flex color_box">
                                      <div
                                        :class="openingOption.startPrice < currentCoin.nowPrice ? 'green' : 'purple'">
                                        ${{ currentCoin.nowPrice }} </div>
                                      <div
                                        :class="openingOption.startPrice < currentCoin.nowPrice ? 'greenBg' : 'down'">
                                        <img style="width: 10px; height: 10px;" :src="openingOption.startPrice < currentCoin.nowPrice ?
                                          require('@/assets/images/up.png') :
                                          require('@/assets/images/down.png')" alt="">
                                        {{ (currentCoin.nowPrice - openingOption.startPrice).toFixed(2) }}
                                      </div>
                                    </div>
                                  </div>
                                  <div class="price-row">

                                    <div class="label">上期结束价格</div>
                                    <div class="value"> ${{ openingOption.startPrice }}</div>
                                  </div>
                                  <div class="price-row">
                                    <div class="label">周期：</div>
                                    <div class="value">
                                      {{ formatDate(openingOption.startTime) }}--{{ formatDate(openingOption.endTime) }}
                                    </div>
                                  </div>
                                </div>

                                <div class="indicator">
                                  <svg height="65px" width="240px" viewBox="0 0 240 65" color="text"
                                    xmlns="http://www.w3.org/2000/svg" class="sc-df97f1b-0 ejMcUv">
                                    <g filter="url(#filter0_i)">
                                      <path
                                        d="M10.0001 15.7243L10.0003 1H234L234 15.7247C234 22.4864 229.749 28.5181 223.381 30.7923L138.48 61.1141C127.823 64.9203 116.177 64.9203 105.519 61.1141L20.6188 30.7924C14.2508 28.5181 10.0001 22.4862 10.0001 15.7243Z"
                                        :fill="openingOption.startPrice < currentCoin.nowPrice ? '#F0F4F5' : '#DF484C'">
                                      </path>
                                    </g>
                                    <defs>
                                      <filter id="filter0_i" x="10.0001" y="1" width="224" height="62.9688"
                                        filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
                                        <feFlood flood-opacity="0" result="BackgroundImageFix"></feFlood>
                                        <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix"
                                          result="shape">
                                        </feBlend>
                                        <feColorMatrix in="SourceAlpha" type="matrix"
                                          values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha">
                                        </feColorMatrix>
                                        <feOffset></feOffset>
                                        <feGaussianBlur stdDeviation="1"></feGaussianBlur>
                                        <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1"></feComposite>
                                        <feColorMatrix type="matrix"
                                          values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.15 0">
                                        </feColorMatrix>
                                        <feBlend mode="normal" in2="shape" result="effect1_innerShadow"></feBlend>
                                      </filter>
                                    </defs>
                                  </svg>
                                  <div class="decline_Data_now">
                                    <div :class="openingOption.startPrice > currentCoin.nowPrice ? 'white' : 'black'"
                                      class="rate">{{ openingOption.downRate }}x 比率</div>
                                    <div :class="openingOption.startPrice > currentCoin.nowPrice ? 'white' : 'black'"
                                      class="indicator_down">下降</div>
                                  </div>
                                  <div class="deposit_flex_down">
                                    <div v-if="openingOption.myBetdown !== 0" class="label_title">
                                      <div style="text-align: center;">已投入 </div>
                                      <div class="label_title_value">{{ openingOption.myBetdown }}</div>
                                    </div>
                                  </div>
                                  <!-- <div style="height: 25px">
                                    <div v-if="openingOption.myBetdown !== 0" class="deposit_flex_down">下降 : &nbsp;{{
                                      openingOption.myBetdown }}</div>
                                  </div> -->
                                </div>
                              </div>
                            </el-card>
                          </div>
                          <div v-for="(item, i) in priceData" :key="i" class="item">
                            <div slot="header" style="background-color:#f5f5f5 ; padding: 7px;" class="clearfix flex">
                              <div>已结束</div>
                              <div>第{{ item.number }}期</div>
                            </div>
                            <div class="content">
                              <div class="deposit_flex">
                                <div v-if="item.myBetUp !== 0" class="label_title">
                                  <div style="text-align: center;">已投入 </div>
                                  <div class="label_title_value">{{ item.myBetUp }}</div>
                                </div>
                              </div>
                              <div class="indicator_b ">
                                <div class="indicator_info">
                                  <svg height="65px" width="260px" viewBox="0 0 240 65" color="text"
                                    xmlns="http://www.w3.org/2000/svg" class="sc-df97f1b-0 ejMcUv">
                                    <g filter="url(#filter0_i)">
                                      <path
                                        d="M10.0001 49.2757L10.0003 64H234L234 49.2753C234 42.5136 229.749 36.4819 223.381 34.2077L138.48 3.8859C127.823 0.0796983 116.177 0.0796931 105.519 3.8859L20.6188 34.2076C14.2508 36.4819 10.0001 42.5138 10.0001 49.2757Z"
                                        :fill="+item.endPrice > +item.startPrice ? '#D0F500' : '#F0F4F5'"></path>
                                    </g>
                                    <defs>
                                      <filter id="filter0_i" x="10.0001" y="1.03125" width="224" height="62.9688"
                                        filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
                                        <feFlood flood-opacity="0" result="BackgroundImageFix"></feFlood>
                                        <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix"
                                          result="shape">
                                        </feBlend>
                                        <feColorMatrix in="SourceAlpha" type="matrix"
                                          values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha">
                                        </feColorMatrix>
                                        <feOffset></feOffset>
                                        <feGaussianBlur stdDeviation="1"></feGaussianBlur>
                                        <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1"></feComposite>
                                        <feColorMatrix type="matrix"
                                          values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.15 0">
                                        </feColorMatrix>
                                        <feBlend mode="normal" in2="shape" result="effect1_innerShadow"></feBlend>
                                      </filter>
                                    </defs>
                                  </svg>
                                  <div class="upData">
                                    <div :class="+item.endPrice > +item.startPrice ? 'white' : 'black'"
                                      class="indicator_top">
                                      上升</div>
                                    <div :class="+item.endPrice > +item.startPrice ? 'white' : 'black'" class="rate">{{
                                      item.upRate }}x 比率</div>
                                  </div>
                                </div>
                              </div>
                              <div class="price-info_b"
                                :style="+item.endPrice > +item.startPrice ? 'border: 2px solid #d0f500;' : +item.endPrice < +item.startPrice ? 'border: 2px solid #ed4014;' : 'border: 2px solid #888888;'">
                                <div class="price">
                                  <div class="label">结束价格 ：</div>
                                  <div class="flex">
                                    <div
                                      :style="{ 'color': +item.endPrice > +item.startPrice ? '#d0f500' : +item.endPrice < +item.startPrice ? '#ed4014' : '#888888' }">
                                      ${{
                                        item.endPrice }}</div>

                                    <div :class="+item.endPrice < +item.startPrice ? 'purpleBg' : +item.endPrice >
                                      +item.startPrice ? 'greenBg' : 'price-flat'" style=" font-size: 12px;">
                                      <img style="width: 10px; height: 10px;"
                                        :src="item.startPrice < item.endPrice ? require('@/assets/images/up.png') : (item.startPrice > item.endPrice ? require('@/assets/images/down.png') : '')"
                                        alt="">
                                      <span v-if="item.startPrice == item.endPrice">--</span><span> {{ (item.endPrice -
                                        item.startPrice).toFixed(2) }}</span>
                                    </div>
                                  </div>
                                </div>
                                <div style="margin-top: 20px;" class="price-row">
                                  <div class="label">上期结束价格</div>
                                  <div class="value">${{ item.startPrice }}</div>
                                </div>

                                <div class="price-row">
                                  <div class="label">周期：</div>
                                  <div class="value">{{ formatDate(item.startTime) }}--{{ formatDate(item.endTime) }}
                                  </div>
                                </div>
                              </div>
                              <div class="indicator_bottom ">
                                <svg height="65px" width="240px" viewBox="0 0 240 65" color="text"
                                  xmlns="http://www.w3.org/2000/svg" class="sc-df97f1b-0 ejMcUv">
                                  <g filter="url(#filter0_i)">
                                    <path
                                      d="M10.0001 15.7243L10.0003 1H234L234 15.7247C234 22.4864 229.749 28.5181 223.381 30.7923L138.48 61.1141C127.823 64.9203 116.177 64.9203 105.519 61.1141L20.6188 30.7924C14.2508 28.5181 10.0001 22.4862 10.0001 15.7243Z"
                                      :fill="+item.endPrice < +item.startPrice ? '#DF484C' : '#F0F4F5'"></path>
                                  </g>
                                  <defs>
                                    <filter id="filter0_i" x="10.0001" y="1" width="224" height="62.9688"
                                      filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
                                      <feFlood flood-opacity="0" result="BackgroundImageFix"></feFlood>
                                      <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape">
                                      </feBlend>
                                      <feColorMatrix in="SourceAlpha" type="matrix"
                                        values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha">
                                      </feColorMatrix>
                                      <feOffset></feOffset>
                                      <feGaussianBlur stdDeviation="1"></feGaussianBlur>
                                      <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1"></feComposite>
                                      <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.15 0">
                                      </feColorMatrix>
                                      <feBlend mode="normal" in2="shape" result="effect1_innerShadow"></feBlend>
                                    </filter>
                                  </defs>
                                </svg>
                                <div class="decline_Data">
                                  <div :class="+item.endPrice < +item.startPrice ? 'white' : 'black'" class="rate">{{
                                    item.downRate }}x 比率</div>
                                  <div :class="+item.endPrice < +item.startPrice ? 'white' : 'black'"
                                    class="indicator_down">
                                    下降</div>
                                </div>

                                <div class="deposit_flex_down">
                                  <div v-if="item.myBetdown !== 0" class="label_title">
                                    <div style="text-align: center;">已投入 </div>
                                    <div class="label_title_value">{{ item.myBetdown }}</div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>


                    <div class="table_box" style="margin-top: 10px;">
                      <h3 class="table_title">
                        我的订单
                      </h3>
                      <div style="text-align: center;padding: 30px 0 60px 0;" v-if="!isLogin">

                        <router-link to="/login" id="login">{{ $t("common.login") }}</router-link>/<router-link
                          to="/register" id="register">{{ $t("common.register") }}</router-link>
                      </div>
                      <div v-else class="table">
                        <Table :no-data-text="$t('common.nodata')" :columns="columns" :data="historyList"
                          :loading="loading"></Table>
                        <div class="page">
                          <Page :total="total" :pageSize="pageSize" :current="pageNo" @on-change="getHistoryList">
                          </Page>
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
    </div>
  </div>
</template>

<script>
var moment = require("moment");
var Stomp = require("stompjs");
var SockJS = require("sockjs-client");
// import SwiperItem from "@/components/uc/Swiper.vue";
// import $ from "@js/jquery.min.js";
import KlineCharts from "./Klinechart.vue";



export default {
  components: { KlineCharts, },
  data() {
    const self = this;
    return {
      marks: {
        0: '',
        25: '',
        50: '',
        75: '',
        100: '',
      },
      balance: '0',
      isFlipped: false,
      orderLineIds: [],
      isSubmitting: false,
      addedOrderMarkers: [],
      countdown: 0,
      orderLineId: null, // 记录当前横线的ID
      orderLineDirection: null,
      datafeed: null,
      moreOptions: ['1d', '1w', '1M'],
      showMoreOptions: false,
      datafeedK: null,
      stompClient: null,
      show: false,
      progressColor: '#1EC6B6',
      imageStyle: {
        position: 'absolute',
        left: '50%',
        top: '50%',
        transform: 'translate(-50%, -50%) scale(0)',
        transition: 'transform 2s ease, left 2s ease, top 2s ease',
      },
      BettingformStatus: null,
      stompClientK: null,
      skin: "night", //皮肤样式day&night
      coinList: [],
      streamList: [],
      currentCoinSymbol: "BTC/USDT",
      isCollecting: false,
      rewardAmount: 0, // 示例奖励金额
      currentBalance: 0,
      targetBalance: 0,
      isLoading: true,

      quickOrderCounts: {
        10: 0,
        100: 0,
        500: 0,
        1000: 0
      },
      formattedBalance: '0',
      currentCoin: {},
      currentCoinAmountList: [],
      currentPrice: 10000.00,
      openPrice: 12456.8,
      progressValue: 0,
      currentSelectCount: 0,
      baseCoinUnit: "USDT",
      timeSharing: false,
      isFocused: false,
      tableMoney: [],
      assetUsdt: 0,
      renderOrderMarkersTimer: null,
      chartResizeObserver: null,
      currentTotalBuy: 0,
      currentTotalSell: 0,
      historyList: [],
      progressWidth: '0%',
      progressText: '0%',
      countdownText: '00:00:00',
      timer: null,
      AllData: [],
      openingOption: {
        id: 0,
        optionNo: "-",
        totalBuy: 0,
        totalSell: 0
      },
      startingOption: {
        optionNo: "-",
        totalBuy: 0,
        myBetUp: 0,
        myBetdown: 0,
        totalSell: 0,
        number: 0,
      },
      currentCoinList: {
        symbol: 'BTC/USDT'
      },
      myOpeningOption: {
        betAmount: 0
      },
      myStartingOption: {
        betAmount: 0
      },
      currentPercent: 0,
      orders: [],
      loading: false,
      buyNumber: '',
      total: 0,
      pageSize: 10,
      pageNo: 1,
      quickNumData: [10, 100, 500, 1000],
      columns: [
        {
          title: "期数",
          key: "optionNo",
          minWidth: 120,
          render: (h, params) => {
            return h("span", {}, params.row.symbol + "[" + params.row.guessCycle + "分钟] - " + self.$t('option.seriers') + params.row.number + "期");
          }
        },
        {
          title: '时间',
          key: "Time",
          minWidth: 65,
          render: (h, params) => {
            let txt = '1分钟'
            if (params.row.guessCoinId == 1) {
              txt = '5分钟'
            } else if (params.row.guessCoinId == 2) {
              txt = '3分钟'
            } else if (params.row.guessCoinId == 3) {
              txt = '1分钟'
            }
            return h("div", {
              style: {

              }
            }, [
              h("span", {}, txt)
            ]);
          }
        },
        {
          title: "下单金额",
          key: "amount",
          minWidth: 65,
          render: (h, params) => {
            return h("span", {}, params.row.amount);
          }
        },
        {
          title: self.$t("option.col_direction"),
          key: "direction",
          minWidth: 65,
          render: (h, params) => {
            let txt = params.row.direction == 1 ? self.$t("option.buyup") : self.$t("option.buydown");
            const txtColor = params.row.direction == 1 ? "#84cc16" : "#FF0000";
            return h("div", {
              style: {
                color: txtColor
              }
            }, [
              h("span", {}, txt)
            ]);
          }
        },
        {
          title: self.$t("option.col_result"),
          key: "result",
          minWidth: 65,
          render: (h, params) => {

            let txt = self.$t("option.wait");
            let txtColor = "#FFF";
            if (params.row.result == 0) {
              txt = "未开始"
            } else if (params.row.result == 1) {
              txt = self.$t("option.win")
              txtColor = "#84cc16"
            } else if (params.row.result == 2) {
              txt = self.$t("option.lose")
              txtColor = "#FF0000"
            } else if (params.row.result == 3) {
              txt = self.$t("option.prediction")
              txtColor = "#f0a70a"
            } else if (params.row.result == 4) {
              txt = "平盘"
              txtColor = "#f0a70a"
            }
            return h("div", {
              style: {
                color: txtColor
              }
            }, [
              h("span", {}, txt)
            ]);
          }
        },
        {
          title: self.$t("option.col_rewardAmount"),
          key: "rewardAmount",
          minWidth: 65,
          render: (h, params) => {
            let txt = params.row.profit;
            if (params.row.result == 0) {
              txt = "-";
            } else {
              txt = params.row.profit
            }
            return h("span", {}, txt);
          }
        },
        {
          title: "结算状态",
          key: "status",
          minWidth: 65,
          render: (h, params) => {
            let status = params.row.status;
            let txt = ""
            if ((status == 1 && params.row.profit > 0) || params.row.result == 3 || params.row.result == 0) {
              txt = "等待结算";
            } else {
              txt = "已结算"
            }
            return h("span", {}, txt);
          }
        },
        {
          title: "开始价格",
          key: "start",
          minWidth: 65,
          render: (h, params) => {
            return h("span", {}, params.row.start ? params.row.start : '--');
          }
        },
        {
          title: "结束价格",
          key: "end",
          minWidth: 65,
          render: (h, params) => {
            return h("span", {}, params.row.end ? params.row.end : '--');
          }
        },
        {
          title: self.$t("option.col_createTime"),
          key: "createTime",
          minWidth: 65,
          render: (h, params) => {
            return h("span", {}, self.dateFormat(params.row.createTime));
          }
        }
      ],
      showDropdown: false,
      currency: '', // 货币名称
      value1: 0,
      price: 0,    // 初始价格
      value: "",
      //模拟数据选择当前币种
      cities: [{
        id: 1,
        label: 'BTCUSDT',
        value: '80000'
      }],
      //已过期奖池假数据
      priceData: [

      ],
      newPriceData:
      {
        number: '360461',
        rate: '2.31',
        downRate: '1.77',
        endPrice: '573.6699',
        lockPrice: '572.5739',
        pool: '2.4994',
        changeAmount: '1.0960'

      },
      resolutions: [
        { time: 'Time', size: 97 },//分时
        { time: '1', size: 97 },
        { time: '5', size: 95 },
        { time: '15', size: 93 },
        { time: '30', size: 91 },
        { time: '1h', size: 89 },
        { time: '4h', size: 87 }
      ],
      moreOptions: ['1d', '1w', '1M'],
      localResolution: '5',
      showMoreOptions: false,
      klineData: [],
      chart: null,
      inputMode: 1,//记录输入框和步进条的修改模式
    };
  },
  watch: {


  },
  created: function () {
    this.init();
  },
  filters: {
    dateFormat: function (tick) {
      return moment(tick).format("YYYY-MM-DD HH:mm");
    },

    fixedScale: function (value, scale) {
      return value.toFixed(scale);
    },
    fixed2: function (value) {
      return value.toFixed(2);
    }
  },
  mounted() {
    window.addEventListener('focus', this.onWindowFocus);
    window.addEventListener('blur', this.onWindowBlur);
    this.initSliderStyle()
    this.initChartResizeObserver()

  },
  beforeDestroy() {
    this.stopWebsock();
    this.destroyChartResizeObserver();
    window.removeEventListener('focus', this.onWindowFocus);
    window.removeEventListener('blur', this.onWindowBlur);
  },
  computed: {
    lang() {
      return this.$store.state.lang;
    },
    langPram() {
      if (this.$store.state.lang == "简体中文") {
        return "CN";
      }
      if (this.$store.state.lang == "English") {
        return "EN";
      }
      return "CN";
    },
    isLogin: function () {
      return this.$store.getters.isLogin;
    },
    priceChange: function () {
      var chg = this.currentPrice - this.openPrice;
      var percent = chg / this.openPrice * 100;
      if (chg > 0) {
        return "+" + percent.toFixed(3) + "%";
      }
      if (chg < 0) {
        return percent.toFixed(3) + "%";
      }
      return "0.00%";
    },

  },
  methods: {
    onWindowFocus() {
      this.startWebsock();
    },

    onWindowBlur() {
      this.stopWebsock();

    },
    init() {
      this.$store.commit("navigate", "nav-option");
      if (this.isLogin) {
        this.getAssets();
      }
      this.getCoinList();
      this.initPageData();
    },

    initPageData() {
      if (this.isLogin) {
        this.getAssets();
      }
      this.getHistory();
    },
    dateFormat: function (tick) {
      return moment(tick).format("YYYY-MM-DD HH:mm:ss");
    },
    updatePrice(item) {
      this.currency = item.name
      this.currentCoin = item
      this.price = item.nowPrice; // 更新价格
      this.showDropdown = false
      this.startWebsock();
    },
    getCoinList() {
      var that = this;
      this.$http.post(this.swapHost + "/guess/symbol").then(response => {
        var resp = response.body;
        that.coinList = resp;
        that.getCurrentStream()
        that.currentCoin = this.coinList[0]
        that.updatePrice(that.currentCoin)
      });
    },

    //快捷下单
    handleQuickOrder(amount) {
      this.isFocused = false
      // 更新点击次数
      this.quickOrderCounts[amount]++;

      // 计算新的金额
      const currentValue = this.buyNumber ? parseFloat(this.buyNumber) : 0;
      const newValue = currentValue + amount;

      // 检查是否超过可用余额
      if (newValue > this.assetUsdt) {
        this.$Notice.error({
          title: "提示",
          desc: "超过可用余额"
        });
        this.quickOrderCounts[amount]--;
        return;
      }

      // 更新输入框的值
      this.buyNumber = newValue.toString();

      this.handleInput(this.buyNumber);
    },

    //清空快捷下单数量
    clearInput() {
      Object.keys(this.quickOrderCounts).forEach(key => {
        this.quickOrderCounts[key] = 0;
      });
    },
    getCurrentStream() {
      var that = this;
      var param = {
        guessCoinId: this.currentCoin.id
      }

      const promises = [];

      for (let i = 0; i < this.coinList.length; i++) {
        const param = {
          guessCoinId: this.coinList[i].id
        };

        const promise = this.$http.post(this.swapHost + "/guess/stream", param).then(response => {
          const resp = response.body;
          this.streamList[i] = resp;
          if (this.coinList[i].id === this.currentCoin.id) {
            this.renderStreamByCoinIndex();
            this.$nextTick(() => {
              this.Inprogressprice();
            });
          }
        }).catch(error => {
          console.error(`获取币种${this.coinList[i].id}的数据失败:`, error);
        });

        promises.push(promise);
      }
    },
    renderStreamByCoinIndex() {
      var index = this.coinList.findIndex(item => item.id === this.currentCoin.id);
      var resp = this.streamList[index]
      this.AllData = resp
      this.priceData = []
      var currentOption = resp.find(item => item.status === 2);
      if (currentOption) {
        this.openingOption = currentOption;
        if (currentOption.number) {
          this.openingOption.optionNo = currentOption.number

        }
        this.openingOption.totalBuy = currentOption.betsUpCount
        this.openingOption.totalSell = currentOption.betsDownCount
      } else {
        this.openingOption = {}
        console.log(this.openingOption)
      }
      this.startingOption = resp.find(item => item.status === 1);
      this.priceData = resp.filter(item => item.status === 3)
      this.isLoading = false;
      if (this.openingOption) {
        this.startCountdown(this.openingOption);
      }
    },

    selectCount(count) {
      this.currentSelectCount = count;
    },

    changeCoin(symbol) {
      this.currentCoinSymbol = symbol;
      this.pageNo = 1;
      this.currentPrice = this.openPrice;
      this.initPageData();
    },


    countDown(remainTime) {
      let endTimestamp = new Date(this.openingOption.endTime).getTime();
      let startTimestamp = new Date(this.openingOption.startTime).getTime();
      let totalCycle = endTimestamp - startTimestamp//时间段
      if (this.timer) {
        clearInterval(this.timer);
      }
      this.timer = setInterval(() => {
        const remain_time = remainTime * 1000; //剩余毫秒数
        const minutes = parseInt(remain_time / 1000 / 60 % 60, 10); //计算剩余的分钟
        const seconds = parseInt(remain_time / 1000 % 60, 10); //计算剩余的秒数
        if (remainTime >= 0) {
          this.countdownText = `${this.checkTime(minutes)}:${this.checkTime(seconds)}`;
          this.progressValue = Number(((totalCycle - remain_time) / totalCycle * 100))
          remainTime--;
        } else {
          this.countdownText = '结算中';
          clearInterval(this.timer);
        }
      }, 1000);
    },
    startCountdown(item) {
      if (item) {
        const endDate = new Date(item.endTime)
        const endDateTime = Math.floor(endDate)
        const newDates = new Date(item.serviceTime)
        const newDatesTime = Math.floor(newDates)
        const Time = Math.floor((endDateTime - newDatesTime) / 1000)
        if (this.openingOption) {
          this.countDown(Time)
        }
      }
    },
    checkTime(i) {
      if (i < 10) {
        i = "0" + i;
      }
      return i;
    },

    getAssets() {
      var that = this;
      if (this.isLogin) {
        this.$http.post(this.swapHost + "/guess/wallet").then(response => {
          var resp = response.body.data;
          var asset = resp.memberWallet;
          this.assetUsdt = asset.balance.toFixed(4);
          this.myOpeningOption = resp
        });
        //查询未领取的奖励
        this.$http.get(this.swapHost + "/guess/unsettled").then(response => {
          var resp = response.body.data;
          this.rewardAmount = resp;
          if (this.rewardAmount > 0) {
            this.isCollecting = false
          } else {
            this.isCollecting = true
          }
        });
      }
    },

    getHistoryList(data) {
      this.pageNo = data
      this.getHistory()
    },

    //获取历史数据
    getHistory() {
      var that = this;
      let params = {};
      if (!this.isLogin) {
        return
      }
      params.symbol = this.currentCoinSymbol;
      params.pageNo = that.pageNo;
      params.pageSize = 10;
      this.$http.post(this.swapHost + "/guess/record", params).then(response => {
        var resp = response.body;
        this.historyList = resp.records;
        this.total = resp.total
        setTimeout(() => {
          this.$nextTick(() => {
            this.Inprogressprice();
          });
          this.updateAllMarkers();
        }, 1000);

      });
    },
    //进度条样式更新
    styleAdd() {
      const sliderStops = document.querySelectorAll('.el-slider__stop');

      sliderStops.forEach(stop => {
        stop.classList.remove('color-red');
      });
      if (this.isFocused) {
        this.clearInput()
      }
      if (this.value1 === 0) return;
      const marks = Object.keys(this.marks).map(Number).sort((a, b) => a - b);

      sliderStops.forEach((stop, index) => {
        if (index < marks.length && marks[index] <= this.value1) {
          stop.classList.add('color-red');
        }
      });
    },
    //滑块下注额度选中样式初始化
    initSliderStyle() {
      const sliderStops = document.querySelectorAll('.el-slider__stop');
      sliderStops.forEach(stop => {
        stop.classList.remove('color-red');
      });

      if (this.value1 > 0) {
        this.styleAdd();
      }
    },


    updatePercentage(value1) {
      this.buyNumber = Math.floor(this.assetUsdt * (value1 / 100)).toString();
      this.clearInput()
      this.styleAdd()
    },
    //输入下注额度
    handleInput(value) {
      // 只保留数字，移除其他字符
      let newValue = value.replace(/[^\d]/g, '');


      // 如果输入值大于可用余额，则使用最大可用余额
      if (newValue !== '' && parseFloat(newValue) > this.assetUsdt) {
        newValue = Math.floor(this.assetUsdt).toString();
      }
      if (this.isFocused) {
        this.clearInput()
      }


      this.buyNumber = newValue;

      if (!this.buyNumber || this.buyNumber === '') {
        this.value1 = 0;
        const sliderStops = document.querySelectorAll('.el-slider__stop');
        sliderStops.forEach(stop => {
          stop.classList.remove('color-red');
        });
        return;
      }

      if (this.assetUsdt > 0) {
        this.value1 = +(this.buyNumber / this.assetUsdt * 100).toFixed(2);
        if (this.value1 > 100) {
          this.value1 = 100;
          this.buyNumber = Math.floor(this.assetUsdt).toString();
        }

        this.$nextTick(() => {
          this.styleAdd();
        });
      } else {
        this.value1 = 0;
        const sliderStops = document.querySelectorAll('.el-slider__stop');
        sliderStops.forEach(stop => {
          stop.classList.remove('color-red');
        });
      }

    },

    //检查全部数据进行中的
    getStreamByCoinIdWithCurrent() {
      const DataList = [];
      for (let i = 0; i < this.streamList.length; i++) {
        if (this.streamList[i]) {
          const filteredItems = this.streamList[i].filter(item => item.status == 2 && (item.myBetUp !== 0 || item.myBetdown !== 0));
          if (filteredItems.length !== 0) {
            DataList.push(filteredItems);
          }
        }
      }
      return DataList;
    },

    //进行中订单
    Inprogressprice() {
      if (!this.isLogin) {
        return
      }
      const data = this.getStreamByCoinIdWithCurrent();
      if (this.orderLineIds && this.orderLineIds.length > 0) {
        this.orderLineIds.forEach(ids => {
          if (this.$refs.kline.chart) {
            this.$refs.kline.chart.removeOverlay({
              name: 'customPriceLine',
              ids
            })
          }
        });
        this.orderLineIds = [];
      }
      if (!data || !data.length) {
        return;
      }
      const drawnPrices = new Set();

      data.forEach((subArray, arrayIndex) => {
        subArray.forEach((item) => {
          const orderLineId = 'order_price_line_' + item.id;
          const lastEndPrice = item.startPrice;
          const myBetUp = item.myBetUp;
          const myBetDown = item.myBetdown;
          const priceKey = `${lastEndPrice}_${myBetUp}_${myBetDown}+${item.id}`;
          if (!drawnPrices.has(priceKey)) {
            this.$refs.kline.addOrderPriceLine(lastEndPrice, myBetUp, myBetDown);
            this.orderLineIds.push(orderLineId);
            drawnPrices.add(priceKey);
          } else {
          }
        });
      });
    },
    getStreamAll(num) {
      for (let i = 0; i < this.streamList.length; i++) {
        if (this.streamList[i]) {
          const filteredItems = this.streamList[i].filter(item => item.number == num);
          if (filteredItems.length !== 0) {
            return filteredItems
          }
        }
      }
    },



    //创建标识
    updateAllMarkers() {
      if (!this.isLogin) {
        return
      }
      if (!this.$refs.kline || !this.$refs.kline.chart) {
        return;
      }

      // 清除所有现有标记
      this.$refs.kline.clearAllMarkers();

      // 重新添加所有标记
      this.historyList.forEach(item => {
        let startTime = item.createTime;
        if (item.result == 3) {
          startTime = item.createTime;
        } else if (item.result == 1 || item.result == 2) {
          const data = this.getStreamAll(item.number);
          if (data !== undefined && data.length > 0) {
            startTime = data[0].startTime;
          }
        }
        this.$refs.kline.addOrderMarkerAtStartTime(item, startTime);
      });
    },

    //切换时间方法
    setValue(num) {
      const sliderStops = document.querySelectorAll('.el-slider__stop');
      sliderStops.forEach(stop => {
        stop.classList.remove('color-red');
      });
      this.clearInput()

      // 设置新值
      this.value1 = num;
      this.$nextTick(() => {
        this.styleAdd()
        this.updatePercentage(num);
      });
    },
    //启动websoket
    startWebsock() {
      if (this.stompClient) {
        this.stompClient.ws.close();
      }
      var stompClient = null;
      var that = this;
      var socket = new SockJS(that.swapHost + that.api.swap.ws);
      stompClient = Stomp.over(socket);
      this.stompClient = stompClient;
      stompClient.debug = false;
      stompClient.connect({}, function (frame) {
        stompClient.subscribe("/topic/swap/kline/" + that.currentCoinList.symbol, function (msg) {
          var resp = JSON.parse(msg.body);
          if (resp["1m"]) {
            that.coinList.filter(item => item.name == that.currentCoinList.symbol).forEach(item => {
              item.nowPrice = resp["1m"].closePrice
            })
          }
          if (that.$refs.kline) {
            that.$refs.kline.refreshKline(resp);
            that.$refs.kline.reloadMarkers()

          }
        });
        stompClient.subscribe("/topic/guess/change/" + that.currentCoin.id, function (msg) {
          that.getCurrentStream()
          that.getHistory()
          that.getAssets()
        });
      });
    },

    stopWebsock() {
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
        } finally {
          this.stompClient = null;
        }
      }
    },
    noticeCLick() {
      this.$router.push(`/announcementItem/51`);

    },
    getCoin(symbol) {
      return this.coinList.find(item => item.name == symbol);
    },
    getCoinById(id) {
      return this.coinList.find(item => item.id == id);
    },
    handlerBets(direction) {//下注
      this.BettingformStatus = direction
      this.isFlipped = !this.isFlipped;
    },
    getsetting() {
      //获取个人安全信息
      let self = this;
      this.$http.post(this.host + "/approve/security/setting").then(response => {
        var resp = response.body;
        if (resp.code == 0) {
          this.user = resp.data;
          // if (resp.data.realName == null || resp.data.realName == "") {
          //   this.$Notice.error({
          //     title: this.$t("common.tip"),
          //     desc: this.$t("otc.publishad.submittip1")
          //   });
          //   // 判断是否实名认证，未认证跳转到实名认证页面；
          //   //this.$Message.success(this.$t("otc.publishad.submittip1"));
          //   self.$router.push("/uc/safe");
          // } else 
          if (resp.data.phoneVerified == 0) {
            this.$Notice.error({
              title: this.$t("common.tip"),
              desc: this.$t("otc.publishad.submittip2")
            });
            // 判断是否是手机号0，1，未认证跳转到实名认证页面；
            //this.$Message.success(this.$t("otc.publishad.submittip2"));
            self.$router.push("/uc/safe");
          } else if (resp.data.fundsVerified == 0) {
            this.$Notice.error({
              title: this.$t("common.tip"),
              desc: this.$t("otc.publishad.submittip3")
            });
            // 判断是否设置交易密码，未认证跳转到实名认证页面；
            //this.$Message.success(this.$t("otc.publishad.submittip3"));
            self.$router.push("/uc/safe");
          } else if (resp.data.emailVerified == 0) {
            this.$Notice.error({
              title: this.$t("common.tip"),
              desc: this.$t("otc.publishad.submittip5")
            });
            // 判断是否绑定邮箱，未认证跳转到实名认证页面；
            //this.$Message.success(this.$t("otc.publishad.submittip3"));
            self.$router.push("/uc/safe");
          }
        } else {
          this.$Message.error(resp.message);
        }
      });
    },
    formatDate(dateStr) {
      const date = new Date(dateStr);
      return String(date.getHours()).padStart(2, "0") + ':' +
        String(date.getMinutes()).padStart(2, "0") + ':' +
        String(date.getSeconds()).padStart(2, "0");
    },
    transactionRetrunClick() {
      this.isFlipped = !this.isFlipped;
    },

    //确定交易
    BettingClick() {
      // 如果正在提交中，直接返回
      if (this.isSubmitting) {
        this.$Notice.warning({
          title: "提示",
          desc: "正在处理下单请求，请稍候..."
        });
        return;
      }

      if (this.buyNumber == 0) {
        this.$Notice.error({
          title: "提示",
          desc: "请输入数量"
        });
        return;
      }
      this.isSubmitting = true;
      let params = {
        guessCoinId: this.currentCoin.id,
        direction: this.BettingformStatus,
        volume: this.buyNumber
      };

      this.$http.post(this.swapHost + "/guess/bets", params).then(response => {
        var resp = response.body;
        if (resp.code == 0) {

          this.isFlipped = !this.isFlipped;
          this.buyNumber = '';
          this.value1 = 0;
          this.$Notice.success({
            title: "提示",
            desc: "预测下单成功"
          });
          this.getCurrentStream()
          this.initPageData();
          this.clearInput();
        } else {
          this.$Notice.error({
            title: this.$t("exchange.tip"),
            desc: resp.message
          });
        }
      }).catch(error => {
        console.error("下单失败:", error);
        this.$Notice.error({
          title: "提示",
          desc: "下单失败，请稍后再试"
        });
      }).finally(() => {
        this.isSubmitting = false;
      });
    },



    TimeClick(time) {
      this.countdownText = '00:00:00'
      this.progressValue = 0
      this.currentCoin = time
      console.log(time)
      this.renderStreamByCoinIndex()
    },
    handleVisibilityChange() {
      if (document.hidden) {
        this.stopWebsock();
      } else {
        this.getCoinList();
      }
    },

    showImage() {
      this.show = true;
      if (this.isCollecting) return;
      this.isCollecting = true;
      this.$http.post(this.swapHost + "/guess/clain", {}).then(response => {
        var resp = response.body;
        if (resp.code == 0) {
          this.$nextTick(() => {
            setTimeout(() => {
              this.moveImageToTarget();
            }, 1000);
          });
          this.getHistory();
          // this.getAssets()
        } else {
          this.$Notice.error({
            title: this.$t("exchange.tip"),
            desc: resp.message
          });
        }
      });
    },

    moveImageToTarget() {
      const targetBox = document.getElementById('balance');

      const targetRect = targetBox.getBoundingClientRect();

      this.animateNumber();
      this.rewardAmount = 0;
      this.imageStyle = {
        position: 'absolute',
        left: `${targetRect.left + window.scrollX + 10}px`,
        top: `${-targetRect.bottom + window.scrollY}px`,
        transform: 'scale(1);',
        transition: 'transform 2s ease, left 2s ease, top 2s ease',
      };
    },

    onAnimationEnd() {
      // 动画结束后隐藏图片
      this.show = false;
      this.imageStyle = {
        position: 'absolute',
        left: '50%',
        top: '50%',
        // transform: 'translate(-50%, -50%) scale(0)',
        transition: 'transform 2s ease, left 2s ease, top 2s ease'
      }
      if (this.rewardAmount > 0) {
        this.isCollecting = false;
      }
    },


    initChartResizeObserver() {
      const chartBox = document.getElementById('chart_box');
      if (!chartBox) {
        return;
      }
      this.chartResizeObserver = new ResizeObserver(entries => {
        for (let entry of entries) {
          if (this.$refs.kline.chart) {
            this.$refs.kline.ReSize();
          }
        }
      });
      this.chartResizeObserver.observe(chartBox);
    },

    destroyChartResizeObserver() {
      if (this.chartResizeObserver) {
        this.chartResizeObserver.disconnect();
        this.chartResizeObserver = null;
      }
    },

    animateNumber() {
      const startValue = parseFloat(this.assetUsdt);
      const rewardValue = parseFloat(this.rewardAmount);
      const endValue = startValue + rewardValue;

      const duration = 2000;
      const startTime = performance.now();
      let currentDisplayValue = startValue;

      const formatNumber = (num) => {
        return parseFloat(num).toFixed(4);
      };

      const updateNumber = (currentTime) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);

        const easeProgress = 1 - Math.pow(1 - progress, 3);
        currentDisplayValue = startValue + ((endValue - startValue) * easeProgress);

        this.assetUsdt = formatNumber(currentDisplayValue);

        if (progress < 1) {
          requestAnimationFrame(updateNumber);
        } else {
          this.assetUsdt = formatNumber(endValue);
          this.getAssets();
        }
      };

      requestAnimationFrame(updateNumber);
    }
  }

};
</script>

<style scoped>
.ctc .item-title {
  font-size: 20px;
  text-align: center;
  font-weight: bold;
  color: rgb(188, 188, 188);
}

.ctc .red {
  color: #f2334f;
}

.ctc .green {
  color: #d0f500;
}

.ctc .item-title .unit {
  font-size: 14px;
}

.option {
  position: relative;
}

.option .item-desc {
  font-size: 12px;
  text-align: center;
  color: #7c7f82;
}

.option .notice-bottom {
  margin-top: 5px;
  height: 55px;
  background-color: #192330;
  padding-top: 12px;
  color: rgb(42, 147, 255);
}

.option .notice-btn-left {
  height: 30px;
  line-height: 30px;
  width: 42%;
  margin-left: 5%;
  float: left;
  border-radius: 3px;
  border: 1px solid rgb(0, 116, 235);
}

.option .notice-btn-left:hover {
  cursor: pointer;
}

.option #sendCode {
  position: absolute;
  border: none;
  background: none;
  top: 6px;
  outline: none;
  right: 0;
  width: 30%;
  color: #f0ac19;
  cursor: pointer;
  height: 20px;
  line-height: 20px;
  border-left: 1px solid #dddee1;
}

.option .notice-btn-right {
  height: 30px;
  line-height: 30px;
  width: 42%;
  margin-right: 5%;
  float: right;
  border-radius: 3px;
  border: 1px solid rgb(0, 116, 235);
}

.option .notice-btn-right:hover {
  cursor: pointer;
}

.option .ivu-tabs-bar {
  border-bottom: 1px solid #323c53;
  font-size: 18px;
}

.option .ivu-tabs-nav .ivu-tabs-tab:hover {
  color: #f0a70a;
}

.option .ivu-tabs-nav .ivu-tabs-tab:hover,
.option .ivu-tabs-nav .ivu-tabs-tab-active {
  color: #f0a70a;
  font-size: 18px;
}

.option .ivu-tabs-ink-bar {
  background-color: #f0a70a;
}

.option .buy_total {
  border-top: 1px solid #323c53;
  padding-top: 30px;
  margin-bottom: 30px;
}

.option .trade_bd_ctc {
  width: 100%;
  min-width: 1160px;

}

.option .trade_bd_ctc .panel {
  position: relative;
  z-index: 2;
  float: left;
  width: 100%;

  margin-top: 0;
  margin-right: 0;
  border: 0 solid transparent;
  padding-top: 15px;
}

.option .trade_panel {
  background: transparent !important;
}

.option .trade_panel .panel .hd {
  line-height: 20px;
  height: 20px;
  border-bottom: 1px solid #1F2943;
  margin-bottom: 5px;
}

.option .trade_panel .panel .hd span {
  padding-left: 0;
  font-size: 12px;
  margin: 0 3px;
  float: right;
}

.ctc-order-status {
  text-align: center;
  margin-bottom: 15px;
  background: #f0a70a;
  padding: 5px 0px;
  border-radius: 2px;
  color: #000000;
}

.option .trade_panel .panel .hd b {
  padding-left: 0;
  font-size: 12px;
  color: #7A98F7;
  float: right;
}

.option .trade_panel .panel .hd.hd_login a {
  float: right;
  text-decoration: none;
  font-size: 12px;
  margin-right: 10px;
}

.option .trade_panel .panel.panel_buy {}

.option .trade_panel .panel.panel_sell {
  padding-right: 15px;
  padding-left: 15px;
  margin-left: 5px;
}

.option .trade_wrap .buy-input .ivu-input {
  color: rgb(220, 142, 0);
  font-weight: bold;
  font-size: 20px;
  height: 35px;
}

.option .trade_wrap .sell-input .ivu-input {
  color: #f2334f;
  font-weight: bold;
  font-size: 20px;
  height: 35px;
}

.option .ivu-tabs {
  color: #a5a5a5;
}

.option .trade_wrap .trade-input .ivu-input {
  border: 1px solid #27313e;
  color: #fff;
  height: 35px;
  border-radius: 0;
}

.option .trade_wrap .ivu-input-wrapper {
  outline: none;
}

.option .trade_wrap .ivu-input:focus,
.option .trade_wrap .ivu-input:hover {
  box-shadow: none;
  outline: none;
}

.option .trade_wrap .ivu-input-number-input:focus,
.option .trade_wrap .ivu-input-number-input:hover {
  box-shadow: none;
  border-color: #41546d;
  outline: none;
}

.option .trade_wrap .ivu-input:hover {
  box-shadow: none;
  outline: none;
}

.option .trade_wrap .ivu-input-number-input:hover {
  box-shadow: none;
  border-color: #41546d;
  outline: none;
}

.option .trade_wrap .ivu-form-item-content input {
  padding-left: 5px;
  text-align: center;
  padding-right: 55px;
  font-size: 16px;
}

.option .trade_wrap .ivu-form-item-content input::-webkit-input-placeholder {
  font-size: 14px;
  margin-bottom: 10px;
  text-align: left;
}

.option .trade_wrap .trade-input input::-webkit-input-placeholder {}

.option .trade_wrap .ivu-form-item-content label.before {
  position: absolute;
  top: 4px;
  left: 10px;
  color: #7c7f82;
  z-index: 2;
  font-size: 14px;
}

.option .trade_wrap .ivu-form-item-content label.after {
  position: absolute;
  top: 4px;
  right: 10px;
  color: #7c7f82;
  font-size: 14px;
}


.trade_bd_ctc Button.bg-red {
  background-color: #f15057;
}

.trade_bd_ctc Button.bg-red:hover {
  background-color: #ff7278;
}

.div_box {
  width: 200px;
  height: 50px;
  background-color: white;
  border-radius: 10px;
  clip-path: polygon(50% 0%, 100% 38%, 82% 100%, 18% 100%, 0% 38%);
}


.trade_bd_ctc Button.bg-green {
  background-color: #00b275;
}

.trade_bd_ctc Button.bg-green:hover {
  background-color: #01ce88;
}

.trade_bd_ctc Button.bg-gray {
  background-color: #35475b;
  cursor: not-allowed;
  color: #9fabb5;
}

.trade_bd_ctc Button.bg-gray:hover {
  color: #9fabb5 !important;
}

.trade_bd_ctc Button:hover {
  /* background: #54679F; */
}

.option .trade_wrap .ivu-btn {
  color: #FFF !important;
}

.option .total {
  min-height: 90px;
}

.trade-input .ivu-form-item-content .ivu-radio-group .ivu-radio-wrapper {
  cursor: auto !important;
}

.option .trade_wrap .ivu-btn.ivu-btn-small {
  padding: 2px 5px !important;
}

.option .ivu-progress .ivu-progress-outer .ivu-progress-inner {
  background-color: #5d4920;
  border-radius: 0px;
}

.deposit_flex {
  position: absolute;
  z-index: 100;
  height: 25px;



  .deposit_flex_title {
    white-space: nowrap;
    font-weight: 700;
    color: white;
  }
}

.deposit_flex_now {
  position: absolute;
  z-index: 100;
  height: 25px;
}



.deposit_flex_n {
  width: 89px;
  position: absolute;
  height: 25px;
  top: 4px;
  right: 4px;
}

.deposit_flex_n_down {
  width: 89px;
  position: absolute;
  z-index: 100;
  height: 25px;
  bottom: 16px;
  right: 4px;
}

.deposit_flex_up {
  margin-top: 30px;
  font-size: 14px;
  color: #f0a70a;
}

.deposit_flex_down {
  width: 100%;
  text-align: end;
  font-size: 14px;
  color: #DF484C;
}

.deposit_flex_d {
  margin-left: 10px;
  text-align: end;
  font-size: 14px;
  color: #DF484C;
}

.color_green {
  color: #00b275;
}

.color_red {
  color: #f15057;
}

.color_gold {
  color: #000;
}


.current-period {
  position: relative;
  overflow: hidden;
  background-size: 500% 500%;
  animation: gradientBG 5s ease infinite;
}

.Btn_n.active {
  background-color: #D0F500;
  color: #000;
  border-color: #1EC6B6;
  font-weight: bold;
}

@keyframes span1 {
  0% {
    left: 50%
  }

  100% {
    left: 100%;
  }
}

@keyframes span2 {
  0% {
    top: -70px;
  }

  100% {
    top: 100%;
  }
}


@keyframes span3 {
  0% {
    right: 40%;
  }

  100% {
    right: 100%;
  }
}

@keyframes span4 {
  0% {
    top: -70px;
  }

  100% {
    top: 100%;
  }
}

@keyframes span5 {
  0% {
    left: 40%;
  }

  100% {
    left: 100%;
  }
}

.last-period {
  background: #daff46;
  background-size: 400% 400%;
  animation: gradientBG 5s ease infinite;
}

@keyframes gradientBG {
  0% {
    background-position: 0% 0%;
  }

  50% {
    background-position: 50% 100%;
  }

  100% {
    background-position: 0% 0%;
  }
}

.option .ctc-container {
  width: 100%;
}

.option-tab {
  position: relative;
  width: 100%;
  margin-bottom: 10px;
  border-bottom: 1px solid #323c53;
}

.option-tab:after {
  height: 1px;
  background: #FFF;
  width: 100%;
  position: absolute;
  bottom: 1px;
}

.option-tab-item {
  float: left;
  margin-right: 10px;
  padding: 5px 10px;
  font-size: 17px;
}

.option-tab-item:hover {
  cursor: pointer;
}

.option-tab-current {
  border-bottom: 2px solid #f0a70a !important;
  color: #f0a70a !important;
}

.option .ivu-progress-text-inner {
  display: inline-block;
  width: 40px;
}

.option iframe {
  height: 240px !important;
}
</style>

<style lang="scss" scoped>
.option {
  height: 100%;
  background-size: cover;
  position: relative;
  overflow: hidden;
  padding-bottom: 50px;
  padding-top: 50px;
}

.option .bannerimg {
  display: block;
  width: 100%;
}

.option .ctc_container {
  text-align: center;
  height: 100%;

  >h1 {
    margin-top: -150px;
    font-size: 32px;
    line-height: 1;
    padding: 50px 0 20px 0;
    letter-spacing: 3px;
  }
}

.option .main {
  display: flex;
  justify-content: space-between;
  flex-direction: row;
  flex-wrap: wrap;
}

.ctc-container {
  min-height: 470px;
}

.bottom-panel {
  border-top: 1px solid rgb(237, 237, 237);
  margin-top: 15px;

  .bottom {
    display: flex;
    flex-direction: row;
    justify-content: space-between;

    span {
      font-size: 12px;
      color: #a7a7a7;
      margin-top: 15px;
    }

    button,
    a {
      margin-top: 11px;
    }

    a.ivu-btn-primary {
      background: #0095ff;
    }

    a.ivu-btn-primary:hover {
      background: #2ba7ff;
    }
  }
}

.right {
  float: right;
}

.left {
  float: left;
}

.gray {
  color: #a7a7a7;
}

.option .quantity-group {
  .quantity-item {
    display: inline-block;
    padding: 0px 15px;
    border-radius: 3px;
    border: 1px solid #515a6e;
    margin-left: 15px;

    &:hover {
      border: 1px solid #f0ac19;
      cursor: pointer;
    }
  }

  .current {
    border: 1px solid #f0ac19;
    color: #f0ac19;
  }
}

.result-panel {
  border-radius: 5px;
  min-height: 310px;
  background: #0b1520;
  width: 100%;
  text-align: left;
  padding: 10px 10px;
  margin-bottom: 10px;

  .title-switch {
    display: inline-block;
    margin: 0 8px;
    padding: 0px 3px 3px 3px;
    border-bottom: 2px solid #0b1520;

    &:hover {
      cursor: pointer;
      color: #f0a70a;
    }
  }

  .switch-current {
    color: #f0a70a !important;
    border-bottom: 2px solid #f0a70a !important;
  }

  .result-item {
    width: 5%;
    display: inline-block;
    margin-bottom: 30px;
    float: left;

    .item-title {
      width: 100%;
      text-align: center;

      span {
        display: inline-block;
        width: 100%;
        line-height: 20px;
        font-size: 13px;
      }
    }

    .item-body {
      width: 100%;
      text-align: center;
      color: #FFF;
      font-weight: bold;
      margin-top: 10px;

      span {
        display: inline-block;
        height: 25px;
        line-height: 25px;
        width: 25px;
        border-radius: 25px;
        font-size: 16px;
        font-weight: bold;

        i {
          margin-top: -4px;
        }
      }

      .tip-item {
        span {
          display: inline-block;
          width: 60px;
          font-size: 10px;
          height: 16px;
          line-height: 16px;
          text-align: right;
          font-size: 8px;
          font-weight: normal;
        }
      }
    }

    &:not(:last-child) {
      border-right: 1px dashed #2c3038;
    }

    &:nth-child(20) {
      border-right: none;
    }
  }
}

.decline_Data {
  align-items: center;
  display: flex;
  flex-direction: column;
  left: 0px;
  justify-content: center;
  position: absolute;
  top: 10px;
  width: 100%;
}

.decline_Data_now {
  align-items: center;
  display: flex;
  flex-direction: column;
  left: 0px;
  justify-content: center;
  position: absolute;
  top: 15%;
  width: 100%;
}

.bg-green {
  background: #00b275;
}

.bg-red {
  background: #f2334f;
}

.bg-gray {
  background: #585858;
}

.price_row {
  display: flex;
  align-items: center;
  justify-content: center;

  .Btn_n {
    white-space: nowrap;
    text-align: center;
    width: 20% !important;
    margin-right: 15px;
  }
}

.content {
  padding: 0 10px;
  box-sizing: border-box;
  position: relative;

  .label_title {
    width: 90px;
    padding: 1px 10px;
    white-space: nowrap;
    font-weight: 700;
    border-radius: 10px;
    border: 1px solid #f0a70a;
    color: #f0a70a;
    position: absolute;
    top: 5px;
    left: 10px;

    .label_title_value {
      text-align: center;
      line-height: 12px;
    }
  }
}

.label_title_now {
  padding: 1px 10px;
  white-space: nowrap;
  font-weight: 700;
  border-radius: 10px;
  border: 1px solid #f0a70a;
  color: #f0a70a;
  position: absolute;
  top: 20px;
  left: 10px;



  .label_title_value {
    text-align: center;
    line-height: 12px;
  }

}

.label_title_now_now {
  padding: 1px 10px;
  white-space: nowrap;
  font-weight: 700;
  border-radius: 10px;
  border: 1px solid #f0a70a;
  color: #f0a70a;

  .label_title_value {
    text-align: center;
    line-height: 12px;
  }
}

.last-period {
  width: 100%;
  border-radius: 5px;
  margin-bottom: 10px;
  min-height: 40px;
  padding: 0 20px;

  .period-content {
    width: 100%;
    display: flex;
    justify-content: space-between;
    width: 560px;
    float: left;
    height: 40px;
    line-height: 40px;
    font-size: 12px;

    .content-item {
      float: left;
      width: 33%;
      text-align: center;

      span:nth-child(1) {
        display: inline-block;
        height: 20px;
        line-height: 20px;
        padding: 0px 8px;
        border-radius: 3px;
      }

      .direction {
        display: inline-block;
        height: 20px;
        line-height: 20px;
        background: #FFF;
        padding: 0px 8px;
        border-radius: 3px;
        box-shadow: 2px 2px 5px 0px #00000047;
      }
    }
  }
}

.current-period {
  min-height: 170px;
  width: 100%;
  padding: 10px 10px;
  border-radius: 5px;

  .period-title {
    display: inline-block;
    width: 100%;
    text-align: center;
    font-size: 24px;
    font-weight: bold;
  }

  .period-time {
    display: inline-block;
    width: 100%;
    text-align: center;
    font-size: 14px;
    margin-bottom: 20px;
    letter-spacing: 1px;
  }

  .period-reward {
    width: 33.3%;
    float: left;
    padding: 10px 0px;
    background: #111a25;

    &:not(:last-child) {
      border-right: 2px dashed #0b1520;
    }

    &:first-child {
      border-top-left-radius: 10px;
      border-bottom-left-radius: 10px;
    }

    &:last-child {
      border-top-right-radius: 10px;
      border-bottom-right-radius: 10px;
    }
  }

}

.dropdown {
  position: relative;
  display: inline-flex;
  align-items: center;
  background-color: #24313c;
  /* 背景颜色 */
  padding: 10px;
  border-radius: 10px;
  cursor: pointer;

}

.relative {
  position: relative;
}

.currency {
  margin-right: 30px;
  font-size: 20px;
  color: white;

}

.price {
  font-size: 20px;
  color: #a3a3a4;
  margin-right: 5px;

}

.arrow {
  font-size: 16px;
  color: #000;
  /* 箭头颜色 */
}

.dropdown-content {
  width: 100%;
  display: block;
  position: absolute;
  background-color: #22313C;
  min-width: 160px;
  box-shadow: 0px 8px 16px 0px rgba(0, 0, 0, 0.2);
  z-index: 1;
}

.dropdown {
  margin: 0 auto;
}

.dropdown-item_left {
  color: #6a0dad;

}

.dropdown-item_right {
  color: #a3a3a4;
}


.dropdown-item {
  cursor: pointer;
  color: black;
  text-decoration: none;
  display: block;
}

.padding {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
}

.dropdown-item:hover {
  background-color: #5e5b5b;
}

.dropdown_box {
  margin-bottom: 20px;
}

.dropdown_box_center {
  display: flex;
  align-items: center;
  justify-content: center;
}

.dropdown-item_left {
  margin-right: 30px;
}

.flex {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.f_a_c {
  display: flex;
  align-items: center;

}

.box-card {
  border-radius: 20px;
  // width: 300px;
  margin: 10px;
  border: none;
}


.indicator_top {
  font-size: 18px;
  font-weight: 700;
}

.indicator_down {
  font-size: 16px;
  font-weight: 700;
}

.el-carousel__item h3 {
  color: #475669;
  font-size: 14px;
  opacity: 0.75;
  line-height: 200px;
  margin: 0;
}

::v-deep(.el-carousel__mask) {
  background-color: transparent;
}

// .el-carousel__item:nth-child(2n+1) {
//   background-color: #d3dce6;
// }

.black {
  color: black;
}

.white {
  color: white;
}


.indicator {
  margin-bottom: -1px;
  font-weight: 700;
  border-radius: 8px;
  position: relative;
  text-align: center;
}

.indicator_b {
  margin-top: 20px;
  text-align: center;
  position: relative;
  width: 100%;
  font-weight: 700;
  border-radius: 8px;
}

.indicator_bottom {
  text-align: center;
  position: relative;
  width: 100%;
  font-weight: 700;
  border-radius: 8px;
}

.up {
  background-color: #1EC6B6;
}

.down {
  border-radius: 7px;
  background-color: #DF484C;
  color: white;
  font-size: 15px;
  padding: 4px 10px;
  font-weight: 700;

}

.rate {
  font-size: 14px;
}

.price-info {
  border-radius: 8px;
  padding: 12px;
}

.price-info_b {
  border-radius: 8px;
  padding: 12px
}

.price-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
}

.label {
  color: #666;
  font-size: 14px;
  font-weight: 600;
  text-align: start;
}

.value {
  color: #767676;
  font-weight: 500;
}

::v-deep(.el-card__header) {
  background-color: #27313D;
  border: none !important;
  color: #BEC5D0;
  font-weight: bold;
  padding: 7px;
}

::v-deep(.el-card__body) {}

.box-Newcard {
  border: none;
  border-radius: 20px;
  flex: 1;
}

.NewFlex {
  height: 700px;
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

::v-deep(.el-card__header) {
  background-color: #27313D;
  color: #c7acfa;
  font-weight: bold;
  border: none;
  padding: 7px;
}

::v-deep(.el-card__body) {
  display: flex;
  flex-direction: column;
  border: none;
  justify-content: space-between;
  padding: 0 10px 10px 10px;
}


.green {
  color: #d0f500;
  font-weight: 700;
}

.greenBg {
  color: white;
  background-color: #d0f500;
  border-radius: 7px;
  padding: 4px 10px;
  font-size: 15px;
  font-weight: 700;
}

.purpleBg {
  color: white;
  background-color: #ed4014;
  border-radius: 7px;
  padding: 4px 10px;
  font-size: 15px;
  font-weight: 700;
}

.price-flat {
  color: white;
  background-color: rgb(136, 136, 136);
  border-radius: 7px;
  padding: 4px 10px;
  font-size: 15px;
  font-weight: 700;
}

.purple {
  color: #DF484C !important;
  font-weight: 700;
}

.pentagon {
  position: relative;
  width: 100px;
  border-bottom: 70px solid #f00;
  border-left: 35px solid transparent;
  border-right: 35px solid transparent;
  height: 0;
  margin: 50px auto;
}

.pentagon:after {
  content: "";
  position: absolute;
  left: -35px;
  top: 70px;
  width: 0;
  border-left: 70px solid transparent;
  border-right: 70px solid transparent;
  border-top: 40px solid #f00;
}

.rate {
  font-size: 14px;
  font-weight: 700;
}

.label_ovo {
  color: #7a7a7d;
  font-size: 14px;
  font-weight: 700;
  text-align: start;
}

.color_box {
  margin-top: 5px;
  margin-bottom: 13px;
}

.buy_box {
  height: 100%;
  border: none;
  border-radius: 20px;
  background-color: #15232F;
}

::v-deep(.el-card__header) {
  background-color: #7746D5;
  color: white;
  font-weight: bold;
  border: none;
  padding: 7px;
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
}

::v-deep(.el-card__body) {
  height: 90%;
  display: flex;
  flex-direction: column;
  border: none;
  justify-content: space-between;
  padding: 0 20px 20px 20px;

}

.buy_box_top {}

.buy_box_input {
  width: 100%;
}

::v-deep(.el-input__inner) {
  border: 1px solid #eaeaed;
  border-radius: 10px;
  text-align: end;
}

.t_left {
  text-align: left;
}

.balance {
  text-align: end;
  margin-top: 4px;
  font-size: 14px;
  color: #A098C1;
}

.Options_bottom_title {
  font-size: 20px;
  font-weight: 700;
  margin-bottom: 5px;
}

.Options_bottom {
  margin-bottom: 20px;
}

.Btn_n {
  width: 18% !important;
  padding: 4px 15px;
  cursor: pointer;
  border: none;
  border-radius: 5px;
  --un-text-opacity: 1;
  color: rgba(142, 142, 146, var(--un-text-opacity));
  text-align: center;
  background-color: #f8f8f8;
  font-weight: 700;
}

.margin {
  padding: 10px 0;

  .Btn_n {
    &:hover {
      color: #000;
      background-color: #D0F500;
    }
  }
}

.rise {
  position: relative;
  cursor: pointer;
  padding: 15px 0;
  border-radius: 10px;
  width: 49%;
  border: none;
  font-size: 18px;
  font-weight: 700;
  background-color: #D0F500;
}

.decline {
  cursor: pointer;
  padding: 15px 0;
  border-radius: 10px;
  width: 49%;
  border: none;
  font-size: 18px;
  font-weight: 700;
  background-color: #ed4014;
}

.buy_box_bottom {
  color: #A69EC4;
  margin-top: 20px;
  font-size: 14px;
  font-size: 700;
}

.magin {
  margin-top: 15px;
}

.buy_box_info_top {
  padding: 10px 0;

  div {
    color: white;
    font-size: 16px;
    font-weight: 700;
  }
}

.buy_box_info_top_box {
  display: flex;
  align-items: center;
  background-color: #D0F500;
  padding: 4px 10px;
  border-radius: 6px;
}

.buy_box_info_down_box {
  display: flex;
  align-items: center;
  background-color: #DF484C;
  padding: 4px 10px;
  border-radius: 6px;
}

::v-deep(.Options_bottom th) {
  background-color: #28313D;
  border: none !important;
}

::v-deep(.Options_bottom td) {
  background-color: #0d141e;
  border: none !important;
  color: white;
}

::v-deep(.Options_bottom .el-table) {
  border: none !important;
}

::v-deep(.Options_bottom .el-table::before) {
  background-color: #0d141e !important;
}

::v-deep(.Options_bottom .el-table tbody tr:hover>td) {
  background-color: #17202b !important
}

.row {
  background-color: #17232F;
}

.demonstration_color {
  color: #a5a5a5;
}

::v-deep(.block .el-slider .el-slider__runway .el-slider__bar) {
  background-color: #000;
}

::v-deep(.block .el-slider .el-slider__runway) {
  height: 4px;
}

.items-container-box {
  border: 1px solid #eaeaed;
  padding: 10px;
  border-radius: 12px;
  margin: 0 10px;
}


.items-container {
  display: flex;
  flex-direction: row-reverse;
  overflow-x: auto;
  gap: 10px;
  padding: 10px 0;
}


.item {
  opacity: 0.5;
  flex: 0 0 auto;
  width: 300px;
  min-width: 200px;
  border: 1px solid rgb(75, 75, 75);
  border-radius: 10px;
  box-sizing: border-box;

}

.item:hover {
  opacity: 1;
}

.box-card {
  height: 100%;
}

.clearfix {
  display: flex;
  justify-content: space-between;
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
}

.clearfix1 {
  display: flex;
  justify-content: space-between;
}


.Card_box {
  border: 1px solid #4b4b4b;
  border-radius: 19px;
}

.upData {
  align-items: center;
  display: flex;
  flex-direction: column;
  left: 0px;
  height: 100%;
  justify-content: center;
  position: absolute;
  top: 0;
  width: 100%;
}

.card_info_box {
  position: relative;

  .card_info_box_svg {}
}

.indicator_info {
  height: 65px;
}

::v-deep(.transaction_box .el-card__body) {
  padding: 0 !important;
}

.transaction_box {
  height: 100%;
  border: none;
  border-radius: 20px;
  perspective: 1000px;

  .card-inner {
    position: relative;
    width: 100%;
    height: 100%;
    text-align: center;
    transition: transform 0.8s;
    transform-style: preserve-3d;
  }

  &.is-flipped .card-inner {
    transform: rotateY(180deg);
  }

  .card-front,
  .card-back {
    position: absolute;
    width: 100%;
    height: 100%;
    backface-visibility: hidden;

    .buy_box_info_head {
      background-color: #f8f8f8;
      padding: 0px 10px;
      border-radius: 10x 10px 0 0;

      img {
        width: 20px;
        height: 20px
      }
    }


  }





  .card-back {
    transform: rotateY(180deg);
    display: flex;
    flex-direction: column;


    .back-content {
      color: #fff;
      padding: 20px;
    }
  }
}

.transaction_head {
  background-color: #7746D5;
  color: white;
  font-weight: bold;
  border: none;
  padding: 10px;
  border-radius: 10px 10px 0 0;
}

.transaction_info {
  border-radius: 10px;

  .rise {
    width: 100%;
    height: 100px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
  }

  .decline {
    margin-top: 10px;
    width: 100%;
    height: 100px;
    box-shadow: 0 7px 10px rgba(0, 0, 0, 0.3);

  }
}

.card-info {
  padding: 50px 20px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.Betting_form {
  padding: 30px 20px;
}

.Betting_btn {
  margin-top: 20px;

  .Betting_btn_up {
    cursor: pointer;
    width: 60%;
    font-size: 18px;
    font-weight: 700;
    border: none;
    border-radius: 10px;
    background-color: #D0F500;
    color: white;
    padding: 12px 20px;
  }

  .Betting_btn_down {
    cursor: pointer;
    width: 60%;
    font-size: 18px;
    font-weight: 700;
    border: none;
    border-radius: 10px;
    background-color: #DF484C;
    color: white;
    padding: 12px 20px;
  }
}

.Time_label_select {
  padding: 5px 20px;

  .Time_label {
    margin-top: 3px;
    text-align: start;
    color: #666;
  }
}

.reward_box {
  margin-left: 30px;
  height: 40px;
  line-height: 40px;
  font-size: 12px;
  float: right;
  display: flex;
  align-items: center;
  position: relative;

  .Noreward {
    color: #000;
  }

  button {
    padding: 0px 15px;
    height: 28px;
    line-height: 28px;
    background: #7746D5;
    color: #fff;
    border: none;
    border-radius: 4px;
    cursor: pointer;

    &:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }
  }

  .flex {
    display: flex;
  }
}

.Time_Icon {
  color: white;
  font-size: 17px;
  margin-top: -2px;
}

.coin-animation {
  position: fixed;
  pointer-events: none;
  z-index: 9999;
}

#app {
  position: relative;
  text-align: center;
}

.target-box {
  position: absolute;
  top: 200px;
  left: 50%;
  transform: translateX(-50%);
  width: 20px;
  height: 20px;
  background-color: lightgray;
  text-align: center;
  line-height: 150px;
}

.animated-image_box {
  height: 100%;
  width: 100%;
}

.animated-image {
  width: 550px;
  height: 500px;
  z-index: 100000;
  left: 50%;
  position: absolute;
  animation: moveToTarget 2s forwards;
}

@keyframes moveToTarget {
  0% {
    transform: translateX(-50%) translateY(-50%) scale(0);
    opacity: 0;
  }

  50% {
    transform: translateX(-50%) translateY(0) scale(1.2);
    opacity: 1;
  }

  100% {
    transform: translateX(0) translateY(0) scale(1);
    opacity: 1;
  }
}

.dropdown {
  position: absolute;
  top: 100%;
  background: #0b1520;
  padding: 5px;
  z-index: 10;
}

.dropdown {
  position: absolute;
  top: 100%;
  background-color: #0D151F;
  border: 1px solid #333;
  border-radius: 5px;
  z-index: 1000;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
  display: none;
  min-width: 100px;
}

.dropdown button {
  display: block;
  width: 100%;
  text-align: left;
  padding: 8px 12px;
  border: none;
  background-color: transparent;
  color: white;
  cursor: pointer;
  transition: background-color 0.3s;
}

.more-wrapper .dropdown {
  display: block;
}

.table_box {
  border: 1px solid #eaeaed;
  border-radius: 12px;
  padding: 0 10px;
  margin: 0 10px;
}

.table_title {
  padding: 10px 0;

}

::v-deep(.page) {
  padding: 10px 0;
  display: flex;
  justify-content: flex-end;
}


.dropdown button:hover {
  border-radius: 5px;
  background-color: #292B31;
}

.dropdown button.active {
  background-color: #292B31;
  border-radius: 5px;
  color: white;
}

.slider {
  // background-color: ;
}

::v-deep(.slider .el-slider__button) {
  border: 2px solid #000 !important;
}

::v-deep(.slider .el-slider__stop) {
  width: 12px;
  height: 12px;
  border: 1px solid #fff;
  background-color: #ebf2fa;
  margin-top: -4px;
}

::v-deep(.slider .color-red) {
  background-color: #000;
}



.stop-active {}

.deposit_flex_down {
  position: absolute;
  top: 20px;
}

.quick-order-btns {
  display: flex;
  gap: 10px;
  margin-top: 10px;
}

.quick-btn {
  z-index: 100;
  padding: 5px 15px;
  border-radius: 5px;
  background-color: #f8f8f8;
  --un-text-opacity: 1;
  border: none;
  color: rgba(142, 142, 146, var(--un-text-opacity));
  cursor: pointer;
  font-weight: 700;
  min-width: 80px;
}

.quick-btn:hover {
  color: #000;
  background-color: #d0f500;
}

.UnderMaintenance {
  width: 230px;
  height: 300px;
}

.UnderMaintenance_text {
  color: #666;
  font-size: 28px;
  font-weight: 700;
  margin-top: 180px;
}

.NewFlex_left {
  width: 70%;
  height: 700px;
  border: 1px solid #eaeaed;
  border-radius: 12px;
  padding: 10px;
}

.NewFlex_right {
  height: 100%;
  width: 29%;
  min-width: 380px;
  border: 1px solid #eaeaed;
  border-radius: 20px;
}

::v-deep(.el-input__inner) {
  background-color: #28292A !important;
}
</style>