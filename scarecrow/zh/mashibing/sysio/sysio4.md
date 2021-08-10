# C10K问题及NIO精讲和IO模型性能压测

[http://www.kegel.com/c10k.html](http://www.kegel.com/c10k.html)

### 查看路由表

```sh
route -n
route add -host 192.168.110.100 gw 192.168.150.1
```

windows 虚拟机 VMware NAT Service

### BIO

- BIO弊端
- 阻塞 accept recv
- 不阻塞只有抛线程
- 因为阻塞才要抛出线程，才能满足一个服务端接受更多的客户端去处理

### NIO

- JDK nio -> new io
- OS nio -> NONBLOCKING IO
- 优势：
  - 可以用1个或者多个线程解决IO连接处理问题
- 问题： 
  - 单线程模型 accept recv 不阻塞 循环系统调用
  - O(n)复杂recv 很多调用无意义，浪费的（调用：计组：系统调用）

### 追踪系统调用

```sh
# 编译 追踪
javac SocketNIO.java && strace -ff -o out java SocketNIO
```

### ulimit 单个进程可以创建文件描述符

```sh
ulimit -a
ulimit -SHn 65535
cat /etc/security/limits.conf
```

### 整个内核可以创建最多文件描述符


```sh
# 由内核估算，1G大概10万文件描述符
cat /proc/sys/fs/file-max 
382467

cat /etc/security/limits.conf 

lsof -op pid 
netstat -natp
```





