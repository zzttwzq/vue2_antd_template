<template>
  <div>
    <a-card>
      <div class="flex-column-center">
        <span style="font-size: 20px;margin-bottom: 20px"> {{ user.nickName }}</span>
        <a-upload name="file" class="avatar-uploader" :show-upload-list="false" action="/xhscApi/common/upload"
          :before-upload="beforeUpload" :headers="headers" @change="handleChange">
          <img style="border-radius: 32px; margin: 30px 10px;border: #999 solid 1px;" v-if="user.avatar" width="32"
            :src="user.avatar" />
          <img style="border-radius: 32px; margin: 30px 10px;border: #999 solid 1px;" v-else width="32"
            src="@/assets/img/userPlaceholder.png" />
        </a-upload>
        <span style="font-size: 14px">uid：{{ user.uid }}</span>
        <a @click="changePhone" style="font-size: 12px; color: grey; text-decoration: underline" class="click-btn">
          ({{ user.phone }})
        </a>
      </div>
      <div class="flex-row-left">
        <div style="
            flex: 1;
            margin-left: -1px;
            background-color: rgb(241, 241, 241);
          " class="container">
          <div class="flex-column-center">
            <div>站点算力</div>
            <div class="number-large" style="color: rgb(245, 188, 93);">{{ user.compute / 100 }}</div>
          </div>
          <div style="margin-top: 10px" class="flex-row-center">
            <span @click="userChargeDetail" class="click-btn">明细></span>
            <span @click="userCharge" style="margin-left: 20px" class="click-btn">充值></span>
          </div>
        </div>
      </div>
      <div style="margin-top: 20px;text-align: center;">*站点算力是维持站点给用户提供服务的运行保障；请保持充足的站点算力以免影响站点运行</div>

      <a-modal :visible="isModalVisible" title="权益说明" @cancel="isModalVisible = false" :footer="null">
        <div class="rights-content">
          <table class="rights-table">
            <thead>
              <tr>
                <th>身份等级</th>
                <th>充值赠送算力</th>
                <th>邀请好友赚佣</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, index) in rightsData" :key="index">
                <td>{{ item.level }}</td>
                <td>{{ item.rechargeBonus }}</td>
                <td>{{ item.inviteBonus }}</td>
              </tr>
            </tbody>
          </table>

          <div class="tips">
            <p>代理身份开通暂不对外开放，升级身份了解详情可联系客服</p>
            <p>（QQ: 1783439000，微信: khh_1991）</p>
          </div>

          <div class="footer flex-row-right">
            <a type="primary" @click="isModalVisible = false">我知道了</a>
          </div>
        </div>
      </a-modal>
    </a-card>
  </div>
</template>

<script>
import { mapMutations, mapGetters } from 'vuex';
import { getAdminUserInfo } from '@/api/CustomRequest.js';
import COS from 'cos-js-sdk-v5';
const cos = new COS({
  SecretId: 'your_tmpSecretId', // sts服务下发的临时 secretId
  SecretKey: 'your_tmpSecretKey', // sts服务下发的临时 secretKey
  SecurityToken: 'your_sessionToken', // sts服务下发的临时 SessionToken
  StartTime: 1720770679403, // 建议传入服务端时间，可避免客户端时间不准导致的签名错误
  ExpiredTime: 1720771991367, // 临时密钥过期时间
});
console.log(cos);

export default {
  name: 'UserInfo', // 管理账号用户 管理账号用户
  components: {
  },
  data() {
    return {
      mode: 0,
      isModalVisible: false,
      rightsData: [
        {
          level: '普贵会员',
          rechargeBonus: '+0%',
          inviteBonus: '0%'
        },
        {
          level: '初级代理',
          rechargeBonus: '+10%',
          inviteBonus: '10%'
        },
        {
          level: '高级代理',
          rechargeBonus: '+20%',
          inviteBonus: '20%'
        },
        {
          level: '至尊代理',
          rechargeBonus: '+30%',
          inviteBonus: '30%'
        }
      ],
      headers: {
        "Authorization": localStorage.getItem(
          process.env.VUE_APP_USER_TOKEN_KEY
        )
      },
    };
  },
  computed: {
    ...mapGetters('account', ['user']),
  },
  created() {
    this.getUserInfoReq();
  },
  methods: {
    ...mapMutations('account', ['setUser']),
    async getUserInfoReq() {
      let res = await getAdminUserInfo();
      this.setUser(res.data);
    },
    changePhone() {
      this.$router.push({ path: '/user/changePhone' });
    },
    userCharge() {
      this.$router.push({ path: '/user/userCharge' });
    },
    userChargeDetail() {
      this.$router.push({ path: '/user/userChargeDetail' });
    },
    beforeUpload(file) {
      const isJPG = file.type === 'image/jpeg' || file.type === 'image/png';
      if (!isJPG) {
        this.$message.error('只能上传JPG/PNG格式的图片!');
        return false;
      }
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isLt2M) {
        this.$message.error('图片大小不能超过2MB!');
        return false;
      }
      return true;
    },
    handleChange(info) {
      console.log("response", info.file.response)
      if (info.file.status === 'done') {
        this.$message.success('上传成功');
        this.user.avatar = info.file.response.data.url;
      } else if (info.file.status === 'error') {
        this.$message.error('上传失败');
      }
    },
    quanyiClick() {
      this.isModalVisible = true;
    },
    cashOut() {
      this.$router.push({ path: '/userCashOut' });
    },
    userComputeDetail() {
      this.$router.push({ path: '/userComputeDetail' });
    },
    userDeliverDetail() {
      this.$router.push({ path: '/userDeliverDetail' });
    },
  },
};
</script>

<style lang="less" scoped>
@import url(@/theme/style.less);

.quanyi {
  font-size: 14px;
}

.avatar {
  width: 60px;
  height: 60px;
  border-radius: 60px;
  background-color: grey;
}

.number-large {
  font-size: 19px;
  color: grey;
}

.title {
  font-size: 12px;
  color: grey;
}

.container {
  border: solid 1px grey;
  padding: 20px;
  height: 130px;
  margin-top: 30px;
}

.rights-modal {
  .rights-content {
    padding: 0 20px;
  }

  .rights-table {
    width: 100%;
    border-collapse: collapse;
    margin-bottom: 20px;

    th,
    td {
      padding: 12px;
      text-align: center;
      border: 1px solid #f0f0f0;
    }

    th {
      background-color: #fafafa;
      font-weight: normal;
    }

    tr:nth-child(even) {
      background-color: #fafafa;
    }
  }

  .tips {
    text-align: center;
    color: #666;
    margin: 20px 0;

    p {
      margin: 5px 0;
      font-size: 14px;
    }
  }

  .footer {
    text-align: right;
    margin-top: 20px;
  }
}
</style>
