import { getSignedUrl as cfSignedUrl } from "@aws-sdk/cloudfront-signer";
import { cloudfrontConfig } from "../config/cloudfront.js";
import fs from "fs";
import path from "path";
import { AppError } from "../errors/AppError.js";
import { HTTP_STATUS } from "./httpStatus.js";


let privateKey = null;

if (cloudfrontConfig.privateKeyPath) {
  try {
    const cleanPath = cloudfrontConfig.privateKeyPath?.trim();

    console.log("CONFIG PATH:", cleanPath);

    const privateKeyPath = path.resolve(process.cwd(), cleanPath);

    console.log("RESOLVED PATH:", privateKeyPath);

    privateKey = fs.readFileSync(privateKeyPath, "utf8");

    console.log("PRIVATE KEY LOADED SUCCESS");
  } catch (err) {
    console.error("PRIVATE KEY ERROR:", err);
  }
   
}

// Signed URL for a single resource (MP4 etc)
export function generateSignedUrl(objectPath, expiresIn = 1800) {
    if (!privateKey || !cloudfrontConfig.domain || !cloudfrontConfig.keyPairId) {
        throw new AppError("CloudFront is not configured.", HTTP_STATUS.BAD_REQUEST);
    }

    const url = `https://${cloudfrontConfig.domain}${objectPath}`;
    const dateLessThan = new Date(Date.now() + expiresIn * 1000).toISOString();

    return cfSignedUrl({
        url,
        keyPairId: cloudfrontConfig.keyPairId,
        privateKey,
        dateLessThan,
    });
}

// Signed URL params for an HLS directory (wildcard policy)
export function generateHlsSignedParams(basePath, m3u8Key, expiresIn = 3600) {
    if (!privateKey || !cloudfrontConfig.domain || !cloudfrontConfig.keyPairId) {
        throw new AppError("CloudFront is not configured.", HTTP_STATUS.BAD_REQUEST);
    }

    const wildcardUrl = `https://${cloudfrontConfig.domain}/${basePath}/*`;
    const expires = Math.floor(Date.now() / 1000) + expiresIn;

    // Custom policy allows wildcard — same signature works for .m3u8 AND all .ts chunks
    const policy = JSON.stringify({
        Statement: [{
            Resource: wildcardUrl,
            Condition: {
                DateLessThan: { "AWS:EpochTime": expires },
            },
        }],
    });

    // Generate signed URL for the .m3u8 file using the wildcard policy
    const signedUrl = cfSignedUrl({
        url: `https://${cloudfrontConfig.domain}/${m3u8Key}`,
        keyPairId: cloudfrontConfig.keyPairId,
        privateKey,
        policy,
    });

    // Extract the signing query params
    const parsed = new URL(signedUrl);

    return {
        url: signedUrl,
        signingParams: {
            Policy: parsed.searchParams.get("Policy"),
            Signature: parsed.searchParams.get("Signature"),
            "Key-Pair-Id": parsed.searchParams.get("Key-Pair-Id"),
        },
    };
}

