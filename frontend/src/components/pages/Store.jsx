import React from 'react';
import { useParams } from 'react-router-dom';

function Store() {
  const { id } = useParams();
  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <h2 className="text-3xl font-bold">Store Page</h2>
      <p className="text-gray-600 mt-4">This will show details for store ID: {id}</p>
    </div>
  );
}

export default Store;
