import { makeAutoObservable } from 'mobx';

export default class UserStore {
    constructor() {
        this._isAuth = false;
        this._user = {};
        makeAutoObservable(this);
    }

    setIsAuth(bool) {
        this._isAuth = bool;
    }

    setUser(user) {
        this._user = user;
    }

    logout() {
        localStorage.removeItem('token');
        this.setIsAuth(false);
        this.setUser({});
    }

    get isAuth() {
        return this._isAuth;
    }

    get user() {
        return this._user;
    }
}
