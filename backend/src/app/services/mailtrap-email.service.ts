import * as ejs from "ejs";
import * as path from "path";
import * as fs from "fs/promises";
import { MailtrapClient } from "mailtrap";
import { CustomError } from "@/utils/custom-error";

export class MailtrapEmailService {
    private client: MailtrapClient;
    private senderEmail: string;
    private senderName: string;

    /**
     * Constructor for MailtrapEmailService.
     */
    constructor() {
        const token = process.env.MAILTRAP_TOKEN;
        this.senderEmail = process.env.MAILTRAP_SENDER_EMAIL || process.env.SMTP_USER || "";
        this.senderName = process.env.APP_NAME || "Swift Bank";

        if (!token) {
            throw new CustomError(
                500,
                "MAILTRAP_TOKEN is required in environment variables"
            );
        }

        if (!this.senderEmail) {
            throw new CustomError(
                500,
                "MAILTRAP_SENDER_EMAIL or SMTP_USER is required in environment variables"
            );
        }

        this.client = new MailtrapClient({ token });
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
                      `[MailtrapEmailService_renderTemplate]: Failed to render email template: ${error.message}`
                  );
        }
    }

    /**
     * Send an email using Mailtrap
     * @param recipients Array of recipient email addresses
     * @param subject Email subject
     * @param html HTML content of the email
     * @param text Optional plain text content
     */
    async sendMail(
        recipients: string[], 
        subject: string, 
        html: string, 
        text?: string
    ) {
        try {
            const sender = { 
                name: this.senderName, 
                email: this.senderEmail 
            };

            const to = recipients.map(email => ({ email }));

            console.log(`[MailtrapEmailService] Sending email to: ${recipients.join(", ")}`);
            console.log(`[MailtrapEmailService] Subject: ${subject}`);

            const response = await this.client.send({
                from: sender,
                to,
                subject,
                html,
                text: text || this.stripHtml(html), // Fallback to stripped HTML if no text provided
            });

            console.log(`[MailtrapEmailService] Email sent successfully:`, response);
            return response;
        } catch (error: any) {
            console.error(`[MailtrapEmailService] Send mail error:`, error);
            throw error instanceof CustomError
                ? error
                : new CustomError(
                      500,
                      `[MailtrapEmailService_sendMail]: ${
                          error.message || "Something went wrong sending email"
                      }`
                  );
        }
    }

    /**
     * Simple HTML tag stripper for fallback text content
     * @param html HTML string
     * @returns Plain text string
     */
    private stripHtml(html: string): string {
        return html.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();
    }

    /**
     * Test the Mailtrap connection
     * @returns Promise<boolean> - true if connection is successful
     */
    async testConnection(): Promise<boolean> {
        try {
            // Send a test email to verify the connection
            await this.sendMail(
                [this.senderEmail], // Send to self for testing
                "Mailtrap Connection Test",
                "<h1>Test Email</h1><p>This is a test email to verify Mailtrap connection.</p>",
                "Test Email - This is a test email to verify Mailtrap connection."
            );
            return true;
        } catch (error: any) {
            console.error('[MailtrapEmailService] Connection test failed:', error.message);
            return false;
        }
    }
}
