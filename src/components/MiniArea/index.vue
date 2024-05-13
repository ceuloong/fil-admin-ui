<template>
  <div class="antv-chart-mini">
    <div class="chart-wrapper" :style="{ height: 46 }">
      <v-chart :force-fit="true" :height="height" :data="arr" :padding="[36, 0, 18, 0]">
        <v-tooltip />
        <v-smooth-area position="x*y" />
      </v-chart>
    </div>
  </div>
</template>

<script>
// import moment from 'moment'
// const data = []
// const beginDay = new Date().getTime()
// for (let i = 0; i < 10; i++) {
//   data.push({
//     x: moment(new Date(beginDay + 1000 * 60 * 60 * 24 * i)).format('YYYY-MM-DD'),
//     y: Math.round(Math.random() * 10)
//   })
// }
const tooltip = [
  'x*y',
  (x, y) => ({
    name: x,
    value: y
  })
]
const scale = [{
  dataKey: 'x',
  min: 2
}, {
  dataKey: 'y',
  title: '时间',
  min: 1,
  max: 22
}]
export default {
  name: 'MiniArea',
  props: {
    title: {
      type: String,
      default: ''
    },
    list: {
      type: Array,
      default: () => {}
    }
  },
  data() {
    return {
      arr: [],
      tooltip,
      scale,
      height: 100
    }
  },
  mounted() {
    setTimeout(_ => {
      this.arr = this.list
    }, 300)
  }
}
</script>

<style lang="scss" scoped>
  .antv-chart-mini {
  position: relative;
  width: 100%;

  .chart-wrapper {
    position: absolute;
    bottom: -28px;
    width: 100%;

/*    margin: 0 -5px;
    overflow: hidden;*/
  }
}
</style>
