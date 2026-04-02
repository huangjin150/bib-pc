<template>
  <footer class="footer">
    <div class="footer-container">
      <!-- 主要内容区域 -->
      <div class="footer-content">
        <!-- 左侧：Logo和社交媒体 -->
        <div class="footer-left">
          <div class="footer-logo">
            <img width="100%" src="../assets/images/logo-338.png" alt="Bibcoin" class="logo-img" />
          </div>
          <p class="footer-description">解锁通往加密货币宇宙的大门
          </p>

          <!-- 社交媒体图标 -->
          <div class="social-icons">
            <!-- <div class="social-row">
              <a href="https://www.instagram.com" class="social-link" target="_blank" rel="noopener noreferrer">
                <img src="../assets/svg/footer1.svg" alt="">
              </a>
              <a href="https://www.reddit.com" class="social-link" target="_blank" rel="noopener noreferrer">
                <img src="../assets/svg/footer2.svg" alt="">
              </a>
              <a href="https://www.facebook.com" class="social-link" target="_blank" rel="noopener noreferrer">
                <img src="../assets/svg/footer3.svg" alt="">

              </a>
              <a href="https://x.com/BitTapZH" class="social-link" target="_blank" rel="noopener noreferrer">
                <img src="../assets/svg/footer4.svg" alt="">

              </a>
              <a href="https://discord.com" class="social-link" target="_blank" rel="noopener noreferrer">
                <img src="../assets/svg/footer5.svg" alt="">

              </a>
            </div>
            <div class="social-row">
              <a href="https://bittapzh.medium.com/" class="social-link" target="_blank" rel="noopener noreferrer">
                <img src="../assets/svg/footer6.svg" alt="">

              </a>
              <a href="https://www.youtube.com" class="social-link" target="_blank" rel="noopener noreferrer">
                <img src="../assets/svg/footer7.svg" alt="">

              </a>
              <a href="https://www.tiktok.com" class="social-link" target="_blank" rel="noopener noreferrer">
                <img src="../assets/svg/footer8.svg" alt="">

              </a>
              <a href="https://t.me" class="social-link" target="_blank" rel="noopener noreferrer">
                <img src="../assets/svg/footer9.svg" alt="">

              </a>
              <a href="https://www.linkedin.com" class="social-link" target="_blank" rel="noopener noreferrer">
                <img src="../assets/svg/footer10.svg" alt="">
              </a>
            </div> -->
          </div>
        </div>

        <!-- 中间：导航链接 -->
        <div class="footer-nav">
          <div class="nav-column">
            <h4 class="nav-title">关于我们</h4>
            <ul class="nav-list">
              <li><a href="/introduce" class="nav-link">关于Bibcoin</a></li>
              <li><a href="/announcementList/4" class="nav-link">交易对上新</a></li>
              <li><a href="/announcement/0" class="nav-link">平台公告</a></li>
              <li class="nav-link">
                <poptip width="80" trigger="hover" placement="right">
                  <a href="javascript:;" class="nav-link">{{ $t("footer.apidoc") }}</a>
                  <div slot="content">
                    <p style="text-align:center; color: #000;">{{ $t("footer.zwkf") }}</p>
                  </div>
                </poptip>
              </li>
            </ul>
          </div>

          <div class="nav-column">
            <h4 class="nav-title">帮助中心</h4>
            <ul class="nav-list">
              <li><a href="/order" class="nav-link">提交工单</a></li>
              <li><a href="/announcementList/2" class="nav-link">充值提现</a></li>
              <li><a href="/tradingGuide" class="nav-link">交易指南</a></li>
              <li><a href="/coinInfo" class="nav-link">币种资料</a></li>
            </ul>
          </div>

          <div class="nav-column">
            <h4 class="nav-title">条款协议</h4>
            <ul class="nav-list">
              <li><a href="/disclaimer" class="nav-link">免责条款</a></li>
              <li><a href="/privacy" class="nav-link">隐私条款</a></li>
              <li><a href="/agreement" class="nav-link">用户协议</a></li>
              <li><a href="/fees" class="nav-link">风险提示</a></li>
            </ul>
          </div>

          <div class="nav-column">
            <h4 class="nav-title">联系我们</h4>
            <ul class="nav-list">
              <li class="nav-link">
                <poptip width="80" trigger="hover" placement="right">
                  <a href="javascript:;" class="nav-link">{{ $t("footer.kfyx") }}</a>
                  <div slot="content">
                    <p style="text-align:center; color: #000;">{{ $t("footer.yxxx") }}</p>
                  </div>
                </poptip>
              </li>
              <li class="nav-link">
                <poptip width="80" trigger="hover" placement="right">
                  <a href="javascript:;" class="nav-link">{{ $t("footer.swhz") }}</a>
                  <div slot="content">
                    <p style="text-align:center; color: #000;">{{ $t("footer.yxxx") }}</p>
                  </div>
                </poptip>
              </li>
              <li class="nav-link">
                <poptip width="80" trigger="hover" placement="right">
                  <a href="javascript:;" class="nav-link">{{ $t("footer.sbsq") }}</a>
                  <div slot="content">
                    <p style="text-align:center; color: #000;">{{ $t("footer.yxxx") }}</p>
                  </div>
                </poptip>
              </li>
              <li class="nav-link">
                <poptip width="80" trigger="hover" placement="right">
                  <a href="javascript:;" class="nav-link">{{ $t("footer.tsjb") }}</a>
                  <div slot="content">
                    <p style="color: #000;">{{ $t("footer.yxxx") }}</p>
                  </div>
                </poptip>
              </li>
            </ul>
          </div>

          <div class="nav-column">
            <h4 class="nav-title">友情链接</h4>
            <ul class="nav-list">
              <li><a href="https://www.feixiaohao.com" class="nav-link" target="_blank"
                  rel="noopener noreferrer">非小号</a></li>
              <li><a href="https://www.8btc.com" class="nav-link" target="_blank" rel="noopener noreferrer">巴菲特</a></li>
              <li><a href="https://cn.rootdata.com" class="nav-link" target="_blank" rel="noopener noreferrer">链节点</a>
              </li>
              <li><a href="https://www.jinse.com" class="nav-link" target="_blank" rel="noopener noreferrer">金色财经</a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <!-- 底部版权和语言选择 -->
      <!-- <div class="footer-bottom">
        <div class="footer-bottom-left">
          <p class="copyright">© 2025 Abtcoin</p>
          <p class="terms">隐私条款</p>
          <p class="terms">条款协议</p>
        </div>

        <div class="footer-bottom-right">
          <div class="language-selector">
            <button class="selector-btn">
              <span class="selector-icon">
                <LanguangeIcon style="width: 20px; height: 20px;" :size="14" className="global-btn1" />
              </span>
              <span>中文</span>
            </button>
          </div>

          <div class="currency-selector">
            <button class="selector-btn">
              <span class="selector-icon"><img src="../assets/svg/exchangerate.svg" alt=""></span>
              <span>USD</span>
            </button>
          </div>

          <div class="theme-selector">
            <button class="selector-btn">
              <span class="selector-icon">
                <BrightColorIcon style="width: 20px; height: 20px;" :size="14" className="theme-btn1" />
              </span>
              <span>暗黑模式</span>
            </button>
          </div>
        </div>
      </div> -->
    </div>
  </footer>
</template>

<script>
import LanguangeIcon from '@/components/svg/languageIcon.vue'
import BrightColorIcon from './svg/BrightColorIcon.vue'
export default {
  components: {
    LanguangeIcon,
    BrightColorIcon
  },
  name: 'Footer',
  data() {
    return {
    }
  },
  methods: {
  }
}
</script>

<style scoped lang="scss">
.footer {
  background-color: #000;
  padding: 36px 0;
}

.footer-container {
  max-width: 1260px;
  margin: 0 auto;
  padding: 0 20px;
}

.footer-content {
  display: flex;
  justify-content: space-between;
  gap: 60px;
  margin-bottom: 40px;
}

.footer-left {
  flex: 1;
  max-width: 300px;
}

.footer-logo {
  display: flex;
  align-items: center;
  margin-bottom: 20px;

  .logo-img {
    width: 82px;
    height: 24px;
  }

  .logo-text {
    font-size: 24px;
    font-weight: bold;
  }
}

.footer-description {
  margin-bottom: 30px;
  line-height: 1.5;
  font-size: 20px;
  color: #fff;
}

.social-icons {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.social-row {
  display: flex;
  gap: 12px;
}

.social-link {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 8px;
  transition: all 0.3s ease;

}

.social-icon {
  width: 20px;
  height: 20px;
  fill: #888;
  transition: fill 0.3s ease;

  .social-link:hover & {
    fill: #ffffff;
  }
}

.footer-nav {
  display: flex;
  gap: 60px;

}

.nav-column {
  flex: 1;
}

.nav-title {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 20px;
  color: #ffffff;
}

.nav-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.nav-list li {
  margin-bottom: 12px;
}

.nav-link {
  color: #a0a3a7;
  text-decoration: none;
  font-size: 14px;
  transition: color 0.3s ease;
  white-space: nowrap;

  &:hover {
    color: #ffffff;
  }
}

.footer-bottom {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  border-top: 1px solid #eaeaed;
}

.footer-bottom-left {
  display: flex;
  gap: 30px;
  align-items: center;
}

.copyright {
  font-size: 10px;
}

.terms {
  font-size: 10px;
  cursor: pointer;
  transition: color 0.3s ease;

  &:hover {
    color: #ffffff;
  }
}

.footer-bottom-right {
  display: flex;
  gap: 20px;
  align-items: center;
}

.selector-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  border: none;
  background: transparent;
  color: #000;
  padding: 8px 12px;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 14px;

  .selector-icon {
    height: 20px;
    border-radius: 999px;

    &:hover {
      background: rgba(208, 245, 0);
      color: #000;
    }
  }
}


.dropdown-icon {
  width: 16px;
  height: 16px;
  fill: currentColor;
}

// 响应式设计
@media (max-width: 768px) {
  .footer-content {
    flex-direction: column;
    gap: 40px;
  }

  .footer-nav {
    flex-direction: column;
    gap: 30px;
  }

  .footer-bottom {
    flex-direction: column;
    gap: 20px;
    text-align: center;
  }

  .footer-bottom-left {
    flex-direction: column;
    gap: 15px;
  }

  .footer-bottom-right {
    flex-wrap: wrap;
    justify-content: center;
  }
}

@media (max-width: 480px) {
  .footer {
    padding: 40px 0 20px;
  }

  .social-row {
    justify-content: center;
  }

  .nav-column {
    text-align: center;
  }
}
</style>