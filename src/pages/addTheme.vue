<template>
  <div class="add-theme-content">
    <el-form :model="formData" :rules="rules" ref="formData" label-width="100px" class="formData">
      <el-form-item label="专题名称" prop="name">
        <el-input v-model="formData.name"></el-input>
      </el-form-item>
      <el-form-item label="专题描述" prop="description">
        <el-input v-model="formData.description"></el-input>
      </el-form-item>
      <el-form-item label="专题展示图" prop="topicImgUrl">
        <el-upload
          action=""
          class="img-uploader"
          :http-request="handleTopicImgUpload"
          :show-file-list="false"
          :headers="headers"
          :before-upload="handleBeforupload"
          :limit="1"
          accept=".jpg,.jpeg,.png,.gif"
          >
          <img v-if="formData.topicImgUrl" :src="formData.topicImgUrl" class="img">
          <i v-else class="el-icon-plus img-uploader-icon"></i>
        </el-upload>
      </el-form-item>
      <el-form-item label="专题主题图" prop="headImgUrl">
        <el-upload
          action=""
          class="img-uploader"
          :http-request="handleHeadImgUpload"
          :show-file-list="false"
          :headers="headers"
          :before-upload="handleBeforupload"
          :limit="1"
          accept=".jpg,.jpeg,.png,.gif"
          >
          <img v-if="formData.headImgUrl" :src="formData.headImgUrl" class="img">
          <i v-else class="el-icon-plus img-uploader-icon"></i>
        </el-upload>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm('formData')">立即创建</el-button>
        <el-button @click="resetForm('formData')">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { upLoadImg, addTheme } from '@/api/api'
import { baseImgUrl } from '@/api/http'
export default {
  data () {
    return {
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      formData: {
        name: '',
        description: '',
        topicImgUrl: '',
        headImgUrl: ''
      },
      rules: {
        name: [
          { required: true, message: '请输入专题名称', trigger: 'blur' }
        ],
        description: [
          { required: true, message: '请输入专题描述', trigger: 'blur' }
        ],
        topicImgUrl: [
          { required: true, message: '请上传专题展示图', trigger: 'blur' }
        ],
        headImgUrl: [
          { required: true, message: '请上传专题主题图', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    submitForm (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          const { name, description, headImgId, topicImgId } = this.formData
          addTheme({
            name,
            description,
            head_img_id: headImgId,
            topic_img_id: topicImgId
          }).then(res => {
            if (res.errcode === 0) {
              this.$message.success('添加成功')
              this.$router.push('/manage/theme')
            } else {
              this.$message.error('添加失败')
            }
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    resetForm (formName) {
      this.$refs[formName].resetFields()
    },
    handleHeadImgUpload (file) {
      var formData = new FormData()
      formData.append('file', file.file)
      upLoadImg(formData).then(res => {
        if (res.errcode === 0) {
          this.formData.headImgId = res.image.id
          this.formData.headImgUrl = baseImgUrl + res.image.url
        }
      })
    },
    handleTopicImgUpload (file) {
      var formData = new FormData()
      formData.append('file', file.file)
      upLoadImg(formData).then(res => {
        if (res.errcode === 0) {
          this.formData.topicImgId = res.image.id
          this.formData.topicImgUrl = baseImgUrl + res.image.url
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
    }
  }
}
</script>

<style lang="stylus" scoped>
.add-theme-content
  display flex
  justify-content center
  .formData
    margin-top 20px
    width 600px
  .el-icon-plus
    width: 120px
    height: 120px
    position: relative
    display: flex
    align-items: center
    justify-content: center
    border: 1px dashed #c0ccda
    border-radius: 6px
    font-size: 20px
    color: #999
  .el-icon-plus:hover
    border-color #409EFF
</style>
