import { cloudfrontConfig } from "../config/cloudfront.js";
import fs from "fs";
import crypto from "crypto";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const privateKeyPath = path.resolve(__dirname, "..", cloudfrontConfig.privateKeyPath);
const privateKey = fs.readFileSync(privateKeyPath, "utf8");

export function generateSignedUrl(objectPath, expiresIn = 1800) {
    const url = `https://${cloudfrontConfig.domain}${objectPath}`;
    const expires = Math.floor(Date.now() / 1000) + expiresIn;

    const policy = JSON.stringify({
        Statement: [
            {
                Resource: url,
                Condition: {
                    DateLessThan: { "AWS:EpochTime": expires },
                },
            },
        ],
    });

    const sign = crypto.createSign("RSA-SHA1");
    sign.update(policy);

    const signature = sign.sign({
        key: privateKey,
        padding: crypto.constants.RSA_PKCS1_PADDING
    }, "base64");

    const safe = (v) =>
        v.replace(/\+/g, "-").replace(/=/g, "_").replace(/\//g, "~");

    return (
        `${url}?Policy=${safe(Buffer.from(policy).toString("base64"))}` +
        `&Signature=${safe(signature)}` +
        `&Key-Pair-Id=${cloudfrontConfig.keyPairId}`
    );
}
