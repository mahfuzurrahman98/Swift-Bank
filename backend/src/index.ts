import "reflect-metadata"; // Required for tsyringe DI
import "dotenv/config"; // Environment variables
import { startServer } from "@/app";

/**
 * Application bootstrap
 * Initializes reflection metadata for dependency injection and starts the Express server
 */
startServer();
