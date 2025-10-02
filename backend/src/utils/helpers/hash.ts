import bcrypt from 'bcrypt';

/**
 * Hash utility functions for password management
 */
export class HashUtil {
    /**
     * Default salt rounds for bcrypt hashing
     */
    private static readonly SALT_ROUNDS = 12;

    /**
     * Hashes a plain text password using bcrypt
     *
     * @param password - Plain text password to hash
     * @param saltRounds - Number of salt rounds (optional, defaults to 12)
     * @returns Promise<string> - Hashed password
     */
    static async hashPassword(password: string, saltRounds: number = HashUtil.SALT_ROUNDS): Promise<string> {
        try {
            return await bcrypt.hash(password, saltRounds);
        } catch (error: any) {
            throw new Error(`Failed to hash password: ${error.message}`);
        }
    }

    /**
     * Compares a plain text password with a hashed password
     *
     * @param password - Plain text password
     * @param hashedPassword - Hashed password to compare against
     * @returns Promise<boolean> - True if passwords match, false otherwise
     */
    static async comparePassword(password: string, hashedPassword: string): Promise<boolean> {
        try {
            return await bcrypt.compare(password, hashedPassword);
        } catch (error: any) {
            throw new Error(`Failed to compare passwords: ${error.message}`);
        }
    }

    /**
     * Generates a salt with the specified number of rounds
     *
     * @param saltRounds - Number of salt rounds (optional, defaults to 12)
     * @returns Promise<string> - Generated salt
     */
    static async generateSalt(saltRounds: number = HashUtil.SALT_ROUNDS): Promise<string> {
        try {
            return await bcrypt.genSalt(saltRounds);
        } catch (error: any) {
            throw new Error(`Failed to generate salt: ${error.message}`);
        }
    }

    /**
     * Hashes a password with a pre-generated salt
     *
     * @param password - Plain text password
     * @param salt - Pre-generated salt
     * @returns Promise<string> - Hashed password
     */
    static async hashWithSalt(password: string, salt: string): Promise<string> {
        try {
            return await bcrypt.hash(password, salt);
        } catch (error: any) {
            throw new Error(`Failed to hash password with salt: ${error.message}`);
        }
    }

    /**
     * Validates if a string is a valid bcrypt hash
     *
     * @param hash - String to validate
     * @returns boolean - True if valid bcrypt hash, false otherwise
     */
    static isValidHash(hash: string): boolean {
        // Bcrypt hash regex pattern
        const bcryptRegex = /^\$2[ayb]\$[0-9]{2}\$[A-Za-z0-9./]{53}$/;
        return bcryptRegex.test(hash);
    }

    /**
     * Gets the salt rounds from a bcrypt hash
     *
     * @param hash - Bcrypt hash
     * @returns number - Number of salt rounds used
     */
    static getSaltRounds(hash: string): number {
        if (!HashUtil.isValidHash(hash)) {
            throw new Error('Invalid bcrypt hash format');
        }

        // Extract salt rounds from hash (format: $2a$12$...)
        const saltRounds = parseInt(hash.split('$')[2]);
        return saltRounds;
    }
}