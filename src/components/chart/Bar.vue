<template>
  <div class="bar">
    <h4>{{ title }}</h4>
    <div class="chart">
      <v-chart
        :force-fit="true"
        height="312"
        :data="data"
        :padding="[24, 0, 0, 0]"
      >
        <v-tooltip />
        <v-axis />
        <v-bar position="x*y" />
      </v-chart>
    </div>
  </div>
</template>

<script>
  const data = [];
  // for (let i = 0; i < 12; i += 1) {
  //   data.push({
  //     x: `${i + 1}月`,
  //     y: Math.floor(Math.random() * 1000) + 200
  //   })
  // }
  const tooltip = [
    'x*y',
    (x, y) => ({
      name: x,
      value: y,
    }),
  ];

  const scale = [
    {
      dataKey: 'x',
      min: 0,
    },
    {
      dataKey: 'y',
      title: '时间',
      min: 0,
      max: 1000,
    },
  ];
  export default {
    name: 'Bar',
    props: ['title'],
    data() {
      return {
        data,
        scale,
        tooltip,
      };
    },
    created() {
      this.getData();
    },
    methods: {
      async getData() {
        // let data = await this.$request("/blog/get_plan_data", "get", {
        //   type: 2,
        // });
        // console.log("data", data);
        // for(let key in data) {
        //   let val = data[key];
        //   this.data.push({
        //     x: key,
        //     y: val,
        //   });
        // }
      },
    },
  };
</script>

<style scoped lang="less">
  .bar {
  position: relative;
  .chart {
  }
}
</style>
