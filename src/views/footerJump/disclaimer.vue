<template>
  <div class="container">
    <h1>免责条款</h1>
    <div class="content">
      <div class="title">1. 条款说明</div>
      <div class="text">
        本免责条款（以下简称“本条款”）适用于您使用 Bcbic 平台（以下简称“平台”或“我们”）提供的所有服务。使用本平台即表示您已知悉并同意本条款的所有内容。

        本平台作为技术服务平台，旨在为用户提供数字资产交易及相关辅助服务，平台不对用户的任何投资行为、盈亏结果或使用后果承担任何担保责任或赔偿责任。

        若您不同意本条款的任意部分，应立即停止访问或使用平台服务。您继续使用服务即视为接受本条款的所有约定。
      </div>

      <div class="title">2. 投资风险提示</div>
      <div class="text">
        数字资产属于高波动、高风险的投资品种，可能面临价格剧烈波动、政策监管变动、技术漏洞、黑客攻击等多种不确定性。您应充分了解相关风险，并在自身风险承受能力范围内参与交易。

        <ul>
          <li>平台不对任何交易标的的收益性或稳定性作出保证。</li>
          <li>平台不提供任何形式的投资建议、金融顾问或法律建议。</li>
          <li>用户应独立判断交易时机、自主决策并承担全部盈亏后果。</li>
        </ul>

        若因市场变动、政策调整、或其他不可抗力因素导致资产损失，平台不承担任何赔偿责任。
      </div>

      <div class="title">3. 第三方服务免责声明</div>
      <div class="text">
        本平台可能集成第三方提供的服务或内容（如实名认证、人脸识别、支付结算等），该部分服务由第三方独立提供并承担责任。

        <ul>
          <li>平台对第三方服务的合法性、准确性、实时性不作担保。</li>
          <li>用户与第三方之间的交易、纠纷、合同等法律关系，由双方自行处理，与平台无关。</li>
          <li>第三方可能依据自身条款处理您的信息，请您在使用前仔细阅读并遵守。</li>
        </ul>
      </div>

      <div class="title">4. 服务中断与故障</div>
      <div class="text">
        在下列情形中，平台有权暂停、中断或终止全部或部分服务，不承担任何损害赔偿责任：

        <ol>
          <li>系统维护、升级、修复或其他必要操作</li>
          <li>网络、设备或服务器故障造成的中断</li>
          <li>黑客攻击、病毒传播、网络拥塞等不可控因素</li>
          <li>法律法规、政府机关命令或其他不可抗力</li>
        </ol>

        我们将尽力提前通知并在合理时间内恢复服务，但不承诺服务持续不中断，也不对因此造成的交易失败、资产变动等损失负责。
      </div>

      <div class="title">5. 用户责任与行为规范</div>
      <div class="text">
        用户在平台上应合法合规操作，不得从事以下行为：

        <ul>
          <li>洗钱、欺诈、诈骗、传销等违法活动</li>
          <li>干扰平台系统运行、试图获取他人数据或权限</li>
          <li>发布虚假信息、攻击平台或其他用户</li>
        </ul>

        若您违反法律法规或本条款规定，平台有权采取包括但不限于限制账户、暂停服务、封禁账号、配合执法机关调查等措施，且不承担因此造成的任何后果。
      </div>

      <div class="title">6. 免责条款的变更与解释</div>
      <div class="text">
        本条款由平台根据运营实际不时更新，变更后的条款将在平台显著位置公示并即时生效。您继续使用服务即表示接受更新内容。

        本条款的解释权和修改权归平台所有。若您对本条款有任何疑问或异议，请及时通过客服渠道与我们联系。
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Disclaimer'
}
</script>

<style scoped>
/* 样式沿用你提供的 Privacy.vue 样式 */
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

li {
  font-size: 16px;
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

.text ol,
.text ul {
  margin: 12px 0 12px 20px;
  padding-left: 20px;
  line-height: 1.8;
  font-size: 16px;
  color: #444;
}

.text ol {
  list-style-type: decimal;
}

.text ul {
  list-style-type: disc;
}

.text li {
  margin-bottom: 10px;
  line-height: 1.7;
}

.text ol li ul,
.text ul li ul,
.text ol li ol,
.text ul li ol {
  margin-top: 6px;
  margin-left: 20px;
  font-size: 15px;
  list-style-type: circle;
  color: #555;
}

.text strong {
  color: #222;
  font-weight: 600;
}

@media (max-width: 768px) {
  .text ol,
  .text ul {
    margin-left: 16px;
    padding-left: 16px;
    font-size: 15px;
  }

  .text li {
    margin-bottom: 8px;
  }

  .text ol li ul,
  .text ul li ul {
    margin-left: 16px;
    font-size: 14px;
  }
}
</style>
