const { Note } = require('../models/models');
const ApiError = require('../error/ApiError');
const { encrypt, decrypt } = require('../utils/crypto-utils');

class NoteController {
    async create(req, res, next) {
        try {
            const { title, text } = req.body;
            const userId = req.user.id;

            if (!userId) {
                return next(ApiError.badRequest('Пользователь не авторизован'));
            }

            const encryptedText = encrypt(text);

            const note = await Note.create({
                title,
                text: encryptedText,
                userId,
            });

            // Расшифровываем текст заметки перед отправкой в ответ
            const decryptedNote = {
                ...note.dataValues,
                text: decrypt(note.text),
            };

            return res.json(decryptedNote);
        } catch (e) {
            next(ApiError.badRequest(e.message));
        }
    }

    async getAll(req, res) {
        try {
            const userId = req.user.id;
            const notes = await Note.findAll({ where: { userId } });
            const decryptedNotes = notes.map((note) => ({
                ...note.dataValues,
                text: decrypt(note.text),
            }));
            return res.json(decryptedNotes);
        } catch (e) {
            return res.status(500).json({ message: e.message });
        }
    }

    async getOne(req, res, next) {
        try {
            const { id } = req.params;
            const userId = req.user.id;

            const note = await Note.findOne({ where: { id, userId } });

            if (!note) {
                return next(ApiError.notFound('Заметка не найдена'));
            }

            const decryptedNote = {
                ...note.dataValues,
                text: decrypt(note.text),
            };

            res.json(decryptedNote);
        } catch (e) {
            next(ApiError.badRequest(e.message));
        }
    }

    async delete(req, res, next) {
        try {
            const { id } = req.params;
            const userId = req.user.id;

            const note = await Note.findOne({ where: { id, userId } });

            if (!note) {
                return next(ApiError.notFound('Заметка не найдена'));
            }

            await note.destroy();

            res.json({ message: 'Заметка успешно удалена' });
        } catch (e) {
            next(ApiError.badRequest(e.message));
        }
    }

    async update(req, res, next) {
        try {
            const { id } = req.params;
            const userId = req.user.id;
            const { title, text } = req.body;

            let noteRecord = await Note.findOne({ where: { id, userId } });

            if (!noteRecord) {
                return next(ApiError.notFound('Заметка не найдена'));
            }

            const encryptedText = encrypt(text);

            noteRecord.title = title;
            noteRecord.text = encryptedText;
            await noteRecord.save();

            const decryptedNote = {
                ...noteRecord.dataValues,
                text: decrypt(noteRecord.text),
            };

            res.json(decryptedNote);
        } catch (e) {
            next(ApiError.badRequest(e.message));
        }
    }
}

module.exports = new NoteController();
