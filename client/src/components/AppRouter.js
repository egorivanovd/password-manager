import React, { useContext } from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import { authRoutes, publicRoutes } from '../routes';
import { Context } from '..';
import { LOGIN_ROUTE, PASSWORD_ROUTE } from '../utils/consts';

const AppRouter = () => {
    const { user } = useContext(Context);

    return (
        <Switch>
            {user.isAuth &&
                authRoutes.map(({ path, Component }) => (
                    <Route key={path} path={path} component={Component} exact />
                ))}
            {publicRoutes.map(({ path, Component }) => (
                <Route key={path} path={path} component={Component} exact />
            ))}
            <Redirect to={user.isAuth ? PASSWORD_ROUTE : LOGIN_ROUTE} />{' '}
        </Switch>
    );
};

export default AppRouter;
