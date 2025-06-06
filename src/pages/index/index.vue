<template>
  <div>
    <a-card title="首页">
      <Bar></Bar>

      <a-upload
        name="file"
        :multiple="false"
        :before-upload="beforeUpload"
        accept=".xlsx,.xls,.xlw,.csv"
        @change="change"
      >
        <p class="ant-upload-drag-icon">
          <a-icon type="inbox" />
        </p>
        <p class="ant-upload-text">点击或将文件拖拽到这里上传</p>
        <p class="ant-upload-hint">支持扩展名：.xlsx,.xls,.xlw</p>
      </a-upload>

      <a-input
        placeholder="请输入需要的js库"
        style="width: 300px; margin-top: 20px"
        class="search"
        prefix-icon="search"
      ></a-input>

      <a-input
        placeholder="请输入需要的js版本"
        style="width: 300px; margin-top: 20px; margin-left: 20px"
        class="search"
        prefix-icon="search"
      ></a-input>

      <a-button
        type="primary"
        style="margin-top: 20px; margin-left: 20px"
        @click="search"
      >
        搜索
      </a-button>
    </a-card>
  </div>
</template>

<script>
  import Bar from '@/components/chart/Bar';
  import { importXLSX } from '@/utils/excel';
  import { METHOD, request } from '@/utils/request.js';

  export default {
    name: 'home',
    components: {
      Bar,
    },
    data() {
      return {};
    },
    created() {},
    methods: {
      beforeUpload(file) {
        const isLt2M = file.size / 1024 / 1024 < 50;

        if (!isLt2M) {
          this.$message.error('文件需要小于50MB!');
          return false;
        }

        this.loading = true;

        this.importData = {};
        importXLSX(
          file,
          (res) => {
            console.log(res);
            this.$message.success('导入成功！');
          },
          (err) => {
            console.log(err);
          }
        );

        return false;
      },
      async search() {
        // this.$message.success("搜索功能正在开发中...");

        this.$message.success('搜索请求中');
        let res = await request('blogApi/user/login', METHOD.GET, {});
        this.$message.success(res);
      },
      change(list) {
        if (list.fileList.length > 1) {
          this.$message.error('文件个数不能超过1！');
          return false;
        }
      },
    },
  };
</script>

<style lang="less" scoped>
  .search {
  margin-bottom: 54px;
}

.fold {
  width: calc(100% - 216px);
  display: inline-block;
}

.operator {
  margin-bottom: 18px;
}

@media screen and (max-width: 900px) {
  .fold {
    width: 100%;
  }
}
</style>
