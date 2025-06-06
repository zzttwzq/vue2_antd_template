<template>
  <div style="color: white;background-color: rgb(31, 37, 43); margin-right: -12px; margin-top: -1px">
    <a-dropdown>
      <div class="header-avatar" style="cursor: pointer">
        <!-- <a-avatar class="avatar" size="small" shape="circle" :src="user.avatar"/> -->
        <!-- <span class="name">{{user.nickname}}</span> -->
        <span>个人中心</span>
        <a-icon style="margin-left: 4px" type="caret-down" />
      </div>
      <a-menu :class="['avatar-menu']" slot="overlay">
        <a-menu-item @click="changeUserInfo">
          <a-icon style="margin-right: 8px" type="user" />
          <span>个人中心</span>
        </a-menu-item>
        <!-- <a-menu-item @click="changePassword">
          <a-icon style="margin-right: 8px;" type="unlock" />
          <span>修改密码</span>
        </a-menu-item> -->
        <a-menu-item @click="logout">
          <a-icon style="margin-right: 8px" type="poweroff" />
          <span>退出登录</span>
        </a-menu-item>
      </a-menu>

    </a-dropdown>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import { removeAuthorization } from '@/utils/request';

export default {
  name: 'HeaderAvatar',
  computed: {
    ...mapGetters('account', ['user']),
  },
  methods: {
    logout() {
      removeAuthorization();
      this.$router.push('/login');
    },
    changeUserInfo() {
      this.$router.push({ path: '/user/userInfo' });
    },
  },
};
</script>

<style lang="less">
.header-avatar {
  display: inline-flex;
  align-items: center;
  color: #fff;

  .avatar,
  .name {
    align-self: center;
  }

  .avatar {
    width: 35px;
    height: 35px;
  }

  .name {
    font-weight: 500;
  }
}

.avatar-menu {
  width: 150px;
}
</style>
