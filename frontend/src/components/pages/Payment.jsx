import React, { useState } from 'react';
import axios from 'axios';

const Payment = () => {
  const [iframeUrl, setIframeUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [paymentStatus, setPaymentStatus] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [phoneNumber, setPhoneNumber] = useState('01095292482'); 

  const API_KEY = 'ZXlKaGJHY2lPaUpJVXpVeE1pSXNJblI1Y0NJNklrcFhWQ0o5LmV5SmpiR0Z6Y3lJNklrMWxjbU5vWVc1MElpd2ljSEp2Wm1sc1pWOXdheUk2TVRBME16RTNNeXdpYm1GdFpTSTZJakUzTkRjeU16QTFOek11TlRBd09ERTJJbjAueU5TcmZ4Y1JveVFIckNhWERfY2h4VEZrdmxSTDBZTUVPSVE3UldHTzd5cmFPTmRVTG5QY0xNOUlNbktKYjV1ckV5Y3VhT0pEcExlWEk5ZkF3R0JIcUE='; // Replace with your API key
  const INTEGRATION_ID_CARD = 5085520; 
  const INTEGRATION_ID_VODAFONE = 5089329; 
  const IFRAME_ID = 920499;

  const productAmount = 100; 

  const initiatePayment = async () => {
    if (!productAmount || isNaN(productAmount) || productAmount <= 0) {
      setError(' Invalid product amount.');
      return;
    }

    setLoading(true);
    setError('');
    setIframeUrl('');
    setPaymentStatus('');

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
        amount_cents: productAmount * 100, 
        currency: 'EGP',
        items: [],
      });
      const orderId = orderRes.data.id;

      // 3. PAYMENT TOKEN
      const integrationId =
        paymentMethod === 'vodafone' ? INTEGRATION_ID_VODAFONE : INTEGRATION_ID_CARD;

      const paymentRes = await axios.post('https://accept.paymob.com/api/acceptance/payment_keys', {
        auth_token: token,
        amount_cents: productAmount * 100, 
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
        // 4. SET IFRAME URL 
        setIframeUrl(`https://accept.paymob.com/api/acceptance/iframes/${IFRAME_ID}?payment_token=${paymentToken}`);
        setPaymentStatus('pending');
      } else if (paymentMethod === 'vodafone') {
        // 4. SEND PAYMENT 
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
          alert(' Payment successful!');
        } else {
          console.error('Vodafone Cash Error:', vodafoneRes.data);
          setError('Payment failed. Please try again.');
        }
      }
    } catch (err) {
      console.error('Error:', err);
      setError(' Failed to initiate payment.');
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentStart = () => {
    initiatePayment();
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.header}>Payment</h2>
      <p style={styles.label}>Amount to Pay: {productAmount} EGP</p>
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
          <h3 style={styles.subHeader}>Vodafone Cash Payment</h3>
          <p style={styles.label}>Vodafone Cash Phone Number: {phoneNumber}</p>
          <button onClick={handlePaymentStart} disabled={loading} style={styles.button}>
            {loading ? 'Processing...' : 'Pay Now'}
          </button>
        </div>
      )}
      {paymentMethod === 'card' && (
        <button onClick={handlePaymentStart} disabled={loading} style={styles.button}>
          {loading ? 'Processing...' : 'Start Payment'}
        </button>
      )}
      {error && <p style={styles.error}>{error}</p>}
      {iframeUrl && paymentMethod === 'card' && (
        <iframe
          src={iframeUrl}
          title="Payment"
          style={styles.iframe}
        ></iframe>
      )}
      <p style={styles.status}>Status: {paymentStatus}</p>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: '600px',
    margin: '0 auto',
    padding: '20px',
    border: '1px solid #ddd',
    borderRadius: '8px',
    backgroundColor: '#f9f9f9',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    fontFamily: 'Arial, sans-serif',
  },
  header: {
    textAlign: 'center',
    color: '#333',
    marginBottom: '20px',
  },
  subHeader: {
    textAlign: 'center',
    color: '#555',
    marginBottom: '15px',
  },
  formGroup: {
    marginBottom: '15px',
  },
  label: {
    display: 'block',
    marginBottom: '5px',
    fontWeight: 'bold',
    color: '#555',
  },
  input: {
    width: '100%',
    padding: '10px',
    border: '1px solid #ccc',
    borderRadius: '4px',
    fontSize: '16px',
  },
  radioLabel: {
    fontSize: '16px',
    color: '#555',
    cursor: 'pointer',
  },
  radioInput: {
    marginRight: '10px',
  },
  button: {
    width: '100%',
    padding: '10px',
    backgroundColor: '#007bff',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    fontSize: '16px',
    cursor: 'pointer',
  },
  error: {
    color: 'red',
    marginTop: '10px',
  },
  iframe: {
    width: '100%',
    height: '600px',
    border: 'none',
    marginTop: '20px',
  },
  status: {
    marginTop: '20px',
    textAlign: 'center',
    fontSize: '16px',
    color: '#555',
  },
  vodafoneForm: {
    marginTop: '20px',
    padding: '15px',
    border: '1px solid #ddd',
    borderRadius: '8px',
    backgroundColor: '#fff',
  },
};

export default Payment;
