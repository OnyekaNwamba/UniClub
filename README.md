# UniClub
QMUL Final Year Project
- - -

UniClub is a social media application for university students to meet other students.

## Running the application

### Prerequisite
1. Node and npm (v5.2+) installed from https://nodejs.org/en/download/
2. XCode installed from: https://developer.apple.com/xcode/
3. iOS Simulator / iOS device
4. Internet connection
5. MacOS
6. AWS and Firebase accounts:
   1. AWS account needed for AWS API key, secret code and account code
   2. Google cloud account needed for unique Firebase configurations and keys

### There are two parts (directories) in the project:
1. socialmobileapp: Front-end
2. socialappservice: Back-end

### Running
In the socialmobileapp directory:
   1. Run `npm install` to install package dependencies.
      1. This is because the `node_modules` folder was deleted to comply with the 50Mb QM+ submission limit
   2. Run `cd ios && pod install && cd ..` to install cocoapods dependencies
   3. Run `npx run-ios`
   4. Pick a simulator
      1. Recommended: iPhone 13 Pro or iPhone 13 Pro Max

### Google Cloud Credentials
- Google cloud credentials in the front-end were removed for security, you will need to provide your own credentials to test the application
- In `routes.jsx`:
  - ```initializeApp({
    apiKey: "API_KEY",
    authDomain: "AUTH_DOMAIN",
    projectId: "PROJECT_ID",
    storageBucket: "STORAGE_BUCKET",
    messagingSenderId: "MESSAGING_SENDER_ID",
    appId: "APP_ID",
    measurementId: "MEASUREMENT_ID"
    });```
  - The needed credentials for the above code can be acquired by:
    1. Create a Google Cloud Platform account at: https://console.cloud.google.com
    2. Create a Firebase project:
       1. In the [Firebase console](https://console.firebase.google.com/) click `Add Project`
    3. Register the app:
       1. In the center of the Firebase console's project overview page, click the Web icon to launch the setup workflow.
       2. If you've already added an app to your Firebase project, click Add app to display the platform options.
       3. Click Register App.
       4. The on-screen instructions will outline how to populate the above code with the correct credentials

### AWS Credentials
- AWS credentials in the front-end were removed for security, credentials are needed for S3 uploads to store profile pictures. 
- You will need to provide your own credentials to test the application:
  1. Create an AWS Account [here](https://portal.aws.amazon.com/billing/signup#/start/email)
  2. Follow this guide to get your AWS access key ID and secret access ID: https://docs.aws.amazon.com/powershell/latest/userguide/pstools-appendix-sign-up.html
  3. In order to use AWS tools, make sure you add S3, API Gateway, DynamoDB and Lambda Admin permissions to your IAM user for complete (not best practice, but ok for a one-man team):
     1. Instructions on how to create an admin user if you don't have one: https://docs.aws.amazon.com/IAM/latest/UserGuide/getting-started_create-admin-group.html
- In the front-end code, you will need to replace lines in the `api.jsx` file with your credentials:
  - ```S3_BUCKET = "social-app-user-profile-pictures";
    S3_BUCKET = "social-app-user-profile-pictures";
    REGION = "eu-west-2";
    ACCESS_KEY = "YOUR AWS ACCESS ID";
    SECRET_KEY = "YOUR AWS SECRET KEY";```
- The S3 bucket created is public, so public read/write is available
