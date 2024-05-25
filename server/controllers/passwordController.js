const { Password } = require('../models/models');
const ApiError = require('../error/ApiError');
const { encrypt, decrypt } = require('../utils/crypto-utils');

class PasswordController {
    async create(req, res, next) {
        try {
            const { title, login, password, url } = req.body;
            const userId = req.user.id;

            if (!userId) {
                return next(ApiError.badRequest('Пользователь не авторизован'));
            }

            const encryptedLogin = encrypt(login);
            const encryptedPassword = encrypt(password);

            const passwordRecord = await Password.create({
                title,
                login: encryptedLogin,
                password: encryptedPassword,
                url,
                userId,
            });
            res.json({
                ...passwordRecord.dataValues,
                login: decrypt(passwordRecord.login),
                password: decrypt(passwordRecord.password),
            });
        } catch (e) {
            next(ApiError.badRequest(e.message));
        }
    }

    async getAll(req, res) {
        try {
            const userId = req.user.id;
            const passwords = await Password.findAll({ where: { userId } });

            const decryptedPasswords = passwords.map((record) => ({
                ...record.dataValues,
                login: decrypt(record.login),
                password: decrypt(record.password),
            }));

            return res.json(decryptedPasswords);
        } catch (e) {
            return res.status(500).json({ message: e.message });
        }
    }

    async getOne(req, res, next) {
        try {
            const { id } = req.params;
            const userId = req.user.id;

            const password = await Password.findOne({ where: { id, userId } });

            if (!password) {
                return next(ApiError.notFound('Пароль не найден'));
            }

            res.json({
                ...password.dataValues,
                login: decrypt(password.login),
                password: decrypt(password.password),
            });
        } catch (e) {
            next(ApiError.badRequest(e.message));
        }
    }

    async delete(req, res, next) {
        try {
            const { id } = req.params;
            const userId = req.user.id;

            const password = await Password.findOne({ where: { id, userId } });

            if (!password) {
                return next(ApiError.notFound('Пароль не найден'));
            }

            await password.destroy();

            res.json({ message: 'Пароль успешно удален' });
        } catch (e) {
            next(ApiError.badRequest(e.message));
        }
    }

    async update(req, res, next) {
        try {
            const { id } = req.params;
            const userId = req.user.id;
            const { title, login, password, url } = req.body;

            let passwordRecord = await Password.findOne({
                where: { id, userId },
            });

            if (!passwordRecord) {
                return next(ApiError.notFound('Пароль не найден'));
            }

            passwordRecord.title = title;
            passwordRecord.login = encrypt(login);
            passwordRecord.password = encrypt(password);
            passwordRecord.url = url;
            await passwordRecord.save();

            res.json({
                ...passwordRecord.dataValues,
                login: decrypt(passwordRecord.login),
                password: decrypt(passwordRecord.password),
            });
        } catch (e) {
            next(ApiError.badRequest(e.message));
        }
    }
}

module.exports = new PasswordController();
