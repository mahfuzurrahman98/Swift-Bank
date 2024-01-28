import { NextFunction, Response } from 'express';
import { sign, verify } from 'jsonwebtoken';
import { IRequestWithUser } from '../interfaces/user';
import CustomError from './CustomError';

class Auth {
    public static createAccessToken(user: object): string {
        let expiresIn: string;
        try {
            expiresIn =
                (process.env.ACCESS_TOKEN_EXPIRE_MINUTES as string) + 'm';
        } catch (error: any) {
            throw new CustomError(500, error.message || 'Something went wrong');
        }

        try {
            const token = sign(
                { user },
                process.env.ACCESS_TOKEN_SECRET as string,
                {
                    expiresIn,
                    algorithm: 'HS256',
                }
            );
            return token;
        } catch (error: any) {
            throw new CustomError(401, 'Unauthorized');
        }
    }

    public static createRefreshToken(user: object): string {
        let expiresIn: string;
        try {
            expiresIn =
                (process.env.ACCESS_TOKEN_EXPIRE_MINUTES as string) + 'm';
        } catch (error: any) {
            throw new CustomError(500, error.message || 'Something went wrong');
        }

        try {
            expiresIn =
                (process.env.REFRESH_TOKEN_EXPIRE_MINUTES as string) + 'm';
            const token = sign(
                { user },
                process.env.REFRESH_TOKEN_SECRET as string,
                {
                    expiresIn,
                    algorithm: 'HS256',
                }
            );
            return token;
        } catch (error: any) {
            throw new CustomError(401, 'Unauthorized');
        }
    }

    public static decodeAccessToken(token: string): object {
        try {
            return verify(
                token,
                process.env.ACCESS_TOKEN_SECRET as string
            ) as object;
        } catch (error: any) {
            throw new CustomError(401, 'Unauthorized from Auth');
        }
    }

    public static decodeRefreshToken(token: string): object {
        try {
            return verify(
                token,
                process.env.REFRESH_TOKEN_SECRET as string
            ) as object;
        } catch (error: any) {
            throw new CustomError(401, 'Unauthorized');
        }
    }

    public static async isAuthenticated(
        req: IRequestWithUser,
        res: Response,
        next: NextFunction
    ): Promise<Response | void> {
        console.log(process.env.ACCESS_TOKEN_EXPIRE_MINUTES);
        let token: string =
            (req.headers.authorization as string) ||
            (req.headers.Authorization as string) ||
            '';

        if (token && token.startsWith('Bearer ')) {
            token = token.split(' ')[1];
        }
        console.log('token: ', token);

        if (!token) {
            return next(new CustomError(401, 'Unauthorized'));
        }

        try {
            const decoded: any = Auth.decodeAccessToken(token);

            // decoded have user and user have email, if not then return error
            if (!decoded.user || !decoded.user.email) {
                return next(new CustomError(401, 'Unauthorized'));
            }

            // add user to request
            req.user = decoded.user;
            next();
        } catch (error: any) {
            return next(new CustomError(401, 'Unauthorized'));
        }
    }
}

export default Auth;
