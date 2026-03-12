<template>
  <div class="container">
    <div class="ticket-form">
      <h2 class="form-title">创建工单</h2>
      <p class="desc">请选择问题类型并对问题进行详细描述。提交成功后我们将尽快进行答复。</p>
      <p class="current-user">当前用户：{{ userName }}</p>

      <el-form :model="form" label-width="120px" class="form-body">
        <el-form-item label="问题类型">
          <el-select v-model="form.questionType" placeholder="请选择">
            <el-option label="充值" value="充值"></el-option>
            <el-option label="提现" value="提现"></el-option>
            <el-option label="合约" value="合约"></el-option>
            <el-option label="预测合约" value="预测合约"></el-option>
            <el-option label="其他" value="其他"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="问题描述">
          <el-input type="textarea" v-model="form.questionDescription" :rows="6"
            placeholder="请具体并准确描述您的问题，这有助于我们更好地为您服务" />
        </el-form-item>

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

        <el-form-item>
          <el-button class="submit" type="primary" @click="submitForm" style="float: right;">提交</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>

export default {
  name: 'Order',
  data() {
    return {
      userName: '',
      form: {
        questionType: '',
        questionDescription: '',
      },
      frontCardImg: '',
      uploadUrl: this.host + "/upload/oss/image",
      uploadHeaders: { "Authorization": localStorage.getItem("TOKEN") },
    }
  },
  created() {
    try {
      const memberStr = localStorage.getItem('MEMBER')
      if (memberStr) {
        const member = JSON.parse(memberStr)
        this.userName = member.username || '未知用户'
      } else {
        this.userName = '未登录'
      }
    } catch (e) {
      this.userName = '读取失败'
      console.error('读取 MEMBER 异常:', e)
    }
  },
  methods: {
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
      this.form.questionType = ''
      this.form.questionDescription = ''
      this.frontCardImg = ''
    },
    //提交表单
    submitForm() {
      if (!this.form.questionType) {
        this.$Message.error("请选择问题类型");
        return;
      }
      if (!this.form.questionDescription) {
        this.$Message.error("请输入问题描述");
        return;
      }
      const data = {
        questionType: this.form.questionType,
        questionDescription: this.form.questionDescription,
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
  }
}
</script>

<style scoped>
.container {
  max-width: 1260px;
  margin: 0 auto;
  background-color: #fff;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.ticket-form {
  max-width: 860px;
  margin: 40px 0 150px 0;
  padding: 30px 50px;

}

.form-title {
  font-size: 22px;
  font-weight: 600;
  margin-bottom: 10px;
}

.desc {
  font-size: 14px;
  color: #666;
  margin-bottom: 20px;
}

.current-user {
  font-size: 14px;
  font-weight: bold;
  margin-bottom: 20px;
}

.upload-demo {
  width: 100%;
}

.form_Select {
  margin-left: 120px;
}

.acc_sc {
  margin-left: 120px;
  margin-bottom: 40px;
}

.submit {
  background-color: #000;
  border-radius: 7px;
}
</style>
