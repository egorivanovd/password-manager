import React, { createContext } from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import UserStore from './store/UserStore';
import PasswordStore from './store/PasswordStore';
import NoteStore from './store/NoteStore';

export const Context = createContext(null);

ReactDOM.render(
    <Context.Provider
        value={{
            user: new UserStore(),
            passwords: new PasswordStore(),
            notes: new NoteStore(),
        }}
    >
        <App />
    </Context.Provider>,
    document.getElementById('root')
);
