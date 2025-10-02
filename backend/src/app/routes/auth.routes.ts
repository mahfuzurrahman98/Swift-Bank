/**
 * Auth Routes
 * Handles authentication endpoints: signin, refresh-token, signout.
 */
import { Router } from "express";
import { container } from "tsyringe";
import { AuthController } from "@/app/controllers/auth.controller";

const router: Router = Router();
const authController = container.resolve(AuthController);

// Magic link authentication
router.post("/magic-link", authController.requestMagicLink);
router.get("/verify-magic-link/:token", authController.verifyMagicLink);

// Refresh JWT token
router.post("/refresh-token", authController.refreshToken);

// User sign-out
router.post("/signout", authController.signout);

export default router;
