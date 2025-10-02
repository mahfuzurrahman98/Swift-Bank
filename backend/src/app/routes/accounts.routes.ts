import { Router } from "express";
import { container } from "tsyringe";
import { AccountsController } from "@/app/controllers/account.controller";
import { requireAuth } from "@/app/middlewares/auth.middleware";

/**
 * Accounts routes configuration
 */
const router = Router();

// Resolve controller from DI container
const accountsController = container.resolve(AccountsController);

// All routes require authentication
router.use(requireAuth);

/**
 * @route   GET /accounts
 * @desc    Get user account with beneficiaries
 * @access  Private
 */
router.get("/", accountsController.getAccount);

/**
 * @route   POST /accounts/deposit
 * @desc    Deposit money into account
 * @access  Private
 */
router.post("/deposit", accountsController.deposit);

/**
 * @route   POST /accounts/withdraw
 * @desc    Withdraw money from account
 * @access  Private
 */
router.post("/withdraw", accountsController.withdraw);

/**
 * @route   POST /accounts/transfer
 * @desc    Transfer money to another account
 * @access  Private
 */
router.post("/transfer", accountsController.transfer);

/**
 * @route   GET /accounts/beneficiaries
 * @desc    Get all beneficiaries
 * @access  Private
 */
router.get("/beneficiaries", accountsController.getBeneficiaries);

/**
 * @route   POST /accounts/beneficiaries
 * @desc    Add a new beneficiary
 * @access  Private
 */
router.post("/beneficiaries", accountsController.addBeneficiary);

/**
 * @route   DELETE /accounts/beneficiaries/:id
 * @desc    Remove a beneficiary
 * @access  Private
 */
router.delete("/beneficiaries/:id", accountsController.deleteBeneficiary);

/**
 * @route   GET /accounts/transactions
 * @desc    Get all account transactions
 * @access  Private
 */
router.get("/transactions", accountsController.getTransactions);

export default router;
