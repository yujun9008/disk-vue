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

export const TYPE_MAP = {
  pdf: "application/pdf",
  xls: "application/vnd.ms-excel",
  xlsx: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  doc: "application/msword",
  docx:
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ppt: "application/vnd.ms-powerpoint",
  pptx:
    "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  jpeg: "image/jpeg",
  jpg: "image/jpg",
  png: "image/png",
  txt: "text/plain",
};
