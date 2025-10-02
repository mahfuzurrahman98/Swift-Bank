import mongoose from 'mongoose';
import { CustomError } from '@/utils/custom-error';

// Global connection cache to reuse database connections
let cachedConnection: typeof mongoose | null = null;

/**
 * MongoDB connection configuration with optimized settings
 */
const connectionOptions: mongoose.ConnectOptions = {
    // Connection timeout settings
    serverSelectionTimeoutMS: 30000, // 30 seconds
    socketTimeoutMS: 45000, // 45 seconds

    // Connection pool settings
    maxPoolSize: 10,
    minPoolSize: 5,

    // Replica set options
    retryWrites: true,
    retryReads: true,

    // Additional optimizations
    bufferCommands: false, // Disable mongoose buffering
};

/**
 * Establishes connection to MongoDB with caching for performance.
 * Reuses existing connections in serverless environments.
 *
 * @returns Promise<typeof mongoose> - The mongoose connection instance
 * @throws CustomError when connection fails
 */
export async function connectMongo(): Promise<typeof mongoose> {
    // Return cached connection if available
    if (cachedConnection) {
        console.log('📦 Using cached MongoDB connection');
        return cachedConnection;
    }

    try {
        // Get MongoDB URI from environment variables
        const mongoUri = process.env.MONGODB_URI;

        if (!mongoUri) {
            throw new CustomError(500, 'MONGODB_URI environment variable is not defined');
        }

        console.log('🔌 Connecting to MongoDB...');

        // Establish new connection
        const connection = await mongoose.connect(mongoUri, connectionOptions);

        // Cache the connection for reuse
        cachedConnection = connection;

        // Connection event listeners
        mongoose.connection.on('connected', () => {
            console.log('✅ MongoDB connected successfully');
        });

        mongoose.connection.on('error', (error) => {
            console.error('❌ MongoDB connection error:', error);
            cachedConnection = null; // Clear cache on error
        });

        mongoose.connection.on('disconnected', () => {
            console.log('🔌 MongoDB disconnected');
            cachedConnection = null; // Clear cache on disconnect
        });

        // Graceful shutdown handling
        process.on('SIGINT', async () => {
            try {
                await mongoose.connection.close();
                console.log('🔒 MongoDB connection closed through app termination');
                process.exit(0);
            } catch (error) {
                console.error('Error closing MongoDB connection:', error);
                process.exit(1);
            }
        });

        return connection;

    } catch (error: any) {
        console.error('❌ Failed to connect to MongoDB:', error.message);
        cachedConnection = null; // Clear cache on failure

        throw new CustomError(
            500,
            `Database connection failed: ${error.message}`
        );
    }
}

/**
 * Disconnects from MongoDB and clears the connection cache.
 * Primarily used for testing and graceful shutdowns.
 *
 * @returns Promise<void>
 */
export async function disconnectMongo(): Promise<void> {
    if (cachedConnection) {
        await mongoose.connection.close();
        cachedConnection = null;
        console.log('🔒 MongoDB connection closed and cache cleared');
    }
}