import { S3Client } from "@aws-sdk/client-s3";

console.log("S3 Client Configuration:");
console.log("- AWS_REGION:", process.env.AWS_REGION);
console.log("- S3_BUCKET:", process.env.S3_BUCKET);
console.log("- AWS_ACCESS_KEY:", process.env.AWS_ACCESS_KEY ? `${process.env.AWS_ACCESS_KEY.substring(0, 10)}...` : "UNDEFINED");
console.log("- AWS_SECRET_KEY:", process.env.AWS_SECRET_KEY ? "SET (length: " + process.env.AWS_SECRET_KEY.length + ")" : "UNDEFINED");

const config = {
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY,
        secretAccessKey: process.env.AWS_SECRET_KEY,
    },
};

export const s3 = new S3Client(config);

