# Linux

> Linux命令大全：[http://man.linuxde.net](http://man.linuxde.net)

## 常用

```sh
# 查看某一端口的占用情况
lsof -i:8080
netstat -tunlp | grep 8080

# Linux查看程序占用情况
ps -aux | grep java

# 删除执行中的程序或工作
kill -9 pid

# 查看IP
ip addr show

# 查看你当前的内核版本
uname -r 

# 查看本机系统
cat /etc/redhat-release 

# 访问地址：
curl http://www.fobgochod.com

# 下载：
wget https://downloads.mariadb.org/interstitial/mariadb-10.3.9/source/mariadb-10.3.9.tar.gz
```

## 压测

```sh
# 修改TIME_WAIT超时时间(建议小于30秒)
vi /etc/sysctl.conf
net.ipv4.tcp_fin_timeout = 30
# 执行如下命令，使配置生效(-p 从指定的文件加载系统参数，如不指定即从/etc/sysctl.conf中加载)
sysctl -p
# 查看当前系统中生效的所有参数
sysctl -a

# Linux
cat /proc/sys/net/ipv4/ip_local_port_range
vi /etc/sysctl.conf
net.ipv4.ip_local_port_range = 1024 65535
# 执行如下命令，使配置生效(-p 从指定的文件加载系统参数，如不指定即从/etc/sysctl.conf中加载)
sysctl -p

# 查看TCP连接状态的数量
netstat -n | awk '/^tcp/ {++S[$NF]} END {for(a in S) print a, S[a]}'
```

## 内存、磁盘

#### 内存

```sh
# CPU型号
cat /proc/cpuinfo | grep 'model name' |uniq
# CPU个数
cat /proc/cpuinfo | grep "physical id" | uniq | wc -l
# CPU核数
cat /proc/cpuinfo | grep "cpu cores" | uniq
# 内存
cat /proc/meminfo | grep MemTotal
# CPU大小
cat /proc/cpuinfo | grep 'model name' && cat /proc/cpuinfo |grep 'physical id'

# 查看cpu 核数命令
grep 'model name' /proc/cpuinfo | wc -l

# top，uptime，w等命令都可以查看系统负载：
top
uptime
w
```

#### 磁盘

```sh
# 显示当前系统未使用的和已使用的内存数目
free -m

# 查看磁盘使用情况
df -h
# 以指定的区块大小来显示区块数目
df -B 1G
# 查看全部文件系统
df -a

# 显示当前目录的大小
du -sh
# 显示某个目录或文件的大小
du -sh dirName
# 显示当前目录下所有文件的大小
du -sh ./*
# 显示mysql所有数据库文件大小
du -sh /var/lib/mysql/*
```

## mount

```sh
mount
# 将 /dev/hda1 挂在 /mnt 之下
#mount /dev/hda1 /mnt


umount
# 通过设备名卸载
umount -v /dev/sda1          
/dev/sda1 umounted  
# 通过挂载点卸载
umount -v /mnt/mymount/
/tmp/diskboot.img umounted 
```

## Yum

> 全称为 Yellow dog Updater, Modified 是一个在Fedora和RedHat以及CentOS中的Shell前端软件包管理器

YUM的配置方式是基于分段配置的

```sh
# 主配置文件：
/etc/yum.conf
# Yum的片段配置：
/etc/yum.repos.d/*.repo
```

#### 说明

- 若无@或不是install，则表示尚未安装
- base，表示未安装，包位于base仓库中
- updates，表示未安装，包位于updates仓库中
- -y，当安装过程提示选择全部为"yes"

```sh
# yum安装：
yum install packageName
# yum卸载：
yum -y remove packageName

# 查看yum仓库中指定包名的软件包，可以使用通配符
yum list all mariadb*

# 只显示已安装的包
yum list installed
# 只显示没有安装，但可安装的包
yum list available
# 查看所有可更新的包
yum list updates

# 显示不属于任何仓库的，额外的包
yum list extras
# 显示被废弃的包
yum list obsoletes
# 新添加进yum仓库的包
yum list recent
```

## lrzsz

#### 文件传输

- sz中的s意为send（发送），告诉客户端，我（服务器）要发送文件 send to cilent，就等同于客户端在下载。
- rz中的r意为received（接收），告诉客户端，我（服务器）要接收文件 received by cilent，就等同于客户端在上传。

#### 安装

```sh
# 查看
yum list all lrzsz
# 安装
yum install -y lrzsz.x86_64
```

#### 上传下载

```sh
# 不覆盖原文件
rz
# 覆盖原文件
rz -y

# 下载一个文件
sz filename
# 下载多个文件
sz filename1 filename2 …
```

## firewall-cmd

#### 防火墙

```sh
# 安装
yum install -y firewalld

# 开启服务
systemctl start firewalld.service
# 关闭防火墙
systemctl stop firewalld.service
# 开机自动启动
systemctl enable firewalld.service
# 关闭开机制动启动
systemctl disable firewalld.service
```

#### 常用命令

```sh
# 查看版本
firewall-cmd --version
# 查看帮助
firewall-cmd --help
# 显示状态(关闭-notrunning，开启-running)
firewall-cmd --state
# 查看防火墙规则
# 只显示/etc/firewalld/zones/public.xml中防火墙策略
firewall-cmd --list-all
# 显示/etc/firewalld/zones/下的所有策略
firewall-cmd --list-all-zones
# 更新防火墙规则
firewall-cmd --reload
# 查看区域信息
firewall-cmd --get-active-zones
# 查看指定接口所属区域
firewall-cmd --get-zone-of-interface=eth0
# 拒绝所有包
firewall-cmd --panic-on
# 取消拒绝状态
firewall-cmd --panic-off
# 查看是否拒绝
firewall-cmd --query-panic
```

```sh
# 查看帮住
man firewall-cmd | grep query-port
# 列出支持的zone
firewall-cmd --get-zones
# 支持的服务
firewall-cmd --get-services
```

#### 参数解释

- –permanent #永久生效，没有此参数重启后失效
- –zone #作用域
- –add-service #添加的服务
- –add-port=80/tcp #添加端口，格式为：端口/通讯协议

#### 端口

```sh
# 查看所有打开的端口 [--permanent] [--zone=zone] --list-ports
firewall-cmd --list-ports
firewall-cmd --permanent --list-ports
# 开启端口-永久
firewall-cmd --permanent --zone=public --add-port=3306/tcp
firewall-cmd --permanent --zone=public --add-port=8080-8082/tcp 
# 删除端口
firewall-cmd --permanent --zone=public --remove-port=3306/tcp
firewall-cmd --permanent --zone=public --remove-port=8080-8082/tcp
# 重新载入配置
firewall-cmd --reload 
```

#### 服务

```sh
# 查看所有打开的服务 [--permanent] [--zone=zone] --list-services
firewall-cmd --list-services
# 开启服务
firewall-cmd --permanent --zone=public --add-service=http
# 删除服务
firewall-cmd --permanent --zone=public --remove-service=smtp

# 设置某个ip访问某个端口
firewall-cmd --permanent --add-rich-rule='rule family="ipv4" source address="172.18.0.0/16" port port="3306" protocol="tcp" accept'
# 删除配置
firewall-cmd --permanent --remove-rich-rule 'rule family=ipv4 source address=172.18.0.0/16 port port=80 protocol=tcp accept'

# 设置某个ip访问某个服务
firewall-cmd --permanent --zone=public --add-rich-rule='rule family="ipv4" source address="192.168.0.4/24" service name="http" accept' 
# 删除配置
firewall-cmd --permanent --zone=public --remove-rich-rule='rule family="ipv4" source address="192.168.0.4/24" service name="http" accept'
```

### Centos7以下版本

1.开放8080端口

```sh
/sbin/iptables -I INPUT -p tcp --dport 8080 -j ACCEPT
```

2.保存

```sh
/etc/rc.d/init.d/iptables save
```

3.查看打开的端口

```sh
/etc/init.d/iptables status
```

4.关闭防火墙

```sh
# 永久性生效，重启后不会复原
# 开启 
chkconfig iptables on
# 关闭 
chkconfig iptables off

# 即时生效，重启后复原
# 开启
service iptables start
# 关闭
service iptables stop
```

```sh
# 修改主机名
hostname

vi /etc/sysconfig/network
NETWORKING=yes
HOSTNAME=fobgochod

reboot
hostnamectl
cat /etc/hostname
cat /etc/hosts
```
