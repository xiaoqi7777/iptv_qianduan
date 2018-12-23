<template>
<el-dialog
  title="提示"
  :visible.sync="dialogVisible"
      top="5vh"
  :before-close="handleClose">
  <Load/>
</el-dialog>
</template>

<script>
import Load from './Load'
    export default {
      components:{
        Load
      },
      props:['show'],
        data() {
            return {
                dialogVisible: true
              };
            },
        methods:{
          handleClose(){
            this.$emit('update:show',false)
          }
        },
        mounted(){
          // console.log(this.show)
        }

    }
</script>

<style scoped>

</style>
