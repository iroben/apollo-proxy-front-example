pipeline {
    environment {
        // 写到全局的凭据比较好
        APOLLO_FAT = "http://admin:123456@10.11.101.196:9999/fat"
        APOLLO_PROD = "http://admin:123456@10.11.101.196:9999/prod"
    }

    agent any

    // 如果没有安装 Generic Webhook Trigger Plugin，请删除triggers 配置
    triggers {        
        GenericTrigger(
            genericVariables: [
                [key:'TRIGGER', value:'$.TRIGGER']
            ],
            token: env.JOB_NAME,
            printPostContent: true
        )
    }


    stages {
         stage('init') {
            steps {
                script {
                    str = env.BUILD_URL.substring(env.BUILD_URL.indexOf('/job/') + 5)
                    env.CI_PROJECT_ID = str.substring(0, str.indexOf('/'))
                    env.CI_COMMIT_REF_NAME = env.BRANCH_NAME
                    
                    if (env.BRANCH_NAME == 'test') {
                        // test分支读取测试环境的配置
                        env.APOLLO = APOLLO_FAT
                    }else if (env.BRANCH_NAME == 'master') {
                        // master分支读取正式环境的配置
                        env.APOLLO = APOLLO_PROD
                    }
                }
            }
        }

        stage('load config') {
            agent {
                docker {
                    image 'node:14.15.3'                    
                }
            }
            steps {
                sh "npm ci --registry=https://registry.npm.taobao.org"
                sh "npm run build"
                sh "cat apollo-config.js"
            }
        }

        // 如果没有安装 Generic Webhook Trigger Plugin，请删除下面这个stage
        // apollo-proxy触发的流水线，会执行下面的stage
        stage('trigger from apollo-proxy'){
            steps{
                //input message: "由配置服务触发的构建，确定要发布吗？"
                echo "trigger from apollo-proxy"
            }
            when {
                environment name:'TRIGGER', value:'apollo-proxy'
            }
        }
    }
}

