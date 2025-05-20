import React, { useState, useEffect } from 'react';
import { Nav, Button, Offcanvas, Modal, Table, Badge } from 'react-bootstrap';
import { motion, AnimatePresence } from 'framer-motion';
import Swal from 'sweetalert2';
import { 
  FaStore, 
  FaTachometerAlt, 
  FaBoxes, 
  FaClipboardList,
  FaSignOutAlt,
  FaChevronLeft, 
  FaChevronRight,
  FaBars
} from 'react-icons/fa';
import { FiImage } from 'react-icons/fi';

const DashboardSidebar = ({ products, orders }) => {
  const [collapsed, setCollapsed] = useState(false);
  const [activeLink, setActiveLink] = useState('dashboard');
  const [showMobileSidebar, setShowMobileSidebar] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [showProductsModal, setShowProductsModal] = useState(false);
  const [showOrdersModal, setShowOrdersModal] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth < 768) {
        setCollapsed(true);
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleLinkClick = (link) => {
    setActiveLink(link);
    if (isMobile) {
      setShowMobileSidebar(false);
    }
  };

  const handleLogout = () => {
    Swal.fire({
      title: 'Logout?',
      text: 'Are you sure you want to logout?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, logout!'
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire(
          'Logged Out!',
          'You have been successfully logged out.',
          'success'
        );
      }
    });
  };

  const sidebarVariants = {
    collapsed: { width: 80 },
    expanded: { width: 250 }
  };

  const linkVariants = {
    hover: { scale: 1.05, originX: 0 },
    tap: { scale: 0.98 }
  };

const navItems = [
  { path: '/dashboard/store-profile', name: 'Store Profile', icon: <FaStore />, key: 'store' },
  { path: '/dashboard', name: 'Dashboard', icon: <FaTachometerAlt />, key: 'dashboard' },
  {
    path: '#',
    name: 'Products',
    icon: <FaBoxes />,
    key: 'products',
    onClick: () => setShowProductsModal(true)
  },
  {
    path: '#',
    name: 'Orders',
    icon: <FaClipboardList />,
    key: 'orders',
    onClick: () => setShowOrdersModal(true)
  }
];




  const MobileToggleButton = () => (
    <Button 
      variant="outline-warning" 
      className="d-md-none position-fixed top-2 start-2 z-3"
      onClick={() => setShowMobileSidebar(true)}
    >
      <FaBars />
    </Button>
  );

  const DesktopSidebar = () => (
    <motion.div
      className="d-none d-md-flex flex-column bg-dark text-white vh-100 p-3 sticky-top"
      initial={false}
      animate={collapsed ? "collapsed" : "expanded"}
      variants={sidebarVariants}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      <div className="d-flex justify-content-between align-items-center mb-4">
        {!collapsed && (
          <motion.h3 
            className="text-warning mb-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            Admin Panel
          </motion.h3>
        )}
        <Button 
          variant="outline-warning" 
          size="sm" 
          onClick={() => setCollapsed(!collapsed)}
          className="p-1"
        >
          {collapsed ? <FaChevronRight /> : <FaChevronLeft />}
        </Button>
      </div>

      <Nav className="flex-column flex-grow-1">
        {navItems.map((item) => (
          <motion.div
            key={item.key}
            variants={linkVariants}
            whileHover="hover"
            whileTap="tap"
          >
            <Nav.Link
              href={item.path}
              className={`d-flex align-items-center mb-3 rounded ${activeLink === item.key ? 'bg-warning text-dark' : 'text-white'}`}
              onClick={() => {
                handleLinkClick(item.key);
                if (item.onClick) item.onClick();
              }}
            >
              <span className="me-3" style={{ minWidth: '24px' }}>
                {item.icon}
              </span>
              {!collapsed && (
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  {item.name}
                </motion.span>
              )}
            </Nav.Link>
          </motion.div>
        ))}
      </Nav>


    </motion.div>
  );

  const MobileSidebar = () => (
    <Offcanvas
      show={showMobileSidebar}
      onHide={() => setShowMobileSidebar(false)}
      placement="start"
      className="bg-dark text-white"
    >
      <Offcanvas.Header closeButton closeVariant="white">
        <Offcanvas.Title className="text-warning">Admin Panel</Offcanvas.Title>
      </Offcanvas.Header>
      <Offcanvas.Body>
        <Nav className="flex-column">
          {navItems.map((item) => (
            <motion.div
              key={item.key}
              variants={linkVariants}
              whileHover="hover"
              whileTap="tap"
            >
              <Nav.Link
                href={item.path}
                className={`d-flex align-items-center mb-3 rounded ${activeLink === item.key ? 'bg-warning text-dark' : 'text-white'}`}
                onClick={() => {
                  handleLinkClick(item.key);
                  if (item.onClick) item.onClick();
                }}
              >
                <span className="me-3">
                  {item.icon}
                </span>
                <span>{item.name}</span>
              </Nav.Link>
            </motion.div>
          ))}
        </Nav>

       
      </Offcanvas.Body>
    </Offcanvas>
  );

  const ProductsModal = () => (
    <Modal 
      show={showProductsModal} 
      onHide={() => setShowProductsModal(false)}
      size="lg"
      centered
      scrollable
    >
      <Modal.Header closeButton className="bg-dark text-white">
        <Modal.Title>Products Overview</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {products && products.length > 0 ? (
          <Table striped bordered hover responsive>
            <thead className="table-dark">
              <tr>
                <th>Name</th>
                <th>Description</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Category</th>
                <th>Image</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id}>
                  <td><strong>{product.name}</strong></td>
                  <td>{product.description || '-'}</td>
                  <td>
                    <Badge bg="success">
                      ${parseFloat(product.price).toFixed(2)}
                    </Badge>
                  </td>
                  <td>
                    <Badge bg={product.stock > 0 ? 'info' : 'danger'}>
                      {product.stock} in stock
                    </Badge>
                  </td>
                  <td>
                    <Badge bg="secondary">
                      {product.category}
                    </Badge>
                  </td>
                  <td className="text-center">
                    {product.image ? (
                      <img
                        src={product.image}
                        alt={product.name}
                        style={{
                          width: '50px',
                          height: '50px',
                          objectFit: 'cover',
                          borderRadius: '4px'
                        }}
                      />
                    ) : (
                      <FiImage size={24} className="text-muted" />
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        ) : (
          <div className="text-center py-4">
            <p className="text-muted">No products available</p>
          </div>
        )}
      </Modal.Body>
      <Modal.Footer className="bg-light">
        <Button 
          variant="secondary" 
          onClick={() => setShowProductsModal(false)}
        >
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );



 return (
  <>
    <MobileToggleButton />
    <DesktopSidebar />
    <MobileSidebar />
    <ProductsModal />
    {orders && <Modal 
      show={showOrdersModal} 
      onHide={() => setShowOrdersModal(false)}
      size="lg"
      centered
      scrollable
    >
      <Modal.Header closeButton className="bg-dark text-white">
        <Modal.Title>Orders Overview</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {orders.length > 0 ? (
          <Table striped bordered hover responsive>
            <thead className="table-dark">
              <tr>
                <th>Customer</th>
                <th>Date</th>
                <th>Status</th>
                <th>Total</th>
                <th>Address</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id}>
                  <td><strong>{order.customerName}</strong></td>
                  <td>{new Date(order.orderDate).toLocaleDateString()}</td>
                  <td><Badge bg="info">{order.status}</Badge></td>
                  <td><Badge bg="success">${parseFloat(order.total).toFixed(2)}</Badge></td>
                  <td><small className="text-muted">{order.shippingAddress}</small></td>
                </tr>
              ))}
            </tbody>
          </Table>
        ) : (
          <div className="text-center py-4">
            <p className="text-muted">No orders available</p>
          </div>
        )}
      </Modal.Body>
      <Modal.Footer className="bg-light">
        <Button variant="secondary" onClick={() => setShowOrdersModal(false)}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>}
  </>
);

};

export default DashboardSidebar;