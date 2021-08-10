# 虚拟文件系统，文件描述符，IO重定向

VFS (Virtual File System)

> Inode: 文件的元信息

```sh
[root@fobgochod ~]# stat /etc/profile
  File: /etc/profile
  Size: 2147            Blocks: 8          IO Block: 4096   regular file
Device: fd01h/64769d    Inode: 224705      Links: 1
Access: (0644/-rw-r--r--)  Uid: (    0/    root)   Gid: (    0/    root)
Access: 2021-08-04 23:14:23.726568502 +0800
Modify: 2021-08-04 23:14:17.883351383 +0800
Change: 2021-08-04 23:14:17.884351420 +0800
 Birth: -
[root@fobgochod ~]# 
```

```sh
[root@fobgochod ~]# df -h
Filesystem      Size  Used Avail Use% Mounted on
devtmpfs        1.8G     0  1.8G   0% /dev
tmpfs           1.8G     0  1.8G   0% /dev/shm
tmpfs           1.8G  448K  1.8G   1% /run
tmpfs           1.8G     0  1.8G   0% /sys/fs/cgroup
/dev/vda1        40G  2.9G   38G   8% /
tmpfs           363M     0  363M   0% /run/user/0
[root@fobgochod ~]# 
```

## 冯·诺依曼(Von Neumann)

> 计算机的发展史上做出杰出贡献的著名应用数学家

![计算机的组成框架](/images/msb/computer_framework.png)

冯·诺依曼计算机结构包含3条重要的设计思想，具体如下：

- 计算机应由`运算器`、`控制器`、`存储器`、`输入设备`和`输出设备` 5大部分组成。
- 以二进制的形式表示数据和指令。
- 程序预先存入存储器中，计算机在工作中能够自动地从存储器中取出程序指令并加以执行。

## 文件类型

- -: 普通文件(可执行文件、图片、文本) REG
- d: 目录
- l: 链接(软链接(windows快捷方式)、硬链接)
- b: 块设备(从一个地方读数据，来回读，如硬盘)
- c: 字符设备(从一个地方读数据，有约束（读不到过去和未来）、如键盘、socket网卡) CHR
- s: socket
- p: pipeline
- [eventpoll]:

### 硬链接、软链接

#### 硬链接：与普通文件没什么不同，inode 都指向同一个文件在硬盘中的区块

```sh
[root@fobgochod ~]# vi test.txt 
[root@fobgochod ~]# ln test.txt hard.txt
[root@fobgochod ~]# ll
-rw-r--r-- 2 root root         1 Aug  4 22:51 hard.txt
-rw-r--r-- 2 root root         1 Aug  4 22:51 test.txt
[root@fobgochod ~]# 

# 两个文件的Inode:17216191一样
[root@fobgochod ~]# stat test.txt hard.txt 
  File: test.txt
  Size: 1               Blocks: 8          IO Block: 4096   regular file
Device: fd01h/64769d    Inode: 17216191    Links: 2
Access: (0644/-rw-r--r--)  Uid: (    0/    root)   Gid: (    0/    root)
  File: hard.txt
  Size: 1               Blocks: 8          IO Block: 4096   regular file
Device: fd01h/64769d    Inode: 17216191    Links: 2
Access: (0644/-rw-r--r--)  Uid: (    0/    root)   Gid: (    0/    root)
[root@fobgochod ~]# 
```

#### 软链接：保存了其代表的文件的绝对路径，是另外一种文件，在硬盘上有独立的区块，访问时替换自身路径。

```sh
[root@fobgochod ~]# ln -s test.txt soft.txt
[root@fobgochod ~]# ll
lrwxrwxrwx 1 root root         8 Aug  4 22:54 soft.txt -> test.txt
-rw-r--r-- 2 root root         1 Aug  4 22:51 test.txt
[root@fobgochod ~]# 

# 两个文件的Inode不一样
[root@fobgochod ~]# stat test.txt soft.txt 
  File: test.txt
  Size: 1               Blocks: 8          IO Block: 4096   regular file
Device: fd01h/64769d    Inode: 17216191    Links: 2
Access: (0644/-rw-r--r--)  Uid: (    0/    root)   Gid: (    0/    root)
  File: soft.txt -> test.txt
  Size: 8               Blocks: 0          IO Block: 4096   symbolic link
Device: fd01h/64769d    Inode: 16778442    Links: 1
Access: (0777/lrwxrwxrwx)  Uid: (    0/    root)   Gid: (    0/    root)
[root@fobgochod ~]# 
```

### 块设备

```sh
/dev/null # 黑洞
/dev/zero # 无限大的的空，不占磁盘空间

# if=input file of=output file 1048576=1M 
[root@fobgochod ~]# dd if=/dev/zero of=test.img bs=1048576 count=100
104857600 bytes (105 MB, 100 MiB) copied, 0.0397967 s, 2.6 GB/s
[root@fobgochod ~]# ll -h
-rw-r--r-- 1 root root 100M Aug  4 23:00 test.img
[root@fobgochod ~]#

# 挂载mydisk
[root@fobgochod ~]# losetup /dev/loop0 test.img
# 格式化
[root@fobgochod ~]# mke2fs /dev/loop0
# 在mnt下创建image目录
[root@fobgochod ~]# mkdir /mnt/image
[root@fobgochod ~]# cd /mnt/image/

# 挂载
[root@fobgochod image]# mount -t ext2 /dev/loop0 /mnt/image/
[root@fobgochod image]# df -h
Filesystem      Size  Used Avail Use% Mounted on
devtmpfs        1.8G     0  1.8G   0% /dev
/dev/vda1        40G  2.8G   38G   7% /
/dev/loop0       97M  1.6M   91M   2% /mnt/image
[root@fobgochod image]# 


[root@fobgochod image]# whereis bash
bash: /usr/bin/bash /usr/share/man/man1/bash.1.gz /usr/share/info/bash.info.gz

[root@fobgochod image]# mkdir bin/
[root@fobgochod image]# cp /usr/bin/bash bin/
[root@fobgochod image]# cd bin
[root@fobgochod bin]# ldd bash 
        linux-vdso.so.1 (0x00007fff379da000)
        libtinfo.so.6 => /lib64/libtinfo.so.6 (0x00007f385d3cf000)
        libdl.so.2 => /lib64/libdl.so.2 (0x00007f385d1cb000)
        libc.so.6 => /lib64/libc.so.6 (0x00007f385ce08000)
        /lib64/ld-linux-x86-64.so.2 (0x00007f385d91a000)
[root@fobgochod bin]# cd ..
[root@fobgochod image]# mkdir lib64
[root@fobgochod image]# cp /lib64/{libtinfo.so.6,libdl.so.2,libc.so.6,ld-linux-x86-64.so.2} ./lib64/
[root@fobgochod image]# chroot ./
bash-4.4# echo $$
91229
bash-4.4# echo "hello world" > /abc.txt
bash-4.4# exit
[root@fobgochod image]# ls
abc.txt  bin  lib64  lost+found

[root@fobgochod image]# cd ..
[root@fobgochod mnt]# umount /mnt/image
[root@fobgochod mnt]# mount -t ext2 /dev/loop0 /mnt/image/
```

```sh
[root@fobgochod ~]# echo $$
1416
# 0 标准输入 1 标准输出 2 报错输出
[root@fobgochod ~]# lsof -p $$
COMMAND  PID USER   FD   TYPE             DEVICE SIZE/OFF     NODE NAME
bash    1416 root  cwd    DIR              253,1      232 16777345 /root
bash    1416 root  rtd    DIR              253,1      244      128 /
bash    1416 root  txt    REG              253,1  1150704 33794441 /usr/bin/bash
bash    1416 root  mem    REG              253,1  3154704 50599498 /usr/lib64/libc-2.28.so
bash    1416 root  mem    REG              253,1    28968 50599500 /usr/lib64/libdl-2.28.so
bash    1416 root  mem    REG              253,1   208616 50599346 /usr/lib64/libtinfo.so.6.1
bash    1416 root  mem    REG              253,1   252280 50599491 /usr/lib64/ld-2.28.so
bash    1416 root  mem    REG              253,1    26998 33794440 /usr/lib64/gconv/gconv-modules.cache
bash    1416 root    0u   CHR              136,0      0t0        3 /dev/pts/0
bash    1416 root    1u   CHR              136,0      0t0        3 /dev/pts/0
bash    1416 root    2u   CHR              136,0      0t0        3 /dev/pts/0
bash    1416 root  255u   CHR              136,0      0t0        3 /dev/pts/0
[root@fobgochod ~]# 


[root@fobgochod ~]# exec 8< test.txt
[root@fobgochod ~]# cd /proc/$$/fd
[root@fobgochod fd]# ll
lrwx------ 1 root root 64 Aug  4 22:36 0 -> /dev/pts/0
lrwx------ 1 root root 64 Aug  4 22:36 1 -> /dev/pts/0
lrwx------ 1 root root 64 Aug  4 22:36 2 -> /dev/pts/0
lrwx------ 1 root root 64 Aug  4 22:37 255 -> /dev/pts/0
lr-x------ 1 root root 64 Aug  4 22:36 8 -> /root/test.txt
[root@fobgochod fd]# lsof -op $$
COMMAND  PID USER   FD   TYPE             DEVICE OFFSET     NODE NAME
bash    1416 root  cwd    DIR                0,4           27101 /proc/1416/fd
bash    1416 root  rtd    DIR              253,1             128 /
bash    1416 root  txt    REG              253,1        33794441 /usr/bin/bash
bash    1416 root  mem    REG              253,1        50599498 /usr/lib64/libc-2.28.so
bash    1416 root  mem    REG              253,1        50599500 /usr/lib64/libdl-2.28.so
bash    1416 root  mem    REG              253,1        50599346 /usr/lib64/libtinfo.so.6.1
bash    1416 root  mem    REG              253,1        50599491 /usr/lib64/ld-2.28.so
bash    1416 root  mem    REG              253,1        33794440 /usr/lib64/gconv/gconv-modules.cache
bash    1416 root    0u   CHR              136,0    0t0        3 /dev/pts/0
bash    1416 root    1u   CHR              136,0    0t0        3 /dev/pts/0
bash    1416 root    2u   CHR              136,0    0t0        3 /dev/pts/0
bash    1416 root    8r   REG              253,1    0t0 17216191 /root/test.txt
bash    1416 root  255u   CHR              136,0    0t0        3 /dev/pts/0
[root@fobgochod fd]# 
[root@fobgochod fd]# stat ~/test.txt
  File: /root/test.txt
  Size: 1               Blocks: 8          IO Block: 4096   regular file
Device: fd01h/64769d    Inode: 17216191    Links: 2
Access: (0644/-rw-r--r--)  Uid: (    0/    root)   Gid: (    0/    root)
Access: 2021-08-04 22:51:42.204868384 +0800
Modify: 2021-08-04 22:51:42.204868384 +0800
Change: 2021-08-04 22:51:47.394060702 +0800
 Birth: -
[root@fobgochod fd]# 


[root@fobgochod fd]# vi ~/test.txt 
aaa
bbb
ccc
[root@fobgochod fd]# read x 0<& 8
[root@fobgochod fd]# echo $x
aaa
[root@fobgochod fd]# lsof -op $$
COMMAND  PID USER   FD   TYPE             DEVICE OFFSET     NODE NAME
bash    1416 root  cwd    DIR                0,4           27101 /proc/1416/fd
bash    1416 root  rtd    DIR              253,1             128 /
bash    1416 root  txt    REG              253,1        33794441 /usr/bin/bash
bash    1416 root  mem    REG              253,1        50599498 /usr/lib64/libc-2.28.so
bash    1416 root  mem    REG              253,1        50599500 /usr/lib64/libdl-2.28.so
bash    1416 root  mem    REG              253,1        50599346 /usr/lib64/libtinfo.so.6.1
bash    1416 root  mem    REG              253,1        50599491 /usr/lib64/ld-2.28.so
bash    1416 root  mem    REG              253,1        33794440 /usr/lib64/gconv/gconv-modules.cache
bash    1416 root    0u   CHR              136,0    0t0        3 /dev/pts/0
bash    1416 root    1u   CHR              136,0    0t0        3 /dev/pts/0
bash    1416 root    2u   CHR              136,0    0t0        3 /dev/pts/0
bash    1416 root    8r   REG              253,1    0t4 17216191 /root/test.txt
bash    1416 root  255u   CHR              136,0    0t0        3 /dev/pts/0
[root@fobgochod fd]# 
```

> 再开一个bash

```sh
[root@fobgochod ~]# echo $$
1418
[root@fobgochod ~]# cd /proc/$$/fd
[root@fobgochod fd]# ll
lrwx------ 1 root root 64 Aug  5 00:05 0 -> /dev/pts/2
lrwx------ 1 root root 64 Aug  5 00:05 1 -> /dev/pts/2
lrwx------ 1 root root 64 Aug  5 00:05 2 -> /dev/pts/2
lrwx------ 1 root root 64 Aug  5 00:06 255 -> /dev/pts/2
[root@fobgochod fd]# 
[root@fobgochod fd]# exec 9< ~/test.txt 
[root@fobgochod fd]# lsof -op $$
COMMAND  PID USER   FD   TYPE             DEVICE OFFSET     NODE NAME
bash    1418 root  cwd    DIR                0,4         1556046 /proc/1418/fd
bash    1418 root  rtd    DIR              253,1             128 /
bash    1418 root  txt    REG              253,1        33794441 /usr/bin/bash
bash    1418 root  mem    REG              253,1        50599498 /usr/lib64/libc-2.28.so
bash    1418 root  mem    REG              253,1        50599500 /usr/lib64/libdl-2.28.so
bash    1418 root  mem    REG              253,1        50599346 /usr/lib64/libtinfo.so.6.1
bash    1418 root  mem    REG              253,1        50599491 /usr/lib64/ld-2.28.so
bash    1418 root  mem    REG              253,1        33794440 /usr/lib64/gconv/gconv-modules.cache
bash    1418 root    0u   CHR              136,2    0t0        5 /dev/pts/2
bash    1418 root    1u   CHR              136,2    0t0        5 /dev/pts/2
bash    1418 root    2u   CHR              136,2    0t0        5 /dev/pts/2
bash    1418 root    9r   REG              253,1    0t0 17216191 /root/test.txt
bash    1418 root  255u   CHR              136,2    0t0        5 /dev/pts/2
[root@fobgochod fd]# 

[root@fobgochod fd]# read x <& 9
[root@fobgochod fd]# echo $x
aaa
[root@fobgochod fd]# read x <& 9
[root@fobgochod fd]# echo $x
bbb
[root@fobgochod fd]# lsof -op $$
COMMAND  PID USER   FD   TYPE             DEVICE OFFSET     NODE NAME
bash    1418 root  cwd    DIR                0,4         1556046 /proc/1418/fd
bash    1418 root  rtd    DIR              253,1             128 /
bash    1418 root  txt    REG              253,1        33794441 /usr/bin/bash
bash    1418 root  mem    REG              253,1        50599498 /usr/lib64/libc-2.28.so
bash    1418 root  mem    REG              253,1        50599500 /usr/lib64/libdl-2.28.so
bash    1418 root  mem    REG              253,1        50599346 /usr/lib64/libtinfo.so.6.1
bash    1418 root  mem    REG              253,1        50599491 /usr/lib64/ld-2.28.so
bash    1418 root  mem    REG              253,1        33794440 /usr/lib64/gconv/gconv-modules.cache
bash    1418 root    0u   CHR              136,2    0t0        5 /dev/pts/2
bash    1418 root    1u   CHR              136,2    0t0        5 /dev/pts/2
bash    1418 root    2u   CHR              136,2    0t0        5 /dev/pts/2
bash    1418 root    9r   REG              253,1    0t8 17216191 /root/test.txt
bash    1418 root  255u   CHR              136,2    0t0        5 /dev/pts/2
[root@fobgochod fd]# 
```

#### socket

```sh
[root@fobgochod fd]# exec 10<> /dev/tcp/www.baidu.com/80
[root@fobgochod fd]# ll
lrwx------ 1 root root 64 Aug  4 22:36 0 -> /dev/pts/0
lrwx------ 1 root root 64 Aug  4 22:36 1 -> /dev/pts/0
lrwx------ 1 root root 64 Aug  4 22:36 10 -> 'socket:[2137818]'
lrwx------ 1 root root 64 Aug  4 22:36 2 -> /dev/pts/0
lrwx------ 1 root root 64 Aug  4 22:37 255 -> /dev/pts/0
lr-x------ 1 root root 64 Aug  4 22:36 8 -> /root/test.txt
[root@fobgochod fd]# 
[root@fobgochod fd]# lsof -op $$
COMMAND  PID USER   FD   TYPE             DEVICE OFFSET     NODE NAME
bash    1416 root  cwd    DIR                0,4           27101 /proc/1416/fd
bash    1416 root  rtd    DIR              253,1             128 /
bash    1416 root  txt    REG              253,1        33794441 /usr/bin/bash
bash    1416 root  mem    REG              253,1        50599498 /usr/lib64/libc-2.28.so
bash    1416 root  mem    REG              253,1        50599500 /usr/lib64/libdl-2.28.so
bash    1416 root  mem    REG              253,1        50599346 /usr/lib64/libtinfo.so.6.1
bash    1416 root  mem    REG              253,1        50599491 /usr/lib64/ld-2.28.so
bash    1416 root  mem    REG              253,1        33794440 /usr/lib64/gconv/gconv-modules.cache
bash    1416 root    0u   CHR              136,0    0t0        3 /dev/pts/0
bash    1416 root    1u   CHR              136,0    0t0        3 /dev/pts/0
bash    1416 root    2u   CHR              136,0    0t0        3 /dev/pts/0
bash    1416 root    8r   REG              253,1    0t4 17216191 /root/test.txt
bash    1416 root   10u  IPv4            2137818    0t0      TCP fobgochod:50512->112.80.248.76:http (ESTABLISHED)
bash    1416 root  255u   CHR              136,0    0t0        3 /dev/pts/0
[root@fobgochod fd]# 
```

### 进程

```sh
# 任何程序都有
# 0：标准输入
# 1：标准输出
# 2：错误输出

cd /proc

$$: 当前bash的pid
$BASHPID

# 当前进程所有文件描述符
cd /proc/$$/fd
ll  
# 文件描述符细节
lsof -op $$

# 重定向：不是命令，是机制
输入：<
输出：>
```

### 重定向

```sh
# 基础

# ls标准输出 重定向到 ~/ls.out文件
[root@fobgochod ~]# ls ./ 1> ~/ls.out

# cat标准输入来自 test.txt 标准输入 重定向到 cat.out
[root@fobgochod ~]# cat 0< test.txt 1> cat.out
[root@fobgochod ~]# cat cat.out 
aaa
bbb

# read标准输入来自 cat.out
[root@fobgochod ~]# read a 0< cat.out
[root@fobgochod ~]# echo $a
aaa

# 进阶

ls ./ /ooxx 1> ls01.out 2> ls02.out
ls ./ /ooxx 1> ls03.out 2> ls03.out
ls ./ /ooxx 1> ls04.txt 2>& 1
```

#### 管道

```sh
head test.txt
head -3 test.txt 

tail test.txt
tail -3 test.txt

# 文件第八行
head -8 test.txt | tail -1
```

#### 父子进程

```sh
[root@fobgochod ~]# echo $$
1416
[root@fobgochod ~]# /bin/bash
[root@fobgochod ~]# echo $$
258164
[root@fobgochod ~]# pstree
systemd─┬─chronyd
        ├─crond
        ├─lsmd
        ├─sshd─┬─sshd───sshd─┬─bash───bash───pstree
        │      │             ├─bash───top
        │      │             └─bash───sleep
        │      ├─sshd───sshd───6*[sftp-server]
        │      ├─sshd───sshd─┬─bash
        │      │             ├─bash───top
        │      │             └─bash───sleep
        │      └─sshd───sshd───3*[sftp-server]
        ├─systemd───(sd-pam)
        ├─systemd-journal
        ├─systemd-logind
        ├─systemd-udevd
        └─tuned───3*[{tuned}]
[root@fobgochod ~]# 
[root@fobgochod ~]# ps -fe | grep 1416
root        1416    1415  0 Aug04 pts/0    00:00:00 -bash
root      258164    1416  0 00:29 pts/0    00:00:00 /bin/bash
root      265453  258164  0 00:31 pts/0    00:00:00 grep --color=auto 1416
[root@fobgochod ~]# 
[root@fobgochod ~]# exit
exit
[root@fobgochod ~]# echo $$
1416
[root@fobgochod ~]# 


# 变量 export
[root@fobgochod ~]# x=100
[root@fobgochod ~]# echo $x
100
[root@fobgochod ~]# /bin/bash
[root@fobgochod ~]# echo $x

[root@fobgochod ~]# exit
exit
[root@fobgochod ~]# export x
[root@fobgochod ~]# /bin/bash
[root@fobgochod ~]# echo $x
100
[root@fobgochod ~]# 
```

### 指令块

```sh
{ echo "hello"; echo "world"; }


# 管道两边开启子进程
[root@fobgochod ~]# a=1
[root@fobgochod ~]# echo $a
1
[root@fobgochod ~]# { a=9; echo "hello"; } | cat 
hello
[root@fobgochod ~]# echo $a
1


# $$优先级高于管道| 
[root@fobgochod ~]# echo $$
1416
[root@fobgochod ~]# echo $$ | cat
1416
[root@fobgochod ~]# echo $BASHPID | cat
277101
[root@fobgochod ~]# 
```

#### 管道 pipe

```sh
[root@fobgochod ~]# echo $$
1416
[root@fobgochod ~]# { echo $BASHPID; read x; } | { cat; echo $BASHPID; read y; }
279249

# 再开一个bash
[root@fobgochod ~]# ps -fe | grep 1416
root        1416    1415  0 Aug04 pts/0    00:00:00 -bash
root      279249    1416  0 00:35 pts/0    00:00:00 -bash
root      279250    1416  0 00:35 pts/0    00:00:00 -bash
root      282370  170282  0 00:36 pts/2    00:00:00 grep --color=auto 1416
[root@fobgochod ~]# 
[root@fobgochod fd]# cd /proc/279249/fd
[root@fobgochod fd]# ll
lrwx------ 1 root root 64 Aug  5 00:36 0 -> /dev/pts/0
l-wx------ 1 root root 64 Aug  5 00:36 1 -> 'pipe:[2450910]'
lrwx------ 1 root root 64 Aug  5 00:36 2 -> /dev/pts/0
lrwx------ 1 root root 64 Aug  5 00:36 255 -> /dev/pts/0
[root@fobgochod fd]# 
[root@fobgochod fd]# cd /proc/279250/fd
[root@fobgochod fd]# ll
lr-x------ 1 root root 64 Aug  5 00:36 0 -> 'pipe:[2450910]'
lrwx------ 1 root root 64 Aug  5 00:36 1 -> /dev/pts/0
lrwx------ 1 root root 64 Aug  5 00:36 2 -> /dev/pts/0
lrwx------ 1 root root 64 Aug  5 00:36 255 -> /dev/pts/0
[root@fobgochod fd]# 

[root@fobgochod fd]# lsof -op 279249
[root@fobgochod fd]# lsof -op 279249
COMMAND    PID USER   FD   TYPE             DEVICE OFFSET     NODE NAME
bash    279249 root  cwd    DIR              253,1        16777345 /root
bash    279249 root  rtd    DIR              253,1             128 /
bash    279249 root  txt    REG              253,1        33794441 /usr/bin/bash
bash    279249 root  mem    REG              253,1        50599498 /usr/lib64/libc-2.28.so
bash    279249 root  mem    REG              253,1        50599500 /usr/lib64/libdl-2.28.so
bash    279249 root  mem    REG              253,1        50599346 /usr/lib64/libtinfo.so.6.1
bash    279249 root  mem    REG              253,1        50599491 /usr/lib64/ld-2.28.so
bash    279249 root  mem    REG              253,1        33794440 /usr/lib64/gconv/gconv-modules.cache
bash    279249 root    0u   CHR              136,0    0t0        3 /dev/pts/0
bash    279249 root    1w  FIFO               0,13    0t0  2450910 pipe
bash    279249 root    2u   CHR              136,0    0t0        3 /dev/pts/0
bash    279249 root  255u   CHR              136,0    0t0        3 /dev/pts/0
[root@fobgochod fd]#
[root@fobgochod fd]# lsof -op 279250
COMMAND    PID USER   FD   TYPE             DEVICE OFFSET     NODE NAME
bash    279250 root  cwd    DIR              253,1        16777345 /root
bash    279250 root  rtd    DIR              253,1             128 /
bash    279250 root  txt    REG              253,1        33794441 /usr/bin/bash
bash    279250 root  mem    REG              253,1        50599498 /usr/lib64/libc-2.28.so
bash    279250 root  mem    REG              253,1        50599500 /usr/lib64/libdl-2.28.so
bash    279250 root  mem    REG              253,1        50599346 /usr/lib64/libtinfo.so.6.1
bash    279250 root  mem    REG              253,1        50599491 /usr/lib64/ld-2.28.so
bash    279250 root  mem    REG              253,1        33794440 /usr/lib64/gconv/gconv-modules.cache
bash    279250 root    0r  FIFO               0,13    0t0  2450910 pipe
bash    279250 root    1u   CHR              136,0    0t0        3 /dev/pts/0
bash    279250 root    2u   CHR              136,0    0t0        3 /dev/pts/0
bash    279250 root  255u   CHR              136,0    0t0        3 /dev/pts/0
[root@fobgochod fd]# 
```

### PageCache

- 又称pcache，其中文名称为页高速缓冲存储器，简称页高缓
- page cache的大小为一页，通常为4K
- 内核会在以下三种情况下将dirty page 写回磁盘:
    - 用户进程调用sync() 和 fsync()系统调用
    - 空闲内存低于特定的阈值(threshold)
    - Dirty数据在内存中驻留的时间超过一个特定的阈值

## 缓存

int 0x80 int cpu指令 0x80：128 1000 0000 值、寄存器

中断描述符表 0 1 2 128 call back（保护现场、切换用户态、内核态） 255

协处理器 DMA

- DMA，全称Direct Memory Access，即直接存储器访问。

```sh
rm -rf *out*
javac OSFileIO.java
strace -ff -o out java OSFileIO $1
```
