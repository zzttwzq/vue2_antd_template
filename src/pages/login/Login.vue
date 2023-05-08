<template>
  <common-layout>
    <div class="top">
      <div class="header">
        <img alt="logo" class="logo" src="@/assets/img/logo.png" />
        <span class="title">{{ systemName }}</span>
      </div>
      <div class="desc"></div>
    </div>
    <div class="login">
      <a-form @submit="onSubmit" :form="form">
        <a-tabs
          size="large"
          :tabBarStyle="{ textAlign: 'center' }"
          style="padding: 0 2px"
        >
          <a-tab-pane tab="账户密码登录" key="1">
            <a-alert
              type="error"
              :closable="true"
              v-if="error"
              :message="error"
              showIcon
              style="margin-bottom: 24px"
            />
            <a-form-item>
              <a-input
                autocomplete="autocomplete"
                size="large"
                placeholder=""
                v-decorator="[
                  'name',
                  {
                    rules: [
                      {
                        required: true,
                        message: '请输入账户名',
                        whitespace: true,
                      },
                    ],
                  },
                ]"
              >
                <a-icon slot="prefix" type="user" />
              </a-input>
            </a-form-item>
            <a-form-item>
              <a-input
                size="large"
                placeholder=""
                autocomplete="autocomplete"
                type="password"
                v-decorator="[
                  'password',
                  {
                    rules: [
                      {
                        required: true,
                        message: '请输入密码',
                        whitespace: true,
                      },
                    ],
                  },
                ]"
              >
                <a-icon slot="prefix" type="lock" />
              </a-input>
            </a-form-item>
          </a-tab-pane>
          <!-- <a-tab-pane tab="手机号登录" key="2">
            <a-form-item>
              <a-input
                size="large"
                placeholder="请输入手机号"
                v-decorator="[
                  'phone',
                  {
                    rules: [
                      { required: true, message: '请输入手机号', whitespace: true },
                    ],
                  },
                ]"
              >
                <a-icon slot="prefix" type="mobile" />
              </a-input>
            </a-form-item>
            <a-form-item>
              <a-row :gutter="8" style="margin: 0 -4px">
                <a-col :span="16">
                  <a-input
                    size="large"
                    placeholder="请输入验证码"
                    v-decorator="[
                      'code',
                      {
                        rules: [
                          { required: true, message: '请输入验证码', whitespace: true },
                        ],
                      },
                    ]"
                  >
                    <a-icon slot="prefix" type="mail" />
                  </a-input>
                </a-col>
                <a-col :span="8" style="padding-left: 4px">
                  <a-button
                    style="width: 100%"
                    class="captcha-button"
                    @click="getSmsCode()"
                    size="large"
                    >获取验证码</a-button
                  >
                </a-col>
              </a-row>
            </a-form-item>
          </a-tab-pane> -->
        </a-tabs>
        <div>
          <!-- <a-checkbox :checked="true" >自动登录</a-checkbox> -->
          <!-- <a style="float: right">忘记密码</a> -->
        </div>
        <a-form-item>
          <a-button
            :loading="logging"
            style="width: 100%; margin-top: 24px"
            size="large"
            htmlType="submit"
            type="primary"
            >登录</a-button
          >
        </a-form-item>
        <!-- <div>
          其他登录方式
          <a-icon class="icon" type="alipay-circle" />
          <a-icon class="icon" type="taobao-circle" />
          <a-icon class="icon" type="weibo-circle" />
          <router-link style="float: right" to="/login" >注册账户</router-link>
        </div> -->
      </a-form>
    </div>
  </common-layout>
</template>

<script>
import CommonLayout from "@/layouts/CommonLayout";
import { setAuthorization } from "@/utils/request";
// import { 
//   post_admin_user_login,
// } from "@/services/admin_request";
import { mapMutations } from "vuex";
// import JSEncrypt from "jsencrypt";
import { loadRoutes } from "@/utils/routerUtil";
import options from "@/router/local";
// import md5 from 'js-md5';

export default {
  name: "Login",
  components: { CommonLayout },
  data() {
    return {
      logging: false,
      error: "",
      form: this.$form.createForm(this),
      PASSWORD_RSA_KEY: "",
    };
  },
  computed: {
    systemName() {
      return this.$store.state.setting.systemName;
    },
  },
  mounted() {
    // get_auth_public_key()
    //   .then((res) => {
    //     this.PASSWORD_RSA_KEY = res;
    //   })
    //   .catch((err) => {
    //     console.log(err);
    //   });
  },
  methods: {
    ...mapMutations("account", [
      "setUser",
      "setPermissions",
      "setRoles",
      "setRoutesConfig",
    ]),
    getSmsCode() {
      const phone = this.form.getFieldValue("phone");
      if (!phone || phone.length === 0) {
        this.$message.error("手机号不正确！");
        return;
      }
    },
    onSubmit(e) {
      e.preventDefault();
      this.form.validateFields((err, val) => {
        if (!err) {

          this.logging = true;
          console.log(val);

          // const name = val.name;
          // const password = md5(val.password);

          this.afterLogin({
            token: '123',
            nick_name: 'yayay',
            menu: []
          });

          // post_admin_user_login({
          //   username: name,
          //   password: password,
          // })
          //   .then((res) => {
          //     this.afterLogin(res);
          //   })
          //   .catch(() => {
          //     this.logging = false;
          //   });
        }
      });
    },
    afterLogin(res) {
      console.log(res);

      this.logging = false;

      this.$message.success(`欢迎您👏， ${res.nick_name}`, 3);

      // 记录token
      const token = res.token;
      localStorage.setItem(process.env.VUE_APP_USER_TOKEN_KEY, token);

      // 设置token超时时间
      let time = new Date().valueOf + 24 * 60 * 60 * 1000;
      setAuthorization({
        token: token,
        expireAt: new Date(time),
      });

      res.menu = options.routes;

      console.log(res.menu);
      

      // 设置用户信息
      this.setUser(res);

      // // 设置角色信息 设置路由拦截
      let array = this.getMenuPaths(res.menu);
      array.push("login");
      array.push("menu");
      this.setRoles(array);

      // // 设置菜单信息
      // console.log(JSON.stringify(res.menu));
      this.setRoutesConfig(res.menu);

      // // 获取路由信息
      loadRoutes();

      // 路由页面跳转
      this.$router.push("/home");
      // window.href.reload();

      let str = window.location.href;
      if (str.indexOf("?#") > -1) {
        str = str.replace("?#", "#");
        window.location.href = str;
      }
    },
    getMenuPaths(roles) {
      let list = [];

      roles.map((it) => {
        let path = it.path;
        path = path.split("/");
        path = path[path.length - 1];
        list.push(path);

        if (it.children && it.children.length > 0) {
          let list2 = this.getMenuPaths(it.children);
          list = list.concat(list2);
        }
      });

      return list;
    },
  },
};
</script>

<style lang="less" scoped>
.common-layout {
  .top {
    text-align: center;
    .header {
      height: 44px;
      line-height: 44px;
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
        font-weight: 600;
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
    width: 368px;
    margin: 0 auto;
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
