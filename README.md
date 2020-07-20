# CDK Homelab

This repository is created to learn CDK. We will be building small bits of infrastructure. The goal is really to try it out and form my own opinion on this vs Terraform.

This repository is initialized with `cdk init` using typescript as the language. At the bottom of this README is the initial README file generated from `cdk init`. It includes some useful commands.

## Multiple Environment/Accounts

One of the primary goal is to learn how to deploy the same infrastructure to different environment/accounts. For example, if you want to define hosted zones for my prod (example.com) and dev (dev.example.com) environments, you would ideally be able to define that in a configuration file (Terraform has .tfvar files).  In CDK, there is a single cdk.json file where the context can reside.  You can potentially create separate cdk.json.<env> files and write a wrapper to copy it to cdk.json before running deploy (Maybe this is a reasonable approach). Alternatively, you can create all the environments configuration in the same context like so:

```
{
  "app": "npx ts-node bin/infra-r53.ts",
  "context": {
    "ENV:dev": {
      "bucketName": "bill-99999-the-dev-bucket"
    },
    "ENV:prod": {
      "bucketName": "bill-00000-the-prod-bucket"
    }
  }
}
```

to use this in code, you will do the following:

```
const targetEnv = scope.node.tryGetContext('env');
const env = scope.node.tryGetContext(`ENV:${targetEnv}`);
const bucket = new s3.Bucket(this, env.bucketName);
```

and deploy by running the following command:

```
cdk deploy -c env=dev   #uses the ENV:dev context
cdk deploy -c env=prod  #uses the ENV:prod contest
```

Further to this, when deploying to different environments, you need to be using the appropriate IAM profile for the account (defined in your ~/.aws/credentials file).  I created the following aliases in my `.bash_profile` to deploy to the desired environments: 

```
cdk-diff () {
  export AWS_PROFILE=$1_admin
  export DEPLOY_ENV=$1
  cdk diff -c env=$1 --app "npx ts-node bin/$2.ts"
}

cdk-deploy () {
  export AWS_PROFILE=$1_admin
  export DEPLOY_ENV=$1
  cdk deploy -c env=$1 --app "npx ts-node bin/$2.ts"
}

cdk-synth () {
  export AWS_PROFILE=$1_admin
  export DEPLOY_ENV=$1
  cdk synth -c env=$1 --app "npx ts-node bin/$2.ts"
}
```

You will use the following commands to deploy to specific environments:
```
cdk-diff <env> <app>
cdk-deploy <env> <app>
cdk-synth <env> <app>
```
For example, in cdk.json, we have removed the `app` and separated out the different apps.  We can deploy the infra-r53 and infra-vpc separately like so:
```
cdk-deploy prod infra-r53
cdk-deploy dev infra-r53
cdk-deploy prod infra-vpc
```

# Welcome to your CDK TypeScript project!

This is a blank project for TypeScript development with CDK.

The `cdk.json` file tells the CDK Toolkit how to execute your app.

## Useful commands

 * `npm run build`   compile typescript to js
 * `npm run watch`   watch for changes and compile
 * `npm run test`    perform the jest unit tests
 * `cdk deploy`      deploy this stack to your default AWS account/region
 * `cdk diff`        compare deployed stack with current state
 * `cdk synth`       emits the synthesized CloudFormation template

 