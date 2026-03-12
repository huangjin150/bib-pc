<template>
  <el-dialog :visible="visible" @update:visible="$emit('update:visible', $event)" :show-close="false"
    custom-class="group-dialog" width="720px" append-to-body>
    <div class="group-header">
      <div style="display: flex;align-items: center; gap: 60px;">
        <div class="group-search">
          <img class="search-icon" src="../assets/svg/search.svg" alt="">
          <input class="group-search-input" v-model="groupSearch" placeholder="搜索" />
        </div>
        <div class="group-title">发起群聊</div>
      </div>
      <div class="group-title" v-if="selectedGrouped[0]?.items.length > 0">
        已选择{{ selectedGrouped[0]?.items.length }}个选择人
      </div>
    </div>

    <div style="display:flex; align-items:center; gap:10px; margin: 10px 0 16px 0;">
      <div style="font-size: 14px; color:#333; width: 64px;">群名称</div>
      <el-input v-model="groupName" placeholder="请输入群名称" maxlength="20" style="width: 200px;" />
    </div>

    <div style="display: flex;">
      <div class="group-list">
        <template v-for="(section, sIdx) in groupedFriends">
          <div class="group-item" v-for="f in section.items" @click="toggleSelect(f)" :key="f.uid">
            <span class="select-dot" :class="{ selected: isSelected(f.id) }"></span>
            <img class="avatar" :src="f.avatar" alt="">
            <span class="name">{{ f.name }}</span>
          </div>
        </template>
      </div>
      <div class="group-list">
        <template v-for="(section, sIdx) in selectedGrouped">
          <div class="group-items" v-for="f in section.items" :key="f.uid" @click="toggleSelect(f)">
            <div style="display: flex;align-items: center;">
              <img class="avatar" :src="f.avatar" alt="">
              <span class="name">{{ f.name }}</span>
            </div>
            <div style="display: flex;align-items: center;">
              <img style="width: 20px;height: 20px;" src="../assets/svg/cancel.svg" alt="">
            </div>
          </div>
        </template>
      </div>
    </div>

    <div class="group-footer">
      <el-button @click="handleCancel">取消</el-button>
      <el-button type="success" :disabled="selectedFriendUids.length === 0 || !groupName || !groupName.trim()"
        :loading="loading" @click="handleConfirm">
        完成
      </el-button>
    </div>
  </el-dialog>
</template>

<script>
export default {
  name: 'GroupChatDialog',
  props: {
    visible: { type: Boolean, default: false },
    friendList: { type: Array, default: () => [] },
    loading: { type: Boolean, default: false }
  },
  data() {
    return {
      groupSearch: '',
      selectedFriendUids: [],
      choiceData: [],
      groupName: ''
    }
  },
  computed: {
    filteredFriends() {
      const q = (this.groupSearch || '').trim().toLowerCase();
      if (!q) return this.friendList;
      return this.friendList.filter(f => (f.name || '').toLowerCase().includes(q));
    },
    groupedFriends() {
      const groups = {};
      for (const f of this.filteredFriends) {
        const first = (f.name || '').charAt(0);
        const isAlpha = /^[A-Za-z]$/.test(first);
        const label = isAlpha ? first.toUpperCase() : '#';
        if (!groups[label]) groups[label] = [];
        groups[label].push(f);
      }
      return Object.keys(groups)
        .sort((a, b) => a.localeCompare(b))
        .map(label => ({ label, items: groups[label] }));
    },
    selectedGrouped() {
      const groups = {}
      const selected = Array.isArray(this.choiceData) ? this.choiceData : []
      for (const f of selected) {
        const first = (f.name || '').charAt(0)
        const isAlpha = /^[A-Za-z]$/.test(first)
        const label = isAlpha ? first.toUpperCase() : '#'
        if (!groups[label]) groups[label] = []
        groups[label].push(f)
      }
      const data = Object.keys(groups)
        .sort((a, b) => a.localeCompare(b))
        .map(label => ({ label, items: groups[label] }))
      return data
    }
  },
  watch: {
    visible(val) {
      if (val) {
        this.groupSearch = '';
        this.selectedFriendUids = [];
        this.choiceData = []
        this.groupName = ''

      }
    }
  },
  methods: {
    toggleSelect(item) {
      const uid = String(item.id)
      const objIdx = this.choiceData.findIndex(x => String(x.id) === uid)
      if (objIdx >= 0) {
        this.choiceData.splice(objIdx, 1)
      } else {
        this.choiceData.push(item)
      }
      const uidIdx = this.selectedFriendUids.findIndex(x => String(x) === uid)
      if (uidIdx >= 0) {
        this.selectedFriendUids.splice(uidIdx, 1)
      } else {
        this.selectedFriendUids.push(uid)
      }
    },

    isSelected(uid) {
      return this.selectedFriendUids.includes(String(uid))
    },
    handleCancel() {
      this.$emit('cancel');
      this.$emit('update:visible', false);
    },
    handleConfirm() {
      const name = (this.groupName || '').trim()
      if (this.selectedFriendUids.length === 0 || !name) return;
      this.choiceData = []
      this.$emit('confirm', { uids: this.selectedFriendUids.slice(), groupName: name });
    }
  }
}
</script>

<style scoped lang="scss">
.group-dialog {
  padding: 0;
}

.group-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 50px;
}

.group-title {
  font-size: 14px;
  color: #333;
}

.group-search {
  position: relative;
  width: 320px;
  height: 36px;
}

.search-icon {
  position: absolute;
  left: 10px;
  top: 50%;
  transform: translateY(-50%);
  width: 16px;
  height: 16px;
}

.group-search-input {
  width: 100%;
  height: 100%;
  border: 1px solid #20a053;
  border-radius: 6px;
  padding: 0 12px 0 32px;
  outline: none;
}

.group-search-input:focus {
  box-shadow: 0 0 0 2px rgba(32, 160, 83, 0.15);
}

.group-list {
  max-height: 420px;
  flex: 1;
  overflow-y: auto;
  padding: 0 8px 8px 0;
}

.section-label {
  font-size: 12px;
  color: #999;
  padding: 6px 8px;
}

.group-item {
  display: flex;
  align-items: center;
  height: 42px;
  padding: 0 8px;
  cursor: default;
}

.group-items {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 42px;
  padding: 0 8px;
  cursor: default;
}

.group-items:hover {
  background: #f7f7f7;
}

.group-item:hover {
  background: #f7f7f7;
}

.select-dot {
  width: 16px;
  height: 16px;
  border: 1px solid #ccc;
  border-radius: 50%;
  margin-right: 10px;
  box-sizing: border-box;
  background: #fff;
}

.select-dot.selected {
  border-color: #20a053;
  background: #20a053;
}

.avatar {
  width: 28px;
  height: 28px;
  border-radius: 4px;
  margin-right: 10px;
  object-fit: cover;
}

.name {
  color: #333;
  font-size: 14px;
}

.group-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding: 12px 16px 0 16px;
  border-top: 1px solid #f0f0f0;
}

::v-deep(.el-dialog__header) {
  padding: 0 !important;
}

::v-deep(.el-dialog__body) {
  padding: 20px 20px;
}

::v-deep(.el-dialog) {
  border-radius: 10px;
}
</style>