# KFEngine  后台

这是工作流引擎的服务后台，对外提供API，基于HAPI，数据库使用MongoDB，消息使用ZeroMQ

## 运行

node server.js

## 确保运行时打包正常

## 安装配置

1. 安装Docker：
   1. 如果不用Docker, 可以单独安装MongoDB 和 Redis
2. 修改docker_mac_lkh.sh中的Docker虚拟目录  
3. 配置MongoDB用户，参考 mongodbsetup/user文件中的最后面一段
   1. admin用户的密码请谨慎
   2. 配置一个普通用户，如raindrop
4. 检出源文件
   1. 在项目目录里，执行npm install
5. 配置src/config.js中mongodb的访问用户名和密码与第3.2.中的配置相同
6. 配置src/config.js中最下面的hapi运行端口PORT
7. 安装pm2
8. 运行 pm2 start serbver.js --name raindrop_server, 注意看pm2的输出
9. 监控server运行情况
   1. 输出： tail -f ~/.pm2/logs/raindrop_server_out_[NUMBER]*.log
   2. 错误： tail -f ~/.pm2/logs/raindrop_server_err_[NUMBER].log
10. 访问http://SERVER:PORT/ 应能看到本说明文档
11. 访问http://SERVER.PORT/documentation应能看到Talent Share的OpenAPI
