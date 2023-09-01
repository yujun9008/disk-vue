export const convertBase64UrlToFile = (data, name, type) => {
  var bytes = window.atob(data); //去掉url的头，并转换为byte

  //处理异常,将ascii码小于0的转换为大于0
  var len = bytes.length;
  var ia = new Uint8Array(len);
  for (var i = 0; i < len; i++) {
    ia[i] = bytes.charCodeAt(i);
  }

  return new File([ia], name, { type });
};

/**
 * 将本地图片转为base64格式
 * @param imgUrl 图片路径
 * @param name 图片名称
 */
export const getBase64Img = (imgUrl) => {
  return new Promise((resolve, reject) => {
    let img = new Image();
    if (img) {
      img.onload = function () {
        // 利用canvas进行转换
        let canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        let ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        let dataURL = canvas.toDataURL(); // 转换好的base64编码
        resolve(dataURL);
      };
      img.src = imgUrl;
    }
  });
};
/**
 * 将base64转为blob
 * @param base64 图片base64编码
 * @param name 图片名称
 * @returns {Blob}
 */
export const changeBase64ToBlob = (base64, name) => {
  let base64Arr = base64.split(",");
  console.log(base64Arr);
  let imgType = "";
  let base64String = "";
  if (base64Arr.length > 1) {
    // 去掉图片base64头信息
    base64String = base64Arr[1];
    imgType = base64Arr[0].substring(
      base64Arr[0].indexOf(":") + 1,
      base64Arr[0].indexOf(";")
    ); // 获取图片类型
  }
  // 将base64解码，atob() 方法用于解码使用 base-64 编码的字符串。
  let bytes = atob(base64String);
  let bytesCode = new ArrayBuffer(bytes.length);
  // 转换为类型化数组，Uint8Array 数组类型表示一个8位无符号整型数组，创建时内容被初始化为0。创建完后，可以以对象的方式或使用数组下标索引的方式引用数组中的元素。
  let byteArray = new Uint8Array(bytesCode);
  // 将base64转换为ascii码
  for (let i = 0; i < bytes.length; i++) {
    byteArray[i] = bytes.charCodeAt(i); // 对类型化数组进行赋值
  }
  let blobData = new Blob([bytesCode], { type: imgType });
  console.log(blobData);
  let imgSuffix = "." + imgType.split("/")[1]; // 获取图片后缀
  console.log(imgSuffix);
  let imageFile = new File([blobData], name + imgSuffix); // 将blob转换为file类型
  return imageFile;
};

export const TYPE_MAP = {
  pdf: "application/pdf",
  xls: "application/vnd.ms-excel",
  xlsx: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  doc: "application/msword",
  docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ppt: "application/vnd.ms-powerpoint",
  pptx: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  jpeg: "image/jpeg",
  jpg: "image/jpg",
  png: "image/png",
  txt: "text/plain",
};
