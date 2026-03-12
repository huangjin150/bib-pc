<template>
  <div class="container">
    <h1>风险提示</h1>
    <div class="content">

      <div class="title">1. 投资有风险，入市需谨慎</div>
      <div class="text">
        数字资产交易具有高波动性和高风险的特征，其价格可能在短时间内大幅涨跌，甚至归零。请您充分认识并理解数字资产投资的风险，结合自身的财务状况、风险承受能力及投资目标，做出独立判断。
      </div>

      <div class="title">2. 风险种类说明</div>
      <div class="text">
        参与本平台提供的相关服务，您可能面临以下主要风险：
        <ul>
          <li><strong>市场风险：</strong>由于行情波动剧烈，投资资产可能在短时间内大幅贬值。</li>
          <li><strong>系统风险：</strong>如服务器崩溃、撮合延迟、黑客攻击等技术问题可能影响交易。</li>
          <li><strong>流动性风险：</strong>部分小众币种成交深度不足，可能导致挂单长期未成交或大额交易滑点严重。</li>
          <li><strong>政策风险：</strong>部分国家或地区对加密资产政策不确定，存在监管变化或限制交易的可能性。</li>
          <li><strong>项目风险：</strong>某些数字资产可能存在团队失联、技术失败、合约漏洞等风险。</li>
          <li><strong>操作风险：</strong>因用户自身误操作、账户信息泄露、钓鱼网站、假冒客服等造成资产损失。</li>
        </ul>
      </div>

      <div class="title">3. 用户须知与责任</div>
      <div class="text">
        <ul>
          <li>请您在交易前充分了解所涉及的产品与币种，避免盲目跟风操作。</li>
          <li>平台不提供任何投资建议或承诺收益行为，所有决策均由用户自行作出。</li>
          <li>您有责任妥善保管好登录信息、资金密码、谷歌验证码等敏感信息。</li>
          <li>您应确保交易资金来源合法合规，不得用于洗钱、诈骗等非法用途。</li>
        </ul>
      </div>

      <div class="title">4. 特殊风险提示</div>
      <div class="text">
        <ul>
          <li><strong>杠杆/合约交易：</strong>具有放大利润与亏损的双刃剑属性，极易爆仓，请务必控制仓位并设置止损。</li>
          <li><strong>第三方项目：</strong>平台不对第三方项目方的运营、安全及合法性承担责任，请用户自行甄别项目风险。</li>
          <li><strong>空投与赠金：</strong>可能附带强制锁仓、交易限制、无法提现等附加条款，用户须谨慎对待。</li>
        </ul>
      </div>

      <div class="title">5. 平台免责声明</div>
      <div class="text">
        <ul>
          <li>平台作为中立的技术服务提供者，仅提供撮合系统与账户管理服务。</li>
          <li>对因市场波动、技术中断、第三方原因造成的损失，平台不承担赔偿责任。</li>
          <li>若发现恶意交易行为（如刷量、操纵市场等），平台有权限制账户交易、冻结资产。</li>
        </ul>
      </div>

      <div class="title">6. 风险控制建议</div>
      <div class="text">
        <ul>
          <li>设置合理仓位：建议每次投入不超过账户总资产的 20%-30%。</li>
          <li>分散投资组合：不要将全部资金投入单一币种或市场。</li>
          <li>使用止盈止损：及时止损可有效规避极端风险。</li>
          <li>理性交易：避免情绪化操作，远离“梭哈”、“All In”、“抄底”等冲动行为。</li>
          <li>定期检查账户安全设置：如开启谷歌验证码、资金密码、邮箱验证等。</li>
        </ul>
      </div>

      <div class="title">7. 风险自担声明</div>
      <div class="text">
        您应明确知悉并同意，任何因您使用本平台服务而产生的盈亏，均由您本人承担。平台不对任何用户的投资行为、盈亏结果承担赔偿、担保或连带责任。
      </div>

    </div>
  </div>
</template>

<script>
export default {
  name: 'RiskNotice'
}
</script>

<style scoped>
.container {
  max-width: 1260px;
  margin: 40px auto 150px;
  padding: 32px 24px;
  background-color: #ffffff;
  border-radius: 10px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.06);
  font-family: 'Segoe UI', 'PingFang SC', sans-serif;
  color: #333;
  line-height: 1.8;
  font-size: 16px;
}

h1 {
  font-size: 36px;
  font-weight: 800;
  color: #1e1e1e;
  margin-bottom: 32px;
  text-align: center;
  border-bottom: 1px solid #eee;
  padding-bottom: 10px;
}

strong {
  font-size: 18px !important;
}

.title {
  margin-top: 40px;
  margin-bottom: 16px;
  font-size: 20px;
  font-weight: 700;
  color: #1a1a1a;
  border-left: 4px solid #409EFF;
  padding-left: 12px;
}

.text {
  font-size: 18px;
  margin-bottom: 20px;
  line-height: 1.9;
  color: #444;
  text-align: justify;
}

.text ul,
.text ol {
  margin-left: 20px;
  padding-left: 20px;
  line-height: 1.8;
}

.text li {
  margin-bottom: 10px;
}

@media (max-width: 768px) {
  .container {
    margin: 20px 16px 80px;
    padding: 20px 16px;
  }

  h1 {
    font-size: 28px;
  }

  .title {
    font-size: 18px;
  }

  .text {
    font-size: 15px;
  }
}
</style>
