# 如何开始

::: warning 请确保你的 Node.js 版本 >= 8。
:::

## 参考

VuePress官网的[快速上手](https://vuepress.vuejs.org/zh/guide/getting-started.html)

## 安装

> 创建工作文件夹seven，进入文件夹、

```sh
# 快速初始化package.json
npm init -y

# 将 VuePress 作为一个本地依赖安装
yarn add -D vuepress 
# 或者：
npm install -D vuepress

# 创建 README.md文件
README.md
```

> 在 `package.json` 里加一些脚本:

```json
{
    "scripts": {
        "docs:dev": "vuepress dev .",
        "docs:build": "vuepress build ."
    }
}
```

> 然后就可以开始写作了:

```sh
yarn dev 
# 或者：
npm run dev
```

> 要生成静态的 HTML 文件，运行：

```sh
yarn build 
# 或者：
npm run build
```

默认情况下，文件将会被生成在 .vuepress/dist，当然，你也可以通过 .vuepress/config.js 中的 dest 字段来修改， 生成的文件可以部署到任意的静态文件服务器上，参考 [部署](#部署) 来了解更多。

### 使用插件

> 一个插件可以在以 vuepress-plugin-xxx 的形式发布到 npm，你可以这样使用它：

```js
module.exports = {
    plugins: ['vuepress-plugin-xx']
}
```

> 如果你的插件名以 vuepress-plugin- 开头，你可以使用缩写来省略这个前缀，和上面等价：

```js
module.exports = {
    plugins: ['xxx']
}
```

> 安装当前项目使用到的插件

```sh
# 代码块复制按钮
npm install -D vuepress-plugin-nuggets-style-copy

# 回到顶部(选一个即可)
npm install -D @vuepress/plugin-back-to-top
npm install -D vuepress-plugin-go-top

# markdown插件
npm install -D markdown-it-task-lists
```

> `.vuepress/config.js`添加插件

```js
module.exports = {
    markdown: {
        plugins: ['task-lists']
    },
    plugins: [
        ['@vuepress/back-to-top'],
        ["nuggets-style-copy", {
            copyText: '复制代码',
            tip: {
                time: '3000',
                content: '复制成功',
                title: 'Tips'
            }
        }]
    ]
}
```

## 部署

> 生成静态的 HTML 文件

```sh
npm run build
```

> 拷贝dist目录到服务器

```sh
# 拷贝
cd .vuepress/dist
# 到linux目录
cd /fobgochod/frontend/vuepress/seven/dist
```

> 修改`nginx.config`文件，添加server

```sh
vi /etc/nginx/nginx.config

# 默认服务添加
server {
    location /seven {
        alias /fobgochod/frontend/vuepress/seven/dist;
        index  index.html index.htm;
        autoindex on;
    }
}

# 没有设置base(/)
server {
    listen 8081;
    location / {
        root   /fobgochod/frontend/vuepress/seven/dist;
        index  index.html index.htm;
        try_files $uri $uri/ /index.html;
    }
}
```

> 重启nginx

```sh
systemctl stop nginx.service
systemctl start nginx.service
# 重启
systemctl restart nginx.service
```

## Travis

- [Building a JavaScript and Node.js project](https://docs.travis-ci.com/user/languages/javascript-with-nodejs)
- [GitHub Pages Deployment](https://docs.travis-ci.com/user/deployment/pages)

```yaml
language: node_js
os: linux
dist: xenial
node_js:
  - 10
before_install:
  - export TZ='Asia/Shanghai'
install:
  - npm install
script:
  - npm run build
deploy:
  - provider: pages
    strategy: git
    skip_cleanup: true
    local_dir: dist
    token: $gh_token
    keep_history: true
    target_branch: gh-pages
    on:
      branch: master
```

## 访问

[https://fobgochod.github.io](https://fobgochod.github.io)
