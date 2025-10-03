import express, { Express, NextFunction, Request, Response } from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import http from "http";
import router from "@/app/routes";
import { connectMongo } from "@/app/data-source";
import { CustomError } from "@/utils/custom-error";
import { resolveServerDownIssue } from "@/utils/helpers/misc";

const app: Express = express();

const FRONTEND_URL = process.env.FRONTEND_URL || "http://127.0.0.1:5173";

// use middlewares
app.use(cors({ origin: [FRONTEND_URL], credentials: true }));
app.use(express.json());
app.use(cookieParser());

// add publuc folder as static folder
app.use(express.static("public"));

export async function startServer(): Promise<Express> {
    try {
        await connectMongo();
    } catch (error: any) {
        console.error("Error initializing Data Source ❌:", error);
        process.exit(1); // Stop the app if DB fails
    }

    const APP_DEBUG = Boolean(process.env.APP_DEBUG || "false");
    const FORCE_SHOW_ERROR = process.env.FORCE_SHOW_ERROR === "true";
    const showError = APP_DEBUG || FORCE_SHOW_ERROR;

    // setupContainer();

    // Dynamically import routes after the container is configured

    // index route
    app.get("/", (request: Request, response: Response) => {
        response.json({
            name: process.env.APP_NAME,
            app_env: process.env.APP_ENV,
            version: process.env.APP_VERSION || "1.0.0",
        });
    });

    // use routes
    app.use("/", router);

    // catch 404 and forward to error handler
    app.use((request: Request, response: Response, next: NextFunction) => {
        next(new CustomError(404, `Route not found: [${request.url}]`));
    });

    // add error handler
    app.use(
        (
            error: any,
            request: Request,
            response: Response,
            next: NextFunction
        ) => {
            showError &&
                console.error(
                    "\n---------------------------------------------",
                    `\nError occurred: {${error.message}}`,
                    "\n---------------------------------------------\n"
                );
            if (error instanceof CustomError) {
                if (error.getStatusCode() && error.getStatusCode() != 500) {
                    response.status(error.getStatusCode()).json({
                        message: error.getMessage() || "Something went wrong",
                    });
                    return;
                } else {
                    response.status(500).json({
                        message: showError
                            ? error.getMessage() || "Unknown server error"
                            : "Something went wrong",
                    });
                    return;
                }
            } else {
                response.status(500).json({
                    message: showError
                        ? error.message || "Unknown server error"
                        : "Something went wrong",
                });
                return;
            }
        }
    );

    // resolve server down issue
    await resolveServerDownIssue();

    // Start the server only after DB is ready
    const PORT = process.env.PORT || 8001;
    const server = http.createServer(app);

    server.listen(PORT, () => console.log(`Server running on port ${PORT} 🚀`));

    return app;
}
