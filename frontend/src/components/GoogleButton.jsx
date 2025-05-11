// components/GoogleLoginButton.jsx
import { GoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

const GoogleLoginButton = ({ onSuccess, onError, buttonText = "Continue with Google", redirectTo = "/dashboard" }) => {
  const navigate = useNavigate();

  const showSuccessAlert = (message) => {
    Swal.fire({
      title: 'Success!',
      text: message,
      icon: 'success',
      confirmButtonText: 'Continue',
      timer: 3000,
      timerProgressBar: true,
    });
  };

  const showErrorAlert = (message) => {
    Swal.fire({
      title: 'Error!',
      text: message,
      icon: 'error',
      confirmButtonText: 'Try Again',
    });
  };

  const handleSuccess = async (credentialResponse) => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}/api/auth/google/`,
        { token: credentialResponse.credential },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      // Store tokens
      localStorage.setItem('access_token', response.data.access);
      localStorage.setItem('refresh_token', response.data.refresh);

      // Store user data if available
      if (response.data.user) {
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }

      // Show success alert
      showSuccessAlert('Logged in successfully!');

      // Call success callback if provided
      if (onSuccess) {
        onSuccess(response.data);
      }

      // Redirect user
      navigate(redirectTo);

    } catch (error) {
      console.error('Google login error:', error);
      
      // Determine error message
      const errorMessage = error.response?.data?.message || 
                          error.response?.data?.detail || 
                          'Google login failed. Please try again.';

      // Show error alert
      showErrorAlert(errorMessage);

      // Call error callback if provided
      if (onError) {
        onError(error);
      }
    }
  };

  return (
    <div className="google-login-wrapper" style={{ margin: '10px 0' }}>
      <GoogleLogin
        onSuccess={handleSuccess}
        onError={() => {
          const error = new Error('Google authentication failed');
          console.error(error);
          showErrorAlert('Google authentication failed. Please try again.');
          if (onError) {
            onError(error);
          }
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