# nginx.conf

[Full Example Configuration](https://www.nginx.com/resources/wiki/start/topics/examples/full/)

> 目录结构

```
/
├── opt
│   ├── install
│   ├── package
│   └── source
│       └── backend
│       │   └── hold-on
│       └── frontend
│           ├── GitBook
│           │   └── OnJava8
│           ├── vue
│           │   └── admin
│           └── vuepress
│               ├── docs  
│               └── fobgochod
├── root(me)
└── usr
```

> 创建目录

```sh
mkdir -p /opt/{install,package,source/{backend/hold-on,frontend/{GitBook/OnJava8,vue/admin,vuepress/{docs,fobgochod}}}}
```

> 修改nginx.conf添加一行`include /opt/install/nginx/conf.d/*.conf;`  
> 保证了`/opt/install/nginx/conf.d/`下,所有以.conf结尾的配置文件, 都会被主配置文件nginx.conf引入并生效

```sh {8}
mkdir -p /opt/install/nginx/conf.d
vi /opt/install/nginx/nginx.conf

http {
    include       mime.types;
    default_type  application/octet-stream;

    include /opt/install/nginx/conf.d/*.conf;
}
```

### 静态站点(vuepress、gitbook)

> 注：
> 1. 网站部署到 `http://zhouxiao.co/docs/`,那么`config.js`的`base`应该被设置成`"/docs/"`

```sh
server {
    listen       80;
    server_name  localhost;

    access_log  logs/access.localhost.log  main;

    location / {
        root   html;
        index  index.html index.htm;
    }
    
    # 1
    location /docs {
        alias /opt/source/frontend/vuepress/fobgochod/dist;
        try_files $uri $uri/ /index.html;
        index  index.html index.htm;
    }
    
    location /onjava8 {
        alias /opt/source/frontend/GitBook/OnJava8/_book;
        index  index.html index.htm;
        try_files $uri $uri/ /index.html;;
    }
    
    location /docs/ {
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header Host      $http_host;
        proxy_pass http://localhost:7001/;
    }
}
```

### vue

```sh
server {
    listen       80;
    server_name  localhost;

    access_log  logs/access.localhost.log;

    location /admin {
        alias /opt/source/frontend/vue/admin/dist;
        try_files $uri $uri/ @router;
        index  index.html index.htm;
    }
    
    location @router {
        rewrite ^.*$ /admin/index.html last;
    }
    
    location /admin/ {
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header Host      $http_host;
        proxy_pass http://localhost:7002/;
    }
}
```

### 后端服务

> 注：
> 1. 访问`http://zhouxiao.co/api/v1/`,会实际访问`http://localhost:7003/api/v1`
> 2. 访问`http://zhouxiao.co/console/api/v1/`,会实际访问`http://localhost:7004/api/v1`

```sh
server {
    listen       80;
    server_name  localhost;

    access_log  logs/access.localhost.log;

    # 1 
    location /api/v1/ {
       proxy_pass http://localhost:7003;
    }
    
    # 2 多了一个/
    location /console/ {
       proxy_pass http://localhost:7004/;
    }
}
```

### 二级域名

```sh
server {
    listen       80;
    server_name  docs.zhouxiao.co;
    
    access_log  logs/access.docs.zhouxiao.co.log;
    
    root /opt/source/frontend/vuepress/docs/dist;

    location / {
        try_files $uri $uri/ /index.html;
        index  index.html index.htm;
    }
}
```
