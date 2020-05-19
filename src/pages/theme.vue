<template>
  <div class="theme-content">
    <el-table
      ref="themeTable"
      :data="themeData"
      >
      <el-table-column
        type="index"
        width="50">
      </el-table-column>
      <el-table-column
        property="name"
        label="专题名称"
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
        <el-form-item label="专题名称" :label-width="formLabelWidth">
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
import { getThemes } from '@/api/api'
export default {
  data () {
    return {
      themeData: [],
      dialogData: {},
      dialogFormVisible: false
    }
  },
  created () {
    getThemes().then(res => {
      console.log(res)
    })
  },
  methods: {}
}
</script>
