<template>
  <a-layout-sider :theme="sideTheme" :class="['side-menu', 'beauty-scroll', isMobile ? null : 'shadow']" width="256px"
    height="300px" :collapsible="collapsible" v-model="collapsed" :trigger="null">
    <div :class="['logo', theme]">
      <!-- <router-link to=""> </router-link> -->
      <div>
        <img src="@/assets/img/logo.png" />
        <span class="titles">{{ logoName }}</span>
      </div>
    </div>
    <!-- <a-menu style="width: 256px" class="menu" :default-open-keys="['sub1']" mode="inline"
      :theme="theme" :selected-keys="[current]" @click="handleClick">
      <a-menu-item key="1">
        <a-icon type="mail" />
        Navigation One
      </a-menu-item>
      <a-menu-item key="2">
        <a-icon type="calendar" />
        Navigation Two
      </a-menu-item>
      <a-sub-menu key="sub1">
        <span slot="title"><a-icon type="appstore" /><span>Navigation Three</span></span>
        <a-menu-item class="menu" key="3">
          Option 3
        </a-menu-item>
        <a-menu-item key="4">
          Option 4
        </a-menu-item>
        <a-sub-menu key="sub1-2" title="Submenu">
          <a-menu-item key="5">
            Option 5
          </a-menu-item>
          <a-menu-item key="6">
            Option 6
          </a-menu-item>
        </a-sub-menu>
      </a-sub-menu>
      <a-sub-menu key="sub2">
        <span slot="title"><a-icon type="setting" /><span>Navigation Four</span></span>
        <a-menu-item key="7">
          Option 7
        </a-menu-item>
        <a-menu-item key="8">
          Option 8
        </a-menu-item>
        <a-menu-item key="9">
          Option 9
        </a-menu-item>
        <a-menu-item key="10">
          Option 10
        </a-menu-item>
      </a-sub-menu>
    </a-menu> -->
    <i-menu :theme="theme" :collapsed="collapsed" :options="menuData" @select="onSelect" class="menu" />
  </a-layout-sider>
</template>

<script>
import IMenu from './menu';
import { mapState } from 'vuex';
export default {
  name: 'SideMenu',
  components: { IMenu },
  props: {
    collapsible: {
      type: Boolean,
      required: false,
      default: false,
    },
    collapsed: {
      type: Boolean,
      required: false,
      default: false,
    },
    menuData: {
      type: Array,
      required: true,
    },
    theme: {
      type: String,
      required: false,
      default: 'dark',
    },
  },
  computed: {
    sideTheme() {
      return this.theme == 'light' ? this.theme : 'dark';
    },
    ...mapState('setting', ['isMobile', 'systemName', 'logoName']),
  },
  mounted() {
    // console.log(';;;;',this.menuData);
  },
  methods: {
    onSelect(obj) {
      this.$emit('menuSelect', obj);
    },
  },
};
</script>

<style lang="less" scoped>
@import "index";

.titles {
  color: white;
  font-size: 15px;
  margin-left: 20px;
}

/deep/ .ant-menu-item-selected {
  background-color: rgb(245, 188, 93) !important;
}
</style>
