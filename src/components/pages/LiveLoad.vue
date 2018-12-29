<template>
<el-dialog
  title="正在加载中,请等待"
  :visible.sync="dialogVisible"
      top="5vh"
  :before-close="handleClose">
  <Load/>
</el-dialog>
</template>

<script>
import Load from "./Load";
export default {
  components: {
    Load
  },
  props: ["show"],
  data() {
    return {
      dialogVisible: true
    };
  },
  methods: {
    handleClose() {
      this.$emit("update:show", false);
    }
  }
};
</script>

<style scoped>
</style>
