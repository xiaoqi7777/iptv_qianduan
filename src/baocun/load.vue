<template>
    <div class="laod">
        <br/>
        <br/>
        <br/>
        <br/>
        <br/>
        <br/>
        <br/>
        <br/>
           <el-container
                v-loading="loading2"
                element-loading-text="拼命加载中"
                element-loading-spinner="el-icon-loading"
                style="width: 100%">
                
            </el-container>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                
                loading2: true
            };
            }
    }
</script>

<style scoped>
.laod{
    position: relative;
    width: 1077px;
    height: 457px;
    background-color: black;
}
.title{
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    margin: auto;
    color: papayawhip;
    
}
</style>