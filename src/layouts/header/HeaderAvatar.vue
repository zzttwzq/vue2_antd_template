<template>
  <a-dropdown>
    <div class="header-avatar" style="cursor: pointer">
      <a-avatar class="avatar" size="small" shape="circle" :src="user.avatar"/>
      <span class="name">{{user.nickname}}</span>
    </div>
    <a-menu :class="['avatar-menu']" slot="overlay">
      <!-- <a-menu-item>
        <a-icon type="user" />
        <span>个人中心</span>
      </a-menu-item>
      <a-menu-item>
        <a-icon type="setting" />
        <span>设置</span>
      </a-menu-item>
      <a-menu-divider /> -->
      <a-menu-item @click="changeUserInfo">
        <a-icon style="margin-right: 8px;" type="user" />
        <span>修改用户信息</span>
      </a-menu-item>
      <a-menu-item @click="changePassword">
        <a-icon style="margin-right: 8px;" type="unlock" />
        <span>修改密码</span>
      </a-menu-item>
      <a-menu-item @click="logout">
        <a-icon style="margin-right: 8px;" type="poweroff" />
        <span>退出登录</span>
      </a-menu-item>
    </a-menu>

  </a-dropdown>
</template>

<script>
import {mapGetters} from 'vuex'
import { removeAuthorization } from '@/utils/request'

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
    changePassword() {
      this.$router.push('/changePassword');
    },
    changeUserInfo() {
      this.$router.push('/changeUserInfo');
    },
  }
}
</script>

<style lang="less">
  .header-avatar{
    display: inline-flex;
    .avatar, .name{
      align-self: center;
    }
    .avatar{
      margin-right: 8px;
    }
    .name{
      font-weight: 500;
    }
  }
  .avatar-menu{
    width: 150px;
  }

</style>
