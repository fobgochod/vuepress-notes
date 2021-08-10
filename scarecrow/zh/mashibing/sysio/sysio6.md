# 网络编程java API 实战多路复用器开发

3次握手 4次分手 状态

```sh
sysctl -a | grep reuse
# net.ipv4.tcp_tw_reuse = 2

nc localhost 9090
netstat -natp
```

### poll 、epoll 底层实现

#### POLL

```sh
# server = ServerSocketChannel.open();
socket(AF_INET6, SOCK_STREAM, IPPROTO_IP) = 6

# server.configureBlocking(false);
fcntl(6, F_SETFL, O_RDWR|O_NONBLOCK)    = 0

# server.bind(new InetSocketAddress(port));
bind(6, {sa_family=AF_INET6, sin6_port=htons(9090), sin6_flowinfo=htonl(0), inet_pton(AF_INET6, "::", &sin6_addr), sin6_scope_id=0}, 28) = 0
listen(6, 50)

# selector.select() > 0
poll([{fd=7, events=POLLIN}, {fd=6, events=POLLIN}], 2, -1) = 1 ([{fd=6, revents=POLLIN}])


# SocketChannel client = ssc.accept();
accept(6, {sa_family=AF_INET6, sin6_port=htons(44266), sin6_flowinfo=htonl(0), inet_pton(AF_INET6, "::1", &sin6_addr), sin6_scope_id=0}, [28]) = 9

# client.configureBlocking(false);
fcntl(9, F_SETFL, O_RDWR|O_NONBLOCK)    = 0

# 下一次循环 selector.select() > 0
poll([{fd=7, events=POLLIN}, {fd=6, events=POLLIN}, {fd=9, events=POLLIN}], 3, -1) = 1 ([{fd=9, revents=POLLIN}])
```

#### EPOLL

```sh
# server = ServerSocketChannel.open();
socket(AF_INET6, SOCK_STREAM, IPPROTO_IP) = 8

# server.configureBlocking(false);
fcntl(8, F_SETFL, O_RDWR|O_NONBLOCK)    = 0

# server.bind(new InetSocketAddress(port));
bind(8, {sa_family=AF_INET6, sin6_port=htons(9090), sin6_flowinfo=htonl(0), inet_pton(AF_INET6, "::", &sin6_addr), sin6_scope_id=0}, 28) = 0
listen(8, 50)

# selector = Selector.open();
epoll_create(256)                       = 11

#server.register(selector, SelectionKey.OP_ACCEPT);
epoll_ctl(11, EPOLL_CTL_ADD, 8, {EPOLLIN, {u32=8, u64=139835545223176}}) = 0

# selector.select() > 0
epoll_wait(11, [{EPOLLIN, {u32=8, u64=139835545223176}}], 8192, -1) = 1

# SocketChannel client = ssc.accept();
accept(8, {sa_family=AF_INET6, sin6_port=htons(44358), sin6_flowinfo=htonl(0), inet_pton(AF_INET6, "::1", &sin6_addr), sin6_scope_id=0}, [28]) = 12

# client.configureBlocking(false);
fcntl(12, F_SETFL, O_RDWR|O_NONBLOCK)   = 0

# client.register(selector, SelectionKey.OP_READ, buffer);
epoll_ctl(11, EPOLL_CTL_ADD, 12, {EPOLLIN, {u32=12, u64=139835545223180}}) = 0

# 下一次循环 selector.select() > 0
epoll_wait(11, [{EPOLLIN, {u32=12, u64=139835545223180}}], 8192, -1) = 1
```

多路复用模型

多线程select 单个select线性执行

