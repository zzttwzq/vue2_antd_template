<template>
  <div>
    <div v-if="title">{{ title }}：</div>

    <draggable :options="{draggable:'.item_content'}"
      v-model="item_list_draggable"
      :group="groupName"
      @start="drag = true"
      @end="drag = false"
    >
      <div
        @click.stop="tagClick(index)"
        v-for="(element, index) in item_list_draggable"
        :key="element.id"
        class="item_content"
      >
        {{ element.fieldName }}
        <a-icon
          @click.stop="del(index)"
          style="cursor: pointer"
          type="close"
        ></a-icon>
      </div>
      <div
        slot="footer"
        v-if="(item_list.length < max || max == 0) && showAdd"
        @click="add"
        style="cursor: pointer; background: #238efb; color: white"
        class="item_footer"
      >
        <a-icon type="plus"></a-icon>
        新增
      </div>
    </draggable>
  </div>
</template>

<script>
import draggable from "vuedraggable";
export default {
  name: "DraggableTags",
  props: {
    groupName: {
      type: String,
      required: false,
      default: () => "defaultGroup",
    },
    title: {
      type: String,
      required: false,
      default: () => "",
    },
    items: {
      type: Array,
      required: false,
      default: () => [],
    },
    max: {
      type: Number,
      required: false,
      default: () => 0,
    },
    disable: {
      type: Boolean,
      required: false,
      default: () => false,
    },
    showAdd: {
      type: Boolean,
      required: false,
      default: () => true,
    },
    showDelete: {
      type: Boolean,
      required: false,
      default: () => true,
    },
  },
  components: {
    draggable,
  },
  data() {
    return {
      item_list: [],
    };
  },
  watch: {
    items: {
      handler(newValue) {
        this.item_list = newValue;
      },
      // 代表在wacth里声明了items这个方法之后立即先去执行handler方法
      immediate: true,
      deep: true, // 可以深度检测到 obj 对象的属性值的变化
    },
  },

  computed: {
    item_list_draggable: {
      get() {
        return this.item_list;
      },
      set(value) {
        this.item_list = value;
        this.$emit("change", this.item_list);
      },
    },
  },

  methods: {
    add() {
      let flag = false;
      if (this.max == 0) {
        flag = true;
      } else {
        if (this.max < this.item_list.length) {
          flag = true;
        }
      }

      if (flag) {
        this.$emit("tagAdd");
      }
    },
    del(index) {
      this.$emit("del", index);
      // this.item_list.splice(index, 1);
      // this.$emit("change", this.item_list);
    },
    tagClick(index) {
      console.log(this.item_list[index]);
      this.$emit("tagClick", this.item_list[index]);
    },
  },
};
</script>

<style lang="less" scoped>
.item_content {
  display: inline;
  padding: 8px 15px;
  border: 1px solid #efefef;
  border-radius: 20px;
  margin-right: 10px;
  margin-top: 10px;
  background: #eee;
  line-height: 45px;
  cursor: pointer;
  white-space: nowrap;
}

.item_footer {
  display: inline;
  padding: 8px 15px;
  border: 1px solid #efefef;
  border-radius: 20px;
  margin-right: 10px;
  margin-top: 10px;
  background: #eee;
  line-height: 45px;
  cursor: pointer;
  white-space: nowrap;
}
</style>
