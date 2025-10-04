import express, { Express, NextFunction, Request, Response } from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import path from "path";
import ejs from "ejs";
import http from "http";
import helmet from "helmet";
import router from "@/app/routes";
import { connectMongo } from "@/app/data-source";
import { CustomError } from "@/utils/custom-error";
import { resolveServerDownIssue } from "@/utils/helpers/misc";

const app: Express = express();

const FRONTEND_URL = process.env.FRONTEND_URL || "http://127.0.0.1:5173";
const APP_ENV = process.env.APP_ENV || "development";

// Security headers
app.use(
    helmet({
        contentSecurityPolicy: {
            directives: {
                defaultSrc: ["'self'"],
                styleSrc: ["'self'", "'unsafe-inline'"],
                scriptSrc: ["'self'"],
                imgSrc: ["'self'", "data:", "https:"],
            },
        },
        hsts:
            APP_ENV === "production"
                ? {
                      maxAge: 31536000,
                      includeSubDomains: true,
                      preload: true,
                  }
                : false,
    })
);

// use middlewares
const allowedOrigins = [FRONTEND_URL];
app.use(
    cors({
        origin: allowedOrigins,
        credentials: true,
        methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
        allowedHeaders: ["Content-Type", "Authorization"],
    })
);
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(cookieParser());

// add public folder as static folder
app.use(express.static("public"));

// serve uploaded files
app.use("/uploads", express.static("uploads"));

// set ejs as the view engine
app.engine("html", ejs.renderFile);
app.engine("ejs", ejs.renderFile);
app.set("view engine", "ejs");

// set view paths
const viewsPath = path.join(__dirname, "../app/templates");
app.set("views", viewsPath);

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

    // index route
    app.get("/", (request: Request, response: Response) => {
        response.json({
            name: process.env.APP_NAME,
            app_env: process.env.APP_ENV,
            version: process.env.APP_VERSION || "1.0.0",
        });
    });

    // Apply auth rate limiter to auth routes
    // app.use('/auth/signin', authLimiter);
    // app.use('/auth/refresh-token', authLimiter);

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

            if (showError) {
                console.error(error);
            }

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
