import React from 'react';
import { useParams } from 'react-router-dom';
import { products } from '../data/TestData';
import ProductInfo from '../components/product/ProductInfo';
import AddToCart from '../components/product/AddToCart';
import ReviewSection from '../components/product/ReviewSection';
import RelatedProducts from '../components/product/RelatedProducts';

export default function ProductDetailsPage() {
  const { product_id } = useParams();
  const product = products.find(p => p.id === Number(product_id));

  if (!product) return <p>Product not found</p>;

  return (
    <div style={{ padding: '20px' }}>
      <ProductInfo product={product} />
      <AddToCart product={product} />
      <ReviewSection productId={product.id} />
      <RelatedProducts currentProduct={product} />
    </div>
  );
}
