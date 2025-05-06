import React, { useState } from 'react';
import { Modal, Button, Form, Toast, ToastContainer } from 'react-bootstrap';
import axios from 'axios';

const LearningProgressTableCreate = ({ show, handleClose, refreshData }) => {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        progress: 0,
        deadline: ''
    });

    const [showToast, setShowToast] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('/api/courses', formData, { withCredentials: true });
            setShowToast(true);
            handleClose();
            refreshData();
        } catch (error) {
            console.error('Error adding course:', error);
            alert('Failed to add course. Please try again.');
        }
    };

    return (
        <><Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>Add New Course</Modal.Title>
            </Modal.Header>
            <Form onSubmit={handleSubmit}>
                <Modal.Body>
                    <Form.Group>
                        <Form.Label>Title</Form.Label>
                        <Form.Control
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            required />
                    </Form.Group>
                    <Form.Group className="mt-2">
                        <Form.Label>Description</Form.Label>
                        <Form.Control
                            type="text"
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            required />
                    </Form.Group>
                    <Form.Group className="mt-2">
                        <Form.Label>Progress</Form.Label>
                        <Form.Control
                            type="number"
                            name="progress"
                            value={formData.progress}
                            onChange={handleChange}
                            required />
                    </Form.Group>
                    <Form.Group className="mt-2">
                        <Form.Label>Deadline</Form.Label>
                        <Form.Control
                            type="date"
                            name="deadline"
                            value={formData.deadline}
                            onChange={handleChange}
                            required
                            min={new Date().toLocaleDateString('en-CA')} //validation added- user can select today's date or future dates only
                        />
                    </Form.Group>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>Cancel</Button>
                    <Button type="submit" variant="primary">Add Course</Button>
                </Modal.Footer>
            </Form>
        </Modal>
            <ToastContainer position="top-end" className="p-3">
                <Toast onClose={() => setShowToast(false)} show={showToast} style={{ backgroundColor: '#F4C3D2', color: 'black' }} delay={3000} autohide>
                    <Toast.Header>
                        <strong className="me-auto">Success</strong>
                    </Toast.Header>
                    <Toast.Body>New course addedsuccessfully!</Toast.Body>
                </Toast>
            </ToastContainer></>

    );
};

export default LearningProgressTableCreate;
