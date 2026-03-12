import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '@/views/user/login.vue'
import Index from '@/views/index/index.vue'
import Market from '@/views/market/index.vue'
import Popular from '@/views/market/popular.vue'
import Recharge from '@/views/assets/recharge.vue'
import forgotPassword from '@/views/user/forgotPassword.vue'
//底部跳转
import About from '@/views/footerJump/about.vue'
import Disclaimer from '@/views/footerJump/disclaimer.vue'
import Privacy from '@/views/footerJump/privacy.vue'
import Agreement from '@/views/footerJump/agreement.vue'
import Fees from '@/views/footerJump/fees.vue'
import Order from '@/views/footerJump/order.vue'
import TradingGuide from '@/views/footerJump/tradingGuide.vue'
import CoinInfo from '@/views/footerJump/coinInfo.vue'


Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Index',
    component: Index
  },
  {
    path: '/forgotpassword',
    name: 'forgotpasswordView',
    component: forgotPassword
  },
  {
    path: '/login',
    name: 'LoginView',
    component: Login
  },
  {
    path: '/market',
    name: 'marketView',
    component: Market
  },
  {
    path: '/recharge',
    name: 'RechargeView',
    component: Recharge
  },
  {
    path: '/market/popular',
    name: 'PopularView',
    component: Popular
  },
  {
    path: '/cards',
    name: 'AccountCards',
    component: () => import('@/views/account/cards.vue')
  },
  {
    path: '/withdraw',
    name: 'withdrawView',
    component: () => import('@/views/assets/withdrawal.vue')
  },
  {
    path: '/invite',
    name: 'AccountInvite',
    component: () => import('@/views/account/invite.vue')
  },
  {
    path: '/assets',
    component: () => import('@/views/assets/PropertyLayout.vue'),
    redirect: '/assets/overview',
    children: [
      {
        path: 'overview',
        name: 'TotalAssets',
        component: () => import('@/views/assets/totalAssets.vue')
      },
      {
        path: 'spot',
        name: 'SpotAccount',
        component: () => import('@/views/assets/fundAccount.vue')
      },
      {
        path: 'contract',
        name: 'ContractAccount',
        component: () => import('@/views/assets/contractAccount.vue')
      },
      {
        path: 'transfer',
        name: 'transferView',
        component: () => import('@/views/assets/transfer.vue')

      },
    ]
  },

  {
    path: '/account',
    component: () => import('@/views/account/accountLayout.vue'),
    redirect: '/assets/overview',
    children: [
      {
        path: 'overview',
        name: 'TotalAssets',
        component: () => import('@/views/account/overview.vue')
      }
    ]
  },

  {
    path: '/assets',
    redirect: '/assets/overview'
  },
  {
    path: '/account/withdrawAddress',
    name: 'WithdrawAddressView',
    component: () => import('@/views/assets/WithdrawAddress.vue')

  },
  {
    path: '/assets/overview',
    name: 'TotalAssets',
    component: () => import('@/views/assets/totalAssets.vue')
  },
  {
    path: '/assets/spot',
    name: 'FundAccount',
    component: () => import('@/views/assets/fundAccount.vue')
  },
  {
    path: '/assets/contract',
    name: 'ContractAccount',
    component: () => import('@/views/assets/contractAccount.vue')
  },
  {
    path: "/swap",
    component: (resolve) => require(["@/views/swap/SwapIndex"], resolve),
  },
  {
    path: "/swap/:pair",
    component: (resolve) => require(["@/views/swap/SwapIndex"], resolve),
    name: "SwapPair",
  },
  {
    path: "/prediction",
    component: (resolve) => require(["@/views/option/Option.vue"], resolve),
    name: "SwapPair",
  },
  {
    path: "/eventContract",
    component: (resolve) => require(["@/views/option/Option_event.vue"], resolve),
    name: "SwapPair",
  },
  {
    path: "/announcement/:id",
    component: (resolve) => require(["@/views/notice/NoticeItem"], resolve),
    name: "NoticeDetail",
  },
  {
    path: "/announcementList/:id",
    component: (resolve) => require(["@/views/notice/NoticeItem_list"], resolve),
    // name: "NoticeDetail",
  },
  {
    path: "/announcementItem/:id",
    component: (resolve) => require(["@/views/notice/NoticeItemItem"], resolve),
    // name: "NoticeDetail",
  },
  {
    path: "/introduce",
    component: (resolve) => require(["@/views/footerJump/introduce"], resolve),
  },

  {
    path: '/about',
    name: 'About',
    component: () => import('@/views/footerJump/about.vue')
  },
  {
    path: '/disclaimer',
    name: 'Disclaimer',
    component: () => import('@/views/footerJump/disclaimer.vue')
  },
  {
    path: '/privacy',
    name: 'Privacy',
    component: () => import('@/views/footerJump/privacy.vue')
  },
  {
    path: '/agreement',
    name: 'Agreement',
    component: () => import('@/views/footerJump/agreement.vue')
  },
  {
    path: '/fees',
    name: 'Fees',
    component: () => import('@/views/footerJump/fees.vue')
  },
  {
    path: '/tradingGuide',
    name: 'TradingGuide',
    component: () => import('@/views/footerJump/tradingGuide.vue')
  },
  {
    path: '/coinInfo',
    name: 'CoinInfo',
    component: () => import('@/views/footerJump/coinInfo.vue')
  },
  //创建工单
  {
    path: '/order',
    name: 'Order',
    component: () => import('@/views/footerJump/order.vue')
  },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location, onResolve, onReject) {
  if (onResolve || onReject) {
    return originalPush.call(this, location, onResolve, onReject)
  }
  return originalPush.call(this, location).catch(err => {
    if (err.name !== 'NavigationDuplicated') {
      throw err
    }
  })
}

const originalReplace = VueRouter.prototype.replace
VueRouter.prototype.replace = function replace(location, onResolve, onReject) {
  if (onResolve || onReject) {
    return originalReplace.call(this, location, onResolve, onReject)
  }
  return originalReplace.call(this, location).catch(err => {
    if (err.name !== 'NavigationDuplicated') {
      throw err
    }
  })
}

export default router