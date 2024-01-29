import { Router } from 'express';
import accountsHandlers from './api/accoutns/account.handlers';
import usersHandlers from './api/users/user.handlers';
import Auth from './utils/Auth';

const router = Router();
const authMiddleware = Auth.isAuthenticated;

// users routes
router.get('/users', usersHandlers.getAll); // get all users

// users auth routes
router.post('/users', usersHandlers.create); // create new user
router.post('/users/login', usersHandlers.login); // login user
router.post('/users/google-login', usersHandlers.googleOAuthLogin); // login user with google
router.post('/users/refresh-token', usersHandlers.refreshToken); // refresh token
router.post('/users/logout', usersHandlers.logout); // logout user

// accounts routes
router.post('/accounts/deposit', authMiddleware, accountsHandlers.deposit); // deposit
router.post('/accounts/withdraw', authMiddleware, accountsHandlers.withdraw); // withdraw
router.post('/accounts/transfer', authMiddleware, accountsHandlers.transfer); // transfer

// beneficiaries routes
// router.get('/beneficiaries', authMiddleware, accountsHandlers.getBeneficiaries);
router.post(
    '/accounts/beneficiaries',
    authMiddleware,
    accountsHandlers.createBeneficiary
);
router.delete('/accounts/beneficiaries/:id', authMiddleware, accountsHandlers.deleteBeneficiary);

export default router;
