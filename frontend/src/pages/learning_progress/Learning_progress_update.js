import React, { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import axios from 'axios';

const LearningProgressUpdate = ({ show, handleClose, courseId, refreshData }) => {


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
