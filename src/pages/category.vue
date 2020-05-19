<template>
  <div class="category-content">
    <el-table
      ref="categoryTable"
      :data="categoryData"
      >
      <el-table-column
        type="index"
        width="50">
      </el-table-column>
      <el-table-column
        property="name"
        label="分类名"
        width="120">
      </el-table-column>
      <el-table-column
        property="description"
        label="描述"
        width="400">
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
    <el-dialog title="修改分类信息" :visible.sync="dialogFormVisible">
      <el-form :model="dialogData">
        <el-form-item label="分类名" :label-width="formLabelWidth">
          <el-input v-model="dialogData.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="描述" :label-width="formLabelWidth">
          <el-input v-model="dialogData.description" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="分类主题图" :label-width="formLabelWidth">
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
import { getCategories, upLoadImg, updateCategory, deleteCategory } from '@/api/api'
import { baseImgUrl } from '@/api/http'
export default {
  data () {
    return {
      categoryData: [],
      dialogData: {},
      baseImgUrl: baseImgUrl,
      dialogFormVisible: false,
      formLabelWidth: '120px',
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    }
  },
  created () {
    this.getCategories()
  },
  methods: {
    submitForm () {
      this.dialogFormVisible = false
      const { id, name, description, headImg } = this.dialogData
      updateCategory({
        id,
        name,
        description,
        head_img_id: headImg.id
      }).then(res => {
        if (res.errcode === 0) {
          this.$message.success('修改成功')
        } else {
          this.$message.error('修改失败')
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
    handleUpload (file) {
      var formdata = new FormData()
      formdata.append('file', file.file)
      upLoadImg(formdata).then(res => {
        if (res.errcode === 0 && res.image) {
          this.dialogData.headImg = res.image
          this.dialogData.imageUrl = baseImgUrl + res.image.url
        }
      })
    },
    handleEdit (index, row) {
      this.dialogData = row
      this.dialogFormVisible = true
    },
    handleDelete (index, row) {
      deleteCategory({
        id: row.id
      }).then(res => {
        this.getCategories()
        this.$message.success('删除成功')
      })
    },
    getCategories () {
      this.categoryData = []
      getCategories().then(res => {
        if (res.errcode === 0 && res.categories.length > 0) {
          res.categories.forEach(item => {
            item.imageUrl = baseImgUrl + item.headImg.url
            this.categoryData.push(item)
          })
        }
      })
    }
  }
}
</script>

<style lang="stylus" scoped>
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
