<template>
  <div class="hello">
    <el-pagination
        @current-change="handleCurrentChange"
        :current-page.sync="currentPage"
        layout="prev, jumper, next"
        >
        </el-pagination>
  </div>
</template>

<script>
export default {
  name: 'HelloWorld',
  data () {
    return {
currentPage: 1
    }
  },
  methods: {
handleCurrentChange () {

}
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
