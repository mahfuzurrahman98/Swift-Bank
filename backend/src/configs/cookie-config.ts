import { CookieOptions } from 'express';

const APP_ENV = process.env.APP_ENV || 'development';
const isProd = APP_ENV === 'production';

export const cookieConfig: CookieOptions = {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? 'strict' : 'lax',
    path: '/',
    maxAge: parseInt(process.env.REFRESH_TOKEN_EXPIRY || '7') * 24 * 60 * 60 * 1000, // 7 days
    signed: false, // or true if using cookie-parser and a secret
};
