import { $authHost } from './index';

export const createNote = async (title, text) => {
    const { data } = await $authHost.post('api/note', {
        title,
        text,
    });
    return data;
};

export const fetchNotes = async () => {
    const { data } = await $authHost.get('api/note');
    return data;
};

export const updateNote = async (id, title, text) => {
    try {
        const { data } = await $authHost.put(`api/note/${id}`, {
            title,
            text,
        });
        return data;
    } catch (error) {
        // Обработка ошибок
        console.error('Ошибка при обновлении заметки:', error);
        throw error;
    }
};

export const deleteNote = async (id) => {
    try {
        const { data } = await $authHost.delete(`api/note/${id}`);
        return data;
    } catch (error) {
        // Обработка ошибок
        console.error('Ошибка при удалении заметки:', error);
        throw error;
    }
};
