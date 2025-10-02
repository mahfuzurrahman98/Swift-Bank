import { NextFunction, Request, Response } from "express";
import { TokenService } from "@/app/services/token.service";
import { RequestUser, TokenPayload } from "@/app/interfaces/auth.interface";
import { UserService } from "@/app/services/user.service";
import { CustomError } from "@/utils/custom-error";
import { UserStatus } from "@/app/enums/user";

/**
 * Middleware to attach user to request
 * @param request
 * @param response
 * @param next
 */
export async function attachUser(
    request: Request,
    response: Response,
    next: NextFunction
): Promise<void> {
    const tokenService = new TokenService();

    let token: string =
        (request.headers.authorization as string) ||
        (request.headers.Authorization as string) ||
        "";

    if (token && token.startsWith("Bearer ")) {
        token = token.split(" ")[1];
    }

    if (!token) {
        request.user = undefined;
        return next();
    }

    try {
        const decodedTokenPayload: TokenPayload =
            tokenService.decodeAccessToken(token);

        if (!decodedTokenPayload.user) {
            throw new CustomError(401, "Unauthorized: Token is invalid");
        }

        const userService = new UserService();
        const user: RequestUser | null = await userService.getUserById(
            decodedTokenPayload.user._id
        );

        if (!user) {
            throw new CustomError(
                401,
                "Unauthorized: User not found [attachUser middleware]"
            );
        }
    } catch (error: any) {
        request.user = undefined;
        next();
    }
}

/**
 * Middleware to require authentication
 * @param request
 * @param response
 * @param next
 */
export async function requireAuth(
    request: Request,
    response: Response,
    next: NextFunction
): Promise<void> {
    const tokenService = new TokenService();

    let token: string =
        (request.headers.authorization as string) ||
        (request.headers.Authorization as string) ||
        "";

    if (token && token.startsWith("Bearer ")) {
        token = token.split(" ")[1];
    }

    if (!token) {
        return next(new CustomError(401, "Unauthorized: Token not found"));
    }

    try {
        const decodedTokenPayload: TokenPayload =
            tokenService.decodeAccessToken(token);

        if (!decodedTokenPayload.user) {
            throw new CustomError(401, "Unauthorized: Token is invalid");
        }

        const userService = new UserService();
        const user: RequestUser | null = await userService.getUserByEmail(
            decodedTokenPayload.user.email
        );

        if (!user) {
            throw new CustomError(
                401,
                "Unauthorized: User not found [requireAuth middleware]"
            );
        }

        request.user = user;
        next();
    } catch (error: any) {
        next(
            error instanceof CustomError
                ? error
                : new CustomError(401, "Unauthorized:" + error.message)
        );
    }
}

/**
 * Middleware to require active user
 * @param request
 * @param response
 * @param next
 */
export async function requireActiveUser(
    request: Request,
    response: Response,
    next: NextFunction
): Promise<void> {
    const user: RequestUser | undefined = request.user;

    if (!user) {
        next(new CustomError(401, "Unauthorized"));
    } else if (user.status !== UserStatus.ACTIVE) {
        next(new CustomError(403, "Your account is deactivated"));
    } else {
        next();
    }
}
