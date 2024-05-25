import {
    PASSWORD_ROUTE,
    NOTE_ROUTE,
    REGISTRATION_ROUTE,
    LOGIN_ROUTE,
} from './utils/consts';
import Auth from './pages/Auth';
import Password from './pages/Password';
import Note from './pages/Note';

export const authRoutes = [
    {
        path: PASSWORD_ROUTE,
        Component: Password,
    },
    {
        path: NOTE_ROUTE,
        Component: Note,
    },
];

export const publicRoutes = [
    {
        path: LOGIN_ROUTE,
        Component: Auth,
    },
    {
        path: REGISTRATION_ROUTE,
        Component: Auth,
    },
];
