const baseURL = process.env.VUE_APP_BASE_API;

// 通用下载方法
export function download(url, fileName) {
  url = baseURL + url + "&isDelete=true";
  const aLink = document.createElement("a");
  aLink.href = url;
  aLink.setAttribute("download", fileName); // 设置下载文件名称
  document.body.appendChild(aLink);
  aLink.click();
}

/**
 * 解析blob响应内容并下载
 * @param {*} res blob响应内容
 * @param {String} mimeType MIME类型
 */
export function resolveBlob(res) {
  const aLink = document.createElement("a");
  const blob = new Blob([res.data]);
  // //从response的headers中获取filename, 后端response.setHeader("Content-disposition", "attachment; filename=xxxx.docx") 设置的文件名;
  const patt = new RegExp("filename=([^;]+\\.[^.;]+);*");
  const contentDisposition = decodeURI(res.headers["content-disposition"]);
  const result = patt.exec(contentDisposition);
  if (result) {
    let fileName = result[1];
    fileName = fileName.replace(/"/g, "");
    aLink.href = URL.createObjectURL(blob);
    aLink.setAttribute("download", fileName); // 设置下载文件名称
    document.body.appendChild(aLink);
    aLink.click();
    document.body.removeChild(aLink); // 释放标签
  }
}

export const mimeMap = {
  xlsx: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  zip: "application/zip",
};

/**
 * 计算文件大小
 * @param size
 * @returns {string}
 */
export function calculateFileSize(size) {
  const B = 1024;
  const KB = Math.pow(1024, 2);
  const MB = Math.pow(1024, 3);
  const GB = Math.pow(1024, 4);
  if (!size) {
    if (size === 0) {
      return "0";
    }
    return "_";
  } else if (size < KB) {
    return (size / B).toFixed(0) + "KB";
  } else if (size < MB) {
    return (size / KB).toFixed(1) + "MB";
  } else if (size < GB) {
    return (size / MB).toFixed(2) + "GB";
  } else {
    return (size / GB).toFixed(3) + "TB";
  }
}
