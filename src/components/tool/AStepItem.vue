<template>
  <div :class="['step-item', link ? 'linkable' : null]" @click="go">
    <span :style="titleStyle">{{ title }}</span>
    <a-icon v-if="icon" :style="iconStyle" :type="icon" />
    <slot></slot>
  </div>
</template>

<script>
  const Group = {
    name: 'AStepItemGroup',
    props: {
      align: {
        type: String,
        default: 'center',
        validator(value) {
          return ['left', 'center', 'right'].indexOf(value) != -1;
        },
      },
    },
    render(h) {
      return h(
        'div',
        { attrs: { style: `text-align: ${this.align}; margin-top: 8px` } },
        [
          h(
            'div',
            { attrs: { style: 'text-align: left; display: inline-block;' } },
            [this.$slots.default]
          ),
        ]
      );
    },
  };

  export default {
    name: 'AStepItem',
    Group: Group,
    props: ['title', 'icon', 'link', 'titleStyle', 'iconStyle'],
    methods: {
      go() {
        const link = this.link;
        if (link) {
          this.$router.push(link);
        }
      },
    },
  };
</script>

<style lang="less" scoped>
  .step-item {
  cursor: pointer;
}
:global {
  .ant-steps-item-process {
    .linkable {
      color: @primary-color;
    }
  }
}
</style>
