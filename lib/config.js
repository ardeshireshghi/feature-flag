import dotEnv from 'dotenv';
dotEnv.config();

export default {
  envName: process.env.APP_ENV_NAME || 'development',
  feature: {
    cacheTTLMins: 24 * 60,
    s3Bucket: process.env.FEATURE_S3_BUCKET
  }
}
