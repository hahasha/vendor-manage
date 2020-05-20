<template>
  <div class="inof-content">
    <ul class="introduce">
      <li>该项目是一个基于Vue + Element UI的商城后台管理系统</li>
      <li><el-link :underline="false" type="primary">对应前端项目地址传送</el-link></li>
      <li><el-link :underline="false" type="primary">对应后台系统地址传送</el-link></li>
    </ul>
  </div>
</template>

<style lang="stylus" scoped>
.introduce
  width 100%
  li
    text-align center
    font-size 16px
    line-height 40px
    color #333
  .el-link
    font-size 16px
</style>
