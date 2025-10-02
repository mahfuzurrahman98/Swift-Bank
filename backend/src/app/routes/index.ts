import { Router } from 'express';
import authRoutes from './auth.routes';
import accountsRoutes from './accounts.routes';

const router = Router();

// Authentication routes
router.use('/auth', authRoutes);

// Accounts routes
router.use('/accounts', accountsRoutes);

// API status route
router.get('/status', (req, res) => {
    res.json({
        success: true,
        message: 'Swift Bank API routes are ready',
        data: {
            timestamp: new Date().toISOString(),
            availableRoutes: {
                auth: '/api/v1/auth',
                accounts: '/api/v1/accounts',
                status: '/api/v1/status',
            },
        },
    });
});

export default router;