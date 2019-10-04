#!groovy
// Pipeline as code using Jenkinsfile for a angular app
// @author Anirban Chakraborty

node {
  // Maven Artifact Id and Version
  def ARTIFACT_ID = "simple-ui-angular"
  def VERSION     = "0.0.1.BUILD-SNAPSHOT"
  
  // Sonar configuration attributes
  def SONAR_TOKEN = "0af30a17a1f3987a83773a9096ef1306957b5bd5"
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
            
      def angularCli = docker.build("angular-cli", ".")
      println "Pipeline started in workspace/" + env.JOB_NAME + "/" + env.BRANCH_NAME
      
      stage('SCM Checkout') {
        println "########## Checking out latest from git repo ##########"
        checkout scm
      }

      stage('NPM Install') {
        angularCli.inside("-v ${PWD}:/app -v /app/node_modules") {
           withEnv(["NPM_CONFIG_LOGLEVEL=warn"]) {
             sh("npm install")
           }
        }
      }
  
      stage('Unit Test') {
        angularCli.inside("-v ${PWD}:/app -v /app/node_modules") {
          withEnv(["CHROME_BIN=/usr/bin/chromium-browser"]) {
            sh("ng test --progress=false --watch false")
          }
        }
        junit '**/test-results.xml'
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

      stage('Archive') {
        sh 'tar -cvzf dist.tar.gz --strip-components=1 dist'
        archive 'dist.tar.gz'
      }

      stage('Deploy') {
        milestone()
        echo "Deploying..."
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


