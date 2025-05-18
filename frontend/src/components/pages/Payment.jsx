import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { getCart, clearCart } from '../../api/api.js'; 

const Payment = () => {
  const [iframeUrl, setIframeUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [paymentStatus, setPaymentStatus] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [phoneNumber, setPhoneNumber] = useState('01095292482');
  const [cartItems, setCartItems] = useState([]);
  const [subtotal, setSubtotal] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);
  const [totalQuantity, setTotalQuantity] = useState(0);

  const API_KEY = 'ZXlKaGJHY2lPaUpJVXpVeE1pSXNJblI1Y0NJNklrcFhWQ0o5LmV5SmpiR0Z6Y3lJNklrMWxjbU5vWVc1MElpd2ljSEp2Wm1sc1pWOXdheUk2TVRBME16RTNNeXdpYm1GdFpTSTZJakUzTkRjeU16QTFOek11TlRBd09ERTJJbjAueU5TcmZ4Y1JveVFIckNhWERfY2h4VEZrdmxSTDBZTUVPSVE3UldHTzd5cmFPTmRVTG5QY0xNOUlNbktKYjV1ckV5Y3VhT0pEcExlWEk5ZkF3R0JIcUE='; 
  const INTEGRATION_ID_CARD = 5085520;
  const INTEGRATION_ID_VODAFONE = 5089329;
  const IFRAME_ID = 920499;

  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        const response = await getCart();
        console.log('Cart response:', response);

        if (response.data) {
          if (response.data.items) {
            const formattedItems = response.data.items.map(item => ({
              product: item.product.id,
              vendor: item.product.vendor,
              quantity: item.quantity,
              price: item.product.price,
              name: item.product.name,
              image: item.product.image,
            }));

            setCartItems(formattedItems);

            const total = formattedItems.reduce(
              (sum, item) => sum + item.price * item.quantity,
              0
            );
            setSubtotal(total);
          }

          if (response.data.total_price) {
            setTotalPrice(response.data.total_price);
          }
          if (response.data.total_quantity) {
            setTotalQuantity(response.data.total_quantity);
          }
        }
      } catch (error) {
        console.error('Error fetching cart items:', error);
        setError('Failed to load cart items');
      }
    };

    fetchCartItems();
  }, []);

  const resetCartData = async () => {
    try {
      setCartItems([]);
      setSubtotal(0);
      setTotalPrice(0);
      setTotalQuantity(0);
      await clearCart();
      console.log('Cart has been reset successfully');
    } catch (err) {
      console.error('Error resetting cart:', err);
      setError('Failed to reset cart data');
    }
  };

  useEffect(() => {
    if (paymentStatus === 'success') {
      resetCartData();
    }
  }, [paymentStatus]);

  const startPaymentStatusCheck = async (orderId, authToken) => {
    const checkStatus = async () => {
      try {
        const response = await axios.get(
          `https://accept.paymob.com/api/ecommerce/orders/${orderId}/transactions`,
          {
            headers: {
              'Authorization': `Bearer ${authToken}`
            }
          }
        );
        
        const transactions = response.data;
        const successfulPayment = transactions.find(
          txn => txn.success && txn.pending === false
        );
        
        if (successfulPayment) {
          setPaymentStatus('success');
          alert('Payment completed successfully!');
          clearInterval(intervalId);
        }
      } catch (error) {
        console.error('Error checking payment status:', error);
      }
    };

    const intervalId = setInterval(checkStatus, 5000);
    
    setTimeout(() => {
      clearInterval(intervalId);
      if (paymentStatus !== 'success') {
        setError('Payment processing timeout');
      }
    }, 900000);
    
    return intervalId;
  };

  const initiatePayment = async () => {
    if (!subtotal || isNaN(subtotal) || subtotal <= 0) {
      setError('Invalid product amount.');
      return;
    }

    setLoading(true);
    setError('');
    setIframeUrl('');
    setPaymentStatus('');

    try {
      const authRes = await axios.post('https://accept.paymob.com/api/auth/tokens', {
        api_key: API_KEY,
      });
      const token = authRes.data.token;

      const orderRes = await axios.post('https://accept.paymob.com/api/ecommerce/orders', {
        auth_token: token,
        delivery_needed: false,
        amount_cents: subtotal * 100,
        currency: 'EGP',
        items: cartItems.map(item => ({
          name: item.name,
          amount_cents: item.price * 100,
          quantity: item.quantity,
        })),
      });
      const orderId = orderRes.data.id;

      const integrationId = paymentMethod === 'vodafone'
        ? INTEGRATION_ID_VODAFONE
        : INTEGRATION_ID_CARD;

      const paymentRes = await axios.post('https://accept.paymob.com/api/acceptance/payment_keys', {
        auth_token: token,
        amount_cents: subtotal * 100,
        expiration: 3600,
        order_id: orderId,
        billing_data: {
          apartment: '803',
          email: 'test@example.com',
          floor: '42',
          first_name: 'Reem',
          street: 'Corniche',
          building: '8028',
          phone_number: phoneNumber,
          shipping_method: 'PKG',
          postal_code: '01898',
          city: 'Cairo',
          country: 'EG',
          last_name: 'Mahmoud',
          state: 'CAIRO',
        },
        currency: 'EGP',
        integration_id: integrationId,
        lock_order_when_paid: 'false',
      });

      const paymentToken = paymentRes.data.token;

      if (paymentMethod === 'card') {
        setIframeUrl(`https://accept.paymob.com/api/acceptance/iframes/${IFRAME_ID}?payment_token=${paymentToken}`);
        setPaymentStatus('pending');
        startPaymentStatusCheck(orderId, token);
      } else if (paymentMethod === 'vodafone') {
        const vodafoneRes = await axios.post(
          'https://accept.paymob.com/api/acceptance/payments/pay',
          {
            source: {
              identifier: phoneNumber,
              subtype: 'WALLET',
            },
            payment_token: paymentToken,
          }
        );

        if (vodafoneRes.data.success) {
          setPaymentStatus('success');
          alert('Payment successful! Your cart has been cleared.');
        } else {
          console.error('Vodafone Cash Error:', vodafoneRes.data);
          setError('Payment failed. Please try again.');
        }
      }
    } catch (err) {
      console.error('Error:', err.response?.data || err.message);
      setError('Payment failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentSuccess = () => {
    setPaymentStatus('success');
  };

  useEffect(() => {
    const handleMessage = (event) => {
      if (event.origin !== 'https://accept.paymob.com') return;

      if (event.data === 'payment_success') {
        handlePaymentSuccess();
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  return (
    <div style={styles.container}>
      <h2 style={styles.header}>Checkout</h2>
      <div style={styles.summary}>
        <p style={styles.label}>Subtotal: {subtotal} EGP</p>
        <p style={styles.label}>Total: {totalPrice} EGP</p>
        <p style={styles.label}>Items: {totalQuantity}</p>
      </div>

      <div style={styles.paymentMethods}>
        <h3 style={styles.subHeader}>Select Payment Method</h3>
        <div style={styles.formGroup}>
          <label style={styles.radioLabel}>
            <input
              type="radio"
              name="paymentMethod"
              value="card"
              checked={paymentMethod === 'card'}
              onChange={() => setPaymentMethod('card')}
              style={styles.radioInput}
            />
            Credit/Debit Card
          </label>
          <label style={styles.radioLabel}>
            <input
              type="radio"
              name="paymentMethod"
              value="vodafone"
              checked={paymentMethod === 'vodafone'}
              onChange={() => setPaymentMethod('vodafone')}
              style={styles.radioInput}
            />
            Vodafone Cash
          </label>
        </div>
      </div>

      {paymentMethod === 'vodafone' && (
        <div style={styles.vodafoneForm}>
          <h3 style={styles.subHeader}>Vodafone Cash Payment</h3>
          <p style={styles.label}>Phone Number: {phoneNumber}</p>
          <button
            onClick={initiatePayment}
            disabled={loading}
            style={styles.button}
          >
            {loading ? 'Processing...' : 'Pay Now'}
          </button>
        </div>
      )}

      {paymentMethod === 'card' && (
        <>
          <button
            onClick={initiatePayment}
            disabled={loading}
            style={styles.button}
          >
            {loading ? 'Processing...' : 'Start Payment'}
          </button>
          {iframeUrl && (
            <iframe
              src={iframeUrl}
              title="Payment"
              style={styles.iframe}
              onLoad={() => console.log('Payment iframe loaded')}
            ></iframe>
          )}
        </>
      )}

      {error && <p style={styles.error}>{error}</p>}
      {paymentStatus && (
        <p style={paymentStatus === 'success' ? styles.success : styles.status}>
          Status: {paymentStatus === 'success' ? 'Payment Successful' : paymentStatus}
        </p>
      )}
    </div>
  );
};

const styles = {
  container: {
    maxWidth: '600px',
    margin: '20px auto',
    padding: '25px',
    border: '1px solid #ddd',
    borderRadius: '10px',
    backgroundColor: '#f9f9f9',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
    fontFamily: 'Arial, sans-serif',
  },
  header: {
    textAlign: 'center',
    color: '#2c3e50',
    marginBottom: '25px',
    fontSize: '28px',
  },
  subHeader: {
    textAlign: 'center',
    color: '#34495e',
    marginBottom: '20px',
    fontSize: '20px',
  },
  summary: {
    backgroundColor: '#fff',
    padding: '15px',
    borderRadius: '8px',
    marginBottom: '20px',
    border: '1px solid #eee',
  },
  paymentMethods: {
    backgroundColor: '#fff',
    padding: '20px',
    borderRadius: '8px',
    marginBottom: '20px',
    border: '1px solid #eee',
  },
  label: {
    display: 'block',
    marginBottom: '8px',
    fontWeight: 'bold',
    color: '#555',
    fontSize: '16px',
  },
  formGroup: {
    marginBottom: '15px',
    display: 'flex',
    justifyContent: 'center',
    gap: '30px',
  },
  radioLabel: {
    fontSize: '16px',
    color: '#555',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
  },
  radioInput: {
    marginLeft: '8px',
  },
  button: {
    width: '100%',
    padding: '12px',
    backgroundColor: '#3498db',
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
    fontSize: '18px',
    cursor: 'pointer',
    marginTop: '15px',
    transition: 'background-color 0.3s',
  },
  error: {
    color: '#e74c3c',
    marginTop: '15px',
    textAlign: 'center',
    padding: '10px',
    backgroundColor: '#fdecea',
    borderRadius: '6px',
    fontSize: '16px',
  },
  success: {
    color: '#27ae60',
    marginTop: '15px',
    textAlign: 'center',
    padding: '10px',
    backgroundColor: '#e8f5e9',
    borderRadius: '6px',
    fontSize: '16px',
  },
  status: {
    color: '#f39c12',
    marginTop: '15px',
    textAlign: 'center',
    padding: '10px',
    backgroundColor: '#fff9e6',
    borderRadius: '6px',
    fontSize: '16px',
  },
  iframe: {
    width: '100%',
    height: '650px',
    border: 'none',
    marginTop: '20px',
    borderRadius: '8px',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
  },
  vodafoneForm: {
    marginTop: '20px',
    padding: '20px',
    border: '1px solid #ddd',
    borderRadius: '8px',
    backgroundColor: '#fff',
  },
};

export default Payment;