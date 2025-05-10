import { Navbar, Container, Nav, NavDropdown, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import { FaShoppingCart, FaUser, FaSignInAlt, FaUserPlus, FaSignOutAlt } from 'react-icons/fa';
import '@fortawesome/fontawesome-free/css/all.min.css';

function Navigation({ isAuthenticated, user, logout }) {
  const handleLogout = () => {
    Swal.fire({
      title: 'Logout Confirmation',
      text: 'Are you sure you want to logout?',
      icon: 'question',
      background: '#343a40',
      color: '#f8f9fa',
      showCancelButton: true,
      confirmButtonColor: '#dc3545',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Yes, logout',
      cancelButtonText: 'Cancel'
    }).then((result) => {
      if (result.isConfirmed) {
        logout();
        Swal.fire({
          title: 'Logged Out',
          text: 'You have been successfully logged out',
          icon: 'success',
          background: '#343a40',
          color: '#f8f9fa',
          timer: 2000
        });
      }
    });
  };

  return (
    <Navbar bg="dark" variant="dark" expand="lg" className="shadow mb-4">
      <Container>
        <Navbar.Brand as={Link} to="/" className="fw-bold text-white">
          <i className="fas fa-shopping-bag me-2"></i>
          E-Commerce
        </Navbar.Brand>
        
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        
        <Navbar.Collapse id="basic-navbar-nav" className="justify-content-end">
          <Nav>
            {isAuthenticated ? (
              <>
                <Nav.Link as={Link} to="/cart" className="text-white me-3">
                  <FaShoppingCart className="me-1" />
                  Cart
                </Nav.Link>
                
                <Navbar.Text className="text-light me-3 d-none d-lg-flex align-items-center">
                  <FaUser className="me-2" />
                  {user?.name}
                </Navbar.Text>
                
                <NavDropdown
                  title={
                    <span className="text-white d-inline-flex align-items-center">
                      <FaUser className="me-1" />
                      Account
                    </span>
                  }
                  id="basic-nav-dropdown"
                  align="end"
                  className="d-lg-none"
                  menuVariant="dark"
                >
                  <NavDropdown.ItemText className="text-light">
                    <FaUser className="me-2" />
                    {user?.name}
                  </NavDropdown.ItemText>
                  <NavDropdown.Divider />
                  <NavDropdown.Item as={Link} to="/profile" className="text-light">
                    <i className="fas fa-user-cog me-2"></i>
                    Profile
                  </NavDropdown.Item>
                  <NavDropdown.Item onClick={handleLogout} className="text-light">
                    <FaSignOutAlt className="me-2" />
                    Logout
                  </NavDropdown.Item>
                </NavDropdown>
                
                <Button 
                  variant="outline-danger" 
                  onClick={handleLogout}
                  className="d-none d-lg-flex align-items-center ms-2"
                >
                  <FaSignOutAlt className="me-1" />
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Nav.Link as={Link} to="/login" className="text-white me-3">
                  <FaSignInAlt className="me-1" />
                  Login
                </Nav.Link>
                <Nav.Link as={Link} to="/register" className="text-white">
                  <FaUserPlus className="me-1" />
                  Register
                </Nav.Link>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default Navigation;