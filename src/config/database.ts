import mongoose from 'mongoose';
import { logger } from '../utils/logger';
import config from '@/app/config';


export const connectDB = async () => {
  try {
    if (!config.db) {
      throw new Error('DATABASE_URL is not defined in environment variables');
    }
    
    const conn = await mongoose.connect(config?.db as string);
    logger.info(`MongoDB Connected: ${conn.connection.host}`);

  } catch (error) {
    logger.error('Error connecting to MongoDB:', error);
    process.exit(1);
  }
}; 