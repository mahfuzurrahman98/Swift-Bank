const appEnv = import.meta.env.VITE_APP_ENV;

export const logger = {
    info: (message: any, ...optionalParams: any[]) => {
        if (appEnv === "development") {
            console.log(message, optionalParams);
        }
    },
    error: (message: any, ...optionalParams: any[]) => {
        if (appEnv === "development") {
            console.error(message, optionalParams);
        }
    },
    warn: (message: any, ...optionalParams: any[]) => {
        if (appEnv === "development") {
            console.warn(message, optionalParams);
        }
    },
};
