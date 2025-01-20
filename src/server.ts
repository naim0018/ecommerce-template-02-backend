import mongoose from 'mongoose'
import app from './app'
import config from './app/config'
import {Server} from 'http'
import {logger} from './utils/logger'
import { connectDB } from './config/database'

let server:Server

async function main (){
try {
   if (!config.db) {
      throw new Error('Database URL is not defined in environment variables');
   }
   console.log(config.port)
   await connectDB()
   logger.info(`MongoDB Connected: Database connection successful`);

   server = app.listen(config.port,()=>{
      logger.info(`Server running on port ${config.port}`);
      console.log(`Server is running on http://localhost:${config.port}`);
   })
    
} catch (error) {
    logger.error('Failed to connect to database:', error);
    process.exit(1);
}
}

main()

// Handle unhandled promise rejections
process.on('unhandledRejection',(err)=>{
    logger.error('Unhandled Rejection:', err);
    if(server){
        server.close(()=>{
            logger.info('Server closed due to unhandled rejection');
            process.exit(1)
        })
    } else {
        process.exit(1);
    }
})

// Handle uncaught exceptions
process.on('uncaughtException',(err)=>{
    logger.error('Uncaught Exception:', err);
    if(server) {
        server.close(()=>{
            logger.info('Server closed due to uncaught exception');
            process.exit(1)
        })
    } else {
        process.exit(1)
    }
})

// Handle SIGTERM signal
process.on('SIGTERM', () => {
    logger.info('SIGTERM received. Shutting down gracefully');
    if(server) {
        server.close(() => {
            logger.info('Server closed');
            process.exit(0);
        });
    } else {
        process.exit(0);
    }
});