pipeline {
    agent any
    
    tools {
        nodejs "NodeJS"
        terraform "Terraform"
    }

    environment {
        GCP_PROJECT_ID = 'frostyyeti'
        GCP_REGION = 'us-central1'
        SERVICE_ACCOUNT_KEY = credentials('97a3a886-d138-40db-ad09-4baf0d93304a')
        GCR_REPO = 'gcr.io/frostyyeti/frostyyeti-react'
        IMAGE_NAME = "frostyyeti-react"
    }

    stages {
        stage('Checkout') {
            steps {
                // Checkout your repository
                git branch: 'main', credentialsId: '86bb5f5e-fc4e-44e2-b107-9c83f1c56653', url: 'https://github.com/BhartiyaYeti/FrostiYeti-V2'
            }
        }

        stage('Build Docker Image') { 
            steps {
                script {
                    sh """
                    gcloud auth activate-service-account --key-file=${SERVICE_ACCOUNT_KEY}
                    gcloud auth configure-docker
                    docker build -t edulink-react .
                    docker tag edulink-react gcr.io/frostyyeti/edulink-react:latest
                    docker push gcr.io/frostyyeti/edulink-react:latest
                    """
                }
            }
        
        }

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

        stage('Deploy App to GKE using Anisble') {
            steps {
                script {
                    dir('ansible') {
                        sh 'ansible-playbook playbook1.yaml'
                    }
                }
            }
        }
    }
}
