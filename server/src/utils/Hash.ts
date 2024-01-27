import bcrypt from 'bcrypt';

class Hash {
    static async make(
        plainTextPassword: string,
        saltRounds = 10
    ): Promise<string> {
        const salt = await bcrypt.genSalt(saltRounds);
        const hashedPassword = await bcrypt.hash(plainTextPassword, salt);
        return hashedPassword;
    }

    static async check(
        plainTextPassword: string,
        hashedPassword: string
    ): Promise<boolean> {
        return await bcrypt.compare(plainTextPassword, hashedPassword);
    }
}

export default Hash;