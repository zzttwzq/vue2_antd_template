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
          添加白名单
        </div>
      </template>
      <template slot="buttons" slot-scope="{ record }">
        <a style="color: rgb(245, 188, 93)" @click="deleteClick(record)">[移除]</a>
      </template>
    </FastTable>
  </div>
</template>

<script>
import mixin from '@/pages/baseMixin';
import { adminGetWhiteList, addWhiteList } from '@/api/CustomRequest';
import { postWhiteList, getWhiteListByID, deleteWhiteListByID } from '@/api/ApiRequest';

export default {
  mixins: [mixin],
  name: 'AdminUserManagerPage',
  data() {
    return {
      listRequest: adminGetWhiteList,
      detailRequest: getWhiteListByID,
      editRequest: postWhiteList,
      addRequest: addWhiteList,
      deleteRequest: deleteWhiteListByID,
      columns: [
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
          title: '手机号',
          dataIndex: 'phone',
          key: 'phone',
          sort: 'up',
          align: 'left',
          width: "auto",
          showTime: false,
        },
        {
          title: '白名单用途',
          dataIndex: 'title',
          key: 'title',
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
          name: 'siteNo', //头像 
          title: '站点ID',
          type: 'text', // text, number, numberRange, select, date, datetime, dateRange
          placeholder: '请输入站点ID',
          decorator: [
            'siteNo',
            {
              rules: [
                { required: 0, message: '站点ID 为必填项' },
              ],
            },
          ],
          sort: 'up',
          align: 'left',
          width: 'auto',
          showTime: false,
        },
        {
          name: 'phone', //头像 
          title: '账号白名单',
          type: 'text', // text, number, numberRange, select, date, datetime, dateRange
          placeholder: '请输入账号白名单',
          decorator: [
            'phone',
            {
              rules: [
                { required: 0, message: '账号白名单 为必填项' },
              ],
            },
          ],
          sort: 'up',
          align: 'left',
          width: 100,
          showTime: false,
        },
        {
          name: 'type', //头像 
          title: '白名单用途',
          type: 'select', // text, number, numberRange, select, date, datetime, dateRange
          decorator: [
            'type',
            {
              rules: [
                { required: 0, message: '白名单用途 为必填项' },
              ],
            },
          ],
          sort: 'up',
          align: 'left',
          width: 100,
          showTime: false,
          options: [
            {
              label: "注册免邀请码",
              value: 1,
            },
          ]
        },
      ],
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

            it['site'] = it['siteNo'] + "/" + it['siteName']

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
    deleteClick(record) {
      this.$refs.table.deleteRecord(record.id);
    },
    addClick() {
      this.$refs.table.addRecord();
    }
  },
};
</script>

<style lang="less" scoped>
@import url(@/theme/style.less);

</style>
