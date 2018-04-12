<template>
  <section class="home-wrapper">
    <aside class="menu">
      <div class="menu-title">IPTV
        <el-popover
          ref="version"
          placement="right"
          width="200"
          trigger="click"
          popper-class="version_css">
          <p>软件版本: V {{soft_version}}</p>
          <p>后台版本: V {{cloud_version}}</p>
        </el-popover>
        <el-button type="text" style="padding: 0;" circle icon="el-icon-info" v-popover:version></el-button>
      </div>
      <el-menu class="menu-wrapper" :default-active="$route.name === 'channel' ? '/device' : $route.path" router>
        <el-menu-item v-for="(item, index) in $router.options.routes[0].children"
          :key="index"
          :index="item.path"
           v-if="!item.hidden">
           {{item.meta.title}}
        </el-menu-item>
      </el-menu>
      <div class="menu-user">
        <ul class="menu-user-icon" >
            <li v-for="item in user_icons" @click.stop="userHandle(item.name)" class="user-icon-list" :class="item.name"></li>
        </ul>
        <div class="menu-user-name">{{user_name}}</div>
      </div>
    </aside>
    <div class="content-wrapper">
      <router-view></router-view>
    </div>
    <dialogPassword v-if="dialogPassword" :show.sync="dialogPassword"></dialogPassword>
  </section>
</template>

<script>

  import dialogPassword from './pages/DialogPassword.vue'

  export default {
    name: 'home',
    components: {
      dialogPassword
    },
    mounted () {
      let self = this
      this.user_name = sessionStorage.name
      document.addEventListener('click', function() {
          self.user_icons = [
              { name: 'user_css' },
          ]
      })
      this.axio.get(`system/version`)
      .then((response) => {
        if(response.data.ret.code === 0) {
          this.cloud_version = response.data.data.version
        }
      })
    },
    data () {
      return {
        cloud_version: '',
        user_name: '',
        user_icons: [
          { name: 'user_css' },
        ],
        dialogPassword: false
      }
    },
    methods: {
      userHandle (name) {
        switch (name) {
          case 'user_css':
              if(this.user_icons.length > 1) {
                  this.user_icons = [
                      { name: 'user_css' },
                  ]
              }else {
                  this.user_icons = [
                      { name: 'logout_css' },
                      { name: 'password_css' },
                      { name: 'user_css' },
                  ]
              }
              
            break;
          case 'password_css':
              this.dialogPassword = true
            break;
          case 'logout_css':
              this.changeUserSign ()
            break;
        }
      },
      changeUserSign () {
        this.$router.replace({
            path: '/login',
        })
      }
    },
  }
</script>

<style scoped>
  .home-wrapper {
    display: flex;
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    overflow: hidden;
  }

  .menu {
    position: relative;
    flex:0 0 2.67rem;
    width: 2.67rem;
    background-color: #37495f;
  }

  .menu-title {
    font-size: .24rem;
    text-align: center;
    color: #fefefe;
    padding: .18rem 0;
  }


  .menu-wrapper {
    width: 2.67rem;
    background-color: #33485c;
    height: calc(100% - 1.51rem);
    color: #fff;
    border-radius: 0;
    overflow: auto;
  }

  .el-menu-item {
    color: #fff;
    font-size: .16rem;
    height: .78rem;
    line-height: .78rem;
    text-align: center;
    background-repeat: no-repeat;
    background-size: .52rem .52rem;
    background-position: .3rem .12rem;
    padding-left: 0 !important;
  }

  .content-wrapper {
    flex: 1;
    overflow-y: scroll;
    background-color: #d7dbe6;
  }

  .menu-user {
        position: absolute;
        bottom: 0;
        width: 100%;
        line-height: .78rem;
        display: flex;
        text-align: center;
        color: #bdc0c5;
    }
    .menu-user-icon {
        width: .78rem;
        border-right: 1px solid #315b7e;
        border-top: .05rem solid #27abff;
        background-color: #304058;
    }
    .menu-user-name {
        position: absolute;
        right: 0;
        bottom: 0;
        width: calc(100% - .78rem);
        height: .78rem;
        line-height: .78rem;
        background-color: #2a394f;
        font-size: .24rem;
    }
    .user-icon-list {
        height: .78rem;
        background-repeat: no-repeat;
        background-position: center;
    }
    .user_css {
        background-image: url('../assets/icon_me.png');
    }
    .password_css {
        background-image: url('../assets/icon_key.png');
    }
    .logout_css {
        background-image: url('../assets/icon_logout.png');
    }
  
</style>