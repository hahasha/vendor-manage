<template>
  <div class="theme-content">
    <el-table
      ref="themeTable"
      :data="themeData"
      >
      <el-table-column
        type="index"
        width="80">
      </el-table-column>
      <el-table-column
        property="name"
        label="专题名称"
        width="200">
      </el-table-column>
      <el-table-column
        property="description"
        label="描述"
        width="300">
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
        <el-form-item label="专题名称" :label-width="formLabelWidth">
          <el-input v-model="dialogData.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="描述" :label-width="formLabelWidth">
          <el-input v-model="dialogData.description" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="专题展示图" :label-width="formLabelWidth">
          <el-upload
            action=""
            class="img-uploader"
            :http-request="handleUpload"
            :show-file-list="false"
            :headers="headers"
            :before-upload="handleBeforupload"
            >
            <img v-if="dialogData.topicImgUrl" :src="dialogData.topicImgUrl" class="img">
            <i v-else class="el-icon-plus img-uploader-icon"></i>
          </el-upload>
        </el-form-item>
        <el-form-item label="专题主题图" :label-width="formLabelWidth">
          <el-upload
            action=""
            class="img-uploader"
            :http-request="handleUpload"
            :show-file-list="false"
            :headers="headers"
            :before-upload="handleBeforupload"
            >
            <img v-if="dialogData.headImgUrl" :src="dialogData.headImgUrl" class="img">
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
import { getThemes, deleteTheme } from '@/api/api'
import { baseImgUrl } from '@/api/http'
export default {
  data () {
    return {
      themeData: [],
      dialogData: {},
      dialogFormVisible: false,
      formLabelWidth: '120px',
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    }
  },
  created () {
    this.getThemes()
  },
  methods: {
    handleEdit (index, row) {
      this.dialogFormVisible = true
      this.dialogData = row
      console.log(this.dialogData)
    },
    handleDelete (index, row) {
      this.$confirm('确定删除该专题吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteTheme({
          id: row.id
        }).then(res => {
          if (res.errcode === 0) {
            this.$message.success('删除成功')
            this.getThemes()
          }
        })
      })
    },
    handleUpload () {},
    handleBeforupload () {},
    submitForm () {},
    getThemes () {
      this.themeData = []
      getThemes().then(res => {
        if (res.errcode === 0) {
          res.themes.forEach(item => {
            item.headImgUrl = baseImgUrl + item.head_img.url
            item.topicImgUrl = baseImgUrl + item.topic_img.url
            this.themeData.push(item)
          })
        }
      })
    }
  }
}
</script>

<style lang="stylus" scoped>
  .img
    width: 100%
</style>
