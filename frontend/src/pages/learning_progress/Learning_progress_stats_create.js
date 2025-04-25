import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button, Form, Container, InputGroup } from 'react-bootstrap';

//Create new paintings
const LearningProgressStatsCreate = () => {
    const [paintingType, setPaintingType] = useState('');
    const [paintingCount, setPaintingCount] = useState(0);
    const [existingTypes, setExistingTypes] = useState([]);
    const [selectedType, setSelectedType] = useState('');
    const [isNewType, setIsNewType] = useState(false);

    // Fetch existing painting types when component mounts
    useEffect(() => {
        const fetchExistingTypes = async () => {
            try {
                const res = await axios.get('/api/painting-stats');
                const types = res.data.map(stat => stat.paintingType);
                setExistingTypes([...new Set(types)]); // Remove duplicates with Set
            } catch (error) {
                console.error('Error fetching painting types:', error);
            }
        };

        fetchExistingTypes();
    }, []);

    const handleTypeChange = (e) => {
        const value = e.target.value;
        setSelectedType(value);

        if (value === 'new') {
            setIsNewType(true);
            setPaintingType('');
        } else {
            setIsNewType(false);
            setPaintingType(value);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const typeToSubmit = isNewType ? paintingType : selectedType;

        await axios.post('/api/painting-stats', {
            paintingType: typeToSubmit,
            paintingCount
        });

        alert("Painting Stat Created");
        // Redirect back to the Learning Progress page
        window.location.href = '/pages/learning_progress/learning_progress_view';
    };

    return (
        <Container className="mt-4">
            <h3>Add New Painting Stat</h3>
            <Form onSubmit={handleSubmit}>
                <Form.Group>
                    <Form.Label>Painting Type</Form.Label>
                    <Form.Select
                        value={selectedType}
                        onChange={handleTypeChange}
                        className="mb-2"
                        required
                    >
                        <option value="">Select a painting type</option>
                        {existingTypes.map((type, index) => (
                            <option key={index} value={type}>{type}</option>
                        ))}
                        <option value="new">+ Add new type</option>
                    </Form.Select>

                    {isNewType && (
                        <InputGroup className="mb-3">
                            <Form.Control
                                placeholder="Enter new painting type"
                                value={paintingType}
                                onChange={(e) => setPaintingType(e.target.value)}
                                required={isNewType}
                            />
                        </InputGroup>
                    )}
                </Form.Group>

                <Form.Group className="mt-2">
                    <Form.Label>Count</Form.Label>
                    <Form.Control
                        type="number"
                        value={paintingCount}
                        onChange={(e) => setPaintingCount(parseInt(e.target.value))}
                        required
                        min="1"
                    />
                </Form.Group>

                <Button type="submit" className="mt-3" variant="primary">Submit</Button>
            </Form>
        </Container>
    );
};

export default LearningProgressStatsCreate;
