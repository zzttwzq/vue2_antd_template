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
          添加站点
        </div>
      </template>
      <template slot="buttons" slot-scope="{ record }">
        <a style="color: rgb(245, 188, 93)" @click="computeClick(record)">[算力管理]</a>
        <a style="color: rgb(245, 188, 93)" @click="editClick(record)">[修改]</a>
        <a style="color: rgb(245, 188, 93)" @click="deleteClick(record)">[删除]</a>
      </template>
    </FastTable>
  </div>
</template>

<script>
import moment from 'moment';
import mixin from '@/pages/baseMixin';
import { getSiteList } from '@/api/CustomRequest';
import { postSite, getSiteByID, deleteSiteByID } from '@/api/ApiRequest';

export default {
  mixins: [mixin],
  name: 'SiteManagerPage',
  data() {
    return {
      listRequest: getSiteList,
      detailRequest: getSiteByID,
      editRequest: postSite,
      addRequest: postSite,
      deleteRequest: deleteSiteByID,
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
          title: '站长绑定手机号',
          dataIndex: 'phone',
          key: 'phone',
          sort: 'up',
          align: 'left',
          width: "auto",
          showTime: false,
        },
        {
          title: '抽取站点佣金比例',
          dataIndex: 'percent',
          key: 'percent',
          sort: 'up',
          align: 'left',
          width: "auto",
          showTime: false,
        },
        {
          title: '剩余站点算力',
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
          name: 'phone', //头像 
          title: '绑定手机',
          type: 'text', // text, number, numberRange, select, date, datetime, dateRange
          disabled: true,
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
          name: 'name', //头像 
          title: '站点名称',
          type: 'text', // text, number, numberRange, select, date, datetime, dateRange
          decorator: [
            'name',
            {
              rules: [
                { required: 0, message: '站点名称 为必填项' },
              ],
            },
          ],
          sort: 'up',
          align: 'left',
          width: 100,
          showTime: false,
        },
        {
          name: 'domain', //头像 
          title: '站点域名',
          type: 'text', // text, number, numberRange, select, date, datetime, dateRange
          decorator: [
            'domain',
            {
              rules: [
                { required: 0, message: '站点域名 为必填项' },
              ],
            },
          ],
          sort: 'up',
          align: 'left',
          width: 100,
          showTime: false,
        },
        {
          name: 'beian', //头像 
          title: '域名备案信息',
          type: 'text', // text, number, numberRange, select, date, datetime, dateRange
          decorator: [
            'beian',
            {
              rules: [
                { required: 0, message: '域名备案信息 为必填项' },
              ],
            },
          ],
          sort: 'up',
          align: 'left',
          width: 100,
          showTime: false,
        },
        {
          name: 'logo', //头像 
          title: '分站logo',
          type: 'image', // text, number, numberRange, select, date, datetime, dateRange
          decorator: [
            'logo',
            {
              rules: [
                { required: 0, message: '分站logo 为必填项' },
              ],
            },
          ],
          sort: 'up',
          align: 'left',
          width: 100,
          showTime: false,
          limit: 1,
          multiple: false,
          action: "/xhscApi/common/upload",
          headers: {
            "Authorization": localStorage.getItem(
              process.env.VUE_APP_USER_TOKEN_KEY
            )
          },
          handleChange(info) {
            console.log(info.file.response.data.url)
            if (info.file.status === 'done') {
              this.$message.success('上传成功');
              // this.user.avatar = info.file.response.data.url;
              this.$nextTick(() => {
                this.$refs.table.setTableForm({
                  logo: info.file.response.data.url,
                })
              });
            } else if (info.file.status === 'error') {
              this.$message.error('上传失败');
            }
          },
          beforeUpload(file) {
            // const isJPG = file.type === 'image/jpeg' || file.type === 'image/png';
            // if (!isJPG) {
            //   this.$message.error('只能上传JPG/PNG格式的图片!');
            //   return false;
            // }
            // const isLt2M = file.size / 1024 / 1024 < 2;
            // if (!isLt2M) {
            //   this.$message.error('图片大小不能超过2MB!');
            //   return false;
            // }
            // return true;

            this.$tencentCos.uploadChange(file, (res) => {
              console.log(res);
              if (res.code == 0) {
                this.$message.success('上传成功');
                // this.user.avatar = res.data.url;
                this.$nextTick(() => {
                  this.$refs.table.setTableForm({
                    logo: res.data.url,
                  })
                });
              } else {
                this.$message.error('上传失败');
              }
            });

            return false;
          },
        },
        {
          name: 'percent', //头像 
          title: '抽分站佣比例',
          type: 'text', // text, number, numberRange, select, date, datetime, dateRange
          decorator: [
            'percent',
            {
              rules: [
                { required: 0, message: '抽分站佣比例 为必填项' },
              ],
            },
          ],
          labelSpan: 10,
          sort: 'up',
          align: 'left',
          width: 100,
          showTime: false,
          suffixText: "%",
        },
        {
          name: 'alipay', //头像 
          title: '支付宝参数',
          type: 'textArea', // text, number, numberRange, select, date, datetime, dateRange
          decorator: [
            'alipay',
            {
              rules: [
                { required: 0, message: '支付宝参数 为必填项' },
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
    };
  },
  mounted() {
  },
  methods: {
    onRequestSuccess(type, res, refreshList) {
      this.log(this.TableRequestType.onList == type);
      this.log('>onRequestSuccess', type, res);
      switch (type) {
        case this.TableRequestType.onList:
          res.data.map((it) => {

            it['site'] = it['no'] + "/" + it['name']

            switch (it['status']) {
              case 0:
                it['status'] = "禁用"
                it['statusColor'] = "red"
                break;
              case 1:
                it['status'] = "正常"
                it['statusColor'] = "green"
                break;
              case 2:
                it['status'] = "欠费"
                it['statusColor'] = "red"
                break;

              default:
                break;
            }

            it['compute'] = it['compute'] / 100;
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
    addClick() {
      let list = this.formList;
      list[1].disabled = false;

      this.formList = list;
      this.$refs.table.addRecord();

      this.$nextTick(() => {
        this.$refs.table.setTableForm({
          status: 1,
        })
      });
    },
    editClick(record) {
      let list = this.formList;
      list[1].disabled = true;
      this.formList = list;
      this.$refs.table.editRecord(record);
    },
    deleteClick(record) {
      this.$refs.table.deleteRecord(record.id);
    },
    computeClick(record) {
      console.log(record);
    },
  },
};
</script>

<style lang="less" scoped>
@import url(@/theme/style.less);

</style>
