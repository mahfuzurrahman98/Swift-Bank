import { NextFunction, Request, Response } from "express";
import {
    requestMagicLinkSchema,
    verifyMagicLinkSchema,
} from "@/app/schemas/magic-link.schema";
import { TokenService } from "@/app/services/token.service";
import { MagicLinkService } from "@/app/services/magic-link.service";
import { RequestUser } from "@/app/interfaces/auth.interface";
import { CustomError } from "@/utils/custom-error";
import { cookieConfig } from "@/configs/cookie-config";
import { AuthService } from "@/app/services/auth.service";
import { autoInjectable } from "tsyringe";
import { formatError } from "@/utils/helpers/error-formatter";
import { SigninResponseDTO } from "@/app/dtos/auth.dto";
import {
    RequestMagicLinkDto,
    VerifyMagicLinkDto,
} from "@/app/dtos/magic-link.dto";
import { toRequestUser } from "@/app/serializers/user.serializer";

@autoInjectable()
export class AuthController {
    private authService: AuthService;
    private tokenService: TokenService;
    private magicLinkService: MagicLinkService;

    /**
     * Constructs the AuthController with required dependencies.
     *
     * @param authService - Service handling authentication logic
     * @param tokenService - Service handling JWT token creation/validation
     * @param magicLinkService - Service handling magic link authentication
     * @param deviceService - Service handling device information extraction
     */
    constructor(
        authService: AuthService,
        tokenService: TokenService,
        magicLinkService: MagicLinkService
    ) {
        this.authService = authService;
        this.tokenService = tokenService;
        this.magicLinkService = magicLinkService;
    }

    /**
     * Requests a magic link for authentication
     * Validates email, generates magic link token, and sends email
     *
     * @param request - Express request with RequestMagicLinkDto body
     * @param response - Express response returning MagicLinkResponseDto
     * @param next - Express next middleware function
     * @returns 200 with success message, calls next with error on failure
     */
    requestMagicLink = async (
        request: Request<{}, {}, RequestMagicLinkDto>,
        response: Response<{ message: string }>,
        next: NextFunction
    ) => {
        try {
            const { email } = requestMagicLinkSchema.parse(request.body);
            const deviceInfo = this.magicLinkService.extractDeviceInfo(request);

            console.log("email:", email);
            console.log("deviceInfo:", deviceInfo);

            await this.magicLinkService.requestMagicLink(email, deviceInfo);

            response.status(200).json({
                message:
                    "Magic link sent to your email. Please check your inbox.",
            });
        } catch (error: any) {
            next(formatError(error));
        }
    };

    /**
     * Verifies magic link token and authenticates user
     * Validates token, creates JWT tokens, sets refresh token cookie
     *
     * @param request - Express request with token parameter
     * @param response - Express response returning MagicLinkVerifyResponseDto
     * @param next - Express next middleware function
     * @returns 200 with tokens and user info, calls next with error on failure
     */
    verifyMagicLink = async (
        request: Request<VerifyMagicLinkDto>,
        response: Response<SigninResponseDTO>,
        next: NextFunction
    ) => {
        try {
            const { token } = verifyMagicLinkSchema.parse(request.params);
            const deviceInfo = this.magicLinkService.extractDeviceInfo(request);

            const user = await this.magicLinkService.verifyMagicLink(
                token,
                deviceInfo
            );

            const reqUser: RequestUser = toRequestUser(user);

            // Create tokens
            const accessToken = this.tokenService.createAccessToken(reqUser);
            const refreshToken = this.tokenService.createRefreshToken(reqUser);

            // Set refresh token cookie
            response.cookie("refreshToken", refreshToken, cookieConfig);

            response.status(200).json({
                message: "Magic link verification successful",
                data: {
                    accessToken,
                    user: reqUser,
                },
            });
        } catch (error: any) {
            next(formatError(error));
        }
    };

    /**
     * Issues a new access token using a valid refresh token from cookies.
     * Throws error if no refresh token is provided. Returns new access token and user info in response.
     *
     * @param request - Express request with cookies
     * @param response - Express response returning SigninResponseDTO
     * @param next - Express next middleware function
     * @returns 200 with new token and user on success, calls next with error on failure
     */
    refreshToken = async (
        request: Request,
        response: Response<SigninResponseDTO>,
        next: NextFunction
    ) => {
        try {
            const refreshToken = request.cookies.refreshToken;

            if (!refreshToken) {
                throw new CustomError(400, "No refresh token provided");
            }

            const reqUser: RequestUser = await this.authService!.refreshToken(
                refreshToken
            );

            const accessToken = this.tokenService.createAccessToken(reqUser);

            response.status(200).json({
                message: "Refresh token successful",
                data: {
                    accessToken,
                    user: reqUser,
                },
            });
        } catch (error: any) {
            next(formatError(error));
        }
    };

    /**
     * Signs out the user by clearing the refresh token cookie.
     * Returns a success message on completion.
     *
     * @param request - Express request
     * @param response - Express response
     * @param next - Express next middleware function
     * @returns 200 with logout confirmation, calls next with error on failure
     */
    signout = async (
        request: Request,
        response: Response,
        next: NextFunction
    ) => {
        try {
            response.clearCookie("refreshToken", {
                httpOnly: true,
                sameSite: "strict",
                secure: false,
                path: "/",
            });

            response.status(200).json({ message: "Logged out successfully" });
        } catch (error: any) {
            next(formatError(error));
        }
    };
}
