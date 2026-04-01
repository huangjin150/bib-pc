<template>
  <div id="app">
    <TopNavbar v-if="!isRedirecting" />
    <router-view />
    <Footer v-if="!isRedirecting" />
  </div>
</template>

<script>
import TopNavbar from './components/TopNavbar.vue'
import Footer from './components/Footer.vue'
import chatSocket from '@/utils/chatSocket'
import messageListData from '@/config/messageList'


export default {
  name: 'App',
  components: {
    TopNavbar,
    Footer
  },
  data() {
    return {
      isRedirecting: false
    }
  },
  created: function () {
    const token = localStorage.getItem('TOKEN') || ''
    const memberId = this.$store.getters.member && this.$store.getters.member.id
    if (token && memberId) {
      chatSocket.connect(token).then(() => {
        chatSocket.subscribe(`/queue/conversationList/${memberId}`, (msg) => {
          const data = JSON.parse(msg.body)
          console.log('data1111', data)
          messageListData.setConversationList(data.data)
          messageListData.saveConversationList()
        })
        chatSocket.send('/app/conversationList', { 'content-type': 'application/json' }, { pageSize: 20 })
      })
    }
    const ua = navigator.userAgent;
    const isMobile = /Android|webOS|iPhone|iPod|BlackBerry|iPad|Windows Phone/i.test(ua);
    if (isMobile) {
      this.isRedirecting = true;
    }

    this.initialize();
  },
  watch: {
    // '$route'(to, from) {
    //   c
    //   this.isRedirecting = to.path === '/';
    // }
  },
  methods: {
    initialize() {
      this.$store.commit("navigate", "nav-index");
      this.$store.commit("recoveryMember");
      this.$store.commit("initLang");
      this.$store.commit("initLoginTimes");
      this.checkLogin();
    },
    checkLogin() {
      this.$http.post(this.host + "/check/login", {}).then(response => {
        var result = response.body;
        if (result.code == 0 && result.data == false) {
          this.$store.commit("setMember", null);
          this.$store.commit("setToken", null);
        }
      });
    },
  }
}
</script>

<style lang="scss">
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
    'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
    sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  transition: all 0.3s;
}

body.dark-theme {
  background: #1a1a1a;
  color: white;
}

#app {
  min-height: 100vh;
}


a {
  color: inherit;
  text-decoration: none;
}

button {
  font-family: inherit;
}

input,
textarea {
  font-family: inherit;
}

.btn {
  cursor: pointer;
  transition-property: all;
  transition-timing-function: cubic-bezier(.4, 0, .2, 1);
  transition-duration: .15s;
}

.flex {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.flex_center {
  display: flex;
  align-items: center;
  justify-content: center;
}

.flex_between {
  display: flex;
  justify-content: space-between;

}

.flex_alicenter {
  display: flex;
  align-items: center;
}

.container {
  margin-left: auto;
  margin-right: auto;
  max-width: 1272px;
  width: 100%;
}

.bg-main-color {
  background-color: rgba(208, 245, 0)
}

.text-main-color {
  color: rgba(208, 245, 0);
}

::-webkit-scrollbar {
  width: 0px;
  background: transparent;
}

::-webkit-scrollbar-thumb {
  background: #333;
}



::v-deep(.ivu-modal-content) {
  border-radius: 16px !important;
}
</style>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

* {
  font-size: 14px;
}
</style>
