import React, { useContext, useEffect, useState } from 'react';
import { ListGroup } from 'react-bootstrap';
import './Password.css';
import { observer } from 'mobx-react-lite';
import { Context } from '../index';
import { useHistory } from 'react-router-dom';
import {
    fetchPasswords,
    createPassword,
    updatePassword,
    deletePassword,
} from '../http/passwordAPI';
import { LOGIN_ROUTE } from '../utils/consts';
import { Modal, Button } from 'react-bootstrap';

const Password = observer(() => {
    const { user, passwords } = useContext(Context);
    const history = useHistory();
    const [title, setTitle] = useState('');
    const [login, setLogin] = useState('');
    const [password, setPassword] = useState('');
    const [url, setUrl] = useState('');
    const [selectedIndex, setSelectedIndex] = useState(null);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmDeleteModal, setShowConfirmDeleteModal] = useState(false);

    const isPasswordFilled = password.trim() !== '';
    const isFormFilled =
        title.trim() !== '' && login.trim() !== '' && isPasswordFilled;

    const generatePassword = () => {
        const charset =
            'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+~`|}{[]:;?><,./-=';
        let newPassword = '';
        for (let i = 0; i < 16; i++) {
            const randomIndex = Math.floor(Math.random() * charset.length);
            newPassword += charset[randomIndex];
        }
        setPassword(newPassword);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (selectedIndex === null) {
                const newPassword = await createPassword(
                    title,
                    login,
                    password,
                    url
                );
                passwords.setPasswords([...passwords.passwords, newPassword]);
            } else {
                const passwordToUpdate = passwords.passwords[selectedIndex];
                await updatePassword(
                    passwordToUpdate.id,
                    title,
                    login,
                    password,
                    url
                );
                const updatedPasswords = [...passwords.passwords];
                updatedPasswords[selectedIndex] = {
                    ...passwordToUpdate,
                    title,
                    login,
                    password,
                    url,
                };
                passwords.setPasswords(updatedPasswords);
            }
            setTitle('');
            setLogin('');
            setPassword('');
            setUrl('');
            setSelectedIndex(null);
        } catch (error) {
            console.error('Error handling password:', error);
        }
    };

    const handleItemClick = (password, index) => {
        setTitle(password.title);
        setLogin(password.login);
        setPassword(password.password);
        setUrl(password.url);
        setSelectedIndex(index);
    };

    const handleDelete = async (index) => {
        setSelectedIndex(index);
        setShowConfirmDeleteModal(true);
    };

    const confirmDelete = async () => {
        if (selectedIndex === null) return;
        try {
            const passwordToDelete = passwords.passwords[selectedIndex];
            await deletePassword(passwordToDelete.id);
            const updatedPasswords = passwords.passwords.filter(
                (_, index) => index !== selectedIndex
            );
            passwords.setPasswords(updatedPasswords);
            setTitle('');
            setLogin('');
            setPassword('');
            setUrl('');
            setSelectedIndex(null);
        } catch (error) {
            console.error('Error deleting password:', error);
        }
        setShowConfirmDeleteModal(false);
    };

    const handleReset = () => {
        setTitle('');
        setLogin('');
        setPassword('');
        setUrl('');
        setSelectedIndex(null);
    };

    const handleShowPassword = () => {
        setShowPassword(!showPassword);
    };

    const handleCopyPassword = () => {
        navigator.clipboard.writeText(password);
    };

    useEffect(() => {
        if (!user.isAuth) {
            history.push(LOGIN_ROUTE);
        } else {
            fetchPasswords().then((data) => passwords.setPasswords(data));
        }
    }, [user.isAuth, passwords, history]);

    return (
        <div className="password-manager">
            <div className="password-manager-content">
                <div className="password-list">
                    <ListGroup>
                        {passwords.passwords.map((password, index) => (
                            <ListGroup.Item
                                key={index}
                                onClick={() => handleItemClick(password, index)}
                                active={index === selectedIndex}
                            >
                                {password.title}
                            </ListGroup.Item>
                        ))}
                    </ListGroup>
                </div>
                <div className="password-form">
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label>Название</label>
                            <input
                                type="text"
                                className="form-control"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Имя пользователя</label>
                            <input
                                type="text"
                                className="form-control"
                                value={login}
                                onChange={(e) => setLogin(e.target.value)}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Пароль</label>
                            <div className="password-input-group">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    className="form-control"
                                    value={password}
                                    onChange={(e) =>
                                        setPassword(e.target.value)
                                    }
                                    required
                                    style={{ marginBottom: '10px' }} // Adding bottom margin for input field
                                />
                                <div
                                    className="password-buttons"
                                    style={{ marginBottom: '10px' }}
                                >
                                    <button
                                        type="button"
                                        className="btn btn-secondary"
                                        onClick={handleShowPassword}
                                        style={{ marginRight: '5px' }}
                                        disabled={!isPasswordFilled}
                                    >
                                        {showPassword ? 'Скрыть' : 'Показать'}
                                    </button>
                                    <button
                                        type="button"
                                        className="btn btn-primary"
                                        onClick={handleCopyPassword}
                                        style={{ marginRight: '5px' }}
                                        disabled={!isPasswordFilled}
                                    >
                                        Копировать
                                    </button>
                                    <button
                                        type="button"
                                        className="btn btn-warning"
                                        onClick={generatePassword}
                                        disabled={isPasswordFilled}
                                    >
                                        Сгенерировать
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div className="form-group">
                            <label>
                                URL{' '}
                                <span className="optional-text">
                                    (необязательно)
                                </span>
                            </label>
                            <input
                                type="text"
                                className="form-control"
                                value={url}
                                onChange={(e) => setUrl(e.target.value)}
                            />
                        </div>
                        <div
                            className="form-group"
                            style={{ display: 'flex', gap: '5px' }}
                        >
                            <button
                                type="submit"
                                className="btn btn-success"
                                disabled={!isFormFilled}
                            >
                                {selectedIndex === null
                                    ? 'Создать'
                                    : 'Сохранить'}
                            </button>
                            {selectedIndex !== null && (
                                <button
                                    type="button"
                                    className="btn btn-secondary"
                                    onClick={handleReset}
                                >
                                    Сбросить
                                </button>
                            )}
                            <button
                                type="button"
                                className="btn btn-danger"
                                onClick={() => handleDelete(selectedIndex)}
                                disabled={selectedIndex === null}
                                style={{
                                    backgroundColor:
                                        selectedIndex === null
                                            ? 'grey'
                                            : '#dc3545',
                                    borderColor:
                                        selectedIndex === null
                                            ? 'grey'
                                            : '#dc3545',
                                }}
                            >
                                Удалить
                            </button>
                            {/* Модальное окно подтверждения удаления */}
                            <Modal
                                show={showConfirmDeleteModal}
                                onHide={() => setShowConfirmDeleteModal(false)}
                            >
                                <Modal.Header closeButton>
                                    <Modal.Title>
                                        Подтверждение удаления
                                    </Modal.Title>
                                </Modal.Header>
                                <Modal.Body>
                                    Вы уверены, что хотите удалить этот пароль?
                                </Modal.Body>
                                <Modal.Footer>
                                    <Button
                                        variant="secondary"
                                        onClick={() =>
                                            setShowConfirmDeleteModal(false)
                                        }
                                    >
                                        Отмена
                                    </Button>
                                    <Button
                                        variant="danger"
                                        onClick={confirmDelete}
                                    >
                                        Удалить
                                    </Button>
                                </Modal.Footer>
                            </Modal>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
});

export default Password;
