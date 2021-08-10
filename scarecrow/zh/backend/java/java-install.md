# Install

## 文档

- [https://www.oracle.com/java/technologies/javase-downloads.html](https://www.oracle.com/java/technologies/javase-downloads.html)
- [https://www.oracle.com/java/technologies/oracle-java-archive-downloads.html](https://www.oracle.com/java/technologies/oracle-java-archive-downloads.html)
- [http://jdk.java.net/java-se-ri/8-MR3](http://jdk.java.net/java-se-ri/8-MR3)

## Linux

> 目录结构

```
/
├── opt
│   ├── install
│   │   └── java
│   │       └── null
│   └── package
│       └── java
│           ├── jdk-8u301-linux-x64
│           └── jdk-8u301-linux-x64.tar.gz
├── root(me)
└── usr
```

### 源码安装

> 参考

> 安装

```sh
# 新建目录，拷贝解压java:
mkdir -p /opt/{install/java,package/java}
cd /opt/package/java
wget https://download.oracle.com/otn/java/jdk/8u301-b09/d3c52aa6bfa54d3ca74e617f18309292/jdk-8u301-linux-x64.tar.gz
# wget https://download.java.net/openjdk/jdk8u41/ri/openjdk-8u41-b04-linux-x64-14_jan_2020.tar.gz
# wget https://builds.openlogic.com/downloadJDK/openlogic-openjdk/8u262-b10/openlogic-openjdk-8u262-b10-linux-x64.tar.gz
tar -zxvf jdk-8u301-linux-x64.tar.gz

# 安装
vi /etc/profile
#Java
export JAVA_HOME=/opt/package/java/jdk1.8.0_301
export CLASSPATH=.:${JAVA_HOME}/lib/dt.jar:${JAVA_HOME}/lib/tools.jar
export PATH=$PATH:${JAVA_HOME}/bin

# 让修改生效：
source /etc/profile
```

> 检查

```sh
java -version
```

### YUM安装

> 参考：

```sh
# 查找
yum list java*
# 安装
yum install java-1.8.0-openjdk.x86_64
# 检查
java -version
```
