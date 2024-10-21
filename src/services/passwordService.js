import axios from 'axios';
import sha1 from 'js-sha1';

export const checkPasswordCompromise = async (password) => {
    const hashedPassword = sha1(password).toUpperCase();
    const prefix = hashedPassword.substring(0, 5);
    const suffix = hashedPassword.substring(5);
    
    try {
        const response = await axios.get(`https://api.pwnedpasswords.com/range/${prefix}`);
        const data = response.data.split('\n');
        
        const compromised = data.some((line) => line.startsWith(suffix));
        return compromised;
    } catch (error) {
        console.error('Error checking password compromise:', error);
        return false;
    }
};

const commonPatterns = ["12345678","87654321", "password", "qwertyui", "abcd1234"];

export const containsCommonPatterns = (password) => {
    return commonPatterns.some((pattern) => password.toLowerCase().includes(pattern));
};

