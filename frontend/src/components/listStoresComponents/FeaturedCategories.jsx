// FeaturedCategories.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { Row, Col, Card, Spinner } from 'react-bootstrap';
import { FaLaptop, FaTshirt, FaHome, FaUtensils } from 'react-icons/fa';

const FeaturedCategories = ({ categories = [], loading }) => {
    const getCategoryIcon = (categoryName) => {
        switch(categoryName.toLowerCase()) {
            case 'electronics': return <FaLaptop size={24} />;
            case 'fashion': return <FaTshirt size={24} />;
            case 'home & garden': return <FaHome size={24} />;
            case 'food & beverage': return <FaUtensils size={24} />;
            default: return <FaHome size={24} />;
        }
    };

    return (
        <div className="mb-5">
            <h3 className="h4 fw-bold mb-4">Browse by Category</h3>
            {loading ? (
                <div className="text-center py-3">
                    <Spinner animation="border" variant="warning" size="sm" />
                </div>
            ) : (
                <Row className="g-3">
                    {categories.map((category) => (
                        <Col xs={6} sm={3} key={category.id}>
                            <motion.div whileHover={{ y: -5 }}>
                                <Card className="h-100 border-0 shadow-sm text-center p-3">
                                    <div className="text-yellow-600 mb-2">
                                        {getCategoryIcon(category.name)}
                                    </div>
                                    <h4 className="h6 mb-1">{category.name}</h4>
                                    <small className="text-muted">
                                        {category.vendors_count || 0} vendors
                                    </small>
                                </Card>
                            </motion.div>
                        </Col>
                    ))}
                </Row>
            )}
        </div>
    );
};

export default FeaturedCategories;