# Socket编程BIO及TCP参数

#### 基础命令

- lsof -p
- netstat -natp
- tcpdump

#### Server

```sh
# 编译启动服务端
javac SocketIOPropertites.java && java SocketIOPropertites 

# 网络状况
netstat -natp

# 查看java进程
lsof -op java-pid

# 打开TCP监控
tcpdump -nn -i eth0 port 9090
```

#### Client

```sh
javac SocketClient.java && java SocketClient
```

socket 四元组 CIP CPORT + SIP SPORT 内核级的

- ifconfig
- MTU(Maximum Transmission Unit) 1500bytes 总数据包大小 1500字节

```sh
[root@seven ~]# ifconfig
eth0: flags=4163<UP,BROADCAST,RUNNING,MULTICAST>  mtu 1500
inet 172.19.231.255  netmask 255.255.240.0  broadcast 172.19.239.255
ether 00:16:3e:02:ce:8a  txqueuelen 1000  (Ethernet)
RX packets 37642950  bytes 7411002555 (6.9 GiB)
RX errors 0  dropped 0  overruns 0  frame 0
TX packets 34207365  bytes 21628623014 (20.1 GiB)
TX errors 0  dropped 0 overruns 0  carrier 0  collisions 0
```

- tcpdump -nn -i eth0 port 9090
- mms 数据内容大小

```sh
[root@seven ~]# tcpdump -nn -i eth0 port 9090
tcpdump: verbose output suppressed, use -v or -vv for full protocol decode
listening on eth0, link-type EN10MB (Ethernet), capture size 262144 bytes
22:42:29.910181 IP 117.65.156.171.30077 > 172.19.231.255.9090: Flags [S], seq 83533905, win 64240, options [mss 1400,nop,wscale 8,nop,nop,sackOK], length 0
22:42:29.910219 IP 172.19.231.255.9090 > 117.65.156.171.30077: Flags [S.], seq 3044535540, ack 83533906, win 1152, options [mss 1460,nop,nop,sackOK,nop,wscale 0], length 0
22:42:29.925693 IP 117.65.156.171.30077 > 172.19.231.255.9090: Flags [.], ack 1, win 257, length 0
```

nc 47.100.125.75 9090

## 网络IO 变化 模型

同步 异步 阻塞 非阻塞

- 同步阻塞
- 同步非阻塞
- 异步非阻塞

strace -ff -o out -cmd

man tcp
man ip
man 7 ip
man ascii
man utf-8
man bash
man man
man 2 socket



### BIO

