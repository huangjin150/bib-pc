import Vue from 'vue';
import Vuex from 'vuex';
Vue.use(Vuex);
export default new Vuex.Store({
    state: {
        member: null,
        token: null,
        activeNav: '',
        lang: '',
        exchangeSkin: 'night',
        loginTimes: null,
        setting: '',
        isDarkTheme: false,
    },
    mutations: {
        navigate(state, nav) {
            state.activeNav = nav;
        },
        setMember(state, member) {
            state.member = member;
            localStorage.setItem('MEMBER', JSON.stringify(member));
        },
        setToken(state, token) {
            state.token = token;
            localStorage.setItem('TOKEN', token);
        },
        recoveryMember(state) {
            state.member = JSON.parse(localStorage.getItem('MEMBER'));
        },
        setlang(state, lang) {
            state.lang = lang;
            localStorage.setItem('LANGUAGE', JSON.stringify(lang));
        },
        initLang(state) {
            if (localStorage.getItem('LANGUAGE') == null) {
                state.lang = "简体中文";
            } else {
                state.lang = JSON.parse(localStorage.getItem('LANGUAGE'));
            }
        },
        initLoginTimes(state) {
            if (localStorage.getItem("LOGINTIMES") == null) {
                state.loginTimes = 0;
            } else {
                state.loginTimes = JSON.parse(localStorage.getItem('LOGINTIMES'));
            }
        },
        setSetting(state, memberInfo) {
            state.setting = memberInfo;
        },
        setLoginTimes(state, times) {
            state.loginTimes = times;
            localStorage.setItem('LOGINTIMES', JSON.stringify(times));
        },
        setSkin(state, skin) {
            state.exchangeSkin = skin;
        },
        setTheme(state, isDark) {
            state.isDarkTheme = isDark;
            localStorage.setItem('THEME', JSON.stringify(isDark));
            if (isDark) {
                document.body.classList.add('dark-theme');
            } else {
                document.body.classList.remove('dark-theme');
            }
        },

        initTheme(state) {
            const savedTheme = localStorage.getItem('THEME');
            if (savedTheme !== null) {
                state.isDarkTheme = JSON.parse(savedTheme);
            } else {
                state.isDarkTheme = false;
            }
            if (state.isDarkTheme) {
                document.body.classList.add('dark-theme');
            }
        },

        toggleTheme(state) {
            state.isDarkTheme = !state.isDarkTheme;
            localStorage.setItem('THEME', JSON.stringify(state.isDarkTheme));
            document.body.classList.toggle('dark-theme', state.isDarkTheme);
        }
    },
    getters: {
        member(state) {
            return state.member;
        },
        isLogin(state) {
            return state.member != null;
        },
        lang(state) {
            return state.lang;
        },
        loginTimes(state) {
            return state.loginTimes;
        },
        isDarkTheme(state) {
            return state.isDarkTheme;
        },

        themeClass(state) {
            return state.isDarkTheme ? 'dark-theme' : 'light-theme';
        }
    }
});
