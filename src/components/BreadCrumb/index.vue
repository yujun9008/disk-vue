<template>
  <div class="breadcrumb-wrapper">
    <el-breadcrumb v-if="fileType" separator="/">
      <el-breadcrumb-item>全部{{ fileTypeMap[fileType] }}</el-breadcrumb-item>
    </el-breadcrumb>
    <el-breadcrumb v-else separator="/">
      <el-breadcrumb-item
          v-for="(item, index) in breadCrumbList"
          :key="index"
          :to="{ query: { fileName: item.path,pid: item.pid, fileType: fileType } }"
      >{{ item.name }}
      </el-breadcrumb-item>
    </el-breadcrumb>
  </div>
</template>

<script>
export default {
  name: "BreadCrumb",
  data() {
    return {
      fileTypeMap: {
        1: '图片',
        2: '文档',
        3: '视频',
        4: '音乐',
        5: '其他'
      }
    }
  },
  computed: {
    //  面包屑导航栏数组
    breadCrumbList: function () {
      let fileName = this.$route.query.fileName;
      let pid = this.$route.query.pid || 0;
      let fileNameList = fileName ? fileName.split('/') : [];
      let pidList = pid ? pid.split(',') : [];
      let res = []; //  返回结果数组
      let _path = [];//  存放祖先路径
      let _pid = [];//  存放祖先路径
      for (let i = 0; i < fileNameList.length; i++) {
        if (fileNameList[i]) {
          _path.push(fileNameList[i] + '/');
          _pid.push(pidList[i]);
          res.push({
            path: _path.join(''),
            pid: _pid.join(','),
            name: fileNameList[i]
          })
        } else if (i === 0) {
          //  根目录
          fileNameList[i] = '/';
          pidList[i] = '0';
          _path.push(fileNameList[i]);
          _pid.push(pidList[i]);
          res.push({
            path: '/',
            pid: _pid.join('0'),
            name: '全部文件'
          })
        }
      }
      return res
    },
    fileType: function () {
      return Number(this.$route.query.fileType)
    },
    pid: function () {
      let pids = this.$route.query.pid;
      if (pids && pids.endsWith(",")) {
        pids = pids.substring(0, pids.length - 1);
      }
      let pidList = pids ? pids.split(',') : [pids];
      let pid = pidList[pidList.length - 1];
      if (!pid || pid === '') {
        pid = 0;
      }
      return pid
    },
  }
}
</script>

<style scoped>
.breadcrumb-wrapper {
  padding: 0 20px;
  height: 16px;
  line-height: 16px;
  display: flex;
  color: #3b8cff;
  font-size: 12px;
  font-weight: 500 !important;
}

.breadcrumb-wrapper, >>> .el-breadcrumb {
  height: 16px;
  line-height: 16px;
  font-size: 12px;
  font-weight: 500 !important;
}

</style>
