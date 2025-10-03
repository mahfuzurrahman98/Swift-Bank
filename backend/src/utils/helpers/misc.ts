const createBaseUrl = () =>
    process.env.APP_URL || `http://127.0.0.1:${process.env.PORT}`;

const hostingPlatform = process.env.HOSTING_PLATFORM || "";

export const resolveServerDownIssue = async () => {
    try {
        if (hostingPlatform === "render") {
            const baseUrl = createBaseUrl();

            if (!baseUrl) {
                console.warn(
                    "RENDER_EXTERNAL_URL or BASE_URL not set - keep-alive disabled"
                );
                return;
            }

            console.log(`Starting keep-alive service for ${baseUrl}...`);

            // Self ping every 14 minutes to prevent sleeping
            setInterval(async () => {
                try {
                    const response = await fetch(baseUrl);
                    console.log(
                        `Keep-alive ping: ${
                            response.status
                        } at ${new Date().toISOString()}`
                    );
                } catch (pingError) {
                    console.error("Keep-alive ping failed:", pingError);
                }
            }, 14 * 60 * 1000);
        }
    } catch (error: any) {
        console.error("Error setting up keep-alive:", error);
        // Don't throw error here as it would crash the server startup
    }
};
