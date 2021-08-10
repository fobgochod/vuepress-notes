module.exports = [
    {
        title: '前言',
        collapsable: false,
        sidebarDepth: 2,
        children: [
            '/zh/introduction/about-me',
            '/zh/introduction/about-the-project',
            '/zh/introduction/guide/quick-start'
        ]
    },
    {
        title: '前端',
        collapsable: false,
        sidebarDepth: 2,
        children: [
            '/zh/frontend/npm',
            '/zh/frontend/yarn',
            '/zh/frontend/vuepress',
            '/zh/frontend/gitbook',
        ]
    },
    {
        title: '后端',
        collapsable: false,
        sidebarDepth: 2,
        children: [
            {
                title: 'Java',
                collapsable: false,
                sidebarDepth: 2,
                children: [
                    '/zh/backend/java/java-install',
                ]
            },
            {
                title: 'Nginx',
                collapsable: false,
                sidebarDepth: 2,
                children: [
                    '/zh/backend/nginx/nginx-install',
                    '/zh/backend/nginx/nginx-conf',
                    '/zh/backend/nginx/nginx-commands',
                ]
            },
        ]
    },
    {
        title: '数据库',
        collapsable: false,
        sidebarDepth: 2,
        children: [
            {
                title: 'MariaDB',
                collapsable: false,
                sidebarDepth: 2,
                children: [
                    '/zh/database/mariadb/mariadb-install',
                    '/zh/database/mariadb/mariadb-documentation',
                ]
            },
            {
                title: 'Redis',
                collapsable: false,
                sidebarDepth: 2,
                children: [
                    '/zh/database/redis/redis-install',
                    '/zh/database/redis/redis-install-windows',
                    '/zh/database/redis/redis-commands',
                ]
            },
            {
                title: 'MongoDB',
                collapsable: false,
                sidebarDepth: 2,
                children: [
                    '/zh/database/mongodb/mongodb-install',
                    '/zh/database/mongodb/mongodb-commands',
                    '/zh/database/mongodb/mongodb-dump',
                ]
            }
        ]
    },
    {
        title: 'OS',
        collapsable: false,
        sidebarDepth: 2,
        children: [
            {
                title: 'Linux',
                collapsable: false,
                sidebarDepth: 2,
                children: [
                    '/zh/os/linux/linux',
                    '/zh/os/linux/vi',
                    '/zh/os/linux/user-group',
                ]
            },
            '/zh/os/windows',
            {
                title: 'Docker',
                collapsable: false,
                sidebarDepth: 2,
                children: [
                    '/zh/os/docker/docker-install',
                    '/zh/os/docker/docker-commands',
                    '/zh/os/docker/docker-maven-plugin',
                    '/zh/os/docker/dockerfile',
                ]
            },
            {
                title: 'Kubernetes',
                collapsable: false,
                sidebarDepth: 2,
                children: [
                    '/zh/os/kubernetes/minikube-install',
                    '/zh/os/kubernetes/minikube-commands',
                ]
            },
            '/zh/os/nous'
        ]
    },
    {
        title: '学习中 📚',
        path: '/zh/mashibing/',
        collapsable: true,
        sidebarDepth: 2,
        children: [
            {
                title: 'SysIO',
                path: '/zh/mashibing/sysio/',
                collapsable: false,
                sidebarDepth: 2,
                children: [
                    '/zh/mashibing/sysio/sysio1',
                    '/zh/mashibing/sysio/sysio2',
                    '/zh/mashibing/sysio/sysio3',
                    '/zh/mashibing/sysio/sysio4',
                    '/zh/mashibing/sysio/sysio5',
                    '/zh/mashibing/sysio/sysio6',
                    '/zh/mashibing/sysio/sysio7',
                ]
            },
            {
                title: 'JUC',
                path: '/zh/mashibing/juc/',
                collapsable: false,
                sidebarDepth: 2,
                children: [
                    '/zh/mashibing/juc/thread1',
                    '/zh/mashibing/juc/thread2',
                    '/zh/mashibing/juc/thread3',
                    '/zh/mashibing/juc/thread4',
                    '/zh/mashibing/juc/thread5',
                    '/zh/mashibing/juc/thread6',
                    '/zh/mashibing/juc/thread7',
                    '/zh/mashibing/juc/thread8',
                    '/zh/mashibing/juc/thread9',
                ]
            },
            {
                title: 'JVM',
                path: '/zh/mashibing/jvm/',
                collapsable: false,
                sidebarDepth: 2,
                children: [
                    '/zh/mashibing/jvm/jvm1',
                    '/zh/mashibing/jvm/jvm2',
                    '/zh/mashibing/jvm/jvm3'
                ]
            },
            {
                title: 'MySQL',
                path: '/zh/mashibing/mysql/',
                collapsable: false,
                sidebarDepth: 2,
                children: [
                    '/zh/mashibing/mysql/data',
                    '/zh/mashibing/mysql/mysql1',
                    '/zh/mashibing/mysql/mysql2',
                    '/zh/mashibing/mysql/mysql3',
                    '/zh/mashibing/mysql/mysql4'
                ]
            },
            {
                title: 'Redis',
                path: '/zh/mashibing/redis/',
                collapsable: false,
                sidebarDepth: 2,
                children: [
                    '/zh/mashibing/redis/redis1',
                    '/zh/mashibing/redis/redis8'
                ]
            }
        ]
    },
    {
        title: '读书笔记',
        collapsable: false,
        sidebarDepth: 2,
        children: [
            '/zh/book/this-is-why',
            '/zh/book/blog',
            '/zh/book/on-java-8',
            '/zh/book/understanding-the-jvm',
        ]
    },
    {
        title: '附录',
        collapsable: false,
        sidebarDepth: 2,
        children: [
            '/zh/appendix/markdown',
            '/zh/appendix/git',
        ]
    }
]
