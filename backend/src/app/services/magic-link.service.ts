import { Request } from "express";
import { autoInjectable } from "tsyringe";
import * as bcrypt from "bcrypt";
import * as crypto from "crypto";
import { UserModel } from "@/app/models/user.model";
import { AccountModel } from "@/app/models/account.model";
import { MagicLinkTokenModel } from "@/app/models/magic-link-token.model";
import { EmailService } from "@/app/services/email.service";
import { MailtrapEmailService } from "@/app/services/mailtrap-email.service";
import { CustomError } from "@/utils/custom-error";
import { DeviceInfo } from "@/app/interfaces/magic-link.interface";
import { UserRole, UserStatus } from "@/app/enums/user";
import { InvalidateByType, DeviceType } from "@/app/enums/magic-link.enum";
import { User } from "@/app/interfaces/user.interface";

@autoInjectable()
export class MagicLinkService {
    private emailService: MailtrapEmailService;

    constructor() {
        this.emailService = new MailtrapEmailService();
    }

    /**
     * Extract device information from HTTP request
     * @param request - Express request object
     * @returns DeviceInfo object with user agent, IP, and device type
     */
    extractDeviceInfo(request: Request): DeviceInfo {
        const userAgent = request.headers["user-agent"] || "Unknown";
        const ipAddress =
            request.ip || request.socket.remoteAddress || "Unknown";

        // Simple device type detection based on user agent
        let deviceType = DeviceType.DESKTOP;

        const userAgentLower = userAgent.toLowerCase();

        if (
            userAgentLower.includes("mobile") ||
            userAgentLower.includes("android") ||
            userAgentLower.includes("iphone")
        ) {
            deviceType = DeviceType.MOBILE;
        } else if (
            userAgentLower.includes("ipad") ||
            userAgentLower.includes("tablet")
        ) {
            deviceType = DeviceType.TABLET;
        }

        return {
            userAgent,
            ipAddress,
            deviceType,
        };
    }

    /**
     * Check if device info matches between request and verification
     * @param requestDevice - Device info from magic link request
     * @param verifyDevice - Device info from verification request
     * @returns boolean indicating if devices match
     */
    devicesMatch(requestDevice: DeviceInfo, verifyDevice: DeviceInfo): boolean {
        return (
            requestDevice.ipAddress === verifyDevice.ipAddress &&
            requestDevice.deviceType === verifyDevice.deviceType
        );
    }

    /**
     * Get a human-readable device description
     * @param deviceInfo - Device information
     * @returns string description of the device
     */
    getDeviceDescription(deviceInfo: DeviceInfo): string {
        const { deviceType, userAgent } = deviceInfo;

        // Extract browser info
        let browser = "Unknown Browser";
        if (userAgent.includes("Chrome")) browser = "Chrome";
        else if (userAgent.includes("Firefox")) browser = "Firefox";
        else if (userAgent.includes("Safari") && !userAgent.includes("Chrome"))
            browser = "Safari";
        else if (userAgent.includes("Edge")) browser = "Edge";

        // Extract OS info
        let os = "Unknown OS";
        if (userAgent.includes("Windows")) os = "Windows";
        else if (userAgent.includes("Mac")) os = "macOS";
        else if (userAgent.includes("Linux")) os = "Linux";
        else if (userAgent.includes("Android")) os = "Android";
        else if (userAgent.includes("iOS")) os = "iOS";

        return `${deviceType} (${browser} on ${os})`;
    }

    /**
     * Request a magic link for authentication
     * @param email - User's email address
     * @param deviceInfo - Device information from request
     * @returns Success message
     */
    async requestMagicLink(
        email: string,
        deviceInfo: DeviceInfo
    ): Promise<void> {
        try {
            // 1. Check if user exists (but don't create yet)
            const user = await UserModel.findOne({
                email: email.toLowerCase(),
                deletedAt: null,
            }).exec();

            // For magic link, we allow requests for non-existent users
            // User will be created during verification if email is valid

            // 2. Rate limiting check - max 3 requests per 10 minutes (by email for non-existent users)
            const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000);

            let recentRequests = 0;
            if (user) {
                recentRequests = await MagicLinkTokenModel.countDocuments({
                    userId: user._id.toString(),
                    createdAt: { $gte: tenMinutesAgo },
                    deletedAt: null,
                });
            } else {
                // For new users, we'll implement email-based rate limiting later
                // For now, allow the request to proceed
                recentRequests = 0;
            }

            if (recentRequests >= 3) {
                throw new CustomError(
                    429,
                    "Too many requests. Please wait 10 minutes before requesting another magic link"
                );
            }

            // 3. Check minimum time between requests (2 minutes)
            if (user) {
                const twoMinutesAgo = new Date(Date.now() - 2 * 60 * 1000);
                const veryRecentRequest = await MagicLinkTokenModel.findOne({
                    userId: user._id.toString(),
                    createdAt: { $gte: twoMinutesAgo },
                    deletedAt: null,
                });

                if (veryRecentRequest) {
                    throw new CustomError(
                        429,
                        "Please wait 2 minutes before requesting another magic link"
                    );
                }

                // 4. Invalidate all previous active tokens for this user
                await MagicLinkTokenModel.updateMany(
                    {
                        userId: user._id.toString(),
                        used: false,
                        expiresAt: { $gte: new Date() },
                        deletedAt: null,
                    },
                    {
                        used: true,
                        usedAt: new Date(),
                        invalidatedBy: "NEW_REQUEST",
                    }
                );
            }

            // 5. Generate new token
            const rawToken = crypto.randomBytes(32).toString("hex");
            const hashedToken = await bcrypt.hash(rawToken, 12);

            // 6. Create magic link token
            const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
            await MagicLinkTokenModel.create({
                userId: user ? user._id.toString() : email.toLowerCase(), // Use email as temp ID for new users
                token: hashedToken,
                requestDevice: deviceInfo,
                expiresAt,
                used: false,
            });

            // 7. Send email
            const magicLinkUrl = `${process.env.FRONTEND_URL}/auth/verify-magic-link/${rawToken}`;

            // Get display name for email
            const displayName = user?.email;

            const emailHtml = await this.emailService.renderTemplate(
                "email-templates/auth/magic-link",
                {
                    userName: displayName,
                    magicLink: magicLinkUrl,
                    expiryMinutes: 10,
                    appName: process.env.APP_NAME,
                }
            );

            console.log("emailHtml:", emailHtml);

            await this.emailService.sendMail(
                [email.toLowerCase()],
                "💰 Swift Bank - Sign in with magic link",
                emailHtml
            );
        } catch (error: any) {
            throw error instanceof CustomError
                ? error
                : new CustomError(
                      500,
                      `[MagicLinkService_requestMagicLink]: ${error.message}`
                  );
        }
    }

    /**
     * Verify magic link token and authenticate user
     * @param token - Raw token from URL
     * @param deviceInfo - Device information from request
     * @returns JWT token and user information
     */
    async verifyMagicLink(
        token: string,
        deviceInfo: DeviceInfo
    ): Promise<User> {
        try {
            // 1. Find all non-expired, unused tokens
            const magicLinkTokens = await MagicLinkTokenModel.find({
                used: false,
                expiresAt: { $gte: new Date() },
                deletedAt: null,
            });

            if (!magicLinkTokens.length) {
                throw new CustomError(400, "Invalid or expired magic link");
            }

            // 2. Find matching token by comparing hashes
            let validToken = null;
            let userIdOrEmail = null;

            for (const tokenDoc of magicLinkTokens) {
                const isValid = await bcrypt.compare(token, tokenDoc.token);
                if (isValid) {
                    validToken = tokenDoc;
                    userIdOrEmail = tokenDoc.userId; // This could be userId or email
                    break;
                }
            }

            if (!validToken || !userIdOrEmail) {
                throw new CustomError(400, "Invalid or expired magic link");
            }

            // 3. Find or create user
            let user;

            // Check if userIdOrEmail is an email (contains @) or a user ID
            if (userIdOrEmail.includes("@")) {
                // It's an email, search by email only
                user = await UserModel.findOne({ email: userIdOrEmail });
            } else {
                // It's a user ID, search by ID first, then fallback to email
                user = await UserModel.findOne({
                    $or: [{ _id: userIdOrEmail }, { email: userIdOrEmail }],
                });
            }

            if (!user) {
                // Create new user - userIdOrEmail should be email in this case
                if (!userIdOrEmail.includes("@")) {
                    throw new CustomError(
                        400,
                        "Invalid magic link - user not found"
                    );
                }

                const emailName = userIdOrEmail.split("@")[0];
                const displayName =
                    emailName.charAt(0).toUpperCase() + emailName.slice(1);

                user = await UserModel.create({
                    email: userIdOrEmail.toLowerCase(),
                    name: displayName,
                    role: UserRole.ACCOUNT_HOLDER,
                    status: UserStatus.ACTIVE, // Activate immediately upon email verification
                });

                // Create associated account
                await AccountModel.create({
                    userId: user._id.toString(),
                    balance: 0,
                    beneficiaryIds: [],
                    beneficiaries: [],
                });
            }

            // 4. Log device verification for security audit
            const deviceMatch = this.devicesMatch(
                validToken.requestDevice,
                deviceInfo
            );

            if (!deviceMatch) {
                console.warn(
                    `Magic link device mismatch for user ${user._id}:`,
                    {
                        requestDevice: validToken.requestDevice,
                        verifyDevice: deviceInfo,
                        userId: user._id,
                        timestamp: new Date().toISOString(),
                    }
                );
            }

            // 5. Activate user if they were pending (for existing users)
            if (user.status === UserStatus.PENDING) {
                user.status = UserStatus.ACTIVE;
                await user.save();
            }

            // 6. Mark token as used
            validToken.used = true;
            validToken.usedAt = new Date();
            await validToken.save();

            // 7. Invalidate all other tokens for this user
            await MagicLinkTokenModel.updateMany(
                {
                    $or: [
                        { userId: user._id.toString() },
                        { userId: user.email }, // Also invalidate tokens created with email as userId
                    ],
                    used: false,
                    _id: { $ne: validToken._id },
                },
                {
                    used: true,
                    usedAt: new Date(),
                    invalidatedBy: InvalidateByType.MANUAL,
                }
            );

            return user;
        } catch (error: any) {
            throw error instanceof CustomError
                ? error
                : new CustomError(
                      500,
                      `[MagicLinkService_verifyMagicLink]: ${error.message}`
                  );
        }
    }

    /**
     * Clean up expired tokens (can be called by a cron job)
     */
    async cleanupExpiredTokens(): Promise<void> {
        try {
            await MagicLinkTokenModel.updateMany(
                {
                    expiresAt: { $lt: new Date() },
                    used: false,
                },
                {
                    used: true,
                    usedAt: new Date(),
                    invalidatedBy: InvalidateByType.EXPIRED,
                }
            );
        } catch (error: any) {
            throw new CustomError(
                500,
                `[MagicLinkService_cleanupExpiredTokens]: ${error.message}`
            );
        }
    }
}
