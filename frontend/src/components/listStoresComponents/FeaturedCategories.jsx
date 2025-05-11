import React from 'react';
import { motion } from 'framer-motion';
import { Row, Col, Card } from 'react-bootstrap';
import { FaLaptop, FaTshirt, FaHome, FaUtensils } from 'react-icons/fa';

const FeaturedCategories = () => {
    const categories = [
        { id: 1, name: 'Electronics', icon: <FaLaptop size={24} />, count: 42 },
        { id: 2, name: 'Fashion', icon: <FaTshirt size={24} />, count: 36 },
        { id: 3, name: 'Home & Garden', icon: <FaHome size={24} />, count: 28 },
        { id: 4, name: 'Food & Beverage', icon: <FaUtensils size={24} />, count: 19 }
    ];

    return (
        <div className="mb-5">
            <h3 className="h4 fw-bold mb-4">Browse by Category</h3>
            <Row className="g-3">
                {categories.map((category) => (
                    <Col xs={6} sm={3} key={category.id}>
                        <motion.div whileHover={{ y: -5 }}>
                            <Card className="h-100 border-0 shadow-sm text-center p-3">
                                <div className="text-yellow-600 mb-2">{category.icon}</div>
                                <h4 className="h6 mb-1">{category.name}</h4>
                                <small className="text-muted">{category.count} vendors</small>
                            </Card>
                        </motion.div>
                    </Col>
                ))}
            </Row>
        </div>
    );
};

export default FeaturedCategories;