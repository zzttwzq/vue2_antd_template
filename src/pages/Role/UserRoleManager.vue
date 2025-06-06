<template>
  <div>
    <FastTable ref="table" title="" :logLevel="TableLogLevel.debug" :tableSearchList="searchList"
      :tableHeaderList="columns" :tableFormList="formList" pageNumKey="page" pageSizeKey="size" :pageStart="1"
      :tableFormWidth="500" :showTableEdit="false" :showTableAdd="false" :showTableDelete="false"
      :listRequest="listRequest" :addRequest="addRequest" :editRequest="editRequest" :detailRequest="detailRequest"
      :deleteRequest="deleteRequest" :onRequestSuccess="onRequestSuccess">
      <template slot="SLOT_TABLE_HEADER_RIGHT_BUTTON">
        <div @click="addClick()" :class="[
          'select-item',
          'c-button2',
          'tab-item',
        ]">
          添加角色
        </div>
      </template>
      <template slot="buttons" slot-scope="{ record }">
        <a style="color: rgb(245, 188, 93)" @click="deleteClick(record)">[移除]</a>
        <a style="color: rgb(245, 188, 93)" @click="editClick(record)">[修改]</a>
      </template>
    </FastTable>
    <a-modal :visible="isModalVisible" title="配置权限" @cancel="isModalVisible = false" :footer="null">
      <div>
        <div class="flex-row-left">
          <span style="width: 130px;">角色名称</span>
          <a-input :max-length="20" v-model="name"></a-input>
        </div>
        <!-- <div class="line"></div> -->
        <div style="margin-top: 20px;"></div>
        <div class="flex-row-left">
          用户管理
        </div>
        <div class="line"></div>
        <div class="flex-row-left">
          <a-checkbox :checked="userList" v-model="userList">平台用户</a-checkbox>
          <a-checkbox :checked="site" v-model="site">分站合作</a-checkbox>
        </div>
        <div style="margin-top: 20px;"></div>
        <div class="flex-row-left">
          财务管理
        </div>
        <div class="line"></div>
        <div class="flex-row-left">
          <a-checkbox :checked="income" v-model="income">收支记录</a-checkbox>
          <a-checkbox :checked="review" v-model="review">提现审核</a-checkbox>
        </div>
        <div style="margin-top: 20px;"></div>
        <div class="flex-row-left">
          订单查询
        </div>
        <div class="line"></div>
        <div class="flex-row-left">
          <a-checkbox :checked="order" v-model="order">历史订单</a-checkbox>
        </div>
        <div style="margin-top: 20px;"></div>
        <div class="flex-row-left">
          运营管理
        </div>
        <div class="line"></div>
        <div class="flex-row-left">
          <a-checkbox :checked="video" v-model="video">视频首秀页</a-checkbox>
          <a-checkbox :checked="setting" v-model="setting">参数配置</a-checkbox>
          <a-checkbox :checked="whitelist" v-model="whitelist">白名单配置</a-checkbox>
        </div>
        <div style="margin-top: 20px;"></div>
        <div class="flex-row-left">
          权限管理
        </div>
        <div class="line"></div>
        <div class="flex-row-left">
          <a-checkbox :checked="adminUser" v-model="adminUser">员工账号</a-checkbox>
          <a-checkbox :checked="role" v-model="role">角色权限</a-checkbox>
        </div>
        <div class="flex-row-right">
          <div @click="save" style="margin-top: 30px;" class="a-button">保存修改</div>
        </div>
      </div>
    </a-modal>
  </div>
</template>

<script>
import mixin from '@/pages/baseMixin';
import { mapGetters } from 'vuex';

import { adminGetAdminRoleList } from '@/api/CustomRequest';
import { postAdminRole, getAdminRoleByID } from '@/api/ApiRequest';

export default {
  mixins: [mixin],
  name: 'UserRoleManagerPage',
  data() {
    return {
      listRequest: adminGetAdminRoleList,
      columns: [
        {
          title: '角色名称',
          dataIndex: 'name',
          key: 'name',
          sort: 'up',
          align: 'left',
          width: "auto",
          showTime: false,
        },
        {
          title: '权限配置',
          dataIndex: 'menuNames',
          key: 'menuNames',
          sort: 'up',
          align: 'left',
          width: "auto",
          showTime: false,
        },
        {
          title: '操作',
          scopedSlots: {
            customRender: 'action',
          },
        },
      ],
      formList: [],
      /// 搜索内容
      searchList: [],
      isModalVisible: false,
      name: "",
      add: false,
      userList: false,
      site: false,
      income: false,
      review: false,
      order: false,
      video: false,
      setting: false,
      whitelist: false,
      adminUser: false,
      role: false,
      record: null,
      menus: {
        userList: 6,
        site: 7,
        income: 8,
        review: 9,
        order: 10,
        video: 11,
        setting: 12,
        whitelist: 13,
        adminUser: 14,
        role: 15,
      },
      ids: {
        6: "userList",
        7: "site",
        8: "income",
        9: "review",
        10: "order",
        11: "video",
        12: "setting",
        13: "whitelist",
        14: "adminUser",
        15: "role",
      }
    };
  },
  computed: {
    ...mapGetters('account', ['user']),
  },
  methods: {
    onRequestSuccess(type, res, refreshList) {
      this.log(this.TableRequestType.onList == type);
      this.log('>onRequestSuccess', type, res);
      switch (type) {
        case this.TableRequestType.onList:
          res.data.map((it) => {

            switch (it['status']) {
              case 0:
                it['status'] = "禁用"
                it['statusColor'] = "red"
                break;
              case 1:
                it['status'] = "正常"
                it['statusColor'] = "green"
                break;
              default:
                break;
            }
          });
          break;
        case this.TableRequestType.onAdd:
          refreshList(); // 刷新列表
          break;
        case this.TableRequestType.onEditDetail:
          break;
        case this.TableRequestType.onEdit:
          refreshList(); // 刷新列表
          break;
        case this.TableRequestType.onDelete:
          refreshList(); // 刷新列表
          break;
        default:
          break;
      }
    },
    async getDetial() {
      let res = await getAdminRoleByID(this.record.id);
      this.name = res.data.name;
      let ids = res.data.menuIds.split(",");

      // 把变量改成默认值
      for(let i = 0; i < 30; i++) {
        this[this.ids[i]] = false;
      }

      // 把变量改成选中值
      for (let i = 0; i < ids.length; i++) {
        this[this.ids[ids[i]]] = true;
      }
    },
    addClick() {
      this.add = true;
      this.name = "";
      this.record = null;

      // 把变量改成默认值
      for(let i = 0; i < 30; i++) {
        this[this.ids[i]] = false;
      }

      this.isModalVisible = true;
    },
    deleteClick(record) {
      this.$refs.table.deleteRecord(record.id);
    },
    async editClick(record) {
      this.add = false;
      this.record = record;
      await this.getDetial();
      this.isModalVisible = true;
    },
    async save(e) {
      e.preventDefault();
      let ids = ",16,17";

      if (this.userList) {
        ids += "," + this.menus["userList"];
      }
      if (this.site) {
        ids += "," + this.menus["site"];
      }
      if (this.income) {
        ids += "," + this.menus["income"];
      }
      if (this.review) {
        ids += "," + this.menus["review"];
      }
      if (this.order) {
        ids += "," + this.menus["order"];
      }
      if (this.video) {
        ids += "," + this.menus["video"];
      }
      if (this.setting) {
        ids += "," + this.menus["setting"];
      }
      if (this.whitelist) {
        ids += "," + this.menus["whitelist"];
      }
      if (this.adminUser) {
        ids += "," + this.menus["adminUser"];
      }
      if (this.role) {
        ids += "," + this.menus["role"];
      }

      ids = ids.substring(1, ids.length);
      if (ids == "") {
        this.$message.error("请选择权限");
        return;
      }

      console.log(this.user);

      await postAdminRole(
        {
          id: this.record ? this.record.id : null,
          name: this.name,
          menuIds: ids,
          siteId: this.record ? this.record.siteId : this.user.siteId,
        }
      );

      this.isModalVisible = false;
      this.$message.success("操作成功");
      this.$refs.table.getList();
    }
  },
};
</script>

<style lang="less" scoped>
@import url(@/theme/style.less);
</style>