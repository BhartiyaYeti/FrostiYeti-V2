pipeline {
    agent any
    
    tools {
        nodejs "NodeJS"
        terraform "Terraform"
    }

    environment {
        GCP_PROJECT_ID = 'frostyyeti'
        GCP_REGION = 'us-central1'
        SERVICE_ACCOUNT_KEY = credentials('65dadb94-fdb7-42c0-bc62-71c03b6c40f9')
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
        stages {
        stage('Terraform Init') {
            steps {
                sh 'terraform init'
            }
        }

        stage('Terraform Apply') {
            steps {
                sh 'terraform apply -auto-approve \
                    -var="project_id=${GCP_PROJECT_ID}" \
                    -var="region=${GCP_REGION}" \
                    -var="service_account_key=${SERVICE_ACCOUNT_KEY}"'
            }
        }
    }
    }
}
