import React from 'react';
import { Carousel } from 'react-responsive-carousel';
import "react-responsive-carousel/lib/styles/carousel.min.css";

export default function ProductInfo({ product }) {
  return (
    <div style={{ marginBottom: '20px' }}>
      <Carousel showThumbs={false} infiniteLoop autoPlay>
  {product.images.map((img, i) => (
    <div key={i}>
      <img 
        src={img} 
        alt={`${product.name}-${i}`} 
        style={{ width: "300px", height: "300px", margin: "0 auto" }}
      />
    </div>
  ))}
</Carousel>

      <h2>{product.name}</h2>
      <p>{product.description}</p>
      <p><strong>Price:</strong> {product.price}</p>
    </div>
  );
}
