import { Bucket, Stack, StackProps, Construct } from "sst/constructs";

export class StorageStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    // Create an S3 bucket
    const bucket = new Bucket(this, "Uploads");

    // Define your DynamoDB table (assuming you already have this defined)
    const table = new Table(this, "NotesTable", {
      // Specify your table properties here
    });

    // Return the resources in this stack
    return {
      bucket,
      table,
    };
  }
}
