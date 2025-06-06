<template>
  <div>
    <a-card>
      <div style="margin-bottom: 20px" class="flex-row-left">
        <div @click="tabClick(0)" :class="[
          sortMode == 0 ? 'select-item' : 'un-select-item',
          'c-button2',
          'tab-item',
        ]">
          算力收支
        </div>
        <span style="margin-left: 20px"></span>
        <div @click="tabClick(1)" :class="[
          sortMode == 1 ? 'select-item' : 'un-select-item',
          'c-button2',
          'tab-item',
        ]">
          余额收支
        </div>
      </div>

      <FastTable ref="table" title="" :logLevel="TableLogLevel.debug" :tableSearchList="searchList"
        :tableHeaderList="columns" :tableFormList="formList" pageNumKey="page" pageSizeKey="size" :pageStart="1"
        :tableFormWidth="500" :showTableEdit="false" :showTableAdd="false" :showTableDelete="false"
        :listRequest="listRequest" :addRequest="addRequest" :editRequest="editRequest" :detailRequest="detailRequest"
        :deleteRequest="deleteRequest" :onRequestSuccess="onRequestSuccess">
        <!-- <template slot="buttons" slot-scope="{ record }">
        <a style="color: rgb(245, 188, 93)" @click="userClick(record)">[账户管理]</a>
        <a style="color: rgb(245, 188, 93)" @click="computeClick(record)">[算力管理]</a>
      </template> -->
      </FastTable>
    </a-card>
  </div>
</template>

<script>
import mixin from '@/pages/baseMixin';
import { adminGetComputeUseList, adminGetBalanceUseList } from '@/api/CustomRequest';
import moment from 'moment';

export default {
  mixins: [mixin],
  name: 'FinaceManagerPage',
  data() {
    return {
      listRequest: adminGetComputeUseList,
      columns: [],
      formList: [],
      /// 搜索内容
      searchList: [],
      sortMode: 0,
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

            it['no'] = it['createAt'] + "\r\n" + it['no']
            it['site'] = it['siteNo'] + "\r\n" + it['siteName']
            it['phone'] = it['phone'] + " \r\n " + it['delegateTitle']

            if (it["amountType"] == 1) {
              it["amount"] = "-" + it["amount"] / 100.0;
            }
            else {
              it["amount"] = "+" + it["amount"] / 100.0;
            }

            if (this.sortMode == 0) {
              if (it["type"] == 3) {
                it["amount"] += "分站算力";
                it["leftAmount"] = it["leftAmount"] / 100.0 + "分站算力";
              }
              else {
                it["amount"] += "账户算力";
                it["leftAmount"] = it["leftAmount"] / 100.0 + "账户算力" + "\r\n" + it["deliver"] + "可抵用算力";
              }
            }
            else {
              it["leftAmount"] = it["leftAmount"] / 100.0
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
    tabClick(index) {
      this.sortMode = index;

      if (this.sortMode == 0) {
        this.listRequest = adminGetComputeUseList;
        this.columns = [
          {
            title: '创建时间/订单编号',
            dataIndex: 'no',
            key: 'no',
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
            align: 'center',
            width: "auto",
            showTime: true,
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
            title: '收/支算力',
            dataIndex: 'amount',
            key: 'amount',
            sort: 'up',
            align: 'left',
            width: "auto",
            showTime: false,
          },
          {
            title: '剩余算力',
            dataIndex: 'leftAmount',
            key: 'leftAmount',
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
        ];
      } else if (this.sortMode == 1) {
        this.listRequest = adminGetBalanceUseList;
        this.columns = [
          {
            title: '创建时间/订单编号',
            dataIndex: 'no',
            key: 'no',
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
            align: 'center',
            width: "auto",
            showTime: true,
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
            title: '收/支金额（元）',
            dataIndex: 'amount',
            key: 'amount',
            sort: 'up',
            align: 'left',
            width: "auto",
            showTime: false,
          },
          {
            title: '余额（元）',
            dataIndex: 'leftAmount',
            key: 'leftAmount',
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
        ];
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

.tab-item {
  width: 100px;
}

.ant-table td {
  white-space: normal !important;
  /* 允许换行 */
  word-break: break-word !important;
  /* 长单词换行 */
}
</style>
