import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Payment = () => {
  const [iframeUrl, setIframeUrl] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [paymentStatus, setPaymentStatus] = useState('pending');

  const API_KEY = 'ZXlKaGJHY2lPaUpJVXpVeE1pSXNJblI1Y0NJNklrcFhWQ0o5LmV5SmpiR0Z6Y3lJNklrMWxjbU5vWVc1MElpd2ljSEp2Wm1sc1pWOXdheUk2TVRBME16RTNNeXdpYm1GdFpTSTZJakUzTkRjeE16QTFORFl1TWpNMk5qY3lJbjAuZGZaT2hyMGVXcFV0Vlh5ZjVLTWFuam5aOHdkUjVmbnhtMUFBa0wzbnotdlItdVJLNW5LSlJMRjR2LWZwU0pBNkhGckpOakVHUm1SV0pTTTBQcnRMQnc='; // Replace with your API key
  const INTEGRATION_ID = 5085520;
  const IFRAME_ID = 920500;

  useEffect(() => {
    const initiatePayment = async () => {
      try {
        // 1. AUTH
        const authRes = await axios.post('https://accept.paymob.com/api/auth/tokens', {
          api_key: API_KEY,
        });
        const token = authRes.data.token;

        // 2. ORDER
        const orderRes = await axios.post('https://accept.paymob.com/api/ecommerce/orders', {
          auth_token: token,
          delivery_needed: false,
          amount_cents: 10000,
          currency: 'EGP',
          items: [],
        });
        const orderId = orderRes.data.id;

        // 3. PAYMENT TOKEN
        const paymentRes = await axios.post('https://accept.paymob.com/api/acceptance/payment_keys', {
          auth_token: token,
          amount_cents: 10000,
          expiration: 3600,
          order_id: orderId,
          billing_data: {
            apartment: '803',
            email: 'test@example.com',
            floor: '42',
            first_name: 'Reem',
            street: 'Corniche',
            building: '8028',
            phone_number: '+201234567890',
            shipping_method: 'PKG',
            postal_code: '01898',
            city: 'Cairo',
            country: 'EG',
            last_name: 'Mahmoud',
            state: 'CAIRO',
          },
          currency: 'EGP',
          integration_id: INTEGRATION_ID,
          lock_order_when_paid: 'false',
        });

        const paymentToken = paymentRes.data.token;
        setIframeUrl(`https://accept.paymob.com/api/acceptance/iframes/${IFRAME_ID}?payment_token=${paymentToken}`);

        pollPaymentStatus(orderId, token);
      } catch (err) {
        console.error('Error:', err);
        setError(' Failed to initiate payment');
      } finally {
        setLoading(false);
      }
    };

    const pollPaymentStatus = (orderId, token) => {
      const interval = setInterval(async () => {
        try {
          const response = await axios.get(`https://accept.paymob.com/api/ecommerce/orders/${orderId}`, {
            headers: {
              Authorization: token, 
            },
          });

          
          if (response.data.payment_attempts) {
            const paymentAttempts = response.data.payment_attempts;

            
            const isSuccess = paymentAttempts.some((attempt) => attempt.success === true);

            if (isSuccess) {
              setPaymentStatus('success');
              clearInterval(interval); 

            
              await updatePaymentStatusInDatabase(orderId);
            }
          } else {
            console.warn('No payment attempts data available');
          }
        } catch (err) {
          console.warn('Polling Error:', err);
        }
      }, 5000);

      
      return () => clearInterval(interval);
    };

    
    const updatePaymentStatusInDatabase = async (orderId) => {
      try {
        await axios.put('/api/update-payment-status', {
          orderId: orderId,
          status: 'success', 
        });
        console.log('Payment status updated to success in the database');
      } catch (error) {
        console.error('Error updating payment status:', error);
      }
    };

    initiatePayment();
  }, []);

  return (
    <div>
      <h2>Payment</h2>
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p>{error}</p>
      ) : (
        <iframe
          src={iframeUrl}
          title="Payment"
          style={{ width: '100%', height: '600px', border: 'none' }}
        ></iframe>
      )}
      <p>Status: {paymentStatus}</p>
    </div>
  );
};

export default Payment;
