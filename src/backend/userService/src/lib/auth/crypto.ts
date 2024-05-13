import bcrypt from 'bcrypt';
import HASH_CONFIG from '../../config/hash.config';

abstract class AppCrypto {

    private static readonly saltRounds = HASH_CONFIG.DEFAULT.saltRounds;

    static async hashPassword(password: string): Promise<string> {
        return bcrypt.hash(password, this.saltRounds);
    }
    
    static async comparePassword(password: string, hash: string): Promise<boolean> {
        return bcrypt.compare(password, hash);
    }

}

export default AppCrypto;