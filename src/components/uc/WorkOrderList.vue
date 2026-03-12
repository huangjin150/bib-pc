<template>
    <div class="list_box">
        <div class="table_list">
            <h2>客服信箱</h2>
            <Table :columns="tableColumnsMoney" :data="tableMoneyShow" :disabled-hover="true">
            </Table>
            <div class="page_box">
                <Page :total="total" :pageSize="pageSize" show-total :current="page" @on-change="changePage"
                    id="record_pages"></Page>
            </div>
        </div>
        <Modal v-model="detailModalVisible" title="工单详情" width="600" :footer-hide="true">
            <div class="detail-item">
                <span class="detail-label">工单类型：</span>
                <span class="detail-value">{{ Workorderdetails.questionType || '--' }}</span>
            </div>
            <div class="detail-item">
                <span class="detail-label">创建时间：</span>
                <span class="detail-value">{{ Workorderdetails.createTime ? dateFormat(Workorderdetails.createTime) :
                    '--' }}</span>
            </div>
            <div class="detail-item">
                <span class="detail-label">处理状态：</span>
                <span class="detail-value">
                    <span
                        :class="Workorderdetails.status == 0 ? 'status-processings' : Workorderdetails.status == 1 ? 'status-pendings' : ''">
                        {{ Workorderdetails.status == 0 ? '待处理' : Workorderdetails.status == 1 ? '已处理' : '' }}
                    </span>
                </span>
            </div>
            <div class="detail-item description">
                <span class="detail-label">问题描述：</span>
                <span class="detail-value">{{ Workorderdetails.questionDescription || '--' }}</span>
            </div>
            <div class="detail-item" v-if="Workorderdetails.attachments">
                <span class="detail-label">相关附件：</span>
                <span class="attachment-preview" @click="viewAttachment(Workorderdetails.attachments)"
                    style="cursor:pointer;">
                    <img v-if="isImageFile(Workorderdetails.attachments)" :src="Workorderdetails.attachments"
                        style="max-width:120px;max-height:80px;border:1px solid #eee;" />
                    <span v-else style="color:#2d8cf0;">查看文件</span>
                </span>
            </div>
            <div class="detail-item reply" v-if="Workorderdetails.replyContent">
                <span class="detail-label">客服回馈：</span>
                <div class="reply-content">
                    <div class="reply-time" v-if="Workorderdetails.replyTime">
                        {{ dateFormat(Workorderdetails.replyTime) }}
                    </div>
                    <div class="reply-text">{{ Workorderdetails.replyContent }}</div>
                </div>
            </div>
            <div style="text-align:center;margin-top:24px;">
                <Button type="primary" @click="detailModalVisible = false">确认</Button>
            </div>
        </Modal>
        <Modal v-model="previewImgVisible" title="图片预览" width="600" :footer-hide="true">
            <div style="text-align:center;">
                <img :src="previewImgUrl" alt="预览图片" style="width: 500px; height: 400px;" />
            </div>
        </Modal>
    </div>
</template>

<script>
var moment = require("moment");

export default {
    data() {
        return {
            tableMoneyShow: [],
            total: 0,
            pageSize: 10,
            page: 1,
            Workorderdetails: {},
            detailModalVisible: false,
            previewImgVisible: false,
            previewImgUrl: '',
        };
    },

    methods: {

        GetOrderList() {
            const data = {
                pageNum: this.page,
                pageSize: this.pageSize,
            }
            this.$http.post(this.host + "/workOrder/getListByUserId", data).then(response => {
                var resp = response.body;
                if (resp.code == 200) {
                    this.tableMoneyShow = resp.rows.reverse()
                    this.total = resp.total
                } else {
                    this.$Message.error(resp.message);
                }
            });
        },

        dateFormat: function (tick) {
            return moment(tick).format("YYYY-MM-DD HH:mm:ss");
        },
        changePage(pageindex) {
            console.log(pageindex)
            this.page = pageindex;
            this.GetOrderList()
        },
        viewDetail(item) {
            this.Workorderdetails = item;
            this.detailModalVisible = true;
        },
        isImageFile(url) {
            return /\.(jpg|jpeg|png|gif|bmp|webp)$/i.test(url);
        },
        viewAttachment(url) {
            this.detailModalVisible = false;

            this.showPreviewImg(url);

        },
        showPreviewImg(url) {
            this.previewImgUrl = url;
            this.previewImgVisible = true;
        },

    },

    computed: {
        tableColumnsMoney() {
            let self = this;
            let columns = [];
            columns.push({
                title: this.$t("工单类型"),
                align: "center",
                render: (h, params) => {
                    return h("div", {}, params.row.questionType);
                }
            },);
            columns.push({
                title: this.$t("问题描述"),
                align: "center",
                render: (h, params) => {
                    return h("div", {
                        style: {
                            maxWidth: '180px',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                            display: 'inline-block',
                            verticalAlign: 'middle'
                        }
                    }, params.row.questionDescription);
                }
            },);
            columns.push({
                title: this.$t("附件"),
                align: "center",
                render: (h, params) => {
                    if (params.row.attachments) {
                        return h('img', {
                            attrs: {
                                src: params.row.attachments,
                                alt: '附件图片'
                            },
                            style: {
                                maxWidth: '100px',
                                maxHeight: '60px',
                                cursor: 'pointer'
                            },
                            on: {
                                click: () => {
                                    this.showPreviewImg(params.row.attachments);
                                }
                            }
                        });
                    } else {
                        return h('span', {}, '无附件');
                    }
                }
            },);
            columns.push({
                title: this.$t("提交时间"),
                align: "center",
                render: (h, params) => {
                    return h("div", {}, self.dateFormat(params.row.createTime));
                }
            },);
            columns.push({
                title: this.$t("回馈"),
                align: "center",
                render: (h, params) => {
                    return h("div", {
                        style: {
                            maxWidth: '180px',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                            display: 'inline-block',
                            verticalAlign: 'middle'
                        }
                    }, params.row.replyContent || '待处理');
                }
            },);
            columns.push({
                title: this.$t("查看详情"),
                align: "center",
                render: (h, params) => {
                    return h("Button", {
                        props: {
                            type: "primary",
                            size: "small"
                        },
                        style: {
                            cursor: "pointer"
                        },
                        on: {
                            click: () => {
                                this.viewDetail(params.row);
                            }
                        }
                    }, '检查');
                }
            },);



            return columns;
        },
    },
    created() {
        this.GetOrderList()
    }

}



</script>

<style scoped lang="scss">
.list_box {
    // padding: 30px 0;

    .table_list {
        max-width: 1200px;
        margin: 0 auto;

        h2 {
            text-align: center;
            margin-bottom: 20px;
        }

    }

    .page_box {
        margin-top: 20px;
        display: flex;
        justify-content: flex-end;
    }
}

.detail-item {
    margin-bottom: 16px;
    display: flex;
    align-items: flex-start;

    .detail-label {
        min-width: 90px;
        color: #888;
        font-weight: bold;
    }

    .detail-value {
        flex: 1;
        word-break: break-all;
    }
}

.reply-content {
    background: #f8f8f8;
    padding: 8px 12px;
    border-radius: 4px;

    .reply-time {
        color: #999;
        font-size: 12px;
        margin-bottom: 4px;
    }

    .reply-text {
        color: #333;
    }
}

.status-processings {
    color: #ff9900;
}

.status-pendings {
    color: #19be6b;
}
</style>