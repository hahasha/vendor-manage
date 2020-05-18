<template>
  <div class="login-page">
    <div class="login-container">
      <h1 class="login-title">vendor后台管理系统</h1>
      <div class="login-wrap">
        <el-form :model="formData" :rules="rules" ref="loginForm">
          <el-form-item prop="username">
            <el-input class="fm-input" placeholder="用户名" v-model="formData.username"></el-input>
          </el-form-item>
          <el-form-item prop="password">
            <el-input class="fm-input" type="password" placeholder="密码" v-model="formData.password"></el-input>
          </el-form-item>
          <el-button class="fm-btn" @click="loginHandler('loginForm')">登录</el-button>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
import { login } from '@/api/api'
import { mapMutations } from 'vuex'
export default {
  data () {
    return {
      formData: {
        username: '',
        password: ''
      },
      rules: {
        username: [
          { required: true, message: '请输入登录名', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    loginHandler (formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          login({
            username: this.formData.username,
            password: this.formData.password
          }).then(res => {
            const { errcode, token } = res
            if (errcode === 0) {
              this.setToken(token)
              this.$message.success('登录成功')
              this.$router.push('/manage')
            } else {
              this.$message.error('登录失败')
            }
          })
        }
      })
    },
    ...mapMutations({
      setToken: 'SET_TOKEN'
    })
  }
}
</script>

<style lang="stylus" scoped>
@import '~@/assets/css/index'

.login-page {
  background: $color-background
  min-height: 100%
}
.login-container {
  position: fixed
  width: 370px
  left: 0
  right: 0
  top: 50%
  transform: translateY(-60%)
  margin: auto
  .login-title {
    font-size: 32px
    font-weight: 200
    color: #fff
    text-align: center
  }
  .login-wrap {
    box-sizing: border-box
    width: 100%
    background: #fff
    border-radius: 6px
    padding: 27px
    margin-top: 56px
    .fm-btn {
      width: 100%
      background: #20a0ff
      border-radius: 4px
      font-size: 18px
      color: #fff
    }
  }
}
</style>
