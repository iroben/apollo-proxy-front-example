"use strict"
const urllib = require("urllib")
const fs = require("fs")

/*========================== 改这些就好了，其它不要动 ==========================*/
let apollo = {
  appId: "apollo-proxy",
  clusterName: "default",
  namespaces: ["application", "apollo-proxy-public"],
}

let configFile = "./apollo-config.js"

/*========================== 改这些就好了，其它不要动 ==========================*/
let jenkins = {
  appId: process.env.CI_PROJECT_ID || "norecord",
  branch: process.env.CI_COMMIT_REF_NAME || "dev",
}

let configs = {}

let configServerUrl =
  process.env.APOLLO || "http://admin:123456@10.11.101.196:9999/dev"

console.log("同步apollo 配置数据")

const options = {
  method: "GET",
  headers: {
    "Content-Type": "application/json;charset=UTF-8",
  },
  contentType: "json",
  dataType: "json",
}
let run = async () => {
  let uris = apollo.namespaces.map((v) => {
    console.log(
      `${configServerUrl}/${jenkins.appId}/${jenkins.branch}/configs/${apollo.appId}/${apollo.clusterName}/${v}`
    )
    return `${configServerUrl}/${jenkins.appId}/${jenkins.branch}/configs/${apollo.appId}/${apollo.clusterName}/${v}`
  })
  const bundle = await Promise.all(
    uris.map((uri) => urllib.request(uri, options))
  )
  bundle.forEach((v, i) => {
    if (v.status !== 200) {
      throw `${apollo.namespaces[i]}配置获取失败`
    }
    configs[v.data.namespaceName] = v.data.configurations
  })
  let configStr = JSON.stringify(configs)
  fs.writeFileSync(
    configFile,
    `/* eslint-disable */
    export default ${configStr}`,
    (err) => {
      if (err) {
        console.error(err)
        return
      }
    }
  )
  console.log("apollo 配置数据同步完成")
}
run()
