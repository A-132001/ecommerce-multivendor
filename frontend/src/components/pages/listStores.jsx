import React from "react";
import { listStores } from '../../api/api';
import { Container, Row, Col, Spinner, Alert } from 'react-bootstrap';
import { motion } from 'framer-motion';
import ShopCard from '../ShopCard';
import StoresHero from '../listStoresComponents/StoresHero';
import StoresFilter from '../listStoresComponents/StoresFilter';
import FeaturedCategories from '../listStoresComponents/FeaturedCategories';

const ListStores = () => {
    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState(null);
    const [stores, setStores] = React.useState([]);
    const [filteredStores, setFilteredStores] = React.useState([]);

    React.useEffect(() => {
        const fetchStores = async () => {
            try {
                setLoading(true);
                const response = await listStores();
                setStores(response.data);
                setFilteredStores(response.data);
            } catch (error) {
                console.error('Error fetching stores:', error);
                setError(
                    error.response
                        ? error.response.data.detail || error.response.data.message || 'An error occurred.'
                        : 'Error fetching stores. Please try again later.'
                );
            } finally {
                setLoading(false);
            }
        };

        fetchStores();
    }, []);

    const handleFilter = (filterOptions) => {
        let results = [...stores];
        
        if (filterOptions.category) {
            results = results.filter(store => 
                store.categories?.includes(filterOptions.category)
            );
        }
        
        if (filterOptions.searchQuery) {
            const query = filterOptions.searchQuery.toLowerCase();
            results = results.filter(store => 
                store.name.toLowerCase().includes(query) || 
                store.description.toLowerCase().includes(query)
            );
        }

        setFilteredStores(results);
    };

    return (
        <div className="stores-page">
            <StoresHero />
            
            <section className="py-5 bg-white">
                <Container>
                    <StoresFilter onFilter={handleFilter} />
                    <FeaturedCategories />
                </Container>
            </section>

     <section className="py-5 bg-light">
    <Container>
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
        >
            <h2 className="text-center mb-5 display-5 fw-bold">All Active Vendors</h2>

            {loading ? (
                <div className="text-center py-5">
                    <Spinner animation="border" variant="warning" />
                    <p className="mt-3">Loading shops...</p>
                </div>
            ) : error ? (
                <Alert variant="danger" className="text-center">
                    {error}
                </Alert>
            ) : filteredStores.length === 0 ? (
                <Alert variant="info" className="text-center">
                    No shops match your search criteria.
                </Alert>
            ) : (
                <Row xs={1} md={2} lg={3} className="g-4">
                    {filteredStores.map((shop, index) => (
                        <Col key={shop.id} className="d-flex">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                className="w-100" // Make motion.div take full width
                            >
                                <ShopCard shop={shop} className="h-100" />
                            </motion.div>
                        </Col>
                    ))}
                </Row>
            )}
        </motion.div>
    </Container>
</section>
        </div>
    );
}

export default ListStores;