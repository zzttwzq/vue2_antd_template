<template>
  <div>
    <FastTable ref="table" title="" :logLevel="TableLogLevel.debug" :tableSearchList="searchList"
      :tableHeaderList="columns" :tableFormList="formList" pageNumKey="page" pageSizeKey="size" :pageStart="1"
      :tableFormWidth="500" :showTableEdit="false" :showTableAdd="false" :showTableDelete="false"
      :listRequest="listRequest" :addRequest="addRequest" :editRequest="editRequest" :detailRequest="detailRequest"
      :deleteRequest="deleteRequest" :onRequestSuccess="onRequestSuccess">
      <template slot="buttons" slot-scope="{ record }">
        <a style="color: rgb(245, 188, 93)" @click="userClick(record)">[账户管理]</a>
        <a style="color: rgb(245, 188, 93)" @click="computeClick(record)">[算力管理]</a>
      </template>
    </FastTable>
    <a-modal :visible="isModalVisible" title="算力管理" @cancel="isModalVisible = false" :footer="null">
      <div style="text-align: center">
        <div class="flex-row-center">
          <div>
            账户算力
          </div>
          <a-dropdown>
            <a-menu slot="overlay" @click="handleMenuClick">
              <a-menu-item key="0"> <a-icon type="plus" />增加</a-menu-item>
              <a-menu-item key="1"> <a-icon type="minus" />减少</a-menu-item>
            </a-menu>
            <a-button style="margin-left: 8px"> {{ computeType == '0' ? "增加" : "减少" }} <a-icon type="down" /> </a-button>
          </a-dropdown>
          <a-input-number style="width: 200px;" v-model="compute"></a-input-number>
        </div>
        <div class="flex-row-right">
          <div @click="saveCompute" class="a-button">保存修改</div>
        </div>
      </div>
    </a-modal>
  </div>
</template>

<script>
import mixin from '@/pages/baseMixin';
import { adminGetUserList, changeUserCompute } from '@/api/CustomRequest';
import { postUser, getUserByID, deleteUserByID } from '@/api/ApiRequest';
import moment from 'moment';

export default {
  mixins: [mixin],
  name: 'UserManagerPage', // 用户充值明细 用户充值明细
  data() {
    return {
      listRequest: adminGetUserList,
      addRequest: postUser,
      editRequest: postUser,
      detailRequest: getUserByID,
      deleteRequest: deleteUserByID,
      columns: [
        {
          title: '网站ID/名称',
          dataIndex: 'site',
          key: 'site',
          sort: 'up',
          align: 'center',
          width: "120px",
          showTime: true,
        },
        {
          title: '注册时间',
          dataIndex: 'createAt',
          key: 'createAt',
          sort: 'up',
          align: 'center',
          width: "120px",
          showTime: false,
        },
        {
          title: '绑定手机号/身份类型',
          dataIndex: 'phone',
          key: 'phone',
          sort: 'up',
          align: 'center',
          width: "130px",
          showTime: false,
        },
        {
          title: '剩余账户算力/可抵用算力',
          dataIndex: 'leftAmount',
          key: 'leftAmount',
          sort: 'up',
          align: 'center',
          width: "200px",
          showTime: false,
        },
        {
          title: '账户余额（元）',
          dataIndex: 'balance',
          key: 'balance',
          sort: 'up',
          align: 'center',
          width: "auto",
          showTime: false,
        },
        {
          title: '上级推荐者',
          dataIndex: 'parentPhone',
          key: 'parentPhone',
          sort: 'up',
          align: 'center',
          width: "auto",
          showTime: false,
        },
        {
          title: '状态/近期活跃',
          dataIndex: 'status',
          key: 'status',
          sort: 'up',
          align: 'center',
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
          name: 'userTypeId', //头像 
          title: '用户身份',
          type: 'select', // text, number, numberRange, select, date, datetime, dateRange
          decorator: [
            'userTypeId',
            {
              rules: [
                { required: 0, message: '用户身份 为必填项' },
              ],
            },
          ],
          sort: 'up',
          align: 'left',
          width: 100,
          showTime: false,
          options: [
            {
              label: "至尊代理",
              value: 3,
            },
            {
              label: "高级代理",
              value: 4,
            },
            {
              label: "初级代理",
              value: 5,
            },
            {
              label: "普通会员",
              value: 6,
            },
          ]
        },
      ],
      /// 搜索内容
      searchList: [
        {
          name: 'phone', //手机号 
          title: '手机号',
          type: 'text', // text, number, numberRange, select, date, datetime, dateRange
          decorator: [
            'phone',
            {
              rules: [
                { required: 0, message: '手机号 为必填项' },
              ],
            },
          ],
          sort: 'up',
          align: 'left',
          width: 100,
          showTime: false,
        },
        {
          name: 'siteNo', //所属站点id 
          title: '所属站点id',
          type: 'text', // text, number, numberRange, select, date, datetime, dateRange
          decorator: [
            'siteNo',
            {
              rules: [
                { required: 0, message: '所属站点id 为必填项' },
              ],
            },
          ],
          precision: 0,
          sort: 'up',
          align: 'left',
          width: 100,
          showTime: false,
        },
        {
          name: 'parentPhone', //上级手机号 
          title: '上级手机号',
          type: 'text', // text, number, numberRange, select, date, datetime, dateRange
          decorator: [
            'parentPhone',
            {
              rules: [
                { required: 0, message: '上级手机号 为必填项' },
              ],
            },
          ],
          sort: 'up',
          align: 'left',
          width: 100,
          showTime: false,
        },
        {
          name: 'user_type_id', //用户类型id 
          title: '身份',
          type: 'number', // text, number, numberRange, select, date, datetime, dateRange
          decorator: [
            'user_type_id',
            {
              rules: [
                { required: 0, message: '用户类型id 为必填项' },
              ],
            },
          ],
          precision: 0,
          sort: 'up',
          align: 'left',
          width: 100,
          showTime: false,
        },
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
      ],
      isModalVisible: false,
      compute: '',
      computeType: '0',
      saveItem: {},
    };
  },
  methods: {
    onRequestSuccess(type, res, refreshList) {
      this.log(this.TableRequestType.onList == type);
      this.log('>onRequestSuccess', type, res);
      switch (type) {
        case this.TableRequestType.onList:
          res.data.map((it) => {

            it['site'] = it['no'] + "\r\n" + it['name']
            if (it['lastLogin'] == null) {
              it['status'] = "从未活跃"
            }
            else {
              it['status'] = this.processDate(it['lastLogin']);
            }

            it.phone = it.phone + "\r\n" + it.title

            it['leftAmount'] = it['compute'] / 100 + "/" + it['deliver'] / 100;
            it['balance'] = it['balance'] / 100;
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
    processDate(inputDate) {
      const now = moment();
      const target = moment(inputDate);

      // 校验日期合法性[9](@ref)
      if (!target.isValid()) {
        throw new Error('Invalid date format');
      }

      // 计算时间差
      const diffHours = now.diff(target, 'hours');
      const diffDays = now.diff(target, 'days');

      if (target.isSame(now, 'day')) {
        return '今天';
      } else if (diffHours <= 24) {
        return '一天内';
      } else if (diffDays <= 3) {
        return '三天内';
      } else if (diffDays <= 7) {
        return '一周内';
      } else {
        return target.format('YYYY-MM-DD');
      }
    },
    handleMenuClick(e) {
      console.log(e);
      this.computeType = e.key;
    },
    userClick(record) {
      this.$refs.table.editRecord(record);
    },
    computeClick(record) {
      this.isModalVisible = true;
      this.saveItem = record;
    },
    async saveCompute() {
      
      let res = await changeUserCompute(this.saveItem.id, this.computeType == "0" ? this.compute * 100 : -this.compute * 100);
      this.isModalVisible = false;

      console.log(res);
      this.$refs.table.getList();
    }
  },
};
</script>

<style lang="less" scoped>
@import url(@/theme/style.less);

</style>
