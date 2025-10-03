import * as path from "path";
import { config } from "dotenv";

import mongoose from "mongoose";
import { AccountModel } from "@/app/models/account.model";
import { SelfTransactionModel } from "@/app/models/self-transaction.model";
import { FundTransferModel } from "@/app/models/fund-transfer.model";
import { UserModel } from "@/app/models/user.model";

// Load environment variables from the .env file in the project root
const envPath = path.resolve(__dirname, "../../.env");
console.log("Loading .env from:", envPath);
config({ path: envPath });

// ==================== CONFIGURATION ====================
const TARGET_USER_ID = process.env.TARGET_USER_ID || null; // Optional: Focus on specific user
const MIN_TRANSACTIONS_PER_ACCOUNT = 5;
const MAX_TRANSACTIONS_PER_ACCOUNT = 10;
const MIN_AMOUNT = 3;
const MAX_AMOUNT = 5000;
const MONTHS_BACK = 6; // Generate transactions from last 6 months

// Beneficiary transfer settings
const MIN_TRANSFERS_PER_ACCOUNT = 7;
const MAX_TRANSFERS_PER_ACCOUNT = 18;
const MIN_TRANSFER_AMOUNT = 15;
const MAX_TRANSFER_AMOUNT = 2000;

// ==================== HELPER FUNCTIONS ====================

/**
 * Generate random number between min and max
 */
function randomBetween(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Generate random amount for transaction
 */
function randomAmount(): number {
    return randomBetween(MIN_AMOUNT, MAX_AMOUNT);
}

/**
 * Generate random transaction type
 */
function randomType(): "deposit" | "withdraw" {
    return Math.random() > 0.5 ? "deposit" : "withdraw";
}

/**
 * Generate random date within last N months
 */
function randomDate(monthsBack: number): Date {
    const now = new Date();
    const startDate = new Date();
    startDate.setMonth(now.getMonth() - monthsBack);

    const randomTime =
        startDate.getTime() +
        Math.random() * (now.getTime() - startDate.getTime());

    return new Date(randomTime);
}

// ==================== PHASE 1: CLEANUP ORPHANED ACCOUNTS ====================

/**
 * Remove orphaned accounts (accounts without users)
 */
async function cleanupOrphanedAccounts(): Promise<void> {
    console.log("\n🧹 Phase 1a: Cleaning up orphaned accounts...\n");

    try {
        const accounts = await AccountModel.find({ deletedAt: null });
        console.log(`Found ${accounts.length} active accounts to check`);

        const accountsToDelete: string[] = [];

        // Check each account for valid user
        for (const account of accounts) {
            const user = await UserModel.findOne({
                _id: account.userId,
                deletedAt: null,
            });

            if (!user) {
                console.log(
                    `  ❌ Found orphaned account ${account._id} (User ${account.userId} not found)`
                );
                accountsToDelete.push(account._id.toString());
            }
        }

        // Delete orphaned accounts
        if (accountsToDelete.length > 0) {
            console.log(
                `\n🗑️  Deleting ${accountsToDelete.length} orphaned accounts...`
            );
            await AccountModel.deleteMany({
                _id: { $in: accountsToDelete },
            });
            console.log(
                `  ✅ Deleted ${accountsToDelete.length} orphaned accounts\n`
            );
        } else {
            console.log(`  ✅ No orphaned accounts found\n`);
        }

        return;
    } catch (error) {
        console.error("❌ Error during orphaned accounts cleanup:", error);
        throw error;
    }
}

// ==================== PHASE 1: CLEANUP BENEFICIARY IDS ====================

/**
 * Remove invalid beneficiary IDs from all accounts
 */
async function cleanupBeneficiaryIds(): Promise<void> {
    console.log("\n🧹 Phase 1b: Cleaning up beneficiary IDs...\n");

    try {
        const accounts = await AccountModel.find({ deletedAt: null });
        console.log(`Found ${accounts.length} active accounts to check`);

        let beneficiaryRefsRemoved = 0;
        let accountsUpdated = 0;

        for (const account of accounts) {
            if (
                !account.beneficiaryIds ||
                account.beneficiaryIds.length === 0
            ) {
                continue;
            }

            const originalCount = account.beneficiaryIds.length;
            const validBeneficiaryIds = [];

            // Check each beneficiary ID
            for (const beneficiaryId of account.beneficiaryIds) {
                const beneficiaryExists = await AccountModel.findOne({
                    _id: beneficiaryId,
                    deletedAt: null,
                });

                if (beneficiaryExists) {
                    validBeneficiaryIds.push(beneficiaryId);
                } else {
                    console.log(
                        `  ❌ Removing invalid beneficiary ID: ${beneficiaryId} from account ${account._id}`
                    );
                    beneficiaryRefsRemoved++;
                }
            }

            // Update account if there were invalid IDs
            if (validBeneficiaryIds.length < originalCount) {
                account.beneficiaryIds = validBeneficiaryIds as any;
                await account.save();
                accountsUpdated++;
                console.log(
                    `  ✅ Updated account ${account._id}: ${originalCount} → ${validBeneficiaryIds.length} beneficiaries`
                );
            }
        }

        if (beneficiaryRefsRemoved > 0) {
            console.log(
                `\n✅ Cleanup complete! Removed ${beneficiaryRefsRemoved} invalid references from ${accountsUpdated} accounts\n`
            );
        } else {
            console.log(`  ✅ No invalid beneficiary IDs found\n`);
        }
    } catch (error) {
        console.error("❌ Error during beneficiary cleanup:", error);
        throw error;
    }
}

// ==================== PHASE 2: SEED TRANSACTIONS ====================

/**
 * Generate random transactions for accounts
 */
async function seedTransactions(targetUserId?: string | null): Promise<void> {
    console.log("\n💸 Phase 2: Generating random transactions...\n");

    try {
        let accounts;

        if (targetUserId) {
            // Focus on specific user's account
            console.log(`🎯 Targeting specific user: ${targetUserId}`);
            const account = await AccountModel.findOne({
                userId: targetUserId,
                deletedAt: null,
                active: true,
            });

            if (!account) {
                throw new Error(`Account not found for user: ${targetUserId}`);
            }

            accounts = [account];
        } else {
            // Get all active accounts
            accounts = await AccountModel.find({
                deletedAt: null,
                active: true,
            });
            console.log(`🌐 Processing all ${accounts.length} active accounts`);
        }

        let totalTransactions = 0;
        let totalDeposits = 0;
        let totalWithdrawals = 0;
        let skippedWithdrawals = 0;

        for (const account of accounts) {
            const numTransactions = randomBetween(
                MIN_TRANSACTIONS_PER_ACCOUNT,
                MAX_TRANSACTIONS_PER_ACCOUNT
            );

            console.log(
                `\n📊 Account ${account._id} (User: ${account.userId})`
            );
            console.log(`  Generating ${numTransactions} transactions...`);

            let currentBalance = account.balance || 0;
            const transactions = [];

            for (let i = 0; i < numTransactions; i++) {
                const type = randomType();
                const amount = randomAmount();
                const createdAt = randomDate(MONTHS_BACK);

                // Calculate new balance
                let newBalance = currentBalance;
                if (type === "deposit") {
                    newBalance += amount;
                } else {
                    // withdraw
                    if (currentBalance < amount) {
                        // Skip withdrawal if insufficient balance
                        skippedWithdrawals++;
                        continue;
                    }
                    newBalance -= amount;
                }

                // Create transaction
                transactions.push({
                    accountId: account._id.toString(),
                    amount,
                    type,
                    balance: newBalance,
                    createdAt,
                    updatedAt: createdAt,
                });

                currentBalance = newBalance;

                if (type === "deposit") {
                    totalDeposits++;
                } else {
                    totalWithdrawals++;
                }
                totalTransactions++;
            }

            // Sort transactions by date (oldest first)
            transactions.sort(
                (a, b) => a.createdAt.getTime() - b.createdAt.getTime()
            );

            // Recalculate balances in chronological order
            let runningBalance = 0;
            for (const txn of transactions) {
                if (txn.type === "deposit") {
                    runningBalance += txn.amount;
                } else {
                    runningBalance -= txn.amount;
                }
                txn.balance = runningBalance;
            }

            // Insert transactions in bulk
            if (transactions.length > 0) {
                await SelfTransactionModel.insertMany(transactions);
            }

            // Update account balance to final balance
            const finalBalance =
                transactions.length > 0
                    ? transactions[transactions.length - 1].balance
                    : 0;

            account.balance = finalBalance;
            await account.save();

            console.log(
                `  ✅ Created ${
                    transactions.length
                } transactions | Final Balance: $${finalBalance.toFixed(2)}`
            );
        }

        console.log("\n" + "=".repeat(60));
        console.log("📈 TRANSACTION SUMMARY");
        console.log("=".repeat(60));
        console.log(`Total Transactions Created: ${totalTransactions}`);
        console.log(`  💰 Deposits: ${totalDeposits}`);
        console.log(`  💸 Withdrawals: ${totalWithdrawals}`);
        console.log(
            `  ⚠️  Skipped Withdrawals (insufficient funds): ${skippedWithdrawals}`
        );
        console.log(`Accounts Processed: ${accounts.length}`);
        console.log("=".repeat(60) + "\n");
    } catch (error) {
        console.error("❌ Error during transaction seeding:", error);
        throw error;
    }
}

// ==================== PHASE 3: SEED BENEFICIARY TRANSFERS ====================

/**
 * Generate random fund transfers between accounts and their beneficiaries
 */
async function seedBeneficiaryTransfers(
    targetUserId?: string | null
): Promise<void> {
    console.log("\n💸 Phase 3: Generating beneficiary fund transfers...\n");

    try {
        let accounts;

        if (targetUserId) {
            // Focus on specific user's account
            console.log(`🎯 Targeting specific user: ${targetUserId}`);
            const account = await AccountModel.findOne({
                userId: targetUserId,
                deletedAt: null,
                active: true,
            });

            if (!account) {
                throw new Error(`Account not found for user: ${targetUserId}`);
            }

            accounts = [account];
        } else {
            // Get all active accounts that have beneficiaries
            accounts = await AccountModel.find({
                deletedAt: null,
                active: true,
                beneficiaryIds: { $exists: true, $ne: [] },
            });
            console.log(
                `🌐 Processing ${accounts.length} accounts with beneficiaries`
            );
        }

        let totalTransfers = 0;
        let skippedTransfers = 0;
        let accountsProcessed = 0;

        for (const account of accounts) {
            // Skip if no beneficiaries
            if (
                !account.beneficiaryIds ||
                account.beneficiaryIds.length === 0
            ) {
                continue;
            }

            const numTransfers = randomBetween(
                MIN_TRANSFERS_PER_ACCOUNT,
                Math.min(
                    MAX_TRANSFERS_PER_ACCOUNT,
                    account.beneficiaryIds.length * 2
                )
            );

            console.log(
                `\n📤 Account ${
                    account._id
                } (Balance: $${account.balance.toFixed(2)})`
            );
            console.log(`  Has ${account.beneficiaryIds.length} beneficiaries`);
            console.log(`  Generating ${numTransfers} transfers...`);

            let currentBalance = account.balance || 0;
            let transfersCreated = 0;

            for (let i = 0; i < numTransfers; i++) {
                // Pick random beneficiary
                const randomBeneficiaryId =
                    account.beneficiaryIds[
                        randomBetween(0, account.beneficiaryIds.length - 1)
                    ];

                // Get beneficiary account
                const beneficiaryAccount = await AccountModel.findOne({
                    _id: randomBeneficiaryId,
                    deletedAt: null,
                    active: true,
                });

                if (!beneficiaryAccount) {
                    console.log(
                        `  ⚠️  Beneficiary ${randomBeneficiaryId} not found, skipping...`
                    );
                    skippedTransfers++;
                    continue;
                }

                // Random transfer amount
                const amount = randomBetween(
                    MIN_TRANSFER_AMOUNT,
                    MAX_TRANSFER_AMOUNT
                );

                // Check if sender has sufficient balance
                if (currentBalance < amount) {
                    console.log(
                        `  ⚠️  Insufficient balance ($${currentBalance.toFixed(
                            2
                        )}) for transfer of $${amount.toFixed(2)}, skipping...`
                    );
                    skippedTransfers++;
                    continue;
                }

                // Random date within last N months
                const createdAt = randomDate(MONTHS_BACK);

                // Calculate new balances
                const newFromBalance = currentBalance - amount;
                const newToBalance = (beneficiaryAccount.balance || 0) + amount;

                // Create fund transfer record
                await FundTransferModel.create({
                    fromAccountId: account._id.toString(),
                    toAccountId: beneficiaryAccount._id.toString(),
                    amount,
                    fromAccountBalance: newFromBalance,
                    toAccountBalance: newToBalance,
                    createdAt,
                    updatedAt: createdAt,
                });

                // Update sender balance
                currentBalance = newFromBalance;

                // Update beneficiary balance in database
                beneficiaryAccount.balance = newToBalance;
                await beneficiaryAccount.save();

                transfersCreated++;
                totalTransfers++;

                console.log(
                    `  ✅ Transferred $${amount.toFixed(2)} to ${
                        beneficiaryAccount._id
                    }`
                );
            }

            // Update sender account balance
            account.balance = currentBalance;
            await account.save();

            console.log(
                `  💰 Final Balance: $${currentBalance.toFixed(
                    2
                )} (${transfersCreated} transfers made)`
            );
            accountsProcessed++;
        }

        console.log("\n" + "=".repeat(60));
        console.log("💸 FUND TRANSFER SUMMARY");
        console.log("=".repeat(60));
        console.log(`Total Transfers Created: ${totalTransfers}`);
        console.log(
            `Skipped Transfers (insufficient funds/invalid): ${skippedTransfers}`
        );
        console.log(`Accounts Processed: ${accountsProcessed}`);
        console.log("=".repeat(60) + "\n");
    } catch (error) {
        console.error("❌ Error during beneficiary transfer seeding:", error);
        throw error;
    }
}

// ==================== MAIN EXECUTION ====================

async function main() {
    try {
        console.log("\n" + "=".repeat(60));
        console.log("🏦 SWIFT BANK - ACCOUNT SEEDER");
        console.log("=".repeat(60));

        // Connect to MongoDB
        const DATABASE_URL = process.env.DATABASE_URL;
        if (!DATABASE_URL) {
            throw new Error("DATABASE_URL environment variable is not set");
        }

        console.log("\n🔌 Connecting to MongoDB...");
        await mongoose.connect(DATABASE_URL);
        console.log("✅ Connected to MongoDB");

        // Phase 1a: Cleanup orphaned accounts (accounts without users)
        // await cleanupOrphanedAccounts();

        // Phase 1b: Cleanup invalid beneficiary IDs
        // await cleanupBeneficiaryIds();

        // Phase 2: Seed transactions
        // await seedTransactions(TARGET_USER_ID);

        // Phase 3: Seed beneficiary fund transfers
        await seedBeneficiaryTransfers(TARGET_USER_ID);

        console.log("\n🎉 Seeding completed successfully!\n");
    } catch (error) {
        console.error("\n💥 Seeding failed:", error);
        process.exit(1);
    } finally {
        await mongoose.disconnect();
        console.log("🔌 Disconnected from MongoDB\n");
        process.exit(0);
    }
}

// Run the seeder
main();
