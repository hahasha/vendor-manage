<template>
  <div class="inof-content">
    <ul class="introduce">
      <li>该项目是一个基于Vue + Element UI的商城后台管理系统</li>
      <li><el-link :href="href" type="primary">对应前端项目地址传送</el-link></li>
    </ul>
  </div>
</template>

<script>
export default {
  data () {
    return {
      href: 'http://www.liusha.ltd/vendor/#'
    }
  }
}
</script>

<style lang="stylus" scoped>
.introduce
  width 100%
  li
    text-align center
    font-size 16px
    color #333
    margin-bottom 20px
  .el-link
    font-size 16px
</style>
