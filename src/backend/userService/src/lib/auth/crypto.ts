import * as bcrypt from 'bcrypt';
import HASH_CONFIG from '../../config/hash.config';

/**
 * Abstract class for application-level cryptographic operations.
 */
abstract class AppCrypto {

    /**
     * Number of salt rounds to use for hashing.
     * @private
     */
    private static readonly saltRounds = HASH_CONFIG.DEFAULT.saltRounds;

    /**
     * Hashes a password using bcrypt.
     * @param {string} password - The password to hash.
     * @returns {Promise<string>} The hashed password.
     */
    static async hashPassword(password: string): Promise<string> {
        return bcrypt.hash(password, this.saltRounds);
    }
    
    /**
     * Compares a password with a hash using bcrypt.
     * @param {string} password - The password to compare.
     * @param {string} hash - The hash to compare with.
     * @returns {Promise<boolean>} True if the password matches the hash, false otherwise.
     */
    static async comparePassword(password: string, hash: string): Promise<boolean> {
        return bcrypt.compare(password, hash);
    }

}

export default AppCrypto;