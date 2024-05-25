import { makeAutoObservable } from 'mobx';

export default class NoteStore {
    constructor() {
        this._notes = [];
        makeAutoObservable(this);
    }

    setNotes(notes) {
        this._notes = notes;
    }

    get notes() {
        return this._notes;
    }
}
