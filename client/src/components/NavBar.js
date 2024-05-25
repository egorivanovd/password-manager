import React, { useContext } from 'react';
import { Context } from '..';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { NOTE_ROUTE, PASSWORD_ROUTE, LOGIN_ROUTE } from '../utils/consts';
import { observer } from 'mobx-react-lite';
import { useHistory, useLocation } from 'react-router-dom';
import { Link } from 'react-router-dom';

const NavBar = observer(() => {
    const { user } = useContext(Context);
    const history = useHistory();
    const location = useLocation();

    const handleLogout = () => {
        user.logout();
        history.push(LOGIN_ROUTE);
    };

    return (
        <>
            {user.isAuth && (
                <Navbar bg="dark" variant="dark">
                    <Container>
                        <Navbar.Brand to={PASSWORD_ROUTE}>
                            Менеджер паролей
                        </Navbar.Brand>
                        <Navbar.Toggle />
                        <Nav className="me-auto">
                            <Nav.Link
                                as={Link}
                                to={PASSWORD_ROUTE}
                                style={{
                                    color:
                                        location.pathname === PASSWORD_ROUTE
                                            ? '#ffffff'
                                            : '#cccccc',
                                }}
                            >
                                Пароли
                            </Nav.Link>
                            <Nav.Link
                                as={Link}
                                to={NOTE_ROUTE}
                                style={{
                                    color:
                                        location.pathname === NOTE_ROUTE
                                            ? '#ffffff'
                                            : '#cccccc',
                                }}
                            >
                                Заметки
                            </Nav.Link>
                        </Nav>

                        <Navbar.Collapse className="justify-content-end">
                            <Nav className="me-auto">
                                <Nav.Link onClick={handleLogout}>
                                    Выйти
                                </Nav.Link>
                            </Nav>
                        </Navbar.Collapse>

                        {/* TODO: add user's email
                        <Navbar.Collapse className="justify-content-end">
                            <Navbar.Text>
                                Signed in as: <a href="#login">{user.user.email}</a>
                            </Navbar.Text>
                        </Navbar.Collapse> */}
                    </Container>
                </Navbar>
            )}
        </>
    );
});

export default NavBar;
