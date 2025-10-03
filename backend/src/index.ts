import "reflect-metadata"; // Required for tsyringe DI
import "dotenv/config"; // Environment variables
import http from "http";
import { getApp } from "@/app";

/**
 * Application bootstrap
 * Initializes reflection metadata for dependency injection and starts the Express server
 */
async function main() {
    const app = await getApp();

    // Start the server only after DB is ready
    const PORT = process.env.PORT || 8001;
    const server = http.createServer(app);

    server.listen(PORT, () => console.log(`Server running on port ${PORT} 🚀`));

    return app;
}

const app = main();

export default app;
