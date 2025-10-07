import * as ejs from "ejs";
import * as path from "path";
import * as fs from "fs/promises";
import { createTransport, Transporter } from "nodemailer";
import { CustomError } from "@/utils/custom-error";

export class EmailService {
    private transporter: Transporter;
    private useResend: boolean;

    /**
     * Constructor for EmailService.
     */
    constructor() {
        this.transporter = createTransport({
            host: process.env.SMTP_HOST,
            port: Number(process.env.SMTP_PORT),
            secure: true,
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS,
            },
        });
    }

    /**
     * Render an EJS template with the provided data
     * @param templateName Name of the template file (without extension)
     * @param data Data to be passed to the template
     * @returns Rendered HTML string
     */
    async renderTemplate(templateName: string, data: any): Promise<string> {
        try {
            const templatePath = path.join(
                __dirname,
                "..",
                "templates",
                `${templateName}.ejs`
            );

            // Read the template file
            const templateContent = await fs.readFile(templatePath, "utf-8");

            // Render the template with the provided data
            return ejs.render(templateContent, data);
        } catch (error: any) {
            throw error instanceof CustomError
                ? error
                : new CustomError(
                      500,
                      `[EmailService_renderTemplate]: Failed to render email template: ${error.message}`
                  );
        }
    }

    /**
     * Send an email using Resend API or SMTP fallback
     * @param recipients Array of recipient email addresses
     * @param subject Email subject
     * @param html HTML content of the email
     */
    async sendMail(recipients: string[], subject: string, html: string) {
        try {
            if (this.useResend) {
                // Use Resend HTTP API for production
                await this.sendWithResend(recipients, subject, html);
            } else {
                // Use SMTP for local development
                if (!this.transporter) {
                    throw new Error("SMTP transporter not initialized");
                }

                console.log("Using SMTP for email sending...");
                await this.transporter.sendMail({
                    from: `${process.env.APP_NAME} <${process.env.SMTP_USER}>`,
                    to: recipients,
                    subject,
                    html,
                });
            }
        } catch (error: any) {
            console.log("error_in_sendMail:", error);
            throw error instanceof CustomError
                ? error
                : new CustomError(
                      500,
                      `[EmailService_sendMail]: ${
                          error.message || "Something went wrong sending email"
                      }`
                  );
        }
    }

    /**
     * Send email using Resend HTTP API
     * @param recipients Array of recipient email addresses
     * @param subject Email subject
     * @param html HTML content of the email
     */
    private async sendWithResend(
        recipients: string[],
        subject: string,
        html: string
    ) {
        const response = await fetch("https://api.resend.com/emails", {
            method: "POST",
            headers: {
                Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                from: `${process.env.APP_NAME} <noreply@swiftbank.dev>`, // Replace with your verified domain
                to: recipients,
                subject,
                html,
            }),
        });

        if (!response.ok) {
            const error = await response.text();
            throw new Error(`Resend API error: ${error}`);
        }

        const result = await response.json();
        console.log("Email sent via Resend:", result.id);
        return result;
    }
}
