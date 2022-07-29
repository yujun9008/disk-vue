<template>
  <div class="wrapper">
    <el-progress :percentage="percentage" :stroke-width="10" :color="customColors" :show-text="false"></el-progress>
    <span class="storage-text">{{ usedSize }}/{{ totalSize }}</span>
  </div>
</template>

<script>
import {calculateFileSize} from '@/utils';

export default {
  name: "Storage",
  data() {
    return {
      customColors: [
        {color: '#409eff', percentage: 80},
        {color: '#e6a23c', percentage: 90},
        {color: '#f56c6c', percentage: 95}
      ]
    }
  },
  methods: {},
  computed: {
    // 总大小
    totalSize: function () {
      return calculateFileSize(this.$store.getters.storage.totalSize || 0);
    },
    //已使用大小
    usedSize: function () {
      return calculateFileSize(this.$store.getters.storage.usedSize || 0);
    },
    percentage: function () {
      return ((this.$store.getters.storage.usedSize || 0) / (this.$store.getters.storage.totalSize || 1)) * 100;
    }
  }
}
</script>

<style scoped>
.wrapper {
  width: 100%;
  padding: 0 15px;
}

.storage-text {
  display: inline-block;
  margin-top: 10px;
  font-weight: bolder;
  font-size: 14px;
}
</style>
