<template>
  <div>
    <a-card>
      <div style="text-align: center">
        <img
          src="@/assets/img/success.png"
          style="width: 100px; height: 100px"
        />
      </div>
      <h1 style="text-align: center">充值成功</h1>
      <div class="flex-row-center">
        <a-button
          style="
            width: 160px;
            margin-right: 20px;
            margin-top: 30px;
            border-radius: 20px;
            background-color: white;
            border: solid grey 1px;
            color: #000;
          "
          size="large"
          @click="toUserInfo()"
          type="primary"
        >
          查看余额
        </a-button>
        <a-button
          style="
            width: 160px;
            margin-top: 30px;
            border-radius: 20px;
            background-color: rgb(245, 188, 93);
            border: solid rgb(245, 188, 93) 1px;
          "
          size="large"
          @click="back()"
          type="primary"
        >
          返回上一页
        </a-button>
      </div>
    </a-card>
  </div>
</template>

<script>
  export default {
    name: 'PaymentSuccessPage',
    data() {
      return {};
    },
    methods: {
      back() {
        this.$router.back();
      },
      toUserInfo() {
        this.$router.push({ path: '/user/userInfo' });
      },
    },
  };
</script>

<style lang="less" scoped>
  @import url(@/theme/style.less);
</style>
