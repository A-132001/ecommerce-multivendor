import React, { useState } from 'react';
import { Form, InputGroup, Button, Row, Col } from 'react-bootstrap';
import { FaSearch, FaTimes } from 'react-icons/fa';

const StoresFilter = ({ onFilter }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [category, setCategory] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        onFilter({ searchQuery, category });
    };

    const handleReset = () => {
        setSearchQuery('');
        setCategory('');
        onFilter({ searchQuery: '', category: '' });
    };

    return (
        <Form onSubmit={handleSubmit} className="mb-5">
            <Row className="g-3">
                <Col md={6}>
                    <InputGroup>
                        <InputGroup.Text>
                            <FaSearch />
                        </InputGroup.Text>
                        <Form.Control
                            type="text"
                            placeholder="Search vendors..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </InputGroup>
                </Col>
                <Col md={4}>
                    <Form.Select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                    >
                        <option value="">All Categories</option>
                        <option value="electronics">Electronics</option>
                        <option value="fashion">Fashion</option>
                        <option value="home">Home & Garden</option>
                        <option value="food">Food & Beverage</option>
                    </Form.Select>
                </Col>
                <Col md={2} className="d-flex gap-2">
                    <Button variant="primary" type="submit">
                        Filter
                    </Button>
                    <Button variant="outline-secondary" onClick={handleReset}>
                        <FaTimes />
                    </Button>
                </Col>
            </Row>
        </Form>
    );
};

export default StoresFilter;