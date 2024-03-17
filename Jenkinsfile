pipeline {
    agent any
    
    tools {
        nodejs "NodeJS"
        terraform "Terraform"
        dockerTool "Docker"
    }

    environment {
        GCP_PROJECT_ID = 'frostyyeti'
        GCP_REGION = 'us-central1'
        SERVICE_ACCOUNT_KEY = credentials('97a3a886-d138-40db-ad09-4baf0d93304a')
        IMAGE_NAME = "frostyyeti-react"
    }

    stages {
        stage('Checkout') {
            steps {
                // Checkout your repository
                git branch: 'main', credentialsId: '86bb5f5e-fc4e-44e2-b107-9c83f1c56653', url: 'https://github.com/BhartiyaYeti/FrostiYeti-V2'
            }
        }

      
        stage('Echo Line') {
            steps {
                sh 'echo "Hello, world!"'
            }
        }

        stage('Build Docker Image') {
            agent {
                docker { image 'node:20.11.1-alpine3.19' }
            }
            steps {
                script {
                    echo 'Building Docker image...'
                    // Build the Docker image using the Dockerfile in the current directory
                    sh 'docker build -t ${IMAGE_NAME}:latest .'
                    sh 'docker tag ${IMAGE_NAME} gcr.io/${GCP_PROJECT_ID}/${IMAGE_NAME}:latest'
                    sh 'gcloud auth configure-docker'
                    sh 'docker push gcr.io/${GCP_PROJECT_ID}/${IMAGE_NAME}:latest'
                    // // Log in to GCR using the service account credentials
                    // withCredentials([file(credentialsId: "${GCP_PROJECT_ID}_artifacts", variable: 'GCR_CRED')]) {
                    //     sh 'cat "${GCR_CRED}" | docker login -u _json_key_base64 --password-stdin https://"${REPO_LOCATION}"-docker.pkg.dev'
                    //     // Push the Docker image to GCR
                    //     sh 'docker push ${IMAGE_NAME}:${IMAGE_TAG}'
                    //     // Log out from GCR
                    //     sh 'docker logout https://"${REPO_LOCATION}"-docker.pkg.dev'
                    // }
                    echo 'Docker image pushed to GCR.'
                }
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
                        sh 'terraform apply -auto-approve \
                    -var="project_id=${GCP_PROJECT_ID}" \
                    -var="region=${GCP_REGION}" \
                    -var="service_account_key=${SERVICE_ACCOUNT_KEY}"'
                    }
                }
            }
           
        }
    }
}
