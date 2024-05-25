const crypto = require('crypto');

const algorithm = 'aes-256-ctr';
const secretKey = process.env.SECRET_KEY || 'your-256-bit-secret-key'; // Длина 32 байта

const encrypt = (text) => {
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv(algorithm, Buffer.from(secretKey), iv);
    const encrypted = Buffer.concat([cipher.update(text), cipher.final()]);
    return `${iv.toString('hex')}:${encrypted.toString('hex')}`;
};

const decrypt = (hash) => {
    const [iv, content] = hash.split(':');
    const decipher = crypto.createDecipheriv(
        algorithm,
        Buffer.from(secretKey),
        Buffer.from(iv, 'hex')
    );
    const decrypted = Buffer.concat([
        decipher.update(Buffer.from(content, 'hex')),
        decipher.final(),
    ]);
    return decrypted.toString();
};

module.exports = { encrypt, decrypt };
