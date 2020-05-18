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
        <el-form-item label="商品名称" :label-width="formLabelWidth" required>
          <el-input v-model="dialogData.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="商品价格" :label-width="formLabelWidth" required>
          <el-input v-model="dialogData.price" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="商品库存" :label-width="formLabelWidth" required>
          <el-input v-model="dialogData.stock" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="商品分类" :label-width="formLabelWidth">
          <el-select v-model="dialogData.category" placeholder="请选择活动区域">
            <el-option
              v-for="item in categories"
              :key="item.id"
              :label="item.name"
              :value="item.name"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="商品简介" :label-width="formLabelWidth">
          <el-input v-model="dialogData.summary" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="商品专题" :label-width="formLabelWidth">
          <el-checkbox-group v-model="dialogData.themeArr">
            <el-checkbox v-for="item in themes" :key="item.id" :label="item.name" name="theme"></el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="商品展示图" :label-width="formLabelWidth">
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
        <el-form-item label="商品详情图" :label-width="formLabelWidth">
          <!-- <el-upload
            class="uploaders"
            action=""
            :on-preview="handlePreview"
            :on-remove="handleRemove"
            :file-list="fileList"
            list-type="picture">
          </el-upload> -->
          <!-- <imgUpload v-model="fileList"/> -->
          <imgDrag :fileList="fileList"></imgDrag>
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
// import imgUpload from '@/components/imgUpload/imgUpload'
import imgDrag from '@/components/imgDrag/imgDrag'
import { getProducts, getCategories, getThemes } from '@/api/api'
import { baseImgUrl } from '@/api/http'
function compareFn (key) {
  return function (a, b) {
    const value1 = a[key]
    const value2 = b[key]
    return value1 - value2
  }
}
export default {
  data () {
    return {
      productData: [],
      pageSize: 10,
      currentPage: 1,
      totalCount: 0,
      dialogFormVisible: false,
      dialogData: {},
      categories: [],
      themes: [],
      fileList: [],
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
    this.getCategories()
    this.getThemes()
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
    handleRemove (file, fileList) {
      console.log(file, fileList)
    },
    handlePreview (file) {
      console.log(file)
    },
    submitForm () {},
    handleEdit (index, row) {
      this.dialogFormVisible = true
      this.dialogData = row
      row.images.forEach(item => {
        const obj = {}
        obj.id = item.id
        obj.order = item.orderBy.order
        obj.url = baseImgUrl + item.url
        this.fileList.push(obj)
      })
      this.fileList = this.fileList.sort(compareFn('order'))
    },
    handleDelete (index, row) {},
    getProducts (page, limit) {
      this.productData = []
      getProducts({
        page,
        limit
      }).then(res => {
        if (res.errcode === 0 && res.products.count > 0) {
          this.totalCount = res.products.count
          res.products.rows.forEach(item => {
            item.themeArr = []
            item.category = item.category.name
            item.imageUrl = baseImgUrl + item.main_img_url
            item.themes.forEach(theme => {
              item.themeArr.push(theme.name)
            })
            this.productData.push(item)
          })
        }
      })
    },
    getCategories () {
      getCategories().then(res => {
        if (res.errcode === 0) {
          this.categories = res.categories
        }
      })
    },
    getThemes () {
      getThemes().then(res => {
        if (res.errcode === 0) {
          this.themes = res.themes
        }
      })
    }
  },
  components: {
    // imgUpload,
    imgDrag
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
    width: 160px
    height: 160px
    display: block
</style>
