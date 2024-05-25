import { $authHost } from './index';

export const createPassword = async (title, login, password, url) => {
    const { data } = await $authHost.post('api/password', {
        title,
        login,
        password,
        url,
    });
    return data;
};

export const fetchPasswords = async () => {
    const { data } = await $authHost.get('api/password');
    return data;
};

export const updatePassword = async (id, title, login, password, url) => {
    try {
        const { data } = await $authHost.put(`api/password/${id}`, {
            title,
            login,
            password,
            url,
        });
        return data;
    } catch (error) {
        // Обработка ошибок
        console.error('Ошибка при обновлении пароля:', error);
        throw error;
    }
};

export const deletePassword = async (id) => {
    try {
        const { data } = await $authHost.delete(`api/password/${id}`);
        return data;
    } catch (error) {
        // Обработка ошибок
        console.error('Ошибка при удалении пароля:', error);
        throw error;
    }
};
