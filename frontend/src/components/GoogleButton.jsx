// components/GoogleLoginButton.jsx
import { GoogleLogin } from '@react-oauth/google';
import axios from 'axios';

const GoogleLoginButton = () => {
  const handleSuccess = async (credentialResponse) => {
    try {
      const res = await axios.post('http://localhost:8000/api/auth/google/', {
        token: credentialResponse.credential,
      });
      localStorage.setItem('access_token', res.data.access);
      localStorage.setItem('refresh_token', res.data.refresh);
      alert('Logged in with Google ✅');
    } catch (err) {
      console.error(err);
      alert('Google login failed ❌');
    }
  };

  return (
    <GoogleLogin
      onSuccess={handleSuccess}
      onError={() => {
        console.log('Login Failed');
      }}
    />
  );
};

export default GoogleLoginButton;
