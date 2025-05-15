import React from 'react';
import { Card, Button } from 'react-bootstrap';
import { FaStore, FaArrowRight } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

function ShopCard({ shop }) {
  const navigate = useNavigate();
  const handleVisitShop = (shop) => {
    navigate(`/store/${shop.id}`, { state: { shop } });
  };

  return (
    <Card className="h-100 d-flex flex-column shadow-sm border-0 overflow-hidden">
      <div className="ratio ratio-16x9 bg-light">
        <Card.Img
          variant="top"
          src={shop.store_logo || 'https://img.freepik.com/free-vector/online-shopping-concept-illustration_114360-1084.jpg'}
          alt={shop.store_name}
          className="object-fit-cover"
        />
      </div>

      <Card.Body className="d-flex flex-column">
        <div className="mb-3">
          <div className="d-flex align-items-center mb-2">
            <FaStore className="text-warning me-2" />
            <Card.Title className="mb-0 fs-5 fw-bold">{shop.store_name}</Card.Title>
          </div>
          <Card.Text className="text-muted small">
            {shop.store_description || 'Explore our collection of quality products'}
          </Card.Text>
        </div>

        <Button
          variant="outline-warning"
          className="mt-auto align-self-start d-flex align-items-center"
          onClick={() => handleVisitShop(shop)}
        >
          Visit Shop <FaArrowRight className="ms-2" />
        </Button>
      </Card.Body>
    </Card>
  );
}

export default ShopCard;
