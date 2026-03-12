<template>
    <div>
        <div class="floating-button" @click="togglePopup" v-show="!isVisible">
            <img style="width: 30px; height: 30px;" src="../assets/svg/chat.svg" alt="">
        </div>

        <div v-if="isVisible" class="modal-mask" @click="closeClick">
            <div class="modal-content" @click.stop>
                <div class="leverage-popup">
                    <div class="leverage-popup-top">
                        <div class="leverage-popup-title">
                            客服
                        </div>
                        <div @click="closeClick" class="close-btn">
                            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" stroke-width="2"
                                    stroke-linecap="round" stroke-linejoin="round" />
                            </svg>
                        </div>
                    </div>

                    <div class="leverage-popup-info" ref="messageList" @scroll="handleScroll">
                        <div v-for="item in OrderList" :key="item.id" class="order-card">
                            <div class="my-workorder-box">
                                <div class="my-workorder">
                                    <div class="" v-if="item.attachments">
                                        <img @click="viewAttachment(item.attachments)" class="attachment-img"
                                            :src="item.attachments" />
                                    </div>
                                    <div class="my-workorder-text">
                                        {{ item.questionDescription }}
                                    </div>
                                    <div class="my-workorder-time">
                                        {{ formattedDate(item.createTime) }}
                                    </div>
                                </div>
                            </div>
                            <div v-if="item.replyContent" class="order-item">
                                <div class="">
                                    <div class="value reply">{{ item.replyContent }}</div>
                                    <div class="reply-time">{{ formattedDate(item.replyTime) }}</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="image-preview-box" v-if="form.frontImage">
                        <div class="image-preview">
                            <img :src="form.frontImage" class="preview-image" />
                            <div class="delete-icon" @click="deleteFront">×</div>
                        </div>
                    </div>

                    <div class="form-input-box">
                        <div class="form-input">
                            <div class="select-wrapper">
                                <select v-model="form.WorkerOrderValue" class="custom-select">
                                    <option value="">请选择</option>
                                    <option v-for="item in recordType" :key="item.value" :value="item.value">
                                        {{ item.text }}
                                    </option>
                                </select>
                            </div>
                            <div class="input-class">
                                <input class="input-class-input" type="text" placeholder="输入一条消息....."
                                    v-model="form.workOrder" @keyup.enter="submitClick" />
                            </div>
                            <div class="action-buttons">
                                <div class="addImage" @click="selectFront">
                                    <svg class="add-icon" viewBox="0 0 24 24" fill="none"
                                        xmlns="http://www.w3.org/2000/svg">
                                        <path d="M12 5V19M5 12H19" stroke="currentColor" stroke-width="2"
                                            stroke-linecap="round" stroke-linejoin="round" />
                                    </svg>
                                </div>
                                <div class="send-wrapper">
                                    <div class="sending_btn1" v-if="form.workOrder == ''" type="default">
                                        <div class="icon-container">
                                            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M22 2L11 13M22 2L15 22L11 13M22 2L2 9L11 13" stroke="#ccc"
                                                    stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                                            </svg>
                                        </div>
                                    </div>
                                    <div @click="submitClick" class="sending_btn" v-else>
                                        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M22 2L11 13M22 2L15 22L11 13M22 2L2 9L11 13" stroke="#000"
                                                stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                                        </svg>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import moment from 'moment';

export default {
    name: 'CustomerServicePop',
    data() {
        return {
            isVisible: false,
            OrderList: [],
            page: 1,
            pageSize: 10,
            total: 0,
            isLoading: false,
            hasMore: true,
            form: {
                WorkerOrderValue: '',
                workOrder: '',
                frontImage: '',
            },
            iconColor: '#fff',
            timer: null,
            recordType: [{
                value: '充值',
                text: '充值'
            },
            {
                value: '提现',
                text: '提现'
            },
            {
                value: '合约',
                text: '合约'
            },
            {
                value: '预测合约',
                text: '预测合约'
            },
            {
                value: '其他',
                text: '其他'
            }
            ]
        }
    },
    watch: {
        isVisible(newVal) {
            if (newVal) {
                this.initData();
                this.startTimer();
                document.body.style.overflow = 'hidden';
            } else {
                this.stopTimer();
                document.body.style.overflow = 'auto';
            }
        }
    },
    methods: {
        formattedDate(time) {
            return moment(time).format("YYYY-MM-DD HH:mm:ss");
        },

        togglePopup() {
            this.isVisible = !this.isVisible;
        },

        initData() {
            this.page = 1;
            this.OrderList = [];
            this.hasMore = true;
            this.GetOrderList(false);
        },

        handleScroll(event) {
            const element = event.target;
            if (element.scrollTop <= 5 && !this.isLoading && this.hasMore) {
                this.onScrollToTop();
            }
        },

        onScrollToTop() {
            this.loadMoreMessages();
        },

        loadMoreMessages() {
            if (this.isLoading || !this.hasMore) {
                return;
            }
            this.page++;
            this.GetOrderList(true);
        },

        async GetOrderList(isLoadMore = false) {
            if (this.isLoading) return;

            this.isLoading = true;

            try {
                const data = {
                    pageNum: this.page,
                    pageSize: this.pageSize,
                };

                let oldScrollHeight = 0;
                let oldScrollTop = 0;
                if (isLoadMore) {
                    const messageList = this.$refs.messageList;
                    if (messageList) {
                        oldScrollHeight = messageList.scrollHeight;
                        oldScrollTop = messageList.scrollTop;
                    }
                }

                this.$http.post(this.host + "/workOrder/getListByUserId", data).then(response => {
                    var resp = response.body;
                    if (resp.code == 200) {
                        const newData = resp.rows || [];

                        if (isLoadMore) {
                            this.OrderList = [...newData.reverse(), ...this.OrderList];

                            this.$nextTick(() => {
                                const messageList = this.$refs.messageList;
                                if (messageList) {
                                    const newScrollHeight = messageList.scrollHeight;
                                    messageList.scrollTop = oldScrollTop + (newScrollHeight - oldScrollHeight);
                                }
                            });
                        } else {
                            this.OrderList = newData.reverse();

                            this.$nextTick(() => {
                                this.scrollToBottom();
                            });
                        }

                        this.total = resp.total;

                        this.hasMore = this.OrderList.length < this.total;

                    } else if (resp.code != 501) {
                        this.$Message.error(resp.message);
                    }

                    this.isLoading = false;
                }).catch(error => {
                    console.error('获取工单列表失败:', error);
                    this.isLoading = false;
                });
            } catch (error) {
                console.error('获取工单列表失败:', error);
                this.isLoading = false;
            }
        },

        scrollToBottom() {
            this.$nextTick(() => {
                const messageList = this.$refs.messageList;
                if (messageList) {
                    messageList.scrollTop = messageList.scrollHeight;
                }
            })
        },

        viewAttachment(url) {
            if (url) {
                window.open(url, '_blank');
            }
        },

        selectFront() {
            const input = document.createElement('input');
            input.type = 'file';
            input.accept = 'image/*';
            input.onchange = (e) => {
                const file = e.target.files[0];
                if (file) {
                    const reader = new FileReader();
                    reader.onload = (e) => {
                        this.form.frontImage = e.target.result;
                    };
                    reader.readAsDataURL(file);
                }
            };
            input.click();
        },

        closeClick() {
            this.isVisible = false;
        },

        deleteFront() {
            this.form.frontImage = '';
        },

        clearform() {
            this.form.WorkerOrderValue = '';
            this.form.workOrder = '';
            this.form.frontImage = '';
        },

        startTimer() {
            if (this.timer) {
                clearInterval(this.timer);
            }
            this.timer = setInterval(() => {
                this.refreshLatestData();
            }, 30000);
        },

        refreshLatestData() {
            if (this.isLoading) return;

            const data = {
                pageNum: 1,
                pageSize: this.pageSize,
            };

            this.$http.post(this.host + "/workOrder/getListByUserId", data).then(response => {
                var resp = response.body;
                if (resp.code == 200) {
                    const latestData = resp.rows || [];
                    if (latestData.length > 0) {
                        const latestId = latestData[0].id;
                        const currentLatestId = this.OrderList.length > 0 ? this.OrderList[this.OrderList.length - 1].id : null;

                        if (latestId !== currentLatestId) {
                            const newMessages = latestData.filter(item => {
                                return !this.OrderList.some(existing => existing.id === item.id);
                            });

                            if (newMessages.length > 0) {
                                this.OrderList = [...this.OrderList, ...newMessages.reverse()];
                                this.$nextTick(() => {
                                    this.scrollToBottom();
                                });
                            }
                        }
                    }
                }
            }).catch(error => {
                console.error('刷新数据失败:', error);
            });
        },

        stopTimer() {
            if (this.timer) {
                clearInterval(this.timer);
                this.timer = null;
            }
        },

        async submitClick() {
            if (!this.form.WorkerOrderValue) {
                this.$Message.error("请选择问题类型");
                return;
            }
            if (!this.form.workOrder) {
                this.$Message.error("请输入问题描述");
                return;
            }

            const data = {
                questionType: this.form.WorkerOrderValue,
                questionDescription: this.form.workOrder,
                attachments: this.form.frontImage
            };

            try {
                this.$http.post(this.host + "/workOrder/workOrderSubmit", data).then(response => {
                    var resp = response.body;
                    if (resp.code == 0) {
                        this.$Message.success('提交成功');
                        this.clearform();
                        this.refreshLatestData();
                    } else {
                        this.$Message.error(resp.message);
                    }
                });
            } catch (error) {
                console.error('提交工单失败:', error);
            }
        },

        open() {
            this.isVisible = true;
        },

        close() {
            this.isVisible = false;
        }
    },

    beforeDestroy() {
        this.stopTimer();
        document.body.style.overflow = 'auto';
    }
}
</script>

<style scoped>
.floating-button {
    position: fixed;
    bottom: 30px;
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

.floating-button:hover {
    transform: scale(1.1);
    box-shadow: 0 6px 25px rgba(0, 0, 0, 0.4);
}

.customer-service-icon {
    width: 24px;
    height: 24px;
    margin-bottom: 2px;
}

.floating-text {
    font-size: 10px;
    font-weight: 500;
    line-height: 1;
}

.modal-mask {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 101;
    display: flex;
    align-items: flex-end;
    justify-content: flex-end;
    animation: fadeIn 0.3s ease-out;
}

.modal-content {
    animation: slideIn 0.3s ease-out;
    margin-bottom: 20px;
    margin-right: 20px;
}

@keyframes fadeIn {
    from {
        opacity: 0;
    }

    to {
        opacity: 1;
    }
}

@keyframes slideIn {
    from {
        transform: scale(0.8);
        opacity: 0;
    }

    to {
        transform: scale(1);
        opacity: 1;
    }
}

.leverage-popup {
    width: 400px;
    height: 650px;
    background-color: #fff;
    border-radius: 12px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
    display: flex;
    flex-direction: column;
    position: relative;
    overflow: hidden;
}

.leverage-popup-top {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20px;
    border-bottom: 1px solid #f0f0f0;
    background-color: #fff;
    flex-shrink: 0;
}

.leverage-popup-title {
    font-size: 18px;
    font-weight: 600;
    color: #333;
}

.close-btn {
    width: 24px;
    height: 24px;
    cursor: pointer;
    opacity: 0.6;
    transition: opacity 0.2s;
    display: flex;
    align-items: center;
    justify-content: center;
}

.close-btn:hover {
    opacity: 1;
}

.leverage-popup-info {
    flex: 1;
    padding: 20px;
    overflow-y: auto;
    max-height: 500px;
}

.order-card {
    margin-bottom: 16px;
}

.my-workorder-box {
    display: flex;
    justify-content: flex-end;
    margin-bottom: 12px;
}

.my-workorder {
    max-width: 70%;
    background: #007aff;
    color: white;
    padding: 12px 16px;
    border-radius: 18px 18px 4px 18px;
    word-wrap: break-word;
}

.attachment-img {
    width: 80px;
    height: 80px;
    border-radius: 8px;
    margin-bottom: 8px;
    cursor: pointer;
}

.my-workorder-text {
    font-size: 14px;
    line-height: 1.4;
    margin-bottom: 4px;
}

.my-workorder-time {
    font-size: 12px;
    opacity: 0.8;
}

.order-item {
    display: flex;
    justify-content: flex-start;
    margin-bottom: 12px;
}

.order-item>div {
    max-width: 70%;
    background: #f5f5f5;
    color: #333;
    padding: 12px 16px;
    border-radius: 18px 18px 18px 4px;
    word-wrap: break-word;
}

.reply {
    font-size: 14px;
    line-height: 1.4;
    margin-bottom: 4px;
}

.reply-time {
    font-size: 12px;
    color: #666;
    text-align: left;
}

.image-preview-box {
    position: absolute;
    bottom: 120px;
    left: 20px;
    right: 20px;
    background: #f8f8f8;
    border-radius: 8px;
    padding: 8px;
}

.image-preview {
    position: relative;
    height: 120px;
    border-radius: 6px;
    overflow: hidden;
}

.preview-image {
    width: 100%;
    height: 100%;
    object-fit: contain;
}

.delete-icon {
    position: absolute;
    top: 8px;
    right: 8px;
    width: 24px;
    height: 24px;
    background-color: rgba(0, 0, 0, 0.6);
    color: white;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 16px;
    cursor: pointer;
    z-index: 10;
}

.form-input-box {
    padding: 10px 20px;
    border-top: 1px solid #f0f0f0;
    background-color: #fff;
    flex-shrink: 0;
}

.form-input {
    display: flex;
    align-items: center;
    gap: 12px;
    background: #f8f8f8;
    border-radius: 24px;
    padding: 8px 16px;
}

.select-wrapper {
    flex-shrink: 0;
}

.custom-select {
    width: 80px;
    padding: 8px 8px 8px 0;
    border: none;
    background: transparent;
    font-size: 14px;
    color: #333;
    outline: none;
    cursor: pointer;
}

.input-class {
    flex: 1;
    padding: 0 12px;
}

.input-class-input {
    width: 100%;
    font-size: 14px;
    border: none;
    outline: none;
    background: transparent;
    color: #333;
}

.input-class-input::placeholder {
    color: #999;
}

.action-buttons {
    display: flex;
    align-items: center;
    gap: 8px;
}

.addImage {
    width: 32px;
    height: 32px;
    border: 1px solid #ddd;
    border-radius: 6px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.2s;
}

.addImage:hover {
    border-color: #007aff;
    background-color: #f0f8ff;
}

.add-icon {
    width: 16px;
    height: 16px;
}

.send-wrapper {
    display: flex;
    align-items: center;
}

.sending_btn {
    width: 32px;
    height: 32px;
    background: #007aff;
    border-radius: 6px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.2s;
}

.sending_btn:hover {
    background: #0056cc;
    transform: scale(1.05);
}

.sending_btn svg {
    width: 16px;
    height: 16px;
}

.sending_btn1 {
    width: 32px;
    height: 32px;
    background: transparent;
    border-radius: 6px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: not-allowed;
}

.sending_btn1 svg {
    width: 16px;
    height: 16px;
}

.icon-container {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
}

/* 滚动条样式 */
.leverage-popup-info::-webkit-scrollbar {
    width: 6px;
}

.leverage-popup-info::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 3px;
}

.leverage-popup-info::-webkit-scrollbar-thumb {
    background: #c1c1c1;
    border-radius: 3px;
}

.leverage-popup-info::-webkit-scrollbar-thumb:hover {
    background: #a8a8a8;
}

@media (max-width: 768px) {
    .leverage-popup {
        width: 90vw;
        height: 80vh;
        max-width: 500px;
    }

    .floating-button {
        width: 50px;
        height: 50px;
        bottom: 20px;
        right: 20px;
    }

    .customer-service-icon {
        width: 20px;
        height: 20px;
    }

    .floating-text {
        font-size: 9px;
    }
}
</style>