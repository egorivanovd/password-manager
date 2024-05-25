import React, { useContext, useEffect, useState } from 'react';
import { ListGroup, Modal, Button } from 'react-bootstrap';
import './Note.css';
import { observer } from 'mobx-react-lite';
import { Context } from '../index';
import {
    fetchNotes,
    createNote,
    updateNote,
    deleteNote,
} from '../http/noteAPI';

const Note = observer(() => {
    const { notes } = useContext(Context);
    const [title, setTitle] = useState('');
    const [text, setText] = useState('');
    const [selectedIndex, setSelectedIndex] = useState(null);
    const [showText, setShowText] = useState(false);
    const [showConfirmDeleteModal, setShowConfirmDeleteModal] = useState(false);

    const isFormFilled = text.trim() !== '';

    const emptyNoteNumber = (index) => {
        let emptyCount = 0;
        for (let i = 0; i <= index; i++) {
            if (!notes.notes[i]?.title) {
                emptyCount++;
            }
        }
        return emptyCount;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (selectedIndex === null) {
                const newNote = await createNote(title, text);
                notes.setNotes([...notes.notes, newNote]);
            } else {
                const noteToUpdate = notes.notes[selectedIndex];
                await updateNote(noteToUpdate.id, title, text);
                const updatedNotes = [...notes.notes];
                updatedNotes[selectedIndex] = {
                    ...noteToUpdate,
                    title,
                    text,
                };
                notes.setNotes(updatedNotes);
            }
            resetForm();
        } catch (error) {
            console.error('Error handling note:', error);
        }
    };

    const handleItemClick = (note, index) => {
        setTitle(note.title);
        setText(note.text);
        setSelectedIndex(index);
    };

    const handleDelete = () => {
        setShowConfirmDeleteModal(true);
    };

    const handleCloseModal = () => {
        setShowConfirmDeleteModal(false);
    };

    const confirmDelete = async () => {
        if (selectedIndex === null) return;
        try {
            const noteToDelete = notes.notes[selectedIndex];
            await deleteNote(noteToDelete.id);
            const updatedNotes = notes.notes.filter(
                (_, index) => index !== selectedIndex
            );
            notes.setNotes(updatedNotes);
            resetForm();
        } catch (error) {
            console.error('Error deleting note:', error);
        }
        setShowConfirmDeleteModal(false);
    };

    const resetForm = () => {
        setTitle('');
        setText('');
        setSelectedIndex(null);
    };

    useEffect(() => {
        fetchNotes().then((data) => notes.setNotes(data));
    }, [notes]);

    const handleShowNote = () => {
        setShowText(!showText);
    };

    return (
        <div className="note-manager">
            <div className="note-manager-content">
                <div className="note-list">
                    <ListGroup>
                        {notes.notes.map((note, index) => (
                            <ListGroup.Item
                                key={index}
                                onClick={() => handleItemClick(note, index)}
                                active={index === selectedIndex}
                            >
                                {note.title
                                    ? note.title
                                    : `Пустая заметка №${emptyNoteNumber(
                                          index
                                      )}`}
                            </ListGroup.Item>
                        ))}
                    </ListGroup>
                </div>
                <div className="note-form">
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label>
                                Название{' '}
                                <span className="optional-text">
                                    (необязательно)
                                </span>
                            </label>
                            <input
                                type="text"
                                className="form-control"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                            />
                        </div>
                        <div className="form-group">
                            <label>Текст</label>
                            <div className="note-input-group">
                                <input
                                    type={showText ? 'text' : 'password'}
                                    className="form-control"
                                    value={text}
                                    onChange={(e) => setText(e.target.value)}
                                    style={{ marginBottom: '10px' }}
                                    required
                                />
                                <div
                                    className="password-buttons"
                                    style={{ marginBottom: '10px' }}
                                >
                                    <button
                                        type="button"
                                        className="btn btn-secondary"
                                        onClick={handleShowNote}
                                        style={{ marginRight: '5px' }}
                                        disabled={!isFormFilled}
                                    >
                                        {showText ? 'Скрыть' : 'Показать'}
                                    </button>
                                </div>
                            </div>
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
                                    onClick={resetForm}
                                >
                                    Сбросить
                                </button>
                            )}
                            <button
                                type="button"
                                className="btn btn-danger"
                                onClick={handleDelete}
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
                        </div>
                    </form>
                </div>
            </div>
            <Modal show={showConfirmDeleteModal} onHide={handleCloseModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Подтверждение удаления</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Вы уверены, что хотите удалить эту заметку?
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseModal}>
                        Отмена
                    </Button>
                    <Button variant="danger" onClick={confirmDelete}>
                        Удалить
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
});

export default Note;
