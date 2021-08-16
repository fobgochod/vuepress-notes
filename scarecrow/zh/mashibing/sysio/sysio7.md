# 全手写急速理解Netty模型及IO模型应用实战

#### nc

> windows下载[https://eternallybored.org/misc/netcat](https://eternallybored.org/misc/netcat)

```sh
# 客户端
nc localhost 9090
# 服务端
# linux
nc -l localhost 9090
nc -l 9090
# window
nc -l -p 9090
```

## 网络

```sh
cd /proc/$$/fd
# fd8的输入输出都指向socket
exec 8<> /dev/tcp/www.baidu.com/80
# echo输出重定向到fd8  文件描述符需在>后加上&
# HTTP协议规定Request的最小写法 'GET / HTTP/1.0\n'
echo -e 'GET / HTTP/1.0\n' >& 8
# cat输入重新定向到fd8
cat 0<& 8

# 关闭
exec 8<& -

# 网卡信息
cat /etc/sysconfig/network-scripts/ifcfg-eth0 
# 路由表
route -b

# ping 使用的是ICMP协议
# DNS 域名到IP地址的映射 全网
ping www.baidu.com

# IP地址和网卡硬件地址(MAC)的映射
# arp 是局域网内
arp -a


# 结论：TCP/IP协议基于下一跳机制，IP是端点间MAC低智商节点间的

route add -host 192.168.8.8 gw 192.168.8.1

# LVS(4层) 流量 数据包
# nginx(7层) 握手 5万


- NAT
- DR
- TUN: VPN 翻墙


# 网卡位置
cd /proc/sys/net/ipv4/conf/

# ipvs内核模块
yum install ipvsadm -y

# node01
ifconfig eth0:2 192.168.150.100/24
ifconfig eth0:2 down

# node02~node03
# 1.修改内核arp协议
cat /proc/sys/net/ipv4/conf/
## eth0
echo 1 > /proc/sys/net/ipv4/conf/eth0/arp_ignore
echo 2 > /proc/sys/net/ipv4/conf/eth0/arp_announce
## all
echo 1 > /proc/sys/net/ipv4/conf/all/arp_ignore
echo 2 > /proc/sys/net/ipv4/conf/all/arp_announce
# 2.设置隐藏的IP
ifconfig lo:2 192.168.150.100 netmask 255.255.255.255
# 3.安装80服务
yum install httpd -y
# 启动
service httpd satrt
vi /var/www/html/index.html # from 192.168.150.12 from 192.168.150.13

# node01 LVS服务配置
yum install ipvsadm -y
ipvsadm -A -t 192.168.150.100:80 -s rr
ipvsadm -ln

ipvsadm -a -t 192.168.150.100:80 -r 192.168.159.12 -g -w 1
ipvsadm -a -t 192.168.150.100:80 -r 192.168.159.13 -g -w 1
ipvsadm -ln

# 验证：浏览器访问192.168.150.100 看到负载
http://192.168.150.100

# node01 看不到socket node02、node03 有socket
netstat -natp

# node01
ipvsadm -lnc
```

```sh
# node01~node04
yum install keepalived ipvsadm -y

cd /etc/keepalived/
```
