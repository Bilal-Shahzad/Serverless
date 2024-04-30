import { createRequire as topLevelCreateRequire } from 'module';const require = topLevelCreateRequire(import.meta.url);
var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });

// stacks/ApiStack.ts
import { Api, Config, use } from "sst/constructs";

// stacks/StorageStack.ts
import { Bucket, Table } from "sst/constructs";
function StorageStack({ stack }) {
  const bucket = new Bucket(stack, "Uploads", {
    cors: [
      {
        maxAge: "1 day",
        allowedOrigins: ["*"],
        allowedHeaders: ["*"],
        allowedMethods: ["GET", "PUT", "POST", "DELETE", "HEAD"]
      }
    ]
  });
  const table = new Table(stack, "Notes", {
    fields: {
      userId: "string",
      noteId: "string"
    },
    primaryIndex: { partitionKey: "userId", sortKey: "noteId" }
  });
  return {
    bucket,
    table
  };
}
__name(StorageStack, "StorageStack");

// stacks/ApiStack.ts
function ApiStack({ stack }) {
  const { table } = use(StorageStack);
  const STRIPE_SECRET_KEY = new Config.Secret(stack, "STRIPE_SECRET_KEY");
  const api = new Api(stack, "Api", {
    defaults: {
      authorizer: "iam",
      function: {
        bind: [table, STRIPE_SECRET_KEY]
      }
    },
    routes: {
      "GET /notes": "packages/functions/src/list.main",
      "POST /notes": "packages/functions/src/create.main",
      "GET /notes/{id}": "packages/functions/src/get.main",
      "PUT /notes/{id}": "packages/functions/src/update.main",
      "DELETE /notes/{id}": "packages/functions/src/delete.main",
      "POST /billing": "packages/functions/src/billing.main"
    }
  });
  stack.addOutputs({
    ApiEndpoint: api.url
  });
  return {
    api
  };
}
__name(ApiStack, "ApiStack");

// stacks/AuthStack.ts
import * as iam from "aws-cdk-lib/aws-iam";
import { Cognito, use as use2 } from "sst/constructs";
function AuthStack({ stack, app }) {
  const { api } = use2(ApiStack);
  const { bucket } = use2(StorageStack);
  const auth = new Cognito(stack, "Auth", {
    login: ["email"]
  });
  auth.attachPermissionsForAuthUsers(stack, [
    // Allow access to the API
    api,
    // Policy granting access to a specific folder in the bucket
    new iam.PolicyStatement({
      actions: ["s3:*"],
      effect: iam.Effect.ALLOW,
      resources: [
        bucket.bucketArn + "/private/${cognito-identity.amazonaws.com:sub}/*"
      ]
    })
  ]);
  stack.addOutputs({
    Region: app.region,
    UserPoolId: auth.userPoolId,
    UserPoolClientId: auth.userPoolClientId,
    IdentityPoolId: auth.cognitoIdentityPoolId
  });
  return {
    auth
  };
}
__name(AuthStack, "AuthStack");

// stacks/FrontendStack.ts
import { StaticSite, use as use3 } from "sst/constructs";
function FrontendStack({ stack, app }) {
  const { api } = use3(ApiStack);
  const { auth } = use3(AuthStack);
  const { bucket } = use3(StorageStack);
  const site = new StaticSite(stack, "ReactSite", {
    path: "packages/frontend",
    buildCommand: "pnpm run build",
    buildOutput: "dist",
    customDomain: app.stage === "prod" ? "demo.sst.dev" : void 0,
    // Pass in our environment variables
    environment: {
      VITE_REGION: app.region,
      VITE_BUCKET: bucket.bucketName,
      VITE_USER_POOL_ID: auth.userPoolId,
      VITE_API_URL: api.customDomainUrl || api.url,
      VITE_USER_POOL_CLIENT_ID: auth.userPoolClientId,
      VITE_IDENTITY_POOL_ID: auth.cognitoIdentityPoolId || ""
    }
  });
  stack.addOutputs({
    SiteUrl: site.customDomainUrl || site.url
  });
}
__name(FrontendStack, "FrontendStack");

// sst.config.ts
var sst_config_default = {
  config(_input) {
    return {
      name: "notes",
      region: "us-east-1"
    };
  },
  stacks(app) {
    app.stack(StorageStack).stack(ApiStack).stack(AuthStack).stack(FrontendStack);
  }
};
export {
  sst_config_default as default
};
