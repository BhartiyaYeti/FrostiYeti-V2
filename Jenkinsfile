pipeline {
    agent any
    
    stages {
        stage('Checkout') {
            steps {
                // Checkout your repository
                git 'https://github.com/BhartiyaYeti/FrostiYeti-V2.git'
            }
        }
        stage('Install Dependencies') {
            steps {
                // Install Node.js and npm
                // This assumes you have Node.js and npm pre-installed on your Jenkins agent
                sh 'npm install'
            }
        }
        stage('Test') {
            steps {
                // Your test steps here
                sh 'npm test'
            }
        }
    }
}
