#!groovy
// Pipeline as code using Jenkinsfile for a angular app
// @author Anirban Chakraborty

node {
  // Maven Artifact Id and Version
  def ARTIFACT_ID = "simple-ui-angular"
  def VERSION     = "0.0.1.BUILD-SNAPSHOT"
  
  // Sonar configuration attributes
  def SONAR_TOKEN = "a10b3cc2b6306878395145115ad5af3cef2ccd0d"
  def SONAR_URL = "http://cloudnativelab-sonar-alb-1809467691.us-east-1.elb.amazonaws.com"

  // AWS S3 Bucket 
  def AWS_S3_BUCKET  = "s3.simple.bucket"
  // AWS attributes - might not be required to be changed often   
  def AWS_REGION  = "us-east-1"
  def AWS_ACCOUNT = "595233065713" 
// ID of credentials in Jenkins as configured in Jenkins project
  def AWS_CREDENTIAL_ID = "aws_id"  
      
  ws("workspace/${env.JOB_NAME}/${env.BRANCH_NAME}") {
    try {      
      println "Pipeline started in workspace/" + env.JOB_NAME + "/" + env.BRANCH_NAME
      def angularCli

      stage('SCM Checkout') {
        println "########## Checking out latest from git repo ##########"
        checkout scm
      }

      stage('NPM Install') {
        angularCli = docker.build("angular-cli", ".")
        angularCli.inside("-v ${PWD}:/app -v /app/node_modules -p 9876:9876 -p 4200:4200") {
           withEnv(["NPM_CONFIG_LOGLEVEL=warn", "CHROME_BIN=/usr/bin/chromium-browser"]) {
          //   sh("npm install")
                          sh("npm run sonar") 

           //  sh("npm install @angular/cli")
           //  sh("ng test --progress=false --watch=false --code-coverage")
           }
        }
      }

      stage('Sonar') {
        angularCli.inside("-v ${PWD}:/app -v /app/node_modules") {
           //  sh("npm install sonar-scanner")
             sh("chmod 777 /var/jenkins_home/workspace/simple-ui-angular/master/master/node_modules/sonar-scanner/bin/sonar-scanner")
           //  sh("npm run sonar") 
         }
      }
      
       stage('Lint') {
         angularCli.inside("-v ${PWD}:/app -v /app/node_modules") {
           sh("ng lint")
        }
       }
      stage('Build') {
        milestone()
        angularCli.inside("-v ${PWD}:/app -v /app/node_modules") {
          sh("ng build --prod --aot --sm --progress=false")
        }
      }

      stage('Upload') {
        def awsCli = docker.build("aws-cli", "./aws")
        awsCli.inside("-v $HOME/.aws:/root/.aws") {
          withCredentials(
            [[
              $class: 'AmazonWebServicesCredentialsBinding',
              accessKeyVariable: 'AWS_ACCESS_KEY_ID',
              credentialsId: AWS_CREDENTIAL_ID,  
              secretKeyVariable: 'AWS_SECRET_ACCESS_KEY'
            ]]) {
            
            sh("aws s3 cp dist/ s3://s3.cloudfront.simple.bucket/ --recursive")
            }
        }
      }
      
    } catch(e) {
      println "Err: Incremental Build failed with Error: " + e.toString()
      currentBuild.result = 'FAILED'
      throw e
    } finally  {
      stage('Cleanup') {
        println "Cleaning up"
        deleteDir()
      }          
    }
  }
}

