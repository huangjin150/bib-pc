<template>
  <el-dialog :visible="visible" @update:visible="$emit('update:visible', $event)" :show-close="true" width="420px"
    append-to-body custom-class="add-friend-dialog">
    <div class="af-header">添加朋友</div>

    <div class="af-search-row">
      <el-select v-model="searchType" style="width: 120px; margin-right: 10px;">
        <el-option label="用户名" value="1" />
        <el-option label="邮箱" value="2" />
      </el-select>
      <div style="display: flex;align-items: center;margin-top: 10px;">
        <div class="af-search-input-wrap">
          <img class="af-search-icon" src="../assets/svg/search.svg" alt="">
          <input class="af-search-input" v-model="query" :placeholder="searchPlaceholder" @keyup.enter="onSearch" />
        </div>
        <div style="display: flex;justify-content: center;">
          <el-button type="success" :disabled="!isQueryValid" :loading="searching" @click="onSearch">
            搜索
          </el-button>
        </div>
      </div>
    </div>

    <div class="af-results" v-if="results.memberName">
      <div>
        <div class="af-result-item">
          <img class="af-avatar" :src="results.memberAvatar" alt="">
          <div class="af-info">
            <div class="af-name">{{ results.memberName }}</div>
          </div>
          <el-button size="mini" @click="sendRequest(results)">
            发送消息
          </el-button>
        </div>
      </div>
    </div>
  </el-dialog>
</template>

<script>
export default {
  name: 'AddFriendDialog',
  props: {
    visible: { type: Boolean, default: false }
  },
  data() {
    return {
      query: '',
      searching: false,
      searched: {},
      results: {},
      sendingUid: '',
      searchType: '1'
    }
  },
  computed: {
    searchPlaceholder() {
      return this.searchType === '1' ? '输入用户名' : '输入邮箱'
    },
    isQueryValid() {
      const q = (this.query || '').trim()
      if (!q) return false
      return this.searchType == '2' ? this.isEmail(q) : true
    }
  },
  watch: {
    visible(val) {
      if (val) {
        // 打开时重置状态
        this.query = ''
        this.searching = false
        this.searched = false
        this.results = {}
        this.sendingUid = ''
      }
    }
  },
  methods: {
    isEmail(v) {
      return /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(String(v).trim())
    },
    onSearch() {
      if (!this.isQueryValid) return
      this.searching = true
      this.searched = true
      const datas = {
        keywordType: this.searchType,
        keyword: this.query
      }
      this.$http.get(this.host + "/chat/group/search", { params: datas }).then(response => {
        var resp = response.body;
        if (resp.code == 200) {
          this.results = resp.data
        } else if (resp.code == 601) {
          this.$message.error(resp.msg)
        }
      }).catch(() => {
        this.$message.error(resp.msg)
      }).finally(() => {
        this.searching = false
      })

    },
    sendRequest(user) {
      const payload = user || this.results || {}
      this.$emit('confirm', payload)
      this.$emit('update:visible', false)
      this.query = ''
      this.searching = false
      this.searched = false
      this.results = {}
      this.sendingUid = ''
    }
  }
}
</script>

<style scoped lang="scss">
.add-friend-dialog {
  padding: 0;
}

.af-header {
  text-align: center;
  font-size: 16px;
  color: #333;
  padding-top: 6px;
  margin-bottom: 8px;
}

.af-search-row {

  padding: 8px 16px 0 16px;
}

.af-search-input-wrap {
  width: 100%;
  flex: 1;
  position: relative;
  height: 40px;
  margin-right: 10px;
}

.af-search-icon {
  position: absolute;
  left: 10px;
  top: 50%;
  transform: translateY(-50%);
  width: 16px;
  height: 16px;
}

.af-search-input {
  width: 100%;
  height: 100%;
  border: 1px solid #20a053;
  border-radius: 6px;
  padding: 0 12px 0 32px;
  outline: none;
  background-color: #fff;
}

.af-search-input:focus {
  box-shadow: 0 0 0 2px rgba(32, 160, 83, 0.15);
}

.af-results {
  padding: 12px 16px 16px 16px;
  max-height: 360px;
  overflow-y: auto;
}

.af-empty {
  color: #999;
  font-size: 13px;
}

.af-result-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 0;
  border-bottom: 1px solid #f0f0f0;
}

.af-avatar {
  width: 36px;
  height: 36px;
  border-radius: 6px;
  object-fit: cover;
}

.af-info {
  flex: 1;
}

.af-name {
  color: #333;
  font-size: 14px;
  line-height: 18px;
}

.af-id {
  color: #888;
  font-size: 12px;
  line-height: 16px;
}

::v-deep(.el-dialog__header) {
  padding: 0 !important;
}

::v-deep(.el-dialog) {
  border-radius: 10px;
}

::v-deep(.el-dialog__body) {
  padding: 20px;
}
</style>