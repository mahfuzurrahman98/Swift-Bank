import "reflect-metadata"; // Required for tsyringe DI
import "dotenv/config"; // Environment variables
import express from "express"; // Required for Vercel to detect Express entrypoint
import { getApp } from "@/app";

/**
 * For Vercel deployment - export the Express app directly
 * Vercel will handle the server creation and port binding
 */
async function createApp() {
    return await getApp();
}

// Export the Express app for Vercel
export default createApp();
