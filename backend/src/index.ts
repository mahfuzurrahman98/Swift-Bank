import "reflect-metadata"; // Required for tsyringe DI
import "dotenv/config"; // Environment variables
import { getApp } from "@/app";

/**
 * For Vercel deployment - export the Express app directly
 * Vercel will handle the server creation and port binding
 */
const app = getApp();

// Export the Express app for Vercel
export default app;
