<template>
  <section class="login-wrapper">
    <div class="login-card">
      <p class="login-title">IPTV</p>
      <el-form :model="loginForm" ref="loginForm" :rules="loginRules">
        <el-form-item prop="user_name">
          <el-input @keyup.enter.native="login_click" v-model.trim="loginForm.user_name" placeholder="Name"></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input @keyup.enter.native="login_click" v-model.trim="loginForm.password" placeholder="Password"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button class="login_btn" type="primary" :loading="loading" @click="login_click">登入</el-button>
        </el-form-item>
      </el-form>
    </div>
  </section>
</template>

<script>
  export default {
    name: 'login',
    data () {
      return {
        loginForm: {
          user_name: '',
          password: ''
        },
        loginRules: {
          user_name: [
            { required: true, message: '请填写Name', trigger: 'change' }
          ],
          password: [
            { required: true, message: '请填写Password', trigger: 'change' }
          ]
        },
        loading: false
      }
    },
    methods: {
      login_click () {
        this.$refs.loginForm.validate((valid) => {
          if(valid) {
            this.axio.post(`user/login`, this.loginForm)
            .then((response) => {
              if(response.data.ret.code === 0) {
                sessionStorage.token = response.data.token
                sessionStorage.name = this.loginForm.user_name
                this.$router.push({path: '/device'})
              }else {
                this.$notify({
                  type: 'error',
                  message: `登录失败: ${this.errLanguage(response)}`
                })
              }
            })
          }
        })
      }
    }
  }
</script>

<style scoped>
  .login-wrapper {
    position: absolute;
    top: 0;
    bottom: 0;
    width: 100%;
    background-color: #33485c;
    padding-top: 2rem;
    background-repeat: no-repeat;
    background-size: contain; 
  }

  .login-card {
    width: 2.56rem;
    margin: auto;
    text-align: center;
    font-size: .24rem;
    color: #3ca0f8;
  }

  .login-title {
    margin-bottom: .4rem;
  }

  .login_btn {
    width: 100%;
    height: .46rem;
    border-radius: .23rem;
    font-size: .23rem;
  }

</style>