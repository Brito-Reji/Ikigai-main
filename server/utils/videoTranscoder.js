import ffmpeg from "fluent-ffmpeg";
import fs from "fs";
import path from "path";
import logger from "./logger.js";

// Convert MP4 to HLS format
export const convertVideoToHls = (inputFilePath, outputDir) => {
    return new Promise((resolve, reject) => {
        if (!fs.existsSync(outputDir)) {
            fs.mkdirSync(outputDir, { recursive: true });
        }

        const outputPath = path.join(outputDir, "playlist.m3u8");

        ffmpeg(inputFilePath)
            .outputOptions([
                "-c:v libx264",
                "-c:a aac",
                "-hls_time 10",
                "-hls_playlist_type vod",
                `-hls_segment_filename ${path.join(outputDir, "segment_%03d.ts")}`
            ])
            .output(outputPath)
            .on("end", () => {
                logger.info(`HLS conversion finished: ${outputPath}`);
                resolve({ playlistPath: outputPath, outputDir });
            })
            .on("error", (err) => {
                logger.error(`HLS conversion error: ${err.message}`);
                reject(err);
            })
            .run();
    });
};
