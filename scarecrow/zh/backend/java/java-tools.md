# Java问题排查

## Linux

```sh
# shift+M 按内存排序  f 进入设置界面
top

# 监控内存和CPU
vmstat


# 查看内存
free -th
# 3s刷新一次
free -th -s 3

# 磁盘
df -h
```

## Java

### jps

```sh
# 查找进程号
jps -lv
```

### jstat

```sh
# 每秒打印一次gc，总共5次
jstat -gc [pid] 1000 5
jstat -gcutil [pid] 1000 5 
```

### jstack

```sh
jstack -l 3333 #进程号
jstack -m [pid]
jstack -F [pid]
```

### jmap

```sh
# 查看整个JVM内存状态
jmap -heap [pid]
# 查看JVM堆中对象详细占用情况
jmap -histo [pid]
jmap -histo 3333 | head -10

# 出现OOM时生成堆dump
-XX:+HeapDumpOnOutOfMemoryError
# 生成堆文件地址
-XX:HeapDumpPath=/DAP/logs/heap_dump.hprof

# 直接生成当前JVM的dump文件，所有对象在堆中的分布情况
jmap -dump:format=b,file=/DAP/logs/heap_dump.hprof [pid]
# 加:live 参数 dump 存活对象在队中的分布情况
jmap -dump:live,format=b,file=/DAP/logs/heap_dump.hprof [pid]

```

### jinfo

```sh
# 查看JVM参数和系统参数
jinfo pid

# 查看JVM参数，其中 Non-default VM flags 是虚拟机默认设置的参数，Command line 是用户指定的参数，比如命令行启动 jar 包的时候加上的参数。
jinfo -flags [pid]
# 可以查看指定参数的值，比如查看堆的最大值(-XX:MaxHeapSize也就是-Xmx)
jinfo -flag MaxHeapSize [pid]
# 查看系统参数
jinfo -sysprops [pid]

# 允许动态修改的参数
java -XX:+PrintFlagsInitial | grep manageable
```

## Docker

```sh
# 进入容器
docker exec -it containerName /bin/sh
# 日志
docker logs containerName
# 查找
docker ps -f "name=test"
docker images -f=reference='test'
```

## DB

```sh
# @formatter:off

# 只列出前100条
show processlist;
# 全列出
show full processlist;
# 指定数据库
select * from information_schema.processlist a where a.db = 'iam';


# 查看正在锁的事务
select * from information_schema.innodb_locks;
# 查看等待锁的事务
select * from information_schema.innodb_lock_waits;


# 当前运行的所有事务 
select * from information_schema.innodb_trx;
select concat('kill ', trx_mysql_thread_id, ';') from information_schema.innodb_trx;
# kill trx_mysql_thread_id;

show open tables where in_use > 0;
show open tables from iam;

# @formatter:on
```

```sh
# 查看innodb引擎的运行时信息
show engine innodb status;

# 查看服务器状态
show status like '%lock%';
show status like 'Threads%';
show global status LIKE '%connections';

# 查看variables
show variables like '%timeout%';
show variables like '%open_files_limit%';
show variables like '%table_open_cache%';
# max_used_connections / max_connections * 100% （理想值≈ 85%）  

# 慢日志
show global variables like '%slow%';
# 日志
show global variables where value like '%log%';
```
