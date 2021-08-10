# 内核中PageCache、mmap作用、java文件系统io、nio、内存中缓冲区作用

> `线性地址`到`物理地址`转换由MMU来完成
> 应用程序运行时访问`线性地址`没有对应`物理地址`，会触发缺页异常(软中断)，系统由用户态切换内核态，分配地址(新的页)，再切换回用户态，继续执行

- 线性地址：每个应用程序对应的虚拟地址，是连续的
- 物理地址
- MMU是Memory Management Unit的缩写，中文名是内存管理单元
- 缺页

PageCache是内核维护的中间层，使用多大内存，是否淘汰，是否延时，是否丢数据



- PCB：每个进程在内核中都有一个进程控制块(Processing Control Block)



```sh
vi /etc/sysctl.conf
sysctl -p

sysctl -a | grep dirty
# 
vm.dirty_background_bytes = 0
vm.dirty_background_ratio = 10
vm.dirty_bytes = 0
vm.dirty_ratio = 30
vm.dirty_expire_centisecs = 3000
vm.dirty_writeback_centisecs = 500
```

ll -h && pcstat ooxx.txt

FileOutputStream、 BufferedOutputStream 默认 8kb

jps

strace -ff -o out java OSFileIO $1

lsof -op java-pid

ByteBuffer

RandomAccessFile FileChannel MappedByteBuffer

