<template>
  <div>
    <FastTable ref="table" title="用户算力明细" :logLevel="TableLogLevel.debug" :tableHeaderList="columns"
      :tableSearchList="[]" :tableFormList="[]" pageNumKey="page" pageSizeKey="size" :pageStart="1"
      :tableFormWidth="500" :showTableEdit="false" :showTableAdd="false" :showTableDelete="false"
      :listRequest="listRequest" :addRequest="addRequest" :editRequest="editRequest" :detailRequest="detailRequest"
      :deleteRequest="deleteRequest" :onRequestSuccess="onRequestSuccess">
      <template slot="tableCustomForm">
        <div></div>
      </template>
      <template slot="buttons"></template>
    </FastTable>
  </div>
</template>

<script>
import mixin from '@/pages/baseMixin';
import { getComputeList } from '@/api/CustomRequest';

export default {
  mixins: [mixin],
  name: 'UserComputeDetailPage', // 用户算力明细
  data() {
    return {
      listRequest: getComputeList,
      columns: [
        {
          title: '创建时间',
          dataIndex: 'createAt',
          key: 'createAt',
          sort: 'up',
          align: 'left',
          width: 'auto',
          showTime: false,
        },
        {
          title: '订单编号',
          dataIndex: 'tradeNo',
          key: 'tradeNo',
          sort: 'up',
          align: 'left',
          width: 'auto',
          showTime: false,
        },
        {
          title: '收支账户算力',
          dataIndex: 'amount',
          key: 'amount',
          sort: 'up',
          align: 'left',
          width: 'auto',
          showTime: false,
        },
        {
          title: '剩余账户算力',
          dataIndex: 'leftAmount',
          key: 'leftAmount',
          sort: 'up',
          align: 'left',
          width: 'auto',
          showTime: false,
        },
        {
          title: '备注',
          dataIndex: 'mark',
          key: 'mark',
          sort: 'up',
          align: 'left',
          width: 'auto',
          showTime: false,
        },
      ],
    };
  },
  created() {
    this.init();
  },
  methods: {
    onRequestSuccess(type, res, refreshList) {
      switch (type) {
        case this.TableRequestType.onList:
          res.data.map((it) => {
            it['amount'] = it['amount'] / 100;
            it['leftAmount'] = it['leftAmount'] / 100;

            switch (it['amountType']) {
              case 0:
                it['amount'] = `+${it['amount']}`;
                break;
              case 1:
                it['amount'] = `-${it['amount']}`;
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
  },
};
</script>

<style lang="less" scoped></style>
