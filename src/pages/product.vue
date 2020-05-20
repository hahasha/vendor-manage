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
    <el-dialog title="修改商品信息" :visible.sync="dialogFormVisible" @close="handleDialogClose">
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
          <imgDrag
            :fileList="detailList"
            @dragEvent="getNewList"
            ></imgDrag>
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
import imgDrag from '@/components/imgDrag/imgDrag'
import { getProducts, getCategories, getThemes, updateProduct, upLoadImg, deleteProduct } from '@/api/api'
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
      detailList: [], // 商品详情图列表
      categories: [],
      themes: [],
      formLabelWidth: '120px',
      newImgList: [], // 接受子组件修改后的商品详情列表
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
    getNewList (newList) {
      this.newImgList = newList
    },
    handleUpload (file) {
      var formdata = new FormData()
      formdata.append('file', file.file)
      upLoadImg(formdata).then(res => {
        if (res.errcode === 0 && res.image) {
          // 更新商品展示图信息
          this.dialogData.main_img_url = res.image.url
          this.dialogData.img_id = res.image.id
          this.dialogData.imageUrl = baseImgUrl + res.image.url
        }
      })
    },
    handleBeforupload (file) {
      const isType = file.type === 'image/jpeg' || file.type === 'image/png'
      const isLt2M = file.size / 1024 / 1024 < 2
      if (!isType) {
        this.$message.error('上传图片只能是 JPG 或 PNG 格式!')
      }
      if (!isLt2M) {
        this.$message.error('上传图片大小不能超过 2MB!')
      }
      return isType && isLt2M
    },
    submitForm () {
      this.dialogFormVisible = false
      const newCategory = this.categories.filter(item => item.name === this.dialogData.category)[0]
      const newThemes = this.themes.filter(item => this.dialogData.themeArr.some(theme => theme === item.name))
      const { id, price, name, stock, summary } = this.dialogData
      updateProduct({
        id,
        price,
        name,
        stock,
        summary,
        img_id: this.dialogData.img_id,
        main_img_url: this.dialogData.main_img_url,
        category_id: newCategory.id,
        themeList: newThemes,
        imgList: this.newImgList
      }).then(res => {
        if (res.errcode === 0) {
          this.$message.success('修改成功')
        } else {
          this.$message.eeror('修改失败')
        }
      })
    },
    handleDialogClose () {
      // dialog关闭时触发，用来清空detailList数据
      this.detailList.splice(0, this.detailList.length) // 数组的响应式更新
    },
    handleEdit (index, row) {
      this.dialogFormVisible = true
      this.dialogData = row
      this.getdetailList(row.images) // 打开dialog时，获取格式化的detailList
    },
    handleDelete (index, row) {
      this.$confirm('确定删除该商品吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteProduct({
          id: row.id
        }).then(res => {
          if (res.errcode === 0) {
            this.getProducts()
            this.$message.success('删除成功')
          }
        })
      }).catch(() => {})
    },
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
            item.imageUrl = baseImgUrl + item.main_img_url // 格式化商品展示图url
            item.themes.forEach(theme => {
              item.themeArr.push(theme.name) // 格式化专题数组
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
    },
    getdetailList (imgList) {
      imgList.forEach(item => {
        const img = {
          id: item.id,
          order: item.orderBy.order,
          url: baseImgUrl + item.url
        }
        this.detailList.push(img)
      })
      this.detailList.sort(compareFn('order'))
    }
  },
  components: {
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
