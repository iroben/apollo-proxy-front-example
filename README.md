[apollo-proxy链接](https://github.com/iroben/apollo-proxy)


该项目可用于`jenkins`的**多分支流水线**和`gitlab`的**docker executor**流水线

## 用jenkins集成
修改`Jenkinsfile`，改成 `apollo-proxy` 部署后的地址
```
environment {        
        APOLLO_FAT = "http://admin:123456@10.11.101.196:9999/fat"
        APOLLO_PROD = "http://admin:123456@10.11.101.196:9999/prod"
    }
```
然后创建一个**多分支流水线**，点构建即可

`test`分支会读取`APOLLO_FAT`下的配置

`master`分支会读取`APOLLO_PROD`下的配置


## 用gitlab集成
修改`.gitlab-ci.ymml`，改成 `apollo-proxy` 部署后的地址
```
variables:
  APOLLO_FAT: "http://admin:123456@10.11.101.196:9999/fat"
  APOLLO_PROD: "http://admin:123456@10.11.101.196:9999/prod"

```
`push` 代码就可

`test` 分支会读取 `APOLLO_FAT` 下的配置

`master` 分支会读取 `APOLLO_PROD` 下的配置