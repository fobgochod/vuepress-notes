# 文件目录操作

## cd

```sh
cd     进入用户主目录；
cd ~   进入用户主目录；
cd -   返回进入此目录之前所在的目录；
cd .   还在当前目录
cd ..  返回上级目录（若当前目录为“/“，则执行完后还在“/"；".."为上级目录的意思）；
cd /   进入根目录（“/“）

pwd     查看当前目录
```

## vi

### 命令模式（Command mode）

```sh
a：在当前字符后添加文本；
A：在行末添加文本；
i：在当前字符前插入文本；
I：在行首插入文本；
o：在当前行后面插入一空行；
O：在当前行前面插入一空行；

x或X：删除一个字符，x删除光标后的，而X删除光标前的；
D：删除从当前光标到光标所在行尾的全部字符；
dd：删除光标行正行内容

# 如果修改过，保存当前文件，然后退出！效果等同于(保存并退出)
ZZ
# 不保存，强制退出。效果等同于 :q!
ZQ

# 翻页
Ctrl+u：向文件首翻半屏；
Ctrl+d：向文件尾翻半屏；
Ctrl+f：向文件尾翻一屏；
Ctrl+b：向文件首翻一屏；
```

### 输入模式（Insert mode）

```sh
# 从编辑模式切换到命令模式
Esc
# 回车键，换行
Enter
# 退格键，删除光标前一个字符
Backspace
# 删除键，删除光标后一个字符
DEL
# 移动光标到行首/行尾
HOME/END
# 上/下翻页
Page Up/Page Down
```

### 底线命令模式（Last line mode）

```sh
# 保存并退出
:wq

# 保存
:w

# 强制保存
:w!

# 退出
:q

# 强制退出
:q!

# 显示行号
:set nu

# 不显示行号
:set nonu

# 光标跳转到指定行的行首
:行号

# 光标跳转到最后一行的行首
:$

# 从当前光标所在位置开始向文件尾部查找 
# 小写n匹配下一个
/word

# 从当前光标所在位置开始向文件头部查找
?word
```

## cat、more、less

```sh
cat -n /etc/profile | more

# -n 显示行号

# 按Enter键：下一行
# 按Space键：下一页
# 按Q键：退出

cat -n /etc/profile | less

# 用PageUp键向上翻页，用PageDown键向下翻页
# 按Enter键：下一行。
# 按Q键：退出

# 查找指定内容PATH、"export PATH"，有空格要用""
cat /etc/profile | grep PATH
cat /etc/profile | grep "export PATH"
```

## tail、head

```sh
# 查找文件的开头的内容
# 前5行
head -5 /etc/profile
head -n +5 /etc/profile
# 显示第一行到倒数5行
head -n -5 /etc/profile

# -n 头部内容的行数
# -v 显示文件名

# 查找文件的结尾的内容
# 最后5行
tail -5 /etc/profile
tail -n -5 /etc/profile
# 从第5行至文件末尾
tail -n +5 /etc/profile

# -n 结尾内容的行数
# -v 显示文件名
```

## 统计

```sh
# 统计某个字符串出现的次数
grep -o objStr filename|wc -l

# 如果是多个字符串出现次数，直接用\| 链接起来
grep -o 'objStr1\|objStr2' filename|wc -l

# wc命令介绍：l表示行数; w表示英文单词数; m表示字符数
wc [-lwm]

# 统计home目录下文件/目录数(只查一级)
# 查找文件数量
ls -l /home | grep '^-' | wc -l
# 查找目录数量
ls -l /home | grep '^d' | wc -l

# 统计home目录下所有文件/目录数(递归查所有, 含子子孙孙)
# 查找文件数量
ls -lR /home | grep '^-' | wc -l
# 查找目录数量
ls -lR /home | grep '^d' | wc -l
```
