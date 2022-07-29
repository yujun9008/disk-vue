#shell部分

npm install --registry=https://registry.npm.taobao.org

npm build

cp -rf ./dist ./docker


#docker部分

echo '================打包完成，开始制作镜像================'

cd /home/jenkins_home/workspace/$JOB_NAME/docker
echo '================停止容器 novelui================'
sudo docker stop novelui
echo '================删除容器 novelui================'
sudo docker rm novelui
echo '================删除镜像 novelui:latest================'
sudo docker rmi novelui:latest
echo '================build 镜像 novelui:latest================'
sudo docker build -t novelui:latest  .
echo '================运行容器 novelui================'
sudo docker run --name=novelui --restart always -d -p 80:80  novelui:latest

echo "finished!"
echo '================部署完成================'
