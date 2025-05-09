import React from 'react';

function Hero() {
  return (
    <section className="bg-blue-600 text-white py-20">
      <div className="container mx-auto px-4 text-center">
        <h1 className="text-4xl font-bold mb-4">Welcome to MyShop</h1>
        <p className="text-lg mb-6">Discover amazing stores and products from multiple vendors.</p>
        <a href="#stores" className="bg-white text-blue-600 px-6 py-2 rounded-full font-semibold">Browse Stores</a>
      </div>
    </section>
  );
}

export default Hero;
