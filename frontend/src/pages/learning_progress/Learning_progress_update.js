import React, { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import axios from 'axios';

const LearningProgressUpdate = ({ show, handleClose, courseId, refreshData }) => {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        progress: 0,
        deadline: '',
    });

    useEffect(() => {
        if (show && courseId) {
            axios.get(`/api/courses/${courseId}`)
                .then(res => {
                    const { title, description, progress, deadline } = res.data;
                    setFormData({
                        title,
                        description,
                        progress,
                        deadline,
                    });
                })
                .catch(error => {
                    console.error('Error fetching course data:', error);
                    alert('Failed to load course data. Please try again.');
                });
        }
    }, [courseId, show]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.put(`/api/courses/${courseId}`, formData);
            alert("Course updated successfully!");
            handleClose();
            refreshData(); // Optional: refresh parent table/view
        } catch (error) {
            console.error('Error updating course:', error);
            alert('Failed to update course. Please try again.');
        }
    };

    return (
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>Edit Learning Progress</Modal.Title>
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
                            required
                        />
                    </Form.Group>

                    <Form.Group className="mt-2">
                        <Form.Label>Description</Form.Label>
                        <Form.Control
                            type="text"
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            required
                        />
                    </Form.Group>

                    <Form.Group className="mt-2">
                        <Form.Label>Progress</Form.Label>
                        <Form.Control
                            type="number"
                            name="progress"
                            value={formData.progress}
                            onChange={handleChange}
                            min="0"
                            max="100"
                            required
                        />
                    </Form.Group>

                    <Form.Group className="mt-2">
                        <Form.Label>Deadline</Form.Label>
                        <Form.Control
                            type="date"
                            name="deadline"
                            value={formData.deadline}
                            onChange={handleChange}
                            required
                        />
                    </Form.Group>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>Cancel</Button>
                    <Button type="submit" variant="primary">Update</Button>
                </Modal.Footer>
            </Form>
        </Modal>
    );
};

export default LearningProgressUpdate;
