import { NextFunction, Request, Response, Router } from 'express';
import usersHandlers from './api/users/users.handlers';
import Auth from './utils/Auth';
import CustomError from './utils/CustomError';

const router = Router();
const authMiddleware = Auth.isAuthenticated;

// home rotue
router.get(
    '/',
    authMiddleware,
    (req: Request, res: Response, next: NextFunction) => {
        try {
            /**
             * The path to the image file.
             */
            const image = '/assets/images/ai.png';
            res.status(200).json({
                success: true,
                message: 'Hello World!',
                data: {
                    image,
                },
            });
        } catch (error: any) {
            next(new CustomError(500, error.message || 'Something went wrong'));
        }
    }
);

// users routes
router.get('/users', usersHandlers.getAll); // get all users

router.post('/users', usersHandlers.create); // create new user
router.post('/users/login', usersHandlers.login); // login user
router.post('/users/google-login', usersHandlers.googleOAuthLogin); // login user with google
router.post('/users/refresh-token', usersHandlers.refreshToken); // refresh token
router.post('/users/logout', usersHandlers.logout); // logout user

export default router;
