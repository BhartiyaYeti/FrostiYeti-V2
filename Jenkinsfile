pipeline {
    agent any
    
    tools {
        nodejs "NodeJS"
    }

    stages {
        stage('Checkout') {
            steps {
                // Checkout your repository
                git branch: 'main', credentialsId: '86bb5f5e-fc4e-44e2-b107-9c83f1c56653', url: 'https://github.com/BhartiyaYeti/FrostiYeti-V2'
            }
        }
        // stage('Install Dependencies') {
        //     steps {
        //         // Install Node.js and npm
        //         // This assumes you have Node.js and npm pre-installed on your Jenkins agent
        //         sh 'npm install'
        //     }
        // }
        // stage('Test') {
        //     steps {
        //         // Your test steps here
        //         sh 'npm test'
        //     }
        //     post {
        //         // Post-build actions
        //         success {
        //             echo 'Tests passed successfully!'
        //         }
        //         failure {
        //             echo 'Tests failed! Please check your code.'
        //         }
        //     }
        // }
        stage('Create GKE cluster with Terraform') {
             steps {
                script {
                    dir('terraform') {
                        sh "terraform init"
                        sh "terraform apply --auto-approve"
                    }
                }
            }
           
        }
    }
}
