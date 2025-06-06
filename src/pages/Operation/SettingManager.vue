<template>
  <div>
    <FastTable ref="table" title="" :logLevel="TableLogLevel.debug" :tableSearchList="searchList"
      :tableHeaderList="columns" :tableFormList="formList" pageNumKey="page" pageSizeKey="size" :pageStart="1"
      :tableFormWidth="500" :onDetailDataShow="onDetailDataShow" :onEdit="onEdit" :showTableEdit="false"
      :showTableAdd="false" :showTableDelete="false" :listRequest="listRequest" :addRequest="addRequest"
      :editRequest="editRequest" :detailRequest="detailRequest" :deleteRequest="deleteRequest"
      :onRequestSuccess="onRequestSuccess">
      <template slot="buttons" slot-scope="{ record }">
        <a style="color: rgb(245, 188, 93)" @click="editClick(record)">[修改]</a>
      </template>
    </FastTable>
  </div>
</template>

<script>
import mixin from '@/pages/baseMixin';
import { getProductSetting, postProductSetting, getProductSettingByID, deleteProductSettingByID } from '@/api/ApiRequest';

export default {
  mixins: [mixin],
  name: 'SettingManagerPage',
  data() {
    return {
      listRequest: getProductSetting,
      detailRequest: getProductSettingByID,
      editRequest: postProductSetting,
      addRequest: postProductSetting,
      deleteRequest: deleteProductSettingByID,
      columns: [
        {
          title: '项目名称',
          dataIndex: 'productName',
          key: 'productName',
          sort: 'up',
          align: 'center',
          width: "auto",
          showTime: true,
        },
        {
          title: '参数配置',
          dataIndex: 'productValue',
          key: 'productValue',
          sort: 'up',
          align: 'left',
          width: "auto",
          showTime: false,
        },
        {
          title: '配置说明',
          dataIndex: 'des',
          key: 'des',
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
          name: 'productName', //头像 
          title: '项目名称',
          type: 'text', // text, number, numberRange, select, date, datetime, dateRange
          placeholder: '请输入站点ID',
          disabled: true,
          decorator: [
            'productName',
            {
              rules: [],
            },
          ],
          sort: 'up',
          align: 'left',
          width: 'auto',
          showTime: false,
        },
        {
          name: 'productValue', //头像 
          title: '参数配置',
          type: 'text', // text, number, numberRange, select, date, datetime, dateRange
          placeholder: '参数用英文,分开',
          decorator: [
            'productValue',
            {
              rules: [
                { required: 0, message: '参数配置 为必填项' },
              ],
            },
          ],
          sort: 'up',
          align: 'left',
          width: 100,
          showTime: false,
        },
      ],
      /// 搜索内容
      searchList: [],
      record: null,
    };
  },
  methods: {
    onRequestSuccess(type, res, refreshList) {
      this.log(this.TableRequestType.onList == type);
      this.log('>onRequestSuccess', type, res);
      switch (type) {
        case this.TableRequestType.onList:
          res.data.map((it) => {

            if (it.productId == 1 ||
              it.productId == 5 ||
              it.productType == 104) {
              it.productValue = it.productValue / 100;
            }
            if (it.productId == 2) {
              it.productValue = it.productValue.split(",");
              it.productValue = it.productValue.map(item => {
                item = item / 100;
                return item;
              });

              it.productValue = it.productValue.join(",");
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
    onDetailDataShow(it) {

      this.record = it;

      if (it.productId == 1 ||
        it.productId == 5 ||
        it.productType == 104) {
        it.productValue = it.productValue / 100;
        it.productValue = it.productValue.toFixed(2);
      }
      if (it.productId == 2) {
        it.productValue = it.productValue.split(",");
        it.productValue = it.productValue.map(item => {
          item = item / 100;
          item = item.toFixed(2);
          return item;
        });

        it.productValue = it.productValue.join(",");
      }

      return true;
    },
    onEdit(it) {
      if (this.record.productId == 1 ||
        this.record.productId == 5 ||
        this.record.productType == 104) {
        it.productValue = it.productValue * 100;
        it.productValue = it.productValue.toFixed(0);
      }

      if (this.record.productId == 2) {
        it.productValue = it.productValue.split(",");
        it.productValue = it.productValue.map(item => {
          item = item * 100;
          item = item.toFixed(0);
          return item;
        });

        it.productValue = it.productValue.join(",");
      }

      console.log('onEdit', it);

      return true;
    },
    editClick(record) {
      this.$refs.table.editRecord(record);
    }
  },
};
</script>

<style lang="less" scoped>
@import url(@/theme/style.less);
</style>
