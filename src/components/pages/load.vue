<template>
<el-dialog
  title="提示"
  :visible.sync="dialogVisible"
      top="5vh"
  :before-close="handleClose">
  <load1/>
</el-dialog>
</template>

<script>
import load1 from './load'
    export default {
      components:{
        load1
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
          console.log(this.show)
        }

    }
</script>

<style scoped>

</style>
