<template>
  <common-layout>
    <div class="header2">
      <img src="@/assets/img/logo.png" style="width: 30px; margin-right: 20px" alt="" />
      <span>{{ logoName }}</span>
    </div>
    <div class="top">
      <div class="header">
        <span class="title">{{ systemName }}</span>
      </div>
      <div class="desc"></div>
    </div>
    <div class="login">
      <div style="display: flex; justify-content: center; align-items: center">
        <span style="font-size: 20px; margin-bottom: 20px">账号登录</span>
      </div>
      <a-form @submit="onSubmit" class="flex-row-center" :form="form">
        <a-alert type="error" :closable="true" v-if="error" :message="error" showIcon style="margin-bottom: 24px" />
        <a-form-item>
          <a-input style="width: 100%;" autocomplete="autocomplete" size="large" placeholder="请输入您的登录账号" v-decorator="[
            'name',
            {
              rules: [
                {
                  required: true,
                  message: '请输入您的登录账号',
                  whitespace: true,
                },
              ],
            },
          ]"></a-input>
        </a-form-item>
        <a-form-item>
          <a-input size="large" placeholder="请输入您收到的验证码" autocomplete :maxLength="6" v-decorator="[
            'password',
            {
              rules: [
                {
                  required: true,
                  message: '请输入您收到的验证码',
                  whitespace: true,
                },
              ],
            },
          ]">
            <span @click="getSmsCode" :style="'cursor: pointer;' + code_color" slot="suffix">
              {{ code_tip }}
            </span>
          </a-input>
        </a-form-item>
        <div></div>
        <a-form-item>
          <!-- <div style="
              display: flex;
              justify-content: center;
              align-items: center;
              margin-top: 30px;
            ">
            <a-checkbox style="font-size: 12px" v-model="checked">
              我已阅读并同意：
              <router-link to="">用户协议</router-link>
              、
              <router-link to="">隐私政策</router-link>
              、
              <router-link to="">产品服务协议</router-link>
            </a-checkbox>
          </div> -->
          <div style="display: flex; justify-content: center; align-items: center">
            <a-button :loading="logging" style="
                width: 100%;
                margin-top: 0;
                border-radius: 20px;
                background-color: rgb(245, 188, 93);
                border: solid rgb(245, 188, 93) 1px;
                width: 300px;
              " size="large" htmlType="submit" type="primary">
              登录
            </a-button>
          </div>
          <!-- <div style="display: flex; justify-content: center; align-items: center">
            <span>
              还没账户？
              <router-link to="/register">前往注册》</router-link>
            </span>
          </div> -->
        </a-form-item>
      </a-form>
    </div>
  </common-layout>
</template>

<script>
// import md5 from "js-md5";
import { mapMutations } from 'vuex';

import CommonLayout from '@/layouts/CommonLayout';
import { setAuthorization } from '@/utils/request';
import { loadRoutes } from '@/utils/routerUtil';
import { addDynamicRoutes } from '@/router/index';
import options from '@/router/local';

import { getAdminUserInfo, loginAdminWithPhone, sendAdminSms } from '@/api/CustomRequest';

export default {
  name: 'Login',
  components: { CommonLayout },
  data() {
    return {
      logging: false,
      checked: false,
      error: '',
      form: this.$form.createForm(this),
      code_tip: '获取验证码',
      count_down: 60,
      code_color: 'color: rgb(245, 188, 93);',
    };
  },
  computed: {
    systemName() {
      return this.$store.state.setting.systemName;
    },
    logoName() {
      return this.$store.state.setting.logoName;
    },
  },
  mounted() {
    let phone = this.$route.query.phone;

    this.$nextTick(() => {
      this.form.setFieldsValue({
        name: phone,
      });
    });
  },
  methods: {
    ...mapMutations('account', [
      'setUser',
      'setPermissions',
      'setRoles',
      'setRoutesConfig',
    ]),
    onSubmit(e) {
      e.preventDefault();

      this.form.validateFields((err, val) => {
        if (!err) {
          if (val.password.length != 6) {
            this.logging = false;
            this.$message.error('请输入正确的验证码！');
            return;
          }
          this.logging = true;

          const name = val.name;
          const password = val.password;
          loginAdminWithPhone(name, password)
            .then((res) => {
              this.getUserInfoReq(res.data.token, res.data.expire);
            })
            .catch(() => {
              this.logging = false;
            });
        } else {
          this.logging = false;
        }
      });
    },
    async getUserInfoReq(token, expire) {
      // 记录token
      localStorage.setItem(process.env.VUE_APP_USER_TOKEN_KEY, token);

      // 设置token超时时间
      let time = new Date().valueOf() + expire;
      setAuthorization({
        token: token,
        expireAt: new Date(time),
      });

      let res = await getAdminUserInfo();
      localStorage.setItem(process.env.VUE_APP_SITE_NO_KEY, res.data.siteNo);

      this.logging = false;
      this.afterLogin(res.data);
    },
    afterLogin(res) {
      this.logging = false;
      this.$message.success(`欢迎您👏， ${res.nickName}`, 3);

      // 设置用户信息
      this.setUser(res);

      // 设置菜单信息
      this.setRoutesConfig(res.menu);

      // 添加动态路由
      addDynamicRoutes(this.$router, res.menus);

      // 设置路由拦截
      let array = this.getMenuPaths(options.routes);
      array.push('login');
      array.push('register');
      array.push('userInfo');
      this.setRoles(array);

      // 获取路由信息
      loadRoutes();

      // 路由页面跳转
      this.$router.push('/user/userManager');

      let str = window.location.href;
      if (str.indexOf('?#') > -1) {
        str = str.replace('?#', '#');
        window.location.href = str;
      }
    },
    getMenuPaths(roles) {
      let list = [];

      roles.map((it) => {
        let path = it.path;
        path = path.split('/');
        path = path[path.length - 1];
        list.push(path);

        if (it.children && it.children.length > 0) {
          let list2 = this.getMenuPaths(it.children);
          list = list.concat(list2);
        }
      });

      return list;
    },
    async getSmsCode() {
      if (this.count_down < 60) {
        this.$message.error(`请等待${this.count_down}s后再次获取`);
        return;
      }

      const phone = this.form.getFieldValue('name');
      console.log(">>>", phone);

      let res = await sendAdminSms(phone);
      if (res.data.code == 200) {
        this.$message.success(res.data.msg);
        this.code_color = 'color: grey;';

        var id = setInterval(() => {
          this.count_down--;
          if (this.count_down <= 0) {
            this.count_down = 60;
            this.code_color = 'color: rgb(245, 188, 93);';
            this.code_tip = '获取验证码';
            clearInterval(id);
          } else {
            this.code_tip = `重新获取(${this.count_down})`;
          }
        }, 1000);
      } else {
        this.$message.error(res.data.msg);
      }
    },
  },
};
</script>

<style lang="less" scoped>
.header2 {
  position: fixed;
  top: 0px;
  left: 0px;
  right: 0px;
  height: 60px;
  line-height: 60px;
  background-color: white;
  padding-left: 30px;
}

.common-layout {
  .top {
    text-align: center;

    .header {
      height: 44px;
      line-height: 44px;
      margin-top: 80px;

      a {
        text-decoration: none;
      }

      .logo {
        height: 44px;
        vertical-align: top;
        margin-right: 16px;
      }

      .title {
        font-size: 33px;
        color: @title-color;
        font-family: "Myriad Pro", "Helvetica Neue", Arial, Helvetica,
          sans-serif;
        font-weight: 400;
        position: relative;
        top: 2px;
      }
    }

    .desc {
      font-size: 14px;
      color: @text-color-second;
      margin-top: 12px;
      margin-bottom: 40px;
    }
  }

  .login {
    width: 500px;
    height: 285px;
    margin: 0 auto;
    background-color: white;
    padding: 30px;
    border-radius: 10px;
    box-shadow: 0 0 16px rgba(0, 0, 0, 0.2);
    /* 悬浮时阴影加深 */

    @media screen and (max-width: 576px) {
      width: 95%;
    }

    @media screen and (max-width: 320px) {
      .captcha-button {
        font-size: 14px;
      }
    }

    .icon {
      font-size: 24px;
      color: @text-color-second;
      margin-left: 16px;
      vertical-align: middle;
      cursor: pointer;
      transition: color 0.3s;

      &:hover {
        color: @primary-color;
      }
    }
  }
}
</style>
