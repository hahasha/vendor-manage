<template>
  <div class="product-content">
    <el-table
      ref="productTable"
      :data="productData"
      v-loading="loading"
      >
      <el-table-column type="expand">
        <template v-slot="props">
          <el-form label-position="left" inline class="table-expand">
            <el-form-item label="商品名称">
              <span>{{ props.row.name }}</span>
            </el-form-item>
            <el-form-item label="商品价格">
              <span>{{ props.row.price }}</span>
            </el-form-item>
            <el-form-item label="商品库存">
              <span>{{ props.row.stock }}</span>
            </el-form-item>
            <el-form-item label="商品分类">
              <span>{{ props.row.category }}</span>
            </el-form-item>
            <el-form-item label="商品简介">
              <span>{{ props.row.summary || '无' }}</span>
            </el-form-item>
            <el-form-item label="商品属性">
              <ul class="propertyList" v-if="props.row.properties.length > 0">
                <li v-for="(item, index) in props.row.properties" :key="index">
                  <span>{{item.name}}：{{item.detail}}</span>
                </li>
              </ul>
              <span v-else>无</span>
            </el-form-item>
          </el-form>
        </template>
      </el-table-column>
      <el-table-column
        property="id"
        label="商品ID"
        width="100">
      </el-table-column>
      <el-table-column
        property="name"
        label="商品名称"
        width="200">
      </el-table-column>
      <el-table-column
        property="price"
        label="价格"
        width="160">
      </el-table-column>
      <el-table-column
        property="stock"
        label="库存"
        width="160">
      </el-table-column>
      <el-table-column
        property="category"
        label="商品分类"
        width="160">
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button
            size="mini"
            @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
          <el-button
            size="mini"
            type="danger"
            @click="handleDelete(scope.$index, scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :page-sizes="[10, 20]"
      :page-size="pageSize"
      :current-page="currentPage"
      layout="total, sizes, prev, pager, next"
      :total="totalCount">
    </el-pagination>
    <el-dialog title="修改商品信息" :visible.sync="dialogFormVisible">
      <el-form :model="dialogData">
        <el-form-item label="商品名称" :label-width="formLabelWidth">
          <el-input v-model="dialogData.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="价格" :label-width="formLabelWidth">
          <el-input v-model="dialogData.price" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="库存" :label-width="formLabelWidth">
          <el-input v-model="dialogData.stock" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="商品图" :label-width="formLabelWidth">
          <el-upload
            action=""
            class="img-uploader"
            :http-request="handleUpload"
            :show-file-list="false"
            :headers="headers"
            :before-upload="handleBeforupload"
            >
            <img v-if="dialogData.imageUrl" :src="dialogData.imageUrl" class="img">
            <i v-else class="el-icon-plus img-uploader-icon"></i>
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitForm">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getProducts } from '@/api/api'
export default {
  data () {
    return {
      productData: [],
      pageSize: 10,
      currentPage: 1,
      totalCount: 0,
      dialogFormVisible: false,
      dialogData: {},
      formLabelWidth: '120px',
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    }
  },
  computed: {
    loading () {
      return !this.productData.length
    }
  },
  created () {
    this.getProducts()
  },
  methods: {
    handleSizeChange (val) {
      this.pageSize = val
      this.getProducts(this.currentPage, val)
    },
    handleCurrentChange (val) {
      this.currentPage = val
      this.getProducts(val, this.pageSize)
    },
    handleUpload () {},
    handleBeforupload () {},
    submitForm () {},
    getProducts (page, limit) {
      this.productData = []
      getProducts({
        page,
        limit
      }).then(res => {
        if (res.errcode === 0 && res.products.count > 0) {
          this.totalCount = res.products.count
          res.products.rows.forEach(item => {
            item.category = item.category.name
            this.productData.push(item)
          })
        }
      })
    }
  }
}
</script>

<style lang="stylus" scoped>
  >>>.table-expand label
    width 90px
    color #99a9bf
  .table-expand .el-form-item
    margin-right 0
    margin-bottom 0
    width 100%
  .table-expand .propertyList
    margin 0
    padding 0
  .el-pagination
    margin-top 20px
  .img-uploader .el-upload
    border: 1px dashed #d9d9d9
    border-radius: 6px
    cursor: pointer
    position: relative
    overflow: hidden
  .img-uploader .el-upload:hover
    border-color: #409EFF
  .img-uploader-icon
    font-size: 28px
    color: #8c939d
    width: 178px
    height: 178px
    line-height: 178px
    text-align: center
  .img
    width: 100%
    height: 178px
    display: block
</style>
