import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { getCart,clearData } from '../../api/api.js'; // تأكد من استيراد clearData

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
  const [totalPrice, setTotalPrice] = useState(0);
  const [totalQuantity, setTotalQuantity] = useState(0);

  const API_KEY = 'ZXlKaGJHY2lPaUpJVXpVeE1pSXNJblI1Y0NJNklrcFhWQ0o5LmV5SmpiR0Z6Y3lJNklrMWxjbU5vWVc1MElpd2ljSEp2Wm1sc1pWOXdheUk2TVRBME16RTNNeXdpYm1GdFpTSTZJakUzTkRjMU56TXlNek11TlRjeE1EWWlmUS5IWjRaU0VPVFY2QjFWVDBCbWp3Q1VmT1hJQmxBVlhXQVNCVHYzN2FqRTBVNzFZN0xycGw0M2FfUUdZVHRPVXdHMFNtNkhuVkFCWVBnQllIenZUazRoUQ==';
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

  useEffect(() => {
    // Listen for payment success messages from iframe
    const handleMessage = async (event) => {
      if (event.origin !== 'https://accept.paymob.com') return;
      
      if (event.data === 'payment_success' || event.data.success) {
        setPaymentStatus('success');
        try {
          await clearData();
         
          // Optionally refresh cart data
          const response = await getCart();
          if (response.data) {
            setCartItems(response.data.items || []);
            setSubtotal(response.data.total_price || 0);
          }
        } catch (err) {
          console.error('Error clearing cart:', err);
          setError('Payment succeeded but failed to clear cart');
        }
      } else if (event.data === 'payment_failed') {
        setPaymentStatus('failed');
        setError('Payment failed. Please try again.');
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  const handlePaymentSuccess = async () => {
    try {
      await clearData(); // استدعاء clearData لمسح السلة
      setCartItems([]); // تصفير السلة
      setSubtotal(0); // تصفير الإجمالي
      setTotalPrice(0);
      setTotalQuantity(0);
     
    } catch (error) {
      console.error('Error clearing cart:', error);
      setError('Payment succeeded but failed to clear the cart.');
    }
  };

  const initiatePayment = async () => {
    if (!subtotal || isNaN(subtotal) || subtotal <= 0) {
      setError('Invalid product amount.');
      return;
    }

    if (cartItems.length === 0) {
      setError('Your cart is empty. Please add items before proceeding to payment.');
      return;
    }

    setLoading(true);
    setError('');
    setIframeUrl('');
    setPaymentStatus('');

    try {
      // Step 1: Authentication
      const authRes = await axios.post('https://accept.paymob.com/api/auth/tokens', {
        api_key: API_KEY,
      });
      const token = authRes.data.token;

      // Step 2: Create Order
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

      // Step 3: Payment Key
      const integrationId = paymentMethod === 'vodafone' ? INTEGRATION_ID_VODAFONE : INTEGRATION_ID_CARD;

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

      // Step 4: Handle Payment Method
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
          await handlePaymentSuccess(); // استدعاء handlePaymentSuccess عند نجاح الدفع
        } else {
          console.error('Vodafone Cash Error:', vodafoneRes.data);
          setError('Payment failed. Please try again.');
          setPaymentStatus('failed');
        }
      }
    } catch (err) {
      console.error('Payment Error:', err);
      setError(err.response?.data?.message || 'Failed to initiate payment. Please try again.');
      setPaymentStatus('failed');
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentStart = async () => {
    try {
      // استدعاء initiatePayment لإتمام الدفع
      await initiatePayment();

      // استدعاء clearData لمسح السلة بعد الدفع
      await clearData();

      // تحديث الحالة بعد مسح السلة
      setCartItems([]);
      setSubtotal(0);
      setTotalPrice(0);
      setTotalQuantity(0);

      
    } catch (error) {
      console.error('Error during payment or clearing cart:', error);
      setError('Payment succeeded but failed to clear the cart.');
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.header}>Payment</h2>
      
      {/* Cart Summary */}
      <div style={styles.cartSummary}>
        <h3 style={styles.subHeader}>Order Summary</h3>
        <div style={styles.cartItems}>
          {cartItems.map((item, index) => (
            <div key={index} style={styles.cartItem}>
              <img 
                src={item.image} 
                alt={item.name} 
                style={styles.productImage} 
              />
              <div style={styles.productDetails}>
                <p style={styles.productName}>{item.name}</p>
                <p style={styles.productPrice}>Price: {item.price} EGP</p>
                <p style={styles.productQuantity}>Quantity: {item.quantity}</p>
                <p style={styles.productTotal}>Total: {item.price * item.quantity} EGP</p>
              </div>
            </div>
          ))}
        </div>
        
        <div style={styles.summaryRow}>
          <span style={styles.summaryLabel}>Subtotal:</span>
          <span style={styles.summaryValue}>{subtotal} EGP</span>
        </div>
        <div style={styles.summaryRow}>
          <span style={styles.summaryLabel}>Total Quantity:</span>
          <span style={styles.summaryValue}>{totalQuantity}</span>
        </div>
      </div>

      {/* Payment Method Selection */}
      <div style={styles.paymentMethodSection}>
        <h3 style={styles.subHeader}>Payment Method</h3>
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
            Visa/MasterCard
          </label>
          <label style={{ ...styles.radioLabel, marginLeft: '20px' }}>
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

        {paymentMethod === 'vodafone' && (
          <div style={styles.vodafoneForm}>
            <p style={styles.label}>Vodafone Cash Phone Number:</p>
            <input
              type="text"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              style={styles.input}
              placeholder="Enter Vodafone Cash number"
            />
          </div>
        )}
      </div>

      {/* Payment Button */}
      <button 
        onClick={handlePaymentStart} 
        disabled={loading || cartItems.length === 0} 
        style={styles.button}
      >
        {loading ? 'Processing...' : `Pay ${subtotal} EGP`}
      </button>

      {/* Error and Status Messages */}
      {error && <p style={styles.error}>{error}</p>}
      {paymentStatus === 'pending' && paymentMethod === 'card' && (
        <p style={styles.info}>Please complete payment in the form below...</p>
      )}
      {paymentStatus === 'success' && (
        <p style={styles.success}>Payment successful! Your order has been placed.</p>
      )}

      {/* Payment Iframe */}
      {iframeUrl && paymentMethod === 'card' && (
        <iframe
          src={iframeUrl}
          title="Payment"
          style={styles.iframe}
          allowFullScreen
        ></iframe>
      )}
    </div>
  );
};

const styles = {
  container: {
    maxWidth: '800px',
    margin: '20px auto',
    padding: '25px',
    border: '1px solid #e0e0e0',
    borderRadius: '10px',
    backgroundColor: '#ffffff',
    boxShadow: '0 2px 15px rgba(0, 0, 0, 0.05)',
    fontFamily: 'Arial, sans-serif',
  },
  header: {
    textAlign: 'center',
    color: '#2c3e50',
    marginBottom: '25px',
    fontSize: '28px',
    fontWeight: '600',
  },
  subHeader: {
    color: '#34495e',
    marginBottom: '15px',
    fontSize: '20px',
    fontWeight: '500',
    borderBottom: '1px solid #eee',
    paddingBottom: '10px',
  },
  cartSummary: {
    marginBottom: '25px',
    padding: '15px',
    border: '1px solid #eee',
    borderRadius: '8px',
    backgroundColor: '#fafafa',
  },
  cartItems: {
    maxHeight: '300px',
    overflowY: 'auto',
    marginBottom: '15px',
  },
  cartItem: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '15px',
    padding: '12px',
    border: '1px solid #eee',
    borderRadius: '8px',
    backgroundColor: '#fff',
  },
  productImage: {
    width: '80px',
    height: '80px',
    objectFit: 'cover',
    borderRadius: '6px',
    marginRight: '15px',
    border: '1px solid #ddd',
  },
  productDetails: {
    flex: 1,
  },
  productName: {
    fontSize: '16px',
    fontWeight: 'bold',
    color: '#333',
    marginBottom: '5px',
  },
  productPrice: {
    fontSize: '14px',
    color: '#666',
    marginBottom: '3px',
  },
  productQuantity: {
    fontSize: '14px',
    color: '#666',
    marginBottom: '3px',
  },
  productTotal: {
    fontSize: '14px',
    color: '#2c3e50',
    fontWeight: 'bold',
  },
  summaryRow: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '8px',
    padding: '8px 0',
    borderTop: '1px dashed #ddd',
  },
  summaryLabel: {
    fontWeight: 'bold',
    color: '#555',
  },
  summaryValue: {
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  paymentMethodSection: {
    marginBottom: '25px',
    padding: '15px',
    border: '1px solid #eee',
    borderRadius: '8px',
    backgroundColor: '#fafafa',
  },
  formGroup: {
    marginBottom: '15px',
    display: 'flex',
    alignItems: 'center',
  },
  label: {
    display: 'block',
    marginBottom: '8px',
    fontWeight: '500',
    color: '#555',
  },
  input: {
    width: '100%',
    padding: '12px',
    border: '1px solid #ddd',
    borderRadius: '6px',
    fontSize: '16px',
    marginBottom: '15px',
  },
  radioLabel: {
    fontSize: '16px',
    color: '#555',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
  },
  radioInput: {
    marginRight: '8px',
    width: '18px',
    height: '18px',
  },
  vodafoneForm: {
    marginTop: '15px',
    padding: '15px',
    border: '1px solid #eee',
    borderRadius: '8px',
    backgroundColor: '#fff',
  },
  button: {
    width: '100%',
    padding: '15px',
    backgroundColor: '#3498db',
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
    fontSize: '18px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'background-color 0.3s',
    marginBottom: '20px',
  },
  buttonDisabled: {
    backgroundColor: '#95a5a6',
    cursor: 'not-allowed',
  },
  error: {
    color: '#e74c3c',
    marginTop: '15px',
    padding: '12px',
    backgroundColor: '#fdecea',
    borderRadius: '6px',
    borderLeft: '4px solid #e74c3c',
  },
  info: {
    color: '#3498db',
    marginTop: '15px',
    padding: '12px',
    backgroundColor: '#ebf5fb',
    borderRadius: '6px',
    borderLeft: '4px solid #3498db',
  },
  success: {
    color: '#27ae60',
    marginTop: '15px',
    padding: '12px',
    backgroundColor: '#e8f8f0',
    borderRadius: '6px',
    borderLeft: '4px solid #27ae60',
  },
  iframe: {
    width: '100%',
    height: '650px',
    border: 'none',
    marginTop: '20px',
    borderRadius: '8px',
    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
  },
};

export default Payment;