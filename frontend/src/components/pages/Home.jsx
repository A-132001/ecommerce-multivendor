import React from 'react';
import Hero from '../Hero';
import ShopCard from '../ShopCard';
import Footer from '../Footer';

 
function Home() {
  // Mock static data for shops
  const shops = [
    { id: 1, name: 'Vintage Boutique', description: 'A stylish boutique for trendy fashion.', image: 'https://via.placeholder.com/400x300?text=Vintage+Boutique' },
    { id: 2, name: 'Electronics Hub', description: 'Your one-stop shop for the latest gadgets.', image: 'https://via.placeholder.com/400x300?text=Electronics+Hub' },
    { id: 3, name: 'Organic Foods', description: 'Fresh, organic produce and groceries.', image: 'https://via.placeholder.com/400x300?text=Organic+Foods' },
    { id: 4, name: 'Pet Paradise', description: 'Everything for your furry friends.', image: 'https://via.placeholder.com/400x300?text=Pet+Paradise' },
    { id: 5, name: 'Artisan Crafts', description: 'Handmade crafts and gifts by local artists.', image: 'https://via.placeholder.com/400x300?text=Artisan+Crafts' },
    { id: 6, name: 'Sports Gear', description: 'All the equipment you need to stay active.', image: 'https://via.placeholder.com/400x300?text=Sports+Gear' },
  ];

  return (
    <div>
      {/* Hero Section */}
      <Hero />
      {/* Shop Cards Grid */}
      <section id="stores" className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold mb-6">Featured Shops</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {shops.map((shop) => (
              <ShopCard key={shop.id} shop={shop} />
            ))}
          </div>
        </div>
      </section>
      {/* Footer Section */}
      <Footer />
    </div>
  );
}

export default Home;
