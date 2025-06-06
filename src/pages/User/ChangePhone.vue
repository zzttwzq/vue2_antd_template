<template>
  <div>
    <a-card>
      <div style="font-size: 20px; margin-bottom: 20px; text-align: center">
        手机换绑
      </div>
      <a-form @submit="onSubmit" :form="form">
        <a-alert
          type="error"
          :closable="true"
          v-if="error"
          :message="error"
          showIcon
          style="margin-bottom: 24px"
        />
        <a-form-item
          style="display: flex; align-items: center; justify-content: center"
        >
          <a-input
            autocomplete
            style="width: 360px"
            size="large"
            placeholder="请输入您的手机号"
            :disabled="true"
            v-decorator="[
              'oldPhone',
              {
                rules: [
                  {
                    required: true,
                    message: '请输入您的手机号',
                    whitespace: true,
                  },
                ],
              },
            ]"
          ></a-input>
        </a-form-item>
        <a-form-item
          v-if="mode == 1"
          style="display: flex; align-items: center; justify-content: center"
        >
          <a-input
            autocomplete 
            style="width: 360px"
            size="large"
            placeholder="请输入您的手机号"
            v-decorator="[
              'newPhone',
              {
                rules: [
                  {
                    required: true,
                    message: '请输入您的手机号',
                    whitespace: true,
                  },
                ],
              },
            ]"
          ></a-input>
        </a-form-item>
        <a-form-item
          style="display: flex; align-items: center; justify-content: center"
        >
          <a-input
            size="large"
            :maxLength="6"
            placeholder="请输入您收到的验证码"
            style="width: 360px"
            autocomplete="autocomplete"
            v-decorator="[
              'code',
              {
                rules: [
                  {
                    required: true,
                    message: '请输入您收到的验证码',
                    whitespace: true,
                  },
                ],
              },
            ]"
          >
            <span
              @click="getSmsCode"
              :style="'cursor: pointer;' + code_color"
              slot="suffix"
            >
              {{ code_tip }}
            </span>
          </a-input>
        </a-form-item>
        <div></div>
        <a-form-item>
          <div
            style="
              display: flex;
              justify-content: center;
              align-items: center;
              margin-top: 30px;
            "
          >
            完成换绑后新的手机账户将取代旧的账户
          </div>
          <div
            style="display: flex; justify-content: center; align-items: center"
          >
            <a-button
              :loading="logging"
              style="
                width: 100%;
                margin-top: 0;
                border-radius: 20px;
                background-color: rgb(245, 188, 93);
                border: solid rgb(245, 188, 93) 1px;
                width: 300px;
              "
              size="large"
              htmlType="submit"
              type="primary"
            >
              {{ this.mode == 0 ? '下一步' : '确认换绑' }}
            </a-button>
          </div>
        </a-form-item>
      </a-form>
    </a-card>
  </div>
</template>

<script>
  // 导入mixin文件
  import { mapMutations, mapGetters } from 'vuex';
  import { checkPhone, changePhone, sendSms } from '@/api/CustomRequest';

  export default {
    name: 'ChangePhone', // 管理账号用户 管理账号用户
    data() {
      return {
        mode: 0,
        logging: false,
        error: '',
        form: this.$form.createForm(this),
        code_tip: '获取验证码',
        count_down: 60,
        code_color: 'color: rgb(245, 188, 93);',
        timer: {},
      };
    },
    computed: {
      ...mapMutations('account', ['setUser']),
      ...mapGetters('account', ['user']),
    },
    mounted() {
      this.$nextTick(() => {
        this.form.setFieldsValue({ oldPhone: this.user.phone });
      });
    },
    methods: {
      onSubmit(e) {
        e.preventDefault();

        let self = this;

        this.form.validateFields((err, val) => {
          if (!err) {
            if (val.oldPhone.length != 11) {
              this.logging = false;
              this.$message.error('请输入正确的手机号！');
              return;
            }
            if (this.mode == 1) {
              if (val.newPhone.length != 11) {
                this.logging = false;
                this.$message.error('请输入正确的手机号！');
                return;
              }
            }
            if (val.code.length != 6) {
              this.logging = false;
              this.$message.error('请输入正确的验证码！');
              return;
            }

            this.logging = true;

            try {
              if (this.mode == 0) {
                checkPhone(val.oldPhone, val.code).then((res) => {
                  console.log(res.data);

                  self.mode = 1;
                  self.form.setFieldsValue({ code: '' });
                  self.clearTimer();
                });
              } else {
                changePhone(val.oldPhone, val.newPhone, val.code).then(
                  (res) => {
                    self.$router.push({ path: '/user/userInfo' });
                    console.log(res.data);
                    self.setUser(res.data);
                  }
                );
              }

              this.logging = false;
            } catch (error) {
              console.log(error);
              this.logging = false;
            }
          } else {
            this.logging = false;
          }
        });
      },
      async getSmsCode() {
        if (this.count_down < 60) {
          this.$message.error(`请等待${this.count_down}s后再次获取`);
          return;
        }

        let phone = this.form.getFieldValue('oldPhone');
        if (this.mode == 1) {
          phone = this.form.getFieldValue('newPhone');
        }
        if (!phone || phone.length != 11) {
          this.$message.error('手机号不正确！');
          return;
        }

        let res = await sendSms(phone);
        if (res.data.code == 200) {
          this.$message.success(res.data.msg);
          this.code_color = 'color: grey;';

          this.timer = setInterval(() => {
            this.count_down--;
            if (this.count_down <= 0) {
              this.clearTimer();
            } else {
              this.code_tip = `重新获取(${this.count_down})`;
            }
          }, 1000);
        } else {
          this.$message.error(res.data.msg);
        }
      },
      clearTimer() {
        this.count_down = 60;
        this.code_color = 'color: rgb(245, 188, 93);';
        this.code_tip = '获取验证码';
        clearInterval(this.timer);
      },
    },
  };
</script>

<style lang="less" scoped>
  @import url(@/theme/style.less);
</style>
