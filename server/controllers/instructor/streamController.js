import asyncHandler from 'express-async-handler';
import logger from '../../utils/logger.js';
import { GetObjectCommand, HeadObjectCommand } from '@aws-sdk/client-s3';
import { s3 } from '../../config/s3Client.js';
import { HTTP_STATUS } from '../../utils/httpStatus.js';

export const streamVideo = asyncHandler(async (req, res) => {
  const { videoPath } = req.query;

  logger.info(`[StreamVideo] Request`, {
    videoPath,
    range: req.headers.range,
    instructorId: req.user?.id,
  });

  if (!videoPath) {
    return res.status(HTTP_STATUS.BAD_REQUEST).json({
      success: false,
      message: 'Video path is required',
    });
  }

  const s3Key = videoPath.startsWith('/') ? videoPath.substring(1) : videoPath;

  try {
    const headCommand = new HeadObjectCommand({
      Bucket: process.env.S3_BUCKET,
      Key: s3Key,
    });

    const headResponse = await s3.send(headCommand);
    const videoSize = headResponse.ContentLength;

    let contentType = headResponse.ContentType;
    if (!contentType || contentType === 'application/octet-stream') {
      const ext = s3Key.split('.').pop().toLowerCase();
      const mimeTypes = {
        mp4: 'video/mp4',
        webm: 'video/webm',
        ogg: 'video/ogg',
        mov: 'video/quicktime',
        m4v: 'video/x-m4v',
      };
      contentType = mimeTypes[ext] || 'video/mp4';
    }

    const range = req.headers.range;

    if (!range) {
      const CHUNK_SIZE = 1024 * 1024;
      const end = Math.min(CHUNK_SIZE - 1, videoSize - 1);

      const command = new GetObjectCommand({
        Bucket: process.env.S3_BUCKET,
        Key: s3Key,
        Range: `bytes=0-${end}`,
      });

      const s3Response = await s3.send(command);

      res.setHeader('Content-Range', `bytes 0-${end}/${videoSize}`);
      res.setHeader('Accept-Ranges', 'bytes');
      res.setHeader('Content-Length', end + 1);
      res.setHeader('Content-Type', contentType);
      res.setHeader('Cache-Control', 'public, max-age=31536000');

      res.status(206);
      s3Response.Body.pipe(res);
    } else {
      const parts = range.replace(/bytes=/, '').split('-');
      const start = parseInt(parts[0], 10);
      const end = parts[1] ? parseInt(parts[1], 10) : videoSize - 1;
      const chunkSize = end - start + 1;

      if (start >= videoSize || end >= videoSize) {
        res.setHeader('Content-Range', `bytes */${videoSize}`);
        return res.status(416).json({
          success: false,
          message: 'Requested range not satisfiable',
        });
      }

      const command = new GetObjectCommand({
        Bucket: process.env.S3_BUCKET,
        Key: s3Key,
        Range: `bytes=${start}-${end}`,
      });

      const s3Response = await s3.send(command);

      res.setHeader('Content-Range', `bytes ${start}-${end}/${videoSize}`);
      res.setHeader('Accept-Ranges', 'bytes');
      res.setHeader('Content-Length', chunkSize);
      res.setHeader('Content-Type', contentType);
      res.setHeader('Cache-Control', 'public, max-age=31536000');

      res.status(206);
      s3Response.Body.pipe(res);
    }
  } catch (error) {
    logger.error(`[StreamVideo] Error:`, {
      name: error.name,
      message: error.message,
      code: error.code,
      key: s3Key,
      bucket: process.env.S3_BUCKET,
      region: process.env.AWS_REGION,
    });

    if (error.name === 'NoSuchKey') {
      return res.status(HTTP_STATUS.NOT_FOUND).json({
        success: false,
        message: 'Video not found',
      });
    }

    if (error.name === 'NetworkingError' || error.code === 'ENOTFOUND') {
      return res.status(HTTP_STATUS.SERVICE_UNAVAILABLE).json({
        success: false,
        message:
          'Cannot connect to video storage. Please check S3 configuration.',
      });
    }

    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Failed to stream video',
    });
  }
});

export const streamVideoOptions = asyncHandler(async (req, res) => {
  res.status(204).send();
});
