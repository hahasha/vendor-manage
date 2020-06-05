<template>
  <div class="add-product-content">
    <el-form :model="formData" :rules="rules" ref="formData" label-width="100px" class="formData">
      <el-form-item label="商品名称" prop="name">
        <el-input v-model="formData.name"></el-input>
      </el-form-item>
      <el-form-item label="商品价格" prop="price">
        <el-input v-model.number="formData.price"></el-input>
      </el-form-item>
      <el-form-item label="商品库存" prop="stock">
        <el-input v-model.number="formData.stock"></el-input>
      </el-form-item>
      <el-form-item label="商品分类" prop="category">
        <el-select v-model="formData.category" placeholder="请选择商品分类" @change="handleSelect">
          <el-option
            v-for="item in categories"
            :key="item.id"
            :label="item.name"
            :value="item.name"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="商品简介" prop="summary">
        <el-input v-model="formData.summary"></el-input>
      </el-form-item>
      <el-form-item label="商品专题" prop="themeList">
        <el-checkbox-group v-model="formData.themeList">
          <el-checkbox v-for="item in themes" :key="item.id" :label="item.name" name="theme"></el-checkbox>
        </el-checkbox-group>
      </el-form-item>
      <el-form-item label="商品展示图" prop="mainImgUrl">
        <el-upload
          action=""
          class="img-uploader"
          :http-request="handleUpload"
          :show-file-list="false"
          :headers="headers"
          :before-upload="handleBeforupload"
          accept=".jpg,.jpeg,.png,.gif"
          >
          <img v-if="formData.mainImgUrl" :src="imgUrl" class="img">
          <i v-else class="el-icon-plus img-uploader-icon"></i>
        </el-upload>
      </el-form-item>
      <el-form-item label="商品详情图" prop="headImgUrl">
          <imgDrag
            :fileList="detailList"
            @dragEvent="getNewList"
            ></imgDrag>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm('formData')">立即创建</el-button>
        <el-button @click="resetForm('formData')">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import ImgDrag from '@/components/imgDrag/imgDrag'
import { upLoadImg, addProduct, getCategories, getThemes } from '@/api/api'
import { baseImgUrl } from '@/api/http'
export default {
  data () {
    return {
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      categories: [],
      themes: [],
      detailList: [],
      formData: {
        name: '',
        price: '',
        stock: '',
        category: '',
        summary: '',
        themeList: [],
        mainImgUrl: '',
        imgList: []
      },
      rules: {
        name: [
          { required: true, message: '请输入商品名称', trigger: 'blur' }
        ],
        price: [
          { required: true, message: '请输入商品价格', trigger: 'blur' },
          { type: 'number', message: '输入不合法，请输入正确的价格类型' }
        ],
        stock: [
          { required: true, message: '请上传商品库存', trigger: 'blur' },
          { type: 'number', message: '输入不合法，请输入一个正整数' }
        ],
        category: [
          { required: true, message: '请选择商品分类', trigger: 'change' }
        ],
        mainImgUrl: [
          { required: true, message: '请上传商品展示图', trigger: 'blur' }
        ]
      }
    }
  },
  computed: {
    imgUrl () {
      return baseImgUrl + this.formData.mainImgUrl
    }
  },
  created () {
    this.getCategories()
    this.getThemes()
  },
  methods: {
    handleSelect (value) {
      this.formData.categoryId = this.categories.filter(item => item.name === value)[0].id
    },
    getNewList (list) {
      this.formData.imgList = list
    },
    submitForm (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          const { name, price, stock, categoryId, mainImgUrl, summary, imgId, themeList, imgList } = this.formData
          addProduct({
            name,
            price,
            stock,
            category_id: categoryId,
            main_img_url: mainImgUrl,
            summary,
            img_id: imgId,
            themeList,
            imgList
          }).then(res => {
            if (res.errcode === 0) {
              this.$message.success('添加成功')
              this.$router.push('/product')
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
    handleUpload (file) {
      var formData = new FormData()
      formData.append('file', file.file)
      upLoadImg(formData).then(res => {
        if (res.errcode === 0) {
          this.formData.imgId = res.image.id
          this.formData.mainImgUrl = res.image.url
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
    ImgDrag
  }
}
</script>

<style lang="stylus" scoped>
.add-product-content
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
>>>.list-group
  padding 0
</style>
