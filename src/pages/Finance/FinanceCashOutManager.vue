<template>
  <a-card>
    <div style="margin-bottom: 20px" class="flex-row-left">
      <div @click="tabClick(0)" :class="[
        sortMode == 0 ? 'select-item' : 'un-select-item',
        'c-button2',
        'tab-item',
      ]">
        待审核
      </div>
      <span style="margin-left: 20px"></span>
      <div @click="tabClick(1)" :class="[
        sortMode == 1 ? 'select-item' : 'un-select-item',
        'c-button2',
        'tab-item',
      ]">
        历史明细
      </div>
    </div>

    <FastTable ref="table" title="" :logLevel="TableLogLevel.debug" :tableSearchList="searchList"
      :tableHeaderList="columns" :tableFormList="formList" pageNumKey="page" pageSizeKey="size" :pageStart="1"
      :tableFormWidth="500" :showTableEdit="false" :showTableAdd="false" :showTableDelete="false"
      :listRequest="listRequest" :addRequest="addRequest" :editRequest="editRequest" :detailRequest="detailRequest"
      :deleteRequest="deleteRequest" :onRequestSuccess="onRequestSuccess">
      <template slot="buttons" slot-scope="{ record }">
        <a style="color: rgb(245, 188, 93)" v-if="record.status == '待审核'" @click="audited(record)">[审核]</a>
      </template>
    </FastTable>

    <a-modal :visible="isModalVisible" width="400px" title="审核" @cancel="isModalVisible = false" :footer="null">
      <div>
        <div class="flex-row-space">
          <div style="width: 150px;">
            操作审核
          </div>
          <a-select style="width: 100%;" v-model="reviewStatus">
            <a-select-option :value="1">通过审核</a-select-option>
            <a-select-option :value="5">驳回审核</a-select-option>
          </a-select>
        </div>
        <div v-if="reviewStatus == 5" style="margin-top: 30px;"></div>
        <div v-if="reviewStatus == 5" class="flex-row-space">
          <span>您的账户资金存在异常</span>
          <a-radio v-model="select1" @change="handle1"></a-radio>
        </div>
        <div v-if="reviewStatus == 5" style="margin-top: 20px;"></div>
        <div v-if="reviewStatus == 5" class="flex-row-space">
          <a-input style="width: 100%;" v-model="inputtext"></a-input>
          <a-radio style="margin-left: 40px;" v-model="select2" @change="handle2"></a-radio>
        </div>
        <div style="margin-top: 30px;"></div>
        <div class="flex-row-right">
          <div @click="save" class="a-button">保存修改</div>
        </div>
      </div>
    </a-modal>
  </a-card>
</template>

<script>
import mixin from '@/pages/baseMixin';
import { adminGetUserCashOutList, adminGetUserCashOutReviewList, reviewUserCashOut } from '@/api/CustomRequest';
import moment from 'moment';

export default {
  mixins: [mixin],
  name: 'FinaceCashOutManagerPage',
  data() {
    return {
      listRequest: adminGetUserCashOutReviewList,
      columns: [],
      formList: [],
      /// 搜索内容
      searchList: [],
      sortMode: 0,
      isModalVisible: false,
      reviewStatus: 1,
      inputtext: '',
      select1: 1,
      select2: 0,
      record: {},
    };
  },
  created() {
    this.tabClick(0);
  },
  methods: {
    onRequestSuccess(type, res, refreshList) {
      this.log(this.TableRequestType.onList == type);
      this.log('>onRequestSuccess', type, res);
      switch (type) {
        case this.TableRequestType.onList:
          res.data.map((it) => {

            it['create'] = it['createAt'] + "/" + it['no']
            it['site'] = it['siteNo'] + "/" + it['siteName']
            it['phone'] = it['phone'] + "/" + it['delegateTitle']

            switch (it['status']) {
              case 0:
                it['status'] = "待审核"
                it['statusColor'] = "red"
                break;
              case 1:
                it['status'] = "转帐中"
                it['statusColor'] = "green"
                break;
              case 2:
                it['status'] = "转账成功"
                it['statusColor'] = "red"
                break;
              case 3:
                it['status'] = "转账失败"
                it['statusColor'] = "red"
                break;
              case 4:
                it['status'] = "转账超时"
                it['statusColor'] = "red"
                break;

              default:
                break;
            }

            it['compute'] = it['amount'] / 100;
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
    audited(record) {
      this.record = record;
      this.isModalVisible = true;
      this.reviewStatus = 1; 
      this.inputtext = '';
      this.select1 = 1;
      this.select2 = 0;
    },
    handle1() {
      this.select2 = 0;
    },
    handle2() {
      this.select1 = 0;
    },
    async save() {
      let res = await reviewUserCashOut(this.record.id, this.reviewStatus, this.select1 == 0 ? this.inputtext: "您的账号资金存在异常");
      console.log(res);
      this.$message.success('操作成功');
      this.$refs.table.getList();

      this.isModalVisible = false;
    },
    tabClick(index) {
      this.sortMode = index;

      if (this.sortMode == 0) {
        this.listRequest = adminGetUserCashOutReviewList;
        this.columns = [
          {
            title: '创建时间/订单编号',
            dataIndex: 'create',
            key: 'create',
            sort: 'up',
            align: 'center',
            width: "auto",
            showTime: true,
          },
          {
            title: '站点ID/名称',
            dataIndex: 'site',
            key: 'site',
            sort: 'up',
            align: 'left',
            width: "auto",
            showTime: false,
          },
          {
            title: '用户手机号/身份',
            dataIndex: 'phone',
            key: 'phone',
            sort: 'up',
            align: 'left',
            width: "auto",
            showTime: false,
          },
          {
            title: '申请提现金额（元）',
            dataIndex: 'compute',
            key: 'compute',
            sort: 'up',
            align: 'left',
            width: "auto",
            showTime: false,
          },
          {
            title: '账号状态',
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
        ]
      } else if (this.sortMode == 1) {
        this.listRequest = adminGetUserCashOutList;
        this.columns = [
          {
            title: '创建时间/订单编号',
            dataIndex: 'create',
            key: 'create',
            sort: 'up',
            align: 'center',
            width: "auto",
            showTime: true,
          },
          {
            title: '站点ID/名称',
            dataIndex: 'site',
            key: 'site',
            sort: 'up',
            align: 'left',
            width: "auto",
            showTime: false,
          },
          {
            title: '用户手机号/身份',
            dataIndex: 'phone',
            key: 'phone',
            sort: 'up',
            align: 'left',
            width: "auto",
            showTime: false,
          },
          {
            title: '申请提现金额（元）',
            dataIndex: 'compute',
            key: 'compute',
            sort: 'up',
            align: 'left',
            width: "auto",
            showTime: false,
          },
          {
            title: '账号状态',
            dataIndex: 'status',
            key: 'status',
            sort: 'up',
            align: 'left',
            width: "auto",
            showTime: false,
          },
          {
            title: '备注',
            dataIndex: 'mark',
            key: 'mark',
            sort: 'up',
            align: 'left',
            width: "auto",
            showTime: false,
          },
        ]
      }

      this.$nextTick(() => {
        this.$refs.table.getList();
      });
    },
  },
};
</script>

<style lang="less" scoped>
@import url(@/theme/style.less);
</style>
