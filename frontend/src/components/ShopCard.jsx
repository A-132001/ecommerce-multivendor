import React from 'react';

function ShopCard({ shop }) {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <img src={shop.image} alt={shop.name} className="w-full h-48 object-cover" />
      <div className="p-4">
        <h3 className="text-xl font-semibold mb-2">{shop.name}</h3>
        <p className="text-gray-600 text-sm">{shop.description}</p>
      </div>
    </div>
  );
}

export default ShopCard;
