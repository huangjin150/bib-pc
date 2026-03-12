export default {
    common: {
        area: '/support/country'
    },
    uc: { //会员中心接口
        login: '/login',
        register: '/register',
        wallet: '/asset/wallet/',
        captcha: '/start/captcha',
        FundNewPassword: '/approve/update/transaction/password',//修改资金密码
        FundPassword: '/approve/transaction/password',//设置资金密码
        identification: '/approve/certified/business/status', //商家认证
        apply: '/approve/certified/business/apply', //商家认证申请
        announcement: '/announcement/page', //公告列表
        paydividends: "/bonus/user/page", //持币分红
        mylistrecord: "/mine/detail/", //交易挖矿详情
        activitylist: "/activity/page-query", // 活动列表
        memberactivity: "/activity/getmemberrecords", // 用户参与活动列表
        attendActivity: "/activity/attend", // 参与活动
        mypromotion: "/promotion/mypromotion", // 我的推广佣金
        toppromotion: "/promotion/toprank", // 推广合伙人排行
        getfreecard: "/promotion/promotioncard/getfreecard", // 获取免费推广卡
        exchangecard: "/gas_fee_card/exchangecard", // 兑换推广卡
        mycardlist: "/gas_fee_card/list", // 兑换推广卡
        toppromotionmonth: "/promotion/monthtoprank", // 推广合伙人排行
        toppromotionweek: "/promotion/weektoprank", // 推广合伙人排行
        memberInfo: "/member/my-info", // 获取用户信息
        mypromotionrecord: "/promotion/record", //获取推广邀请人记录
        myInnovationOrderList: "/activity/getmyorders", // 创新实验区参与订单列表
        myInnovationMinings: "/miningorder/my-minings", // 获取我的矿机列表
        myInnovationLocked: "/lockedorder/my-locked",// 获取我的矿机列表
        rakeBack: "/promotion/rakeBack",//手续费返还设置
    },
    market: { //币币交易行情接口
        ws: '/swap-ws',
        newws: "/ws",
        thumb: '/market/symbol-thumb',
        thumbTrend: '/symbol-thumb-trend',
        plate: '/market/exchange-plate', //主动查询的盘口信息
        platemini: '/market/exchange-plate-mini', //获取10条数据
        platefull: '/market/exchange-plate-full', //获取所有数据
        trade: '/market/latest-trade', //主动查询的实时成交信息
        symbolInfo: '/market/symbol-info',
        coinInfo: '/market/coin-info',
        indexData: "/market/index_info"
    },
    swap: {
        ws: '/swap-ws',
        thumb: '/symbol-thumb',
        plate: '/exchange-plate', //主动查询的盘口信息
        platemini: '/exchange-plate-mini', //获取10条数据
        platefull: '/exchange-plate-full', //获取所有数据
        trade: '/latest-trade', //主动查询的实时成交信息
        symbolInfo: '/symbol-info', // 交易对信息
        coinInfo: '/coin/coin-info', // 合约交易对信息
        contractWallet: '/wallet/detail', // 用户合约钱包账户信息
        modifyLeverage: '/order/modify-leverage', // 修改杠杆
        setOrderProfitAndLoss: '/order/profit-loss', // 设置止盈止损
        canSwitchPattern: '/order/can-switch-pattern', // 是否能修改仓位模式
        switchPattern: '/order/switch-pattern', // 修改仓位模式
        open: '/order/open', // 开仓
        close: '/order/close', // 平仓
        cancel: '/order/cancel', // 撤销
        getEntrustList: '/order/current', // 当前委托
        getHistoryEntrustList: '/order/history', // 历史委托
        getCurrentOrderList: '/order/holders', // 当前持仓
        getHistoryOrderList: '/order/holders/history' // 历史持仓
    },
    option: {
        ws: '/option/option-ws',
        thumb: '/option/symbol-thumb',
    },
    exchange: { //币币交易委托提交与查询接口
        orderAdd: '/exchange/order/add', //提交订单接口
        current: '/exchange/order/current', //当前委托接口
        history: '/exchange/order/history', //历史委托接口
        detail: '/exchange/order/detail/', //详细订单接口
        favorFind: '/favor/find', //查询自选
        favorAdd: '/favor/add', //添加自选
        favorDelete: '/favor/delete', //删除自选
        orderCancel: '/exchange/order/cancel' //取消委托
    },
    otc: {
        coin: '/otc/coin/all', //查询支持的币种
        advertise: '/otc/advertise/page-by-unit', //获取广告
        createAd: '/ad/create', //创建广告
        adDetail: '/otc/advertise/detail'
    },
    activity: {
        activity: "/activity/page-query"
    }
}
