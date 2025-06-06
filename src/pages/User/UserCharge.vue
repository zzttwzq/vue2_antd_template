<template>
  <div>
    <a-card>
      <div class="content">
        <CustomForm ref="customFrom" :list="formList" :showBtns="false" :onSubmit="() => { }"></CustomForm>
        <div style="display: flex; justify-content: center; align-items: center">
          <a-button :loading="logging" style="
              width: 100%;
              margin-top: 50px;
              border-radius: 20px;
              background-color: rgb(245, 188, 93);
              border: solid rgb(245, 188, 93) 1px;
              width: 300px;
            " size="large" htmlType="submit" @click="submit" type="primary">
            确认支付充值
          </a-button>
        </div>
      </div>
    </a-card>
    <!-- 支付二维码弹窗 -->
    <a-modal :visible="isModalVisible" title="请扫码支付" @cancel="isModalVisible = false" :footer="null">
      <div style="text-align: center">
        <vue-qrcode :value="payUrl" :size="200"></vue-qrcode>
        <p>请在支付码的有效期内完成支付（120s）</p>
      </div>
    </a-modal>
  </div>
</template>

<script>
// 导入mixin文件
import CustomForm from '@/components/CustomForm';
import VueQrcode from '@chenfengyuan/vue-qrcode';

import { mapGetters } from 'vuex';
import { chargePrepare, userCheckChargeOrder } from '@/api/CustomRequest';

export default {
  components: {
    CustomForm,
    VueQrcode,
  },
  name: 'UserChargePage',
  data() {
    return {
      logging: false,
      formList: [
        {
          name: 'amount',
          title: '充值金额（元）',
          description: '0.00账户算力，加送0.00可抵用算力',
          desStyle: 'font-size: 14px;color: #8e8e8e',
          type: 'number',
          precision: 0,
          decorator: [
            'amount',
            {
              rules: [
                {
                  required: 1,
                  message: '充值金额不能为空！',
                },
              ],
            },
          ],
          sort: 'up',
          align: 'left',
          width: 100,
          showTime: false,
          size: 'large',
          change: (value) => {
            let list = this.formList;
            if (value == "") {
              value = 0;
            }
            list[0].description = `${value}账户算力，加送${(value * (this.user.delegateIncome / 100.0)).toFixed(2)}可抵用算力`;

            this.$nextTick(() => {
              this.formList = list;
            });
          },
        },
        {
          name: 'payType',
          title: '支付方式',
          type: 'select',
          decorator: [
            'payType',
            {
              rules: [
                {
                  required: 1,
                  message: '支付方式 为必填项',
                },
              ],
            },
          ],
          sort: 'up',
          align: 'left',
          width: 100,
          showTime: false,
          size: 'large',
          options: [
            {
              label: '支付宝',
              value: 0,
            },
            // {
            //   label: '微信',
            //   value: 1,
            // },
          ],
        },
      ],
      isModalVisible: false, // 控制弹窗显示隐藏
      // 存储二维码的值
      payUrl: '',
      checkId: '',
      expireTime: 0,
      timer: null,
    };
  },
  computed: {
    ...mapGetters('account', ['user']),
  },
  mounted() {
    this.$nextTick(() => {
      this.$refs.customFrom.form.setFieldsValue({
        payType: 0,
      });
    });
  },
  distroyed() {
    clearInterval(this.timer);
  },
  methods: {
    submit() {
      this.logging = true;
      this.$refs.customFrom.form.validateFields(async (err, values) => {
        if (!err) {
          try {
            let res = await chargePrepare(
              `用户充值 ${values.amount} 元`,
              values.amount * 100,
              values.payType
            );
            console.log(res);
            this.payUrl = res.data.payUrl;
            this.checkId = res.data.id;
            this.expireTime = res.data.expireTime;

            // 打开二维码弹窗
            this.isModalVisible = true;

            this.checkOrder();
          } catch (error) {
            console.error('支付请求失败', error);
          }
        }
        this.logging = false;
      });
    },
    checkOrder() {
      this.timer = setInterval(async () => {
        let res = await userCheckChargeOrder(this.checkId);
        console.log(res);
        if (res.data.code == 200) {
          this.$message.success('支付成功');
          this.isModalVisible = false;

          clearInterval(this.timer);
          this.$router.push('/user/paymentSuccess');
        }
      }, 2000);
    },
  },
};
</script>

<style lang="less" scoped>
.content {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
</style>
