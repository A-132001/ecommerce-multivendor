import React from "react";
import { listStores, listCategories } from "../../api/api";
import { Container, Row, Col, Spinner, Alert } from "react-bootstrap";
import { motion } from "framer-motion";
import ShopCard from "../ShopCard";
import StoresHero from "../listStoresComponents/StoresHero";
import StoresFilter from "../listStoresComponents/StoresFilter";
import FeaturedCategories from "../listStoresComponents/FeaturedCategories";

const ListStores = () => {
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);
  const [stores, setStores] = React.useState([]);
  const [filteredStores, setFilteredStores] = React.useState([]);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [categories, setCategories] = React.useState([]);
  const [selectedCategory, setSelectedCategory] = React.useState("");

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [storesRes, categoriesRes] = await Promise.all([
          listStores(),
          listCategories()
        ]);
        
        setStores(storesRes.data);
        setFilteredStores(storesRes.data);
        setCategories(categoriesRes.data?.results || categoriesRes.data || []);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError(
          error.response
            ? error.response.data.detail || "An error occurred."
            : "Error fetching data. Please try again later."
        );
        setCategories([]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  React.useEffect(() => {
    const results = stores.filter(store => {
      const matchesSearch = store.store_name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory ?
            store.categories.toString() === selectedCategory.toString()
          : true;
      return matchesSearch && matchesCategory;
    });
    setFilteredStores(results);
  }, [searchQuery, selectedCategory, stores]);

  return (
    <div className="stores-page">
      <StoresHero />

      <section className="py-5 bg-white">
        <Container>
          <StoresFilter
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            categories={categories}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
          />
          <FeaturedCategories 
            categories={categories}
            loading={loading}
            />
        </Container>
      </section>

      <section className="py-5 bg-light">
        <Container>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-center mb-5 display-5 fw-bold">
              All Active Vendors
            </h2>

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
                      className="w-100"
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
};

export default ListStores;