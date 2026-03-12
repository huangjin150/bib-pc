<template>
    <div style="width: 100%;height: 100%;">

        <div class="chat_box" @click="openDrawer">
            <img style="width: 30px; height: 30px;" src="../assets/images/customerService1.png" alt="">
        </div>

        <div v-if="showDrawer" class="chat-drawer-backdrop" @click.self="closeDrawer">
            <div class="chat-drawer">
                <!-- 操作列表 -->
                <div class="chat_drawer_left">
                    <div style="margin-bottom: 10px;">
                        <img style="width: 35px;height: 35px;border-radius: 5px;" src="../assets/images/user_img.jpg"
                            alt="">
                    </div>
                    <div @click="chatListClick" :class="['chat_drawer_left_operation', { active: showStatus == 1 }]">
                        <i style="font-size: 24px;" class="el-icon-chat-dot-round"></i>
                    </div>
                </div>
                <!-- 好友列表 -->
                <div v-if="showStatus == 1" style="flex: 1; display: flex;">
                    <div class="message-list">
                        <div style="display: flex; width: 100%; align-items: center; justify-content: space-between;gap: 8px
                    ; padding:  30px 15px 15px  15px; box-sizing: border-box; height: 76px;">
                            <div class="search_box">
                                <img style="width: 20px;height: 20px;" src="../assets/svg/search.svg" alt="">
                                <input style="border: none; outline: none;background-color: #eaeaea; width: 100%;"
                                    type="text" v-model="searchQuery" @input="onSearchInput" @focus="onSearchFocus"
                                    @blur="onSearchBlur" @keyup.enter="onSearchEnter">
                                <div v-if="searchOpen && searchResults.length" class="search-dropdown">
                                    <div class="search-item" v-for="s in searchResults" :key="s.id || s.conversationId"
                                        @mousedown.prevent="openChat(s)">
                                        <span class="search-item-name">{{ s.name }}</span>
                                        <span class="search-item-sub">{{ s.lastMessage }}</span>
                                    </div>
                                </div>
                            </div>
                            <el-popover placement="bottom" width="50" trigger="click">
                                <div style="width: 100%;">
                                    <!-- <div @click="startGroupChat" class="operation_box">
                                        <div><img style="width: 15px;height: 15px; margin: 2px 10px 0 2px ;"
                                                src="../assets/svg/startGroupChat.svg" alt="">
                                        </div>
                                        <div>发起群聊</div>
                                    </div> -->
                                    <div @click="addFriendClick" class="operation_box">
                                        <div><img style="width: 20px;height: 20px; margin: 2px 5px 0 0 ;"
                                                src="../assets/svg/addFriend_1.svg" alt="">
                                        </div>
                                        <div>添加好友</div>
                                    </div>
                                </div>
                                <div slot="reference"
                                    style="background-color: #eaeaea; width:30px;height: 30px; display: flex;align-items: center;justify-content: center; border-radius: 5px;">
                                    <img style="width: 20px;height: 20px;" src="../assets/svg/add_img.svg" alt="">
                                </div>
                            </el-popover>
                        </div>
                        <div v-if="messageList.length > 0">
                            <div :class="['message-item', { active: (item.id || item.conversationId) === (currentChat && currentChat.id) }]"
                                v-for="(item, index) in messageList" :key="index" @click="openChat(item)">
                                <div class="avatar-container">
                                    <div class="avatar">
                                        <img :src="item.avatar" alt="">
                                    </div>
                                    <div class="status-dot" v-if="item.status === 'online'"></div>
                                </div>
                                <div class="message-content">
                                    <div class="message-header">
                                        <div class="contact-name">{{ item.name }}</div>
                                        <div class="message-time">{{ formatTimeString(item.lastTime) }}</div>
                                    </div>
                                    <div class="message-prediv">
                                        <div class="message-text">{{ item.lastMessage }}</div>
                                        <div class="unread-badge" v-if="item.unreadCount > 0">
                                            <div class="unread-count">{{ item.unreadCount > 99 ? '99+' :
                                                item.unreadCount }}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div style="height: 70%; display: flex; align-items: center; justify-content: center;" v-else>
                            暂无会话
                        </div>
                    </div>
                    <!-- 聊天内容 -->
                    <div style="flex: 1;background-color: #ededed;">
                        <div v-if="currentChat && currentChat.id" style=" display: flex;flex-direction: column;">
                            <div style=" height: 76px; display: flex;flex-direction: column;">
                                <div class="currentChat_herder">
                                    <div></div>
                                    <div @click="closeClick" class="currentChat_close">
                                        <img style="width: 25px;height: 25px;" src="../assets/svg/add_close.svg" alt="">
                                    </div>
                                </div>

                                <div class="currentChat_herder2">
                                    <div class="currentChat_herder2_name">
                                        {{ currentChat.name }}
                                    </div>
                                </div>
                            </div>
                            <div class="chat_item_box" ref="chatBody">
                                <div v-for="(item, index) in renderMessages">
                                    <div v-if="item.senderMemberId != member.id" class="theOtherParty_class">
                                        <div> <img
                                                style="width: 35px; height: 35px; border-radius: 10px; margin-top: 6px;"
                                                src="../assets/images/user_img.jpg" alt=""></div>
                                        <div class="theOtherParty_class_text"> {{ item.content }}</div>
                                    </div>
                                    <div v-if="item.senderMemberId == member.id" style="position: relative;">
                                        <div class="oneself_class">
                                            <div class="oneself_class_text">
                                                {{ item.content }}
                                            </div>
                                            <div>
                                                <img style="width: 35px; height: 35px; border-radius: 10px; margin-top: 6px;"
                                                    src="../assets/images/user_img.jpg" alt="">
                                            </div>
                                        </div>
                                        <div class="read_status" v-if="index == renderMessages.length - 1">
                                            {{ item.readStatus == 0 ? '已送达' : '已读' }}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="sendMessage">
                                <el-input type="textarea" style="height: 100px;" class="chat-textarea" v-model="input"
                                    placeholder="请输入内容">
                                </el-input>
                                <div
                                    style="display: flex;align-items: center;justify-content: flex-end; padding: 0 15px;">
                                    <el-button style="height: 35px; display: flex;align-items: center;"
                                        :disabled="!input || !input.trim()" @click="sendMessage">
                                        发送
                                    </el-button>
                                </div>
                            </div>
                        </div>
                        <div v-else style=" display: flex;flex-direction: column;">
                            <div style=" height: 76px; display: flex;flex-direction: column;">
                                <div class="currentChat_herder">
                                    <div></div>
                                    <div @click="closeClick" class="currentChat_close">
                                        <img style="width: 25px;height: 25px;" src="../assets/svg/add_close.svg" alt="">
                                    </div>
                                </div>

                                <div class="currentChat_herder2">
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div v-else-if="showStatus == 2" style="flex: 1; display: flex;">
                    <div class="message-list">
                        <div style="padding: 30px 15px 15px 15px;">
                            <div class="search_box">
                                <img style="width: 20px;height: 20px;" src="../assets/svg/search.svg" alt="">
                                <input style="border: none; outline: none;background-color: #eaeaea; width: 100%;"
                                    type="text">
                            </div>
                        </div>
                        <div style="padding: 0  0 5px 15px; color: #000;">
                            联系人
                        </div>
                        <div v-for="(item, index) in friendLists" :key="index" @click="friendDetailsClick(item)">
                            <div
                                :class="['message-item', { active: (item.id || item.memberId || item.uid) === (friendDetails && (friendDetails.id || friendDetails.memberId || friendDetails.uid)) }]">
                                <div class="avatar-container">
                                    <div class="avatar">

                                    </div>
                                </div>
                                <div class="message-content">
                                    <div class="message-header">
                                        <div class="contact-name">{{ item.name }}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <!-- 好友详情 -->
                    <div v-if="friendDetails" style="flex: 1; background-color: #ededed;">
                        <div style=" height: 76px; display: flex;flex-direction: column;">
                            <div class="currentChat_herder">
                                <div></div>
                                <div @click="closeClick" class="currentChat_close">
                                    <img style="width: 25px;height: 25px;" src="../assets/svg/add_close.svg" alt="">
                                </div>
                            </div>
                            <div v-if="friendDetails.name" class="friend_item_box">
                                <div style="display: flex; gap: 20px;">
                                    <div><img
                                            style="width: 60px; height: 60px; border-radius: 5px; margin-top: 4px; border: none;"
                                            :src="friendDetails.avatar" alt="">
                                    </div>
                                    <div>
                                        <div style="color: #000; height: 18px;">{{ friendDetails.name }}</div>
                                        <div style="height: 18px;">昵称 : {{ friendDetails.name }}</div>
                                        <div style="height: 18px;">地区 : {{ friendDetails.address }}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <GroupChatDialog :visible.sync="showGroupDialog" :friendList="friendLists" :loading="groupCreating"
            @confirm="onGroupConfirm" @cancel="onGroupCancel" />
        <AddFriendDialog :visible.sync="showAddFriendDialog" @confirm="onAddFriendConfirm" />
    </div>
</template>

<script>
import TotalAssetsIcon from '@/components/svg/TotalAssetsIcon.vue'
import GroupChatDialog from './GroupChatDialog.vue'
import AddFriendDialog from './AddFriendDialog.vue'
import chatSocket from '@/utils/chatSocket'
import messageListData from '@/config/messageList'
import moment from 'moment'
export default {
    name: 'TotalAssetsDropdown',
    components: {
        TotalAssetsIcon,
        GroupChatDialog,
        AddFriendDialog
    },

    data() {
        return {
            showDrawer: false,
            inputText: '',
            showGroupDialog: false,
            groupCreating: false,
            showAddFriendDialog: false,
            messagesTick: 0,
            member: this.$store.getters.member,
            showStatus: 1,
            messages: [
            ],
            currentChat: {},
            friendDetails: {},
            input: '',
            friendList: '',
            conversationTick: 0,
            searchQuery: '',
            searchOpen: false,
        }
    },
    computed: {
        messageList() {
            void this.conversationTick
            const list = messageListData.getConversationList() || []
            const parse = (t, updatedAt) => {
                if (t == null && updatedAt == null) return 0
                if (typeof t === 'number') return String(t).length === 10 ? t * 1000 : t
                if (typeof t === 'string' && /^\d+$/.test(t)) {
                    const n = Number(t)
                    return t.length === 10 ? n * 1000 : n
                }
                const ms = moment(t).valueOf()
                if (ms) return ms
                return typeof updatedAt === 'number' ? updatedAt : 0
            }
            return [...list].sort((a, b) => parse(b.lastTime, b.updatedAt) - parse(a.lastTime, a.updatedAt))
        },
        searchResults() {
            const q = (this.searchQuery || '').trim().toLowerCase()
            if (!q) return []
            const src = this.messageList || []
            const res = src.filter(i => {
                const name = String(i.name || '').toLowerCase()
                const last = String(i.lastMessage || '').toLowerCase()
                return name.includes(q) || last.includes(q)
            })
            return res.slice(0, 8)
        },
        friendLists() {
            void this.conversationTick
            const list = messageListData.getConversationList() || []
            return list.filter(item => item && Number(item.type) !== 2)
        },
        renderMessages() {
            void this.messagesTick
            const cid = this.currentChat.id
            messageListData.loadConversation(cid)
            if (!cid) return []
            return messageListData.getMessages(cid)
        }
    },
    watch: {
        showDrawer(val) {
            if (val) {
                this.startWebSocket()
                try { document.body.style.overflow = 'hidden'; document.documentElement.style.overflow = 'hidden' } catch (e) { }
            } else {
                this.stopWebSocket()
                try { document.body.style.overflow = ''; document.documentElement.style.overflow = '' } catch (e) { }
            }
            this.$emit('visible-change', val)
        },
        renderMessages() {
            this.$nextTick(() => {
                const el = this.$refs.chatBody
                if (el) el.scrollTop = el.scrollHeight
            })
        }
    },
    methods: {
        startWebSocket(item) {
            try {
                const token = localStorage.getItem('TOKEN') || ''
                const memberId = this.$store.getters.member && this.$store.getters.member.id
                if (!memberId) return
                chatSocket.connect(token).then(() => {
                    chatSocket.subscribe(`/queue/messages/${memberId}`, (msg) => {
                        const data = JSON.parse(msg.body)
                        const payload = data.data
                        const payloadConversationId = data.conversationId || (Array.isArray(payload) ? payload[
                            0]?.conversationId : payload?.conversationId) || (this.currentChat && this.currentChat.id)
                        messageListData.appendMessages(payloadConversationId, payload)
                        messageListData.saveConversation(payloadConversationId)
                        this.messagesTick++
                    })
                    chatSocket.subscribe(`/queue/messageRead/${memberId}`, (msg) => {
                        const data = JSON.parse(msg.body)
                        if (data.data.length > 0) {
                            messageListData.updateMessageReadStatus(item.id, data.data)
                        }
                    })
                }).catch((err) => {
                    console.error('STOMP连接失败:', err)
                })
            } catch (error) {
                console.error('WebSocket连接失败:', error)
            }
        },
        stopWebSocket() {
            try { chatSocket.disconnect() } catch (e) { }
        },


        openDrawer() {
            this.showDrawer = true
            this.$nextTick(() => {
                const el = this.$refs.chatBody
                if (el) el.scrollTop = el.scrollHeight
            })
            this.$emit('open')
        },

        closeDrawer() {
            this.showDrawer = false
            this.$emit('close')
        },

        openChat(item) {
            const id = item.id || item.conversationId
            this.currentChat = Object.assign({}, item, { id })
            this.startWebSocket(this.currentChat)
            this.$nextTick(() => {
                const el = this.$refs.chatBody
                if (el) el.scrollTop = el.scrollHeight
            })
        },

        chatListClick() {
            this.showStatus = 1
        },

        friendListClick() {
            this.showStatus = 2
        },

        friendDetailsClick(item) {
            this.friendDetails = item
        },

        closeClick() {
            this.showDrawer = false
        },

        sendMessage() {
            const memberId = this.$store.getters.member && this.$store.getters.member.id
            console.log('memberId', memberId)
            if (!memberId) return
            chatSocket.send('/app/chatSendMessage', { 'content-type': 'application/json' }, JSON.stringify({
                conversationId: this.currentChat.id,
                senderMemberId: memberId,
                content: this.input,
                msgType: 0,
            }))
            this.input = ''
        },

        readStatusFn() {
            let readData = []
            const messageList = messageListData.getMessages(this.currentChat.id)
            messageList.forEach(item => {
                if (item.senderMemberId != member.id) {
                    if (item.readStatus == 0) {
                        readData.push(item.id)
                    }
                }
            })
            return readData
        },

        // 时间转换
        formatTimeString(timeStr) {
            // 参数校验
            if (!timeStr) return '';

            // 解析时间
            const time = moment(timeStr);
            if (!time.isValid()) return '无效时间';

            const now = moment();
            const diffMs = Math.abs(now.diff(time));
            if (diffMs < 24 * 60 * 60 * 1000) {
                return time.format('HH:mm');
            }
            if (diffMs < 7 * 24 * 60 * 60 * 1000) {
                const weekdays = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];
                return weekdays[time.day()];
            }
            return time.format('M月D日');
        },
        startGroupChat() {
            this.showGroupDialog = true
        },
        async onGroupConfirm(payload) {
            const selectedUids = payload && payload.uids
            const groupName = payload && payload.groupName
            if (!selectedUids || selectedUids.length === 0) return
            if (!groupName || !String(groupName).trim()) {
                this.$message.error('请输入群名称')
                return
            }
            this.groupCreating = true

            const data = {
                groupName: String(groupName).trim(),
                creatorId: this.member.id,
                memberIds: selectedUids,
            }
            this.$http.post(this.host + "/chat/group/create", data).then(response => {
                var resp = response.body;
                this.$message.success(`群聊创建成功：${groupName}（${selectedUids.length}人）`)
            }).catch(() => {
                this.$message.error('群聊创建失败')
            }).finally(() => {
                this.groupCreating = false
                this.showGroupDialog = false
            })
        },
        onGroupCancel() {
            this.showGroupDialog = false
        },
        addFriendClick() {
            this.showAddFriendDialog = true
        },
        onAddFriendConfirm(user) {
            this.showAddFriendDialog = false
            this.showStatus = 1
            this.showDrawer = true
            const list = messageListData.getConversationList() || []
            const targetId = user.conversationId || user.id || user.memberId || user.uid
            let conv = list.find(i => (i.id || i.conversationId) == targetId)
            if (!conv && user.memberId) {
                conv = list.find(i => (i.memberId == user.memberId) || (i.contactMemberId == user.memberId))
            }
            if (!conv && (user.memberName || user.name)) {
                const nm = user.memberName || user.name
                conv = list.find(i => (i.name || i.memberName) === nm)
            }
            if (conv) {
                this.openChat(conv)
            } else {
                const tmpId = user.conversationId || user.memberId || Date.now()
                this.currentChat = { id: tmpId, name: user.memberName || user.name || '', avatar: user.memberAvatar || user.avatar || '' }
                this.$nextTick(() => {
                    const el = this.$refs.chatBody
                    if (el) el.scrollTop = el.scrollHeight
                })
            }
        },
        onSearchInput() {
            this.searchOpen = !!(this.searchQuery && this.searchQuery.trim())
        },
        onSearchFocus() {
            if (this.searchQuery && this.searchQuery.trim()) this.searchOpen = true
        },
        onSearchBlur() {
            setTimeout(() => { this.searchOpen = false }, 80)
        },
        onSearchEnter() {
            if (this.searchResults.length) this.openChat(this.searchResults[0])
            this.searchOpen = false
        },
    },
    beforeDestroy() {
        this.stopWebSocket()
        try { document.body.style.overflow = ''; document.documentElement.style.overflow = '' } catch (e) { }
    }
}
</script>

<style scoped lang="scss">
.chat_box {
    position: fixed;
    bottom: 110px;
    right: 30px;
    width: 60px;
    height: 60px;
    background-color: #CBF439;
    border-radius: 50%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
    transition: all 0.3s ease;
    z-index: 100;
    color: white;
}

.chat-drawer-backdrop {
    width: 100%;
    height: 100%;
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.35);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 200;
    overscroll-behavior: contain;

    .chat-drawer {
        width: 950px;
        max-width: 90vw;
        height: 640px;
        max-height: 90vh;
        background: #fff;
        border-radius: 16px;
        box-shadow: 0 16px 60px rgba(0, 0, 0, 0.25);
        overflow: hidden;
        display: flex;
        z-index: 10000;

        .chat_drawer_left {
            width: 6%;
            display: flex;
            flex-direction: column;
            align-items: center;
            background-color: #e8e7e7;
            height: 100%;
            padding: 26px 20px 0 20px;
        }

        .message-list {
            width: 30%;
            height: 100%;
            overflow-y: auto;
            border-right: 1px solid #d0cfcf;
            background-color: #f7f7f7;

            .search_box {
                flex: 1;
                padding: 5px;
                display: flex;
                align-items: center;
                background-color: #eaeaea;
                border-radius: 5px;
                position: relative;
            }

            .message-item {
                display: flex;
                align-items: center;
                padding: 10px;
                box-sizing: border-box;
                cursor: default;


                &:hover {
                    background-color: #dedede;
                }

                &.active {
                    background-color: #dedede;
                }

                .avatar-container {
                    position: relative;
                    margin-right: 10px;

                    .avatar {
                        background-color: #eee;
                        width: 40px;
                        height: 40px;
                        border-radius: 10px;
                    }

                    .status-dot {
                        position: absolute;
                        bottom: 2px;
                        right: 2px;
                        width: 10px;
                        height: 10px;
                        background-color: #4CAF50;
                        border-radius: 50%;
                        border: 1px solid #fff;
                    }
                }

                .message-content {
                    flex: 0.9;

                    .message-header {
                        display: flex;
                        align-items: center;
                        justify-content: space-between;

                        .contact-name {
                            width: 140px;
                            white-space: nowrap;
                            overflow: hidden;
                            text-overflow: ellipsis;
                            font-size: 14px;
                            font-weight: 700;
                            color: #333;
                        }

                        .message-time {
                            font-size: 12px;
                            color: #999;
                        }
                    }

                    .message-prediv {
                        display: flex;
                        align-items: center;
                        justify-content: space-between;

                        .message-text {
                            width: 180px;
                            font-size: 12px;
                            color: #a2a2a2;
                            white-space: nowrap;
                            overflow: hidden;
                            text-overflow: ellipsis;
                        }

                        .unread-badge {
                            background-color: #ff4444;
                            border-radius: 10px;
                            min-width: 18px;
                            height: 18px;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            padding: 0 5px;

                            .unread-count {
                                font-size: 14px;
                                color: #fff;
                            }
                        }
                    }
                }
            }
        }
    }

    .currentChat_herder {
        display: flex;
        align-items: center;
        justify-content: space-between;

        .currentChat_close {
            padding: 8px;

            &:hover {
                background-color: #dedede;
            }
        }
    }

    .currentChat_herder2 {
        flex: 1;
        padding: 0 0 13px 20px;
        border-bottom: 1px solid #d5d5d5;

        .currentChat_herder2_name {
            font-size: 16px;
            color: #000;
        }
    }
}

.message-list ::v-deep .el-popover {
    min-width: 80px !important;
    padding: 6px !important;
}

.operation_box {
    display: flex;
    align-items: center;
    cursor: default;
    padding: 3px 5px;
    border-radius: 5px;

    &:hover {
        background-color: #dedede;
    }
}

.chat_drawer_left_operation {
    padding: 8px;

    &:hover {
        background-color: #dcdbdb;
    }

    &.active {
        background-color: #d6d5d5;
        color: #fff;
        border-radius: 5px;
    }
}

.friend_item_box {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-top: 30px;
}

.chat_item_box {
    padding: 15px;
    height: 420px;
    overflow-y: auto;

    .theOtherParty_class {
        display: flex;
        justify-content: start;
        margin-bottom: 10px;

        .theOtherParty_class_text {
            position: relative;
            display: inline-block;
            padding: 4px 8px;
            max-width: 72%;
            background: #ffffff;
            border: 1px solid #e5e7eb;
            margin-left: 10px;
            border-radius: 10px;
            color: #111827;
            display: flex;
            align-items: center;
        }

        .theOtherParty_class_text::before {
            content: '';
            position: absolute;
            left: -8px;
            top: 12px;
            width: 0;
            height: 0;
            border-right: 8px solid #ffffff;
            border-top: 8px solid transparent;
            border-bottom: 8px solid transparent;
        }

        .theOtherParty_class_text::after {
            content: '';
            position: absolute;
            left: -9px;
            top: 12px;
            width: 0;
            height: 0;
            border-right: 9px solid #e5e7eb;
            border-top: 9px solid transparent;
            border-bottom: 9px solid transparent;
            z-index: -1;
        }

    }


    .oneself_class {
        display: flex;
        justify-content: flex-end;
        margin-bottom: 10px;

        .oneself_class_text {
            position: relative;
            display: inline-block;
            padding: 6px 12px;
            max-width: 72%;
            background: #ffffff;
            border: 1px solid #e5e7eb;
            margin-right: 10px;
            border-radius: 10px;
            color: #111827;
            display: flex;
            align-items: center;
        }

        .oneself_class_text::before {
            content: '';
            position: absolute;
            right: -8px;
            top: 12px;
            width: 0;
            height: 0;
            border-left: 8px solid #ffffff;
            border-top: 8px solid transparent;
            border-bottom: 8px solid transparent;
        }

        .oneself_class_text::after {
            content: '';
            position: absolute;
            right: -9px;
            top: 12px;
            width: 0;
            height: 0;
            border-left: 9px solid #e5e7eb;
            border-top: 9px solid transparent;
            border-bottom: 9px solid transparent;
            z-index: -1;
        }
    }
}

.read_status {
    display: flex;
    justify-content: flex-end;
    padding: 0 50px;
    position: absolute;
    right: 0;
    top: 48px;
    color: #919090;
}

.sendMessage {
    flex: 1;
    border-top: 1px solid #d5d5d5;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
}

.chat-textarea ::v-deep .el-textarea__inner {
    min-height: 80px !important;
    border: none !important;
    box-shadow: none !important;
    outline: none !important;
    background-color: transparent;
    resize: none;

}

.chat-textarea ::v-deep .el-textarea__inner:focus,
.chat-textarea ::v-deep .el-textarea__inner:hover {
    border: none !important;
    box-shadow: none !important;
    outline: none !important;
}

::v-deep .is-disabled {
    background-color: #e1e1e1 !important;
}

::v-deep .el-button {
    background-color: #07c160;
    color: #fff;
    border-radius: 5px;
}

.search-dropdown {
    position: absolute;
    left: 0;
    right: 0;
    top: 36px;
    background: #fff;
    border: 1px solid #e5e7eb;
    border-radius: 6px;
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
    z-index: 10;
}

.search-item {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 8px 10px;
    cursor: default;
}

.search-item:hover {
    background: #f7f7f7;
}

.search-item-name {
    color: #111827;
}

.search-item-sub {
    color: #9ca3af;
    font-size: 12px;
}
</style>
