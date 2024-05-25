import React, { useContext, useEffect, useState } from 'react';
import { BrowserRouter } from 'react-router-dom';
import AppRouter from './components/AppRouter';
import NavBar from './components/NavBar';
import { observer } from 'mobx-react-lite';
import { Context } from '.';
import { check } from './http/userAPI';
import LoadingAnimation from './components/LoadingAnimation'; // Import the new loading animation

const App = observer(() => {
    const { user } = useContext(Context);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setTimeout(() => {
            check()
                .then((data) => {
                    user.setUser(true);
                    user.setIsAuth(true);
                })
                .finally(() => setLoading(false));
        }, 1000);
    }, [user]);

    if (loading) {
        return <LoadingAnimation />;
    }

    return (
        <BrowserRouter>
            <NavBar />
            <AppRouter />
        </BrowserRouter>
    );
});

export default App;
