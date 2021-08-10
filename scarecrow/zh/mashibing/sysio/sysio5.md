# 网络编程之多路复用器及Epoll精讲

## 多路复用器

- 多条 路(IO)通过一个系统调用，获得其中的IO`状态`，然后由程序自己对有状态的IO进行R/W
- IO模型是同步的

> 只关注IO：不关注从IO读写完之后的事情

- 同步：app自己R/W
- 异步：kernel完成R/W 没有访问IO Buffer win:iocp

- 阻塞：BLOCKING
- 非阻塞：NONBLOCKING

> linux以及成熟的框架 netty

- 同步阻塞：程序自己读取，调用了方法一直等待有效返回结果
- 同步非阻塞：程序自己读取，调用方法一瞬间给出是否读到（自己要解决下次啥时候去读）
- 异步：尽量不讨论，因为现在我们只讨论IO模型下，linux，目前没有通用的异步处理方案

### 多路复用器

- SELECT POSIX标准
- POLL
- EPOLL

- linux epoll
- unix kqueue

#### SELECT

- 文档：man 2 select
- synchronous I/O multiplexing
- FD_SETSIZE(1024)

#### POLL

- 文档：man 2 poll
- 没有FD_SETSIZE限制

#### 总结

##### NIO、SELECT、POLL都是要遍历所有的IO，询问状态

- NIO: 这个遍历的成本在用户态内核态切换
- SELECT、POLL: 这个遍历过程触发一次系统调用，用户态内核态切换过程中，把fds传递给内核，由内核来遍历修改状态

##### 多路复用器：select poll的弊端：

- 每次都要重新，重复传递fds(内核开辟空间)
- 每次内核被调用后，针对这次调用，触发一个遍历fds全量的复杂度

> 时钟中断 晶振

- EPOLL之前callback 只是完成了将网卡发来的数据，走内核的网络协议栈(2、3、4)最终关联到fd的buffer，
- 所以你某一时间从APP询问内核某一个或多个fd是否可R/W，会有状态返回

```sh
yum install man man-pages

cat /proc/sys/fs/epoll/max_user_watches
```

- man 2 epoll_create
- man 2 epoll_ctl
- man 2 epoll_wait

```sh
-Djava.nio.channels.spi.SelectorProvider=sun.nio.ch.PollSelectorProvider
-Djava.nio.channels.spi.SelectorProvider=sun.nio.ch.EPollSelectorProvider

strace -ff -o out java -Djava.nio.channels.spi.SelectorProvider=sun.nio.ch.PollSelectorProvider SocketNIO
```
