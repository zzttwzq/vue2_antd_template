<template>
  <div>
    <a-card>
      <div class="flex-row-right">
        <div @click="addClick()" :class="[
          'select-item',
          'c-button2',
          'tab-item',
        ]">
          添加视频
        </div>
      </div>
      <div v-for="(ll, index) in videoList" :key="index">
        <div v-for="(item) in ll" :key="item.id">
          <div @click="click(item)">
            <img :src="item.coverUrl" alt="">
          </div>
        </div>
      </div>

    </a-card>

    <a-modal :visible="isModalVisible" width="400px" title="添加视频" @cancel="isModalVisible = false" :footer="null">
      <div>
        <a-upload name="file" class="avatar-uploader" :show-upload-list="true" action="/xhscApi/common/uploadVideoShow"
          :before-upload="beforeUpload1" af @change="handleChange">
          <img :src="videoCover" class="imageCover" alt="">
        </a-upload>
        <div style="margin-top: 30px;"></div>
        <a-upload name="file" class="avatar-uploader" :show-upload-list="true" action="/xhscApi/common/uploadVideoShow"
          :before-upload="beforeUpload2" af @change="handleChange">
          <img :src="cover" class="imageCover" alt="">
        </a-upload>
        <div style="margin-top: 30px;"></div>
        <div class="flex-row-right">
          <div @click="save" class="a-button">保存修改</div>
        </div>
      </div>
    </a-modal>
  </div>
</template>

<script>
import mixin from '@/pages/baseMixin';
import { adminGetVideoList, runPython } from '@/api/CustomRequest';
import { postVideoShow } from '@/api/ApiRequest';

export default {
  mixins: [mixin],
  name: 'VideoManagerPage',
  data() {
    return {
      videoList: [],
      cover: "",
      videoCover: "",
      isModalVisible: false,
    };
  },
  created() {
    this.getList();
  },
  methods: {
    async getList() {
      let res = await adminGetVideoList({ page: 1, size: 1000 });
      console.log(res);
    },
    click(record) {
      console.log(record);
    },
    beforeUpload1(file) {
      // const isJPG = file.type === 'video/mpeg' || file.type === 'video/avi';
      // if (!isJPG) {
      //   this.$message.error('只能上传JPG/PNG格式的图片!');
      //   return false;
      // }
      const isLt2M = file.size / 1024 / 1024 < 100;
      if (!isLt2M) {
        this.$message.error('图片大小不能超过100MB!');
        return false;
      }

      // this.$tencentCos.getFileUrl2("xhsc/videoShow/ccd4f049-d023-45e3-acd3-9fd7c9b5562b.jpg", 3600)

      return true;
    },
    beforeUpload2(file) {
      const isJPG = file.type === 'image/jpeg' || file.type === 'image/png';
      if (!isJPG) {
        this.$message.error('只能上传JPG/PNG格式的图片!');
        return false;
      }
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isLt2M) {
        this.$message.error('图片大小不能超过2MB!');
        return false;
      }
      return true;
    },
    handleChange(info) {
      console.log(info.file.response)
      if (info.file.status === 'done') {
        this.$message.success('上传成功');
        console.log("url", info.file.response.data.url)
      } else if (info.file.status === 'error') {
        this.$message.error('上传失败');
      }
    },
    async addClick() {
      // this.isModalVisible = true;

      let res = await runPython();
      console.log(res);
    },
    async save() {
      let res = await postVideoShow({
        cover_key: this.videoCover,
        video_key: this.cover,
        index_id: 0,
        status: 1,
      });
      console.log(res);
    },
  },
};
</script>

<style lang="less" scoped>
@import url(@/theme/style.less);

.imageCover {
  width: 100px;
  height: 300px;
  background-color: red;
  border: orange;
}
</style>
