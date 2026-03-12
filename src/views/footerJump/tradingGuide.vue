<template>
  <div class="container">
    <h1>交易指南</h1>
    <div class="content">

      <div class="title">1. 平台简介</div>
      <div class="text">
        本平台是一个全球数字资产交易服务提供商，支持多种加密资产的合约交易与理财服务。通过高性能撮合引擎和严格风控体系，确保每笔交易的安全、快速与透明。
      </div>

      <div class="title">2. 交易类型</div>
      <div class="text">
        <ul>
          <li><strong>合约交易：</strong>基于杠杆的衍生品交易，支持多空双向操作。</li>
          <li><strong>预测合约：</strong>全网领先且独特的预测合约交易机制。</li>
        </ul>
      </div>

      <div class="title">3. 交易流程</div>
      <div class="text">
        一般交易流程如下：
        <ol>
          <li>注册账户并完成身份认证（KYC）</li>
          <li>通过链上转账入金</li>
          <li>选择交易市场（如 BTC/USDT）</li>
          <li>选择订单类型：限价单、市场单、止盈止损单等</li>
          <li>输入价格与数量，确认下单</li>
          <li>等待订单成交或主动撤销</li>
          <li>成交后资产将自动结算至您的资产账户</li>
        </ol>
      </div>

      <div class="title">4. 订单类型说明</div>
      <div class="text">
        <ul>
          <li><strong>限价单：</strong>用户设定价格，系统在达到价格时撮合成交。</li>
          <li><strong>市价单：</strong>按当前市场最优价格立即成交，适用于快速买卖。</li>
          <li><strong>止盈单：</strong>在价格达到设定点位时自动平仓，锁定利润。</li>
          <li><strong>止损单：</strong>在市场反向波动时自动止损，防止进一步亏损。</li>
        </ul>
      </div>

      <div class="title">5. 手续费说明</div>
      <div class="text">
        标准交易费率如下（具体费率以平台公告为准）：
        <ul>
          <li>普通用户：0.05%</li>
          <li>VIP1~VIP9 用户享受阶梯式手续费减免</li>
        </ul>
      </div>

      <div class="title">6. 风险管理机制</div>
      <div class="text">
        为保障交易公平与资金安全，平台实行以下风控措施：
        <ul>
          <li><strong>异常订单监控：</strong>识别短时刷单、操纵行为</li>
          <li><strong>价格保护机制：</strong>防止系统价格偏离市场严重波动</li>
          <li><strong>限频限量策略：</strong>避免高频程序化攻击</li>
          <li><strong>实时风控预警：</strong>账户异常波动立即风控处理</li>
        </ul>
      </div>

      <div class="title">7. 常见问题 FAQ</div>
      <div class="text">
        <ol>
          <li><strong>Q：买卖限额是多少？</strong><br>A：不同币种与账户等级对应不同限额，具体见“限额说明”。</li>
          <li><strong>Q：充值不到账怎么办？</strong><br>A：请确认支付信息无误，若长时间未到账，请联系客服处理。</li>
          <li><strong>Q：我可以取消挂单吗？</strong><br>A：未成交的限价挂单均可在订单中心“取消”。</li>
          <li><strong>Q：交易失败的原因有哪些？</strong><br>A：可能是账户余额不足、系统繁忙、网络延迟等。</li>
        </ol>
      </div>

      <div class="title">8. 安全提示</div>
      <div class="text">
        <ul>
          <li>请勿轻信陌生人发来的代投、理财等诈骗信息</li>
          <li>务必启用双重验证（2FA）、绑定邮箱与手机号</li>
          <li>切勿将平台账号密码借给他人或使用弱密码</li>
          <li>定期检查登录记录，如发现异常请立即修改密码</li>
        </ul>
      </div>

      <div class="title">9. 免责声明</div>
      <div class="text">
        数字资产市场波动剧烈，交易具有较高风险。平台仅作为撮合交易技术提供者，不对用户的交易盈亏负责。用户应在了解自身风险承受能力的基础上，独立判断与决策。
      </div>

    </div>
  </div>
</template>

<script>
export default {
  name: 'TradeGuide'
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

.text ul, .text ol {
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
