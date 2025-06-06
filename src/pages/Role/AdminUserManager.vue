<template>
  <div>
    <FastTable ref="table" title="" :logLevel="TableLogLevel.debug" :tableSearchList="searchList"
      :tableHeaderList="columns" :tableFormList="formList" pageNumKey="page" pageSizeKey="size" :pageStart="1"
      :tableFormWidth="500" :showTableEdit="false" :showTableAdd="false" :showTableDelete="false"
      :listRequest="listRequest" :addRequest="addRequest" :editRequest="editRequest" :detailRequest="detailRequest"
      :deleteRequest="deleteRequest" :onRequestSuccess="onRequestSuccess" :onAdd="onAdd">
      <template slot="SLOT_TABLE_HEADER_RIGHT_BUTTON">
        <div @click="addClick()" :class="[
          'select-item',
          'c-button2',
          'tab-item',
        ]">
          添加员工
        </div>
      </template>
      <template slot="buttons" slot-scope="{ record }">
        <a style="color: rgb(245, 188, 93)" @click="deleteClick(record)">[移除]</a>
        <a style="color: rgb(245, 188, 93)" @click="editClick(record)">[修改]</a>
      </template>
    </FastTable>
  </div>
</template>

<script>
import mixin from '@/pages/baseMixin';
import { mapGetters } from 'vuex';
import { adminGetAdminUserList } from '@/api/CustomRequest';
import { postAdminUser, getAdminUserByID, deleteAdminUserByID, getAdminRole } from '@/api/ApiRequest';

export default {
  mixins: [mixin],
  name: 'AdminUserManagerPage',
  data() {
    return {
      listRequest: adminGetAdminUserList,
      detailRequest: getAdminUserByID,
      editRequest: postAdminUser,
      addRequest: postAdminUser,
      deleteRequest: deleteAdminUserByID,
      columns: [
        {
          title: '登录账号',
          dataIndex: 'userName',
          key: 'userName',
          sort: 'up',
          align: 'center',
          width: "auto",
          showTime: true,
        },
        {
          title: '员工姓名',
          dataIndex: 'nickName',
          key: 'nickName',
          sort: 'up',
          align: 'center',
          width: "auto",
          showTime: true,
        },
        {
          title: '绑定手机号',
          dataIndex: 'phone',
          key: 'phone',
          sort: 'up',
          align: 'left',
          width: "auto",
          showTime: false,
        },
        {
          title: '员工角色权限',
          dataIndex: 'roleName',
          key: 'roleName',
          sort: 'up',
          align: 'left',
          width: "auto",
          showTime: false,
        },
        {
          title: '状态',
          dataIndex: 'status',
          key: 'status',
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
      formList: [
        {
          name: 'status', //头像 
          title: '账号状态',
          type: 'select', // text, number, numberRange, select, date, datetime, dateRange
          decorator: [
            'status',
            {
              rules: [
                { required: 0, message: '账号状态 为必填项' },
              ],
            },
          ],
          sort: 'up',
          align: 'left',
          width: 100,
          showTime: false,
          options: [
            {
              label: "禁用",
              value: 0,
            },
            {
              label: "正常",
              value: 1,
            },
          ]
        },
        {
          name: 'name', //头像 
          title: '登录账号',
          type: 'text', // text, number, numberRange, select, date, datetime, dateRange
          decorator: [
            'name',
            {
              rules: [
                { required: 0, message: '登录账号 为必填项' },
              ],
            },
          ],
          sort: 'up',
          align: 'left',
          width: 100,
          showTime: false,
          suffixText: "",
        },
        {
          name: 'phone', //头像 
          title: '绑定手机',
          type: 'text', // text, number, numberRange, select, date, datetime, dateRange
          decorator: [
            'phone',
            {
              rules: [
                { required: 0, message: '绑定手机 为必填项' },
              ],
            },
          ],
          sort: 'up',
          align: 'left',
          width: 100,
          showTime: false,
        },
        {
          name: 'nickName', //头像 
          title: '员工姓名',
          type: 'text', // text, number, numberRange, select, date, datetime, dateRange
          decorator: [
            'nickName',
            {
              rules: [
                { required: 0, message: '员工姓名 为必填项' },
              ],
            },
          ],
          sort: 'up',
          align: 'left',
          width: 100,
          showTime: false,
        },
        {
          name: 'adminRoleId', //头像 
          title: '身份权限',
          type: 'select', // text, number, numberRange, select, date, datetime, dateRange
          decorator: [
            'adminRoleId',
            {
              rules: [
                { required: 0, message: '身份权限 为必填项' },
              ],
            },
          ],
          sort: 'up',
          align: 'left',
          width: 100,
          showTime: false,
          options: []
        },
      ],
      /// 搜索内容
      searchList: [],
    };
  },
  computed: {
    ...mapGetters('account', ['user']),
  },
  created() {
    this.formList[1].suffixText = "@" + this.user.siteNo;
    this.getRoles();
  },
  methods: {
    async getRoles() {
      let l = this.formList;
      let res = await getAdminRole({ page: 1, size: 1000 });
      let ll = [];
      console.log(res);
      res.data.map(it => {
        ll.push({
          label: it.name,
          value: it.id,
        })
      })

      l[4].options = ll;

      this.$nextTick(() => {
        this.formList = l;
        console.log(this.formList)
      });
    },
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
    onAdd(params) {
      params.name = params.name.trim();
      params.name = params.name + this.formList[1].suffixText
      return true;
    },
    addClick() {
      this.$refs.table.addRecord();
    },
    deleteClick(record) {
      this.$refs.table.deleteRecord(record.id);
    },
    editClick(record) {
      this.$refs.table.editRecord(record);
    },
  },
};
</script>

<style lang="less" scoped>
@import url(@/theme/style.less);

</style>
