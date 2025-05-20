import { GoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

const GoogleLoginButton = ({
  onSuccess,
  onError,
  buttonText = "Continue with Google",
  redirectTo = "/"
}) => {
  const navigate = useNavigate();

  const showAlert = (title, message, icon) => {
    Swal.fire({ title, text: message, icon, confirmButtonText: 'OK' });
  };

  const handleSuccess = async (credentialResponse) => {
    try {
      const { data } = await axios.post(
        'http://localhost:8000/api/auth/google/', // << هنا حطيت الـ API URL مباشرة
        { id_token: credentialResponse.credential },
        { headers: { 'Content-Type': 'application/json' } }
      );

      localStorage.setItem('access_token', data.access);
      localStorage.setItem('refresh_token', data.refresh);
      localStorage.setItem('user', JSON.stringify(data.user));

      showAlert('Success!', 'Logged in successfully.', 'success');

      if (onSuccess) onSuccess(data);
      navigate(redirectTo);
      window.location.reload();
    } catch (err) {
      console.error(err);
      const msg = err.response?.data?.error || 'Google login failed.';
      showAlert('Error!', msg, 'error');
      if (onError) onError(err);
    }
  };

  return (
    <div style={{ margin: '1rem 0' }}>
      <GoogleLogin
        onSuccess={handleSuccess}
        onError={() => {
          const error = new Error('Google authentication failed');
          showAlert('Error!', error.message, 'error');
          if (onError) onError(error);
        }}
        text={buttonText}
        shape="rectangular"
      />
    </div>
  );
};

GoogleLoginButton.propTypes = {
  onSuccess: PropTypes.func,
  onError: PropTypes.func,
  buttonText: PropTypes.string,
  redirectTo: PropTypes.string,
};

export default GoogleLoginButton;
