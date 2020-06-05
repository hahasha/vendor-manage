<template>
  <el-container class="manage-container">
    <el-aside>
      <el-menu
        class="nav-bar"
        background-color="#324057"
        text-color="#fff"
        :default-active="defaultActive"
        @select="selectHandler"
        >
        <el-submenu index="home">
          <template slot="title"><i class="el-icon-s-home"></i>首页</template>
            <el-menu-item index="home">首页</el-menu-item>
        </el-submenu>
        <el-submenu index="category">
          <template slot="title"><i class="el-icon-menu"></i>分类管理</template>
            <el-menu-item index="category">分类列表</el-menu-item>
            <el-menu-item index="addCategory">添加分类</el-menu-item>
        </el-submenu>
        <el-submenu index="product">
          <template slot="title"><i class="el-icon-potato-strips"></i>商品管理</template>
            <el-menu-item index="product">商品列表</el-menu-item>
            <el-menu-item index="addProduct">添加商品</el-menu-item>
        </el-submenu>
        <el-submenu index="theme">
          <template slot="title"><i class="el-icon-lollipop"></i>专题管理</template>
            <el-menu-item index="theme">专题列表</el-menu-item>
            <el-menu-item index="addTheme">添加专题</el-menu-item>
        </el-submenu>
        <el-submenu index="illustration">
          <template slot="title"><i class="el-icon-info"></i>说明</template>
            <el-menu-item index="illustration">说明</el-menu-item>
        </el-submenu>
      </el-menu>
    </el-aside>
    <el-container>
      <el-header>
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item v-for="(item,index) in $route.meta.title" :key="index">{{item}}</el-breadcrumb-item>
        </el-breadcrumb>
        <el-dropdown @command="logout">
        <span class="el-dropdown-link">
          <img class="avatar" src="../../public/images/avatar.jpg" alt="">
        </span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item command="logout">退出登录</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
      </el-header>
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import { mapMutations } from 'vuex'
export default {
  data () {
    return {
    }
  },
  created () {
    console.log()
    // this.defaultActive = this.$route.name
  },
  computed: {
    defaultActive () {
      return this.$route.name
    }
  },
  methods: {
    selectHandler (index) {
      const path = index === 'home' ? '' : index
      this.$router.push('/' + path)
    },
    logout (command) {
      if (command === 'logout') {
        this.setToken(null)
        this.$router.push('login')
        this.$message.success('退出成功')
      }
    },
    ...mapMutations({
      setToken: 'SET_TOKEN'
    })
  }
}
</script>

<style lang="stylus" scoped>
@import '~@/assets/css/index'
.manage-container
  min-height 100%
  .nav-bar
    min-height 100%
  .el-header
    display flex
    align-items center
    justify-content space-between
    height 8vh
    background-color #f0f2f5
    color #333
    border-bottom 1px solid #dfe1e5
    font-size: 12px
    .avatar
      width 36px
      height 36px
      border-radius 50%
  .el-main
    height 92vh
    overflow-x hidden
</style>
