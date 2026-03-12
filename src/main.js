import Vue from 'vue'
import App from './App.vue'
import router from '../src/config/routes'
import Api from "./config/api";
import VueResource from 'vue-resource'
import qs from 'qs';
import iView from "iview";
import "iview/dist/styles/iview.css";
import VueI18n from "vue-i18n";
import VueClipboard from "vue-clipboard2";
import store from "./config/store.js";
import ElementUI from "element-ui";
import "element-ui/lib/theme-chalk/index.css";



Vue.use(iView);
Vue.use(VueClipboard);
Vue.use(VueResource)
Vue.use(VueI18n)
Vue.use(ElementUI);
Vue.config.productionTip = false
Vue.prototype.api = Api;
store.commit('initTheme');

// 环境配置
(function () {
  if (process.env.NODE_ENV === "development") {
    // 开发环境
    Vue.prototype.host = "http://192.168.1.110:2201"; // 本地测试
    Vue.prototype.swapHost = "http://192.168.1.110:2202"; // 本地测试
    Vue.prototype.inviteHost = "http://localhost:8080/#/"; //邀请地址
  } else {
    // 生产环境
    Vue.prototype.host = "/api"; // 线上
    Vue.prototype.swapHost = "/swap-api"; // 线上
    Vue.prototype.inviteHost = window.location.protocol + '//' + window.location.host + '/#/'
  }
})();

const i18n = new VueI18n({
  locale: "zh", // 默认语言
  messages: {
    zh: require("./assets/lang/zh.js"),
    en: require("./assets/lang/en.js"),
    tw: require("./assets/lang/tw.js"),
    jp: require("./assets/lang/jp.js"),
    es: require("./assets/lang/es.js"),
    fr: require("./assets/lang/fr.js"),
    in: require("./assets/lang/in.js"),
    it: require("./assets/lang/it.js"),
    ko: require("./assets/lang/ko.js"),
    ru: require("./assets/lang/ru.js"),
    th: require("./assets/lang/th.js"),
    vn: require("./assets/lang/vn.js"),
  },
  silentTranslationWarn: true,
});

Vue.http.options.headers = {
  "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8"
};
Vue.http.interceptors.push((request, next) => {
  request.body = qs.stringify(request.body, { arrayFormat: 'repeat' })
  request.headers.set("Authorization", localStorage.getItem("TOKEN"));

  next(response => {
    const xAuthToken = response.headers.get("Authorization");
    if (xAuthToken) {
      localStorage.setItem("TOKEN", xAuthToken);
    }
    if (response.status == 500) {
      iView.Message.error(response.body.message);
      return Promise.reject(response);
    }
    if (!response.ok) {
      return Promise.reject(response);
    }
    if (response.data.code == "501") {
      iView.Message.error('请先登录');
      if (router.currentRoute.path !== '/login') {
        router.push("/login").catch(() => { });
        return false;
      }
    }
    return response;
  });
});

function toFloor(number, scale = 8) {
  if (new Number(number) == 0) {
    return 0;
  }
  var __str = number + "";
  if (__str.indexOf("e") > -1 || __str.indexOf("E") > -1) {
    var __num = new Number(number).toFixed(scale + 1),
      __str = __num + "";
    return __str.substring(0, __str.length - 1);
  } else if (__str.indexOf(".") > -1) {
    if (scale == 0) {
      return __str.substring(0, __str.indexOf("."));
    }
    return __str.substring(0, __str.indexOf(".") + scale + 1);
  } else {
    return __str;
  }
}


function isMobile() {
  return /Android|webOS|iPhone|iPod|BlackBerry|iPad|Windows Phone/i.test(navigator.userAgent);
}

function replaceSubdomain(host, mobilePrefix = 'm') {
  if (/^(m)\./.test(host)) {
    return host;
  }
  const match = host.match(/^www\.(.+)$/);
  if (match) {
    if (isMobile()) {
      return mobilePrefix + '.' + match[1];
    } else {
      return 'www.' + match[1];
    }
  }
  return host;
}
function getCodeFromHash() {
  const hash = window.location.hash;
  const hashIndex = hash.indexOf("?");
  if (hashIndex !== -1) {
    const queryString = hash.substring(hashIndex + 1);
    const params = new URLSearchParams(queryString);
    return params.get("code") || '';
  }
  return '';
}
Vue.filter("toFloor", (number, scale) => {
  return toFloor(number, scale);
});
Vue.filter("toFixed", function (number, scale) {
  return new Number(number).toFixed(scale);
});
Vue.prototype.toFloor = toFloor;

iView.LoadingBar.config({
  color: "#F90",
  failedColor: "#f0ad4e",
  height: 2,
});

router.beforeEach((to, from, next) => {
  iView.LoadingBar.start();

  if (to.path === '/' || to.path === '') {
    const ua = navigator.userAgent;
    const isMobile = /Android|webOS|iPhone|iPod|BlackBerry|iPad|Windows Phone/i.test(ua);
    let code = '';
    if (window.location.search) {
      const params = new URLSearchParams(window.location.search);
      code = params.get('code') || '';
    } else {
      code = getCodeFromHash();
    }

    if (isMobile) {
      // 移动端跳转
      if (process.env.NODE_ENV === "development") {
        let url = 'http://localhost:5173/#/';
        if (code) {
          url += '?code=' + encodeURIComponent(code);
        }
        window.location.href = url;
      } else {
        const host = window.location.host;
        let mobilePrefix = 'm';
        const h5Host = replaceSubdomain(host, mobilePrefix);
        let url = window.location.protocol + '//' + h5Host + '/#/';
        if (code) {
          url += '?code=' + encodeURIComponent(code);
        }
        window.location.href = url;
      }
      return;
    } else {
      next();
      return;
    }
  }

  next();
});

router.afterEach((to, from, next) => {
  window.scrollTo(0, 0);
  iView.LoadingBar.finish();
});

new Vue({
  router,
  i18n,
  store,
  render: h => h(App),
}).$mount('#app')