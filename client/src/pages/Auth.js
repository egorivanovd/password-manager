import React, { useState, useContext } from 'react';
import { Form, Button } from 'react-bootstrap';
import { Link, useLocation } from 'react-router-dom';
import './Auth.css'; // Импортируем файл CSS
import {
    LOGIN_ROUTE,
    PASSWORD_ROUTE,
    REGISTRATION_ROUTE,
} from '../utils/consts';
import { registration, login } from '../http/userAPI';
import { Context } from '..';
import { observer } from 'mobx-react-lite';

const Auth = observer(() => {
    const { user } = useContext(Context);
    const location = useLocation();
    const isLogin = location.pathname === LOGIN_ROUTE;
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState(''); // Состояние для подтверждения пароля
    const [emailValid, setEmailValid] = useState(false);
    const [passwordValid, setPasswordValid] = useState(false);

    const validateEmail = (email) => {
        // Пример простейшей валидации email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const validatePassword = (password) => {
        return password.length >= 8;
    };

    const clickHandler = async () => {
        try {
            let data;
            if (isLogin) {
                data = await login(email, password);
            } else {
                // Проверка на совпадение паролей перед регистрацией
                if (password !== confirmPassword) {
                    throw new Error('Пароли не совпадают');
                }
                data = await registration(email, password);
            }
            user.setUser(data);
            user.setIsAuth(true);
            window.location.replace(PASSWORD_ROUTE);
        } catch (error) {
            console.log(error.message);
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-title">
                {isLogin ? 'Авторизация' : 'Регистрация'}
            </div>
            <Form className="auth-form">
                <Form.Group controlId="formBasicEmail">
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => {
                            setEmail(e.target.value);
                            setEmailValid(validateEmail(e.target.value));
                        }}
                    />
                </Form.Group>
                <Form.Group controlId="formBasicPassword">
                    <Form.Label>Пароль</Form.Label>
                    <Form.Control
                        type="password"
                        placeholder="Пароль"
                        value={password}
                        onChange={(e) => {
                            setPassword(e.target.value);
                            setPasswordValid(validatePassword(e.target.value));
                        }}
                    />
                    {
                        /* TODO: add validation */ isLogin === false && (
                            <>
                                <Form.Text id="passwordHelpBlock" muted>
                                    Длина пароля должна быть не менее 8 символов
                                </Form.Text>
                            </>
                        )
                    }
                </Form.Group>

                {isLogin === false && (
                    <>
                        <Form.Group controlId="formConfirmPassword">
                            <Form.Label>Подтверждение пароля</Form.Label>
                            <Form.Control
                                type="password"
                                placeholder="Подтвердите пароль"
                                value={confirmPassword}
                                onChange={(e) =>
                                    setConfirmPassword(e.target.value)
                                }
                            />
                        </Form.Group>
                        {password !== confirmPassword && (
                            <p style={{ color: 'red' }}>Пароли не совпадают</p>
                        )}
                    </>
                )}

                <Button
                    variant="primary"
                    type="button"
                    onClick={clickHandler}
                    disabled={
                        !emailValid ||
                        !passwordValid ||
                        (confirmPassword && password !== confirmPassword)
                    }
                >
                    {isLogin ? 'Войти' : 'Зарегистрироваться'}
                </Button>
                <div className="register-link">
                    {isLogin ? (
                        <>
                            Нет аккаунта?{' '}
                            <Link to={REGISTRATION_ROUTE}>
                                Зарегистрироваться
                            </Link>
                        </>
                    ) : (
                        <>
                            Есть аккаунт? <Link to={LOGIN_ROUTE}>Войти</Link>
                        </>
                    )}
                </div>
            </Form>
        </div>
    );
});

export default Auth;
