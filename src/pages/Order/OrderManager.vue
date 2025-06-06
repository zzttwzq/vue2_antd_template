<template>
  <div>
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
  </div>
</template>

<script>
import mixin from '@/pages/baseMixin';
import { adminGetUserOrderList } from '@/api/CustomRequest';
import moment from 'moment';

export default {
  mixins: [mixin],
  name: 'OrderManagerPage',
  data() {
    return {
      listRequest: adminGetUserOrderList,
      columns: [
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
          title: '网站ID/名称',
          dataIndex: 'site',
          key: 'site',
          sort: 'up',
          align: 'center',
          width: "auto",
          showTime: true,
        },
        {
          title: '站长绑定手机号',
          dataIndex: 'phone',
          key: 'phone',
          sort: 'up',
          align: 'left',
          width: "auto",
          showTime: false,
        },
        {
          title: '订单名称',
          dataIndex: 'productName',
          key: 'productName',
          sort: 'up',
          align: 'left',
          width: "auto",
          showTime: false,
        },
        {
          title: '支付算力',
          dataIndex: 'pay',
          key: 'pay',
          sort: 'up',
          align: 'left',
          width: "auto",
          showTime: false,
        },
      ],
      formList: [],
      /// 搜索内容
      searchList: [],
    };
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
            it['pay'] = it['useCompute'] / 100.0 + "账户算力" + "/" + it['useDeliver'] / 100.0 + "可抵用算力"
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
    userClick(record) {
      console.log(record);
      this.$router.push({ path: '/user/userManager' });
    },
    computeClick(record) {
      console.log(record);
    },
  },
};
</script>

<style lang="less" scoped></style>
