import axios from 'axios';
import { NextFunction, Request, Response } from 'express';
import { IUser } from '../../interfaces/user';
import Auth from '../../utils/Auth';
import CustomError from '../../utils/CustomError';
import Hash from '../../utils/Hash';
import userModel from './users.model';

interface CreateUserRequestBody {
    name: string;
    email: string;
    password: string;
}

interface LoginRequestBody {
    email: string;
    password: string;
}

interface GoogleLoginRequestBody {
    code: string;
}

const usersHandlers = {
    // get all users
    // it will return a response with all users
    getAll: async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<Response | void> => {
        try {
            const users = await userModel.find();
            return res.status(200).json({
                success: true,
                message: 'Users fetched successfully',
                data: users,
            });
        } catch (error: any) {
            return next(
                new CustomError(500, error.message || 'Something went wrong')
            );
        }
    },

    // create new user
    create: async (
        req: Request<{}, {}, CreateUserRequestBody>,
        res: Response,
        next: NextFunction
    ): Promise<Response | void> => {
        try {
            // get data from request body
            const { name, email, password } = req.body;

            // validate data
            // name should be present and its a string and should not be empty
            if (!name || typeof name !== 'string' || name.trim() === '') {
                return next(new CustomError(422, 'Name is required'));
            }
            // email should be present and its a string and should not be empty
            if (!email || typeof email !== 'string' || email.trim() === '') {
                return next(new CustomError(422, 'Email is required'));
            }
            // password should be present and its a string and should not be empty
            if (!password || typeof password !== 'string') {
                return next(new CustomError(422, 'Password is required'));
            }

            // check if user already exists
            const existingUser = await userModel.findOne({ email });
            if (existingUser) {
                next(
                    new CustomError(409, 'The email address is already in use')
                );
            }

            // create new user
            // hash password
            const hashedPassword = await Hash.make(password);
            const user: IUser = await userModel.create({
                name,
                email,
                password: hashedPassword,
                googleAuth: false,
                active: true,
            });

            // remove password from response
            user.password = undefined;

            return res.status(201).json({
                success: true,
                message: 'User created successfully',
                data: { user },
            });
        } catch (error: any) {
            return next(
                new CustomError(500, error.message || 'Something went wrong')
            );
        }
    },

    // login
    login: async (
        req: Request<{}, {}, LoginRequestBody>,
        res: Response,
        next: NextFunction
    ): Promise<Response | void> => {
        console.log('here in login');
        try {
            // get data from request body
            const { email, password } = req.body;

            // validate data
            if (!email || typeof email !== 'string' || email.trim() === '') {
                return next(new CustomError(422, 'Email is required'));
            }
            if (!password || typeof password !== 'string') {
                return next(new CustomError(422, 'Password is required'));
            }

            // check if user exists
            const user = await userModel.findOne({ email });
            if (!user) {
                return next(new CustomError(401, 'Invalid credentials'));
            }

            // check if user has password and googleAuth is false
            if (user.googleAuth) {
                return next(new CustomError(401, 'Invalid credentials'));
            }
            if (!user.password) {
                return next(new CustomError(401, 'Invalid credentials'));
            }

            // check if password is correct
            const isPasswordCorrect = await Hash.check(password, user.password);
            if (!isPasswordCorrect) {
                return next(new CustomError(401, 'Invalid credentials'));
            }

            // create access token, and refresh token
            const accessToken = Auth.createAccessToken({
                email: user.email,
            });
            const refreshToken = Auth.createRefreshToken({
                email: user.email,
            });

            // set referesh token in the response cookie
            res.cookie('refreshToken', refreshToken, {
                httpOnly: true,
                secure: false,
                sameSite: 'strict',
                path: '/',
            });

            return res.status(200).json({
                success: true,
                message: 'User logged in successfully',
                data: {
                    accessToken,
                },
            });
        } catch (error: any) {
            return next(
                new CustomError(500, error.message || 'Something went wrong')
            );
        }
    },

    // login through google oauth
    googleOAuthLogin: async (
        req: Request<{}, {}, GoogleLoginRequestBody>,
        res: Response,
        next: NextFunction
    ): Promise<Response | void> => {
        try {
            const { code } = req.body;

            if (!code || typeof code !== 'string' || code.trim() === '') {
                return next(new CustomError(400, 'Code is required'));
            }

            // get access token, although we won't use it for our authentication
            // but it ensures that the user is registered on google,
            // and we will use it to fetch user information from google
            const data = {
                code,
                client_id: process.env.GOOGLE_CLIENT_ID as string,
                client_secret: process.env.GOOGLE_CLIENT_SECRET as string,
                redirect_uri: process.env.GOOGLE_REDIRECT_URI as string,
                grant_type: 'authorization_code' as string,
            };

            // post request to google to get access token
            const response = await axios.post(
                'https://oauth2.googleapis.com/token',
                new URLSearchParams(data),
                {
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                    },
                }
            );

            if (response.status === 200) {
                // get user information
                const gauthAccessToken = response.data.access_token;

                const userinfoResponse = await axios.get(
                    'https://www.googleapis.com/oauth2/v3/userinfo',
                    { headers: { Authorization: `Bearer ${gauthAccessToken}` } }
                );

                if (userinfoResponse.status === 200) {
                    const userinfo = userinfoResponse.data;
                    // console.log('user info:\n', userinfo);

                    let responseMessage = 'Login successful';
                    let responseStatus = 200;

                    // create or fetch user based on the email
                    try {
                        // initialize user as null
                        let user = null;

                        // check if user already exists
                        const existingUser = await userModel.findOne({
                            email: userinfo.email,
                            googleAuth: true,
                        });

                        if (!existingUser) {
                            // user does not exist, create new user and assign it to user variable
                            user = await userModel.create({
                                name: userinfo.name,
                                username: userinfo.given_name,
                                email: userinfo.email,
                                googleAuth: true,
                                active: true,
                            });

                            responseMessage = 'Welcome, Thanks for signing up!';
                            responseStatus = 201;
                        } else {
                            // user exists, assign it to user variable
                            user = existingUser;
                        }

                        if (!user) {
                            return next(
                                new CustomError(
                                    500,
                                    'Failed to create/fetch user'
                                )
                            );
                        }

                        const accessToken = Auth.createAccessToken({
                            email: user.email,
                        });
                        const refreshToken = Auth.createRefreshToken({
                            email: user.email,
                        });

                        // set referesh token in the response cookie
                        res.cookie('refreshToken', refreshToken, {
                            httpOnly: true,
                            secure: false,
                            sameSite: 'strict',
                            path: '/',
                        });
                        return res.status(responseStatus).json({
                            message: responseMessage,
                            data: {
                                accessToken,
                            },
                        });
                    } catch (error: any) {
                        return next(
                            new CustomError(
                                500,
                                `${error.message} - Error from user creation or retrieval`
                            )
                        );
                    }
                } else {
                    return next(
                        new CustomError(401, 'Failed to fetch user info')
                    );
                }
            } else {
                return next(new CustomError(401, 'Google OAuth login failed'));
            }
        } catch (error: any) {
            return next(
                new CustomError(500, error.message || 'Something went wrong')
            );
        }
    },

    // refresh access token
    refreshToken: async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<Response | void> => {
        res.setHeader('WWW-Authenticate', 'Bearer');
        const token = req.cookies.refreshToken;

        if (!token) {
            return next(new CustomError(401, 'Unauthorized'));
        }

        try {
            const decoded: any = Auth.decodeRefreshToken(token);

            // email should be present in payload
            if (!decoded.user || !decoded.user.email) {
                return next(new CustomError(401, 'Unauthorized'));
            }
            const email = decoded.user.email;

            const user: IUser | null = await userModel.findOne({ email });

            if (!user) {
                return next(new CustomError(401, 'Unauthorized'));
            } else {
                try {
                    const accessToken = Auth.createAccessToken({
                        email: user.email,
                    });
                    user.password = undefined;
                    user.deletedAt = undefined;
                    user.__v = undefined;

                    return res.status(200).json({
                        message: 'Authentication successful',
                        data: { user, accessToken },
                    });
                } catch (error: any) {
                    return next(new CustomError(500, error.message));
                }
            }
        } catch (error: any) {
            return next(new CustomError(error.getStatusCode(), error.message));
        }
    },

    // logout
    logout: async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<Response | void> => {
        try {
            res.clearCookie('refreshToken');
            return res.status(204);
        } catch (error: any) {
            return next(new CustomError(500, error.message));
        }
    },
};

export default usersHandlers;
