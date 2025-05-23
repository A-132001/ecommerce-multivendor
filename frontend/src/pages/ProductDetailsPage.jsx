import React from 'react';
import { useParams } from 'react-router-dom';
import ProductInfo from '../components/product/ProductInfo';
// import AddToCart from '../components/product/AddToCart';
import ReviewSection from '../components/product/ReviewSection';
import RelatedProducts from '../components/product/RelatedProducts';
import { useLocation } from 'react-router-dom';
export default function ProductDetailsPage() {
   const location = useLocation();
  const product = location.state?.product;

  const { product_id } = useParams();


  if (!product) return <p>Product not found</p>;

  return (
    <div style={{ padding: '20px' }}>
      <ProductInfo product={product} />
      {/* <AddToCart product={product} /> */}
      {/* <ReviewSection productId={product.id} /> */}
      {/* <RelatedProducts currentProduct={product} /> */}
    </div>
  );
}
