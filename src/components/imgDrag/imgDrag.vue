<template>
  <div class="upload-container">
    <draggable
      class="list-group"
      tag="ul"
      v-model="list"
      v-bind="dragOptions"
      @start="onDragStart"
      @end="onDragEnd"
    >
      <transition-group type="transition" :name="!drag ? 'flip-list' : null">
        <li
          class="list-group-item"
          v-for="(item, index) in showList"
          :key="item.id"
        >
          <el-image :src="item.url" :preview-src-list="[item.url]"></el-image>
          <span class="shadow" ref="shadow">
            <i class="el-icon-zoom-in icon-preview" @click="handlePreview(item)"></i>
            <i class="el-icon-delete icon-remove" @click="handleRemove(item, index)"></i>
          </span>
        </li>
      </transition-group>
      <el-upload
        slot="footer"
        action=""
        class="uploader"
        :http-request="handleUpload"
        :show-file-list="false"
        :before-upload="handleBeforupload"
        accept=".jpg,.jpeg,.png"
        :headers="headers"
        >
        <i class="el-icon-plus img-uploader-icon"></i>
      </el-upload>
    </draggable>
    <el-dialog
      :visible.sync="dialogVisible"
      append-to-body
    >
      <img width="100%" :src="dialogImageUrl" alt="">
    </el-dialog>
  </div>
</template>

<script>
import { upLoadImg } from '@/api/api'
import { baseImgUrl } from '@/api/http'
import draggable from 'vuedraggable'

export default {
  name: 'ImgDrag',
  display: 'Transitions',
  // order: 7,
  components: {
    draggable
  },
  data () {
    return {
      list: this.fileList,
      drag: false,
      dialogVisible: false,
      dialogImageUrl: '',
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    }
  },
  props: {
    fileList: {
      type: Array,
      default: function () {
        return []
      }
    }
  },
  computed: {
    dragOptions () {
      return {
        animation: 200,
        group: 'description',
        disabled: false,
        ghostClass: 'ghost'
      }
    },
    showList () {
      return this.list.filter(item => item.order !== -1)
    }
  },
  methods: {
    handlePreview (item) {
      this.dialogVisible = true
      this.dialogImageUrl = item.url
    },
    handleRemove (item, index) {
      this.$confirm('确定删除该图片?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        item.order = -1
        this.list.splice(index, 1, item)
      }).catch(() => {}) // 添加catch防止控制台报错Uncaught (in promise) cancel，因为$confirm方法内置promise
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
          const newImage = {}
          newImage.id = res.image.id
          newImage.url = baseImgUrl + res.image.url
          newImage.order = this.list.length + 1
          this.list.push(newImage)
        }
      })
    },
    onDragStart (e) {
      this.drag = true
      e.target.classList.add('hideShadow')
    },
    onDragEnd (e) {
      this.drag = false
      e.target.classList.remove('hideShadow')
    },
    reNewList (list) {
      var order = 1
      list.forEach((item, index) => {
        if (item.order !== -1) {
          item.order = order
          order++
        }
      })
      this.list = list
      this.$emit('dragEvent', list)
    }
  },
  watch: {
    list: function (newVal, oldVal) {
      this.reNewList(newVal)
    }
  }
}
</script>

<style lang="stylus" scoped>
.el-image
  height 100px
>>>.el-upload
  width 100%
.el-icon-plus
  font-size 28px
  color #8c939d
  width 100%
  height 100px
  line-height 100px
  text-align center
  border 1px dashed #d9d9d9
  border-radius 6px
.el-icon-plus:hover
  border 1px dashed #3a8ee6
.list-group-item
  position relative
  display flex
  cursor move
  box-sizing border-box
  margin-bottom 10px

.shadow
  position: absolute
  width: 100%
  height: 100%
  left: 0
  top: 0
  cursor: default
  text-align: center
  color: #fff
  opacity: 0
  font-size: 20px
  background-color: rgba(0,0,0,.5)
  transition: opacity .3s
  display flex
  align-items center
  justify-content center

.shadow:hover
  opacity 1

.hideShadow {
  .shadow {
    display none
  }
}

.icon-remove
  margin-left 20px

.list-group-item i
  cursor: pointer
.button {
  margin-top: 35px;
}
.flip-list-move {
  transition: transform 0.5s;
}
.no-move {
  transition: transform 0s;
}
.ghost {
  opacity: 0.5;
  background: #c8ebfb;
}
.list-group {
  min-height: 20px;
}
</style>
