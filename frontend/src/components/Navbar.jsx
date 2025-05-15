import { Navbar, Container, Nav, NavDropdown, Button } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import {
  FaShoppingCart, FaUser, FaSignInAlt, FaUserPlus, FaSignOutAlt, FaSearch, FaStore,
  FaHome,
  FaBox,
  FaShopify,
  FaChartLine,
} from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import React, { useMemo, useState } from 'react';
import CartIcon from './CartIcon';
// import { useCart } from '../context/CartContext';

function Navigation() {
  const { isAuthenticated, user, logout } = useAuth();
  console.log('User:', user);
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  const handleLogout = async () => {
    const { isConfirmed } = await Swal.fire({
      title: 'Logout Confirmation',
      text: 'Are you sure you want to logout?',
      icon: 'question',
      background: '#0f172a',
      color: '#f8fafc',
      showCancelButton: true,
      confirmButtonColor: '#d4a017',
      cancelButtonColor: '#475569',
      confirmButtonText: 'Yes, logout',
      cancelButtonText: 'Cancel',
      customClass: {
        popup: 'shadow-lg border border-gray-700'
      }
    });

    if (isConfirmed) {
      logout();
      await Swal.fire({
        title: 'Logged Out',
        text: 'You have been successfully logged out',
        icon: 'success',
        background: '#0f172a',
        color: '#f8fafc',
        timer: 2000,
        showConfirmButton: false,
        customClass: {
          popup: 'shadow-lg border border-gray-700'
        }
      });
      navigate('/');
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
      setSearchQuery('');
    }
  };
  const userMenuItems = useMemo(() => {
    const baseItems = [
      { path: "/profile", label: "Profile", icon: <FaUser className="me-2" size={16} /> },
      { path: "/orders", label: "My Orders", icon: <FaShoppingCart className="me-2" size={16} /> },
      {path: "/new-vendor", label: "Become a Vendor", icon: <FaStore className="me-2" size={16} />},
    ];

    // Add vendor option if not already a vendor
    // if (user?.user_type !== "shop_owner") {
    //   baseItems.push({
    //     path: "/new-vendor",
    //     label: "Become a Vendor",
    //     icon: <FaStore className="me-2" size={16} />
    //   });
    // }

    
    baseItems.push({
      action: handleLogout,
      label: "Logout",
      icon: <FaSignOutAlt className="me-2" size={16} />
    });

    return baseItems;
  }, [user?.role]);

  const navBarLinks = useMemo(() => [
    { path: "/", label: "Home", icon: <FaHome className="me-2" size={16} /> },
    { path: "/products", label: "Products", icon: <FaBox className="me-2" size={16} /> },
    { path: "/list-stores", label: "Vendors", icon: <FaShopify className="me-2" size={16} /> },
    { path: "/dashboard", label: "Dashboard", icon: <FaChartLine className="me-2" size={16} /> }
  ], []);

  const filteredNavBarLinks = useMemo(() => {
    return navBarLinks.filter(link => {
      // Always show if not dashboard
      if (link.path !== "/dashboard") return true;

      // Only show dashboard for authenticated vendors
      return isAuthenticated && user?.is_vendor === true;
    });
  }, [isAuthenticated, user?.user_type, navBarLinks]);


  return (
    <Navbar
      bg="dark"
      variant="dark"
      expand="lg"
      className="bg-gradient shadow-lg sticky-top py-2 px-3 border-b border-gray-700"
      aria-label="Main navigation"
    >
      <Container fluid>
        <Navbar.Brand as={Link} to="/" className="fw-bold text-white me-4 hover:scale-105 transition-transform duration-200">
          <div className="relative">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary 
            via-secondary to-accent flex items-center justify-center shadow-glow transition-shadow 
            duration-300 group-hover:shadow-glow-lg"
              style={{ color: '#d4a017' }}
            >
              <i className="fas fa-bolt text-2xl"></i>
              <span className='mx-1'>VendorHub</span>
            </div>

          </div>
        </Navbar.Brand>

        <div className="d-flex align-items-center order-lg-2 ms-auto">
          {isAuthenticated && (
            <CartIcon />
          )}

          <Navbar.Toggle
            aria-controls="basic-navbar-nav"
            className="border-0 px-2"
            aria-label="Toggle navigation"
          >
            <div className="navbar-toggler-animation">
              <span className="toggler-icon bg-white"></span>
              <span className="toggler-icon bg-white"></span>
              <span className="toggler-icon bg-white"></span>
            </div>
          </Navbar.Toggle>
        </div>

        <Navbar.Collapse
          id="basic-navbar-nav"
          className="justify-content-between mt-3 mt-lg-0"
        >
          <form onSubmit={handleSearch} className="d-flex my-2 my-lg-0 me-lg-3 flex-grow-1 flex-lg-grow-0">
            <div className="input-group">
              <input
                type="text"
                className="form-control bg-gray-800 border-gray-700 text-white focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                placeholder="Search products..."
                aria-label="Search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button
                className="btn btn-yellow-600 text-white"
                type="submit"
                aria-label="Search"
              >
                <FaSearch />
              </button>
            </div>
          </form>

          <Nav className="align-items-lg-center">
            {filteredNavBarLinks.map((link, index) => (
              <Nav.Link
                key={index}
                as={Link}
                to={link.path}
                className="text-white me-3 d-flex align-items-center"
                aria-label={link.label}
              >
                {React.cloneElement(link.icon, { className: "me-2" })}
                <span className="d-none d-lg-inline">{link.label}</span>
              </Nav.Link>
            ))}
            {isAuthenticated ? (
              <>
                <NavDropdown
                  title={
                    <div className="d-flex align-items-center gap-2 mx-4 px-2">
                      <div className="avatar-sm bg-yellow-600 text-white rounded-circle d-flex align-items-center justify-content-center flex-shrink-0 mr-2">
                        {user?.name?.charAt(0).toUpperCase() || <FaUser size={14} />}
                      </div>
                      <div className="d-flex align-items-center">
                        <span className="d-none d-lg-inline text-white mr-1">{user?.name}</span>
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          className="text-gray-300 transition-transform duration-200"
                        >
                          <path d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </div>
                  }
                  id="account-dropdown"
                  align="end"
                  className="ms-2"
                  aria-label="Account menu"
                  menuVariant="dark"
                >
                  <div className="px-4 py-3 border-b border-gray-700">
                    <div className="d-flex align-items-center gap-3">
                      <div className="avatar-md bg-yellow-600 text-white rounded-circle d-flex align-items-center justify-content-center flex-shrink-0">
                        {user?.name?.charAt(0).toUpperCase() || <FaUser size={16} />}
                      </div>
                      <div>
                        <div className="fw-bold text-white">{user?.name}</div>
                        <div className="small text-white">{user?.email}</div>
                      </div>
                    </div>
                  </div>

                  <div className="py-1">
                    {userMenuItems.map((item, index) => (
                      <NavDropdown.Item
                        key={index}
                        as={item.path ? Link : 'div'}
                        to={item.path}
                        onClick={item.action}
                        className="d-flex align-items-center gap-3 px-4 py-2 text-white hover:bg-gray-800"
                      >
                        <span className="w-5 flex justify-center">
                          {React.cloneElement(item.icon, { className: "text-gray-400" })}
                        </span>
                        <span>{item.label}</span>
                      </NavDropdown.Item>
                    ))}
                  </div>
                </NavDropdown>

                <style>{`
                  #account-dropdown.dropdown-toggle::after {
                    display: none !important;
                  }
                  .dropdown.show #account-dropdown svg {
                    transform: rotate(180deg);
                    transition: transform 0.3s ease;

                  }
                  .dropdown #account-dropdown svg {
                    transform: rotate(0deg);
                    transition: transform 0.3s ease;
                    margin-left: 0.5rem;
                    display: block;
                  }
                `}</style>
              </>
            ) : (
              <div className="d-flex flex-column flex-lg-row">
                <Button
                  as={Link}
                  to="/login"
                  variant="outline-light"
                  className="me-lg-2 mb-2 mb-lg-0 d-flex align-items-center justify-content-center rounded-pill px-4"
                  aria-label="Login"
                >
                  <FaSignInAlt className="me-2" size={16} aria-hidden="true" />
                  Login
                </Button>
                <Button
                  as={Link}
                  to="/register"
                  variant="yellow-600"
                  className="bg-yellow-600 border-0 d-flex align-items-center justify-content-center rounded-pill px-4 hover:bg-yellow-700"
                  aria-label="Register"
                >
                  <FaUserPlus className="me-2" size={16} aria-hidden="true" />
                  Register
                </Button>
              </div>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>

      <style>{`
        
        .avatar-sm {
          width: 32px;
          height: 32px;
          font-size: 14px;
        }
        .avatar-md {
          width: 48px;
          height: 48px;
          font-size: 18px;
        }
        .navbar-toggler-animation {
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          height: 21px;
          width: 25px;
        }
        .toggler-icon {
          display: block;
          height: 3px;
          width: 100%;
          border-radius: 1px;
          transition: all 0.3s ease;
        }
        .navbar-toggler[aria-expanded="true"] .toggler-icon:nth-child(1) {
          transform: translateY(8px) rotate(45deg);
        }
        .navbar-toggler[aria-expanded="true"] .toggler-icon:nth-child(2) {
          opacity: 0;
        }
        .navbar-toggler[aria-expanded="true"] .toggler-icon:nth-child(3) {
          transform: translateY(-10px) rotate(-45deg);
        }
        .border-b {
          border-bottom: 1px solid;
        }
        .hover\:bg-gray-800:hover {
          background-color: #1e293b;
        }
      `}</style>
    </Navbar>
  );
}

export default Navigation;