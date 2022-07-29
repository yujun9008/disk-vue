const state = () => ({
    collapse: false,//左侧栏是否折叠，false不折叠，true折叠
    imageModel: false, //  图片类型页面是否展示为网格模式，false不是，true是
    search: '', //  文件搜索值
    storage: {"usedSize": 0, "totalSize": 0}, //  存储信息
});

export default state;
