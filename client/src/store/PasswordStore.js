import { makeAutoObservable } from 'mobx';

export default class PasswordStore {
    constructor() {
        this._passwords = [];
        makeAutoObservable(this);
    }

    setPasswords(passwords) {
        this._passwords = passwords;
    }

    get passwords() {
        return this._passwords;
    }
}
