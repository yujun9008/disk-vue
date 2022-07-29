#### [介绍文档](../README.md) | 部署文档

## 安装依赖
```
npm install --registry=https://registry.npm.taobao.org
```

## 修改配置
找到根目录下的`.env.development`和`.env.production`文件，修改里面对应的服务以及配置信息

如果需要`novel`开启网盘功能，还需要在`novel`的参数配置中修改网盘参数，值修改为`true`。

修改vue.config.js文件的反向代理服务地址。

### 启动服务
```
npm run serve
```

### 打包编译
```
npm run build
```

# 部署文档

### 直接部署
打开docker文件夹下nginx.conf文件

1. 找到`server_name`配置，修改为自己的服务地址。
2. 找到`root  /usr/share/nginx/html;`，修改为自己的nginx网页位置。
3. 找到`set  $proxy_path  "http://172.27.0.10:8888";`修改为自己的后端服务地址。
4. 最后将编译好的dist文件夹下的所有文件复制到nginx的html目录下，将nginx.conf文件替换nginx本身的配置文件。
5. 启动nginx或者已经启动的重启就ok了。

### 通过docker容器部署
1. 按照上述直接部署的文档，将nginx.conf修改好。
2. 将docker文件夹下`builddocker.sh`、`Dockerfile`、`nginx.conf`和编译好的`dist`文件夹拷贝到docker服务器上。
3. 执行

```bash
$ sudo chmod 777 builddocker.sh

$ ./builddocker.sh
```

### 通过jenkins部署

暂略












