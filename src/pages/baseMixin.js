import { getUser, postUser, getUserByID, deleteUserByID,  } from "@/api/ApiRequest" 
import { TableRequestType, TableLogLevel } from "antdv-fast-table/enum";

export default {
  data() {
    return {
      TableLogLevel: TableLogLevel,
      TableRequestType: TableRequestType,
      /// relateList

      /// table
      columns: [
        {
          title: '记录id',//记录id
          dataIndex: 'id',
          key: 'id',
          sort: 'up',
          align: 'center',
          width: 100,
          showTime: false,
        },
        {
          title: '用户名',//用户名
          dataIndex: 'name',
          key: 'name',
          sort: 'up',
          align: 'left',
          width: 100,
          showTime: false,
        },
        {
          title: '邮箱',//邮箱
          dataIndex: 'email',
          key: 'email',
          sort: 'up',
          align: 'left',
          width: 100,
          showTime: false,
        },
        {
          title: '手机号',//手机号
          dataIndex: 'phone',
          key: 'phone',
          sort: 'up',
          align: 'left',
          width: 100,
          showTime: false,
        },
        {
          title: '昵称',//昵称
          dataIndex: 'nickName',
          key: 'nickName',
          sort: 'up',
          align: 'left',
          width: 100,
          showTime: false,
        },
        {
          title: '头像',//头像
          dataIndex: 'avatar',
          key: 'avatar',
          sort: 'up',
          align: 'left',
          width: 100,
          showTime: false,
        },
        {
          title: '省',//省
          dataIndex: 'province',
          key: 'province',
          sort: 'up',
          align: 'left',
          width: 100,
          showTime: false,
        },
        {
          title: '城市',//城市
          dataIndex: 'city',
          key: 'city',
          sort: 'up',
          align: 'left',
          width: 100,
          showTime: false,
        },
        {
          title: '地址',//地址
          dataIndex: 'address',
          key: 'address',
          sort: 'up',
          align: 'left',
          width: 100,
          showTime: false,
        },
        {
          title: '密码',//密码
          dataIndex: 'password',
          key: 'password',
          sort: 'up',
          align: 'left',
          width: 100,
          showTime: false,
        },
        {
          title: '凭证',//凭证
          dataIndex: 'token',
          key: 'token',
          sort: 'up',
          align: 'left',
          width: 100,
          showTime: false,
        },
        {
          title: '所属站点id',//所属站点id
          dataIndex: 'siteId',
          key: 'siteId',
          sort: 'up',
          align: 'left',
          width: 100,
          showTime: false,
        },
        {
          title: '用户类型id',//用户类型id
          dataIndex: 'userTypeId',
          key: 'userTypeId',
          sort: 'up',
          align: 'left',
          width: 100,
          showTime: false,
        },
        {
          title: '用户菜单id',//用户菜单id
          dataIndex: 'userMenuId',
          key: 'userMenuId',
          sort: 'up',
          align: 'left',
          width: 100,
          showTime: false,
        },
        {
          title: '用户余额(单位为分)',//用户余额(单位为分)
          dataIndex: 'balance',
          key: 'balance',
          sort: 'up',
          align: 'left',
          width: 100,
          showTime: false,
        },
        {
          title: '用户算力(单位为分)',//用户算力(单位为分)
          dataIndex: 'compute',
          key: 'compute',
          sort: 'up',
          align: 'left',
          width: 100,
          showTime: false,
        },
        {
          title: '用户抵扣(单位为分)',//用户抵扣(单位为分)
          dataIndex: 'deliver',
          key: 'deliver',
          sort: 'up',
          align: 'left',
          width: 100,
          showTime: false,
        },
        {
          title: '上次登录',//上次登录
          dataIndex: 'lastLogin',
          key: 'lastLogin',
          sort: 'up',
          align: 'left',
          width: 100,
          showTime: true,
        },
        {
          title: '创建于',//创建于
          dataIndex: 'createAt',
          key: 'createAt',
          sort: 'up',
          align: 'center',
          width: 100,
          showTime: true,
        },
        {
          title: '更新于',//更新于
          dataIndex: 'updateAt',
          key: 'updateAt',
          sort: 'up',
          align: 'center',
          width: 100,
          showTime: true,
        },
        {
          title: '删除于',//删除于
          dataIndex: 'deleteAt',
          key: 'deleteAt',
          sort: 'up',
          align: 'center',
          width: 100,
          showTime: true,
        },

        {
          title: '操作',
          scopedSlots: {
            customRender: 'action',
          },
        },
      ],

      /// 搜索内容
      searchList: [
        {
          name: 'name', //用户名 
          title: '用户名',
          type: 'text', // text, number, numberRange, select, date, datetime, dateRange
          decorator: [
            'name',
            {
              rules: [
                { required: 0, message: '用户名 为必填项' },
              ],
            },
          ],
          sort: 'up',
          align: 'left',
          width: 100,
          showTime: false,
        },
        {
          name: 'email', //邮箱 
          title: '邮箱',
          type: 'text', // text, number, numberRange, select, date, datetime, dateRange
          decorator: [
            'email',
            {
              rules: [
                { required: 0, message: '邮箱 为必填项' },
              ],
            },
          ],
          sort: 'up',
          align: 'left',
          width: 100,
          showTime: false,
        },
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
          name: 'nick_name', //昵称 
          title: '昵称',
          type: 'text', // text, number, numberRange, select, date, datetime, dateRange
          decorator: [
            'nick_name',
            {
              rules: [
                { required: 0, message: '昵称 为必填项' },
              ],
            },
          ],
          sort: 'up',
          align: 'left',
          width: 100,
          showTime: false,
        },
        {
          name: 'avatar', //头像 
          title: '头像',
          type: 'text', // text, number, numberRange, select, date, datetime, dateRange
          decorator: [
            'avatar',
            {
              rules: [
                { required: 0, message: '头像 为必填项' },
              ],
            },
          ],
          sort: 'up',
          align: 'left',
          width: 100,
          showTime: false,
        },
        {
          name: 'province', //省 
          title: '省',
          type: 'text', // text, number, numberRange, select, date, datetime, dateRange
          decorator: [
            'province',
            {
              rules: [
                { required: 0, message: '省 为必填项' },
              ],
            },
          ],
          sort: 'up',
          align: 'left',
          width: 100,
          showTime: false,
        },
        {
          name: 'city', //城市 
          title: '城市',
          type: 'text', // text, number, numberRange, select, date, datetime, dateRange
          decorator: [
            'city',
            {
              rules: [
                { required: 0, message: '城市 为必填项' },
              ],
            },
          ],
          sort: 'up',
          align: 'left',
          width: 100,
          showTime: false,
        },
        {
          name: 'address', //地址 
          title: '地址',
          type: 'text', // text, number, numberRange, select, date, datetime, dateRange
          decorator: [
            'address',
            {
              rules: [
                { required: 0, message: '地址 为必填项' },
              ],
            },
          ],
          sort: 'up',
          align: 'left',
          width: 100,
          showTime: false,
        },
        {
          name: 'password', //密码 
          title: '密码',
          type: 'text', // text, number, numberRange, select, date, datetime, dateRange
          decorator: [
            'password',
            {
              rules: [
                { required: 0, message: '密码 为必填项' },
              ],
            },
          ],
          sort: 'up',
          align: 'left',
          width: 100,
          showTime: false,
        },
        {
          name: 'token', //凭证 
          title: '凭证',
          type: 'text', // text, number, numberRange, select, date, datetime, dateRange
          decorator: [
            'token',
            {
              rules: [
                { required: 0, message: '凭证 为必填项' },
              ],
            },
          ],
          sort: 'up',
          align: 'left',
          width: 100,
          showTime: false,
        },
        {
          name: 'site_id', //所属站点id 
          title: '所属站点id',
          type: 'number', // text, number, numberRange, select, date, datetime, dateRange
          decorator: [
            'site_id',
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
          name: 'user_type_id', //用户类型id 
          title: '用户类型id',
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
          name: 'user_menu_id', //用户菜单id 
          title: '用户菜单id',
          type: 'number', // text, number, numberRange, select, date, datetime, dateRange
          decorator: [
            'user_menu_id',
            {
              rules: [
                { required: 0, message: '用户菜单id 为必填项' },
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
          name: 'balance', //用户余额(单位为分) 
          title: '用户余额(单位为分)',
          type: 'number', // text, number, numberRange, select, date, datetime, dateRange
          decorator: [
            'balance',
            {
              rules: [
                { required: 0, message: '用户余额(单位为分) 为必填项' },
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
          name: 'compute', //用户算力(单位为分) 
          title: '用户算力(单位为分)',
          type: 'number', // text, number, numberRange, select, date, datetime, dateRange
          decorator: [
            'compute',
            {
              rules: [
                { required: 0, message: '用户算力(单位为分) 为必填项' },
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
          name: 'deliver', //用户抵扣(单位为分) 
          title: '用户抵扣(单位为分)',
          type: 'number', // text, number, numberRange, select, date, datetime, dateRange
          decorator: [
            'deliver',
            {
              rules: [
                { required: 0, message: '用户抵扣(单位为分) 为必填项' },
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
          name: 'last_login', //上次登录 
          title: '上次登录',
          type: 'date', // text, number, numberRange, select, date, datetime, dateRange
          decorator: [
            'last_login',
            {
              rules: [
                { required: 0, message: '上次登录 为必填项' },
              ],
            },
          ],
          sort: 'up',
          align: 'left',
          width: 100,
          showTime: true,
        },
        {
          name: 'create_at', //创建于 
          title: '创建于',
          type: 'date', // text, number, numberRange, select, date, datetime, dateRange
          decorator: [
            'create_at',
            {
              rules: [
                { required: 0, message: '创建于 为必填项' },
              ],
            },
          ],
          sort: 'up',
          align: 'center',
          width: 100,
          showTime: true,
        },
        {
          name: 'update_at', //更新于 
          title: '更新于',
          type: 'date', // text, number, numberRange, select, date, datetime, dateRange
          decorator: [
            'update_at',
            {
              rules: [
                { required: 0, message: '更新于 为必填项' },
              ],
            },
          ],
          sort: 'up',
          align: 'center',
          width: 100,
          showTime: true,
        },
      ],

      /// 表单信息列表
      formList: [
        {
          name: 'name', //用户名 
          title: '用户名',
          type: 'text', // text, number, numberRange, select, date, datetime, dateRange
          decorator: [
            'name',
            {
              rules: [
                { required: 0, message: '用户名 为必填项' },
              ],
            },
          ],
          sort: 'up',
          align: 'left',
          width: 100,
          showTime: false,
        },
        {
          name: 'email', //邮箱 
          title: '邮箱',
          type: 'text', // text, number, numberRange, select, date, datetime, dateRange
          decorator: [
            'email',
            {
              rules: [
                { required: 0, message: '邮箱 为必填项' },
              ],
            },
          ],
          sort: 'up',
          align: 'left',
          width: 100,
          showTime: false,
        },
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
          name: 'nick_name', //昵称 
          title: '昵称',
          type: 'text', // text, number, numberRange, select, date, datetime, dateRange
          decorator: [
            'nick_name',
            {
              rules: [
                { required: 0, message: '昵称 为必填项' },
              ],
            },
          ],
          sort: 'up',
          align: 'left',
          width: 100,
          showTime: false,
        },
        {
          name: 'avatar', //头像 
          title: '头像',
          type: 'text', // text, number, numberRange, select, date, datetime, dateRange
          decorator: [
            'avatar',
            {
              rules: [
                { required: 0, message: '头像 为必填项' },
              ],
            },
          ],
          sort: 'up',
          align: 'left',
          width: 100,
          showTime: false,
        },
        {
          name: 'province', //省 
          title: '省',
          type: 'text', // text, number, numberRange, select, date, datetime, dateRange
          decorator: [
            'province',
            {
              rules: [
                { required: 0, message: '省 为必填项' },
              ],
            },
          ],
          sort: 'up',
          align: 'left',
          width: 100,
          showTime: false,
        },
        {
          name: 'city', //城市 
          title: '城市',
          type: 'text', // text, number, numberRange, select, date, datetime, dateRange
          decorator: [
            'city',
            {
              rules: [
                { required: 0, message: '城市 为必填项' },
              ],
            },
          ],
          sort: 'up',
          align: 'left',
          width: 100,
          showTime: false,
        },
        {
          name: 'address', //地址 
          title: '地址',
          type: 'text', // text, number, numberRange, select, date, datetime, dateRange
          decorator: [
            'address',
            {
              rules: [
                { required: 0, message: '地址 为必填项' },
              ],
            },
          ],
          sort: 'up',
          align: 'left',
          width: 100,
          showTime: false,
        },
        {
          name: 'password', //密码 
          title: '密码',
          type: 'text', // text, number, numberRange, select, date, datetime, dateRange
          decorator: [
            'password',
            {
              rules: [
                { required: 0, message: '密码 为必填项' },
              ],
            },
          ],
          sort: 'up',
          align: 'left',
          width: 100,
          showTime: false,
        },
        {
          name: 'token', //凭证 
          title: '凭证',
          type: 'text', // text, number, numberRange, select, date, datetime, dateRange
          decorator: [
            'token',
            {
              rules: [
                { required: 0, message: '凭证 为必填项' },
              ],
            },
          ],
          sort: 'up',
          align: 'left',
          width: 100,
          showTime: false,
        },
        {
          name: 'site_id', //所属站点id 
          title: '所属站点id',
          type: 'number', // text, number, numberRange, select, date, datetime, dateRange
          decorator: [
            'site_id',
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
          name: 'user_type_id', //用户类型id 
          title: '用户类型id',
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
          name: 'user_menu_id', //用户菜单id 
          title: '用户菜单id',
          type: 'number', // text, number, numberRange, select, date, datetime, dateRange
          decorator: [
            'user_menu_id',
            {
              rules: [
                { required: 0, message: '用户菜单id 为必填项' },
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
          name: 'balance', //用户余额(单位为分) 
          title: '用户余额(单位为分)',
          type: 'number', // text, number, numberRange, select, date, datetime, dateRange
          decorator: [
            'balance',
            {
              rules: [
                { required: 0, message: '用户余额(单位为分) 为必填项' },
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
          name: 'compute', //用户算力(单位为分) 
          title: '用户算力(单位为分)',
          type: 'number', // text, number, numberRange, select, date, datetime, dateRange
          decorator: [
            'compute',
            {
              rules: [
                { required: 0, message: '用户算力(单位为分) 为必填项' },
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
          name: 'deliver', //用户抵扣(单位为分) 
          title: '用户抵扣(单位为分)',
          type: 'number', // text, number, numberRange, select, date, datetime, dateRange
          decorator: [
            'deliver',
            {
              rules: [
                { required: 0, message: '用户抵扣(单位为分) 为必填项' },
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
          name: 'last_login', //上次登录 
          title: '上次登录',
          type: 'date', // text, number, numberRange, select, date, datetime, dateRange
          decorator: [
            'last_login',
            {
              rules: [
                { required: 0, message: '上次登录 为必填项' },
              ],
            },
          ],
          sort: 'up',
          align: 'left',
          width: 100,
          showTime: true,
        },
        {
          name: 'create_at', //创建于 
          title: '创建于',
          type: 'date', // text, number, numberRange, select, date, datetime, dateRange
          decorator: [
            'create_at',
            {
              rules: [
                { required: 0, message: '创建于 为必填项' },
              ],
            },
          ],
          sort: 'up',
          align: 'center',
          width: 100,
          showTime: true,
        },
        {
          name: 'update_at', //更新于 
          title: '更新于',
          type: 'date', // text, number, numberRange, select, date, datetime, dateRange
          decorator: [
            'update_at',
            {
              rules: [
                { required: 0, message: '更新于 为必填项' },
              ],
            },
          ],
          sort: 'up',
          align: 'center',
          width: 100,
          showTime: true,
        },
        {
          name: 'delete_at', //删除于 
          title: '删除于',
          type: 'date', // text, number, numberRange, select, date, datetime, dateRange
          decorator: [
            'delete_at',
            {
              rules: [
                { required: 0, message: '删除于 为必填项' },
              ],
            },
          ],
          sort: 'up',
          align: 'center',
          width: 100,
          showTime: true,
        },
      ],

      listRequest: getUser,
      addRequest: postUser,
      editRequest: postUser,
      detailRequest: getUserByID,
      deleteRequest: deleteUserByID,
    };
  },
  methods: {
    async init() {
    },
    onRequestSuccess(type, res, refreshList) {
      this.log(this.TableRequestType.onList == type);
      this.log(">onRequestSuccess", type, res);
      switch (type) {
        case this.TableRequestType.onList:
          // res.data.map((it) => {
          //   it["title"] = "name";
          // });
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
    onRequestError(type, res) {
      this.log(">onRequestError", type, res);
      switch (type) {
        case this.TableRequestType.onList:
          break;
        case this.TableRequestType.onAdd:
          break;
        case this.TableRequestType.onEditDetail:
          break;
        case this.TableRequestType.onEdit:
          break;
        case this.TableRequestType.onDelete:
          break;

        default:
          break;
      }
    },
    onWillSearch(params, pagenation) {
      this.log(">onWillSearch", params, pagenation);
    },
    onSearch(params) {
      this.log(">onSearch", params);
      return true;
    },
    onDidSearch() {
      this.log(">onDidSearch");
    },
    onWillGetList(params) {
      this.log(">onWillGetList", params);
    },
    onGetList(params) {
      this.log(">onGetList", params);
      return true;
    },
    onDidGetList() {
      this.log(">onDidGetList");
    },
    onWillPopAdd() {
      this.log(">onWillPopAdd");
      return true;
    },
    onWillAdd(params) {
      this.log("onWillAdd", params);
    },
    onAdd(params) {
      this.log(">onAdd", params);
      return true;
    },
    onDidAdd() {
      this.log(">onDidAdd");
    },
    onWillPopEdit() {
      this.log(">onWillPopEdit");
      return true;
    },
    onWillEditDetail(params) {
      this.log(">onWillEditDetail", params);
    },
    onEditDetail(params) {
      this.log(">onEditDetail", params);
      return true;
    },
    onDidEditDetail() {
      this.log(">onDidEditDetail");
    },
    onWillEdit(params) {
      this.log(">onWillEdit", params);
    },
    onEdit(params) {
      this.log(">onEdit", params);
      return true;
    },
    onDidEdit() {
      this.log(">onDidEdit");
    },
    onWillPopDelete() {
      this.log(">onWillPopDelete");
      return true;
    },
    onWillDelete(params) {
      this.log(">onWillDelete", params);
    },
    onDelete(params) {
      this.log(">onDelete", params);
      return true;
    },
    onDidDelete() {
      this.log("onDidDelete");
    },
    onFormPrefixClick() {

    },
    onFormSuffixClick() {

    },
    log(title, msg) {
       0 == 0 && console.log(`(*)[User->${title}]`, msg ?? "");
    },
  },
};
