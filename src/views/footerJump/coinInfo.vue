<template>
  <div class="container">
    <h1>币种资料 - BTC（比特币）</h1>
    <div class="content">

      <div class="title">1. 基本信息</div>
      <div class="text">
        <ul>
          <li><strong>名称：</strong>比特币（Bitcoin）</li>
          <li><strong>英文简称：</strong>BTC</li>
          <li><strong>流通市值排名：</strong>第 1 名</li>
          <li><strong>项目官网：</strong><a href="https://bitcoin.org" target="_blank">https://bitcoin.org</a></li>
          <li><strong>白皮书：</strong><a href="https://bitcoin.org/bitcoin.pdf" target="_blank">下载查看</a></li>
          <li><strong>合约地址：</strong>非合约币（PoW 机制）</li>
        </ul>
      </div>

      <div class="title">2. 链上属性</div>
      <div class="text">
        <ul>
          <li><strong>公链类型：</strong>独立主链</li>
          <li><strong>共识机制：</strong>工作量证明（PoW）</li>
          <li><strong>出块时间：</strong>约 10 分钟</li>
          <li><strong>区块大小上限：</strong>1 MB</li>
          <li><strong>平均 TPS：</strong>~7 笔/秒</li>
          <li><strong>链浏览器：</strong><a href="https://www.blockchain.com/explorer" target="_blank">Blockchain Explorer</a></li>
        </ul>
      </div>

      <div class="title">3. 技术参数</div>
      <div class="text">
        <ul>
          <li><strong>算法：</strong>SHA-256</li>
          <li><strong>初始发行量：</strong>21,000,000 BTC</li>
          <li><strong>当前流通量：</strong>约 19,700,000 BTC</li>
          <li><strong>减半机制：</strong>每 210,000 个区块减半（约 4 年）</li>
          <li><strong>最新一次减半：</strong>2024 年 4 月（区块高度 840,000）</li>
          <li><strong>挖矿难度调整：</strong>每 2016 个区块</li>
        </ul>
      </div>

      <div class="title">4. 应用场景</div>
      <div class="text">
        <ul>
          <li>全球价值储存与避险资产（数字黄金）</li>
          <li>跨境支付与资产转移</li>
          <li>区块链底层技术创新源头</li>
          <li>Web3、DeFi 等生态基础</li>
        </ul>
      </div>

      <div class="title">5. 上线时间与背景</div>
      <div class="text">
        比特币于 2009 年 1 月由化名 “中本聪（Satoshi Nakamoto）” 发布，其创世区块被命名为 Genesis Block，内容包含一段英国《泰晤士报》关于金融危机的头条：“The Times 03/Jan/2009 Chancellor on brink of second bailout for banks”。  
        这表明比特币的诞生源自对法币滥发和金融垄断的反思，致力于构建一个去中心化、抗审查的价值交换体系。
      </div>

      <div class="title">6. 发行机制</div>
      <div class="text">
        比特币采用无预挖、无 ICO 模式，完全依赖挖矿方式进行释放。矿工通过计算 SHA-256 哈希获得出块奖励，每 4 年减半一次。起始奖励为 50 BTC/区块，当前已减半至 3.125 BTC。

        区块奖励时间线如下：
        <ul>
          <li>2009年：50 BTC</li>
          <li>2012年：25 BTC</li>
          <li>2016年：12.5 BTC</li>
          <li>2020年：6.25 BTC</li>
          <li>2024年：3.125 BTC（当前）</li>
        </ul>
      </div>

      <div class="title">7. 代币分配</div>
      <div class="text">
        <ul>
          <li><strong>矿工奖励：</strong>100%（无预挖、无机构保留）</li>
          <li><strong>早期分布：</strong>中本聪挖出前 100 万枚 BTC（目前未移动）</li>
          <li><strong>机构持仓：</strong>部分 ETF 和信托基金（如 GBTC）</li>
        </ul>
      </div>

      <div class="title">8. 重大事件与发展里程碑</div>
      <div class="text">
        <ul>
          <li>2010 年：“披萨日”首次以 1 万 BTC 购买 2 份披萨</li>
          <li>2013 年：价格首次突破 1,000 美元</li>
          <li>2017 年：达到历史高点 19,800 美元</li>
          <li>2021 年：突破 6 万美元并获多个国家机构承认</li>
          <li>2024 年：第四次减半完成，比特币 ETF 获批</li>
        </ul>
      </div>

      <div class="title">9. 风险提示</div>
      <div class="text">
        <ul>
          <li>币价波动剧烈，可能造成较大资产亏损</li>
          <li>技术更新缓慢，扩展性不足</li>
          <li>挖矿集中化趋势明显</li>
          <li>政策与监管不确定性</li>
        </ul>
        用户应根据自身风险承受能力，审慎参与相关投资行为。
      </div>

    </div>
  </div>
</template>

<script>
export default {
  name: 'TokenInfo'
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

.text a {
  color: #409EFF;
  text-decoration: underline;
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
