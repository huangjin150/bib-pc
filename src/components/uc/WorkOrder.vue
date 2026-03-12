<template>
    <div class="workoder_box">
        <div class="form_box">
            <h1 class="form_title">
                创建工单
            </h1>
            <div class="form_describe">
                请选择问题类型并对问题进行详细描述。提交成功后我们将尽快进行答复。
            </div>
            <div class="flex" style="padding: 0 0 20px 0;">
                <div class="form_username">当前用户 :</div>
                <div class="Usernmae_input">
                    {{ UserName }}
                </div>
            </div>
            <div class="form_Select">
                请选择问题类型
            </div>
            <div>
            </div>
            <div class="form_item">
                <!-- 问题类型选择 -->
                <Select v-model="form.WorkerOrderValue" clearable style="width:100%" @on-change="getType"
                    :placeholder="$t('common.pleaseselect')">
                    <Option v-for="item in recordType" :value="item.label" :key="item.value">{{ item.label }}</Option>
                </Select>
            </div>
            <!-- 问题描述 -->
            <div class="form_Select">
                请输入问题描述
            </div>
            <div class="worker_textarea">
                <textarea v-model="form.textareaValue" placeholder="请具体并准确描述您的问题，这有助于我们更好地为您服务" name=""
                    id=""></textarea>
            </div>
            <!-- 上传 -->
            <div class="form_Select">
                上传相关附件
            </div>
            <div class="acc_sc">
                <div style="width: 100%;padding: 10px 0; display: flex; justify-content: center;  ">
                    <img v-if="frontCardImg" class="Upload_img" :src="frontCardImg" alt="">
                </div>
                <Upload ref="upload1" class="acc_upload" :before-upload="beforeUpload" :onRemove="onRemoveClick"
                    :on-success="frontHandleSuccess" :headers="uploadHeaders" :action="uploadUrl">
                    <Button icon="ios-cloud-upload-outline">{{ $t('uc.safe.upload') }}</Button>
                </Upload>
            </div>
            <div class="submit_btn">
                <Button @click="submitCLick">提交</Button>

            </div>
        </div>
    </div>
</template>

<script>

export default {
    data() {
        return {
            recordType: [{
                value: 1,
                label: '充值',
            },
            {
                value: 2,
                label: '提现',
            },
            {
                value: 3,
                label: '合约',
            },
            {
                value: 4,
                label: '预测合约',
            },
            {
                value: 5,
                label: '其他',
            }],
            form: {
                WorkerOrderValue: '',//问题类型
                textareaValue: '',//问题描述
            },
            UserName: '',
            frontCardImg: '',
            uploadHeaders: { "access-auth-token": localStorage.getItem("TOKEN") },
            uploadUrl: this.host + "/upload/oss/image",
        };
    },

    methods: {
        getType(item) {
            console.log(item)
        },
        //上传文件校验
        beforeUpload(data) {
            if (data && data.size >= 1024000 * 2) {
                this.$Message.error("上传图片大小不能超过2M");
                return false;
            }
            const isImage = /\.(jpg|jpeg|png|gif|bmp|webp)$/i.test(data.name);
            if (!isImage) {
                this.$Message.error("只能上传图片格式文件");
                return false;
            }
        },
        // 选择文件
        frontHandleSuccess(res, file, fileList) {
            if (res.code == 200) {
                this.$refs.upload1.fileList = [fileList[fileList.length - 1]];
                this.frontCardImg = this.imgPreview = res.url;
            } else {
                this.$Message.error(res.message);
            }
        },
        // 删除当前选择文件
        onRemoveClick(file) {
            this.frontCardImg = ''
        },
        clearform() {
            this.form.WorkerOrderValue = ''
            this.form.textareaValue = ''
            this.frontCardImg = ''
        },


        //提交表单
        submitCLick() {
            if (!this.form.WorkerOrderValue) {
                this.$Message.error("请选择问题类型");
                return;
            }
            if (!this.form.textareaValue) {
                this.$Message.error("请输入问题描述");
                return;
            }
            const data = {
                questionType: this.form.WorkerOrderValue,
                questionDescription: this.form.textareaValue,
                attachments: this.frontCardImg
            }
            this.$http.post(this.host + "/workOrder/workOrderSubmit", data).then(response => {
                var resp = response.body;
                if (resp.code == 0) {
                    this.$Message.success('提交成功');

                    this.clearform()
                } else {
                    this.$Message.error(resp.message);
                }
            });
        },
    },
    created() {
        const Userinfo = JSON.parse(localStorage.getItem("MEMBER"))
        this.UserName = Userinfo.username
    }
}



</script>

<style scoped lang="scss">
.flex {
    display: flex;
    align-items: center;
}

.workoder_box {
    padding: 80px 200px;

    .form_box {
        max-width: 600px;
        margin: 0 auto;

        .form_title {
            padding: 20px 0;
            font-size: 30px;
        }

        .form_describe {
            padding: 0 0 20px 0;
        }

        .form_Select {
            padding: 0 0 20px 0;
        }

        .form_username {
            line-height: 25px;
        }

        .form_item {
            padding: 0 0 20px 0;
        }

        .Usernmae_input {
            line-height: 25px;
        }

        .worker_textarea {
            width: 100%;
            padding: 10px 0 30px 10px;
            background-color: #17212e;
            border: 1px solid #27313e;
            border-radius: 5px;
            margin-bottom: 20px;


            textarea {
                resize: none;
                border: none;
                outline: none;
                border-radius: 5px;
                color: #515A6F;
                width: 100%;
                height: 100px;
                background-color: #17212e;

            }

        }

        .acc_sc {

            .acc_upload {
                height: 100%;
                width: 100%;



                button {
                    display: block;
                    width: 100%;
                    height: 130px;
                    border: 1px solid #27313e;
                    background-color: #17212e;
                }
            }

            .acc_upload /deep/ .ivu-upload {
                width: 100%;
            }

            .Upload_img {
                margin: 0 auto;
                width: 400px;
                height: 200px;
            }
        }

        .submit_btn {
            padding: 20px 0;
            width: 100%;
            display: flex;
            justify-content: center;

            button {
                line-height: 30px;
                border-radius: 20px;
                width: 100%;
            }
        }
    }
}
</style>