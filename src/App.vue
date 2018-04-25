<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'App',
  mounted () {
    if(sessionStorage.token) {
      this.$router.push('/device')
    }else {
      this.$router.push('/login')
    }
  }
}
</script>

<style>
html {
  font-size: 100px;
}
body, div, span, header, footer, nav, section, aside, article, ul, dl, dt, dd, li, a, p, h1, h2, h3, h4, h5, h6, i, b, textarea, button, input, select, figure, figcaption {
    padding: 0;
    margin: 0;
    list-style: none;
    font-style: normal;
    text-decoration: none;
    border: none;
    font-family: "Microsoft YaHei"; 
    box-sizing: border-box;
    -webkit-tap-highlight-color:transparent;
    -webkit-font-smoothing: antialiased;
    -webkit-touch-callout: none;
}
*:not(input) {
  -webkit-user-select: none;
  -khtml-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none; 
}
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

.login-wrapper .el-input__inner {
  height: .4rem;
  border-radius: .2rem;
  background-color: #2a3950;
  border: 0;
  color: #97a8bd; 
  padding: .03rem .25rem;
}

.login-wrapper .el-input__inner::-webkit-input-placeholder {
  color: #5d6473;
}

.login-wrapper .el-input__inner::-ms-input-placeholder {
  color: #5d6473;
}

.login-wrapper .el-input__inner::-moz-input-placeholder {
  color: #5d6473;
}

.el-menu-item:hover {
    background-color: #2a394f;
}

.el-menu-item.is-active {
    background-color: #2a394f;
    color: #fff;
}

.tool_title {
  height: .7rem;
  line-height: .7rem;
  font-size: .24rem;
  padding: 0 .4rem;
  background-color: #eef2f8;
  border-bottom: .02rem solid #e1e5ed;
  text-align: left;
}

.device_toolbtn {
  width: 1.2rem;
  height: .34rem;
  margin-top: .18rem;
  margin-left: .1rem;
  float: right;
  background-size: cover;
  background-color: #eef2f8;
  border: 0;
}

.device_search {
  margin-top: .22rem;
  background-image: url('./assets/btn_search.png');
}

.toolbar {
    height: .78rem;
    background-color: #eef2f8;
    padding: 0 .2rem;
}

.toolbar .el-form-item {
  margin-bottom: 0;
}

.toolbar .el-form-item__content {
  line-height: .78rem;
}

.table_wrapper {
  padding: .2rem .2rem 0;
  background-color: #d7dbe6;
}

.table_list:before {
  height: 0;
}

/*分页插件样式修改*/
.el-pagination {
    width: 100%;
    font-size: 0;
    text-align: right;
    padding: .15rem .2rem;
    background-color: #ecf0f8;
    border-top: 0;
}

.el-pagination__jump {
  margin-right: .1rem;
}

.el-pagination .btn-next, .el-pagination .btn-prev {
  background: #ecf0f8;
}

.el-pagination button.disabled {
  background: #ecf0f8;
}

.el-pagination .btn-next, .el-pagination .btn-prev {
  border: 0 ;
}

.table_list_btn {
  width: .4rem;
  height: .4rem;
  border: 0;
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
  background-color: transparent; 
}

.table_edit {
    background-image: url('./assets/btn_edit_a.png') !important;
}

.table_edit.is-disabled {
    background-image: url('./assets/btn_edit.png') !important;
}

.table_delete {
    background-image: url('./assets/btn_delete_a.png') !important;
}

.table_delete.is-disabled {
    background-image: url('./assets/btn_delete.png') !important;
}

.device_ssh {
    background-image: url('./assets/btn_ssh_a.png') !important;
}

.device_ssh.is-disabled {
    background-image: url('./assets/btn_ssh.png') !important;
}

.device_channelList {
  background-image: url('./assets/btn_playlist_a.png') !important;
}

.device_channelList.is-disabled {
  background-image: url('./assets/btn_playlist.png') !important;
}

.device_dibblingList {
  background-image: url('./assets/btn_list.png') !important;
}

.el-dialog__header {
  font-size: 0;
}

.device_control_transcode {
  width: 1000px;
}

.device_control_transcode .el-dialog__header {
  padding: .15rem .2rem;
}

.device_control_transcode .el-dialog__body {
  position: relative;
  padding: 0 .2rem;
  min-height: 6.33rem;
}

.devide_ssh .el-dialog__body {
  padding: .2rem .2rem;
}

.status_css {
  height: .4rem;
  background-image: url('./assets/icon_sml_state_green.png');
  background-size: .16rem .16rem;
  background-repeat: no-repeat;
  background-position: center;
}

.status_css_red {
  background-image: url('./assets/icon_sml_state_red.png');
}

.el-message-box__header .el-message-box__headerbtn {
  font-size: .25rem;
  line-height: 1;
}

.device_add {
  background-image: url('./assets/btn_addnew_a.png');
}

.video-js {
  width: 100% !important;
}

.el-message-box__title > span {
  display: inline-block;
  vertical-align: text-bottom;
  width: 80%;
  overflow: hidden;
  text-overflow:ellipsis;
  white-space: nowrap;
}

.version_css {
  background-color: #33485c;
  color: #fff;
  border-color: #2a3950;
}
.el-popover__title {
  color: #fff;
}

.tool_back {
  background-color: #409EFF;
}

</style>
